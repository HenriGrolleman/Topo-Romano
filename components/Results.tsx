import React from 'react';
import { GameMode } from '../types';
import { Trophy, RefreshCcw, Home } from 'lucide-react';

interface ResultsProps {
  score: number;
  total: number;
  onRetry: () => void;
  onHome: () => void;
  mode: GameMode;
}

const Results: React.FC<ResultsProps> = ({ score, total, onRetry, onHome, mode }) => {
  const percentage = Math.round((score / total) * 100);
  
  let message = "Goed geprobeerd!";
  if (percentage > 50) message = "Lekker bezig!";
  if (percentage > 80) message = "Super goed!";
  if (percentage === 100) message = "Fantastisch! Alles goed!";

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl max-w-lg mx-auto text-center animate-fade-in-up">
      <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
        <Trophy className="w-12 h-12 text-yellow-600" />
      </div>
      
      <h2 className="text-3xl font-bold text-slate-800 mb-2">{message}</h2>
      <p className="text-slate-500 mb-6">Je hebt de {mode.toLowerCase()} afgerond.</p>
      
      <div className="text-6xl font-black text-blue-600 mb-2">{score} <span className="text-3xl text-gray-400">/ {total}</span></div>
      <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Jouw Score</div>

      <div className="flex gap-4 w-full">
        <button 
          onClick={onHome}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
        >
          <Home className="w-5 h-5" />
          Menu
        </button>
        <button 
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-blue-300 shadow-lg"
        >
          <RefreshCcw className="w-5 h-5" />
          Opnieuw
        </button>
      </div>
    </div>
  );
};

export default Results;