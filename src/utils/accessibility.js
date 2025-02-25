export const focusStyles = {
  outline: 'none',
  boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.5)',
};

export function handleKeyboardSubmit(event, callback) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
}

export function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export const setupAccessibility = () => {
  // Keyboard shortcuts
  const shortcuts = {
    'ctrl+shift+r': toggleRecording,
    'ctrl+shift+s': stopRecording,
    'ctrl+shift+c': clearEditor,
    'ctrl+shift+h': toggleHistory,
  };

  // Voice commands
  const voiceCommands = {
    'start recording': toggleRecording,
    'stop recording': stopRecording,
    'clear editor': clearEditor,
    'show history': toggleHistory,
  };

  // Screen reader announcements
  const announceGesture = (gesture) => {
    const announcement = `Detected ${gesture.name} with ${Math.round(gesture.confidence * 100)}% confidence`;
    const utterance = new SpeechSynthesisUtterance(announcement);
    window.speechSynthesis.speak(utterance);
  };

  return {
    shortcuts,
    voiceCommands,
    announceGesture,
  };
};

// Gesture feedback
export const provideGestureFeedback = (gesture) => {
  // Visual feedback
  const feedback = document.createElement('div');
  feedback.className = 'gesture-feedback';
  feedback.textContent = gesture.name;
  document.body.appendChild(feedback);
  
  // Haptic feedback (if available)
  if ('vibrate' in navigator) {
    navigator.vibrate(200);
  }
  
  // Audio feedback
  const audio = new Audio('/sounds/gesture-detected.mp3');
  audio.play();
  
  // Remove feedback after animation
  setTimeout(() => feedback.remove(), 1000);
}; 