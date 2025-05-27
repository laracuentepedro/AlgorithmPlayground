import { useState } from "react";
import { ProblemsSidebar } from "@/components/ProblemsSidebar";
import { AnagramsPlayground as PlaygroundComponent } from "@/components/AnagramsPlayground";
import { TestCases } from "@/components/TestCases";
import { AlgorithmVisualization } from "@/components/AlgorithmVisualization";
import { SolutionCode } from "@/components/SolutionCode";

export interface AlgorithmStep {
  step: number;
  description: string;
  details: string;
  count: Record<string, number>;
  action: 'initialize' | 'count' | 'process_second' | 'decrement' | 'not_found' | 'final_check' | 'non_zero' | 'success';
  result?: boolean;
  s1Processing: string;
  s2Processing: string;
  highlight?: string;
}

export function AnagramsPlayground() {
  const [string1, setString1] = useState("restful");
  const [string2, setString2] = useState("fluster");
  const [result, setResult] = useState<boolean | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);

  const anagramsWithSteps = (s1: string, s2: string) => {
    const steps: AlgorithmStep[] = [];
    const count: Record<string, number> = {};
    
    steps.push({
      step: 1,
      description: "Initialize character count tracking",
      details: `Starting with empty count object for string "${s1}"`,
      count: {},
      action: 'initialize',
      s1Processing: '',
      s2Processing: ''
    });

    // Count characters in first string
    let s1Visual = '';
    for (let i = 0; i < s1.length; i++) {
      const char = s1[i];
      if (!(char in count)) {
        count[char] = 0;
      }
      count[char] += 1;
      s1Visual = s1.split('').map((c, idx) => 
        idx <= i ? `<span class="bg-blue-100 text-blue-800 px-1 rounded">${c}</span>` : c
      ).join('');
      
      steps.push({
        step: steps.length + 1,
        description: `Processing character '${char}' from first string`,
        details: `Count for '${char}' is now ${count[char]}`,
        count: { ...count },
        action: 'count',
        s1Processing: s1Visual,
        s2Processing: '',
        highlight: char
      });
    }

    steps.push({
      step: steps.length + 1,
      description: `First string processed, now checking second string "${s2}"`,
      details: "Will decrement counts for each character found",
      count: { ...count },
      action: 'process_second',
      s1Processing: s1Visual,
      s2Processing: ''
    });

    // Process second string
    let s2Visual = '';
    for (let i = 0; i < s2.length; i++) {
      const char = s2[i];
      if (count[char] === undefined) {
        s2Visual = s2.split('').map((c, idx) => 
          idx < i ? `<span class="bg-emerald-100 text-emerald-800 px-1 rounded">${c}</span>` : 
          idx === i ? `<span class="bg-red-100 text-red-800 px-1 rounded">${c}</span>` : c
        ).join('');
        
        steps.push({
          step: steps.length + 1,
          description: `Character '${char}' not found in first string`,
          details: "This character doesn't exist in our count - NOT ANAGRAMS",
          count: { ...count },
          action: 'not_found',
          result: false,
          s1Processing: s1Visual,
          s2Processing: s2Visual,
          highlight: char
        });
        return { result: false, steps };
      } else {
        count[char] -= 1;
        s2Visual = s2.split('').map((c, idx) => 
          idx <= i ? `<span class="bg-emerald-100 text-emerald-800 px-1 rounded">${c}</span>` : c
        ).join('');
        
        steps.push({
          step: steps.length + 1,
          description: `Character '${char}' found, decrementing count`,
          details: `Count for '${char}' is now ${count[char]}`,
          count: { ...count },
          action: 'decrement',
          s1Processing: s1Visual,
          s2Processing: s2Visual,
          highlight: char
        });
      }
    }

    steps.push({
      step: steps.length + 1,
      description: "Both strings processed, checking final counts",
      details: "All counts should be zero for anagrams",
      count: { ...count },
      action: 'final_check',
      s1Processing: s1Visual,
      s2Processing: s2Visual
    });

    // Check if all counts are zero
    for (let char in count) {
      if (count[char] !== 0) {
        steps.push({
          step: steps.length + 1,
          description: `Character '${char}' has remaining count ${count[char]}`,
          details: "Not all counts are zero - NOT ANAGRAMS",
          count: { ...count },
          action: 'non_zero',
          result: false,
          s1Processing: s1Visual,
          s2Processing: s2Visual,
          highlight: char
        });
        return { result: false, steps };
      }
    }

    steps.push({
      step: steps.length + 1,
      description: "All character counts are zero",
      details: "Perfect character balance achieved - ANAGRAMS!",
      count: { ...count },
      action: 'success',
      result: true,
      s1Processing: s1Visual,
      s2Processing: s2Visual
    });

    return { result: true, steps };
  };

  const runAlgorithm = () => {
    if (!string1.trim() || !string2.trim()) {
      alert('Please enter both strings');
      return;
    }

    const startTime = performance.now();
    const { result: isAnagram, steps: algorithmSteps } = anagramsWithSteps(string1.trim(), string2.trim());
    const endTime = performance.now();
    
    setResult(isAnagram);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (s1: string, s2: string) => {
    setString1(s1);
    setString2(s2);
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: isAnagram, steps: algorithmSteps } = anagramsWithSteps(s1, s2);
      const endTime = performance.now();
      
      setResult(isAnagram);
      setSteps(algorithmSteps);
      setCurrentStep(0);
      setExecutionTime(endTime - startTime);
      setShowVisualization(true);
    }, 100);
  };

  const resetPlayground = () => {
    setString1("");
    setString2("");
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setShowVisualization(false);
    setExecutionTime(0);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <ProblemsSidebar />
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-code text-white text-sm"></i>
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900">DSA Playground</h1>
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Anagrams</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button className="text-slate-600 hover:text-slate-900 transition-colors p-2">
                <i className="fas fa-bookmark text-sm"></i>
              </button>
              <button className="hidden sm:block text-slate-600 hover:text-slate-900 transition-colors p-2">
                <i className="fas fa-share-alt text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Problem Statement */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-puzzle-piece text-blue-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Anagrams Problem</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that takes two strings and returns <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">true</code> if they are anagrams. 
                Anagrams are strings that contain the same characters, but in any order.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <i className="fas fa-clock"></i>
                  <span>Time: O(n + m)</span>
                </div>
                <div className="flex items-center space-x-2 text-violet-600">
                  <i className="fas fa-memory"></i>
                  <span>Space: O(n)</span>
                </div>
                <div className="flex items-center space-x-2 text-amber-600">
                  <i className="fas fa-layer-group"></i>
                  <span>Difficulty: Easy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="space-y-6 sm:space-y-8">
          {/* Interactive Playground */}
          <PlaygroundComponent
            string1={string1}
            string2={string2}
            result={result}
            executionTime={executionTime}
            onString1Change={setString1}
            onString2Change={setString2}
            onRunAlgorithm={runAlgorithm}
            onReset={resetPlayground}
          />

          {/* Algorithm Visualization */}
          {showVisualization && steps.length > 0 && (
            <AlgorithmVisualization
              steps={steps}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
            />
          )}

          {/* Test Cases and Solution Code - Responsive Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            <TestCases onRunTestCase={runTestCase} />
            <SolutionCode />
          </div>
        </div>
      </div>
    </div>
  );
}
