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
  action: 'initialize' | 'compare' | 'take_from_list1' | 'take_from_list2' | 'append_remaining' | 'complete' | 'recursive_call' | 'base_case';
  list1Values: number[];
  list2Values: number[];
  currentList1Index: number;
  currentList2Index: number;
  resultValues: number[];
  currentComparison?: string;
  approach: 'iterative' | 'recursive';
  recursionDepth?: number;
}

export function MergeListsPlayground() {
  const [list1Input, setList1Input] = useState("5,7,10,12,20,28");
  const [list2Input, setList2Input] = useState("6,8,9,25");
  const [result, setResult] = useState<number[] | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState<'iterative' | 'recursive'>('iterative');

  const mergeListsIterative = (list1: number[], list2: number[]) => {
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];
    let current1Index = 0;
    let current2Index = 0;

    steps.push({
      step: 1,
      description: "Initialize pointers for both sorted lists",
      details: `Starting merge of sorted list1: [${list1.join(', ')}] and list2: [${list2.join(', ')}]`,
      action: 'initialize',
      list1Values: [...list1],
      list2Values: [...list2],
      currentList1Index: 0,
      currentList2Index: 0,
      resultValues: [],
      approach: 'iterative'
    });

    while (current1Index < list1.length && current2Index < list2.length) {
      const val1 = list1[current1Index];
      const val2 = list2[current2Index];

      steps.push({
        step: steps.length + 1,
        description: `Compare ${val1} vs ${val2}`,
        details: `Comparing current elements: list1[${current1Index}] = ${val1}, list2[${current2Index}] = ${val2}`,
        action: 'compare',
        list1Values: [...list1],
        list2Values: [...list2],
        currentList1Index: current1Index,
        currentList2Index: current2Index,
        resultValues: [...result],
        currentComparison: `${val1} ${val1 < val2 ? '<' : val1 > val2 ? '>' : '='} ${val2}`,
        approach: 'iterative'
      });

      if (val1 <= val2) {
        result.push(val1);
        steps.push({
          step: steps.length + 1,
          description: `Take ${val1} from list1 (${val1} ≤ ${val2})`,
          details: `${val1} is smaller or equal, add to result and advance list1 pointer`,
          action: 'take_from_list1',
          list1Values: [...list1],
          list2Values: [...list2],
          currentList1Index: current1Index,
          currentList2Index: current2Index,
          resultValues: [...result],
          approach: 'iterative'
        });
        current1Index++;
      } else {
        result.push(val2);
        steps.push({
          step: steps.length + 1,
          description: `Take ${val2} from list2 (${val2} < ${val1})`,
          details: `${val2} is smaller, add to result and advance list2 pointer`,
          action: 'take_from_list2',
          list1Values: [...list1],
          list2Values: [...list2],
          currentList1Index: current1Index,
          currentList2Index: current2Index,
          resultValues: [...result],
          approach: 'iterative'
        });
        current2Index++;
      }
    }

    // Append remaining elements from list1
    if (current1Index < list1.length) {
      const remaining = list1.slice(current1Index);
      result.push(...remaining);
      
      steps.push({
        step: steps.length + 1,
        description: `Append remaining from list1: [${remaining.join(', ')}]`,
        details: `List2 exhausted, appending remaining ${remaining.length} elements from list1`,
        action: 'append_remaining',
        list1Values: [...list1],
        list2Values: [...list2],
        currentList1Index: list1.length,
        currentList2Index: current2Index,
        resultValues: [...result],
        approach: 'iterative'
      });
    }

    // Append remaining elements from list2
    if (current2Index < list2.length) {
      const remaining = list2.slice(current2Index);
      result.push(...remaining);
      
      steps.push({
        step: steps.length + 1,
        description: `Append remaining from list2: [${remaining.join(', ')}]`,
        details: `List1 exhausted, appending remaining ${remaining.length} elements from list2`,
        action: 'append_remaining',
        list1Values: [...list1],
        list2Values: [...list2],
        currentList1Index: current1Index,
        currentList2Index: list2.length,
        resultValues: [...result],
        approach: 'iterative'
      });
    }

    steps.push({
      step: steps.length + 1,
      description: "Merge complete! Sorted list created",
      details: `Successfully merged into sorted result: [${result.join(', ')}]`,
      action: 'complete',
      list1Values: [...list1],
      list2Values: [...list2],
      currentList1Index: -1,
      currentList2Index: -1,
      resultValues: [...result],
      approach: 'iterative'
    });

    return { result, steps };
  };

  const mergeListsRecursive = (list1: number[], list2: number[]) => {
    const steps: AlgorithmStep[] = [];

    steps.push({
      step: 1,
      description: "Starting recursive merge of sorted lists",
      details: `Beginning recursive merge of list1: [${list1.join(', ')}] and list2: [${list2.join(', ')}]`,
      action: 'initialize',
      list1Values: [...list1],
      list2Values: [...list2],
      currentList1Index: 0,
      currentList2Index: 0,
      resultValues: [],
      approach: 'recursive',
      recursionDepth: 0
    });

    const mergeRecursive = (idx1: number, idx2: number, depth: number): number[] => {
      if (idx1 >= list1.length && idx2 >= list2.length) {
        steps.push({
          step: steps.length + 1,
          description: `Base case: Both lists exhausted`,
          details: `Recursion depth ${depth}: Both lists fully processed, returning empty`,
          action: 'base_case',
          list1Values: [...list1],
          list2Values: [...list2],
          currentList1Index: idx1,
          currentList2Index: idx2,
          resultValues: [],
          approach: 'recursive',
          recursionDepth: depth
        });
        return [];
      }

      if (idx1 >= list1.length) {
        const remaining = list2.slice(idx2);
        steps.push({
          step: steps.length + 1,
          description: `Base case: List1 exhausted, return remaining list2`,
          details: `Recursion depth ${depth}: Returning remaining list2: [${remaining.join(', ')}]`,
          action: 'base_case',
          list1Values: [...list1],
          list2Values: [...list2],
          currentList1Index: idx1,
          currentList2Index: idx2,
          resultValues: remaining,
          approach: 'recursive',
          recursionDepth: depth
        });
        return remaining;
      }

      if (idx2 >= list2.length) {
        const remaining = list1.slice(idx1);
        steps.push({
          step: steps.length + 1,
          description: `Base case: List2 exhausted, return remaining list1`,
          details: `Recursion depth ${depth}: Returning remaining list1: [${remaining.join(', ')}]`,
          action: 'base_case',
          list1Values: [...list1],
          list2Values: [...list2],
          currentList1Index: idx1,
          currentList2Index: idx2,
          resultValues: remaining,
          approach: 'recursive',
          recursionDepth: depth
        });
        return remaining;
      }

      const val1 = list1[idx1];
      const val2 = list2[idx2];

      steps.push({
        step: steps.length + 1,
        description: `Compare ${val1} vs ${val2}`,
        details: `Recursion depth ${depth}: Comparing ${val1} (list1[${idx1}]) vs ${val2} (list2[${idx2}])`,
        action: 'compare',
        list1Values: [...list1],
        list2Values: [...list2],
        currentList1Index: idx1,
        currentList2Index: idx2,
        resultValues: [],
        currentComparison: `${val1} ${val1 <= val2 ? '≤' : '>'} ${val2}`,
        approach: 'recursive',
        recursionDepth: depth
      });

      if (val1 <= val2) {
        steps.push({
          step: steps.length + 1,
          description: `Take ${val1} from list1, recurse with remaining`,
          details: `Recursion depth ${depth}: ${val1} ≤ ${val2}, choose ${val1} and recurse`,
          action: 'recursive_call',
          list1Values: [...list1],
          list2Values: [...list2],
          currentList1Index: idx1,
          currentList2Index: idx2,
          resultValues: [],
          approach: 'recursive',
          recursionDepth: depth
        });

        const restOfMerge = mergeRecursive(idx1 + 1, idx2, depth + 1);
        const currentResult = [val1, ...restOfMerge];
        
        steps.push({
          step: steps.length + 1,
          description: `Connect ${val1} to result of recursive call`,
          details: `Recursion depth ${depth}: Prepending ${val1} to recursive result`,
          action: 'take_from_list1',
          list1Values: [...list1],
          list2Values: [...list2],
          currentList1Index: idx1,
          currentList2Index: idx2,
          resultValues: currentResult,
          approach: 'recursive',
          recursionDepth: depth
        });

        return currentResult;
      } else {
        steps.push({
          step: steps.length + 1,
          description: `Take ${val2} from list2, recurse with remaining`,
          details: `Recursion depth ${depth}: ${val2} < ${val1}, choose ${val2} and recurse`,
          action: 'recursive_call',
          list1Values: [...list1],
          list2Values: [...list2],
          currentList1Index: idx1,
          currentList2Index: idx2,
          resultValues: [],
          approach: 'recursive',
          recursionDepth: depth
        });

        const restOfMerge = mergeRecursive(idx1, idx2 + 1, depth + 1);
        const currentResult = [val2, ...restOfMerge];
        
        steps.push({
          step: steps.length + 1,
          description: `Connect ${val2} to result of recursive call`,
          details: `Recursion depth ${depth}: Prepending ${val2} to recursive result`,
          action: 'take_from_list2',
          list1Values: [...list1],
          list2Values: [...list2],
          currentList1Index: idx1,
          currentList2Index: idx2,
          resultValues: currentResult,
          approach: 'recursive',
          recursionDepth: depth
        });

        return currentResult;
      }
    };

    const finalResult = mergeRecursive(0, 0, 0);

    steps.push({
      step: steps.length + 1,
      description: "Recursive merge complete!",
      details: `All recursive calls finished. Final sorted result: [${finalResult.join(', ')}]`,
      action: 'complete',
      list1Values: [...list1],
      list2Values: [...list2],
      currentList1Index: -1,
      currentList2Index: -1,
      resultValues: finalResult,
      approach: 'recursive'
    });

    return { result: finalResult, steps };
  };

  const parseValues = (input: string): number[] => {
    if (!input.trim()) return [];
    return input.split(',').map(s => {
      const num = parseFloat(s.trim());
      return isNaN(num) ? 0 : num;
    }).filter((_, index, arr) => input.split(',')[index]?.trim() !== '');
  };

  const runAlgorithm = () => {
    const list1 = parseValues(list1Input);
    const list2 = parseValues(list2Input);

    if (list1.length === 0 || list2.length === 0) {
      alert('Please enter valid non-empty sorted lists (comma-separated numbers)');
      return;
    }

    // Check if lists are sorted
    const isSorted = (arr: number[]) => {
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) return false;
      }
      return true;
    };

    if (!isSorted(list1) || !isSorted(list2)) {
      alert('Please ensure both lists are sorted in ascending order');
      return;
    }

    const startTime = performance.now();
    const { result: mergedList, steps: algorithmSteps } = selectedApproach === 'iterative' 
      ? mergeListsIterative(list1, list2)
      : mergeListsRecursive(list1, list2);
    const endTime = performance.now();
    
    setResult(mergedList);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testList1: number[], testList2: number[]) => {
    setList1Input(testList1.join(','));
    setList2Input(testList2.join(','));
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: mergedList, steps: algorithmSteps } = selectedApproach === 'iterative' 
        ? mergeListsIterative(testList1, testList2)
        : mergeListsRecursive(testList1, testList2);
      const endTime = performance.now();
      
      setResult(mergedList);
      setSteps(algorithmSteps);
      setCurrentStep(0);
      setExecutionTime(endTime - startTime);
      setShowVisualization(true);
    }, 100);
  };

  const resetPlayground = () => {
    setList1Input("");
    setList2Input("");
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setShowVisualization(false);
    setExecutionTime(0);
  };

  const testCases: [number[], number[], number[]][] = [
    [[5, 7, 10, 12, 20, 28], [6, 8, 9, 25], [5, 6, 7, 8, 9, 10, 12, 20, 25, 28]],
    [[5, 7, 10, 12, 20, 28], [1, 8, 9, 10], [1, 5, 7, 8, 9, 10, 10, 12, 20, 28]],
    [[30], [15, 67], [15, 30, 67]],
    [[1, 3, 5], [2, 4, 6], [1, 2, 3, 4, 5, 6]],
    [[1], [2], [1, 2]]
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

  const createListVisualization = (values: number[], currentIndex: number = -1, label: string = "", color: string = "slate") => {
    if (values.length === 0) {
      return `<div class="text-${color}-500 text-sm">${label}: empty</div>`;
    }

    const nodes = values.map((val, idx) => {
      const isActive = idx === currentIndex;
      const nodeClass = isActive ? `bg-${color}-100 text-${color}-800 border-${color}-300 font-bold` : 'bg-white border-slate-300';
      return `<span class="inline-flex items-center px-3 py-2 rounded-lg border-2 ${nodeClass} font-mono font-semibold">${val}</span>`;
    }).join('<span class="mx-2 text-slate-400">→</span>');

    return `<div class="mb-2"><div class="text-sm font-medium text-${color}-700 mb-2">${label}</div><div class="flex items-center">${nodes}<span class="ml-2 text-slate-500">→ null</span></div></div>`;
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Merge Lists</span>
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
              <i className="fas fa-code-merge text-green-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Merge Sorted Lists</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that merges two sorted linked lists into a single sorted list. 
                This classic problem teaches the two-pointer technique for maintaining sorted order during merging operations.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <i className="fas fa-clock"></i>
                  <span>Time: O(n + m)</span>
                </div>
                <div className="flex items-center space-x-2 text-violet-600">
                  <i className="fas fa-memory"></i>
                  <span>Space: O(1) iterative / O(min(n,m)) recursive</span>
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
                  <span>Iterative (O(1) space)</span>
                </Button>
                <Button
                  onClick={() => setSelectedApproach('recursive')}
                  variant={selectedApproach === 'recursive' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-layer-group"></i>
                  <span>Recursive (O(min(n,m)) space)</span>
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="list1Input" className="block text-sm font-medium text-slate-700 mb-2">
                  Sorted List 1 (comma-separated numbers)
                </Label>
                <Input
                  id="list1Input"
                  type="text"
                  value={list1Input}
                  onChange={(e) => setList1Input(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. 5,7,10,12,20,28"
                />
              </div>
              <div>
                <Label htmlFor="list2Input" className="block text-sm font-medium text-slate-700 mb-2">
                  Sorted List 2 (comma-separated numbers)
                </Label>
                <Input
                  id="list2Input"
                  type="text"
                  value={list2Input}
                  onChange={(e) => setList2Input(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. 6,8,9,25"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-code-merge mr-2"></i>
                Merge Sorted Lists
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
                      Merged: [{result.join(', ')}]
                    </div>
                    <div className="text-sm opacity-75 text-emerald-700">
                      Successfully merged using {selectedApproach} approach
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
                  {step.currentComparison && (
                    <div className="text-xs text-blue-600 mt-1 font-mono">
                      {step.currentComparison}
                    </div>
                  )}
                </div>
              </div>

              {/* Lists Visualization */}
              <div className="mb-6 space-y-4">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: createListVisualization(step.list1Values, step.currentList1Index, "Sorted List 1", "blue") 
                  }}
                />
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: createListVisualization(step.list2Values, step.currentList2Index, "Sorted List 2", "violet") 
                  }}
                />
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: createListVisualization(step.resultValues, -1, "Merged Result", "emerald") 
                  }}
                />
              </div>

              {/* Current Progress */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Merge Progress</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600 font-medium">List 1 Position:</span>
                      <span className="ml-2 font-mono">
                        {step.currentList1Index >= step.list1Values.length ? 'exhausted' : 
                         step.currentList1Index < 0 ? 'complete' : step.currentList1Index}
                      </span>
                    </div>
                    <div>
                      <span className="text-violet-600 font-medium">List 2 Position:</span>
                      <span className="ml-2 font-mono">
                        {step.currentList2Index >= step.list2Values.length ? 'exhausted' : 
                         step.currentList2Index < 0 ? 'complete' : step.currentList2Index}
                      </span>
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
                {testCases.map(([list1, list2, expected], index) => (
                  <div
                    key={index}
                    onClick={() => runTestCase(list1, list2)}
                    className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-blue-600">List 1:</span>
                        <code className="bg-white px-2 py-1 rounded border font-mono">
                          [{list1.join(', ')}]
                        </code>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-violet-600">List 2:</span>
                        <code className="bg-white px-2 py-1 rounded border font-mono">
                          [{list2.join(', ')}]
                        </code>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-emerald-600">Merged:</span>
                        <code className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded border font-mono">
                          [{expected.join(', ')}]
                        </code>
                      </div>
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">mergeLists</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head1</span><span className="text-slate-400">,</span> <span className="text-orange-300">head2</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">dummyHead</span> = <span className="text-purple-400">new</span> <span className="text-yellow-300">Node</span><span className="text-slate-400">(</span><span className="text-blue-400">null</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">tail</span> = <span className="text-yellow-300">dummyHead</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">current1</span> = <span className="text-orange-300">head1</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">current2</span> = <span className="text-orange-300">head2</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current1</span> !== <span className="text-blue-400">null</span> && <span className="text-yellow-300">current2</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current1</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> &lt; <span className="text-yellow-300">current2</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'      '}<span className="text-yellow-300">tail</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">current1</span><span className="text-slate-400">;</span>{'\n'}
                          {'      '}<span className="text-yellow-300">current1</span> = <span className="text-yellow-300">current1</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-slate-400">{`} else {`}</span>{'\n'}
                          {'      '}<span className="text-yellow-300">tail</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">current2</span><span className="text-slate-400">;</span>{'\n'}
                          {'      '}<span className="text-yellow-300">current2</span> = <span className="text-yellow-300">current2</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'    '}<span className="text-yellow-300">tail</span> = <span className="text-yellow-300">tail</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current1</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-yellow-300">tail</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">current1</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current2</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-yellow-300">tail</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">current2</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">dummyHead</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">mergeLists</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head1</span><span className="text-slate-400">,</span> <span className="text-orange-300">head2</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head1</span> === <span className="text-blue-400">null</span> && <span className="text-orange-300">head2</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">null</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head1</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-orange-300">head2</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head2</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-orange-300">head1</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head1</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> &lt; <span className="text-orange-300">head2</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-blue-400">const</span> <span className="text-yellow-300">next1</span> = <span className="text-orange-300">head1</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-orange-300">head1</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">mergeLists</span><span className="text-slate-400">(</span><span className="text-yellow-300">next1</span><span className="text-slate-400">,</span> <span className="text-orange-300">head2</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}<span className="text-purple-400">return</span> <span className="text-orange-300">head1</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`} else {`}</span>{'\n'}
                          {'    '}<span className="text-blue-400">const</span> <span className="text-yellow-300">next2</span> = <span className="text-orange-300">head2</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-orange-300">head2</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">mergeLists</span><span className="text-slate-400">(</span><span className="text-orange-300">head1</span><span className="text-slate-400">,</span> <span className="text-yellow-300">next2</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}<span className="text-purple-400">return</span> <span className="text-orange-300">head2</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
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
                        <div><strong>Time:</strong> O(n + m) - Process all nodes</div>
                        <div><strong>Space:</strong> O(1) - Only constant variables</div>
                        <div className="text-xs text-emerald-600 mt-2">Uses dummy head for cleaner pointer management</div>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Recursive Approach</h4>
                      <div className="text-sm text-purple-700 space-y-1">
                        <div><strong>Time:</strong> O(n + m) - Process all nodes</div>
                        <div><strong>Space:</strong> O(min(n,m)) - Call stack depth</div>
                        <div className="text-xs text-purple-600 mt-2">Elegant divide-and-conquer approach</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Two-pointer technique maintains sorted order by comparing current elements</li>
                      <li>Dummy head node simplifies edge cases in iterative approach</li>
                      <li>Must handle remaining nodes when one list is exhausted</li>
                      <li>Classic example of merge operation from merge sort algorithm</li>
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