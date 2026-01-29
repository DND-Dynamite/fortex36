
import React, { useState, useEffect, useCallback, useRef } from 'react';
import MemoryGrid from './components/MemoryGrid';
import AnalysisDashboard from './components/AnalysisDashboard';
import { GameStatus, RoundData, CognitiveAnalysis } from './types';
import { analyzePerformance } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [score, setScore] = useState(0);
  const [analysis, setAnalysis] = useState<CognitiveAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const roundStartTimeRef = useRef<number>(0);
  const lastInputTimeRef = useRef<number>(0);
  const inputTimesRef = useRef<number[]>([]);

  // Calculate score based on difficulty and speed
  const calculateFinalScore = useCallback(() => {
    if (rounds.length === 0) return 0;
    
    const maxLevel = Math.max(...rounds.map(r => r.level));
    const avgResponse = rounds.reduce((a, b) => a + b.responseTime, 0) / rounds.length;
    
    // Level provides 0-80 points (lvl 10 = 80)
    // Speed provides 0-20 points (fast = <600ms)
    const levelScore = Math.min(80, maxLevel * 8);
    const speedBonus = Math.max(0, 20 - (avgResponse / 100));
    
    return Math.round(levelScore + speedBonus);
  }, [rounds]);

  const startGame = () => {
    setRounds([]);
    setLevel(1);
    setScore(0);
    setAnalysis(null);
    startNewRound(1);
  };

  const startNewRound = (nextLevel: number) => {
    // Sequence length = level + 2
    const len = nextLevel + 2;
    const newSequence = Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);
    
    setSequence(newSequence);
    setUserInput([]);
    setCountdown(3);
    setStatus(GameStatus.PREPARING);
  };

  // Handle Countdown
  useEffect(() => {
    if (status === GameStatus.PREPARING && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 800);
      return () => clearTimeout(timer);
    } else if (status === GameStatus.PREPARING && countdown === 0) {
      playSequence();
    }
  }, [status, countdown]);

  const playSequence = async () => {
    setStatus(GameStatus.SHOWING);
    for (const num of sequence) {
      setActiveTile(num);
      await new Promise(r => setTimeout(r, 600)); // Flash duration
      setActiveTile(null);
      await new Promise(r => setTimeout(r, 300)); // Gap
    }
    setStatus(GameStatus.INPUTTING);
    roundStartTimeRef.current = Date.now();
    lastInputTimeRef.current = Date.now();
    inputTimesRef.current = [];
  };

  const handleTileClick = (num: number) => {
    if (status !== GameStatus.INPUTTING) return;

    const currentTime = Date.now();
    const responseTime = currentTime - lastInputTimeRef.current;
    inputTimesRef.current.push(responseTime);
    lastInputTimeRef.current = currentTime;

    const newUserInput = [...userInput, num];
    setUserInput(newUserInput);
    
    // Check if input is correct so far
    const currentIndex = newUserInput.length - 1;
    if (newUserInput[currentIndex] !== sequence[currentIndex]) {
      endGame();
      return;
    }

    // Brief visual feedback on click
    setActiveTile(num);
    setTimeout(() => setActiveTile(null), 150);

    // If sequence complete
    if (newUserInput.length === sequence.length) {
      const avgResponseTime = inputTimesRef.current.reduce((a, b) => a + b, 0) / inputTimesRef.current.length;
      
      const roundData: RoundData = {
        level,
        sequenceLength: sequence.length,
        responseTime: avgResponseTime,
        success: true
      };
      
      setRounds(prev => [...prev, roundData]);
      setStatus(GameStatus.SUCCESS);
      
      setTimeout(() => {
        if (level < 10) {
          const nextLvl = level + 1;
          setLevel(nextLvl);
          startNewRound(nextLvl);
        } else {
          endGame(true);
        }
      }, 1000);
    }
  };

  const endGame = async (perfectRun = false) => {
    setStatus(GameStatus.GAMEOVER);
    const finalScore = calculateFinalScore();
    setScore(finalScore);
    setIsAnalyzing(true);
    
    // Use a small delay for better UX flow
    setTimeout(async () => {
      const result = await analyzePerformance(finalScore, rounds);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">
          MEMORY MAZE <span className="text-blue-600">🧠</span>
        </h1>
        <p className="text-slate-500 font-medium">Cognitive Assessment & Brain Fitness</p>
      </header>

      {status === GameStatus.IDLE && (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 animate-in zoom-in duration-500 text-center space-y-6">
          <div className="flex justify-center gap-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1">Focus</span>
            <span>•</span>
            <span className="flex items-center gap-1">Memory</span>
            <span>•</span>
            <span className="flex items-center gap-1">Speed</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Ready to test your cognitive function?</h2>
          <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
            Watch the sequence of numbered tiles light up and repeat it. 
            Levels get progressively harder to measure your short-term memory limit.
          </p>
          <button 
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Start Assessment
          </button>
        </div>
      )}

      {(status === GameStatus.PREPARING || status === GameStatus.SHOWING || status === GameStatus.INPUTTING || status === GameStatus.SUCCESS) && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Level</p>
              <p className="text-2xl font-black text-blue-600">{level}/10</p>
            </div>
            <div className="text-center">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {status === GameStatus.PREPARING ? 'Get Ready' : status === GameStatus.SHOWING ? 'Memorize' : status === GameStatus.INPUTTING ? 'Your Turn' : 'Perfect!'}
               </p>
               <div className="h-2 w-32 bg-slate-100 rounded-full mt-2 overflow-hidden">
                 <div 
                   className="h-full bg-blue-500 transition-all duration-500" 
                   style={{ width: `${(level/10) * 100}%` }}
                 />
               </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sequence</p>
              <p className="text-2xl font-black text-slate-800">{sequence.length} Tiles</p>
            </div>
          </div>

          <div className="relative">
            {status === GameStatus.PREPARING && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm rounded-2xl">
                <span className="text-8xl font-black text-blue-600 animate-ping">{countdown}</span>
              </div>
            )}
            
            <MemoryGrid 
              activeTile={activeTile} 
              onTileClick={handleTileClick} 
              status={status}
              disabled={status !== GameStatus.INPUTTING}
            />
          </div>

          {status === GameStatus.INPUTTING && (
            <div className="text-center">
              <p className="text-slate-500 font-medium">
                Tap the sequence: <span className="font-bold text-slate-800">{userInput.length} / {sequence.length}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {status === GameStatus.GAMEOVER && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-800">Assessment Complete</h2>
            <div className="flex justify-center items-baseline gap-2">
              <span className="text-6xl font-black text-blue-600">{score}</span>
              <span className="text-xl font-bold text-slate-400">/ 100</span>
            </div>
            <p className="text-slate-500">
              You reached <span className="font-bold text-slate-800">Level {level}</span> with a sequence of <span className="font-bold text-slate-800">{sequence.length}</span> tiles.
            </p>
            <button 
              onClick={startGame}
              className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all"
            >
              Restart Test
            </button>
          </div>

          <AnalysisDashboard rounds={rounds} analysis={analysis} loading={isAnalyzing} />
        </div>
      )}

      <footer className="mt-16 text-center text-slate-400 text-sm border-t pt-8">
        <p>© 2024 Memory Maze Brain Lab</p>
        <p className="mt-1 italic">Train your brain, monitor your future.</p>
      </footer>
    </div>
  );
};

export default App;
