import React, { useState } from 'react';
import { generateLinkedInPosts } from './services/geminiService';
import { GeneratorResponse, AppState } from './types';
import PostCard from './components/PostCard';
import { Sparkles, Send, AlertCircle, FileText, Feather, MessageSquare, Copy, Check, Lightbulb } from 'lucide-react';

export default function App() {
  const [draft, setDraft] = useState('');
  const [result, setResult] = useState<GeneratorResponse | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!draft.trim()) return;

    setAppState(AppState.GENERATING);
    setError(null);
    setActiveTab(0);

    try {
      const response = await generateLinkedInPosts(draft);
      setResult(response);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please check your API key and try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handlePostChange = (index: number, newContent: string) => {
    if (!result) return;
    const newPosts = [...result.posts];
    newPosts[index] = { ...newPosts[index], content: newContent };
    setResult({ ...result, posts: newPosts });
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-900 selection:text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-md">
              <Feather className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-100">Musings</span>
          </div>
          <div className="text-sm text-slate-400 hidden sm:block">
            AI Content Strategist
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 sticky top-24">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Your Draft
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Paste your thoughts, article, or rough notes here.
                </p>
              </div>
              
              <div className="relative">
                <textarea
                  className="w-full h-[600px] p-4 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all resize-none text-sm leading-relaxed text-slate-300 placeholder-slate-600"
                  placeholder="e.g. I just learned about a new project management technique that saved my team 10 hours this week..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-600">
                  {draft.length} chars
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={appState === AppState.GENERATING || !draft.trim()}
                className={`mt-4 w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium text-white transition-all shadow-md border border-transparent ${
                  appState === AppState.GENERATING || !draft.trim()
                    ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-70'
                    : 'bg-blue-600 hover:bg-blue-500 hover:shadow-lg active:transform active:scale-[0.98]'
                }`}
              >
                {appState === AppState.GENERATING ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Strategizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Magic</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-start space-x-2 text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            {appState === AppState.IDLE && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-blue-500 ml-1" />
                </div>
                <h3 className="text-lg font-medium text-slate-200">Ready to go viral?</h3>
                <p className="text-slate-500 max-w-md mt-2">
                  Enter your draft on the left, and our AI strategist will create 3 optimized variations for you.
                </p>
              </div>
            )}

            {appState === AppState.SUCCESS && result && (
              <div className="space-y-6 animate-fade-in">
                {/* Result Container - Matching Draft Container Styling */}
                <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6">
                  
                  {/* Header Area: Title and Independent Tabs */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                    <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      Generated Options
                    </h2>
                    
                    <div className="flex space-x-2 bg-slate-950/50 p-1 rounded-lg border border-slate-800">
                      {result.posts.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTab(idx)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                            activeTab === idx 
                              ? 'bg-blue-600 text-white shadow-sm' 
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                          }`}
                        >
                          Option {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Post Content Area */}
                  <div className="relative">
                    <PostCard 
                      post={result.posts[activeTab]} 
                      index={activeTab} 
                      onContentChange={(newContent) => handlePostChange(activeTab, newContent)}
                    />
                    
                    <button
                      onClick={() => handleCopy(result.posts[activeTab].content, activeTab)}
                      className="absolute bottom-3 right-3 p-2 bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-blue-400 rounded-lg backdrop-blur-sm border border-slate-700 transition-all shadow-sm z-10"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === activeTab ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    </button>
                  </div>

                  {/* Rationale Section */}
                  <div className="mt-5 p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Strategy Rationale
                      </h4>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {result.posts[activeTab].rationale}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}