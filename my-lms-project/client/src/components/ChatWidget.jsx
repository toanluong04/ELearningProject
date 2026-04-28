// src/components/ChatWidget.jsx
import React, { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext.jsx';

const socket = io('http://localhost:5000');

function ChatWidget() {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  // FIX: Safely grab the ID whether it has an underscore or not!
  const userId = user?._id || user?.id;

  useEffect(() => {
    // Make sure we actually have a userId before trying to connect
    if (user && user.role !== 'admin' && userId) {
      socket.emit('join_chat', userId);
      
      // Request permanent history from DB
      socket.emit('fetch_messages', userId);

      socket.on('load_history', (history) => {
        const formatted = history.map(m => ({
          ...m,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setChat(formatted);
      });

      socket.on('receive_message', (data) => {
        setChat((prev) => [...prev, data]);
      });
    }
    return () => {
      socket.off('load_history');
      socket.off('receive_message');
    };
  }, [user, userId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !userId) return;

    const msgData = {
      senderId: userId, 
      senderName: user.username,
      receiverId: 'admin', 
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socket.emit('send_message', msgData);
    setChat((prev) => [...prev, msgData]);
    setMessage('');
  };

  if (!user || user.role === 'admin') return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all flex items-center justify-center"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-[450px] bg-white shadow-2xl rounded-3xl flex flex-col overflow-hidden border border-gray-100">
          <div className="bg-blue-600 p-5 text-white flex justify-between items-center">
            <div>
              <p className="font-black text-sm uppercase tracking-widest">Support Center</p>
              <p className="text-[10px] opacity-80">We usually reply in minutes</p>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium ${
                  msg.senderId === userId 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.text}
                  <p className="text-[9px] mt-1 opacity-50 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="How can we help?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="bg-blue-600 text-white p-2 rounded-xl">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;