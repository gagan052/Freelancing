import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCode } from 'react-icons/hi';
import { VscTerminalCmd } from 'react-icons/vsc';
import { BiGitBranch } from 'react-icons/bi';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabaseClient';
import GestureNotification from './GestureNotification';

function SignLanguageCoding() {
  const { user } = useAuth();
  const [editorContent, setEditorContent] = useState('// Start coding here...');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isConnected, setIsConnected] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState(null);
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGesture, setActiveGesture] = useState(null);
  const [gestureHistory, setGestureHistory] = useState([]);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const webcamRef = useRef(null);
  const wsRef = useRef(null);
  const frameInterval = useRef(null);

  const handleEditorDidMount = (editor) => {
    setEditorInstance(editor);
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition(e.position);
    });
  };

  const insertCodeAtCursor = (code) => {
    if (!editorInstance) return;

    const id = { major: 1, minor: 1 };
    const op = {
      identifier: id,
      range: {
        startLineNumber: cursorPosition.lineNumber,
        startColumn: cursorPosition.column,
        endLineNumber: cursorPosition.lineNumber,
        endColumn: cursorPosition.column
      },
      text: code,
      forceMoveMarkers: true
    };

    editorInstance.executeEdits('gesture-input', [op]);
  };

  const onGestureDetected = async (gesture) => {
    try {
      insertCodeAtCursor(gesture.command);

      const { error } = await supabase
        .from('gesture_history')
        .insert([{
          user_id: user.id,
          gesture_name: gesture.name,
          command: gesture.command,
          confidence: gesture.confidence
        }]);

      if (error) throw error;

      setGestureHistory(prev => [{
        id: Date.now(),
        gesture_name: gesture.name,
        command: gesture.command,
        confidence: gesture.confidence,
        created_at: new Date().toISOString()
      }, ...prev.slice(0, 9)]);

    } catch (error) {
      console.error('Error saving gesture:', error);
    }
  };

  const toggleRecording = () => {
    if (isRecognizing) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  const startRecognition = () => {
    if (!isConnected) {
      addTerminalOutput('Not connected to recognition service', 'error');
      return;
    }

    setIsRecognizing(true);
    wsRef.current.send(JSON.stringify({ type: 'start_recognition' }));
    
    // Start sending frames
    frameInterval.current = setInterval(() => {
      if (webcamRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
        const video = webcamRef.current.video;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        // Get base64 frame
        const frame = canvas.toDataURL('image/jpeg', 0.5);
        
        wsRef.current.send(JSON.stringify({
          frame,
          language: selectedLanguage
        }));
      }
    }, 200); // 5 frames per second

    addTerminalOutput('Sign language recognition started', 'success');
  };

  const stopRecognition = () => {
    setIsRecognizing(false);
    if (frameInterval.current) {
      clearInterval(frameInterval.current);
      frameInterval.current = null;
    }
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'stop_recognition' }));
    }
    addTerminalOutput('Sign language recognition stopped', 'info');
  };

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#333333] border-b border-[#252525]">
        <div className="flex items-center space-x-2">
          <HiCode className="text-2xl text-purple-500" />
          <span className="font-semibold">Sign Language IDE</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsGuideOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Guide
          </button>
          <button
            onClick={toggleRecording}
            className={`px-4 py-2 rounded ${
              isRecognizing ? 'bg-red-600' : 'bg-green-600'
            } transition-colors`}
          >
            {isRecognizing ? 'Stop Recognition' : 'Start Recognition'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Section */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={selectedLanguage}
            value={editorContent}
            onChange={setEditorContent}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true
            }}
          />
        </div>

        {/* Camera and Terminal Section */}
        <div className="w-96 bg-[#1e1e1e] flex flex-col">
          {/* Camera */}
          <div className="h-72 bg-black relative">
            <Webcam
              ref={webcamRef}
              mirrored
              className="w-full h-full object-cover"
            />
            {detectedGesture && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                <p className="text-sm font-semibold">
                  Detected Gesture: {detectedGesture.name}
                </p>
              </div>
            )}
          </div>

          {/* Terminal */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-[#252525] border-y border-[#333333] flex items-center">
              <VscTerminalCmd className="mr-2" />
              <span>Terminal</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
              {terminalOutput.map(output => (
                <div
                  key={output.id}
                  className={`mb-2 ${
                    output.type === 'error' ? 'text-red-400' :
                    output.type === 'success' ? 'text-green-400' :
                    'text-gray-300'
                  }`}
                >
                  <span className="text-gray-500">
                    [{new Date(output.timestamp).toLocaleTimeString()}]
                  </span>{' '}
                  {output.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white text-sm flex items-center px-4">
        <BiGitBranch className="mr-2" />
        <span>main</span>
        <span className="mx-4">
          {user?.email || 'Guest'}
        </span>
        <span className="ml-auto">
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>

      {/* Guide Modal */}
      <AnimatePresence>
        {isGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsGuideOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e1e1e] rounded-xl max-w-2xl w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Sign Language Coding Guide</h2>
              {/* Add guide content here */}
              <button
                onClick={() => setIsGuideOpen(false)}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SignLanguageCoding;