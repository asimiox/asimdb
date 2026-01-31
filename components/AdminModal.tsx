import React, { useState, useEffect } from 'react';
import { X, Lock, Trash2, Terminal, ChevronRight } from 'lucide-react';
import { getLogs, clearLogs } from '../services/logger';
import { LogEntry } from '../types';
import NeuButton from './NeuButton';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setLogs(getLogs());
    }
    if (!isOpen) {
      setPin('');
      setIsAuthenticated(false);
    }
  }, [isOpen, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side protection. Change '0000' to your preferred PIN.
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#212529] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="bg-[#1a1d21] p-4 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-2 text-red-500">
            <Lock size={18} />
            <span className="font-['Orbitron'] tracking-widest font-bold">ADMIN CONSOLE</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6 relative">
            {/* Scanline overlay for the whole modal */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-0"></div>

          {!isAuthenticated ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 relative z-10">
              <div className="w-20 h-20 rounded-full bg-[#1a1d21] shadow-[inset_4px_4px_8px_#0e1012,inset_-4px_-4px_8px_#262a30] flex items-center justify-center text-red-500/50">
                <Lock size={32} />
              </div>
              <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 w-full max-w-xs">
                <div className="text-xs text-gray-500 font-mono tracking-widest uppercase">Enter Security PIN (Default: 0000)</div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  className="w-full bg-[#16181b] border border-white/5 rounded-lg py-3 text-center text-2xl font-mono tracking-[1em] text-cyan-500 focus:outline-none focus:border-cyan-500/50 shadow-[inset_2px_2px_4px_#000]"
                  autoFocus
                />
                <NeuButton type="submit" variant="primary" className="w-full mt-2">
                  AUTHENTICATE
                </NeuButton>
              </form>
            </div>
          ) : (
            <div className="h-full flex flex-col relative z-10">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-mono">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    CONNECTION ESTABLISHED
                </div>
                <button 
                    onClick={handleClear}
                    className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 font-mono uppercase tracking-wider px-3 py-1 rounded border border-red-500/20 hover:bg-red-500/10 transition-colors"
                >
                    <Trash2 size={12} /> Purge Logs
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar bg-[#16181b] rounded-lg border border-white/5 p-2 font-mono text-sm shadow-[inset_2px_2px_6px_#000]">
                {logs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                        <Terminal size={24} />
                        <span>NO LOGS FOUND</span>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {logs.map((log) => (
                            <div key={log.id} className="bg-[#212529] rounded border border-white/5 overflow-hidden">
                                <div 
                                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#2a2e33] transition-colors"
                                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <ChevronRight size={14} className={`text-gray-500 transition-transform ${expandedLog === log.id ? 'rotate-90' : ''}`} />
                                        <div className="flex flex-col">
                                            <span className="text-cyan-400 font-bold">{log.query}</span>
                                            <span className="text-[10px] text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className={`text-[10px] px-2 py-1 rounded font-bold ${log.success ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {log.success ? 'SUCCESS' : 'FAILED'}
                                    </div>
                                </div>
                                {expandedLog === log.id && (
                                    <div className="border-t border-white/5 bg-[#1a1d21] p-3 text-xs text-gray-400 overflow-x-auto">
                                        <pre className="whitespace-pre-wrap break-all">{log.details}</pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;