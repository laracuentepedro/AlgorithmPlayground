import { useState } from "react";
import { ProblemsSidebar } from "@/components/ProblemsSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AlgorithmStep {
  step: number;
  description: string;
  details: string;
  countA: Record<string, number>;
  countB: Record<string, number>;
  result: string[];
  action: 'initialize' | 'count_a' | 'count_b' | 'find_intersections' | 'add_to_result' | 'complete';
  currentElement?: string;
  currentArray?: 'A' | 'B';
  arrayAProcessing: string;
  arrayBProcessing: string;
  highlight?: string;
  minCount?: number;
}

export function IntersectionWithDupesPlayground() {
  const [arrayA, setArrayA] = useState("a,b,c,b");
  const [arrayB, setArrayB] = useState("x,y,b,b");
  const [result, setResult] = useState<string[] | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);

  const intersectionWithDupesSteps = (a: string[], b: string[]) => {
    const steps: AlgorithmStep[] = [];
    const countA: Record<string, number> = {};
    const countB: Record<string, number> = {};
    const result: string[] = [];

    steps.push({
      step: 1,
      description: "Initialize frequency counters for both arrays",
      details: `Will count occurrences in array A: [${a.join(', ')}] and array B: [${b.join(', ')}]`,
      countA: {},
      countB: {},
      result: [],
      action: 'initialize',
      arrayAProcessing: a.map(item => `<span class="px-2 py-1 rounded border">"${item}"</span>`).join(' '),
      arrayBProcessing: b.map(item => `<span class="px-2 py-1 rounded border">"${item}"</span>`).join(' ')
    });

    // Count elements in array A
    for (let i = 0; i < a.length; i++) {
      const element = a[i];
      if (!(element in countA)) {
        countA[element] = 0;
      }
      countA[element] += 1;

      const arrayAVisual = a.map((item, idx) => {
        if (idx <= i) {
          return `<span class="px-2 py-1 rounded ${idx === i ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-gray-100 text-gray-600'}">"${item}"</span>`;
        }
        return `<span class="px-2 py-1 rounded border">"${item}"</span>`;
      }).join(' ');

      steps.push({
        step: steps.length + 1,
        description: `Counting "${element}" in array A`,
        details: `Element "${element}" now appears ${countA[element]} time${countA[element] !== 1 ? 's' : ''} in array A`,
        countA: { ...countA },
        countB: {},
        result: [],
        action: 'count_a',
        currentElement: element,
        currentArray: 'A',
        arrayAProcessing: arrayAVisual,
        arrayBProcessing: b.map(item => `<span class="px-2 py-1 rounded border">"${item}"</span>`).join(' '),
        highlight: element
      });
    }

    // Count elements in array B
    for (let i = 0; i < b.length; i++) {
      const element = b[i];
      if (!(element in countB)) {
        countB[element] = 0;
      }
      countB[element] += 1;

      const arrayBVisual = b.map((item, idx) => {
        if (idx <= i) {
          return `<span class="px-2 py-1 rounded ${idx === i ? 'bg-violet-100 text-violet-800 font-bold' : 'bg-gray-100 text-gray-600'}">"${item}"</span>`;
        }
        return `<span class="px-2 py-1 rounded border">"${item}"</span>`;
      }).join(' ');

      steps.push({
        step: steps.length + 1,
        description: `Counting "${element}" in array B`,
        details: `Element "${element}" now appears ${countB[element]} time${countB[element] !== 1 ? 's' : ''} in array B`,
        countA: { ...countA },
        countB: { ...countB },
        result: [],
        action: 'count_b',
        currentElement: element,
        currentArray: 'B',
        arrayAProcessing: a.map(item => `<span class="px-2 py-1 rounded bg-gray-100 text-gray-600">"${item}"</span>`).join(' '),
        arrayBProcessing: arrayBVisual,
        highlight: element
      });
    }

    steps.push({
      step: steps.length + 1,
      description: "Finding intersections with minimum counts",
      details: "For each element in array A, check if it exists in array B and take minimum count",
      countA: { ...countA },
      countB: { ...countB },
      result: [],
      action: 'find_intersections',
      arrayAProcessing: a.map(item => `<span class="px-2 py-1 rounded bg-gray-100 text-gray-600">"${item}"</span>`).join(' '),
      arrayBProcessing: b.map(item => `<span class="px-2 py-1 rounded bg-gray-100 text-gray-600">"${item}"</span>`).join(' ')
    });

    // Find intersections
    for (let element in countA) {
      if (element in countB) {
        const minCount = Math.min(countA[element], countB[element]);
        
        for (let i = 0; i < minCount; i++) {
          result.push(element);
        }

        steps.push({
          step: steps.length + 1,
          description: `Adding "${element}" to result ${minCount} time${minCount !== 1 ? 's' : ''}`,
          details: `"${element}": min(${countA[element]}, ${countB[element]}) = ${minCount}. Current result: [${result.join(', ')}]`,
          countA: { ...countA },
          countB: { ...countB },
          result: [...result],
          action: 'add_to_result',
          currentElement: element,
          arrayAProcessing: a.map(item => `<span class="px-2 py-1 rounded ${item === element ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-gray-100 text-gray-600'}">"${item}"</span>`).join(' '),
          arrayBProcessing: b.map(item => `<span class="px-2 py-1 rounded ${item === element ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-gray-100 text-gray-600'}">"${item}"</span>`).join(' '),
          highlight: element,
          minCount: minCount
        });
      }
    }

    steps.push({
      step: steps.length + 1,
      description: `Algorithm complete! Found ${result.length} intersection${result.length !== 1 ? 's' : ''}`,
      details: `Final result: [${result.join(', ')}] - elements appear with their minimum frequency from both arrays`,
      countA: { ...countA },
      countB: { ...countB },
      result: [...result],
      action: 'complete',
      arrayAProcessing: a.map(item => `<span class="px-2 py-1 rounded ${result.includes(item) ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}">"${item}"</span>`).join(' '),
      arrayBProcessing: b.map(item => `<span class="px-2 py-1 rounded ${result.includes(item) ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}">"${item}"</span>`).join(' ')
    });

    return { result, steps };
  };

  const parseArray = (input: string): string[] => {
    return input.split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  const runAlgorithm = () => {
    const a = parseArray(arrayA);
    const b = parseArray(arrayB);
    
    if (a.length === 0 || b.length === 0) {
      alert('Please enter valid arrays (comma-separated items)');
      return;
    }

    const startTime = performance.now();
    const { result: intersection, steps: algorithmSteps } = intersectionWithDupesSteps(a, b);
    const endTime = performance.now();
    
    setResult(intersection);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testA: string[], testB: string[]) => {
    setArrayA(testA.join(','));
    setArrayB(testB.join(','));
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: intersection, steps: algorithmSteps } = intersectionWithDupesSteps(testA, testB);
      const endTime = performance.now();
      
      setResult(intersection);
      setSteps(algorithmSteps);
      setCurrentStep(0);
      setExecutionTime(endTime - startTime);
      setShowVisualization(true);
    }, 100);
  };

  const resetPlayground = () => {
    setArrayA("");
    setArrayB("");
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setShowVisualization(false);
    setExecutionTime(0);
  };

  const testCases: [string[], string[], string[]][] = [
    [["a", "b", "c", "b"], ["x", "y", "b", "b"], ["b", "b"]],
    [["q", "b", "m", "s", "s", "s"], ["s", "m", "s"], ["m", "s", "s"]],
    [["p", "r", "r", "r"], ["r"], ["r"]],
    [["r"], ["p", "r", "r", "r"], ["r"]],
    [["t", "v", "u"], ["g", "e", "d", "f"], []],
    [["a", "a", "a", "a", "a", "a"], ["a", "a", "a", "a"], ["a", "a", "a", "a"]]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Intersection with Dupes</span>
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-copy text-purple-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Intersection with Duplicates</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that takes two arrays and returns elements common to both, preserving duplicates. 
                Elements should appear as many times as they occur in both arrays (minimum frequency).
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <i className="fas fa-clock"></i>
                  <span>Time: O(n + m)</span>
                </div>
                <div className="flex items-center space-x-2 text-violet-600">
                  <i className="fas fa-memory"></i>
                  <span>Space: O(n + m)</span>
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

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="arrayA" className="block text-sm font-medium text-slate-700 mb-2">
                  Array A (comma-separated)
                </Label>
                <Input
                  id="arrayA"
                  type="text"
                  value={arrayA}
                  onChange={(e) => setArrayA(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. a,b,c,b"
                />
              </div>
              <div>
                <Label htmlFor="arrayB" className="block text-sm font-medium text-slate-700 mb-2">
                  Array B (comma-separated)
                </Label>
                <Input
                  id="arrayB"
                  type="text"
                  value={arrayB}
                  onChange={(e) => setArrayB(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. x,y,b,b"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-play mr-2"></i>
                Find Intersection with Duplicates
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
                      Intersection: [{result.join(', ')}]
                    </div>
                    <div className="text-sm opacity-75 text-emerald-700">
                      Found {result.length} element{result.length !== 1 ? 's' : ''} with preserved frequencies
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
                  step.action === 'complete' ? 'border-emerald-400' : 
                  step.action === 'add_to_result' ? 'border-emerald-400' : 'border-blue-400'
                }`}>
                  <div className="font-medium text-slate-900 mb-2">{step.description}</div>
                  <div className="text-sm text-slate-600">{step.details}</div>
                  {step.currentArray && (
                    <div className="text-xs text-slate-500 mt-1">
                      Currently processing: Array {step.currentArray}
                    </div>
                  )}
                </div>
              </div>

              {/* Frequency Counters */}
              <div className="mb-6 grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Array A Frequency Count</h4>
                  <div className="bg-slate-900 text-blue-400 p-4 rounded-lg font-mono text-sm">
                    {Object.keys(step.countA).length === 0 ? (
                      <span className="text-slate-500">// Empty count</span>
                    ) : (
                      <pre>{JSON.stringify(step.countA, null, 2)}</pre>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Array B Frequency Count</h4>
                  <div className="bg-slate-900 text-violet-400 p-4 rounded-lg font-mono text-sm">
                    {Object.keys(step.countB).length === 0 ? (
                      <span className="text-slate-500">// Empty count</span>
                    ) : (
                      <pre>{JSON.stringify(step.countB, null, 2)}</pre>
                    )}
                  </div>
                </div>
              </div>

              {/* Array Processing Visualization */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Array A</h4>
                  <div 
                    className="font-mono text-lg tracking-wider min-h-[3rem] flex items-center flex-wrap gap-2"
                    dangerouslySetInnerHTML={{ __html: step.arrayAProcessing || '' }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Array B</h4>
                  <div 
                    className="font-mono text-lg tracking-wider min-h-[3rem] flex items-center flex-wrap gap-2"
                    dangerouslySetInnerHTML={{ __html: step.arrayBProcessing || '' }}
                  />
                </div>
              </div>

              {/* Current Result */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Current Result</h4>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <span className="font-mono text-lg">
                    [{step.result.join(', ')}]
                  </span>
                  <span className="ml-3 text-sm text-emerald-600">
                    {step.result.length} element{step.result.length !== 1 ? 's' : ''} with preserved frequencies
                  </span>
                  {step.minCount !== undefined && (
                    <div className="text-xs text-emerald-600 mt-1">
                      Added "{step.currentElement}" {step.minCount} time{step.minCount !== 1 ? 's' : ''}
                    </div>
                  )}
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
                {testCases.map(([a, b, expected], index) => (
                  <div
                    key={index}
                    onClick={() => runTestCase(a, b)}
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono truncate">
                        [{a.join(',')}]
                      </code>
                      <span className="text-slate-400">∩</span>
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono truncate">
                        [{b.join(',')}]
                      </code>
                    </div>
                    <div className="w-auto px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                      [{expected.join(', ')}]
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
                        <span className="text-blue-400">const</span> <span className="text-yellow-300">intersectionWithDupes</span> = <span className="text-slate-400">(</span><span className="text-orange-300">a</span><span className="text-slate-400">,</span> <span className="text-orange-300">b</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                        {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">count1</span> = <span className="text-yellow-300">eleCount</span><span className="text-slate-400">(</span><span className="text-orange-300">a</span><span className="text-slate-400">);</span>{'\n'}
                        {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">count2</span> = <span className="text-yellow-300">eleCount</span><span className="text-slate-400">(</span><span className="text-orange-300">b</span><span className="text-slate-400">);</span>{'\n'}
                        {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">result</span> = <span className="text-slate-400">[];</span>{'\n'}
                        {'  '}{'\n'}
                        {'  '}<span className="text-purple-400">for</span> <span className="text-slate-400">(</span><span className="text-blue-400">let</span> <span className="text-yellow-300">ele</span> <span className="text-purple-400">in</span> <span className="text-yellow-300">count1</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                        {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">ele</span> <span className="text-purple-400">in</span> <span className="text-yellow-300">count2</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                        {'      '}<span className="text-purple-400">for</span> <span className="text-slate-400">(</span><span className="text-blue-400">let</span> <span className="text-yellow-300">i</span> = <span className="text-green-400">0</span><span className="text-slate-400">;</span> <span className="text-yellow-300">i</span> &lt; <span className="text-purple-400">Math</span><span className="text-slate-400">.</span><span className="text-yellow-300">min</span><span className="text-slate-400">(</span><span className="text-yellow-300">count1</span><span className="text-slate-400">[</span><span className="text-yellow-300">ele</span><span className="text-slate-400">],</span> <span className="text-yellow-300">count2</span><span className="text-slate-400">[</span><span className="text-yellow-300">ele</span><span className="text-slate-400">]);</span> <span className="text-yellow-300">i</span> += <span className="text-green-400">1</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                        {'        '}<span className="text-yellow-300">result</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">ele</span><span className="text-slate-400">);</span>{'\n'}
                        {'      '}<span className="text-slate-400">{`}`}</span>{'\n'}
                        {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                        {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                        {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">result</span><span className="text-slate-400">;</span>{'\n'}
                        <span className="text-slate-400">{`};`}</span>{'\n'}
                        {'\n'}
                        <span className="text-blue-400">const</span> <span className="text-yellow-300">eleCount</span> = <span className="text-slate-400">(</span><span className="text-orange-300">elements</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                        {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">count</span> = <span className="text-slate-400">{`{}`};</span>{'\n'}
                        {'  '}<span className="text-purple-400">for</span> <span className="text-slate-400">(</span><span className="text-blue-400">let</span> <span className="text-yellow-300">ele</span> <span className="text-purple-400">of</span> <span className="text-orange-300">elements</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                        {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(!(</span><span className="text-yellow-300">ele</span> <span className="text-purple-400">in</span> <span className="text-yellow-300">count</span><span className="text-slate-400">)) {`{`}</span>{'\n'}
                        {'      '}<span className="text-yellow-300">count</span><span className="text-slate-400">[</span><span className="text-yellow-300">ele</span><span className="text-slate-400">] =</span> <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                        {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                        {'    '}<span className="text-yellow-300">count</span><span className="text-slate-400">[</span><span className="text-yellow-300">ele</span><span className="text-slate-400">] +=</span> <span className="text-green-400">1</span><span className="text-slate-400">;</span>{'\n'}
                        {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                        {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">count</span><span className="text-slate-400">;</span>{'\n'}
                        <span className="text-slate-400">{`};`}</span>
                      </code>
                    </pre>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2">Algorithm Steps</h4>
                      <ol className="text-sm text-emerald-700 space-y-1 list-decimal list-inside">
                        <li>Count frequency of each element in both arrays</li>
                        <li>For each element in array A</li>
                        <li>Check if it exists in array B</li>
                        <li>Add min(countA, countB) copies to result</li>
                        <li>Return the intersection with duplicates</li>
                      </ol>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Complexity Analysis</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div><strong>Time:</strong> O(n + m) - Count both arrays</div>
                        <div><strong>Space:</strong> O(n + m) - Two frequency maps</div>
                        <div className="text-xs text-blue-600 mt-2">n = length of array A, m = length of array B</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Frequency counting is essential when duplicates matter</li>
                      <li>Math.min() ensures we don't exceed available elements in either array</li>
                      <li>Helper function keeps code clean and reusable</li>
                      <li>Perfect example of when you need more than simple Set intersection</li>
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