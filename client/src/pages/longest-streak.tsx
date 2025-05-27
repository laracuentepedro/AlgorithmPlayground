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
  action: 'initialize' | 'traverse' | 'start_new_streak' | 'continue_streak' | 'update_max' | 'complete' | 'recursive_call' | 'base_case';
  currentNode?: string | number | null;
  prevValue?: string | number | null;
  currentStreak: number;
  maxStreak: number;
  currentIndex: number;
  linkedListVisualization: string;
  approach: 'iterative' | 'recursive';
  recursionDepth?: number;
  result?: number;
}

export function LongestStreakPlayground() {
  const [inputValues, setInputValues] = useState("5,5,7,7,7,6");
  const [result, setResult] = useState<number | null>(null);
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
    streakStart: number = -1, 
    streakEnd: number = -1,
    maxStreakStart: number = -1,
    maxStreakEnd: number = -1
  ): string => {
    if (values.length === 0) {
      return '<span class="text-slate-500">null</span>';
    }
    
    const nodes = values.map((val, idx) => {
      let nodeClass = 'bg-white border-slate-300';
      let label = '';
      
      if (idx === currentIndex) {
        nodeClass = 'bg-blue-100 text-blue-800 border-blue-300';
        label = '<div class="text-xs text-blue-600 text-center mb-1">current</div>';
      } else if (idx >= maxStreakStart && idx <= maxStreakEnd && maxStreakStart !== -1) {
        nodeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        label = '<div class="text-xs text-emerald-600 text-center mb-1">max streak</div>';
      } else if (idx >= streakStart && idx <= streakEnd && streakStart !== -1) {
        nodeClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
        label = '<div class="text-xs text-yellow-600 text-center mb-1">current streak</div>';
      }
      
      const node = `<div class="inline-flex flex-col items-center">${label}<span class="inline-flex items-center px-3 py-2 rounded-lg border-2 ${nodeClass} font-mono font-semibold">${val}</span></div>`;
      const arrow = idx < values.length - 1 ? '<span class="mx-2 mt-6 text-slate-400">→</span>' : '';
      return node + arrow;
    }).join('');
    
    return `<div class="flex items-start">${nodes}<span class="ml-2 mt-6 text-slate-500">→ null</span></div>`;
  };

  const longestStreakIterative = (values: (string | number)[]) => {
    const steps: AlgorithmStep[] = [];
    
    if (values.length === 0) {
      steps.push({
        step: 1,
        description: "Empty list has no streaks",
        details: "Empty linked list returns streak length of 0",
        action: 'complete',
        currentStreak: 0,
        maxStreak: 0,
        currentIndex: -1,
        linkedListVisualization: createVisualization([]),
        approach: 'iterative',
        result: 0
      });
      return { result: 0, steps };
    }

    let maxStreak = 0;
    let currentStreak = 0;
    let prevVal: string | number | null = null;
    let streakStart = -1;
    let maxStreakStart = -1;
    let maxStreakEnd = -1;
    
    steps.push({
      step: 1,
      description: "Initialize streak tracking variables",
      details: `Starting streak analysis of linked list with ${values.length} nodes`,
      action: 'initialize',
      currentStreak: 0,
      maxStreak: 0,
      currentIndex: 0,
      linkedListVisualization: createVisualization(values, 0),
      approach: 'iterative'
    });

    for (let i = 0; i < values.length; i++) {
      const currentVal = values[i];
      
      steps.push({
        step: steps.length + 1,
        description: `Examining node ${i} with value "${currentVal}"`,
        details: `Current value: "${currentVal}", Previous value: ${prevVal === null ? 'null' : `"${prevVal}"`}`,
        action: 'traverse',
        currentNode: currentVal,
        prevValue: prevVal,
        currentStreak: currentStreak,
        maxStreak: maxStreak,
        currentIndex: i,
        linkedListVisualization: createVisualization(values, i, streakStart, i - 1, maxStreakStart, maxStreakEnd),
        approach: 'iterative'
      });

      if (currentVal === prevVal) {
        // Continue current streak
        currentStreak += 1;
        
        steps.push({
          step: steps.length + 1,
          description: `Continue streak: "${currentVal}" matches previous value`,
          details: `Current streak extended to ${currentStreak}`,
          action: 'continue_streak',
          currentNode: currentVal,
          prevValue: prevVal,
          currentStreak: currentStreak,
          maxStreak: maxStreak,
          currentIndex: i,
          linkedListVisualization: createVisualization(values, i, streakStart, i, maxStreakStart, maxStreakEnd),
          approach: 'iterative'
        });
      } else {
        // Start new streak
        currentStreak = 1;
        streakStart = i;
        
        steps.push({
          step: steps.length + 1,
          description: `Start new streak: "${currentVal}" is different from previous`,
          details: `New streak begins with length 1`,
          action: 'start_new_streak',
          currentNode: currentVal,
          prevValue: prevVal,
          currentStreak: currentStreak,
          maxStreak: maxStreak,
          currentIndex: i,
          linkedListVisualization: createVisualization(values, i, i, i, maxStreakStart, maxStreakEnd),
          approach: 'iterative'
        });
      }

      // Update max streak if current is longer
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
        maxStreakStart = streakStart;
        maxStreakEnd = i;
        
        steps.push({
          step: steps.length + 1,
          description: `New maximum streak found: ${maxStreak}`,
          details: `Current streak (${currentStreak}) is now the longest seen`,
          action: 'update_max',
          currentNode: currentVal,
          prevValue: prevVal,
          currentStreak: currentStreak,
          maxStreak: maxStreak,
          currentIndex: i,
          linkedListVisualization: createVisualization(values, i, streakStart, i, maxStreakStart, maxStreakEnd),
          approach: 'iterative'
        });
      }

      prevVal = currentVal;
    }

    steps.push({
      step: steps.length + 1,
      description: `Streak analysis complete! Longest streak: ${maxStreak}`,
      details: `Traversed entire list. Maximum consecutive streak length is ${maxStreak}`,
      action: 'complete',
      currentNode: null,
      prevValue: prevVal,
      currentStreak: currentStreak,
      maxStreak: maxStreak,
      currentIndex: -1,
      linkedListVisualization: createVisualization(values, -1, -1, -1, maxStreakStart, maxStreakEnd),
      approach: 'iterative',
      result: maxStreak
    });

    return { result: maxStreak, steps };
  };

  const longestStreakRecursive = (values: (string | number)[]) => {
    const steps: AlgorithmStep[] = [];
    
    if (values.length === 0) {
      steps.push({
        step: 1,
        description: "Empty list has no streaks",
        details: "Empty linked list returns streak length of 0",
        action: 'complete',
        currentStreak: 0,
        maxStreak: 0,
        currentIndex: -1,
        linkedListVisualization: createVisualization([]),
        approach: 'recursive',
        result: 0
      });
      return { result: 0, steps };
    }
    
    steps.push({
      step: 1,
      description: "Starting recursive streak analysis",
      details: `Beginning recursive analysis of linked list with ${values.length} nodes`,
      action: 'initialize',
      currentStreak: 0,
      maxStreak: 0,
      currentIndex: 0,
      linkedListVisualization: createVisualization(values, 0),
      approach: 'recursive',
      recursionDepth: 0
    });

    let globalMaxStreak = 0;
    let maxStreakStart = -1;
    let maxStreakEnd = -1;

    const findStreakRecursive = (
      index: number, 
      prevVal: string | number | null, 
      currentStreak: number, 
      depth: number
    ): number => {
      if (index >= values.length) {
        steps.push({
          step: steps.length + 1,
          description: `Base case reached: end of list`,
          details: `Recursion depth ${depth}: Reached end, final max streak: ${globalMaxStreak}`,
          action: 'base_case',
          currentStreak: currentStreak,
          maxStreak: globalMaxStreak,
          currentIndex: index,
          linkedListVisualization: createVisualization(values, -1, -1, -1, maxStreakStart, maxStreakEnd),
          approach: 'recursive',
          recursionDepth: depth
        });
        return globalMaxStreak;
      }

      const currentVal = values[index];
      let newStreak: number;

      steps.push({
        step: steps.length + 1,
        description: `Recursive call for node "${currentVal}"`,
        details: `Recursion depth ${depth}: Processing "${currentVal}", prev: ${prevVal === null ? 'null' : `"${prevVal}"`}`,
        action: 'recursive_call',
        currentNode: currentVal,
        prevValue: prevVal,
        currentStreak: currentStreak,
        maxStreak: globalMaxStreak,
        currentIndex: index,
        linkedListVisualization: createVisualization(values, index, -1, -1, maxStreakStart, maxStreakEnd),
        approach: 'recursive',
        recursionDepth: depth
      });

      if (currentVal === prevVal) {
        newStreak = currentStreak + 1;
        steps.push({
          step: steps.length + 1,
          description: `Continue streak: "${currentVal}" matches previous`,
          details: `Recursion depth ${depth}: Streak extended to ${newStreak}`,
          action: 'continue_streak',
          currentNode: currentVal,
          prevValue: prevVal,
          currentStreak: newStreak,
          maxStreak: globalMaxStreak,
          currentIndex: index,
          linkedListVisualization: createVisualization(values, index),
          approach: 'recursive',
          recursionDepth: depth
        });
      } else {
        newStreak = 1;
        steps.push({
          step: steps.length + 1,
          description: `Start new streak: "${currentVal}" is different`,
          details: `Recursion depth ${depth}: New streak begins with length 1`,
          action: 'start_new_streak',
          currentNode: currentVal,
          prevValue: prevVal,
          currentStreak: newStreak,
          maxStreak: globalMaxStreak,
          currentIndex: index,
          linkedListVisualization: createVisualization(values, index),
          approach: 'recursive',
          recursionDepth: depth
        });
      }

      if (newStreak > globalMaxStreak) {
        globalMaxStreak = newStreak;
        maxStreakEnd = index;
        maxStreakStart = index - newStreak + 1;
        
        steps.push({
          step: steps.length + 1,
          description: `New maximum streak found: ${globalMaxStreak}`,
          details: `Recursion depth ${depth}: Current streak (${newStreak}) is now the longest`,
          action: 'update_max',
          currentNode: currentVal,
          prevValue: prevVal,
          currentStreak: newStreak,
          maxStreak: globalMaxStreak,
          currentIndex: index,
          linkedListVisualization: createVisualization(values, index, -1, -1, maxStreakStart, maxStreakEnd),
          approach: 'recursive',
          recursionDepth: depth
        });
      }

      return findStreakRecursive(index + 1, currentVal, newStreak, depth + 1);
    };

    const finalResult = findStreakRecursive(0, null, 0, 0);

    steps.push({
      step: steps.length + 1,
      description: "Recursive streak analysis complete",
      details: `All recursive calls finished. Longest streak: ${finalResult}`,
      action: 'complete',
      currentStreak: 0,
      maxStreak: finalResult,
      currentIndex: -1,
      linkedListVisualization: createVisualization(values, -1, -1, -1, maxStreakStart, maxStreakEnd),
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

    const startTime = performance.now();
    const { result: streakLength, steps: algorithmSteps } = selectedApproach === 'iterative' 
      ? longestStreakIterative(values)
      : longestStreakRecursive(values);
    const endTime = performance.now();
    
    setResult(streakLength);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testValues: (string | number)[]) => {
    setInputValues(testValues.join(','));
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: streakLength, steps: algorithmSteps } = selectedApproach === 'iterative' 
        ? longestStreakIterative(testValues)
        : longestStreakRecursive(testValues);
      const endTime = performance.now();
      
      setResult(streakLength);
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

  const testCases: [(string | number)[], number][] = [
    [[5, 5, 7, 7, 7, 6], 3],
    [[3, 3, 3, 3, 9, 9], 4],
    [[9, 9, 1, 9, 9, 9], 3],
    [[5, 5], 2],
    [[4], 1],
    [[], 0],
    [['a', 'a', 'b', 'b', 'b', 'b'], 4]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Longest Streak</span>
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
              <i className="fas fa-chart-line text-orange-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Longest Streak</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that finds the length of the longest consecutive streak of the same value in a linked list. 
                This problem teaches sliding window patterns and maximum tracking across sequential data.
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
                placeholder="e.g. 5,5,7,7,7,6"
              />
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-chart-line mr-2"></i>
                Find Longest Streak
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
                      Longest Streak: {result}
                    </div>
                    <div className="text-sm opacity-75 text-emerald-700">
                      Found using {selectedApproach} approach
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
                  step.action === 'complete' ? 'border-emerald-400' : 
                  step.action === 'update_max' ? 'border-emerald-400' : 'border-blue-400'
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
                  className="p-4 bg-slate-50 rounded-lg min-h-[8rem] flex flex-col justify-center"
                  dangerouslySetInnerHTML={{ __html: step.linkedListVisualization }}
                />
              </div>

              {/* Streak Status */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Streak Tracking</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-xs text-yellow-600 font-medium">CURRENT STREAK</div>
                    <div className="font-mono text-2xl text-yellow-800">{step.currentStreak}</div>
                    {step.currentNode && (
                      <div className="text-xs text-yellow-600 mt-1">Value: {step.currentNode}</div>
                    )}
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="text-xs text-emerald-600 font-medium">MAX STREAK</div>
                    <div className="font-mono text-2xl text-emerald-800">{step.maxStreak}</div>
                    {step.result !== undefined && (
                      <div className="text-xs text-emerald-600 mt-1">Final Result</div>
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
                      {expected}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">longestStreak</span> = <span className="text-slate-400">(</span><span className="text-orange-300">head</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">maxStreak</span> = <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">currentStreak</span> = <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">currentNode</span> = <span className="text-orange-300">head</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">prevVal</span> = <span className="text-blue-400">null</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">currentNode</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">currentNode</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> === <span className="text-yellow-300">prevVal</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'      '}<span className="text-yellow-300">currentStreak</span> += <span className="text-green-400">1</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-slate-400">{`} else {`}</span>{'\n'}
                          {'      '}<span className="text-yellow-300">currentStreak</span> = <span className="text-green-400">1</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'    '}{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">currentStreak</span> &gt; <span className="text-yellow-300">maxStreak</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'      '}<span className="text-yellow-300">maxStreak</span> = <span className="text-yellow-300">currentStreak</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'    '}{'\n'}
                          {'    '}<span className="text-yellow-300">prevVal</span> = <span className="text-yellow-300">currentNode</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-yellow-300">currentNode</span> = <span className="text-yellow-300">currentNode</span><span className="text-slate-400">.</span><span className="text-yellow-300">next</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">maxStreak</span><span className="text-slate-400">;</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2">Algorithm Steps</h4>
                      <ol className="text-sm text-emerald-700 space-y-1 list-decimal list-inside">
                        <li>Initialize streak counters and previous value tracker</li>
                        <li>For each node, compare with previous value</li>
                        <li>If same: increment current streak</li>
                        <li>If different: reset current streak to 1</li>
                        <li>Update max streak if current is longer</li>
                        <li>Continue until end of list</li>
                      </ol>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Complexity Analysis</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div><strong>Time:</strong> O(n) - Single pass through list</div>
                        <div><strong>Space:</strong> O(1) - Only constant variables</div>
                        <div className="text-xs text-blue-600 mt-2">Optimal sliding window approach</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Sliding window pattern tracks consecutive sequences</li>
                      <li>Previous value comparison determines streak continuation</li>
                      <li>Maximum tracking ensures we find the longest streak</li>
                      <li>Single pass algorithm with optimal time and space complexity</li>
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