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
  action: 'initialize' | 'take_from_list1' | 'take_from_list2' | 'connect_node' | 'move_tail' | 'append_remaining' | 'complete' | 'recursive_call' | 'base_case';
  list1Values: (string | number)[];
  list2Values: (string | number)[];
  currentList1Index: number;
  currentList2Index: number;
  resultValues: (string | number)[];
  tailIndex: number;
  approach: 'iterative' | 'recursive';
  recursionDepth?: number;
  count?: number;
}

export function ZipperListsPlayground() {
  const [list1Input, setList1Input] = useState("a,b,c");
  const [list2Input, setList2Input] = useState("x,y,z");
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

  const zipperListsIterative = (list1: (string | number)[], list2: (string | number)[]) => {
    const steps: AlgorithmStep[] = [];
    const result: (string | number)[] = [];
    let current1Index = 1; // Start from second element of list1
    let current2Index = 0; // Start from first element of list2
    let count = 0;

    // Initialize with first element of list1
    if (list1.length > 0) {
      result.push(list1[0]);
    }

    steps.push({
      step: 1,
      description: "Initialize: Start with head of list1, set pointers for alternating",
      details: `Result starts with "${list1[0]}", current1 at index 1, current2 at index 0`,
      action: 'initialize',
      list1Values: [...list1],
      list2Values: [...list2],
      currentList1Index: current1Index,
      currentList2Index: current2Index,
      resultValues: [...result],
      tailIndex: 0,
      approach: 'iterative',
      count: 0
    });

    while (current1Index < list1.length && current2Index < list2.length) {
      if (count % 2 === 0) {
        // Take from list2
        const nodeValue = list2[current2Index];
        result.push(nodeValue);
        
        steps.push({
          step: steps.length + 1,
          description: `Take node "${nodeValue}" from list2 (even count: ${count})`,
          details: `Alternating pattern: taking from list2 at index ${current2Index}`,
          action: 'take_from_list2',
          list1Values: [...list1],
          list2Values: [...list2],
          currentList1Index: current1Index,
          currentList2Index: current2Index,
          resultValues: [...result],
          tailIndex: result.length - 1,
          approach: 'iterative',
          count: count
        });

        current2Index++;
      } else {
        // Take from list1
        const nodeValue = list1[current1Index];
        result.push(nodeValue);
        
        steps.push({
          step: steps.length + 1,
          description: `Take node "${nodeValue}" from list1 (odd count: ${count})`,
          details: `Alternating pattern: taking from list1 at index ${current1Index}`,
          action: 'take_from_list1',
          list1Values: [...list1],
          list2Values: [...list2],
          currentList1Index: current1Index,
          currentList2Index: current2Index,
          resultValues: [...result],
          tailIndex: result.length - 1,
          approach: 'iterative',
          count: count
        });

        current1Index++;
      }
      count++;
    }

    // Append remaining nodes from list1
    if (current1Index < list1.length) {
      const remaining = list1.slice(current1Index);
      result.push(...remaining);
      
      steps.push({
        step: steps.length + 1,
        description: `Append remaining nodes from list1: [${remaining.join(', ')}]`,
        details: `List2 exhausted, appending remaining ${remaining.length} nodes from list1`,
        action: 'append_remaining',
        list1Values: [...list1],
        list2Values: [...list2],
        currentList1Index: list1.length,
        currentList2Index: current2Index,
        resultValues: [...result],
        tailIndex: result.length - 1,
        approach: 'iterative',
        count: count
      });
    }

    // Append remaining nodes from list2
    if (current2Index < list2.length) {
      const remaining = list2.slice(current2Index);
      result.push(...remaining);
      
      steps.push({
        step: steps.length + 1,
        description: `Append remaining nodes from list2: [${remaining.join(', ')}]`,
        details: `List1 exhausted, appending remaining ${remaining.length} nodes from list2`,
        action: 'append_remaining',
        list1Values: [...list1],
        list2Values: [...list2],
        currentList1Index: current1Index,
        currentList2Index: list2.length,
        resultValues: [...result],
        tailIndex: result.length - 1,
        approach: 'iterative',
        count: count
      });
    }

    steps.push({
      step: steps.length + 1,
      description: "Zipper operation complete!",
      details: `Successfully merged lists into: [${result.join(' → ')}]`,
      action: 'complete',
      list1Values: [...list1],
      list2Values: [...list2],
      currentList1Index: -1,
      currentList2Index: -1,
      resultValues: [...result],
      tailIndex: -1,
      approach: 'iterative'
    });

    return { result, steps };
  };

  const zipperListsRecursive = (list1: (string | number)[], list2: (string | number)[]) => {
    const steps: AlgorithmStep[] = [];
    const result: (string | number)[] = [];

    steps.push({
      step: 1,
      description: "Starting recursive zipper merge",
      details: `Beginning recursive merge of list1: [${list1.join(', ')}] and list2: [${list2.join(', ')}]`,
      action: 'initialize',
      list1Values: [...list1],
      list2Values: [...list2],
      currentList1Index: 0,
      currentList2Index: 0,
      resultValues: [],
      tailIndex: -1,
      approach: 'recursive',
      recursionDepth: 0
    });

    const zipperRecursive = (idx1: number, idx2: number, depth: number): (string | number)[] => {
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
          resultValues: [...result],
          tailIndex: -1,
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
          resultValues: [...result],
          tailIndex: -1,
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
          resultValues: [...result],
          tailIndex: -1,
          approach: 'recursive',
          recursionDepth: depth
        });
        return remaining;
      }

      const val1 = list1[idx1];
      const val2 = list2[idx2];

      steps.push({
        step: steps.length + 1,
        description: `Recursive call: Take "${val1}" from list1, then "${val2}" from list2`,
        details: `Recursion depth ${depth}: Processing ${val1} (list1[${idx1}]) and ${val2} (list2[${idx2}])`,
        action: 'recursive_call',
        list1Values: [...list1],
        list2Values: [...list2],
        currentList1Index: idx1,
        currentList2Index: idx2,
        resultValues: [...result],
        tailIndex: -1,
        approach: 'recursive',
        recursionDepth: depth
      });

      const restOfZipper = zipperRecursive(idx1 + 1, idx2 + 1, depth + 1);
      const currentResult = [val1, val2, ...restOfZipper];
      
      steps.push({
        step: steps.length + 1,
        description: `Connect "${val1}" → "${val2}" → rest of zipper`,
        details: `Recursion depth ${depth}: Connecting current pair to result of recursive call`,
        action: 'connect_node',
        list1Values: [...list1],
        list2Values: [...list2],
        currentList1Index: idx1,
        currentList2Index: idx2,
        resultValues: currentResult,
        tailIndex: -1,
        approach: 'recursive',
        recursionDepth: depth
      });

      return currentResult;
    };

    const finalResult = zipperRecursive(0, 0, 0);

    steps.push({
      step: steps.length + 1,
      description: "Recursive zipper complete!",
      details: `All recursive calls finished. Final result: [${finalResult.join(' → ')}]`,
      action: 'complete',
      list1Values: [...list1],
      list2Values: [...list2],
      currentList1Index: -1,
      currentList2Index: -1,
      resultValues: finalResult,
      tailIndex: -1,
      approach: 'recursive'
    });

    return { result: finalResult, steps };
  };

  const parseValues = (input: string): (string | number)[] => {
    if (!input.trim()) return [];
    return input.split(',').map(s => parseValue(s.trim())).filter((_, index, arr) => input.split(',')[index]?.trim() !== '');
  };

  const runAlgorithm = () => {
    const list1 = parseValues(list1Input);
    const list2 = parseValues(list2Input);

    if (list1.length === 0 || list2.length === 0) {
      alert('Please enter valid non-empty lists (comma-separated values)');
      return;
    }

    const startTime = performance.now();
    const { result: zipperedList, steps: algorithmSteps } = selectedApproach === 'iterative' 
      ? zipperListsIterative(list1, list2)
      : zipperListsRecursive(list1, list2);
    const endTime = performance.now();
    
    setResult(zipperedList);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testList1: (string | number)[], testList2: (string | number)[]) => {
    setList1Input(testList1.join(','));
    setList2Input(testList2.join(','));
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: zipperedList, steps: algorithmSteps } = selectedApproach === 'iterative' 
        ? zipperListsIterative(testList1, testList2)
        : zipperListsRecursive(testList1, testList2);
      const endTime = performance.now();
      
      setResult(zipperedList);
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

  const testCases: [(string | number)[], (string | number)[], (string | number)[]][] = [
    [["a", "b", "c"], ["x", "y", "z"], ["a", "x", "b", "y", "c", "z"]],
    [["a", "b", "c", "d", "e", "f"], ["x", "y", "z"], ["a", "x", "b", "y", "c", "z", "d", "e", "f"]],
    [["s", "t"], [1, 2, 3, 4], ["s", 1, "t", 2, 3, 4]],
    [["w"], [1, 2, 3], ["w", 1, 2, 3]],
    [[1, 2, 3], ["w"], [1, "w", 2, 3]]
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

  const createListVisualization = (values: (string | number)[], currentIndex: number = -1, label: string = "", color: string = "slate") => {
    if (values.length === 0) {
      return `<div class="text-${color}-500 text-sm">${label}: empty</div>`;
    }

    const nodes = values.map((val, idx) => {
      const isActive = idx === currentIndex;
      const nodeClass = isActive ? `bg-${color}-100 text-${color}-800 border-${color}-300` : 'bg-white border-slate-300';
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Zipper Lists</span>
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
              <i className="fas fa-link text-purple-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Zipper Lists</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that merges two linked lists by alternating nodes from each list. 
                This teaches advanced pointer manipulation and in-place list operations with careful handling of different list lengths.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <i className="fas fa-clock"></i>
                  <span>Time: O(min(n,m))</span>
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
                  List 1 (comma-separated)
                </Label>
                <Input
                  id="list1Input"
                  type="text"
                  value={list1Input}
                  onChange={(e) => setList1Input(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. a,b,c"
                />
              </div>
              <div>
                <Label htmlFor="list2Input" className="block text-sm font-medium text-slate-700 mb-2">
                  List 2 (comma-separated)
                </Label>
                <Input
                  id="list2Input"
                  type="text"
                  value={list2Input}
                  onChange={(e) => setList2Input(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. x,y,z"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-link mr-2"></i>
                Zipper Lists Together
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
                      Zippered: {result.length === 0 ? 'null' : result.join(' → ')}
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
                  {step.count !== undefined && (
                    <div className="text-xs text-blue-600 mt-1">
                      Alternation Count: {step.count}
                    </div>
                  )}
                </div>
              </div>

              {/* Lists Visualization */}
              <div className="mb-6 space-y-4">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: createListVisualization(step.list1Values, step.currentList1Index, "List 1", "blue") 
                  }}
                />
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: createListVisualization(step.list2Values, step.currentList2Index, "List 2", "violet") 
                  }}
                />
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: createListVisualization(step.resultValues, step.tailIndex, "Zippered Result", "emerald") 
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
                          {list1.join(' → ')}
                        </code>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-violet-600">List 2:</span>
                        <code className="bg-white px-2 py-1 rounded border font-mono">
                          {list2.join(' → ')}
                        </code>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-emerald-600">Result:</span>
                        <code className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded border font-mono">
                          {expected.join(' → ')}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">zipperLists</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head1</span><span className="text-slate-400">,</span> <span className="text-orange-300">head2</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">head</span> = <span className="text-orange-300">head1</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">tail</span> = <span className="text-orange-300">head</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">current1</span> = <span className="text-orange-300">head1</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">current2</span> = <span className="text-orange-300">head2</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">count</span> = <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current1</span> !== <span className="text-blue-400">null</span> && <span className="text-yellow-300">current2</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">count</span> % <span className="text-green-400">2</span> === <span className="text-green-400">0</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'      '}<span className="text-yellow-300">tail</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">current2</span><span className="text-slate-400">;</span>{'\n'}
                          {'      '}<span className="text-yellow-300">current2</span> = <span className="text-yellow-300">current2</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-slate-400">{`} else {`}</span>{'\n'}
                          {'      '}<span className="text-yellow-300">tail</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">current1</span><span className="text-slate-400">;</span>{'\n'}
                          {'      '}<span className="text-yellow-300">current1</span> = <span className="text-yellow-300">current1</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'    '}<span className="text-yellow-300">tail</span> = <span className="text-yellow-300">tail</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-yellow-300">count</span> += <span className="text-green-400">1</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current1</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-yellow-300">tail</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">current1</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current2</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-yellow-300">tail</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">current2</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">head</span><span className="text-slate-400">;</span>{'\n'}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">zipperLists</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head1</span><span className="text-slate-400">,</span> <span className="text-orange-300">head2</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head1</span> === <span className="text-blue-400">null</span> && <span className="text-orange-300">head2</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">null</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head1</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-orange-300">head2</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head2</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-orange-300">head1</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">next1</span> = <span className="text-orange-300">head1</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">next2</span> = <span className="text-orange-300">head2</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-orange-300">head1</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-orange-300">head2</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-orange-300">head2</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">zipperLists</span><span className="text-slate-400">(</span><span className="text-yellow-300">next1</span><span className="text-slate-400">,</span> <span className="text-yellow-300">next2</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-orange-300">head1</span><span className="text-slate-400">;</span>{'\n'}
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
                        <div><strong>Time:</strong> O(min(n,m)) - Process both lists</div>
                        <div><strong>Space:</strong> O(1) - Only constant variables</div>
                        <div className="text-xs text-emerald-600 mt-2">Uses counter for alternating pattern</div>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Recursive Approach</h4>
                      <div className="text-sm text-purple-700 space-y-1">
                        <div><strong>Time:</strong> O(min(n,m)) - Process both lists</div>
                        <div><strong>Space:</strong> O(min(n,m)) - Call stack depth</div>
                        <div className="text-xs text-purple-600 mt-2">Elegant recursive structure</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>In-place operation modifies original nodes without creating new ones</li>
                      <li>Alternating pattern requires careful counter management or recursive structure</li>
                      <li>Must handle remaining nodes when lists have different lengths</li>
                      <li>Demonstrates advanced pointer manipulation for merging operations</li>
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