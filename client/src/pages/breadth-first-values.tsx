import { useState } from "react";
import { ProblemsSidebar } from "@/components/ProblemsSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Binary Tree Node class
class TreeNode {
  val: string | number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val: string | number) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

export interface AlgorithmStep {
  step: number;
  description: string;
  details: string;
  action: 'initialize' | 'visit_node' | 'add_children' | 'dequeue' | 'add_to_result' | 'complete';
  currentNode?: string | number | null;
  queue?: (string | number)[];
  result: (string | number)[];
  treeVisualization: string;
  currentLevel?: number;
}

export function BreadthFirstValuesPlayground() {
  const [inputStructure, setInputStructure] = useState("a,b,c,d,e,null,f");
  const [result, setResult] = useState<(string | number)[] | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);

  const parseValue = (val: string): string | number | null => {
    if (val.toLowerCase() === 'null') return null;
    const numVal = parseFloat(val);
    return isNaN(numVal) ? val : numVal;
  };

  const createTreeVisualization = (
    structure: (string | number | null)[], 
    currentIndex: number = -1,
    visitedNodes: Set<number> = new Set(),
    queue: (string | number)[] = [],
    currentLevel: number = 0
  ): string => {
    if (structure.length === 0 || structure[0] === null) {
      return '<div class="text-center text-slate-500 py-8">Empty Tree</div>';
    }

    // Helper function to get node display
    const getNodeDisplay = (index: number, value: string | number | null): string => {
      if (value === null) return '';
      
      let nodeClass = 'bg-white border-slate-300';
      let label = '';
      
      if (visitedNodes.has(index)) {
        nodeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        label = '<div class="text-xs text-emerald-600 text-center mb-1">visited</div>';
      } else if (index === currentIndex) {
        nodeClass = 'bg-blue-100 text-blue-800 border-blue-300';
        label = '<div class="text-xs text-blue-600 text-center mb-1">current</div>';
      } else if (queue.includes(value)) {
        nodeClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
        label = '<div class="text-xs text-yellow-600 text-center mb-1">in queue</div>';
      }
      
      return `<div class="inline-flex flex-col items-center">${label}<span class="inline-flex items-center px-4 py-3 rounded-xl border-2 ${nodeClass} font-mono font-semibold text-lg">${value}</span></div>`;
    };

    // Create hierarchical tree visualization for any depth
    const maxDepth = Math.floor(Math.log2(structure.length)) + 1;
    
    if (maxDepth <= 5) { // Handle trees up to 5 levels properly
      const nodes = [];
      
      for (let level = 0; level < maxDepth; level++) {
        const levelNodes = [];
        const startIndex = Math.pow(2, level) - 1;
        const endIndex = Math.min(Math.pow(2, level + 1) - 1, structure.length);
        
        // Calculate spacing based on level
        const baseSpacing = Math.pow(2, maxDepth - level - 1) * 4;
        const spacing = Math.max(baseSpacing, 4);
        
        for (let i = startIndex; i < endIndex && i < structure.length; i++) {
          if (structure[i] !== null) {
            levelNodes.push(getNodeDisplay(i, structure[i]));
          } else {
            levelNodes.push(`<div class="w-20"></div>`);
          }
        }
        
        // Only render level if it has at least one non-null node
        if (levelNodes.some(node => !node.includes('w-20'))) {
          const levelClass = level === 0 ? 'justify-center' : 'justify-center';
          const marginClass = level < maxDepth - 1 ? 'mb-6' : 'mb-2';
          nodes.push(`<div class="flex ${levelClass} space-x-${Math.min(spacing, 16)} ${marginClass}">${levelNodes.join('')}</div>`);
        }
      }
      
      return `<div class="tree-visualization py-4">${nodes.join('')}</div>`;
    }
    
    // For larger trees, show a simplified list view
    const nodesList = structure
      .map((val, idx) => val !== null ? getNodeDisplay(idx, val) : '')
      .filter(node => node !== '')
      .join(' ');
    
    return `<div class="flex flex-wrap justify-center gap-3 py-4">${nodesList}</div>`;
  };

  const buildTreeFromArray = (arr: (string | number | null)[]): TreeNode | null => {
    if (arr.length === 0 || arr[0] === null) return null;
    
    const root = new TreeNode(arr[0]);
    const queue: (TreeNode | null)[] = [root];
    let i = 1;
    
    while (queue.length > 0 && i < arr.length) {
      const node = queue.shift();
      if (node === null) continue;
      
      // Left child
      if (i < arr.length) {
        if (arr[i] !== null) {
          node.left = new TreeNode(arr[i]!);
          queue.push(node.left);
        } else {
          queue.push(null);
        }
        i++;
      }
      
      // Right child
      if (i < arr.length) {
        if (arr[i] !== null) {
          node.right = new TreeNode(arr[i]!);
          queue.push(node.right);
        } else {
          queue.push(null);
        }
        i++;
      }
    }
    
    return root;
  };

  const breadthFirstTraversal = (structure: (string | number | null)[]) => {
    const steps: AlgorithmStep[] = [];
    const root = buildTreeFromArray(structure);
    
    if (root === null) {
      steps.push({
        step: 1,
        description: "Empty tree - return empty array",
        details: "Tree is null, so we return an empty array",
        action: 'complete',
        result: [],
        treeVisualization: createTreeVisualization([]),
        currentLevel: 0
      });
      return { result: [], steps };
    }

    const values: (string | number)[] = [];
    const queue: TreeNode[] = [root];
    const visitedNodes = new Set<number>();
    let stepCount = 0;
    let currentLevel = 0;
    
    steps.push({
      step: ++stepCount,
      description: "Initialize queue with root node",
      details: "Start BFS by adding root to queue. Queue works FIFO (First In, First Out).",
      action: 'initialize',
      currentNode: root.val,
      queue: [root.val],
      result: [],
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes, [root.val], currentLevel),
      currentLevel: 0
    });

    while (queue.length > 0) {
      const levelSize = queue.length;
      
      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;
        const nodeIndex = values.length; // Approximate index for visualization
        
        steps.push({
          step: ++stepCount,
          description: `Dequeue node "${node.val}" from front of queue`,
          details: `Remove and process front node from queue. Current queue size: ${queue.length}`,
          action: 'dequeue',
          currentNode: node.val,
          queue: queue.map(n => n.val),
          result: [...values],
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), currentLevel),
          currentLevel: currentLevel
        });

        steps.push({
          step: ++stepCount,
          description: `Visit node "${node.val}"`,
          details: `Process current node and add its value to result array`,
          action: 'visit_node',
          currentNode: node.val,
          queue: queue.map(n => n.val),
          result: [...values],
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), currentLevel),
          currentLevel: currentLevel
        });

        values.push(node.val);
        visitedNodes.add(nodeIndex);

        steps.push({
          step: ++stepCount,
          description: `Add "${node.val}" to result`,
          details: `Value added to result array. Result so far: [${[...values].join(', ')}]`,
          action: 'add_to_result',
          currentNode: node.val,
          queue: queue.map(n => n.val),
          result: [...values],
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), currentLevel),
          currentLevel: currentLevel
        });

        // Add children to queue
        if (node.left !== null || node.right !== null) {
          const childrenToAdd = [];
          
          if (node.left !== null) {
            queue.push(node.left);
            childrenToAdd.push(`left child "${node.left.val}"`);
          }
          
          if (node.right !== null) {
            queue.push(node.right);
            childrenToAdd.push(`right child "${node.right.val}"`);
          }

          steps.push({
            step: ++stepCount,
            description: `Add children to queue: ${childrenToAdd.join(', ')}`,
            details: `Add left child first, then right child. This ensures level-by-level traversal (BFS order).`,
            action: 'add_children',
            currentNode: node.val,
            queue: queue.map(n => n.val),
            result: [...values],
            treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), currentLevel),
            currentLevel: currentLevel
          });
        }
      }
      
      currentLevel++;
    }

    steps.push({
      step: ++stepCount,
      description: "BFS traversal complete!",
      details: `Finished processing all nodes level by level. Final result: [${values.join(', ')}]`,
      action: 'complete',
      queue: [],
      result: values,
      treeVisualization: createTreeVisualization(structure, -1, visitedNodes, []),
      currentLevel: currentLevel
    });

    return { result: values, steps };
  };

  const parseStructure = (input: string): (string | number | null)[] => {
    if (!input.trim()) return [];
    return input.split(',').map(s => parseValue(s.trim()));
  };

  const runAlgorithm = () => {
    const structure = parseStructure(inputStructure);

    if (structure.length === 0) {
      alert('Please enter a valid tree structure (comma-separated values, use "null" for empty nodes)');
      return;
    }

    const startTime = performance.now();
    const { result: traversalResult, steps: algorithmSteps } = breadthFirstTraversal(structure);
    const endTime = performance.now();
    
    setResult(traversalResult);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testStructure: (string | number | null)[]) => {
    setInputStructure(testStructure.map(v => v === null ? 'null' : v.toString()).join(','));
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: traversalResult, steps: algorithmSteps } = breadthFirstTraversal(testStructure);
      const endTime = performance.now();
      
      setResult(traversalResult);
      setSteps(algorithmSteps);
      setCurrentStep(0);
      setExecutionTime(endTime - startTime);
      setShowVisualization(true);
    }, 100);
  };

  const resetPlayground = () => {
    setInputStructure("");
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setShowVisualization(false);
    setExecutionTime(0);
  };

  const testCases: [(string | number | null)[], (string | number)[]][] = [
    // Tree 1: a(b(d,e),c(null,f)) -> [a,b,c,d,e,null,f]
    [['a', 'b', 'c', 'd', 'e', null, 'f'], ['a', 'b', 'c', 'd', 'e', 'f']],
    
    // Tree 2: a(b(d,e(g,null)),c(null,f(null,h))) -> [a,b,c,d,e,null,f,null,null,g,null,null,null,null,h]
    [['a', 'b', 'c', 'd', 'e', null, 'f', null, null, 'g', null, null, null, null, 'h'], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']],
    
    // Tree 3: Just root 'a'
    [['a'], ['a']],
    
    // Tree 4: a(null,b(c(x,d(null,e)),null))
    [['a', null, 'b', null, null, 'c', null, null, null, null, null, 'x', 'd', null, null, null, null, null, null, null, null, null, null, null, null, 'e'], ['a', 'b', 'c', 'x', 'd', 'e']],
    
    // Tree 5: Perfect binary tree with numbers
    [[1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 7]],
    
    // Tree 6: Empty tree
    [[], []]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Breadth First Values</span>
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-layer-group text-cyan-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Breadth First Values</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that returns all values in a binary tree using breadth-first traversal (level-order). 
                This fundamental algorithm uses a queue to visit nodes level by level, making it perfect for exploring tree structure layer by layer.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <i className="fas fa-clock"></i>
                  <span>Time: O(n)</span>
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

            <div className="mb-6">
              <Label htmlFor="inputStructure" className="block text-sm font-medium text-slate-700 mb-2">
                Binary Tree Structure (level-order, use "null" for empty nodes)
              </Label>
              <Input
                id="inputStructure"
                type="text"
                value={inputStructure}
                onChange={(e) => setInputStructure(e.target.value)}
                className="font-mono"
                placeholder="e.g. a,b,c,d,e,null,f"
              />
              <div className="mt-2 text-xs text-slate-500">
                Enter nodes in level-order: root, then left-to-right for each level. Use "null" for missing nodes.
              </div>
            </div>

            {/* BFS vs DFS Comparison */}
            <div className="mb-6 bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-800 mb-3 flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                BFS vs DFS: Queue vs Stack
              </h4>
              <div className="text-sm text-cyan-700 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-cyan-100 rounded-lg p-3">
                    <div className="font-semibold mb-2">Breadth-First Search (BFS)</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Uses a <strong>Queue</strong> (FIFO)</li>
                      <li>Visits nodes <strong>level by level</strong></li>
                      <li>Goes <strong>wide</strong> before going deep</li>
                      <li>Perfect for finding shortest paths</li>
                    </ul>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-3">
                    <div className="font-semibold mb-2">Depth-First Search (DFS)</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Uses a <strong>Stack</strong> (LIFO)</li>
                      <li>Visits nodes <strong>branch by branch</strong></li>
                      <li>Goes <strong>deep</strong> before going wide</li>
                      <li>Perfect for exploring all paths</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Tree Preview */}
            {inputStructure && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Live Tree Preview</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: createTreeVisualization(parseStructure(inputStructure)) 
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-layer-group mr-2"></i>
                Traverse Tree (BFS)
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
                      BFS Traversal Complete!
                    </div>
                    <div className="text-sm opacity-75 text-emerald-700">
                      Result: [{result.join(', ')}]
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
                  <Badge variant="default">Queue-Based BFS</Badge>
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
                  step.action === 'visit_node' ? 'border-blue-400' : 'border-cyan-400'
                }`}>
                  <div className="font-medium text-slate-900 mb-2">{step.description}</div>
                  <div className="text-sm text-slate-600">{step.details}</div>
                  {step.currentLevel !== undefined && (
                    <div className="text-xs text-cyan-600 mt-1">
                      Current Level: {step.currentLevel}
                    </div>
                  )}
                </div>
              </div>

              {/* Tree Visualization */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Binary Tree Structure</h4>
                <div 
                  className="p-6 bg-slate-50 rounded-lg min-h-[12rem] flex flex-col justify-center"
                  dangerouslySetInnerHTML={{ __html: step.treeVisualization }}
                />
              </div>

              {/* Algorithm State */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Algorithm State</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                    <div className="text-xs text-cyan-600 font-medium">QUEUE</div>
                    <div className="font-mono text-sm text-cyan-800">
                      [{step.queue ? step.queue.join(', ') : ''}]
                    </div>
                    <div className="text-xs text-cyan-600 mt-1">FIFO: First In, First Out</div>
                  </div>
                  
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="text-xs text-emerald-600 font-medium">RESULT</div>
                    <div className="font-mono text-sm text-emerald-800">
                      [{step.result.join(', ')}]
                    </div>
                    <div className="text-xs text-emerald-600 mt-1">
                      {step.result.length} node{step.result.length !== 1 ? 's' : ''} visited
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

              <div className="grid gap-4">
                {testCases.map(([input, expected], caseIndex) => (
                  <div
                    key={caseIndex}
                    onClick={() => runTestCase(input)}
                    className="bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono">
                        {input.length === 0 ? 'empty tree' : input.map(v => v === null ? 'null' : v).join(',')}
                      </code>
                      <div className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                        BFS: [{expected.join(', ')}]
                      </div>
                    </div>
                    
                    {/* Visual Tree Representation */}
                    <div className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="text-xs text-slate-600 mb-2 text-center">Tree Structure</div>
                      <div 
                        className="scale-75 origin-top"
                        dangerouslySetInnerHTML={{ 
                          __html: createTreeVisualization(input, -1, new Set(), []) 
                        }}
                      />
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
                  {/* BFS Solution */}
                  <div>
                    <h4 className="font-semibold text-cyan-800 mb-3">✅ Breadth-First Search (Queue)</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">breadthFirstValues</span> = <span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-slate-400">[];</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">values</span> = <span className="text-slate-400">[];</span>{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">queue</span> = <span className="text-slate-400">[</span><span className="text-orange-300">root</span><span className="text-slate-400">];</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">queue</span><span className="text-slate-400">.</span><span className="text-yellow-300">length</span> &gt; <span className="text-green-400">0</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-blue-400">const</span> <span className="text-yellow-300">node</span> = <span className="text-yellow-300">queue</span><span className="text-slate-400">.</span><span className="text-yellow-300">shift</span><span className="text-slate-400">();</span>{'\n'}
                          {'    '}<span className="text-yellow-300">values</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span>{'\n'}
                          {'      '}<span className="text-yellow-300">queue</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span>{'\n'}
                          {'      '}<span className="text-yellow-300">queue</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">values</span><span className="text-slate-400">;</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <h4 className="font-semibold text-cyan-800 mb-2">BFS Characteristics</h4>
                      <div className="text-sm text-cyan-700 space-y-1">
                        <div><strong>Data Structure:</strong> Queue (FIFO)</div>
                        <div><strong>Pattern:</strong> Level-by-level traversal</div>
                        <div><strong>Order:</strong> Breadth before depth</div>
                        <div className="text-xs text-cyan-600 mt-2">Perfect for shortest path problems</div>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="font-semibold text-amber-800 mb-2">Complexity Analysis</h4>
                      <div className="text-sm text-amber-700 space-y-1">
                        <div><strong>Time:</strong> O(n) - Visit each node once</div>
                        <div><strong>Space:</strong> O(w) - Width of tree in queue</div>
                        <div className="text-xs text-amber-600 mt-2">Note: shift() is O(n), making total O(n²)</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>BFS explores nodes level by level using a queue</li>
                      <li>Add left child first, then right child for correct order</li>
                      <li>Queue ensures nodes are processed in order they were discovered</li>
                      <li>Level-order traversal: visits all nodes at depth d before depth d+1</li>
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