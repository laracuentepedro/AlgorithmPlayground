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
  action: 'initialize' | 'traverse' | 'check_head' | 'found_target' | 'update_pointers' | 'move_forward' | 'complete' | 'recursive_call' | 'base_case';
  currentNode?: string | number | null;
  prevNode?: string | number | null;
  target: string | number;
  originalVisualization: string;
  currentVisualization: string;
  approach: 'iterative' | 'recursive';
  recursionDepth?: number;
  result?: (string | number)[];
  found?: boolean;
}

export function RemoveNodePlayground() {
  const [inputValues, setInputValues] = useState("a,b,c,d,e,f");
  const [targetValue, setTargetValue] = useState("c");
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

  const createVisualization = (
    values: (string | number)[], 
    currentIndex: number = -1, 
    prevIndex: number = -1,
    target: string | number,
    isOriginal: boolean = false
  ): string => {
    if (values.length === 0) {
      return '<span class="text-slate-500">null</span>';
    }
    
    const nodes = values.map((val, idx) => {
      let nodeClass = 'bg-white border-slate-300';
      let label = '';
      
      if (val === target && !isOriginal) {
        nodeClass = 'bg-red-100 text-red-800 border-red-300';
        label = '<div class="text-xs text-red-600 text-center mb-1">target</div>';
      } else if (idx === currentIndex) {
        nodeClass = 'bg-blue-100 text-blue-800 border-blue-300';
        label = '<div class="text-xs text-blue-600 text-center mb-1">current</div>';
      } else if (idx === prevIndex) {
        nodeClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
        label = '<div class="text-xs text-yellow-600 text-center mb-1">prev</div>';
      } else if (val === target) {
        nodeClass = 'bg-red-100 text-red-800 border-red-300';
        label = '<div class="text-xs text-red-600 text-center mb-1">target</div>';
      }
      
      const node = `<div class="inline-flex flex-col items-center">${label}<span class="inline-flex items-center px-3 py-2 rounded-lg border-2 ${nodeClass} font-mono font-semibold">${val}</span></div>`;
      const arrow = idx < values.length - 1 ? '<span class="mx-2 mt-6 text-slate-400">→</span>' : '';
      return node + arrow;
    }).join('');
    
    return `<div class="flex items-start">${nodes}<span class="ml-2 mt-6 text-slate-500">→ null</span></div>`;
  };

  const removeNodeIterative = (values: (string | number)[], target: string | number) => {
    const steps: AlgorithmStep[] = [];
    const originalValues = [...values];
    
    if (values.length === 0) {
      steps.push({
        step: 1,
        description: "Empty list - nothing to remove",
        details: "Cannot remove from empty linked list",
        action: 'complete',
        target: target,
        originalVisualization: createVisualization([], -1, -1, target, true),
        currentVisualization: createVisualization([], -1, -1, target),
        approach: 'iterative',
        result: []
      });
      return { result: [], steps };
    }

    steps.push({
      step: 1,
      description: `Initialize removal of target "${target}"`,
      details: `Starting removal process for first occurrence of "${target}"`,
      action: 'initialize',
      target: target,
      originalVisualization: createVisualization(originalValues, -1, -1, target, true),
      currentVisualization: createVisualization(values, 0, -1, target),
      approach: 'iterative'
    });

    // Check if head needs to be removed
    if (values[0] === target) {
      steps.push({
        step: 2,
        description: `Head node contains target "${target}"`,
        details: `Special case: removing head node, return head.next`,
        action: 'check_head',
        currentNode: values[0],
        target: target,
        originalVisualization: createVisualization(originalValues, -1, -1, target, true),
        currentVisualization: createVisualization(values, 0, -1, target),
        approach: 'iterative',
        found: true
      });

      const result = values.slice(1);
      steps.push({
        step: 3,
        description: "Head removed successfully",
        details: `Removed head node with value "${target}". New head is ${result.length > 0 ? `"${result[0]}"` : 'null'}`,
        action: 'complete',
        target: target,
        originalVisualization: createVisualization(originalValues, -1, -1, target, true),
        currentVisualization: createVisualization(result),
        approach: 'iterative',
        result: result
      });
      
      return { result, steps };
    }

    // Traverse to find target
    let prevIndex = -1;
    let foundIndex = -1;
    
    for (let i = 0; i < values.length; i++) {
      const currentVal = values[i];
      
      steps.push({
        step: steps.length + 1,
        description: `Examining node with value "${currentVal}"`,
        details: `Current position: ${i}, checking if "${currentVal}" equals target "${target}"`,
        action: 'traverse',
        currentNode: currentVal,
        prevNode: prevIndex >= 0 ? values[prevIndex] : null,
        target: target,
        originalVisualization: createVisualization(originalValues, -1, -1, target, true),
        currentVisualization: createVisualization(values, i, prevIndex, target),
        approach: 'iterative'
      });

      if (currentVal === target) {
        foundIndex = i;
        steps.push({
          step: steps.length + 1,
          description: `Found target "${target}" at position ${i}`,
          details: `Target found! Will remove this node by updating previous node's pointer`,
          action: 'found_target',
          currentNode: currentVal,
          prevNode: prevIndex >= 0 ? values[prevIndex] : null,
          target: target,
          originalVisualization: createVisualization(originalValues, -1, -1, target, true),
          currentVisualization: createVisualization(values, i, prevIndex, target),
          approach: 'iterative',
          found: true
        });
        break;
      }

      if (i < values.length - 1) {
        steps.push({
          step: steps.length + 1,
          description: `"${currentVal}" ≠ "${target}", continue searching`,
          details: `Moving forward: prev = current, current = current.next`,
          action: 'move_forward',
          currentNode: currentVal,
          prevNode: prevIndex >= 0 ? values[prevIndex] : null,
          target: target,
          originalVisualization: createVisualization(originalValues, -1, -1, target, true),
          currentVisualization: createVisualization(values, i, prevIndex, target),
          approach: 'iterative'
        });
      }

      prevIndex = i;
    }

    // Remove the node
    const result = [...values];
    if (foundIndex !== -1) {
      result.splice(foundIndex, 1);
      
      steps.push({
        step: steps.length + 1,
        description: `Update pointers to remove node`,
        details: `Set prev.next = current.next, effectively removing node with "${target}"`,
        action: 'update_pointers',
        currentNode: values[foundIndex],
        prevNode: prevIndex >= 0 ? values[prevIndex] : null,
        target: target,
        originalVisualization: createVisualization(originalValues, -1, -1, target, true),
        currentVisualization: createVisualization(result),
        approach: 'iterative'
      });
    }

    steps.push({
      step: steps.length + 1,
      description: `Node removal complete`,
      details: `Successfully removed first occurrence of "${target}" from linked list`,
      action: 'complete',
      target: target,
      originalVisualization: createVisualization(originalValues, -1, -1, target, true),
      currentVisualization: createVisualization(result),
      approach: 'iterative',
      result: result
    });

    return { result, steps };
  };

  const removeNodeRecursive = (values: (string | number)[], target: string | number) => {
    const steps: AlgorithmStep[] = [];
    const originalValues = [...values];
    
    if (values.length === 0) {
      steps.push({
        step: 1,
        description: "Empty list - nothing to remove",
        details: "Cannot remove from empty linked list",
        action: 'complete',
        target: target,
        originalVisualization: createVisualization([], -1, -1, target, true),
        currentVisualization: createVisualization([]),
        approach: 'recursive',
        result: []
      });
      return { result: [], steps };
    }
    
    steps.push({
      step: 1,
      description: "Starting recursive node removal",
      details: `Beginning recursive search and removal of "${target}"`,
      action: 'initialize',
      target: target,
      originalVisualization: createVisualization(originalValues, -1, -1, target, true),
      currentVisualization: createVisualization(values, 0, -1, target),
      approach: 'recursive',
      recursionDepth: 0
    });

    let finalResult: (string | number)[] = [];

    const removeRecursive = (index: number, depth: number): (string | number)[] => {
      if (index >= values.length) {
        steps.push({
          step: steps.length + 1,
          description: `Base case reached: end of list`,
          details: `Recursion depth ${depth}: Reached end without finding target`,
          action: 'base_case',
          target: target,
          originalVisualization: createVisualization(originalValues, -1, -1, target, true),
          currentVisualization: createVisualization(finalResult),
          approach: 'recursive',
          recursionDepth: depth
        });
        return [];
      }

      const currentVal = values[index];

      steps.push({
        step: steps.length + 1,
        description: `Recursive call for node "${currentVal}"`,
        details: `Recursion depth ${depth}: Processing node with value "${currentVal}"`,
        action: 'recursive_call',
        currentNode: currentVal,
        target: target,
        originalVisualization: createVisualization(originalValues, -1, -1, target, true),
        currentVisualization: createVisualization(values, index, -1, target),
        approach: 'recursive',
        recursionDepth: depth
      });

      if (currentVal === target) {
        steps.push({
          step: steps.length + 1,
          description: `Found target "${target}"! Skip this node`,
          details: `Recursion depth ${depth}: Target found, return rest of list without this node`,
          action: 'found_target',
          currentNode: currentVal,
          target: target,
          originalVisualization: createVisualization(originalValues, -1, -1, target, true),
          currentVisualization: createVisualization(values, index, -1, target),
          approach: 'recursive',
          recursionDepth: depth,
          found: true
        });
        
        // Return the rest of the list (effectively removing this node)
        return values.slice(index + 1);
      }

      // Keep this node and recurse on the rest
      const restOfList = removeRecursive(index + 1, depth + 1);
      return [currentVal, ...restOfList];
    };

    finalResult = removeRecursive(0, 0);

    steps.push({
      step: steps.length + 1,
      description: "Recursive removal complete",
      details: `All recursive calls finished. ${finalResult.length < originalValues.length ? `Removed "${target}"` : `Target "${target}" not found`}`,
      action: 'complete',
      target: target,
      originalVisualization: createVisualization(originalValues, -1, -1, target, true),
      currentVisualization: createVisualization(finalResult),
      approach: 'recursive',
      result: finalResult
    });

    return { result: finalResult, steps };
  };

  const parseValues = (input: string): (string | number)[] => {
    if (!input.trim()) return [];
    return input.split(',').map(s => parseValue(s.trim())).filter((_, index, arr) => input.split(',')[index]?.trim() !== '');
  };

  const runAlgorithm = () => {
    const values = parseValues(inputValues);
    const target = parseValue(targetValue);

    if (values.length === 0) {
      alert('Please enter a valid non-empty list (comma-separated values)');
      return;
    }

    if (!targetValue.trim()) {
      alert('Please enter a target value to remove');
      return;
    }

    const startTime = performance.now();
    const { result: resultList, steps: algorithmSteps } = selectedApproach === 'iterative' 
      ? removeNodeIterative(values, target)
      : removeNodeRecursive(values, target);
    const endTime = performance.now();
    
    setResult(resultList);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testValues: (string | number)[], testTarget: string | number) => {
    setInputValues(testValues.join(','));
    setTargetValue(testTarget.toString());
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: resultList, steps: algorithmSteps } = selectedApproach === 'iterative' 
        ? removeNodeIterative(testValues, testTarget)
        : removeNodeRecursive(testValues, testTarget);
      const endTime = performance.now();
      
      setResult(resultList);
      setSteps(algorithmSteps);
      setCurrentStep(0);
      setExecutionTime(endTime - startTime);
      setShowVisualization(true);
    }, 100);
  };

  const resetPlayground = () => {
    setInputValues("");
    setTargetValue("");
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setShowVisualization(false);
    setExecutionTime(0);
  };

  const testCases: [(string | number)[], string | number, (string | number)[]][] = [
    [['a', 'b', 'c', 'd', 'e', 'f'], 'c', ['a', 'b', 'd', 'e', 'f']],
    [['x', 'y', 'z'], 'z', ['x', 'y']],
    [['q', 'r', 's'], 'q', ['r', 's']],
    [['h', 'i', 'j', 'i'], 'i', ['h', 'j', 'i']],
    [['t'], 't', []],
    [[1, 2, 3, 4], 2, [1, 3, 4]],
    [[5, 5, 5], 5, [5, 5]]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Remove Node</span>
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
              <i className="fas fa-trash text-red-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Remove Node</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that removes the first occurrence of a target value from a linked list. 
                This problem teaches node deletion patterns and the important edge case of removing the head node.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                  placeholder="e.g. a,b,c,d,e,f"
                />
              </div>
              <div>
                <Label htmlFor="targetValue" className="block text-sm font-medium text-slate-700 mb-2">
                  Target Value to Remove
                </Label>
                <Input
                  id="targetValue"
                  type="text"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. c"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-trash mr-2"></i>
                Remove Node
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
                      Node Removed Successfully!
                    </div>
                    <div className="text-sm opacity-75 text-emerald-700">
                      Result: {result.length === 0 ? 'null' : result.join(' → ')}
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
                  step.action === 'found_target' ? 'border-red-400' :
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

              {/* Before/After Visualization */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Original List</h4>
                  <div 
                    className="p-4 bg-slate-50 rounded-lg min-h-[8rem] flex flex-col justify-center"
                    dangerouslySetInnerHTML={{ __html: step.originalVisualization }}
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Current State</h4>
                  <div 
                    className="p-4 bg-slate-50 rounded-lg min-h-[8rem] flex flex-col justify-center"
                    dangerouslySetInnerHTML={{ __html: step.currentVisualization }}
                  />
                </div>
              </div>

              {/* Status Information */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Removal Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-xs text-red-600 font-medium">TARGET</div>
                    <div className="font-mono text-lg text-red-800">{step.target}</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-xs text-blue-600 font-medium">CURRENT NODE</div>
                    <div className="font-mono text-lg text-blue-800">
                      {step.currentNode !== undefined ? step.currentNode : 'null'}
                    </div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="text-xs text-emerald-600 font-medium">STATUS</div>
                    <div className="text-sm text-emerald-800">
                      {step.found ? 'Found & Removing' : step.action === 'complete' ? 'Complete' : 'Searching'}
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
                {testCases.map(([input, target, expected], index) => (
                  <div
                    key={index}
                    onClick={() => runTestCase(input, target)}
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono">
                        {input.join(' → ')} | remove "{target}"
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
                    <h4 className="font-semibold text-emerald-800 mb-3">✅ Iterative Approach</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">removeNode</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">, </span><span className="text-orange-300">targetVal</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> === <span className="text-orange-300">targetVal</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">current</span> = <span className="text-orange-300">head</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">prev</span> = <span className="text-blue-400">null</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> === <span className="text-orange-300">targetVal</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'      '}<span className="text-yellow-300">prev</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'      '}<span className="text-purple-400">break</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'    '}<span className="text-yellow-300">prev</span> = <span className="text-yellow-300">current</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-yellow-300">current</span> = <span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-orange-300">head</span><span className="text-slate-400">;</span>{'\n'}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">removeNode</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">, </span><span className="text-orange-300">targetVal</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">null</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> === <span className="text-orange-300">targetVal</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">removeNode</span><span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">, </span><span className="text-orange-300">targetVal</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-orange-300">head</span><span className="text-slate-400">;</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2">Iterative Steps</h4>
                      <ol className="text-sm text-emerald-700 space-y-1 list-decimal list-inside">
                        <li>Check if head needs removal (special case)</li>
                        <li>Maintain prev and current pointers</li>
                        <li>Traverse until target found</li>
                        <li>Update prev.next to skip target node</li>
                        <li>Break to remove only first occurrence</li>
                      </ol>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Recursive Logic</h4>
                      <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside">
                        <li>Base case: null node</li>
                        <li>If current is target, return next</li>
                        <li>Recursively process rest of list</li>
                        <li>Connect current to processed rest</li>
                        <li>Return current node</li>
                      </ol>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Head removal is a special case requiring different handling</li>
                      <li>Two-pointer technique (prev/current) enables safe node removal</li>
                      <li>Break after first removal to handle "first occurrence only" requirement</li>
                      <li>Recursive approach naturally handles pointer updates through return values</li>
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