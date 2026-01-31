import React, { useState } from 'react';
import { Search, RotateCcw, Shield, Database, Cpu, Wifi, Lock } from 'lucide-react';
import NeuButton from './components/NeuButton';
import NeuInput from './components/NeuInput';
import ResultsScreen from './components/ResultsScreen';
import AdminView from './components/AdminView';
import { fetchSimData } from './services/api';
import { logSearchQuery } from './services/logger';
import { SearchState } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchState, setSearchState] = useState<SearchState>({
    loading: false,
    data: null,
    error: null,
  });
  const [currentView, setCurrentView] = useState<'search' | 'admin'>('search');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setSearchState({ loading: true, data: null, error: null });

    try {
      const result = await fetchSimData(query);
      
      // Log the attempt (Non-blocking)
      logSearchQuery(query, result);

      if (result.success) {
        setSearchState({ loading: false, data: result, error: null });
      } else {
        setSearchState({ loading: false, data: null, error: result.message || 'API returned failure' });
      }
    } catch (err) {
      setSearchState({ 
        loading: false, 
        data: null, 
        error: err instanceof Error ? err.message : 'Connection failed' 
      });
    }
  };

  const handleReset = () => {
    setQuery('');
    setSearchState({ loading: false, data: null, error: null });
  };

  return (
    <div className="min-h-screen bg-[#212529] text-gray-200 flex flex-col items-center justify-center p-4 md:p-8">
      
      {/* Main Device Container - Skeuomorphic Chassis */}
      <div className="relative w-full max-w-4xl bg-[#212529] rounded-[40px] p-6 md:p-10 shadow-[20px_20px_40px_#16181b,-20px_-20px_40px_#2c3237] border border-white/5">
        
        {/* Metallic Texture Overlay */}
        <div className="absolute inset-0 rounded-[40px] pointer-events-none bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
        
        {/* Top Header Bar (Screws and Branding) */}
        <div className="flex justify-between items-center mb-8 relative z-10 px-2">
            <div className="flex items-center gap-4">
                {/* Decorative Screw Head */}
                <div className="w-4 h-4 rounded-full bg-[#1a1d21] shadow-[inset_1px_1px_2px_#000,inset_-1px_-1px_2px_#333] flex items-center justify-center">
                    <div className="w-2 h-[1px] bg-gray-600 rotate-45"></div>
                    <div className="w-2 h-[1px] bg-gray-600 -rotate-45 absolute"></div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-['Orbitron'] tracking-widest text-gray-200 flex items-center gap-2">
                        <Database className="text-cyan-500" />
                        ASIM<span className="text-cyan-500">DB</span>
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono tracking-[0.2em] uppercase">
                        <span className={`w-2 h-2 rounded-full ${currentView === 'admin' ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`}></span>
                        {currentView === 'admin' ? 'SYSTEM MODE' : 'SYSTEM ONLINE'}
                    </div>
                </div>
            </div>

            <div className="flex gap-3 items-center">
                 <div className="hidden md:flex gap-3">
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#212529] shadow-[inset_2px_2px_4px_#16181b,inset_-2px_-2px_4px_#2c3237]">
                        <Cpu size={16} className="text-gray-500" />
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#212529] shadow-[inset_2px_2px_4px_#16181b,inset_-2px_-2px_4px_#2c3237]">
                        <Wifi size={16} className="text-gray-500" />
                    </div>
                 </div>
                 
                 {/* Admin Lock Button - Now visible on all screens */}
                 <button 
                    onClick={() => setCurrentView(currentView === 'admin' ? 'search' : 'admin')}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                        currentView === 'admin' 
                        ? 'bg-red-500/10 text-red-500 shadow-[inset_2px_2px_4px_#000]' 
                        : 'bg-[#212529] shadow-[6px_6px_12px_#16181b,-6px_-6px_12px_#2c3237] hover:text-cyan-500'
                    }`}
                 >
                    <Lock size={16} />
                 </button>
            </div>

             {/* Decorative Screw Head */}
             <div className="w-4 h-4 rounded-full bg-[#1a1d21] shadow-[inset_1px_1px_2px_#000,inset_-1px_-1px_2px_#333] flex items-center justify-center">
                    <div className="w-2 h-[1px] bg-gray-600 rotate-45"></div>
                    <div className="w-2 h-[1px] bg-gray-600 -rotate-45 absolute"></div>
                </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            
            {/* Left Control Panel */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
                
                {/* Input Section */}
                <div className={`p-6 rounded-2xl transition-colors duration-500 shadow-[8px_8px_16px_#16181b,-8px_-8px_16px_#2c3237] ${currentView === 'admin' ? 'bg-[#252121]' : 'bg-[#212529]'}`}>
                    <div className={`flex items-center gap-2 mb-4 ${currentView === 'admin' ? 'text-red-500' : 'text-cyan-500'}`}>
                        <Shield size={18} />
                        <span className="text-xs font-bold tracking-widest uppercase">
                            {currentView === 'admin' ? 'Admin Override' : 'Secure Query'}
                        </span>
                    </div>
                    
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="space-y-2">
                            <NeuInput 
                                placeholder="Enter Mobile or CNIC"
                                label="Target Identifier"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                icon={<Search size={18} />}
                                disabled={currentView === 'admin'}
                            />
                            {/* Usage Note */}
                            <div className="px-1 flex flex-col gap-1.5 pt-1">
                                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Required Format (No Dashes):</span>
                                <div className="grid grid-cols-1 gap-2 text-[10px] font-mono text-gray-400">
                                    <div className="bg-[#1a1d21]/50 border border-white/5 px-2 py-1.5 rounded flex justify-between items-center group hover:border-cyan-500/30 transition-colors">
                                        <span>Mobile</span>
                                        <span className="text-cyan-600 font-bold group-hover:text-cyan-400">923001234567</span>
                                    </div>
                                    <div className="bg-[#1a1d21]/50 border border-white/5 px-2 py-1.5 rounded flex justify-between items-center group hover:border-emerald-500/30 transition-colors">
                                        <span>CNIC</span>
                                        <span className="text-emerald-600 font-bold group-hover:text-emerald-400">3440112345670</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <NeuButton 
                                type="submit" 
                                variant="primary" 
                                className="w-full h-12 text-sm"
                                loading={searchState.loading}
                                disabled={currentView === 'admin'}
                            >
                                SCAN
                            </NeuButton>
                            <NeuButton 
                                type="button" 
                                variant="default"
                                className="w-full h-12 text-sm"
                                onClick={handleReset}
                                icon={<RotateCcw size={16} />}
                                disabled={currentView === 'admin'}
                            >
                                PURGE
                            </NeuButton>
                        </div>
                    </form>

                    <div className="mt-6 pt-4 border-t border-gray-800">
                        <p className="text-[10px] text-gray-500 leading-relaxed text-justify">
                            {currentView === 'admin' 
                                ? 'SYSTEM ALERT: You are in administrative mode. All search functions are suspended until you return to standard user mode.' 
                                : 'WARNING: Authorized personnel only. Accessing the database without proper clearance is a violation of Protocol 7. All queries are logged and monitored.'
                            }
                        </p>
                    </div>
                </div>

                {/* Decorative Status Module */}
                <div className="hidden lg:flex flex-col p-6 rounded-2xl bg-[#212529] shadow-[inset_4px_4px_8px_#16181b,inset_-4px_-4px_8px_#2c3237] h-full justify-center items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="grid grid-cols-3 gap-3 w-full max-w-[150px]">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full ${i % 2 === 0 ? (currentView === 'admin' ? 'bg-red-900 animate-pulse' : 'bg-cyan-900 animate-pulse') : 'bg-gray-800'}`}></div>
                        ))}
                    </div>
                    <div className="mt-4 text-xs font-mono text-gray-600">ENCRYPTION: AES-256</div>
                </div>
            </div>

            {/* Right Display Screen (The Output) */}
            <div className="w-full lg:w-2/3">
                {/* The Screen Bezel */}
                <div className="relative p-1 rounded-2xl bg-[#1a1d21] shadow-[inset_2px_2px_4px_#000,inset_-2px_-2px_4px_#333,8px_8px_16px_#16181b,-8px_-8px_16px_#2c3237]">
                    
                    {/* The Inner Screen Area */}
                    <div className="relative h-[500px] bg-black rounded-xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
                        
                        {/* Background Grid/Effect */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,50,60,0.2)_0%,_rgba(0,0,0,1)_100%)]"></div>
                        <div className="absolute inset-0" style={{ 
                            backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', 
                            backgroundSize: '100% 2px, 3px 100%' 
                        }}></div>
                        
                        {/* Scanline Animation */}
                        <div className="scanline"></div>

                        {/* Screen Content */}
                        <div className="relative z-10 h-full p-6 overflow-y-auto font-['Rajdhani']">
                            {currentView === 'search' ? (
                                <ResultsScreen 
                                    data={searchState.data}
                                    loading={searchState.loading}
                                    error={searchState.error}
                                />
                            ) : (
                                <AdminView onClose={() => setCurrentView('search')} />
                            )}
                        </div>

                        {/* Screen Glare Reflection */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none rounded-xl"></div>
                    </div>
                </div>

                {/* Bottom Model Number */}
                <div className="flex justify-end mt-4">
                    <span className="text-[10px] text-gray-600 font-mono">
                        MODEL: ASIM-T900 // REV 3.1
                    </span>
                </div>
            </div>

        </div>

      </div>

      <div className="mt-8 text-gray-500 font-mono text-xs tracking-widest uppercase opacity-75">
        Made with <span className="text-red-500 animate-pulse">❤</span> By Asim Nawaz
      </div>
    </div>
  );
};

export default App;