import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { User, Sparkles, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] lg:max-w-[60%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`
          w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm mt-1
          ${isUser ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-100'}
        `}>
          {isUser ? <User size={16} /> : <Sparkles size={16} />}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`
            relative px-5 py-3.5 rounded-2xl text-sm md:text-base shadow-sm leading-relaxed
            ${isUser 
              ? 'bg-indigo-600 text-white rounded-tr-sm' 
              : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'
            }
          `}>
            {message.isError ? (
               <span className="text-red-200">{message.text}</span>
            ) : (
              <ReactMarkdown 
                className={`markdown prose ${isUser ? 'prose-invert' : 'prose-slate'} max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 break-words`}
                components={{
                  // Override link styles to be visible but safe
                  a: ({node, ...props}) => <a {...props} className="underline font-medium hover:opacity-80" target="_blank" rel="noopener noreferrer" />,
                  // Code blocks
                  code: ({node, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <code {...props} className={`${className} bg-black/20 rounded px-1 py-0.5`}>
                        {children}
                      </code>
                    ) : (
                      <code {...props} className="bg-black/10 rounded px-1 py-0.5 text-[0.9em]">
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {message.text}
              </ReactMarkdown>
            )}
            
            {/* Typing cursor for streaming */}
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-slate-400 animate-pulse" />
            )}
          </div>
          
          {/* Actions / Timestamp */}
          <div className={`flex items-center gap-2 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-[10px] text-slate-400">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {!isUser && !message.isStreaming && (
              <button 
                onClick={handleCopy} 
                className="text-slate-400 hover:text-indigo-500 transition-colors p-1"
                title="Copy to clipboard"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
