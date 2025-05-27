import { useState } from "react";
import { ProblemsSidebar } from "@/components/ProblemsSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export interface AlgorithmStep {
  step: number;
  description: string;
  details: string;
  setA: Set<number>;
  result: number[];
  action: 'initialize' | 'build_set' | 'check_item' | 'found_intersection' | 'complete';
  currentItem?: number;
  currentIndex?: number;
  arrayAProcessing: string;
  arrayBProcessing: string;
  highlight?: number;
  approach: 'brute_force' | 'set_optimized';
}

export function IntersectionPlayground() {
  const [arrayA, setArrayA] = useState("4,2,1,6");
  const [arrayB, setArrayB] = useState("3,6,9,2,10");
  const [result, setResult] = useState<number[] | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState<'brute_force' | 'set_optimized'>('set_optimized');

  const intersectionWithSteps = (a: number[], b: number[], approach: 'brute_force' | 'set_optimized') => {
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];
    
    if (approach === 'set_optimized') {
      steps.push({
        step: 1,
        description: "Initialize result array and create Set from first array",
        details: `Converting array A [${a.join(', ')}] to Set for O(1) lookups`,
        setA: new Set(),
        result: [],
        action: 'initialize',
        arrayAProcessing: a.map(num => `<span class="px-2 py-1 rounded border">${num}</span>`).join(' '),
        arrayBProcessing: b.map(num => `<span class="px-2 py-1 rounded border">${num}</span>`).join(' '),
        approach
      });

      const setA = new Set(a);
      
      steps.push({
        step: 2,
        description: "Set created from array A",
        details: `Set A now contains: {${Array.from(setA).join(', ')}}`,
        setA: new Set(setA),
        result: [],
        action: 'build_set',
        arrayAProcessing: a.map(num => `<span class="px-2 py-1 rounded bg-blue-100 text-blue-800">${num}</span>`).join(' '),
        arrayBProcessing: b.map(num => `<span class="px-2 py-1 rounded border">${num}</span>`).join(' '),
        approach
      });

      for (let i = 0; i < b.length; i++) {
        const item = b[i];
        const arrayBVisual = b.map((num, idx) => {
          if (idx < i) {
            return `<span class="px-2 py-1 rounded bg-gray-100 text-gray-600">${num}</span>`;
          } else if (idx === i) {
            return `<span class="px-2 py-1 rounded bg-violet-100 text-violet-800 font-bold">${num}</span>`;
          } else {
            return `<span class="px-2 py-1 rounded border">${num}</span>`;
          }
        }).join(' ');

        if (setA.has(item)) {
          result.push(item);
          steps.push({
            step: steps.length + 1,
            description: `Found intersection: ${item} exists in Set A`,
            details: `Adding ${item} to result. Current result: [${result.join(', ')}]`,
            setA: new Set(setA),
            result: [...result],
            action: 'found_intersection',
            currentItem: item,
            currentIndex: i,
            arrayAProcessing: a.map(num => `<span class="px-2 py-1 rounded ${num === item ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-blue-100 text-blue-800'}">${num}</span>`).join(' '),
            arrayBProcessing: arrayBVisual,
            highlight: item,
            approach
          });
        } else {
          steps.push({
            step: steps.length + 1,
            description: `Checking ${item}: not in Set A`,
            details: `${item} is not in Set A, skipping`,
            setA: new Set(setA),
            result: [...result],
            action: 'check_item',
            currentItem: item,
            currentIndex: i,
            arrayAProcessing: a.map(num => `<span class="px-2 py-1 rounded bg-blue-100 text-blue-800">${num}</span>`).join(' '),
            arrayBProcessing: arrayBVisual,
            highlight: item,
            approach
          });
        }
      }
    } else {
      // Brute force approach
      steps.push({
        step: 1,
        description: "Initialize result array (Brute Force Approach)",
        details: `Will check each element of B against all elements of A`,
        setA: new Set(),
        result: [],
        action: 'initialize',
        arrayAProcessing: a.map(num => `<span class="px-2 py-1 rounded border">${num}</span>`).join(' '),
        arrayBProcessing: b.map(num => `<span class="px-2 py-1 rounded border">${num}</span>`).join(' '),
        approach
      });

      for (let i = 0; i < b.length; i++) {
        const item = b[i];
        const arrayBVisual = b.map((num, idx) => {
          if (idx < i) {
            return `<span class="px-2 py-1 rounded bg-gray-100 text-gray-600">${num}</span>`;
          } else if (idx === i) {
            return `<span class="px-2 py-1 rounded bg-violet-100 text-violet-800 font-bold">${num}</span>`;
          } else {
            return `<span class="px-2 py-1 rounded border">${num}</span>`;
          }
        }).join(' ');

        if (a.includes(item)) {
          result.push(item);
          steps.push({
            step: steps.length + 1,
            description: `Found intersection: ${item} exists in array A`,
            details: `Scanning array A... found ${item}! Adding to result: [${result.join(', ')}]`,
            setA: new Set(),
            result: [...result],
            action: 'found_intersection',
            currentItem: item,
            currentIndex: i,
            arrayAProcessing: a.map(num => `<span class="px-2 py-1 rounded ${num === item ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-red-100 text-red-600'}">${num}</span>`).join(' '),
            arrayBProcessing: arrayBVisual,
            highlight: item,
            approach
          });
        } else {
          steps.push({
            step: steps.length + 1,
            description: `Checking ${item}: not found in array A`,
            details: `Scanned all of array A, ${item} not found`,
            setA: new Set(),
            result: [...result],
            action: 'check_item',
            currentItem: item,
            currentIndex: i,
            arrayAProcessing: a.map(num => `<span class="px-2 py-1 rounded bg-red-100 text-red-600">${num}</span>`).join(' '),
            arrayBProcessing: arrayBVisual,
            highlight: item,
            approach
          });
        }
      }
    }

    steps.push({
      step: steps.length + 1,
      description: `Algorithm complete! Found ${result.length} intersections`,
      details: `Final result: [${result.join(', ')}]`,
      setA: approach === 'set_optimized' ? new Set(a) : new Set(),
      result: [...result],
      action: 'complete',
      arrayAProcessing: a.map(num => `<span class="px-2 py-1 rounded ${result.includes(num) ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}">${num}</span>`).join(' '),
      arrayBProcessing: b.map(num => `<span class="px-2 py-1 rounded ${result.includes(num) ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}">${num}</span>`).join(' '),
      approach
    });

    return { result, steps };
  };

  const parseArray = (input: string): number[] => {
    return input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  };

  const runAlgorithm = () => {
    const a = parseArray(arrayA);
    const b = parseArray(arrayB);
    
    if (a.length === 0 || b.length === 0) {
      alert('Please enter valid arrays (comma-separated numbers)');
      return;
    }

    const startTime = performance.now();
    const { result: intersection, steps: algorithmSteps } = intersectionWithSteps(a, b, selectedApproach);
    const endTime = performance.now();
    
    setResult(intersection);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testA: number[], testB: number[]) => {
    setArrayA(testA.join(','));
    setArrayB(testB.join(','));
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: intersection, steps: algorithmSteps } = intersectionWithSteps(testA, testB, selectedApproach);
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

  const testCases: [number[], number[], number[]][] = [
    [[4, 2, 1, 6], [3, 6, 9, 2, 10], [2, 6]],
    [[2, 4, 6], [4, 2], [2, 4]],
    [[4, 2, 1], [1, 2, 4, 6], [1, 2, 4]],
    [[0, 1, 2], [10, 11], []],
    [[1, 3, 5], [2, 4, 6], []]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Intersection</span>
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-intersection text-teal-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Array Intersection</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that takes two arrays and returns a new array containing elements that are in both arrays. 
                Each input array does not contain duplicates.
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

            {/* Algorithm Approach Selection */}
            <div className="mb-6">
              <Label className="block text-sm font-medium text-slate-700 mb-3">
                Algorithm Approach
              </Label>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setSelectedApproach('set_optimized')}
                  variant={selectedApproach === 'set_optimized' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-rocket"></i>
                  <span>Set Optimized O(n+m)</span>
                </Button>
                <Button
                  onClick={() => setSelectedApproach('brute_force')}
                  variant={selectedApproach === 'brute_force' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-turtle"></i>
                  <span>Brute Force O(n×m)</span>
                </Button>
              </div>
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
                  placeholder="e.g. 4,2,1,6"
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
                  placeholder="e.g. 3,6,9,2,10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-play mr-2"></i>
                Find Intersection
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
                      Found {result.length} common element{result.length !== 1 ? 's' : ''} using {selectedApproach === 'set_optimized' ? 'Set optimization' : 'brute force'}
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
                  <Badge variant={selectedApproach === 'set_optimized' ? 'default' : 'secondary'}>
                    {selectedApproach === 'set_optimized' ? 'Set Optimized' : 'Brute Force'}
                  </Badge>
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
                  step.action === 'found_intersection' ? 'border-emerald-400' : 'border-blue-400'
                }`}>
                  <div className="font-medium text-slate-900 mb-2">{step.description}</div>
                  <div className="text-sm text-slate-600">{step.details}</div>
                </div>
              </div>

              {/* Set Visualization (for optimized approach) */}
              {selectedApproach === 'set_optimized' && step.setA.size > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Set A (for O(1) lookups)</h4>
                  <div className="bg-slate-900 text-emerald-400 p-4 rounded-lg font-mono text-sm">
                    <span className="text-slate-500">Set: </span>
                    {`{${Array.from(step.setA).join(', ')}}`}
                  </div>
                </div>
              )}

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
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Array B (processing)</h4>
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
                    {step.result.length} intersection{step.result.length !== 1 ? 's' : ''} found
                  </span>
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
                    <div className="flex items-center space-x-4">
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono">[{a.join(',')}]</code>
                      <span className="text-slate-400">∩</span>
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono">[{b.join(',')}]</code>
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
                  {/* Optimized Solution */}
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-3">✅ Optimized Solution (Set)</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">intersection</span> = <span className="text-slate-400">(</span><span className="text-orange-300">a</span><span className="text-slate-400">,</span> <span className="text-orange-300">b</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">result</span> = <span className="text-slate-400">[];</span>{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">setA</span> = <span className="text-blue-400">new</span> <span className="text-purple-400">Set</span><span className="text-slate-400">(</span><span className="text-orange-300">a</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">for</span> <span className="text-slate-400">(</span><span className="text-blue-400">let</span> <span className="text-yellow-300">item</span> <span className="text-purple-400">of</span> <span className="text-orange-300">b</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">setA</span><span className="text-slate-400">.</span><span className="text-yellow-300">has</span><span className="text-slate-400">(</span><span className="text-yellow-300">item</span><span className="text-slate-400">)) {`{`}</span>{'\n'}
                          {'      '}<span className="text-yellow-300">result</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">item</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">result</span><span className="text-slate-400">;</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Brute Force Solution */}
                  <div>
                    <h4 className="font-semibold text-red-800 mb-3">❌ Brute Force (Slow)</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">intersection</span> = <span className="text-slate-400">(</span><span className="text-orange-300">a</span><span className="text-slate-400">,</span> <span className="text-orange-300">b</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">result</span> = <span className="text-slate-400">[];</span>{'\n'}
                          {'  '}<span className="text-purple-400">for</span> <span className="text-slate-400">(</span><span className="text-blue-400">let</span> <span className="text-yellow-300">item</span> <span className="text-purple-400">of</span> <span className="text-orange-300">b</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">a</span><span className="text-slate-400">.</span><span className="text-yellow-300">includes</span><span className="text-slate-400">(</span><span className="text-yellow-300">item</span><span className="text-slate-400">)) {`{`}</span> <span className="text-gray-500">// O(n) lookup!</span>{'\n'}
                          {'      '}<span className="text-yellow-300">result</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">item</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">result</span><span className="text-slate-400">;</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2">Set Optimized</h4>
                      <div className="text-sm text-emerald-700 space-y-1">
                        <div><strong>Time:</strong> O(n + m)</div>
                        <div><strong>Space:</strong> O(n)</div>
                        <div className="text-xs text-emerald-600 mt-2">Convert array to Set for O(1) lookups</div>
                      </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Brute Force</h4>
                      <div className="text-sm text-red-700 space-y-1">
                        <div><strong>Time:</strong> O(n × m)</div>
                        <div><strong>Space:</strong> O(min(n,m))</div>
                        <div className="text-xs text-red-600 mt-2">Array.includes() scans entire array</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Set data structure provides O(1) average lookup time vs O(n) for array.includes()</li>
                      <li>Converting first array to Set allows efficient checking of second array</li>
                      <li>With large datasets, the difference becomes dramatic (30k elements: 30k vs 900M operations)</li>
                      <li>Space trade-off: extra O(n) space for massive time savings</li>
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