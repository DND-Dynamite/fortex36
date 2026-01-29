
import React, { useState, useEffect, useRef } from 'react';

type PuzzleState = 'IDLE' | 'MEMORIZING' | 'PLAYING' | 'RESULT';
type ExerciseMode = 'NONE' | 'PRANAYAMA' | 'MINDFULNESS';

export const Investigations: React.FC = () => {
  const [gameState, setGameState] = useState<PuzzleState>('IDLE');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [exerciseMode, setExerciseMode] = useState<ExerciseMode>('NONE');
  const [breathPhase, setBreathPhase] = useState<'INHALE' | 'HOLD_IN' | 'EXHALE' | 'HOLD_OUT'>('INHALE');
  const [breathTimer, setBreathTimer] = useState(4);

  const startPuzzle = () => {
    setGameState('MEMORIZING');
    setScore(0);
    generateNextLevel([]);
  };

  const generateNextLevel = (prevSeq: number[]) => {
    const nextSeq = [...prevSeq, Math.floor(Math.random() * 9)];
    setSequence(nextSeq);
    setUserSequence([]);
    setFlashIndex(null);
    playSequence(nextSeq);
  };

  const playSequence = async (seq: number[]) => {
    setGameState('MEMORIZING');
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setFlashIndex(seq[i]);
      await new Promise(r => setTimeout(r, 400));
      setFlashIndex(null);
    }
    setGameState('PLAYING');
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'PLAYING') return;

    const newUserSeq = [...userSequence, index];
    setUserSequence(newUserSeq);

    if (index !== sequence[userSequence.length]) {
      setGameState('RESULT');
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setScore(sequence.length);
      setTimeout(() => generateNextLevel(sequence), 1000);
    }
  };

  // Pranayama Breathing Timer
  useEffect(() => {
    if (exerciseMode === 'PRANAYAMA') {
      const timer = setInterval(() => {
        setBreathTimer(prev => {
          if (prev <= 1) {
            setBreathPhase(current => {
              if (current === 'INHALE') return 'HOLD_IN';
              if (current === 'HOLD_IN') return 'EXHALE';
              if (current === 'EXHALE') return 'HOLD_OUT';
              return 'INHALE';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [exerciseMode]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Memory Puzzle Section */}
        <div className="bg-gray-900/60 p-10 rounded-[3rem] border border-gray-800 shadow-2xl backdrop-blur-md flex flex-col items-center">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Neural Synchrony Test</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Concentration & Short-term Memory Buffer</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-xs">
            {Array.from({ length: 9 }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleTileClick(i)}
                className={`h-20 rounded-2xl border-2 transition-all transform active:scale-95 ${
                  flashIndex === i 
                    ? 'bg-indigo-500 border-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.6)] scale-105' 
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="text-center">
            {gameState === 'IDLE' && (
              <button onClick={startPuzzle} className="bg-indigo-600 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 shadow-xl shadow-indigo-500/20">Initialize Sync</button>
            )}
            {gameState === 'MEMORIZING' && <p className="text-indigo-400 font-black animate-pulse uppercase tracking-[0.2em]">Buffer Loading...</p>}
            {gameState === 'PLAYING' && <p className="text-emerald-400 font-black uppercase tracking-[0.2em]">Repeat Sequence</p>}
            {gameState === 'RESULT' && (
              <div className="space-y-4">
                <p className="text-rose-500 font-black uppercase tracking-widest text-xl">Sync Terminated</p>
                <p className="text-gray-400 font-bold">Score: <span className="text-white">{score} Nodes</span></p>
                <button onClick={startPuzzle} className="text-indigo-400 text-xs font-black uppercase underline decoration-2 underline-offset-4">Retry Analysis</button>
              </div>
            )}
          </div>
        </div>

        {/* Neural Optimization (Exercise) Section */}
        <div className="bg-gray-900/60 p-10 rounded-[3rem] border border-gray-800 shadow-2xl backdrop-blur-md">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Cognitive Optimizer</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Mindfulness & Breathwork Protocols</p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={() => setExerciseMode('PRANAYAMA')}
              className={`w-full p-6 rounded-3xl border text-left transition-all flex items-center justify-between ${exerciseMode === 'PRANAYAMA' ? 'bg-indigo-600 border-indigo-400' : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'}`}
            >
              <div>
                <p className="font-black uppercase tracking-tight text-white">Pranayama Protocol</p>
                <p className="text-[10px] font-bold text-gray-300 opacity-70 uppercase mt-1 tracking-widest">Square Breathing for Neuro-Stability</p>
              </div>
              <i className="fa-solid fa-lungs text-2xl opacity-40"></i>
            </button>

            <button 
              onClick={() => setExerciseMode('MINDFULNESS')}
              className={`w-full p-6 rounded-3xl border text-left transition-all flex items-center justify-between ${exerciseMode === 'MINDFULNESS' ? 'bg-emerald-600 border-emerald-400' : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'}`}
            >
              <div>
                <p className="font-black uppercase tracking-tight text-white">Neural Grounding</p>
                <p className="text-[10px] font-bold text-gray-300 opacity-70 uppercase mt-1 tracking-widest">Focused Awareness Resynchronization</p>
              </div>
              <i className="fa-solid fa-brain text-2xl opacity-40"></i>
            </button>
          </div>

          {exerciseMode === 'PRANAYAMA' && (
            <div className="mt-12 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
              <div className={`w-40 h-40 rounded-full border-4 border-white/20 flex items-center justify-center transition-all duration-[4000ms] ${breathPhase === 'INHALE' ? 'scale-150 bg-indigo-500/20' : breathPhase === 'EXHALE' ? 'scale-100 bg-transparent' : 'scale-150 bg-indigo-500/10'}`}>
                <div className="text-center">
                  <p className="text-xs font-black text-white uppercase tracking-widest">{breathPhase}</p>
                  <p className="text-2xl font-black text-white">{breathTimer}</p>
                </div>
              </div>
              <button onClick={() => setExerciseMode('NONE')} className="mt-10 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Abort Protocol</button>
            </div>
          )}

          {exerciseMode === 'MINDFULNESS' && (
            <div className="mt-12 p-8 bg-black/40 rounded-[2.5rem] border border-gray-800 animate-in fade-in duration-500">
              <p className="text-sm text-gray-300 font-bold italic leading-relaxed text-center mb-6">
                "Fix your gaze on a single point. Notice the micro-movements of your periphery. Return to center. You are the observer of the data stream."
              </p>
              <div className="w-4 h-4 bg-emerald-500 rounded-full mx-auto shadow-[0_0_20px_#10b981] animate-pulse"></div>
              <button onClick={() => setExerciseMode('NONE')} className="mt-8 block w-full text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Complete Reset</button>
            </div>
          )}
        </div>
      </div>

      {/* Suggestion based on performance */}
      {score > 0 && gameState === 'RESULT' && (
        <div className="bg-indigo-600/10 border border-indigo-500/30 p-8 rounded-[2.5rem] flex items-center gap-8 animate-in slide-in-from-left-10 duration-500 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 flex items-center justify-center text-3xl text-indigo-400">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Optimizer Advice</h4>
            <p className="text-lg font-bold text-gray-200">
              {score < 5 
                ? "Neural sync is fragmented. We recommend 5 minutes of Pranayama Protocol to stabilize the pre-frontal cortex."
                : "Exceptional cognitive clarity. Maintain peak performance with a sensory reset session."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
