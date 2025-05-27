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
  action: 'initialize' | 'save_next' | 'reverse_pointer' | 'update_pointers' | 'complete' | 'recursive_call' | 'base_case';
  currentNode?: string | number | null;
  prevNode?: string | number | null;
  nextNode?: string | number | null;
  originalVisualization: string;
  currentVisualization: string;
  approach: 'iterative' | 'recursive';
  recursionDepth?: number;
  result?: (string | number)[];
}

export function ReverseListPlayground() {
  const [inputValues, setInputValues] = useState("a,b,c,d,e,f");
  const [result, setResult] = useState<(string | number)[] | null>(null);
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

  const createOriginalVisualization = (values: (string | number)[]): string => {
    if (values.length === 0) {
      return '<span class="text-slate-500">null</span>';
    }
    
    return values.map((val, idx) => {
      const node = `<span class="inline-flex items-center px-3 py-2 rounded-lg border-2 bg-slate-100 border-slate-300 font-mono font-semibold">${val}</span>`;
      const arrow = idx < values.length - 1 ? '<span class="mx-2 text-slate-400">→</span>' : '';
      return node + arrow;
    }).join('') + '<span class="ml-2 text-slate-500">→ null</span>';
  };

  const createCurrentVisualization = (
    values: (string | number)[], 
    currentIdx: number = -1, 
    prevIdx: number = -1, 
    nextIdx: number = -1,
    reversedConnections: number[] = []
  ): string => {
    if (values.length === 0) {
      return '<span class="text-slate-500">null</span>';
    }
    
    const nodes = values.map((val, idx) => {
      let nodeClass = 'bg-white border-slate-300';
      let label = '';
      
      if (idx === currentIdx) {
        nodeClass = 'bg-blue-100 text-blue-800 border-blue-300';
        label = '<div class="text-xs text-blue-600 text-center mb-1">current</div>';
      } else if (idx === prevIdx) {
        nodeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        label = '<div class="text-xs text-emerald-600 text-center mb-1">prev</div>';
      } else if (idx === nextIdx) {
        nodeClass = 'bg-amber-100 text-amber-800 border-amber-300';
        label = '<div class="text-xs text-amber-600 text-center mb-1">next</div>';
      } else if (reversedConnections.includes(idx)) {
        nodeClass = 'bg-purple-100 text-purple-800 border-purple-300';
        label = '<div class="text-xs text-purple-600 text-center mb-1">reversed</div>';
      }
      
      const node = `<div class="inline-flex flex-col items-center">${label}<span class="inline-flex items-center px-3 py-2 rounded-lg border-2 ${nodeClass} font-mono font-semibold">${val}</span></div>`;
      
      // Show reversed arrows for connections that have been flipped
      let arrow = '';
      if (idx < values.length - 1) {
        if (reversedConnections.includes(idx)) {
          arrow = '<span class="mx-2 mt-6 text-purple-500">←</span>';
        } else {
          arrow = '<span class="mx-2 mt-6 text-slate-400">→</span>';
        }
      }
      
      return node + arrow;
    }).join('');
    
    return `<div class="flex items-start">${nodes}<span class="ml-2 mt-6 text-slate-500">→ null</span></div>`;
  };

  const reverseListIterative = (values: (string | number)[]) => {
    const steps: AlgorithmStep[] = [];
    const originalOrder = [...values];
    let reversedConnections: number[] = [];
    
    steps.push({
      step: 1,
      description: "Initialize three pointers: current = head, prev = null, next = null",
      details: `Starting reversal of linked list with ${values.length} nodes using three-pointer technique`,
      action: 'initialize',
      currentNode: values.length > 0 ? values[0] : null,
      prevNode: null,
      nextNode: null,
      originalVisualization: createOriginalVisualization(originalOrder),
      currentVisualization: createCurrentVisualization(values, 0, -1, -1, reversedConnections),
      approach: 'iterative'
    });

    for (let i = 0; i < values.length; i++) {
      const currentVal = values[i];
      const nextVal = i < values.length - 1 ? values[i + 1] : null;
      
      // Save next pointer
      steps.push({
        step: steps.length + 1,
        description: `Save next pointer before losing it`,
        details: `next = current.next (${nextVal ? nextVal : 'null'})`,
        action: 'save_next',
        currentNode: currentVal,
        prevNode: i > 0 ? values[i - 1] : null,
        nextNode: nextVal,
        originalVisualization: createOriginalVisualization(originalOrder),
        currentVisualization: createCurrentVisualization(values, i, i > 0 ? i - 1 : -1, i + 1, reversedConnections),
        approach: 'iterative'
      });

      // Reverse the pointer
      steps.push({
        step: steps.length + 1,
        description: `Reverse current node's pointer to point to prev`,
        details: `current.next = prev (${i > 0 ? values[i - 1] : 'null'})`,
        action: 'reverse_pointer',
        currentNode: currentVal,
        prevNode: i > 0 ? values[i - 1] : null,
        nextNode: nextVal,
        originalVisualization: createOriginalVisualization(originalOrder),
        currentVisualization: createCurrentVisualization(values, i, i > 0 ? i - 1 : -1, i + 1, [...reversedConnections, i]),
        approach: 'iterative'
      });

      reversedConnections.push(i);

      // Update pointers
      if (i < values.length - 1) {
        steps.push({
          step: steps.length + 1,
          description: `Move pointers forward: prev = current, current = next`,
          details: `prev = ${currentVal}, current = ${nextVal}`,
          action: 'update_pointers',
          currentNode: nextVal,
          prevNode: currentVal,
          nextNode: i + 2 < values.length ? values[i + 2] : null,
          originalVisualization: createOriginalVisualization(originalOrder),
          currentVisualization: createCurrentVisualization(values, i + 1, i, i + 2 < values.length ? i + 2 : -1, reversedConnections),
          approach: 'iterative'
        });
      }
    }

    const reversedValues = [...values].reverse();

    steps.push({
      step: steps.length + 1,
      description: "Reversal complete! Return prev as new head",
      details: `All pointers reversed. New head: ${values.length > 0 ? values[values.length - 1] : 'null'}`,
      action: 'complete',
      currentNode: null,
      prevNode: values.length > 0 ? values[values.length - 1] : null,
      nextNode: null,
      originalVisualization: createOriginalVisualization(originalOrder),
      currentVisualization: createOriginalVisualization(reversedValues),
      approach: 'iterative',
      result: reversedValues
    });

    return { result: reversedValues, steps };
  };

  const reverseListRecursive = (values: (string | number)[]) => {
    const steps: AlgorithmStep[] = [];
    const originalOrder = [...values];
    let processedNodes: number[] = [];
    
    steps.push({
      step: 1,
      description: "Starting recursive reversal",
      details: `Beginning recursive reversal of linked list with ${values.length} nodes`,
      action: 'initialize',
      currentNode: values.length > 0 ? values[0] : null,
      prevNode: null,
      nextNode: values.length > 1 ? values[1] : null,
      originalVisualization: createOriginalVisualization(originalOrder),
      currentVisualization: createCurrentVisualization(values, 0, -1, 1, []),
      approach: 'recursive',
      recursionDepth: 0
    });

    const traverse = (nodeIndex: number, prevIndex: number, depth: number): (string | number)[] => {
      if (nodeIndex >= values.length) {
        steps.push({
          step: steps.length + 1,
          description: `Base case reached: head is null`,
          details: `Recursion depth ${depth}: Reached end of list, return prev as new head`,
          action: 'base_case',
          currentNode: null,
          prevNode: prevIndex >= 0 ? values[prevIndex] : null,
          nextNode: null,
          originalVisualization: createOriginalVisualization(originalOrder),
          currentVisualization: createCurrentVisualization(values, -1, prevIndex, -1, processedNodes),
          approach: 'recursive',
          recursionDepth: depth
        });
        return prevIndex >= 0 ? [...values].reverse() : [];
      }

      const currentVal = values[nodeIndex];
      const nextIndex = nodeIndex + 1;
      const nextVal = nextIndex < values.length ? values[nextIndex] : null;

      steps.push({
        step: steps.length + 1,
        description: `Recursive call for node "${currentVal}"`,
        details: `Recursion depth ${depth}: Processing node "${currentVal}", saving next pointer`,
        action: 'recursive_call',
        currentNode: currentVal,
        prevNode: prevIndex >= 0 ? values[prevIndex] : null,
        nextNode: nextVal,
        originalVisualization: createOriginalVisualization(originalOrder),
        currentVisualization: createCurrentVisualization(values, nodeIndex, prevIndex, nextIndex, processedNodes),
        approach: 'recursive',
        recursionDepth: depth
      });

      steps.push({
        step: steps.length + 1,
        description: `Save next pointer and reverse current node's pointer`,
        details: `Recursion depth ${depth}: next = head.next, head.next = prev`,
        action: 'reverse_pointer',
        currentNode: currentVal,
        prevNode: prevIndex >= 0 ? values[prevIndex] : null,
        nextNode: nextVal,
        originalVisualization: createOriginalVisualization(originalOrder),
        currentVisualization: createCurrentVisualization(values, nodeIndex, prevIndex, nextIndex, [...processedNodes, nodeIndex]),
        approach: 'recursive',
        recursionDepth: depth
      });

      processedNodes.push(nodeIndex);

      return traverse(nextIndex, nodeIndex, depth + 1);
    };

    const finalResult = values.length > 0 ? traverse(0, -1, 0) : [];

    if (values.length === 0) {
      steps.push({
        step: steps.length + 1,
        description: `Base case: head is null`,
        details: `Empty linked list, returning null`,
        action: 'base_case',
        currentNode: null,
        prevNode: null,
        nextNode: null,
        originalVisualization: createOriginalVisualization([]),
        currentVisualization: createOriginalVisualization([]),
        approach: 'recursive',
        recursionDepth: 0,
        result: []
      });
    } else {
      steps.push({
        step: steps.length + 1,
        description: "Recursive reversal complete",
        details: `All recursive calls finished. Linked list successfully reversed.`,
        action: 'complete',
        currentNode: null,
        prevNode: null,
        nextNode: null,
        originalVisualization: createOriginalVisualization(originalOrder),
        currentVisualization: createOriginalVisualization(finalResult),
        approach: 'recursive',
        result: finalResult
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

    const startTime = performance.now();
    const { result: reversedList, steps: algorithmSteps } = selectedApproach === 'iterative' 
      ? reverseListIterative(values)
      : reverseListRecursive(values);
    const endTime = performance.now();
    
    setResult(reversedList);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testValues: (string | number)[]) => {
    setInputValues(testValues.join(','));
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: reversedList, steps: algorithmSteps } = selectedApproach === 'iterative' 
        ? reverseListIterative(testValues)
        : reverseListRecursive(testValues);
      const endTime = performance.now();
      
      setResult(reversedList);
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

  const testCases: [(string | number)[], (string | number)[]][] = [
    [["a", "b", "c", "d", "e", "f"], ["f", "e", "d", "c", "b", "a"]],
    [["x", "y"], ["y", "x"]],
    [["p"], ["p"]],
    [[], []],
    [[1, 2, 3], [3, 2, 1]]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Reverse List</span>
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-undo text-red-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Reverse Linked List</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that reverses a linked list in-place and returns the new head. 
                This classic problem teaches pointer manipulation using the three-pointer technique.
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
                <div className="flex items-center space-x-2 text-red-600">
                  <i className="fas fa-layer-group"></i>
                  <span>Difficulty: Medium</span>
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
                  <span>Iterative (3-pointer)</span>
                </Button>
                <Button
                  onClick={() => setSelectedApproach('recursive')}
                  variant={selectedApproach === 'recursive' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-layer-group"></i>
                  <span>Recursive</span>
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="inputValues" className="block text-sm font-medium text-slate-700 mb-2">
                Linked List Values (comma-separated)
              </Label>
              <Input
                id="inputValues"
                type="text"
                value={inputValues}
                onChange={(e) => setInputValues(e.target.value)}
                className="font-mono"
                placeholder="e.g. a,b,c,d,e,f"
              />
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-undo mr-2"></i>
                Reverse Linked List
              </Button>
              <Button
                onClick={resetPlayground}
                variant="outline"
                className="px-6"
              >
                <i className="fas fa-refresh"></i>
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
                      Reversed: {result.length === 0 ? 'null' : result.join(' → ')}
                    </div>
                    <div className="text-sm opacity-75 text-emerald-700">
                      Successfully reversed using {selectedApproach} approach
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

              {/* Original vs Current Visualization */}
              <div className="space-y-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Original List</h4>
                  <div 
                    className="p-4 bg-slate-50 rounded-lg min-h-[6rem] flex items-center"
                    dangerouslySetInnerHTML={{ __html: step.originalVisualization }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Current State</h4>
                  <div 
                    className="p-4 bg-slate-50 rounded-lg min-h-[6rem] flex flex-col justify-center"
                    dangerouslySetInnerHTML={{ __html: step.currentVisualization }}
                  />
                </div>
              </div>

              {/* Pointer Status */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Pointer Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-xs text-blue-600 font-medium">CURRENT</div>
                    <div className="font-mono text-lg text-blue-800">
                      {step.currentNode === null ? 'null' : step.currentNode}
                    </div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="text-xs text-emerald-600 font-medium">PREV</div>
                    <div className="font-mono text-lg text-emerald-800">
                      {step.prevNode === null ? 'null' : step.prevNode}
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="text-xs text-amber-600 font-medium">NEXT</div>
                    <div className="font-mono text-lg text-amber-800">
                      {step.nextNode === null ? 'null' : step.nextNode}
                    </div>
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
                      {expected.length === 0 ? 'null' : expected.join(' → ')}
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
                    <h4 className="font-semibold text-emerald-800 mb-3">✅ Iterative Approach (3-Pointer)</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">reverseList</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">current</span> = <span className="text-orange-300">head</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">prev</span> = <span className="text-blue-400">null</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-blue-400">const</span> <span className="text-yellow-300">next</span> = <span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">prev</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-yellow-300">prev</span> = <span className="text-yellow-300">current</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-yellow-300">current</span> = <span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">prev</span><span className="text-slate-400">;</span>{'\n'}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">reverseList</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">,</span> <span className="text-orange-300">prev</span> = <span className="text-blue-400">null</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-orange-300">prev</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">next</span> = <span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-orange-300">prev</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">reverseList</span><span className="text-slate-400">(</span><span className="text-yellow-300">next</span><span className="text-slate-400">,</span> <span className="text-orange-300">head</span><span className="text-slate-400">);</span>{'\n'}
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
                        <div className="text-xs text-emerald-600 mt-2">Uses three pointers: current, prev, next</div>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Recursive Approach</h4>
                      <div className="text-sm text-purple-700 space-y-1">
                        <div><strong>Time:</strong> O(n) - Visit each node once</div>
                        <div><strong>Space:</strong> O(n) - Call stack depth</div>
                        <div className="text-xs text-purple-600 mt-2">Passes prev as parameter through recursion</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Three-pointer technique prevents losing references during reversal</li>
                      <li>Must save next pointer before reversing current pointer</li>
                      <li>Iterative approach is more space-efficient for this problem</li>
                      <li>Classic interview question that tests pointer manipulation skills</li>
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