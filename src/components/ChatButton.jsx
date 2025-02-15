import { motion } from 'framer-motion';
import { useChat } from '../contexts/ChatContext';
import { FaComments } from 'react-icons/fa';

function ChatButton() {
  const { isOpen, setIsOpen } = useChat();

  return (
    <motion.button
      onClick={() => setIsOpen(!isOpen)}
      className="fixed bottom-8 right-8 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaComments className="text-2xl" />
    </motion.button>
  );
}

export default ChatButton; 