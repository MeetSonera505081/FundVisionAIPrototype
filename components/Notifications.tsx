
import React from 'react';
import { Notification } from '../types';

interface NotificationsProps {
  items: Notification[];
  onMarkRead: (id: string) => void;
  onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ items, onMarkRead, onClose }) => {
  return (
    <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-orange-100 z-[100] overflow-hidden animate-in fade-in zoom-in duration-200">
      <div className="p-4 border-b border-orange-50 bg-orange-50/30 flex justify-between items-center">
        <h4 className="font-bold text-slate-800">Alerts & Insights</h4>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <i className="fas fa-times text-xs"></i>
        </button>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-bell-slash text-slate-200 text-3xl mb-3"></i>
            <p className="text-slate-400 text-sm">All caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-orange-50">
            {items.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 hover:bg-orange-50/30 transition-colors cursor-pointer relative ${!item.isRead ? 'bg-orange-50/10' : ''}`}
                onClick={() => onMarkRead(item.id)}
              >
                {!item.isRead && (
                  <span className="absolute top-4 right-4 w-2 h-2 bg-orange-500 rounded-full"></span>
                )}
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.type === 'alert' ? 'bg-red-50 text-red-500' : 
                    item.type === 'tip' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'
                  }`}>
                    <i className={`fas ${
                      item.type === 'alert' ? 'fa-exclamation-triangle' : 
                      item.type === 'tip' ? 'fa-lightbulb' : 'fa-check-circle'
                    }`}></i>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">{item.title}</h5>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-medium uppercase tracking-tight">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-3 bg-slate-50 border-t border-orange-50 text-center">
        <button className="text-[10px] font-bold text-orange-600 uppercase tracking-widest hover:text-orange-700">
          Clear All Notifications
        </button>
      </div>
    </div>
  );
};

export default Notifications;
