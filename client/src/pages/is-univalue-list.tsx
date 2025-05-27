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
  action: 'initialize' | 'traverse' | 'compare' | 'found_different' | 'continue' | 'complete' | 'recursive_call' | 'base_case';
  currentNode?: string | number | null;
  expectedValue: string | number;
  currentIndex: number;
  linkedListVisualization: string;
  approach: 'iterative' | 'recursive';
  recursionDepth?: number;
  result?: boolean;
}

export function IsUnivalueListPlayground() {
  const [inputValues, setInputValues] = useState("7,7,7");
  const [result, setResult] = useState<boolean | null>(null);
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

  const createVisualization = (values: (string | number)[], currentIndex: number = -1, expectedValue: string | number, foundDifferent: boolean = false): string => {
    if (values.length === 0) {
      return '<span class="text-slate-500">null</span>';
    }
    
    const nodes = values.map((val, idx) => {
      const isActive = idx === currentIndex;
      const isDifferent = val !== expectedValue;
      let nodeClass = 'bg-white border-slate-300';
      
      if (foundDifferent && isDifferent) {
        nodeClass = 'bg-red-100 text-red-800 border-red-300';
      } else if (isActive && isDifferent) {
        nodeClass = 'bg-red-100 text-red-800 border-red-300';
      } else if (isActive) {
        nodeClass = 'bg-blue-100 text-blue-800 border-blue-300';
      } else if (val === expectedValue) {
        nodeClass = 'bg-green-100 text-green-800 border-green-300';
      }
      
      const node = `<span class="inline-flex items-center px-3 py-2 rounded-lg border-2 ${nodeClass} font-mono font-semibold">${val}</span>`;
      const arrow = idx < values.length - 1 ? '<span class="mx-2 text-slate-400">→</span>' : '';
      return node + arrow;
    }).join('');
    
    const expectedDisplay = `<div class="mt-3 text-sm text-blue-600">Expected Value: <span class="font-mono font-bold text-lg">${expectedValue}</span></div>`;
    
    return `<div class="flex items-start">${nodes}<span class="ml-2 text-slate-500">→ null</span></div>` + expectedDisplay;
  };

  const isUnivalueListIterative = (values: (string | number)[]) => {
    const steps: AlgorithmStep[] = [];
    
    if (values.length === 0) {
      steps.push({
        step: 1,
        description: "Empty list is considered univalue",
        details: "Empty linked list has no values, so it's trivially univalue",
        action: 'complete',
        expectedValue: 'N/A',
        currentIndex: -1,
        linkedListVisualization: createVisualization([], -1, 'N/A'),
        approach: 'iterative',
        result: true
      });
      return { result: true, steps };
    }

    const expectedValue = values[0];
    
    steps.push({
      step: 1,
      description: `Initialize with expected value "${expectedValue}" from head`,
      details: `Starting validation - all nodes must have value "${expectedValue}"`,
      action: 'initialize',
      currentNode: expectedValue,
      expectedValue: expectedValue,
      currentIndex: 0,
      linkedListVisualization: createVisualization(values, 0, expectedValue),
      approach: 'iterative'
    });

    for (let i = 0; i < values.length; i++) {
      const currentVal = values[i];
      
      steps.push({
        step: steps.length + 1,
        description: `Examining node ${i} with value "${currentVal}"`,
        details: `Current pointer is at node containing "${currentVal}"`,
        action: 'traverse',
        currentNode: currentVal,
        expectedValue: expectedValue,
        currentIndex: i,
        linkedListVisualization: createVisualization(values, i, expectedValue),
        approach: 'iterative'
      });

      steps.push({
        step: steps.length + 1,
        description: `Compare "${currentVal}" with expected "${expectedValue}"`,
        details: `Checking if current.val (${currentVal}) === expected (${expectedValue})`,
        action: 'compare',
        currentNode: currentVal,
        expectedValue: expectedValue,
        currentIndex: i,
        linkedListVisualization: createVisualization(values, i, expectedValue),
        approach: 'iterative'
      });

      if (currentVal !== expectedValue) {
        steps.push({
          step: steps.length + 1,
          description: `Found different value! "${currentVal}" ≠ "${expectedValue}"`,
          details: `List is not univalue. Returning false.`,
          action: 'found_different',
          currentNode: currentVal,
          expectedValue: expectedValue,
          currentIndex: i,
          linkedListVisualization: createVisualization(values, i, expectedValue, true),
          approach: 'iterative',
          result: false
        });
        return { result: false, steps };
      }

      if (i < values.length - 1) {
        steps.push({
          step: steps.length + 1,
          description: `"${currentVal}" matches expected value, continue`,
          details: `Moving to next node`,
          action: 'continue',
          currentNode: currentVal,
          expectedValue: expectedValue,
          currentIndex: i,
          linkedListVisualization: createVisualization(values, i, expectedValue),
          approach: 'iterative'
        });
      }
    }

    steps.push({
      step: steps.length + 1,
      description: "All nodes have the same value - list is univalue!",
      details: `Reached end of list. All ${values.length} nodes have value "${expectedValue}". Returning true.`,
      action: 'complete',
      currentNode: null,
      expectedValue: expectedValue,
      currentIndex: -1,
      linkedListVisualization: createVisualization(values, -1, expectedValue),
      approach: 'iterative',
      result: true
    });

    return { result: true, steps };
  };

  const isUnivalueListRecursive = (values: (string | number)[]) => {
    const steps: AlgorithmStep[] = [];
    
    if (values.length === 0) {
      steps.push({
        step: 1,
        description: "Empty list is considered univalue",
        details: "Empty linked list has no values, so it's trivially univalue",
        action: 'complete',
        expectedValue: 'N/A',
        currentIndex: -1,
        linkedListVisualization: createVisualization([], -1, 'N/A'),
        approach: 'recursive',
        result: true
      });
      return { result: true, steps };
    }

    const expectedValue = values[0];
    
    steps.push({
      step: 1,
      description: "Starting recursive univalue validation",
      details: `Beginning recursive check with expected value "${expectedValue}"`,
      action: 'initialize',
      currentNode: expectedValue,
      expectedValue: expectedValue,
      currentIndex: 0,
      linkedListVisualization: createVisualization(values, 0, expectedValue),
      approach: 'recursive',
      recursionDepth: 0
    });

    const validateRecursive = (index: number, depth: number): boolean => {
      if (index >= values.length) {
        steps.push({
          step: steps.length + 1,
          description: `Base case reached: end of list`,
          details: `Recursion depth ${depth}: Reached end of list, all values match`,
          action: 'base_case',
          currentNode: null,
          expectedValue: expectedValue,
          currentIndex: index,
          linkedListVisualization: createVisualization(values, -1, expectedValue),
          approach: 'recursive',
          recursionDepth: depth
        });
        return true;
      }

      const currentVal = values[index];

      steps.push({
        step: steps.length + 1,
        description: `Recursive call for node "${currentVal}"`,
        details: `Recursion depth ${depth}: Processing node with value "${currentVal}"`,
        action: 'recursive_call',
        currentNode: currentVal,
        expectedValue: expectedValue,
        currentIndex: index,
        linkedListVisualization: createVisualization(values, index, expectedValue),
        approach: 'recursive',
        recursionDepth: depth
      });

      steps.push({
        step: steps.length + 1,
        description: `Compare "${currentVal}" with expected "${expectedValue}"`,
        details: `Recursion depth ${depth}: Checking if head.val (${currentVal}) === expected (${expectedValue})`,
        action: 'compare',
        currentNode: currentVal,
        expectedValue: expectedValue,
        currentIndex: index,
        linkedListVisualization: createVisualization(values, index, expectedValue),
        approach: 'recursive',
        recursionDepth: depth
      });

      if (currentVal !== expectedValue) {
        steps.push({
          step: steps.length + 1,
          description: `Found different value! Returning false`,
          details: `Recursion depth ${depth}: "${currentVal}" ≠ "${expectedValue}", return false`,
          action: 'found_different',
          currentNode: currentVal,
          expectedValue: expectedValue,
          currentIndex: index,
          linkedListVisualization: createVisualization(values, index, expectedValue, true),
          approach: 'recursive',
          recursionDepth: depth,
          result: false
        });
        return false;
      }

      return validateRecursive(index + 1, depth + 1);
    };

    const finalResult = validateRecursive(0, 0);

    steps.push({
      step: steps.length + 1,
      description: "Recursive validation complete",
      details: `All recursive calls finished. List is ${finalResult ? 'univalue' : 'not univalue'}.`,
      action: 'complete',
      currentNode: null,
      expectedValue: expectedValue,
      currentIndex: -1,
      linkedListVisualization: createVisualization(values, -1, expectedValue),
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

    if (values.length === 0) {
      alert('Please enter a valid non-empty list (comma-separated values)');
      return;
    }

    const startTime = performance.now();
    const { result: isUnivalue, steps: algorithmSteps } = selectedApproach === 'iterative' 
      ? isUnivalueListIterative(values)
      : isUnivalueListRecursive(values);
    const endTime = performance.now();
    
    setResult(isUnivalue);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testValues: (string | number)[]) => {
    setInputValues(testValues.join(','));
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: isUnivalue, steps: algorithmSteps } = selectedApproach === 'iterative' 
        ? isUnivalueListIterative(testValues)
        : isUnivalueListRecursive(testValues);
      const endTime = performance.now();
      
      setResult(isUnivalue);
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

  const testCases: [(string | number)[], boolean][] = [
    [[7, 7, 7], true],
    [[7, 7, 4], false],
    [[2, 2, 2, 2, 2], true],
    [[2, 2, 3, 3, 2], false],
    [['z'], true],
    [[2, 1, 2, 2, 2], false],
    [['a', 'a', 'a'], true],
    [[1], true]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Is Univalue List</span>
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-equals text-yellow-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Is Univalue List</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that determines if a linked list contains exactly one unique value. 
                This problem teaches validation patterns and early termination optimization when a difference is found.
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
                Linked List Values (comma-separated)
              </Label>
              <Input
                id="inputValues"
                type="text"
                value={inputValues}
                onChange={(e) => setInputValues(e.target.value)}
                className="font-mono"
                placeholder="e.g. 7,7,7"
              />
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-equals mr-2"></i>
                Check if Univalue
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
                <div className={`p-4 rounded-lg border-l-4 ${result ? 'border-emerald-400 bg-emerald-50' : 'border-red-400 bg-red-50'} animate-pulse-success flex items-center space-x-3`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${result ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    <i className={`fas ${result ? 'fa-check' : 'fa-times'}`}></i>
                  </div>
                  <div>
                    <div className={`font-semibold ${result ? 'text-emerald-800' : 'text-red-800'}`}>
                      {result ? 'List is Univalue!' : 'List is NOT Univalue'}
                    </div>
                    <div className={`text-sm opacity-75 ${result ? 'text-emerald-700' : 'text-red-700'}`}>
                      Validated using {selectedApproach} approach
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
                  step.action === 'found_different' ? 'border-red-400' :
                  step.action === 'complete' && step.result === true ? 'border-emerald-400' :
                  step.action === 'complete' && step.result === false ? 'border-red-400' : 'border-blue-400'
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

              {/* Validation Status */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Validation Status</h4>
                <div className={`border rounded-lg p-4 ${
                  step.result === true ? 'bg-emerald-50 border-emerald-200' : 
                  step.result === false ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg">
                      Expected: {step.expectedValue}
                    </span>
                    {step.result !== undefined && (
                      <span className={`text-sm font-medium ${step.result ? 'text-emerald-600' : 'text-red-600'}`}>
                        {step.result ? 'UNIVALUE' : 'NOT UNIVALUE'}
                      </span>
                    )}
                  </div>
                  {step.currentNode !== undefined && step.currentNode !== null && (
                    <div className="text-sm text-slate-600 mt-1">
                      Current: {step.currentNode}
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
                {testCases.map(([input, expected], index) => (
                  <div
                    key={index}
                    onClick={() => runTestCase(input)}
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono">
                        {input.join(' → ')}
                      </code>
                    </div>
                    <div className={`w-auto px-3 py-1 rounded-full text-sm font-medium ${expected ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {expected ? 'true' : 'false'}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">isUnivalueList</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">current</span> = <span className="text-orange-300">head</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> !== <span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">false</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-yellow-300">current</span> = <span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-blue-400">true</span><span className="text-slate-400">;</span>{'\n'}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">isUnivalueList</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">,</span> <span className="text-orange-300">prevVal</span> = <span className="text-blue-400">null</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">head</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">true</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">prevVal</span> === <span className="text-blue-400">null</span> || <span className="text-orange-300">prevVal</span> === <span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-purple-400">return</span> <span className="text-yellow-300">isUnivalueList</span><span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">,</span> <span className="text-orange-300">head</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`} else {`}</span>{'\n'}
                          {'    '}<span className="text-purple-400">return</span> <span className="text-blue-400">false</span><span className="text-slate-400">;</span>{'\n'}
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
                        <div><strong>Time:</strong> O(n) - Visit each node once</div>
                        <div><strong>Space:</strong> O(1) - Only constant variables</div>
                        <div className="text-xs text-emerald-600 mt-2">Early termination when difference found</div>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Recursive Approach</h4>
                      <div className="text-sm text-purple-700 space-y-1">
                        <div><strong>Time:</strong> O(n) - Visit each node once</div>
                        <div><strong>Space:</strong> O(n) - Call stack depth</div>
                        <div className="text-xs text-purple-600 mt-2">Passes expected value as parameter</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Early termination optimization - return false immediately when difference found</li>
                      <li>Use head's value as reference point for comparison</li>
                      <li>Simple validation pattern applies to many linked list problems</li>
                      <li>Demonstrates boolean return logic with traversal patterns</li>
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