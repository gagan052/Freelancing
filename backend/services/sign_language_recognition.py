import mediapipe as mp
import cv2
import numpy as np
from typing import Dict, Optional

class SignLanguageRecognizer:
    def __init__(self):
        # Initialize MediaPipe
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        
        # Define gesture mappings
        self.gesture_mappings = {
            'LOOP_GESTURE': {
                'name': 'For Loop',
                'command': 'for (let i = 0; i < 10; i++) {\n    // Your code here\n}',
                'description': 'Creates a for loop'
            },
            'IF_GESTURE': {
                'name': 'If Statement',
                'command': 'if (condition) {\n    // Your code here\n}',
                'description': 'Creates an if statement'
            },
            'FUNCTION_GESTURE': {
                'name': 'Function',
                'command': 'function myFunction() {\n    // Your code here\n}',
                'description': 'Creates a function'
            },
            'VARIABLE_GESTURE': {
                'name': 'Variable',
                'command': 'let myVariable = "";',
                'description': 'Declares a variable'
            }
        }
        
        print("SignLanguageRecognizer initialized successfully")

    def process_frame(self, frame: np.ndarray, language: str = 'javascript') -> Dict:
        """Process a video frame and return detected gesture and code."""
        if frame is None:
            return self._create_response('NO_GESTURE', 0.0)

        # Convert BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process the frame
        results = self.hands.process(rgb_frame)
        
        if not results.multi_hand_landmarks:
            return self._create_response('NO_GESTURE', 0.0)

        # Get hand landmarks
        landmarks = results.multi_hand_landmarks[0]
        
        # Detect gesture based on landmarks
        gesture = self._detect_gesture(landmarks)
        
        # Get code template based on language
        code = self._get_code_template(gesture, language)
        
        return self._create_response(gesture, 0.95, code)

    def _detect_gesture(self, landmarks) -> str:
        """Detect gesture from landmarks."""
        # Example gesture detection logic
        # This should be replaced with your actual gesture detection model
        thumb_tip = landmarks.landmark[self.mp_hands.HandLandmark.THUMB_TIP]
        index_tip = landmarks.landmark[self.mp_hands.HandLandmark.INDEX_FINGER_TIP]
        
        # Simple example: if thumb is above index finger, it's a loop gesture
        if thumb_tip.y < index_tip.y:
            return 'LOOP_GESTURE'
        return 'VARIABLE_GESTURE'

    def _get_code_template(self, gesture: str, language: str) -> str:
        """Get code template based on gesture and programming language."""
        if gesture not in self.gesture_mappings:
            return '// No gesture detected'
            
        template = self.gesture_mappings[gesture]['command']
        
        # Convert template to specified language
        if language == 'python':
            template = self._convert_to_python(template)
        
        return template

    def _convert_to_python(self, js_code: str) -> str:
        """Convert JavaScript code template to Python."""
        # Simple conversion examples
        conversions = {
            'for (let i = 0; i < 10; i++)': 'for i in range(10):',
            'if (condition)': 'if condition:',
            'function': 'def',
            'let': '',
            '{': ':',
            '}': '',
            '// ': '# '
        }
        
        result = js_code
        for js, py in conversions.items():
            result = result.replace(js, py)
        
        return result

    def _create_response(self, gesture: str, confidence: float, code: Optional[str] = None) -> Dict:
        """Create standardized response dictionary."""
        if gesture not in self.gesture_mappings:
            return {
                'gesture_name': 'NO_GESTURE',
                'confidence': 0.0,
                'command': '// No gesture detected',
                'description': 'No gesture detected'
            }
            
        return {
            'gesture_name': gesture,
            'confidence': confidence,
            'command': code or self.gesture_mappings[gesture]['command'],
            'description': self.gesture_mappings[gesture]['description']
        }