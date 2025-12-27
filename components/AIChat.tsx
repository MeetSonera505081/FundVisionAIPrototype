
import React, { useState, useRef, useEffect } from 'react';
import { getFinancialAdvice } from '../services/geminiService';
import { MOCK_TRANSACTIONS, MOCK_ACCOUNTS, MOCK_BUDGETS } from '../constants';
import { ChatMessage } from '../types';

const SUGGESTED_TASKS = [
  { label: "Analyze spending", query: "Can you analyze my spending patterns for the last week?" },
  { label: "Savings advice", query: "How can I save more for my dream home goal?" },
  { label: "Budget check", query: "Which budget category am I most likely to exceed?" },
  { label: "Investment tips", query: "Give me some basic investment tips for a beginner in India." },
  { label: "Expense summary", query: "Summarize my top 3 biggest expenses this month." }
];

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: [{ text: "Namaste! I'm FundVision AI. I've analyzed your recent spending and noticed you spent ₹1,500 more on dining out this week. How can I help you optimize your finances today?" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', parts: [{ text: query }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const advice = await getFinancialAdvice(
      query,
      MOCK_TRANSACTIONS,
      MOCK_ACCOUNTS,
      MOCK_BUDGETS,
      messages.map(m => ({ role: m.role, parts: m.parts }))
    );

    setMessages(prev => [...prev, { role: 'model', parts: [{ text: advice }] }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
      <div className="p-4 border-b border-orange-100 flex items-center bg-orange-50/50">
        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white mr-3">
          <i className="fas fa-robot"></i>
        </div>
        <div>
          <h3 className="font-bold text-slate-800">FundVision AI Assistant</h3>
          <p className="text-xs text-emerald-600 flex items-center">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
            Online & Analyzing
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
              ? 'bg-orange-600 text-white rounded-tr-none' 
              : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.parts[0].text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex space-x-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-orange-50/20 border-t border-orange-100">
        {/* Suggested Tasks Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">Suggestions:</span>
          {SUGGESTED_TASKS.map((task, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(task.query)}
              disabled={isLoading}
              className="flex-shrink-0 px-3 py-1 bg-white border border-orange-200 rounded-full text-xs font-medium text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-all disabled:opacity-50"
            >
              {task.label}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-white rounded-xl border border-orange-200 p-1 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
          <input
            type="text"
            className="flex-1 px-4 py-2 outline-none text-sm text-slate-700 bg-transparent"
            placeholder="Ask anything about your spending in ₹..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="bg-orange-600 text-white p-2 w-10 h-10 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          AI generated advice. Always consult with a professional for major financial decisions.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
