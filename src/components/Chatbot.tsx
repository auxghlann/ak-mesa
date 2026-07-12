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
  const [hasInitialized, setHasInitialized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && !hasInitialized) {
      setHasInitialized(true);
      setIsLoading(true);
      setTimeout(() => {
        setMessages([{ role: 'bot', content: 'Hi there! I am Quokka, Allan\'s AI assistant. Ask me anything about this table!' }]);
        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen, hasInitialized]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
    }
  }, [input]);

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

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText, thread_id: threadId }),
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

  const onSubmitForm = (e?: React.FormEvent) => {
    e?.preventDefault();
    handleSend(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <div
        className={`absolute bottom-full right-0 mb-4 transition-all duration-300 ease-out origin-bottom-right bg-surface rounded-[24px] shadow-lg border border-outline-variant flex flex-col overflow-hidden ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-[0.85] opacity-0 pointer-events-none'
          } ${isExpanded ? 'w-[calc(100vw-3rem)] sm:w-[700px] h-[80vh] max-h-[800px]' : 'w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[80vh]'
          }`}
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
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-transparent">
          {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end self-end' : 'items-start self-start'} max-w-[90%]`}>
              <div
                className={`p-3 rounded-[20px] overflow-hidden ${msg.role === 'user'
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
              {msg.role === 'bot' && (
                <span className="text-on-surface-variant text-[11px] ml-2">Quokka • AI Agent</span>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col gap-1 items-start self-start max-w-[90%]">
              <div className="bg-surface-container-high text-on-surface rounded-[20px] rounded-bl-sm p-3 flex items-center">
                <div className="flex gap-1 items-center h-5">
                  <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce"></div>
                </div>
              </div>
              <span className="text-on-surface-variant text-[11px] ml-2">Quokka • AI Agent</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length <= 1 && !isLoading && (
          <div className="px-4 pb-3 pt-1 flex flex-col gap-2 items-end">
            <button
              type="button"
              onClick={() => handleSend("Tell me about Allan.")}
              className="text-sm px-4 py-2 border border-primary/30 rounded-full text-primary hover:bg-primary/10 transition-colors shadow-sm cursor-pointer"
            >
              Tell me about Allan.
            </button>
            <button
              type="button"
              onClick={() => handleSend("What projects have Allan worked on?")}
              className="text-sm px-4 py-2 border border-primary/30 rounded-full text-primary hover:bg-primary/10 transition-colors shadow-sm cursor-pointer"
            >
              What projects have Allan worked on?
            </button>
          </div>
        )}

        {/* Input */}
        <form onSubmit={onSubmitForm} className="p-3 bg-transparent border-t border-outline-variant flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmitForm(e);
              }
            }}
            placeholder="Ask me anything..."
            className="flex-1 bg-surface-container border border-outline-variant rounded-[20px] px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none overflow-y-auto min-h-[40px] max-h-32"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 shrink-0 rounded-full bg-primary flex items-center justify-center text-on-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <span className="material-symbols-rounded text-[20px]">send</span>
          </button>
        </form>
      </div>

      {/* FAB */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer`}
      >
        <span className="material-symbols-rounded text-[28px]">
          {isOpen ? 'keyboard_arrow_down' : 'auto_awesome'}
        </span>
      </button>
    </div>
  );
};

export default Chatbot;
