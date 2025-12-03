import React from 'react';
import { Trash2, MessageSquare, Info, Github } from 'lucide-react';

interface SidebarProps {
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Actions */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Actions</h3>
        
        <button 
          onClick={onReset}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
        >
          <Trash2 size={16} />
          <span>Clear Conversation</span>
        </button>
      </div>

      {/* Info Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">About Lumi</h3>
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
          <div className="flex items-start gap-3">
            <Info size={16} className="text-indigo-500 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              Lumi is powered by Google's Gemini 2.5 Flash model. It's designed to be fast, friendly, and helpful for casual conversations.
            </p>
          </div>
        </div>
      </div>

      {/* Topics Suggestions (Just visual for now) */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Conversation Starters</h3>
        <div className="grid gap-2">
          {["Tell me a joke", "Explain quantum physics", "Give me a recipe", "Write a poem"].map((topic, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 bg-white border border-slate-100 rounded-lg">
              <MessageSquare size={14} className="text-indigo-300" />
              <span>{topic}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
