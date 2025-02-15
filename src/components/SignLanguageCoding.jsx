import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import Editor from '@monaco-editor/react';
import { FaMicrophone } from 'react-icons/fa';
import { HiCode } from 'react-icons/hi';
import { VscFiles, VscSourceControl, VscExtensions, VscAccount, VscSettingsGear, VscTerminalCmd } from 'react-icons/vsc';
import { BiGitBranch } from 'react-icons/bi';

// Lazy load TensorFlow to improve initial load time
const loadTensorFlow = async () => {
  const tf = await import('@tensorflow/tfjs');
  await import('@tensorflow/tfjs-backend-webgl');
  const handpose = await import('@tensorflow-models/handpose');
  await tf.ready();
  return { tf, handpose };
};

// Add voice recognition setup
const setupVoiceRecognition = () => {
  if ('webkitSpeechRecognition' in window) {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    return recognition;
  }
  return null;
};

function SignLanguageCoding() {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedCode, setRecognizedCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [model, setModel] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [detectedGesture, setDetectedGesture] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [error, setError] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [voiceRecognition, setVoiceRecognition] = useState(null);
  const [activeTab, setActiveTab] = useState('code');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [gestureHistory, setGestureHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);

  // Initialize TensorFlow and load models
  useEffect(() => {
    let isSubscribed = true;

    const initializeAI = async () => {
      try {
        setIsLoading(true);
        setFeedback('Loading AI models...');

        // Load TensorFlow and handpose model
        const { handpose } = await loadTensorFlow();
        const model = await handpose.load({
          maxContinuousChecks: 1,
          detectionConfidence: 0.8,
          iouThreshold: 0.3,
          scoreThreshold: 0.75,
        });

        if (isSubscribed) {
          setModel(model);
          setIsLoading(false);
          setFeedback('AI models loaded successfully! Click Start Recognition to begin.');
        }
      } catch (err) {
        console.error('Error initializing AI:', err);
        if (isSubscribed) {
          setError('Failed to load AI models. Please refresh the page and try again.');
          setIsLoading(false);
        }
      }
    };

    initializeAI();

    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    const recognition = setupVoiceRecognition();
    setVoiceRecognition(recognition);
    
    if (recognition) {
      recognition.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        processVoiceCommand(command);
      };
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  // Webcam setup configuration
  const webcamConfig = {
    width: 640,
    height: 480,
    facingMode: "user",
    mirrored: true
  };

  // Start hand detection
  const startDetection = async () => {
    if (!model || !webcamRef.current) return;

    try {
      const video = webcamRef.current.video;
      const predictions = await model.estimateHands(video);

      if (predictions.length > 0) {
        const landmarks = predictions[0].landmarks;
        processGesture(landmarks);
        drawHand(predictions[0]);
      }

      if (isRecording) {
        requestAnimationFrame(startDetection);
      }
    } catch (err) {
      console.error('Detection error:', err);
      setFeedback('Error during hand detection');
    }
  };

  // Process detected gesture
  const processGesture = (landmarks) => {
    // Implement gesture recognition logic here
    // This is a simplified example
    const gesture = recognizeGesture(landmarks);
    if (gesture) {
      setDetectedGesture(gesture.name);
      setConfidence(gesture.confidence);
      if (gesture.confidence > 0.9) {
        addCodeSnippet(gesture.name);
      }
    }
  };

  // Draw hand landmarks on canvas
  const drawHand = (prediction) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw landmarks
    prediction.landmarks.forEach(point => {
      ctx.beginPath();
      ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#9333ea';
      ctx.fill();
    });
    
    // Draw connections
    prediction.annotations.forEach(points => {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      points.forEach((point) => {
        ctx.lineTo(point[0], point[1]);
      });
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  // Start recording
  const startRecording = async () => {
    try {
      setIsRecording(true);
      setFeedback('Recognition started - Show your hand gestures');
      startDetection();
    } catch (err) {
      console.error('Start recording error:', err);
      setFeedback('Error starting recognition');
      setIsRecording(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    setFeedback('Recognition stopped');
  };

  // Coding gestures mapping
  const gestureCommands = {
    'thumbs_up': {
      command: 'function',
      template: 'function name() {\n  \n}',
      description: 'Create a new function'
    },
    'victory': {
      command: 'if',
      template: 'if (condition) {\n  \n}',
      description: 'Add an if statement'
    },
    'point': {
      command: 'console',
      template: 'console.log();',
      description: 'Print to console'
    },
    'open_palm': {
      command: 'loop',
      template: 'for (let i = 0; i < n; i++) {\n  \n}',
      description: 'Create a for loop'
    },
    'closed_fist': {
      command: 'return',
      template: 'return;',
      description: 'Return statement'
    }
  };

  // Tutorial steps
  const tutorialSteps = [
    {
      title: 'Welcome to Sign Language Coding!',
      content: 'This interface allows you to write code using sign language gestures. The system uses advanced AI to recognize your hand gestures and convert them into code.',
      image: '/tutorial/welcome.gif'
    },
    {
      title: 'Supported Gestures',
      content: 'Learn the basic gestures for coding:',
      gestures: Object.entries(gestureCommands).map(([key, value]) => ({
        name: key,
        description: value.description,
        image: `/tutorial/${key}.gif`
      }))
    },
    {
      title: 'Getting Started',
      content: 'Position your hand in the camera view. Make sure you have good lighting and a clear background. The system will track your hand movements in real-time.',
      image: '/tutorial/position.gif'
    }
  ];

  const processVoiceCommand = (command) => {
    // Add voice command processing logic
    const commands = {
      'new function': 'function newFunction() {\n  \n}',
      'new loop': 'for (let i = 0; i < n; i++) {\n  \n}',
      'print': 'console.log();',
      'if statement': 'if (condition) {\n  \n}',
      'clear': () => setRecognizedCode(''),
      'dark theme': () => setEditorTheme('vs-dark'),
      'light theme': () => setEditorTheme('light'),
    };

    for (const [key, value] of Object.entries(commands)) {
      if (command.includes(key)) {
        if (typeof value === 'function') {
          value();
        } else {
          setRecognizedCode(prev => prev + '\n' + value);
        }
        break;
      }
    }
  };

  // Add this function to handle WebSocket connection
  const connectWebSocket = () => {
    wsRef.current = new WebSocket('ws://localhost:8000/ws/sign-language');
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
      setFeedback('Connected to recognition service');
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      setFeedback('Disconnected from recognition service');
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setFeedback('Error connecting to recognition service');
    };
  };

  // Update the sendFrame function
  const sendFrame = async () => {
    if (!wsRef.current || !webcamRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = webcamConfig.width;
    canvas.height = webcamConfig.height;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(webcamRef.current.video, 0, 0);
    const frame = canvas.toDataURL('image/jpeg');

    wsRef.current.send(JSON.stringify({
      frame,
      language: selectedLanguage
    }));
  };

  // Add gesture history display
  const GestureHistory = () => (
    <div className="absolute top-4 right-4 bg-black/50 text-white p-4 rounded-lg max-w-xs">
      <h3 className="font-bold mb-2">Recent Gestures</h3>
      <div className="space-y-2">
        {gestureHistory.slice(-5).map((gesture, index) => (
          <div key={index} className="flex items-center justify-between">
            <span>{gesture.name}</span>
            <span>{(gesture.confidence * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e]">
      {/* VS Code-like Header */}
      <div className="h-12 bg-[#323233] flex items-center justify-between px-4 text-gray-300">
        <div className="flex items-center gap-4">
          <HiCode className="text-2xl text-purple-500" />
          <span>EnableFreelance IDE</span>
          <div className="flex items-center text-sm">
            <BiGitBranch className="mr-2" />
            <span>main</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-[#3c3c3c] text-white px-3 py-1 rounded border border-[#3c3c3c]"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded ${
              voiceEnabled ? 'bg-purple-600' : 'bg-[#3c3c3c]'
            }`}
          >
            <FaMicrophone />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* VS Code-like Sidebar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-4 text-gray-400">
          <button
            className={`p-3 hover:text-white ${activeTab === 'files' ? 'text-white bg-[#424242]' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            <VscFiles className="text-xl" />
          </button>
          <button
            className={`p-3 hover:text-white ${activeTab === 'git' ? 'text-white bg-[#424242]' : ''}`}
            onClick={() => setActiveTab('git')}
          >
            <VscSourceControl className="text-xl" />
          </button>
          <button
            className={`p-3 hover:text-white ${activeTab === 'extensions' ? 'text-white bg-[#424242]' : ''}`}
            onClick={() => setActiveTab('extensions')}
          >
            <VscExtensions className="text-xl" />
          </button>
          <div className="flex-1" />
          <button
            className="p-3 hover:text-white"
            onClick={() => setActiveTab('settings')}
          >
            <VscSettingsGear className="text-xl" />
          </button>
          <button
            className="p-3 hover:text-white"
            onClick={() => setActiveTab('account')}
          >
            <VscAccount className="text-xl" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Editor Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 grid grid-cols-2 gap-4 p-4">
              {/* Camera Panel */}
              <div className="bg-[#1e1e1e] rounded-lg overflow-hidden">
                <div className="bg-[#252526] px-4 py-2 text-gray-300">
                  Camera Input
                </div>
                <div className="relative">
                  <Webcam
                    ref={webcamRef}
                    className="w-full"
                    videoConstraints={webcamConfig}
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    width={640}
                    height={480}
                  />
                  {detectedGesture && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span>Gesture: {detectedGesture}</span>
                        <span>{(confidence * 100).toFixed(1)}% confident</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Code Editor Panel */}
              <div className="bg-[#1e1e1e] rounded-lg overflow-hidden">
                <div className="bg-[#252526] px-4 py-2 text-gray-300">
                  Code Editor
                </div>
                <Editor
                  height="calc(100% - 40px)"
                  defaultLanguage={selectedLanguage}
                  value={recognizedCode}
                  theme="vs-dark"
                  onChange={(value) => setRecognizedCode(value)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 10 },
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </div>

            {/* Terminal */}
            <div className="h-48 bg-[#1e1e1e] border-t border-[#424242]">
              <div className="bg-[#252526] px-4 py-2 text-gray-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <VscTerminalCmd />
                  <span>Terminal</span>
                </div>
                <button onClick={() => setTerminalOpen(!terminalOpen)}>
                  {terminalOpen ? '−' : '+'}
                </button>
              </div>
              {terminalOpen && (
                <div className="p-4 text-gray-300 font-mono text-sm">
                  <div>$ Gesture recognition active</div>
                  <div className="text-green-500">
                    {'>>'} Ready to process hand gestures...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignLanguageCoding; 