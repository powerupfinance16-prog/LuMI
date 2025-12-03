import React, { useState, useRef, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Sidebar } from './components/Sidebar';
import { useGeminiChat } from './services/geminiService';
import { Menu, X, Sparkles } from 'lucide-react';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { messages, sendMessage, isLoading, resetChat } = useGeminiChat();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: Static, Mobile: Fixed */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Sparkles size={18} />
              </div>
              <h1 className="font-semibold text-lg text-slate-800">Lumi</h1>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-slate-100 rounded-md text-slate-500"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <Sidebar onReset={resetChat} />
          </div>

          <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center">
            Powered by Gemini 2.5
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-10 shrink-0">
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-slate-100 rounded-md text-slate-600"
            >
              <Menu size={20} />
            </button>
            <span className="font-semibold text-slate-800">Lumi</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
             <Sparkles size={16} />
          </div>
        </header>

        {/* Chat Interface */}
        <main className="flex-1 overflow-hidden">
          <ChatInterface 
            messages={messages} 
            onSendMessage={sendMessage} 
            isLoading={isLoading} 
          />
        </main>
      </div>
    </div>
  );
}