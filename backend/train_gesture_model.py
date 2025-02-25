import tensorflow as tf
import numpy as np
import cv2
import os
import json
from typing import List, Dict
from pathlib import Path

class GestureModelTrainer:
    def __init__(self, data_dir: str = "data/gestures"):
        self.data_dir = Path(data_dir)
        self.model = self._create_model()
        self.gesture_classes = self._load_gesture_mappings()
        
    def _create_model(self):
        """Create a CNN model for gesture recognition"""
        model = tf.keras.Sequential([
            tf.keras.layers.Conv2D(32, 3, activation='relu', input_shape=(64, 64, 1)),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(64, 3, activation='relu'),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(64, 3, activation='relu'),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.5),
            tf.keras.layers.Dense(len(self.gesture_classes), activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        return model

    def _load_gesture_mappings(self) -> Dict:
        """Load gesture to code mappings"""
        mapping_file = self.data_dir / "gesture_mappings.json"
        if mapping_file.exists():
            with open(mapping_file, 'r') as f:
                return json.load(f)
        return {}

    def collect_training_data(self, gesture_name: str, num_samples: int = 100):
        """Collect training data for a gesture"""
        gesture_dir = self.data_dir / gesture_name
        gesture_dir.mkdir(parents=True, exist_ok=True)
        
        cap = cv2.VideoCapture(0)
        samples_collected = 0
        
        while samples_collected < num_samples:
            ret, frame = cap.read()
            if not ret:
                continue
                
            # Preprocess frame
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            resized = cv2.resize(gray, (64, 64))
            
            # Save frame
            cv2.imwrite(str(gesture_dir / f"{samples_collected}.jpg"), resized)
            samples_collected += 1
            
            # Show progress
            cv2.putText(frame, f"Collecting: {samples_collected}/{num_samples}",
                       (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.imshow('Collecting Gestures', frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
        cap.release()
        cv2.destroyAllWindows()

    def train_model(self, epochs: int = 10):
        """Train the gesture recognition model"""
        # Load and preprocess data
        X = []
        y = []
        
        for gesture_dir in self.data_dir.iterdir():
            if gesture_dir.is_dir():
                gesture_name = gesture_dir.name
                for img_file in gesture_dir.glob("*.jpg"):
                    img = cv2.imread(str(img_file), cv2.IMREAD_GRAYSCALE)
                    X.append(img)
                    y.append(self.gesture_classes[gesture_name])
        
        X = np.array(X) / 255.0
        X = X.reshape(-1, 64, 64, 1)
        y = tf.keras.utils.to_categorical(y)
        
        # Train model
        self.model.fit(X, y, epochs=epochs, validation_split=0.2)
        
        # Save model
        self.model.save(self.data_dir / "gesture_model.h5")

    def add_gesture_mapping(self, gesture_name: str, code_template: str):
        """Add a new gesture-to-code mapping"""
        self.gesture_classes[gesture_name] = len(self.gesture_classes)
        
        # Save mapping
        mapping_file = self.data_dir / "gesture_mappings.json"
        with open(mapping_file, 'w') as f:
            json.dump(self.gesture_classes, f, indent=2) 