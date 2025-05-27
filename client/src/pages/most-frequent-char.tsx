import { useState } from "react";
import { ProblemsSidebar } from "@/components/ProblemsSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AlgorithmStep {
  step: number;
  description: string;
  details: string;
  count: Record<string, number>;
  action: 'initialize' | 'count' | 'find_best' | 'update_best' | 'final_result';
  result?: string;
  currentChar?: string;
  bestChar?: string | null;
  stringProcessing: string;
  highlight?: string;
}

export function MostFrequentCharPlayground() {
  const [inputString, setInputString] = useState("bookeeper");
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);

  const mostFrequentCharWithSteps = (s: string) => {
    const steps: AlgorithmStep[] = [];
    const count: Record<string, number> = {};
    
    steps.push({
      step: 1,
      description: "Initialize character count tracking",
      details: `Starting with empty count object for string "${s}"`,
      count: {},
      action: 'initialize',
      stringProcessing: '',
      bestChar: null
    });

    // Count characters in string
    let stringVisual = '';
    for (let i = 0; i < s.length; i++) {
      const char = s[i];
      if (!(char in count)) {
        count[char] = 0;
      }
      count[char] += 1;
      stringVisual = s.split('').map((c, idx) => 
        idx <= i ? `<span class="bg-blue-100 text-blue-800 px-1 rounded">${c}</span>` : c
      ).join('');
      
      steps.push({
        step: steps.length + 1,
        description: `Processing character '${char}' at position ${i}`,
        details: `Count for '${char}' is now ${count[char]}`,
        count: { ...count },
        action: 'count',
        currentChar: char,
        stringProcessing: stringVisual,
        highlight: char,
        bestChar: null
      });
    }

    steps.push({
      step: steps.length + 1,
      description: "Character counting complete, now finding most frequent",
      details: "Will iterate through string again to find the first occurrence of the most frequent character",
      count: { ...count },
      action: 'find_best',
      stringProcessing: stringVisual,
      bestChar: null
    });

    // Find best character
    let best: string | null = null;
    let bestVisual = '';
    for (let i = 0; i < s.length; i++) {
      const char = s[i];
      if (best === null || count[char] > count[best]) {
        best = char;
        bestVisual = s.split('').map((c, idx) => 
          idx <= i ? (c === char ? `<span class="bg-emerald-100 text-emerald-800 px-1 rounded font-bold">${c}</span>` : `<span class="bg-gray-100 text-gray-600 px-1 rounded">${c}</span>`) : c
        ).join('');
        
        steps.push({
          step: steps.length + 1,
          description: `New best character found: '${char}' with count ${count[char]}`,
          details: `Character '${char}' appears ${count[char]} times, ${best !== char ? 'more than previous best' : 'setting as first best'}`,
          count: { ...count },
          action: 'update_best',
          currentChar: char,
          stringProcessing: bestVisual,
          highlight: char,
          bestChar: best
        });
      }
    }

    steps.push({
      step: steps.length + 1,
      description: `Most frequent character found: '${best}'`,
      details: `Character '${best}' appears ${count[best!]} times and is the first such character in the string`,
      count: { ...count },
      action: 'final_result',
      result: best!,
      stringProcessing: bestVisual,
      bestChar: best
    });

    return { result: best!, steps };
  };

  const runAlgorithm = () => {
    if (!inputString.trim()) {
      alert('Please enter a string');
      return;
    }

    const startTime = performance.now();
    const { result: mostFrequent, steps: algorithmSteps } = mostFrequentCharWithSteps(inputString.trim());
    const endTime = performance.now();
    
    setResult(mostFrequent);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testString: string) => {
    setInputString(testString);
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: mostFrequent, steps: algorithmSteps } = mostFrequentCharWithSteps(testString);
      const endTime = performance.now();
      
      setResult(mostFrequent);
      setSteps(algorithmSteps);
      setCurrentStep(0);
      setExecutionTime(endTime - startTime);
      setShowVisualization(true);
    }, 100);
  };

  const resetPlayground = () => {
    setInputString("");
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setShowVisualization(false);
    setExecutionTime(0);
  };

  const testCases = [
    ['bookeeper', 'e'],
    ['david', 'd'],
    ['abby', 'b'],
    ['mississippi', 'i'],
    ['potato', 'o'],
    ['eleventennine', 'e']
  ] as const;

  const step = steps[currentStep];

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Problems Sidebar */}
      <ProblemsSidebar />

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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Most Frequent Character</span>
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-chart-bar text-emerald-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Most Frequent Character</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that takes a string and returns the most frequent character. 
                If there are ties, return the character that appears earlier in the string.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <i className="fas fa-clock"></i>
                  <span>Time: O(n)</span>
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

        {/* Main Content */}
        <div className="space-y-6 sm:space-y-8">
          {/* Interactive Playground */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-play text-emerald-600"></i>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Interactive Testing</h3>
            </div>

            <div className="mb-6">
              <Label htmlFor="inputString" className="block text-sm font-medium text-slate-700 mb-2">
                Input String
              </Label>
              <Input
                id="inputString"
                type="text"
                value={inputString}
                onChange={(e) => setInputString(e.target.value)}
                className="font-mono"
                placeholder="Enter a string"
              />
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-play mr-2"></i>
                Find Most Frequent Character
              </Button>
              <Button
                onClick={resetPlayground}
                variant="outline"
                className="px-6"
              >
                <i className="fas fa-undo"></i>
              </Button>
            </div>

            {/* Result Display */}
            {result !== null && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg border-l-4 border-emerald-400 bg-emerald-50 animate-pulse-success flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                    <i className="fas fa-check"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-800">
                      Most Frequent Character: '{result}'
                    </div>
                    <div className="text-sm opacity-75 text-emerald-700">
                      Found in string "{inputString}"
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Execution Time:</span>
                  <span className="font-mono text-sm text-slate-900">{executionTime.toFixed(3)} ms</span>
                </div>
              </div>
            )}
          </div>

          {/* Algorithm Visualization */}
          {showVisualization && steps.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-eye text-violet-600"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Step-by-Step Visualization</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={previousStep}
                    disabled={currentStep === 0}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </Button>
                  <span className="text-sm text-slate-600 px-3">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <Button
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </Button>
                </div>
              </div>

              {/* Current Step Display */}
              <div className="mb-6">
                <div className={`bg-slate-50 rounded-lg p-4 border-l-4 ${
                  step.action === 'final_result' ? 'border-emerald-400' : 'border-blue-400'
                }`}>
                  <div className="font-medium text-slate-900 mb-2">{step.description}</div>
                  <div className="text-sm text-slate-600">{step.details}</div>
                </div>
              </div>

              {/* Character Count Visualization */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Character Count Object</h4>
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-lg font-mono text-sm">
                  {Object.keys(step.count).length === 0 ? (
                    <span className="text-slate-500">// Empty count object</span>
                  ) : (
                    <pre>{JSON.stringify(step.count, null, 2)}</pre>
                  )}
                </div>
              </div>

              {/* String Processing Visualization */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">String Processing</h4>
                <div 
                  className="font-mono text-lg tracking-wider min-h-[2rem] flex items-center"
                  dangerouslySetInnerHTML={{ __html: step.stringProcessing || '' }}
                />
              </div>

              {/* Current Best Character */}
              {step.bestChar && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Current Best Character</h4>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <span className="font-mono text-lg font-semibold text-emerald-800">'{step.bestChar}'</span>
                    <span className="ml-2 text-sm text-emerald-600">
                      (appears {step.count[step.bestChar]} times)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Test Cases and Solution Code */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            {/* Test Cases */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-list-check text-indigo-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Test Cases</h3>
              </div>

              <div className="grid gap-3">
                {testCases.map(([input, expected], index) => (
                  <div
                    key={index}
                    onClick={() => runTestCase(input)}
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200"
                  >
                    <div className="flex items-center space-x-4">
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono">"{input}"</code>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-emerald-100 text-emerald-700">
                      '{expected}'
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution Code */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-code text-amber-600"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Solution Implementation</h3>
                </div>
                <Button
                  onClick={() => setShowSolution(!showSolution)}
                  variant="outline"
                  size="sm"
                >
                  <i className={`fas ${showSolution ? 'fa-eye-slash' : 'fa-eye'} mr-2`}></i>
                  {showSolution ? 'Hide' : 'Show'} Solution
                </Button>
              </div>

              {showSolution && (
                <div className="space-y-6">
                  {/* Solution Code */}
                  <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto">
                    <pre className="text-sm text-slate-300 font-mono">
                      <code>
                        <span className="text-blue-400">const</span> <span className="text-yellow-300">mostFrequentChar</span> = <span className="text-slate-400">(</span><span className="text-orange-300">s</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                        {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">count</span> = <span className="text-slate-400">{`{}`};</span>{'\n'}
                        {'  '}{'\n'}
                        {'  '}<span className="text-gray-500">// Count character frequencies</span>{'\n'}
                        {'  '}<span className="text-purple-400">for</span> <span className="text-slate-400">(</span><span className="text-blue-400">let</span> <span className="text-yellow-300">char</span> <span className="text-purple-400">of</span> <span className="text-orange-300">s</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                        {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(!(</span><span className="text-yellow-300">char</span> <span className="text-purple-400">in</span> <span className="text-yellow-300">count</span><span className="text-slate-400">)) {`{`}</span>{'\n'}
                        {'      '}<span className="text-yellow-300">count</span><span className="text-slate-400">[</span><span className="text-yellow-300">char</span><span className="text-slate-400">] =</span> <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                        {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                        {'    '}<span className="text-yellow-300">count</span><span className="text-slate-400">[</span><span className="text-yellow-300">char</span><span className="text-slate-400">] +=</span> <span className="text-green-400">1</span><span className="text-slate-400">;</span>{'\n'}
                        {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                        {'\n'}
                        {'  '}<span className="text-gray-500">// Find most frequent (earliest in case of tie)</span>{'\n'}
                        {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">best</span> = <span className="text-blue-400">null</span><span className="text-slate-400">;</span>{'\n'}
                        {'  '}<span className="text-purple-400">for</span> <span className="text-slate-400">(</span><span className="text-blue-400">let</span> <span className="text-yellow-300">char</span> <span className="text-purple-400">of</span> <span className="text-orange-300">s</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                        {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">best</span> === <span className="text-blue-400">null</span> || <span className="text-yellow-300">count</span><span className="text-slate-400">[</span><span className="text-yellow-300">char</span><span className="text-slate-400">] &gt;</span> <span className="text-yellow-300">count</span><span className="text-slate-400">[</span><span className="text-yellow-300">best</span><span className="text-slate-400">]) {`{`}</span>{'\n'}
                        {'      '}<span className="text-yellow-300">best</span> = <span className="text-yellow-300">char</span><span className="text-slate-400">;</span>{'\n'}
                        {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                        {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                        {'\n'}
                        {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">best</span><span className="text-slate-400">;</span>{'\n'}
                        <span className="text-slate-400">{`};`}</span>
                      </code>
                    </pre>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2">Algorithm Steps</h4>
                      <ol className="text-sm text-emerald-700 space-y-1 list-decimal list-inside">
                        <li>Initialize character count object</li>
                        <li>Count frequency of each character</li>
                        <li>Iterate through string again</li>
                        <li>Track the best character seen so far</li>
                        <li>Update best when higher frequency found</li>
                      </ol>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Complexity Analysis</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div><strong>Time:</strong> O(n) - Two passes through string</div>
                        <div><strong>Space:</strong> O(n) - Character count object</div>
                        <div className="text-xs text-blue-600 mt-2">n = length of input string</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Two-pass approach: first count frequencies, then find the best</li>
                      <li>Second loop through original string preserves order for tie-breaking</li>
                      <li>Hash table provides O(1) character lookup and counting</li>
                      <li>Early characters automatically win ties due to iteration order</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}