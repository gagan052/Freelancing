import { useEffect } from 'react';

function GestureNotification({ gesture, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000); // Auto dismiss after 3 seconds
    return () => clearTimeout(timer);
  }, [gesture, onDismiss]);

  if (!gesture) return null;

  return (
    <div className="fixed top-4 right-4 bg-purple-600 text-white p-4 rounded-lg shadow-lg animate-fade-in z-50 max-w-md">
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="font-bold">{gesture.name}</h3>
          <p className="text-sm opacity-90">Confidence: {Math.round(gesture.confidence * 100)}%</p>
          <code className="block mt-2 bg-purple-700 p-2 rounded text-sm">
            {gesture.command}
          </code>
        </div>
        <button 
          onClick={onDismiss}
          className="ml-4 text-purple-200 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default GestureNotification; 