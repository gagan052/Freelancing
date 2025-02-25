import { useChat } from '../contexts/ChatContext';
import { FaComments } from 'react-icons/fa';

function ChatButton() {
  const { isOpen, setIsOpen } = useChat();

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="fixed bottom-8 right-8 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-200 hover:scale-110 active:scale-95"
    >
      <FaComments className="text-2xl" />
    </button>
  );
}

export default ChatButton; 