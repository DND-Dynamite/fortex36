
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';

const AIAssistant: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: 'Hello, I am your MedFlow Clinical Assistant. How can I help with patient data or medical references today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: `You are a medical ERP assistant for a hospital. 
          Help doctors and nurses with queries about drug dosages, lab results, and ICD codes. 
          Keep responses concise, professional, and evidence-based. 
          Always include a disclaimer that AI is not a substitute for clinical judgment.`
        }
      });

      const aiText = response.text || "I couldn't process that request. Please try again.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to AI clinical services. Please check connectivity." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white shadow-2xl z-50 border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-400" size={20} />
          <span className="font-bold">Clinical Assistant</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg"><X size={20} /></button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {msg.role === 'ai' ? <Bot size={14} className="text-blue-500" /> : <User size={14} />}
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  {msg.role === 'ai' ? 'MedFlow AI' : 'You'}
                </span>
              </div>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
              <Loader2 className="animate-spin text-blue-500" size={16} />
              <span className="text-xs text-slate-500 font-medium italic">Analyzing clinical context...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about doses, ICD-10, or data..."
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="mt-3 text-[10px] text-slate-400 text-center">AI recommendations are for informational purposes only.</p>
      </div>
    </div>
  );
};

export default AIAssistant;
