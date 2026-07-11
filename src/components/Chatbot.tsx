import React, { useState, useRef, useEffect } from 'react';
import quokkaImg from '../assets/quokka.jpg';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
  role: 'user' | 'bot';
  content: string;
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hi there! I am Quokka, Allan\'s AI assistant. Ask me anything about this table!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [threadId] = useState(() => {
    try {
      return crypto.randomUUID();
    } catch {
      return '00000000-0000-0000-0000-000000000000'; // Fallback if not secure context
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage, thread_id: threadId }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div 
          className={`mb-4 transition-all duration-300 ease-in-out ${
            isExpanded ? 'w-full sm:w-[700px] h-[80vh] max-h-[800px]' : 'w-80 sm:w-96 h-[500px] max-h-[80vh]'
          } bg-surface-container-lowest rounded-[24px] shadow-lg border border-outline-variant flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10`}
        >
          {/* Header */}
          <div className="bg-primary text-on-primary p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={quokkaImg} alt="Quokka AI" className="w-8 h-8 rounded-full object-cover border-2 border-on-primary" />
              <span className="font-label-lg font-bold">Quokka</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleExpand} className="hidden sm:flex text-on-primary hover:text-on-primary/80 transition-colors cursor-pointer items-center justify-center">
                <span className="material-symbols-rounded">{isExpanded ? 'close_fullscreen' : 'open_in_full'}</span>
              </button>
              <button onClick={toggleChat} className="text-on-primary hover:text-on-primary/80 transition-colors cursor-pointer items-center justify-center">
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-surface">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse self-end' : 'flex-row self-start'} max-w-[90%]`}>
                {/* Profile Pic */}
                <div className="flex-shrink-0 mt-auto">
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                      <span className="material-symbols-rounded text-[20px]">person</span>
                    </div>
                  ) : (
                    <img src={quokkaImg} alt="Quokka" className="w-8 h-8 rounded-full object-cover border border-outline-variant" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3 rounded-2xl overflow-hidden ${msg.role === 'user'
                    ? 'bg-primary text-on-primary rounded-br-sm'
                    : 'bg-surface-container-high text-on-surface rounded-bl-sm'
                    }`}
                >
                  {msg.role === 'user' ? (
                    <p className="font-body-md text-sm whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="font-body-md text-sm prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 flex-row self-start max-w-[90%]">
                <div className="flex-shrink-0 mt-auto">
                  <img src={quokkaImg} alt="Quokka" className="w-8 h-8 rounded-full object-cover border border-outline-variant" />
                </div>
                <div className="bg-surface-container-high text-on-surface rounded-2xl rounded-bl-sm p-3 flex items-center">
                  <div className="flex gap-1 items-center h-5">
                    <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 bg-surface-container-lowest border-t border-outline-variant flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-surface-container border border-outline-variant rounded-full px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <span className="material-symbols-rounded text-[20px]">send</span>
            </button>
          </form>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer ${isOpen ? 'hidden' : 'flex'}`}
      >
        <span className="material-symbols-rounded text-[28px]">chat</span>
      </button>
    </div>
  );
};

export default Chatbot;
