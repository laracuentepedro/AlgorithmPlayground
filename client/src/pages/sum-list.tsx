import { useState } from "react";
import { ProblemsSidebar } from "@/components/ProblemsSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Linked List Node class
class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number) {
    this.val = val;
    this.next = null;
  }
}

export interface AlgorithmStep {
  step: number;
  description: string;
  details: string;
  currentSum: number;
  action: 'initialize' | 'traverse' | 'add_value' | 'move_next' | 'complete' | 'recursive_call' | 'base_case';
  currentNode?: number | null;
  linkedListVisualization: string;
  approach: 'iterative' | 'recursive';
  recursionDepth?: number;
  finalSum?: number;
}

export function SumListPlayground() {
  const [inputValues, setInputValues] = useState("2,8,3,-1,7");
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState<'iterative' | 'recursive'>('iterative');

  const createVisualization = (values: number[], currentIndex: number = -1, currentSum: number = 0): string => {
    if (values.length === 0) {
      return '<span class="text-slate-500">null</span>';
    }
    
    const nodes = values.map((val, idx) => {
      const isActive = idx === currentIndex;
      const nodeClass = isActive ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-white border-slate-300';
      const node = `<span class="inline-flex items-center px-3 py-2 rounded-lg border-2 ${nodeClass} font-mono font-semibold">${val}</span>`;
      const arrow = idx < values.length - 1 ? '<span class="mx-2 text-slate-400">→</span>' : '';
      return node + arrow;
    }).join('');
    
    const sumDisplay = currentSum !== 0 ? `<div class="mt-3 text-sm text-emerald-600">Running Sum: <span class="font-mono font-bold text-lg">${currentSum}</span></div>` : '';
    
    return nodes + '<span class="ml-2 text-slate-500">→ null</span>' + sumDisplay;
  };

  const sumListIterative = (values: number[]) => {
    const steps: AlgorithmStep[] = [];
    let sum = 0;
    
    steps.push({
      step: 1,
      description: "Initialize sum to 0 and set current pointer to head",
      details: `Starting traversal of linked list with ${values.length} nodes to calculate sum`,
      currentSum: 0,
      action: 'initialize',
      currentNode: values.length > 0 ? values[0] : null,
      linkedListVisualization: createVisualization(values, values.length > 0 ? 0 : -1, 0),
      approach: 'iterative'
    });

    for (let i = 0; i < values.length; i++) {
      const currentVal = values[i];
      
      steps.push({
        step: steps.length + 1,
        description: `Processing node with value ${currentVal}`,
        details: `Current pointer is at node containing ${currentVal}, current sum is ${sum}`,
        currentSum: sum,
        action: 'traverse',
        currentNode: currentVal,
        linkedListVisualization: createVisualization(values, i, sum),
        approach: 'iterative'
      });

      sum += currentVal;

      steps.push({
        step: steps.length + 1,
        description: `Added ${currentVal} to sum`,
        details: `sum += ${currentVal}, new sum = ${sum}`,
        currentSum: sum,
        action: 'add_value',
        currentNode: currentVal,
        linkedListVisualization: createVisualization(values, i, sum),
        approach: 'iterative'
      });

      if (i < values.length - 1) {
        steps.push({
          step: steps.length + 1,
          description: `Moving to next node`,
          details: `Setting current = current.next, now pointing to ${values[i + 1]}`,
          currentSum: sum,
          action: 'move_next',
          currentNode: values[i + 1],
          linkedListVisualization: createVisualization(values, i + 1, sum),
          approach: 'iterative'
        });
      }
    }

    steps.push({
      step: steps.length + 1,
      description: "Reached end of list (null), sum calculation complete",
      details: `Final sum: ${sum}`,
      currentSum: sum,
      action: 'complete',
      currentNode: null,
      linkedListVisualization: createVisualization(values, -1, sum),
      approach: 'iterative',
      finalSum: sum
    });

    return { result: sum, steps };
  };

  const sumListRecursive = (values: number[]) => {
    const steps: AlgorithmStep[] = [];
    let calculatedSum = 0;
    
    steps.push({
      step: 1,
      description: "Starting recursive sum calculation",
      details: `Beginning recursive traversal of linked list with ${values.length} nodes`,
      currentSum: 0,
      action: 'initialize',
      currentNode: values.length > 0 ? values[0] : null,
      linkedListVisualization: createVisualization(values, values.length > 0 ? 0 : -1, 0),
      approach: 'recursive',
      recursionDepth: 0
    });

    const traverse = (index: number, depth: number): number => {
      if (index >= values.length) {
        steps.push({
          step: steps.length + 1,
          description: `Base case reached: node is null`,
          details: `Recursion depth ${depth}: Return 0 from recursive call`,
          currentSum: 0,
          action: 'base_case',
          currentNode: null,
          linkedListVisualization: createVisualization(values, -1, calculatedSum),
          approach: 'recursive',
          recursionDepth: depth
        });
        return 0;
      }

      const currentVal = values[index];

      steps.push({
        step: steps.length + 1,
        description: `Recursive call for node ${currentVal}`,
        details: `Recursion depth ${depth}: Processing node with value ${currentVal}`,
        currentSum: calculatedSum,
        action: 'recursive_call',
        currentNode: currentVal,
        linkedListVisualization: createVisualization(values, index, calculatedSum),
        approach: 'recursive',
        recursionDepth: depth
      });

      const restSum = traverse(index + 1, depth + 1);
      const totalSum = currentVal + restSum;
      
      steps.push({
        step: steps.length + 1,
        description: `Returning ${currentVal} + ${restSum} = ${totalSum}`,
        details: `Recursion depth ${depth}: ${currentVal} + sum of rest (${restSum}) = ${totalSum}`,
        currentSum: totalSum,
        action: 'add_value',
        currentNode: currentVal,
        linkedListVisualization: createVisualization(values, index, totalSum),
        approach: 'recursive',
        recursionDepth: depth
      });

      if (index === 0) {
        calculatedSum = totalSum;
      }

      return totalSum;
    };

    const finalSum = values.length > 0 ? traverse(0, 0) : 0;

    if (values.length === 0) {
      steps.push({
        step: steps.length + 1,
        description: `Base case: head is null`,
        details: `Empty linked list, returning 0`,
        currentSum: 0,
        action: 'base_case',
        currentNode: null,
        linkedListVisualization: createVisualization(values, -1, 0),
        approach: 'recursive',
        recursionDepth: 0
      });
    }

    steps.push({
      step: steps.length + 1,
      description: "Recursive sum calculation complete",
      details: `All recursive calls finished. Final sum: ${finalSum}`,
      currentSum: finalSum,
      action: 'complete',
      currentNode: null,
      linkedListVisualization: createVisualization(values, -1, finalSum),
      approach: 'recursive',
      finalSum: finalSum
    });

    return { result: finalSum, steps };
  };

  const parseValues = (input: string): number[] => {
    if (!input.trim()) return [];
    return input.split(',').map(s => {
      const num = parseFloat(s.trim());
      return isNaN(num) ? 0 : num;
    }).filter((_, index, arr) => input.split(',')[index]?.trim() !== '');
  };

  const runAlgorithm = () => {
    const values = parseValues(inputValues);

    const startTime = performance.now();
    const { result: sum, steps: algorithmSteps } = selectedApproach === 'iterative' 
      ? sumListIterative(values)
      : sumListRecursive(values);
    const endTime = performance.now();
    
    setResult(sum);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testValues: number[]) => {
    setInputValues(testValues.join(','));
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: sum, steps: algorithmSteps } = selectedApproach === 'iterative' 
        ? sumListIterative(testValues)
        : sumListRecursive(testValues);
      const endTime = performance.now();
      
      setResult(sum);
      setSteps(algorithmSteps);
      setCurrentStep(0);
      setExecutionTime(endTime - startTime);
      setShowVisualization(true);
    }, 100);
  };

  const resetPlayground = () => {
    setInputValues("");
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setShowVisualization(false);
    setExecutionTime(0);
  };

  const testCases: [number[], number][] = [
    [[2, 8, 3, -1, 7], 19],
    [[38, 4], 42],
    [[100], 100],
    [[], 0],
    [[-5, -3, -1], -9],
    [[1, 2, 3, 4, 5], 15]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Sum List</span>
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
              <i className="fas fa-plus text-emerald-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Sum List</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that takes the head of a linked list containing numbers and returns the total sum of all values. 
                This builds on traversal patterns by accumulating values during the walk through the list.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <i className="fas fa-clock"></i>
                  <span>Time: O(n)</span>
                </div>
                <div className="flex items-center space-x-2 text-violet-600">
                  <i className="fas fa-memory"></i>
                  <span>Space: O(1) iterative / O(n) recursive</span>
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
                  onClick={() => setSelectedApproach('iterative')}
                  variant={selectedApproach === 'iterative' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-loop"></i>
                  <span>Iterative (O(1) space)</span>
                </Button>
                <Button
                  onClick={() => setSelectedApproach('recursive')}
                  variant={selectedApproach === 'recursive' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-layer-group"></i>
                  <span>Recursive (O(n) space)</span>
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="inputValues" className="block text-sm font-medium text-slate-700 mb-2">
                Linked List Values (comma-separated numbers)
              </Label>
              <Input
                id="inputValues"
                type="text"
                value={inputValues}
                onChange={(e) => setInputValues(e.target.value)}
                className="font-mono"
                placeholder="e.g. 2,8,3,-1,7"
              />
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-calculator mr-2"></i>
                Calculate Sum
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
                      Sum: {result}
                    </div>
                    <div className="text-sm opacity-75 text-emerald-700">
                      Calculated using {selectedApproach} approach
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
                  <Badge variant={selectedApproach === 'iterative' ? 'default' : 'secondary'}>
                    {selectedApproach === 'iterative' ? 'Iterative' : 'Recursive'}
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
                  step.action === 'complete' ? 'border-emerald-400' : 'border-blue-400'
                }`}>
                  <div className="font-medium text-slate-900 mb-2">{step.description}</div>
                  <div className="text-sm text-slate-600">{step.details}</div>
                  {step.recursionDepth !== undefined && (
                    <div className="text-xs text-purple-600 mt-1">
                      Recursion Depth: {step.recursionDepth}
                    </div>
                  )}
                </div>
              </div>

              {/* Linked List Visualization */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Linked List Structure</h4>
                <div 
                  className="p-4 bg-slate-50 rounded-lg min-h-[6rem] flex flex-col justify-center"
                  dangerouslySetInnerHTML={{ __html: step.linkedListVisualization }}
                />
              </div>

              {/* Current Sum Display */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Current Sum</h4>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-emerald-800">
                      {step.currentSum}
                    </span>
                    {step.finalSum !== undefined && (
                      <span className="text-sm text-emerald-600">
                        Final Result
                      </span>
                    )}
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
                {testCases.map(([input, expected], index) => (
                  <div
                    key={index}
                    onClick={() => runTestCase(input)}
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono">
                        {input.length === 0 ? 'null' : input.join(' → ')}
                      </code>
                    </div>
                    <div className="w-auto px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                      Sum: {expected}
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
                  {/* Iterative Solution */}
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-3">✅ Iterative Approach</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">sumList</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">sum</span> = <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">current</span> = <span className="text-orange-300">head</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-yellow-300">sum</span> += <span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-yellow-300">current</span> = <span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">sum</span><span className="text-slate-400">;</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Recursive Solution */}
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-3">🔄 Recursive Approach</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">sumList</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> + <span className="text-yellow-300">sumList</span><span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">);</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2">Iterative Approach</h4>
                      <div className="text-sm text-emerald-700 space-y-1">
                        <div><strong>Time:</strong> O(n) - Visit each node once</div>
                        <div><strong>Space:</strong> O(1) - Only constant variables</div>
                        <div className="text-xs text-emerald-600 mt-2">More memory efficient approach</div>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Recursive Approach</h4>
                      <div className="text-sm text-purple-700 space-y-1">
                        <div><strong>Time:</strong> O(n) - Visit each node once</div>
                        <div><strong>Space:</strong> O(n) - Call stack depth</div>
                        <div className="text-xs text-purple-600 mt-2">More elegant but uses stack space</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Both approaches follow the same traversal pattern as linkedListValues</li>
                      <li>Iterative maintains running sum in a variable during traversal</li>
                      <li>Recursive elegantly expresses sum as current value + sum of rest</li>
                      <li>Demonstrates accumulator pattern - fundamental for many list operations</li>
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