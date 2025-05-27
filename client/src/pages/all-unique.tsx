import { useState } from "react";
import { ProblemsSidebar } from "@/components/ProblemsSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AlgorithmStep {
  step: number;
  description: string;
  details: string;
  uniqueSet: Set<string>;
  action: 'initialize' | 'add_item' | 'duplicate_found' | 'size_comparison' | 'result';
  result?: boolean;
  currentItem?: string;
  currentIndex?: number;
  arrayProcessing: string;
  highlight?: string;
  originalLength: number;
  setSize: number;
}

export function AllUniquePlayground() {
  const [inputArray, setInputArray] = useState('q,r,s,a');
  const [result, setResult] = useState<boolean | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);

  const allUniqueWithSteps = (items: string[]) => {
    const steps: AlgorithmStep[] = [];
    const uniqueSet = new Set<string>();
    
    steps.push({
      step: 1,
      description: "Initialize empty Set to track unique items",
      details: `Starting with array of ${items.length} items: [${items.join(', ')}]`,
      uniqueSet: new Set(),
      action: 'initialize',
      arrayProcessing: items.map(item => `<span class="px-2 py-1 rounded border">"${item}"</span>`).join(' '),
      originalLength: items.length,
      setSize: 0
    });

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const beforeSize = uniqueSet.size;
      
      const arrayVisual = items.map((itm, idx) => {
        if (idx < i) {
          return `<span class="px-2 py-1 rounded bg-gray-100 text-gray-600">"${itm}"</span>`;
        } else if (idx === i) {
          return `<span class="px-2 py-1 rounded bg-blue-100 text-blue-800 font-bold">"${itm}"</span>`;
        } else {
          return `<span class="px-2 py-1 rounded border">"${itm}"</span>`;
        }
      }).join(' ');

      if (uniqueSet.has(item)) {
        steps.push({
          step: steps.length + 1,
          description: `Duplicate found! "${item}" already exists in Set`,
          details: `"${item}" was already added to the Set. Array contains duplicates.`,
          uniqueSet: new Set(uniqueSet),
          action: 'duplicate_found',
          result: false,
          currentItem: item,
          currentIndex: i,
          arrayProcessing: arrayVisual.replace(`">${item}"<`, ` bg-red-100 text-red-800 font-bold">"${item}"<`),
          highlight: item,
          originalLength: items.length,
          setSize: uniqueSet.size
        });
        return { result: false, steps };
      }

      uniqueSet.add(item);

      steps.push({
        step: steps.length + 1,
        description: `Adding "${item}" to Set`,
        details: `"${item}" is unique so far. Set size: ${beforeSize} → ${uniqueSet.size}`,
        uniqueSet: new Set(uniqueSet),
        action: 'add_item',
        currentItem: item,
        currentIndex: i,
        arrayProcessing: arrayVisual.replace(`">${item}"<`, ` bg-emerald-100 text-emerald-800 font-bold">"${item}"<`),
        highlight: item,
        originalLength: items.length,
        setSize: uniqueSet.size
      });
    }

    steps.push({
      step: steps.length + 1,
      description: "Comparing Set size with original array length",
      details: `Set size: ${uniqueSet.size}, Array length: ${items.length}. ${uniqueSet.size === items.length ? 'All items are unique!' : 'Duplicates detected!'}`,
      uniqueSet: new Set(uniqueSet),
      action: 'size_comparison',
      arrayProcessing: items.map(item => `<span class="px-2 py-1 rounded bg-emerald-100 text-emerald-800">"${item}"</span>`).join(' '),
      originalLength: items.length,
      setSize: uniqueSet.size
    });

    const isUnique = uniqueSet.size === items.length;
    
    steps.push({
      step: steps.length + 1,
      description: `Result: ${isUnique ? 'All items are unique' : 'Array contains duplicates'}`,
      details: `Final check: ${uniqueSet.size} unique items ${isUnique ? '==' : '!='} ${items.length} total items`,
      uniqueSet: new Set(uniqueSet),
      action: 'result',
      result: isUnique,
      arrayProcessing: items.map(item => `<span class="px-2 py-1 rounded ${isUnique ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">"${item}"</span>`).join(' '),
      originalLength: items.length,
      setSize: uniqueSet.size
    });

    return { result: isUnique, steps };
  };

  const parseArray = (input: string): string[] => {
    return input.split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  const runAlgorithm = () => {
    const items = parseArray(inputArray);
    
    if (items.length === 0) {
      alert('Please enter a valid array (comma-separated items)');
      return;
    }

    const startTime = performance.now();
    const { result: isUnique, steps: algorithmSteps } = allUniqueWithSteps(items);
    const endTime = performance.now();
    
    setResult(isUnique);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testArray: string[]) => {
    setInputArray(testArray.join(','));
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: isUnique, steps: algorithmSteps } = allUniqueWithSteps(testArray);
      const endTime = performance.now();
      
      setResult(isUnique);
      setSteps(algorithmSteps);
      setCurrentStep(0);
      setExecutionTime(endTime - startTime);
      setShowVisualization(true);
    }, 100);
  };

  const resetPlayground = () => {
    setInputArray("");
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setShowVisualization(false);
    setExecutionTime(0);
  };

  const testCases: [string[], boolean][] = [
    [["q", "r", "s", "a"], true],
    [["q", "r", "s", "a", "r", "z"], false],
    [["red", "blue", "yellow", "green", "orange"], true],
    [["cat", "cat", "dog"], false],
    [["a", "u", "t", "u", "m", "n"], false],
    [["x"], true],
    [[], true]
  ];

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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">All Unique</span>
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-check-double text-green-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">All Unique</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that takes an array and returns true if all items in the array are unique, false otherwise.
                This efficiently detects duplicates using Set properties.
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
              <Label htmlFor="inputArray" className="block text-sm font-medium text-slate-700 mb-2">
                Array Items (comma-separated)
              </Label>
              <Input
                id="inputArray"
                type="text"
                value={inputArray}
                onChange={(e) => setInputArray(e.target.value)}
                className="font-mono"
                placeholder="e.g. q,r,s,a"
              />
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-play mr-2"></i>
                Check if All Unique
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
                <div className={`p-4 rounded-lg border-l-4 flex items-center space-x-3 ${
                  result
                    ? 'border-emerald-400 bg-emerald-50 animate-pulse-success'
                    : 'border-red-400 bg-red-50 animate-pulse-error'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    result
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    <i className={`fas ${result ? 'fa-check' : 'fa-times'}`}></i>
                  </div>
                  <div>
                    <div className={`font-semibold ${
                      result ? 'text-emerald-800' : 'text-red-800'
                    }`}>
                      {result ? '✓ ALL UNIQUE' : '✗ DUPLICATES FOUND'}
                    </div>
                    <div className={`text-sm opacity-75 ${
                      result ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      Array contains {result ? 'all unique items' : 'duplicate items'}
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
                  step.action === 'result' && step.result === true ? 'border-emerald-400' :
                  step.action === 'duplicate_found' || (step.action === 'result' && step.result === false) ? 'border-red-400' :
                  'border-blue-400'
                }`}>
                  <div className="font-medium text-slate-900 mb-2">{step.description}</div>
                  <div className="text-sm text-slate-600">{step.details}</div>
                </div>
              </div>

              {/* Set Visualization */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Set Contents</h4>
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-lg font-mono text-sm">
                  {step.uniqueSet.size === 0 ? (
                    <span className="text-slate-500">// Empty Set</span>
                  ) : (
                    <div>
                      <span className="text-slate-500">Set: </span>
                      {`{${Array.from(step.uniqueSet).map(item => `"${item}"`).join(', ')}}`}
                      <div className="text-xs text-slate-400 mt-1">Size: {step.setSize}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Array Processing Visualization */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Array Processing</h4>
                <div 
                  className="font-mono text-lg tracking-wider min-h-[3rem] flex items-center flex-wrap gap-2"
                  dangerouslySetInnerHTML={{ __html: step.arrayProcessing || '' }}
                />
              </div>

              {/* Size Comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Original Array</h4>
                  <div className="text-sm text-blue-700">
                    <div>Length: {step.originalLength}</div>
                    <div>Total items including duplicates</div>
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-800 mb-2">Unique Set</h4>
                  <div className="text-sm text-emerald-700">
                    <div>Size: {step.setSize}</div>
                    <div>Only unique items</div>
                  </div>
                </div>
              </div>
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
                {testCases.map(([array, expected], index) => (
                  <div
                    key={index}
                    onClick={() => runTestCase(array)}
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono truncate">
                        [{array.map(item => `"${item}"`).join(', ')}]
                      </code>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      expected
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {expected ? '✓' : '✗'}
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
                        <span className="text-blue-400">const</span> <span className="text-yellow-300">allUnique</span> = <span className="text-slate-400">(</span><span className="text-orange-300">items</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                        {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">uniqueItems</span> = <span className="text-blue-400">new</span> <span className="text-purple-400">Set</span><span className="text-slate-400">(</span><span className="text-orange-300">items</span><span className="text-slate-400">);</span>{'\n'}
                        {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">uniqueItems</span><span className="text-slate-400">.</span><span className="text-yellow-300">size</span> === <span className="text-orange-300">items</span><span className="text-slate-400">.</span><span className="text-yellow-300">length</span><span className="text-slate-400">;</span>{'\n'}
                        <span className="text-slate-400">{`};`}</span>
                      </code>
                    </pre>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2">Algorithm Steps</h4>
                      <ol className="text-sm text-emerald-700 space-y-1 list-decimal list-inside">
                        <li>Create a new Set from the input array</li>
                        <li>Set automatically removes duplicates</li>
                        <li>Compare Set size with array length</li>
                        <li>If equal, all items were unique</li>
                        <li>If different, duplicates were removed</li>
                      </ol>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Complexity Analysis</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div><strong>Time:</strong> O(n) - Single pass to build Set</div>
                        <div><strong>Space:</strong> O(n) - Set storage in worst case</div>
                        <div className="text-xs text-blue-600 mt-2">n = length of input array</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Set constructor automatically handles duplicate removal</li>
                      <li>Size comparison is an elegant way to detect if any duplicates existed</li>
                      <li>Much cleaner than nested loops or manual duplicate tracking</li>
                      <li>Leverages Set's inherent properties rather than fighting them</li>
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