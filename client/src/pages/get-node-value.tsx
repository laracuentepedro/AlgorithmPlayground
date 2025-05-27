import { useState } from "react";
import { ProblemsSidebar } from "@/components/ProblemsSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Linked List Node class
class ListNode {
  val: string | number;
  next: ListNode | null;

  constructor(val: string | number) {
    this.val = val;
    this.next = null;
  }
}

export interface AlgorithmStep {
  step: number;
  description: string;
  details: string;
  action: 'initialize' | 'traverse' | 'check_index' | 'found_target' | 'move_next' | 'out_of_bounds' | 'recursive_call' | 'base_case';
  currentNode?: string | number | null;
  targetIndex: number;
  currentIndex: number;
  linkedListVisualization: string;
  approach: 'iterative' | 'recursive';
  recursionDepth?: number;
  result?: string | number | null;
}

export function GetNodeValuePlayground() {
  const [inputValues, setInputValues] = useState("a,b,c,d");
  const [targetIndex, setTargetIndex] = useState("2");
  const [result, setResult] = useState<string | number | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState<'iterative' | 'recursive'>('iterative');

  const parseValue = (val: string): string | number => {
    const numVal = parseFloat(val);
    return isNaN(numVal) ? val : numVal;
  };

  const createVisualization = (values: (string | number)[], currentIndex: number = -1, targetIndex: number, found: boolean = false, foundValue?: string | number | null): string => {
    if (values.length === 0) {
      return '<span class="text-slate-500">null</span>';
    }
    
    const nodes = values.map((val, idx) => {
      const isActive = idx === currentIndex;
      const isTarget = idx === targetIndex;
      let nodeClass = 'bg-white border-slate-300';
      
      if (found && isTarget) {
        nodeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      } else if (isActive) {
        nodeClass = 'bg-blue-100 text-blue-800 border-blue-300';
      } else if (isTarget) {
        nodeClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
      }
      
      const indexLabel = `<div class="text-xs text-slate-500 text-center mb-1">index ${idx}</div>`;
      const node = `<div class="inline-flex flex-col items-center">${indexLabel}<span class="inline-flex items-center px-3 py-2 rounded-lg border-2 ${nodeClass} font-mono font-semibold">${val}</span></div>`;
      const arrow = idx < values.length - 1 ? '<span class="mx-2 mt-6 text-slate-400">→</span>' : '';
      return node + arrow;
    }).join('');
    
    const targetDisplay = `<div class="mt-4 text-sm text-blue-600">Target Index: <span class="font-mono font-bold text-lg">${targetIndex}</span></div>`;
    const resultDisplay = foundValue !== undefined ? `<div class="mt-2 text-sm text-emerald-600">Result: <span class="font-mono font-bold text-lg">${foundValue === null ? 'null' : foundValue}</span></div>` : '';
    
    return `<div class="flex items-start">${nodes}<span class="ml-2 mt-6 text-slate-500">→ null</span></div>` + targetDisplay + resultDisplay;
  };

  const getNodeValueIterative = (values: (string | number)[], targetIndex: number) => {
    const steps: AlgorithmStep[] = [];
    let currentIndex = 0;
    let foundValue: string | number | null = null;
    
    steps.push({
      step: 1,
      description: "Initialize counter and current pointer",
      details: `Looking for value at index ${targetIndex} in linked list with ${values.length} nodes`,
      action: 'initialize',
      currentNode: values.length > 0 ? values[0] : null,
      targetIndex: targetIndex,
      currentIndex: 0,
      linkedListVisualization: createVisualization(values, values.length > 0 ? 0 : -1, targetIndex, false),
      approach: 'iterative'
    });

    for (let i = 0; i < values.length; i++) {
      const currentVal = values[i];
      
      steps.push({
        step: steps.length + 1,
        description: `At node "${currentVal}" with index ${i}`,
        details: `Current pointer is at node containing "${currentVal}", counter = ${i}`,
        action: 'traverse',
        currentNode: currentVal,
        targetIndex: targetIndex,
        currentIndex: i,
        linkedListVisualization: createVisualization(values, i, targetIndex, false),
        approach: 'iterative'
      });

      steps.push({
        step: steps.length + 1,
        description: `Checking if current index ${i} equals target index ${targetIndex}`,
        details: `Comparing count (${i}) === index (${targetIndex})`,
        action: 'check_index',
        currentNode: currentVal,
        targetIndex: targetIndex,
        currentIndex: i,
        linkedListVisualization: createVisualization(values, i, targetIndex, false),
        approach: 'iterative'
      });

      if (i === targetIndex) {
        foundValue = currentVal;
        steps.push({
          step: steps.length + 1,
          description: `Found target index! Returning "${currentVal}"`,
          details: `Index ${i} matches target index ${targetIndex}. Returning current.val = "${currentVal}"`,
          action: 'found_target',
          currentNode: currentVal,
          targetIndex: targetIndex,
          currentIndex: i,
          linkedListVisualization: createVisualization(values, i, targetIndex, true, foundValue),
          approach: 'iterative',
          result: foundValue
        });
        break;
      }

      if (i < values.length - 1) {
        steps.push({
          step: steps.length + 1,
          description: `Index ${i} ≠ ${targetIndex}, moving to next node`,
          details: `Incrementing count to ${i + 1} and setting current = current.next`,
          action: 'move_next',
          currentNode: values[i + 1],
          targetIndex: targetIndex,
          currentIndex: i + 1,
          linkedListVisualization: createVisualization(values, i + 1, targetIndex, false),
          approach: 'iterative'
        });
      }
    }

    if (foundValue === null) {
      steps.push({
        step: steps.length + 1,
        description: "Reached end of list without finding target index",
        details: `Traversed entire list (${values.length} nodes), index ${targetIndex} is out of bounds. Returning null.`,
        action: 'out_of_bounds',
        currentNode: null,
        targetIndex: targetIndex,
        currentIndex: values.length,
        linkedListVisualization: createVisualization(values, -1, targetIndex, false, null),
        approach: 'iterative',
        result: null
      });
    }

    return { result: foundValue, steps };
  };

  const getNodeValueRecursive = (values: (string | number)[], targetIndex: number) => {
    const steps: AlgorithmStep[] = [];
    let foundResult: string | number | null = null;
    
    steps.push({
      step: 1,
      description: "Starting recursive search for target index",
      details: `Beginning recursive search for index ${targetIndex} in linked list`,
      action: 'initialize',
      currentNode: values.length > 0 ? values[0] : null,
      targetIndex: targetIndex,
      currentIndex: targetIndex,
      linkedListVisualization: createVisualization(values, values.length > 0 ? 0 : -1, targetIndex, false),
      approach: 'recursive',
      recursionDepth: 0
    });

    const traverse = (nodeIndex: number, remainingIndex: number, depth: number): string | number | null => {
      if (nodeIndex >= values.length) {
        steps.push({
          step: steps.length + 1,
          description: `Base case reached: node is null`,
          details: `Recursion depth ${depth}: Reached end of list, index ${targetIndex} is out of bounds`,
          action: 'base_case',
          currentNode: null,
          targetIndex: targetIndex,
          currentIndex: remainingIndex,
          linkedListVisualization: createVisualization(values, -1, targetIndex, false, null),
          approach: 'recursive',
          recursionDepth: depth
        });
        return null;
      }

      const currentVal = values[nodeIndex];

      steps.push({
        step: steps.length + 1,
        description: `Recursive call for node "${currentVal}" (remaining index: ${remainingIndex})`,
        details: `Recursion depth ${depth}: Processing node with value "${currentVal}", remaining index = ${remainingIndex}`,
        action: 'recursive_call',
        currentNode: currentVal,
        targetIndex: targetIndex,
        currentIndex: remainingIndex,
        linkedListVisualization: createVisualization(values, nodeIndex, targetIndex, false),
        approach: 'recursive',
        recursionDepth: depth
      });

      steps.push({
        step: steps.length + 1,
        description: `Checking if remaining index ${remainingIndex} equals 0`,
        details: `Recursion depth ${depth}: Comparing index (${remainingIndex}) === 0`,
        action: 'check_index',
        currentNode: currentVal,
        targetIndex: targetIndex,
        currentIndex: remainingIndex,
        linkedListVisualization: createVisualization(values, nodeIndex, targetIndex, false),
        approach: 'recursive',
        recursionDepth: depth
      });

      if (remainingIndex === 0) {
        foundResult = currentVal;
        steps.push({
          step: steps.length + 1,
          description: `Found target! Returning "${currentVal}"`,
          details: `Recursion depth ${depth}: Index is 0, return head.val = "${currentVal}"`,
          action: 'found_target',
          currentNode: currentVal,
          targetIndex: targetIndex,
          currentIndex: remainingIndex,
          linkedListVisualization: createVisualization(values, nodeIndex, targetIndex, true, foundResult),
          approach: 'recursive',
          recursionDepth: depth,
          result: foundResult
        });
        return foundResult;
      }

      return traverse(nodeIndex + 1, remainingIndex - 1, depth + 1);
    };

    const finalResult = values.length > 0 ? traverse(0, targetIndex, 0) : null;

    if (values.length === 0) {
      steps.push({
        step: steps.length + 1,
        description: `Base case: head is null`,
        details: `Empty linked list, returning null`,
        action: 'base_case',
        currentNode: null,
        targetIndex: targetIndex,
        currentIndex: targetIndex,
        linkedListVisualization: createVisualization(values, -1, targetIndex, false, null),
        approach: 'recursive',
        recursionDepth: 0,
        result: null
      });
    }

    if (foundResult === null && values.length > 0 && targetIndex >= values.length) {
      steps.push({
        step: steps.length + 1,
        description: "Recursive search complete - index out of bounds",
        details: `All recursive calls finished without finding index ${targetIndex}. Returning null.`,
        action: 'out_of_bounds',
        currentNode: null,
        targetIndex: targetIndex,
        currentIndex: -1,
        linkedListVisualization: createVisualization(values, -1, targetIndex, false, null),
        approach: 'recursive',
        result: null
      });
    }

    return { result: finalResult, steps };
  };

  const parseValues = (input: string): (string | number)[] => {
    if (!input.trim()) return [];
    return input.split(',').map(s => parseValue(s.trim())).filter((_, index, arr) => input.split(',')[index]?.trim() !== '');
  };

  const runAlgorithm = () => {
    const values = parseValues(inputValues);
    const index = parseInt(targetIndex);

    if (isNaN(index) || index < 0) {
      alert('Please enter a valid non-negative index');
      return;
    }

    const startTime = performance.now();
    const { result: nodeValue, steps: algorithmSteps } = selectedApproach === 'iterative' 
      ? getNodeValueIterative(values, index)
      : getNodeValueRecursive(values, index);
    const endTime = performance.now();
    
    setResult(nodeValue);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testValues: (string | number)[], testIndex: number) => {
    setInputValues(testValues.join(','));
    setTargetIndex(testIndex.toString());
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: nodeValue, steps: algorithmSteps } = selectedApproach === 'iterative' 
        ? getNodeValueIterative(testValues, testIndex)
        : getNodeValueRecursive(testValues, testIndex);
      const endTime = performance.now();
      
      setResult(nodeValue);
      setSteps(algorithmSteps);
      setCurrentStep(0);
      setExecutionTime(endTime - startTime);
      setShowVisualization(true);
    }, 100);
  };

  const resetPlayground = () => {
    setInputValues("");
    setTargetIndex("");
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setShowVisualization(false);
    setExecutionTime(0);
  };

  const testCases: [(string | number)[], number, string | number | null][] = [
    [["a", "b", "c", "d"], 2, "c"],
    [["a", "b", "c", "d"], 3, "d"],
    [["a", "b", "c", "d"], 7, null],
    [["banana", "mango"], 0, "banana"],
    [["banana", "mango"], 1, "mango"],
    [[], 0, null],
    [[42], 0, 42]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Get Node Value</span>
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-hand-point-right text-orange-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Get Node Value</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that takes the head of a linked list and an index, returning the value at that position. 
                This introduces index-based access and teaches how to handle out-of-bounds cases in linked lists.
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

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="inputValues" className="block text-sm font-medium text-slate-700 mb-2">
                  Linked List Values (comma-separated)
                </Label>
                <Input
                  id="inputValues"
                  type="text"
                  value={inputValues}
                  onChange={(e) => setInputValues(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. a,b,c,d"
                />
              </div>
              <div>
                <Label htmlFor="targetIndex" className="block text-sm font-medium text-slate-700 mb-2">
                  Target Index
                </Label>
                <Input
                  id="targetIndex"
                  type="number"
                  min="0"
                  value={targetIndex}
                  onChange={(e) => setTargetIndex(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. 2"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-hand-point-right mr-2"></i>
                Get Value at Index
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
                <div className={`p-4 rounded-lg border-l-4 ${result !== null ? 'border-emerald-400 bg-emerald-50' : 'border-red-400 bg-red-50'} animate-pulse-success flex items-center space-x-3`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${result !== null ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    <i className={`fas ${result !== null ? 'fa-check' : 'fa-times'}`}></i>
                  </div>
                  <div>
                    <div className={`font-semibold ${result !== null ? 'text-emerald-800' : 'text-red-800'}`}>
                      Value: {result === null ? 'null (index out of bounds)' : result}
                    </div>
                    <div className={`text-sm opacity-75 ${result !== null ? 'text-emerald-700' : 'text-red-700'}`}>
                      Retrieved using {selectedApproach} approach
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Execution Time:</span>
                  <span className="font-mono text-sm text-slate-900">{executionTime.toFixed(3)} ms</span>
                </div>
              </div>
            )}
            {result === null && result !== undefined && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg border-l-4 border-red-400 bg-red-50 animate-pulse-success flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                    <i className="fas fa-times"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-red-800">
                      Value: null (index out of bounds)
                    </div>
                    <div className="text-sm opacity-75 text-red-700">
                      Retrieved using {selectedApproach} approach
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
                  step.action === 'found_target' ? 'border-emerald-400' : 
                  step.action === 'out_of_bounds' ? 'border-red-400' : 'border-blue-400'
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
                <h4 className="text-sm font-medium text-slate-700 mb-3">Linked List Structure with Indices</h4>
                <div 
                  className="p-4 bg-slate-50 rounded-lg min-h-[8rem] flex flex-col justify-center"
                  dangerouslySetInnerHTML={{ __html: step.linkedListVisualization }}
                />
              </div>

              {/* Index Status */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Index Access Status</h4>
                <div className={`border rounded-lg p-4 ${
                  step.result !== undefined && step.result !== null ? 'bg-emerald-50 border-emerald-200' : 
                  step.result === null ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg">
                      Target Index: {step.targetIndex}
                    </span>
                    {step.result !== undefined && (
                      <span className={`text-sm font-medium ${step.result !== null ? 'text-emerald-600' : 'text-red-600'}`}>
                        {step.result !== null ? `VALUE: ${step.result}` : 'OUT OF BOUNDS'}
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
                {testCases.map(([input, index, expected], testIndex) => (
                  <div
                    key={testIndex}
                    onClick={() => runTestCase(input, index)}
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono">
                        {input.length === 0 ? 'null' : input.join(' → ')}
                      </code>
                      <span className="text-slate-400">[{index}]</span>
                    </div>
                    <div className={`w-auto px-3 py-1 rounded-full text-sm font-medium ${expected !== null ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {expected === null ? 'null' : expected}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">getNodeValue</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">,</span> <span className="text-orange-300">index</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">count</span> = <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">current</span> = <span className="text-orange-300">head</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">count</span> === <span className="text-orange-300">index</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-yellow-300">current</span> = <span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-yellow-300">count</span> += <span className="text-green-400">1</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-blue-400">null</span><span className="text-slate-400">;</span>{'\n'}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">getNodeValue</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">,</span> <span className="text-orange-300">index</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">null</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">index</span> === <span className="text-green-400">0</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">getNodeValue</span><span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">,</span> <span className="text-orange-300">index</span> - <span className="text-green-400">1</span><span className="text-slate-400">);</span>{'\n'}
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
                        <div className="text-xs text-emerald-600 mt-2">Uses counter to track current index</div>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Recursive Approach</h4>
                      <div className="text-sm text-purple-700 space-y-1">
                        <div><strong>Time:</strong> O(n) - Visit each node once</div>
                        <div><strong>Space:</strong> O(n) - Call stack depth</div>
                        <div className="text-xs text-purple-600 mt-2">Decrements index with each call</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Counter-based traversal allows index-based access in linked lists</li>
                      <li>Both approaches handle out-of-bounds cases by returning null</li>
                      <li>Recursive approach elegantly decrements index instead of incrementing counter</li>
                      <li>Early termination when target index is found for optimal performance</li>
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