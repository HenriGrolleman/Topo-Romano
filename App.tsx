import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, GeoLocation } from './types';
import { LOCATIONS } from './data/geoData';
import WorldMap from './components/WorldMap';
import Results from './components/Results';
import { 
  Pointer, 
  Move, 
  Type, 
  ListTodo, 
  Timer, 
  Map as MapIcon, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

// --- Helper Components ---

const ModeCard = ({ title, icon: Icon, description, onClick, color }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-${color}-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full text-center group`}
  >
    <div className={`w-16 h-16 rounded-full bg-${color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className={`w-8 h-8 text-${color}-600`} />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
  </button>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.MENU);
  const [questions, setQuestions] = useState<GeoLocation[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  
  // Specific State for modes
  const [draggedItem, setDraggedItem] = useState<GeoLocation | null>(null);
  const [userInput, setUserInput] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0); // For race mode
  const [raceActive, setRaceActive] = useState(false);

  // Initialize Game
  const startGame = (selectedMode: GameMode) => {
    const shuffled = [...LOCATIONS].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
    setCurrentQIndex(0);
    setScore(0);
    setCorrectIds([]);
    setIsFinished(false);
    setWrongId(null);
    setMode(selectedMode);
    setUserInput("");
    setFeedbackMsg(null);

    if (selectedMode === GameMode.RACE) {
      setTimeLeft(60); // 60 seconds for race
      setRaceActive(true);
    }
  };

  // Timer for Race Mode
  useEffect(() => {
    let timer: any;
    if (mode === GameMode.RACE && raceActive && timeLeft > 0 && !isFinished) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsFinished(true);
            setRaceActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, raceActive, timeLeft, isFinished]);

  const currentQuestion = questions[currentQIndex];

  // Logic: Handle Answer
  const handleAnswer = (isCorrect: boolean, clickedId?: string) => {
    if (isFinished) return;

    if (isCorrect) {
      // Audio feedback could go here
      setScore(s => s + 1);
      setCorrectIds(prev => [...prev, currentQuestion.id]);
      setFeedbackMsg("Goed zo!");
      setWrongId(null);
      
      // Delay for positive reinforcement
      setTimeout(() => {
        setFeedbackMsg(null);
        if (currentQIndex + 1 < questions.length) {
          setCurrentQIndex(p => p + 1);
          setUserInput("");
        } else {
          setIsFinished(true);
          setRaceActive(false);
        }
      }, mode === GameMode.RACE ? 200 : 1000); // Faster transition in race mode
    } else {
      setFeedbackMsg("Probeer het nog eens!");
      if (clickedId) setWrongId(clickedId);
      
      // Allow retry or move on? 
      // Topomania usually forces correct answer or penalty.
      // Let's implement: Wrong answer doesn't advance, but maybe reduce potential score?
      // For simplicity: If not race, user tries until correct. In Race, penalty or move on?
      // Let's keep simple: try again.
      
      setTimeout(() => setWrongId(null), 1000);
    }
  };

  // --- Mode Specific Renderers ---

  // 1. Point Mode Handler
  const handleMapClick = (loc: GeoLocation) => {
    if (mode === GameMode.POINT || mode === GameMode.RACE) {
      if (loc.id === currentQuestion.id) {
        handleAnswer(true);
      } else {
        handleAnswer(false, loc.id);
        // In Race mode, time penalty?
        if (mode === GameMode.RACE) setTimeLeft(t => Math.max(0, t - 2)); 
      }
    } else if (mode === GameMode.DRAG) {
      if (draggedItem) {
        if (loc.id === draggedItem.id) {
          handleAnswer(true);
          setDraggedItem(null);
        } else {
          handleAnswer(false, loc.id);
        }
      }
    }
  };

  // 2. Type Mode Input
  const checkTypedAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toLowerCase().trim() === currentQuestion.name.toLowerCase()) {
      handleAnswer(true);
    } else {
      handleAnswer(false);
      // Shake animation logic could go here
    }
  };

  // 3. Choice Mode
  const getMultipleChoices = useCallback(() => {
    if (!currentQuestion) return [];
    const others = LOCATIONS.filter(l => l.id !== currentQuestion.id)
                           .sort(() => 0.5 - Math.random())
                           .slice(0, 3);
    const options = [currentQuestion, ...others].sort(() => 0.5 - Math.random());
    return options;
  }, [currentQuestion]);

  const renderGameContent = () => {
    if (!currentQuestion) return null;

    switch (mode) {
      case GameMode.POINT:
      case GameMode.RACE:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h2 className="text-xl md:text-3xl font-bold text-slate-800 text-center">
              Waar ligt <span className="text-blue-600 block text-2xl md:text-4xl mt-2">{currentQuestion.name}?</span>
            </h2>
            {mode === GameMode.RACE && (
              <div className="flex items-center gap-2 text-xl font-mono text-orange-600 font-bold bg-orange-100 px-4 py-2 rounded-lg">
                <Timer className="w-5 h-5" />
                {timeLeft}s
              </div>
            )}
          </div>
        );

      case GameMode.DRAG:
        return (
          <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold text-slate-700 mb-4 text-center">Sleep de naam naar het juiste nummer</h2>
            <div className="flex flex-wrap gap-2 justify-center overflow-y-auto max-h-[150px] p-2 bg-slate-50 rounded-lg inner-shadow">
              {draggedItem ? (
                 <div className="w-full text-center p-4 bg-blue-100 text-blue-800 rounded-lg font-bold border-2 border-blue-300 animate-pulse">
                   Klik nu op: {draggedItem.name}
                   <button onClick={() => setDraggedItem(null)} className="ml-4 text-xs underline text-blue-600">Annuleren</button>
                 </div>
              ) : (
                <button
                  onClick={() => setDraggedItem(currentQuestion)}
                  className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all font-semibold text-slate-700 cursor-grab active:cursor-grabbing"
                >
                  {currentQuestion.name}
                </button>
              )}
            </div>
            <p className="text-center text-sm text-gray-400 mt-2">
              (Vereenvoudigd: Klik op de naam, klik dan op de kaart)
            </p>
          </div>
        );

      case GameMode.TYPE:
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Hoe heet nummer <span className="text-blue-600 text-2xl mx-1">{currentQuestion.label}</span>?</h2>
            <form onSubmit={checkTypedAnswer} className="flex gap-2 w-full max-w-md">
              <input 
                autoFocus
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Typ de naam..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-lg transition-all"
              />
              <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors">
                <ArrowRight />
              </button>
            </form>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
                <button onClick={() => setUserInput(userInput + "ë")} className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300">ë</button>
                <button onClick={() => setUserInput(userInput + "ï")} className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300">ï</button>
            </div>
          </div>
        );

      case GameMode.CHOICE:
        const choices = getMultipleChoices();
        return (
          <div className="flex flex-col items-center justify-center space-y-4 w-full">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Wat is nummer <span className="text-blue-600 text-2xl mx-1">{currentQuestion.label}</span>?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              {choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleAnswer(c.id === currentQuestion.id)}
                  className="p-4 bg-white border-2 border-slate-100 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all font-semibold text-slate-700 text-left shadow-sm active:scale-95"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // --- Main Render ---

  if (mode === GameMode.MENU) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
        <header className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-blue-600 mb-4 tracking-tight drop-shadow-sm">Junior Geo Master</h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Leer alle werelddelen, wateren en gebieden. Kies een oefening en word een topografie expert!
          </p>
        </header>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModeCard 
            title="Aanwijzen" 
            icon={Pointer} 
            color="blue"
            description="De app noemt een naam, jij klikt op de juiste plek." 
            onClick={() => startGame(GameMode.POINT)} 
          />
          <ModeCard 
            title="Slepen" 
            icon={Move} 
            color="green"
            description="Sleep de kaartjes naar de juiste nummers op de kaart." 
            onClick={() => startGame(GameMode.DRAG)} 
          />
          <ModeCard 
            title="Meerkeuze" 
            icon={ListTodo} 
            color="orange"
            description="Kies het juiste antwoord uit vier opties." 
            onClick={() => startGame(GameMode.CHOICE)} 
          />
          <ModeCard 
            title="Invullen" 
            icon={Type} 
            color="purple"
            description="Typ de juiste naam bij het aangewezen nummer." 
            onClick={() => startGame(GameMode.TYPE)} 
          />
          <ModeCard 
            title="Race" 
            icon={Timer} 
            color="red"
            description="Wijs zo snel mogelijk de gebieden aan binnen de tijd!" 
            onClick={() => startGame(GameMode.RACE)} 
          />
        </div>
        
        <footer className="mt-16 text-center text-slate-400 text-sm">
            Gebaseerd op Junior Einstein lesmateriaal • Werelddelen en Wateren Groep 8
        </footer>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <Results 
          score={score} 
          total={mode === GameMode.RACE ? score : questions.length} 
          mode={mode}
          onRetry={() => startGame(mode)} 
          onHome={() => setMode(GameMode.MENU)} 
        />
      </div>
    );
  }

  const shouldHighlightActive = mode === GameMode.TYPE || mode === GameMode.CHOICE;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white shadow-sm p-4 z-10 flex justify-between items-center shrink-0">
        <button 
          onClick={() => setMode(GameMode.MENU)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
        >
          <MapIcon className="w-5 h-5" />
          <span className="hidden md:inline">Menu</span>
        </button>

        <div className="flex gap-4 items-center">
            {/* Progress Bar */}
            {mode !== GameMode.RACE && (
                <div className="hidden md:flex flex-col w-32 md:w-48">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                    <span>Vraag {currentQIndex + 1}/{questions.length}</span>
                    <span>{Math.round(((currentQIndex)/questions.length)*100)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                    className="h-full bg-blue-500 transition-all duration-500 ease-out" 
                    style={{ width: `${((currentQIndex)/questions.length)*100}%` }}
                    />
                </div>
                </div>
            )}
            
            {/* Score */}
            <div className="px-4 py-1 bg-blue-50 text-blue-700 rounded-full font-bold border border-blue-100">
                Score: {score}
            </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        
        {/* Map Section */}
        <div className={`flex-1 p-4 md:p-8 flex items-center justify-center relative ${mode !== GameMode.POINT && mode !== GameMode.RACE ? 'order-2 md:order-1' : ''}`}>
          <div className="w-full max-w-5xl relative">
             <WorldMap 
                locations={LOCATIONS} 
                onLocationClick={handleMapClick}
                activeLocationId={shouldHighlightActive ? currentQuestion?.id : null}
                correctIds={correctIds}
                wrongId={wrongId}
                dropTargetId={draggedItem ? 'any' : null} // Simplified drag visual
                showLabels={true}
                // Only allow clicking in point/drag/race modes, else purely visual
                showTooltips={mode === GameMode.MENU} 
             />
             
             {/* Feedback Overlay */}
             {feedbackMsg && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
                   <div className={`px-6 py-3 rounded-full text-white font-bold text-xl shadow-lg transform transition-all animate-bounce ${feedbackMsg.includes("Goed") ? 'bg-green-500' : 'bg-orange-500'}`}>
                     {feedbackMsg}
                   </div>
                </div>
             )}
          </div>
        </div>

        {/* Interaction Panel */}
        <div className={`
          bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:shadow-[-4px_0_20px_rgba(0,0,0,0.05)] 
          p-6 md:w-80 lg:w-96 shrink-0 z-20 flex flex-col justify-center
          ${mode !== GameMode.POINT && mode !== GameMode.RACE ? 'order-1 md:order-2 h-auto min-h-[200px] border-b md:border-l border-slate-100' : 'h-[150px] md:h-auto border-t md:border-l border-slate-100'}
        `}>
           {renderGameContent()}
        </div>
      </div>
    </div>
  );
};

export default App;