import React, { useState, useEffect } from 'react';
import { Lock, Trash2, Terminal, ChevronRight, LogOut, ShieldAlert } from 'lucide-react';
import { getLogs, clearLogs } from '../services/logger';
import { LogEntry } from '../types';
import NeuButton from './NeuButton';

interface AdminViewProps {
  onClose: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setLogs(getLogs());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 0000
    if (pin === '0000') {
      setIsAuthenticated(true);
      setLogs(getLogs());
    } else {
      alert('ACCESS DENIED: Invalid Security Clearance');
      setPin('');
    }
  };

  const handleClear = () => {
    if (confirm('WARNING: Provide authorization to purge system logs?')) {
      clearLogs();
      setLogs([]);
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      
      {/* Admin Header inside Screen */}
      <div className="flex justify-between items-center border-b border-red-500/20 pb-2 mb-4 shrink-0">
        <div className="flex items-center gap-2 text-red-500">
          <ShieldAlert size={16} />
          <span className="font-mono font-bold tracking-widest text-sm">ROOT ACCESS</span>
        </div>
        <button 
          onClick={onClose} 
          className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-cyan-400 font-mono tracking-widest uppercase transition-colors"
        >
          <LogOut size={10} /> Exit System
        </button>
      </div>

      {!isAuthenticated ? (
        <div className="h-full flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-full border border-red-500/30 flex items-center justify-center text-red-500 relative">
            <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 animate-pulse"></div>
            <Lock size={24} className="relative z-10" />
          </div>
          
          <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 w-full max-w-xs">
            <div className="text-[10px] text-red-400/80 font-mono tracking-widest uppercase text-center">
              Restricted Area // Enter Passcode
            </div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              placeholder="••••"
              className="w-32 bg-transparent border-b-2 border-red-500/30 py-2 text-center text-2xl font-mono tracking-[0.5em] text-red-500 focus:outline-none focus:border-red-500 transition-colors placeholder-red-900/50"
              autoFocus
            />
            <NeuButton type="submit" variant="danger" className="w-full mt-4 !rounded-lg !py-2 !text-xs">
              DECRYPT ACCESS
            </NeuButton>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-3 shrink-0">
            <div className="text-[10px] text-gray-500 font-mono">
              TOTAL ENTRIES: <span className="text-gray-300">{logs.length}</span>
            </div>
            <button 
                onClick={handleClear}
                className="flex items-center gap-2 text-[10px] text-red-400 hover:text-red-300 font-mono uppercase tracking-wider px-2 py-1 rounded border border-red-500/20 hover:bg-red-500/10 transition-colors"
            >
                <Trash2 size={10} /> Purge
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
            {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-700 gap-2 opacity-50">
                    <Terminal size={24} />
                    <span className="font-mono text-xs">LOGS_EMPTY</span>
                </div>
            ) : (
                logs.map((log) => (
                    <div key={log.id} className="bg-[#1a1d21] rounded border border-white/5 overflow-hidden group hover:border-cyan-500/30 transition-colors">
                        <div 
                            className="flex items-center justify-between p-3 cursor-pointer"
                            onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                        >
                            <div className="flex items-center gap-3">
                                <ChevronRight size={14} className={`text-gray-600 transition-transform ${expandedLog === log.id ? 'rotate-90 text-cyan-500' : ''}`} />
                                <div className="flex flex-col">
                                    <span className="text-gray-200 font-mono text-sm group-hover:text-cyan-400 transition-colors">{log.query}</span>
                                    <span className="text-[10px] text-gray-600">{new Date(log.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className={`text-[9px] px-1.5 py-0.5 rounded border ${log.success ? 'border-emerald-500/30 text-emerald-500' : 'border-red-500/30 text-red-500'}`}>
                                {log.success ? '200 OK' : 'ERR'}
                            </div>
                        </div>
                        {expandedLog === log.id && (
                            <div className="border-t border-white/5 bg-[#16181b] p-3 text-[10px] font-mono text-gray-400 overflow-x-auto">
                                <div className="mb-2 text-cyan-500/50">RAW_PAYLOAD:</div>
                                <pre className="whitespace-pre-wrap font-mono text-cyan-500/80">
                                    {(() => {
                                        try {
                                            return JSON.stringify(JSON.parse(log.details), null, 2);
                                        } catch (e) {
                                            return log.details;
                                        }
                                    })()}
                                </pre>
                            </div>
                        )}
                    </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;