import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import json
import os
from typing import Dict, Tuple, List

class SignLanguageRecognizer:
    def __init__(self):
        # Initialize MediaPipe hands
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            max_num_hands=2,
            min_detection_confidence=0.8,
            min_tracking_confidence=0.7,
            model_complexity=1
        )
        self.mp_draw = mp.solutions.drawing_utils
        
        # Initialize gesture history for smoother predictions
        self.gesture_history = []
        self.history_length = 5
        
        # Load gesture mappings and models
        self.load_gesture_mappings()
        self.initialize_models()

    def load_gesture_mappings(self):
        self.coding_commands = {
            'PALM_OPEN': {
                'javascript': {
                    'code': 'function newFunction() {\n    \n}',
                    'description': 'Create new function'
                },
                'python': {
                    'code': 'def new_function():\n    pass',
                    'description': 'Create new function'
                }
            },
            'FIST': {
                'javascript': {
                    'code': 'for (let i = 0; i < n; i++) {\n    \n}',
                    'description': 'Create for loop'
                },
                'python': {
                    'code': 'for i in range(n):\n    pass',
                    'description': 'Create for loop'
                }
            },
            'THUMBS_UP': {
                'javascript': {
                    'code': 'if (condition) {\n    \n}',
                    'description': 'Create if statement'
                },
                'python': {
                    'code': 'if condition:\n    pass',
                    'description': 'Create if statement'
                }
            },
            'PEACE': {
                'javascript': {
                    'code': 'console.log();',
                    'description': 'Print to console'
                },
                'python': {
                    'code': 'print()',
                    'description': 'Print statement'
                }
            }
        }

    def initialize_models(self):
        try:
            # Load main gesture recognition model
            model_path = os.path.join(os.path.dirname(__file__), '../models/gesture_model.h5')
            self.gesture_model = load_model(model_path)
            
            # Load hand landmark detection model
            self.landmark_model = tf.saved_model.load(
                os.path.join(os.path.dirname(__file__), '../models/landmark_model')
            )
        except Exception as e:
            print(f"Error loading models: {e}")
            self.gesture_model = None
            self.landmark_model = None

    def preprocess_landmarks(self, frame: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(frame_rgb)
        
        landmarks = []
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Extract normalized landmarks
                hand_points = []
                for landmark in hand_landmarks.landmark:
                    hand_points.extend([landmark.x, landmark.y, landmark.z])
                landmarks.append(hand_points)
                
                # Draw enhanced visualization
                self._draw_enhanced_landmarks(frame, hand_landmarks)
        
        return np.array(landmarks), frame

    def _draw_enhanced_landmarks(self, frame: np.ndarray, landmarks) -> None:
        # Draw skeleton
        self.mp_draw.draw_landmarks(
            frame, landmarks, self.mp_hands.HAND_CONNECTIONS,
            self.mp_draw.DrawingSpec(color=(147, 51, 234), thickness=2, circle_radius=2),
            self.mp_draw.DrawingSpec(color=(147, 51, 234), thickness=2)
        )
        
        # Add gesture confidence visualization
        height, width = frame.shape[:2]
        cv2.putText(
            frame,
            f"Confidence: {self.current_confidence:.2f}",
            (int(width * 0.02), int(height * 0.98)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (147, 51, 234),
            2
        )

    def predict_gesture(self, landmarks: np.ndarray, language: str = 'javascript') -> Dict:
        if len(landmarks) == 0:
            return {'name': None, 'confidence': 0, 'command': None}

        try:
            # Get model prediction
            prediction = self.gesture_model.predict(landmarks.reshape(1, -1))
            gesture_idx = np.argmax(prediction)
            confidence = float(prediction[0][gesture_idx])
            
            # Get gesture name and command
            gesture_name = list(self.coding_commands.keys())[gesture_idx]
            command = self.coding_commands[gesture_name][language]['code']
            description = self.coding_commands[gesture_name][language]['description']
            
            # Update gesture history for smoothing
            self.gesture_history.append({
                'name': gesture_name,
                'confidence': confidence,
                'command': command,
                'description': description
            })
            if len(self.gesture_history) > self.history_length:
                self.gesture_history.pop(0)
            
            # Return smoothed prediction
            return self._get_smoothed_prediction()
            
        except Exception as e:
            print(f"Prediction error: {e}")
            return {'name': None, 'confidence': 0, 'command': None}

    def _get_smoothed_prediction(self) -> Dict:
        if not self.gesture_history:
            return {'name': None, 'confidence': 0, 'command': None}
        
        # Get most frequent gesture in history
        gestures = [g['name'] for g in self.gesture_history]
        most_common = max(set(gestures), key=gestures.count)
        
        # Get average confidence for this gesture
        relevant_predictions = [
            g for g in self.gesture_history if g['name'] == most_common
        ]
        avg_confidence = sum(g['confidence'] for g in relevant_predictions) / len(relevant_predictions)
        
        return {
            'name': most_common,
            'confidence': avg_confidence,
            'command': relevant_predictions[-1]['command'],
            'description': relevant_predictions[-1]['description']
        }

    def process_frame(self, frame: np.ndarray, language: str = 'javascript') -> Dict:
        landmarks, annotated_frame = self.preprocess_landmarks(frame)
        prediction = self.predict_gesture(landmarks, language)
        
        return {
            'command': prediction['command'],
            'confidence': prediction['confidence'],
            'gesture_name': prediction['name'],
            'description': prediction.get('description', ''),
            'frame': annotated_frame
        } 