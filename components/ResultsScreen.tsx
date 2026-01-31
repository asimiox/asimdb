import React from 'react';
import { SimResult, ApiResponse } from '../types';
import { Database, User, Phone, MapPin, CreditCard, Hash, Activity, FileWarning } from 'lucide-react';

interface ResultsScreenProps {
  data: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-cyan-500/50">
        <Activity className="w-12 h-12 animate-pulse" />
        <span className="font-mono text-sm tracking-[0.2em] animate-pulse">SEARCHING DATABASE... ESTABLISHING CONNECTION...</span>
      </div>
    );
  }

  if (error || (data && data.results.length === 0)) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-orange-500/80">
        <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-xl opacity-10"></div>
            <FileWarning className="w-16 h-16 relative z-10" />
        </div>
        <span className="font-mono text-xl tracking-widest font-bold">DATA NOT FOUND</span>
        <div className="text-orange-400/60 font-mono text-sm max-w-xs text-center flex flex-col gap-1">
             <span>Data Not Available in Database.</span>
             <span>Try again.</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-gray-600">
        <Database className="w-16 h-16 opacity-20" />
        <span className="font-mono text-sm tracking-[0.2em] opacity-40">WAITING FOR INPUT</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
        {/* Meta Info Header */}
        <div className="flex justify-between items-center border-b border-cyan-500/20 pb-2 mb-4">
            <div className="flex flex-col">
                <span className="text-[10px] uppercase text-gray-500 tracking-widest">Query Target</span>
                <span className="text-cyan-400 font-mono">{data.query}</span>
            </div>
        </div>

      {data.results.map((result, index) => (
        <div key={index} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative bg-[#1a1d21]/90 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider">
                            <User size={12} /> Name
                        </div>
                        <div className="text-gray-200 font-semibold tracking-wide text-lg break-words">
                            {result.name || 'N/A'}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider">
                            <Phone size={12} /> Mobile
                        </div>
                        <div className="text-cyan-400 font-mono text-lg tracking-wider">
                            {result.mobile || 'N/A'}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider">
                            <CreditCard size={12} /> CNIC
                        </div>
                        <div className="text-emerald-400 font-mono tracking-wider">
                            {result.cnic || 'N/A'}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider">
                            <Hash size={12} /> Index
                        </div>
                        <div className="text-gray-400 font-mono text-sm">
                            T: {result.table_index} | R: {result.row_index}
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
                    <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider">
                        <MapPin size={12} /> Address
                    </div>
                    <div className="text-gray-300 font-mono text-sm leading-relaxed break-words">
                        {result.address || 'ADDRESS NOT AVAILABLE'}
                    </div>
                </div>

            </div>
        </div>
      ))}
      
      <div className="text-center pt-4">
        <span className="text-[10px] text-gray-600 font-mono">
            TIMESTAMP: {new Date(data.timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ResultsScreen;