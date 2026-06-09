import React, { useState } from 'react';

export default function AIChat({ className = "" }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Upload a document and ask me questions about it.", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "I am analyzing the document to answer your question. This feature will be fully connected to the backend soon!", 
        sender: "ai" 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <aside className={`bg-white border-l flex flex-col ${className}`}>
      <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h2 className="font-bold text-gray-800">Ask AI</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.map(msg => (
          <div key={msg.id} className={`max-w-[85%] rounded-lg p-3 text-sm ${
            msg.sender === 'user' 
              ? 'bg-blue-600 text-white self-end rounded-br-none' 
              : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'
          }`}>
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="bg-gray-100 text-gray-500 text-xs self-start rounded-lg rounded-bl-none p-3 animate-pulse">
            AI is typing...
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full bg-white border rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 disabled:text-gray-400 p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </aside>
  );
}
