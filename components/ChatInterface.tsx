import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage } from '../types';
import { mockService } from '../services/mockService';
import PixelButton from './PixelButton';

interface ChatInterfaceProps {
  eventId: string;
  currentUser: User;
  onClose?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ eventId, currentUser, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const msgs = await mockService.getChatMessages(eventId);
    setMessages([...msgs]);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // Poll for updates
    return () => clearInterval(interval);
  }, [eventId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText,
      timestamp: Date.now()
    };

    await mockService.sendMessage(eventId, newMessage);
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-black border-2 border-white">
      <div className="bg-white/10 p-2 border-b-2 border-white flex justify-between items-center">
        <h3 className="text-xl text-white">SQUAD COMM LINK</h3>
        {onClose && <button onClick={onClose} className="text-white hover:text-gray-400">X</button>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const isSystem = msg.isSystem;

          if (isSystem) {
             return (
               <div key={msg.id} className="text-center text-xs text-gray-500 uppercase tracking-widest my-2">
                 --- {msg.text} ---
               </div>
             )
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 border-2 ${isMe ? 'border-white bg-white/20 text-right' : 'border-gray-500 bg-black text-left'}`}>
                <div className={`text-xs mb-1 font-bold ${isMe ? 'text-white' : 'text-gray-400'}`}>
                  {msg.senderName}
                </div>
                <div className="break-words text-sm md:text-base text-white">{msg.text}</div>
                <div className="text-[10px] opacity-50 mt-1 text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-2 border-t-2 border-white flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="TRANSMIT MESSAGE..."
          className="flex-1 bg-black border border-gray-600 p-2 text-white focus:outline-none focus:border-white"
        />
        <PixelButton type="submit" className="px-4 py-2 text-sm">SEND</PixelButton>
      </form>
    </div>
  );
};

export default ChatInterface;