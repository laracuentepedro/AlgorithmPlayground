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
  action: 'initialize' | 'traverse' | 'check_index' | 'insert_head' | 'found_position' | 'create_node' | 'update_pointers' | 'complete' | 'recursive_call' | 'base_case';
  currentNode?: string | number | null;
  currentIndex: number;
  targetIndex: number;
  newValue: string | number;
  originalVisualization: string;
  currentVisualization: string;
  approach: 'iterative' | 'recursive';
  recursionDepth?: number;
  result?: (string | number)[];
}

export function InsertNodePlayground() {
  const [inputValues, setInputValues] = useState("a,b,c,d");
  const [newValue, setNewValue] = useState("x");
  const [insertIndex, setInsertIndex] = useState("2");
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
    targetIndex: number = -1,
    newValue: string | number | null = null,
    isOriginal: boolean = false
  ): string => {
    if (values.length === 0) {
      return '<span class="text-slate-500">null</span>';
    }
    
    const nodes = values.map((val, idx) => {
      let nodeClass = 'bg-white border-slate-300';
      let label = '';
      
      if (idx === targetIndex && !isOriginal && newValue !== null && val === newValue) {
        nodeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        label = '<div class="text-xs text-emerald-600 text-center mb-1">new node</div>';
      } else if (idx === currentIndex) {
        nodeClass = 'bg-blue-100 text-blue-800 border-blue-300';
        label = '<div class="text-xs text-blue-600 text-center mb-1">current</div>';
      } else if (idx === targetIndex && isOriginal) {
        nodeClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
        label = '<div class="text-xs text-yellow-600 text-center mb-1">position</div>';
      }
      
      const node = `<div class="inline-flex flex-col items-center">${label}<span class="inline-flex items-center px-3 py-2 rounded-lg border-2 ${nodeClass} font-mono font-semibold">${val}</span></div>`;
      const arrow = idx < values.length - 1 ? '<span class="mx-2 mt-6 text-slate-400">→</span>' : '';
      return node + arrow;
    }).join('');
    
    return `<div class="flex items-start">${nodes}<span class="ml-2 mt-6 text-slate-500">→ null</span></div>`;
  };

  const insertNodeIterative = (values: (string | number)[], value: string | number, index: number) => {
    const steps: AlgorithmStep[] = [];
    const originalValues = [...values];
    const result = [...values];
    
    steps.push({
      step: 1,
      description: `Initialize insertion of "${value}" at index ${index}`,
      details: `Starting insertion process for value "${value}" at position ${index}`,
      action: 'initialize',
      currentIndex: 0,
      targetIndex: index,
      newValue: value,
      originalVisualization: createVisualization(originalValues, -1, index, value, true),
      currentVisualization: createVisualization(values, 0, index, value),
      approach: 'iterative'
    });

    // Check if inserting at head (index 0)
    if (index === 0) {
      steps.push({
        step: 2,
        description: `Insert at head (index 0)`,
        details: `Special case: inserting at head, create new node and point to current head`,
        action: 'insert_head',
        currentIndex: 0,
        targetIndex: index,
        newValue: value,
        originalVisualization: createVisualization(originalValues, -1, index, value, true),
        currentVisualization: createVisualization(values, 0, index, value),
        approach: 'iterative'
      });

      result.unshift(value);
      steps.push({
        step: 3,
        description: "Head insertion complete",
        details: `New node "${value}" inserted at head. Original head is now second node.`,
        action: 'complete',
        currentIndex: -1,
        targetIndex: index,
        newValue: value,
        originalVisualization: createVisualization(originalValues, -1, index, value, true),
        currentVisualization: createVisualization(result, -1, index, value),
        approach: 'iterative',
        result: result
      });
      
      return { result, steps };
    }

    // Traverse to find insertion position
    for (let i = 0; i < values.length; i++) {
      const currentVal = values[i];
      
      steps.push({
        step: steps.length + 1,
        description: `Examining position ${i}`,
        details: `Current position: ${i}, target position: ${index - 1} (insert after this)`,
        action: 'traverse',
        currentNode: currentVal,
        currentIndex: i,
        targetIndex: index,
        newValue: value,
        originalVisualization: createVisualization(originalValues, -1, index, value, true),
        currentVisualization: createVisualization(values, i, index, value),
        approach: 'iterative'
      });

      steps.push({
        step: steps.length + 1,
        description: `Check if position ${i} is target position ${index - 1}`,
        details: `Need to insert after position ${index - 1} to place new node at index ${index}`,
        action: 'check_index',
        currentNode: currentVal,
        currentIndex: i,
        targetIndex: index,
        newValue: value,
        originalVisualization: createVisualization(originalValues, -1, index, value, true),
        currentVisualization: createVisualization(values, i, index, value),
        approach: 'iterative'
      });

      if (i === index - 1) {
        steps.push({
          step: steps.length + 1,
          description: `Found insertion position! Insert after index ${i}`,
          details: `Position ${i} is where we insert after. New node will be at index ${index}.`,
          action: 'found_position',
          currentNode: currentVal,
          currentIndex: i,
          targetIndex: index,
          newValue: value,
          originalVisualization: createVisualization(originalValues, -1, index, value, true),
          currentVisualization: createVisualization(values, i, index, value),
          approach: 'iterative'
        });

        steps.push({
          step: steps.length + 1,
          description: `Create new node with value "${value}"`,
          details: `Creating new node and updating pointer connections`,
          action: 'create_node',
          currentNode: currentVal,
          currentIndex: i,
          targetIndex: index,
          newValue: value,
          originalVisualization: createVisualization(originalValues, -1, index, value, true),
          currentVisualization: createVisualization(values, i, index, value),
          approach: 'iterative'
        });

        // Insert the new value
        result.splice(index, 0, value);
        
        steps.push({
          step: steps.length + 1,
          description: `Update pointers to insert node`,
          details: `Set current.next = newNode, newNode.next = next. Node successfully inserted.`,
          action: 'update_pointers',
          currentNode: currentVal,
          currentIndex: i,
          targetIndex: index,
          newValue: value,
          originalVisualization: createVisualization(originalValues, -1, index, value, true),
          currentVisualization: createVisualization(result, -1, index, value),
          approach: 'iterative'
        });
        break;
      }
    }

    steps.push({
      step: steps.length + 1,
      description: `Node insertion complete`,
      details: `Successfully inserted "${value}" at index ${index}. List length increased by 1.`,
      action: 'complete',
      currentIndex: -1,
      targetIndex: index,
      newValue: value,
      originalVisualization: createVisualization(originalValues, -1, index, value, true),
      currentVisualization: createVisualization(result, -1, index, value),
      approach: 'iterative',
      result: result
    });

    return { result, steps };
  };

  const insertNodeRecursive = (values: (string | number)[], value: string | number, index: number) => {
    const steps: AlgorithmStep[] = [];
    const originalValues = [...values];
    
    steps.push({
      step: 1,
      description: "Starting recursive node insertion",
      details: `Beginning recursive insertion of "${value}" at index ${index}`,
      action: 'initialize',
      currentIndex: 0,
      targetIndex: index,
      newValue: value,
      originalVisualization: createVisualization(originalValues, -1, index, value, true),
      currentVisualization: createVisualization(values, 0, index, value),
      approach: 'recursive',
      recursionDepth: 0
    });

    let finalResult: (string | number)[] = [];

    const insertRecursive = (currentValues: (string | number)[], currentIndex: number, depth: number): (string | number)[] => {
      if (index === 0) {
        steps.push({
          step: steps.length + 1,
          description: `Base case: insert at head (index 0)`,
          details: `Recursion depth ${depth}: Inserting at head, return [newValue, ...rest]`,
          action: 'insert_head',
          currentIndex: 0,
          targetIndex: index,
          newValue: value,
          originalVisualization: createVisualization(originalValues, -1, index, value, true),
          currentVisualization: createVisualization(currentValues, 0, index, value),
          approach: 'recursive',
          recursionDepth: depth
        });
        return [value, ...currentValues];
      }

      if (currentIndex >= currentValues.length) {
        steps.push({
          step: steps.length + 1,
          description: `Base case reached: end of list`,
          details: `Recursion depth ${depth}: Reached end, insert at tail`,
          action: 'base_case',
          currentIndex: currentIndex,
          targetIndex: index,
          newValue: value,
          originalVisualization: createVisualization(originalValues, -1, index, value, true),
          currentVisualization: createVisualization(finalResult, -1, index, value),
          approach: 'recursive',
          recursionDepth: depth
        });
        return [value];
      }

      const currentVal = currentValues[currentIndex];

      steps.push({
        step: steps.length + 1,
        description: `Recursive call for position ${currentIndex}`,
        details: `Recursion depth ${depth}: Processing position ${currentIndex} with value "${currentVal}"`,
        action: 'recursive_call',
        currentNode: currentVal,
        currentIndex: currentIndex,
        targetIndex: index,
        newValue: value,
        originalVisualization: createVisualization(originalValues, -1, index, value, true),
        currentVisualization: createVisualization(currentValues, currentIndex, index, value),
        approach: 'recursive',
        recursionDepth: depth
      });

      if (currentIndex === index - 1) {
        steps.push({
          step: steps.length + 1,
          description: `Found insertion position! Insert after index ${currentIndex}`,
          details: `Recursion depth ${depth}: Insert new node after this position`,
          action: 'found_position',
          currentNode: currentVal,
          currentIndex: currentIndex,
          targetIndex: index,
          newValue: value,
          originalVisualization: createVisualization(originalValues, -1, index, value, true),
          currentVisualization: createVisualization(currentValues, currentIndex, index, value),
          approach: 'recursive',
          recursionDepth: depth
        });
        
        // Return current value, new value, then rest of list
        const rest = currentValues.slice(currentIndex + 1);
        return [currentVal, value, ...rest];
      }

      // Keep current value and recurse on rest
      const rest = insertRecursive(currentValues.slice(1), currentIndex + 1, depth + 1);
      return [currentVal, ...rest];
    };

    finalResult = insertRecursive(values, 0, 0);

    steps.push({
      step: steps.length + 1,
      description: "Recursive insertion complete",
      details: `All recursive calls finished. Successfully inserted "${value}" at index ${index}.`,
      action: 'complete',
      currentIndex: -1,
      targetIndex: index,
      newValue: value,
      originalVisualization: createVisualization(originalValues, -1, index, value, true),
      currentVisualization: createVisualization(finalResult, -1, index, value),
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
    const value = parseValue(newValue);
    const index = parseInt(insertIndex);

    if (values.length === 0) {
      alert('Please enter a valid non-empty list (comma-separated values)');
      return;
    }

    if (!newValue.trim()) {
      alert('Please enter a value to insert');
      return;
    }

    if (isNaN(index) || index < 0 || index > values.length) {
      alert(`Please enter a valid index (0 to ${values.length})`);
      return;
    }

    const startTime = performance.now();
    const { result: resultList, steps: algorithmSteps } = selectedApproach === 'iterative' 
      ? insertNodeIterative(values, value, index)
      : insertNodeRecursive(values, value, index);
    const endTime = performance.now();
    
    setResult(resultList);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testValues: (string | number)[], testValue: string | number, testIndex: number) => {
    setInputValues(testValues.join(','));
    setNewValue(testValue.toString());
    setInsertIndex(testIndex.toString());
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: resultList, steps: algorithmSteps } = selectedApproach === 'iterative' 
        ? insertNodeIterative(testValues, testValue, testIndex)
        : insertNodeRecursive(testValues, testValue, testIndex);
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
    setNewValue("");
    setInsertIndex("");
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setShowVisualization(false);
    setExecutionTime(0);
  };

  const testCases: [(string | number)[], string | number, number, (string | number)[]][] = [
    [['a', 'b', 'c', 'd'], 'x', 2, ['a', 'b', 'x', 'c', 'd']],
    [['a', 'b', 'c', 'd'], 'v', 3, ['a', 'b', 'c', 'v', 'd']],
    [['a', 'b', 'c', 'd'], 'm', 4, ['a', 'b', 'c', 'd', 'm']],
    [['a', 'b'], 'z', 0, ['z', 'a', 'b']],
    [[1, 2, 3], 0, 1, [1, 0, 2, 3]],
    [['x'], 'y', 1, ['x', 'y']],
    [['p', 'q'], 'r', 1, ['p', 'r', 'q']]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Insert Node</span>
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
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Insert Node</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that inserts a new node with a given value at a specified index in a linked list. 
                This problem teaches node insertion patterns and the important edge case of inserting at the head.
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                <Label htmlFor="newValue" className="block text-sm font-medium text-slate-700 mb-2">
                  Value to Insert
                </Label>
                <Input
                  id="newValue"
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. x"
                />
              </div>
              <div>
                <Label htmlFor="insertIndex" className="block text-sm font-medium text-slate-700 mb-2">
                  Index Position
                </Label>
                <Input
                  id="insertIndex"
                  type="number"
                  value={insertIndex}
                  onChange={(e) => setInsertIndex(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. 2"
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-plus mr-2"></i>
                Insert Node
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
                      Node Inserted Successfully!
                    </div>
                    <div className="text-sm opacity-75 text-emerald-700">
                      Result: {result.join(' → ')}
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
                  step.action === 'found_position' ? 'border-emerald-400' :
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
                <h4 className="text-sm font-medium text-slate-700 mb-3">Insertion Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="text-xs text-emerald-600 font-medium">NEW VALUE</div>
                    <div className="font-mono text-lg text-emerald-800">{step.newValue}</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-xs text-yellow-600 font-medium">TARGET INDEX</div>
                    <div className="font-mono text-lg text-yellow-800">{step.targetIndex}</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-xs text-blue-600 font-medium">CURRENT INDEX</div>
                    <div className="font-mono text-lg text-blue-800">{step.currentIndex}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="text-xs text-slate-600 font-medium">STATUS</div>
                    <div className="text-sm text-slate-800">
                      {step.action === 'complete' ? 'Complete' : 
                       step.action === 'found_position' ? 'Inserting' : 'Searching'}
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
                {testCases.map(([input, value, index, expected], caseIndex) => (
                  <div
                    key={caseIndex}
                    onClick={() => runTestCase(input, value, index)}
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono">
                        {input.join(' → ')} | insert "{value}" at {index}
                      </code>
                    </div>
                    <div className="w-auto px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                      {expected.join(' → ')}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">insertNode</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">, </span><span className="text-orange-300">value</span><span className="text-slate-400">, </span><span className="text-orange-300">index</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">index</span> === <span className="text-green-400">0</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-blue-400">const</span> <span className="text-yellow-300">newHead</span> = <span className="text-blue-400">new</span> <span className="text-yellow-300">Node</span><span className="text-slate-400">(</span><span className="text-orange-300">value</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}<span className="text-yellow-300">newHead</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-orange-300">head</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-purple-400">return</span> <span className="text-yellow-300">newHead</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">count</span> = <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">current</span> = <span className="text-orange-300">head</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">count</span> === <span className="text-orange-300">index</span> - <span className="text-green-400">1</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'      '}<span className="text-blue-400">const</span> <span className="text-yellow-300">next</span> = <span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'      '}<span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-blue-400">new</span> <span className="text-yellow-300">Node</span><span className="text-slate-400">(</span><span className="text-orange-300">value</span><span className="text-slate-400">);</span>{'\n'}
                          {'      '}<span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'    '}<span className="text-yellow-300">count</span> += <span className="text-green-400">1</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-yellow-300">current</span> = <span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">insertNode</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">, </span><span className="text-orange-300">value</span><span className="text-slate-400">, </span><span className="text-orange-300">index</span><span className="text-slate-400">, </span><span className="text-orange-300">count</span> = <span className="text-green-400">0</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">index</span> === <span className="text-green-400">0</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-blue-400">const</span> <span className="text-yellow-300">newHead</span> = <span className="text-blue-400">new</span> <span className="text-yellow-300">Node</span><span className="text-slate-400">(</span><span className="text-orange-300">value</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}<span className="text-yellow-300">newHead</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-orange-300">head</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-purple-400">return</span> <span className="text-yellow-300">newHead</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">count</span> === <span className="text-orange-300">index</span> - <span className="text-green-400">1</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-blue-400">const</span> <span className="text-yellow-300">next</span> = <span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-blue-400">new</span> <span className="text-yellow-300">Node</span><span className="text-slate-400">(</span><span className="text-orange-300">value</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}<span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span> = <span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-purple-400">return</span> <span className="text-orange-300">head</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-yellow-300">insertNode</span><span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">, </span><span className="text-orange-300">value</span><span className="text-slate-400">, </span><span className="text-orange-300">index</span><span className="text-slate-400">, </span><span className="text-orange-300">count</span> + <span className="text-green-400">1</span><span className="text-slate-400">);</span>{'\n'}
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
                        <li>Check if inserting at head (index 0)</li>
                        <li>Traverse to position index-1</li>
                        <li>Save the next pointer</li>
                        <li>Create new node and link it</li>
                        <li>Connect new node to saved next</li>
                      </ol>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Recursive Logic</h4>
                      <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside">
                        <li>Base case: index 0 (head insertion)</li>
                        <li>Check if current count equals index-1</li>
                        <li>If found, insert new node here</li>
                        <li>Otherwise, recurse with count+1</li>
                        <li>Return current head</li>
                      </ol>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Head insertion (index 0) requires special handling and returns new head</li>
                      <li>For other positions, insert after node at position index-1</li>
                      <li>Always save next pointer before breaking the chain</li>
                      <li>Three-step pointer update: current→new, new→saved, return head</li>
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