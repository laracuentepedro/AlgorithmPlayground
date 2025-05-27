import { useState } from "react";
import { ProblemsSidebar } from "@/components/ProblemsSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Binary Tree Node class
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val: number) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

export interface AlgorithmStep {
  step: number;
  description: string;
  details: string;
  action: 'initialize' | 'visit_node' | 'check_leaf' | 'compare_paths' | 'choose_path' | 'combine_result' | 'complete' | 'recursive_call' | 'base_case';
  currentNode?: number | null;
  currentPath: number[];
  currentSum: number;
  maxPathSum: number;
  treeVisualization: string;
  approach: 'recursive';
  recursionDepth?: number;
  leftPathSum?: number;
  rightPathSum?: number;
  isLeaf?: boolean;
  result?: number;
}

export function MaxPathSumPlayground() {
  const [inputStructure, setInputStructure] = useState("3,11,4,4,-2,null,1");
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);

  const parseValue = (val: string): number | null => {
    if (val.toLowerCase() === 'null') return null;
    const numVal = parseFloat(val);
    return isNaN(numVal) ? null : numVal;
  };

  const createTreeVisualization = (
    structure: (number | null)[], 
    currentIndex: number = -1,
    visitedNodes: Set<number> = new Set(),
    currentPath: number[] = [],
    maxPath: number[] = [],
    maxSum: number = -Infinity
  ): string => {
    if (structure.length === 0 || structure[0] === null) {
      return '<div class="text-center text-slate-500 py-8">Empty Tree</div>';
    }

    // Helper function to get node display
    const getNodeDisplay = (index: number, value: number | null): string => {
      if (value === null) return '';
      
      let nodeClass = 'bg-white border-slate-300';
      let label = '';
      
      if (maxPath.length > 0 && maxPath.includes(value) && maxSum !== -Infinity) {
        nodeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        label = '<div class="text-xs text-emerald-600 text-center mb-2 font-medium">🏆 max path</div>';
      } else if (currentPath.includes(value)) {
        nodeClass = 'bg-blue-100 text-blue-800 border-blue-300';
        label = '<div class="text-xs text-blue-600 text-center mb-2 font-medium">📍 current path</div>';
      } else if (index === currentIndex) {
        nodeClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
        label = '<div class="text-xs text-yellow-600 text-center mb-2 font-medium">→ current</div>';
      } else if (visitedNodes.has(index)) {
        nodeClass = 'bg-slate-100 text-slate-800 border-slate-300';
        label = '<div class="text-xs text-slate-600 text-center mb-2 font-medium">✓ visited</div>';
      }
      
      return `
        <div class="flex flex-col items-center min-w-[80px]">
          ${label}
          <div class="w-16 h-16 rounded-xl border-2 ${nodeClass} flex items-center justify-center font-mono font-bold text-lg shadow-sm">
            ${value}
          </div>
        </div>
      `;
    };

    // Create clean hierarchical tree visualization
    const maxDepth = Math.floor(Math.log2(structure.length)) + 1;
    
    if (maxDepth <= 4) { // Handle trees up to 4 levels with proper spacing
      const levels = [];
      
      for (let level = 0; level < maxDepth; level++) {
        const levelNodes = [];
        const startIndex = Math.pow(2, level) - 1;
        const endIndex = Math.min(Math.pow(2, level + 1) - 1, structure.length);
        
        let hasVisibleNodes = false;
        
        for (let i = startIndex; i < endIndex && i < structure.length; i++) {
          if (structure[i] !== null) {
            levelNodes.push(getNodeDisplay(i, structure[i]));
            hasVisibleNodes = true;
          } else {
            levelNodes.push(`<div class="w-20 h-20"></div>`); // Invisible spacer
          }
        }
        
        if (hasVisibleNodes) {
          const gapSize = Math.max(12 - level * 3, 2);
          levels.push(`
            <div class="flex justify-center items-end gap-${gapSize} mb-8">
              ${levelNodes.join('')}
            </div>
          `);
        }
      }
      
      return `
        <div class="tree-visualization py-6 overflow-x-auto">
          <div class="min-w-fit mx-auto">
            ${levels.join('')}
          </div>
        </div>
      `;
    }
    
    // For larger trees, show a clean grid layout
    const nodesList = structure
      .map((val, idx) => val !== null ? getNodeDisplay(idx, val) : '')
      .filter(node => node !== '')
      .slice(0, 15); // Limit to first 15 nodes for readability
    
    return `
      <div class="tree-visualization py-6">
        <div class="grid grid-cols-3 md:grid-cols-5 gap-4 justify-items-center max-w-4xl mx-auto">
          ${nodesList.join('')}
        </div>
        ${structure.filter(v => v !== null).length > 15 ? '<div class="text-center text-slate-500 text-sm mt-4">... showing first 15 nodes</div>' : ''}
      </div>
    `;
  };

  const buildTreeFromArray = (arr: (number | null)[]): TreeNode | null => {
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

  const maxPathSumRecursive = (structure: (number | null)[]) => {
    const steps: AlgorithmStep[] = [];
    const root = buildTreeFromArray(structure);
    
    if (root === null) {
      steps.push({
        step: 1,
        description: "Empty tree - return -Infinity",
        details: "Tree is null, so we return -Infinity",
        action: 'complete',
        currentPath: [],
        currentSum: -Infinity,
        maxPathSum: -Infinity,
        treeVisualization: createTreeVisualization([]),
        approach: 'recursive',
        result: -Infinity
      });
      return { result: -Infinity, steps };
    }

    const visitedNodes = new Set<number>();
    let stepCount = 0;
    let globalMaxSum = -Infinity;
    let maxPath: number[] = [];
    
    steps.push({
      step: ++stepCount,
      description: "Starting recursive max path sum search",
      details: `Finding maximum root-to-leaf path sum using DFS recursion`,
      action: 'initialize',
      currentPath: [],
      currentSum: 0,
      maxPathSum: -Infinity,
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes),
      approach: 'recursive',
      recursionDepth: 0
    });

    const findMaxPathRecursive = (node: TreeNode | null, nodeIndex: number, depth: number, currentPath: number[]): number => {
      if (node === null) {
        steps.push({
          step: ++stepCount,
          description: `Base case: null node`,
          details: `Recursion depth ${depth}: Reached null node, return -Infinity`,
          action: 'base_case',
          currentPath: [...currentPath],
          currentSum: -Infinity,
          maxPathSum: globalMaxSum,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, currentPath, maxPath, globalMaxSum),
          approach: 'recursive',
          recursionDepth: depth,
          result: -Infinity
        });
        return -Infinity;
      }

      const newPath = [...currentPath, node.val];
      
      steps.push({
        step: ++stepCount,
        description: `Recursive call for node ${node.val}`,
        details: `Recursion depth ${depth}: Processing node with value ${node.val}`,
        action: 'recursive_call',
        currentNode: node.val,
        currentPath: newPath,
        currentSum: newPath.reduce((sum, val) => sum + val, 0),
        maxPathSum: globalMaxSum,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, newPath, maxPath, globalMaxSum),
        approach: 'recursive',
        recursionDepth: depth
      });

      // Check if this is a leaf node
      const isLeaf = node.left === null && node.right === null;
      
      if (isLeaf) {
        const pathSum = newPath.reduce((sum, val) => sum + val, 0);
        
        steps.push({
          step: ++stepCount,
          description: `Leaf node ${node.val} found`,
          details: `Recursion depth ${depth}: This is a leaf, path sum = ${pathSum}`,
          action: 'check_leaf',
          currentNode: node.val,
          currentPath: newPath,
          currentSum: pathSum,
          maxPathSum: globalMaxSum,
          isLeaf: true,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, newPath, maxPath, globalMaxSum),
          approach: 'recursive',
          recursionDepth: depth
        });

        if (pathSum > globalMaxSum) {
          globalMaxSum = pathSum;
          maxPath = [...newPath];
        }
        
        visitedNodes.add(nodeIndex);
        return node.val;
      }

      steps.push({
        step: ++stepCount,
        description: `Visit internal node ${node.val}`,
        details: `Recursion depth ${depth}: Exploring children to find optimal path`,
        action: 'visit_node',
        currentNode: node.val,
        currentPath: newPath,
        currentSum: newPath.reduce((sum, val) => sum + val, 0),
        maxPathSum: globalMaxSum,
        isLeaf: false,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, newPath, maxPath, globalMaxSum),
        approach: 'recursive',
        recursionDepth: depth
      });

      // Get left and right subtree max paths
      const leftMaxPath = findMaxPathRecursive(node.left, nodeIndex * 2 + 1, depth + 1, newPath);
      const rightMaxPath = findMaxPathRecursive(node.right, nodeIndex * 2 + 2, depth + 1, newPath);

      // Choose the better path
      const maxChildPath = Math.max(leftMaxPath, rightMaxPath);
      const result = node.val + maxChildPath;
      
      visitedNodes.add(nodeIndex);
      
      steps.push({
        step: ++stepCount,
        description: `Compare paths from node ${node.val}`,
        details: `Recursion depth ${depth}: left=${leftMaxPath === -Infinity ? '-∞' : leftMaxPath}, right=${rightMaxPath === -Infinity ? '-∞' : rightMaxPath}`,
        action: 'compare_paths',
        currentNode: node.val,
        currentPath: newPath,
        currentSum: result,
        maxPathSum: globalMaxSum,
        leftPathSum: leftMaxPath === -Infinity ? undefined : leftMaxPath,
        rightPathSum: rightMaxPath === -Infinity ? undefined : rightMaxPath,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, newPath, maxPath, globalMaxSum),
        approach: 'recursive',
        recursionDepth: depth
      });

      steps.push({
        step: ++stepCount,
        description: `Choose optimal path: ${node.val} + ${maxChildPath} = ${result}`,
        details: `Recursion depth ${depth}: Combine current node with best child path`,
        action: 'combine_result',
        currentNode: node.val,
        currentPath: newPath,
        currentSum: result,
        maxPathSum: globalMaxSum,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, newPath, maxPath, globalMaxSum),
        approach: 'recursive',
        recursionDepth: depth
      });

      return result;
    };

    const finalResult = findMaxPathRecursive(root, 0, 0, []);

    steps.push({
      step: ++stepCount,
      description: "Recursive max path sum search complete!",
      details: `All recursive calls finished. Maximum path sum: ${globalMaxSum}`,
      action: 'complete',
      currentPath: maxPath,
      currentSum: globalMaxSum,
      maxPathSum: globalMaxSum,
      treeVisualization: createTreeVisualization(structure, -1, visitedNodes, [], maxPath, globalMaxSum),
      approach: 'recursive',
      result: globalMaxSum
    });

    return { result: globalMaxSum, steps };
  };

  const parseStructure = (input: string): (number | null)[] => {
    if (!input.trim()) return [];
    return input.split(',').map(s => parseValue(s.trim()));
  };

  const runAlgorithm = () => {
    const structure = parseStructure(inputStructure);

    if (structure.length === 0) {
      alert('Please enter a valid tree structure (comma-separated numbers, use "null" for empty nodes)');
      return;
    }

    const startTime = performance.now();
    const { result: pathSumResult, steps: algorithmSteps } = maxPathSumRecursive(structure);
    const endTime = performance.now();
    
    setResult(pathSumResult);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testStructure: (number | null)[]) => {
    setInputStructure(testStructure.map(v => v === null ? 'null' : v.toString()).join(','));
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: pathSumResult, steps: algorithmSteps } = maxPathSumRecursive(testStructure);
      const endTime = performance.now();
      
      setResult(pathSumResult);
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

  const testCases: [(number | null)[], number][] = [
    // Tree 1: Mixed values - path 3->11->4 = 18
    [[3, 11, 4, 4, -2, null, 1], 18],
    
    // Tree 2: Larger tree - path 5->11->15->3 = 34
    [[5, 11, 54, 20, 15, null, null, null, null, 1, 3], 59],
    
    // Tree 3: All negative - path -1->-6->0 = -7
    [[-1, -6, -5, -3, 0, null, -13, null, null, -1, null, null, null, null, -2], -8],
    
    // Tree 4: Single node
    [[42], 42],
    
    // Tree 5: Simple tree
    [[10, 5, 15], 25],
    
    // Tree 6: Negative root with positive children
    [[-5, 10, 20], 15]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Max Path Sum</span>
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-route text-indigo-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Max Root to Leaf Path Sum</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that finds the maximum sum of any root-to-leaf path in a binary tree containing number values. 
                This problem demonstrates advanced path optimization techniques and showcases how recursive thinking can solve complex tree traversal problems.
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

            <div className="mb-6">
              <Label htmlFor="inputStructure" className="block text-sm font-medium text-slate-700 mb-2">
                Binary Tree Structure (level-order, numbers only)
              </Label>
              <Input
                id="inputStructure"
                type="text"
                value={inputStructure}
                onChange={(e) => setInputStructure(e.target.value)}
                className="font-mono"
                placeholder="e.g. 3,11,4,4,-2,null,1"
              />
              <div className="mt-2 text-xs text-slate-500">
                Enter numbers in level-order. Use "null" for missing nodes. Negative numbers are allowed.
              </div>
            </div>

            {/* Path Optimization Explainer */}
            <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                Root-to-Leaf Path Optimization
              </h4>
              <div className="text-sm text-indigo-700 space-y-2">
                <div className="bg-white rounded-lg p-3">
                  <div className="font-semibold mb-2">Key Concepts</div>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>Root-to-Leaf Path:</strong> A path that starts at the root and ends at any leaf node</li>
                    <li><strong>Path Sum:</strong> The sum of all node values along a specific path</li>
                    <li><strong>Optimization Goal:</strong> Find the path with the maximum possible sum</li>
                    <li><strong>Recursive Strategy:</strong> For each node, choose the child that leads to the maximum path sum</li>
                  </ul>
                </div>
                <div className="text-xs text-indigo-600 mt-2 bg-indigo-100 rounded p-2">
                  💡 The algorithm uses the recursive pattern: <code>current_value + max(left_path, right_path)</code>
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
                <i className="fas fa-route mr-2"></i>
                Find Max Path Sum
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
                    <i className="fas fa-trophy"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-800">
                      Maximum Path Sum Found!
                    </div>
                    <div className="text-sm opacity-75 text-emerald-700">
                      Max Sum: {result}
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
                  <Badge variant="secondary">Recursive DFS</Badge>
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
                  step.action === 'check_leaf' ? 'border-green-400' : 
                  step.action === 'compare_paths' ? 'border-purple-400' : 'border-blue-400'
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
                <h4 className="text-sm font-medium text-slate-700 mb-3">Path Analysis</h4>
                <div className={`grid grid-cols-1 ${step.leftPathSum !== undefined ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-xs text-blue-600 font-medium">CURRENT PATH</div>
                    <div className="font-mono text-sm text-blue-800">
                      [{step.currentPath.join(' → ')}]
                    </div>
                    <div className="text-xs text-blue-600 mt-1">Root to current node</div>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-xs text-orange-600 font-medium">CURRENT SUM</div>
                    <div className="font-mono text-lg text-orange-800">{step.currentSum}</div>
                    <div className="text-xs text-orange-600 mt-1">Path sum so far</div>
                  </div>
                  
                  {step.leftPathSum !== undefined && (
                    <>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="text-xs text-purple-600 font-medium">LEFT PATH</div>
                        <div className="font-mono text-lg text-purple-800">{step.leftPathSum}</div>
                        <div className="text-xs text-purple-600 mt-1">Left subtree max</div>
                      </div>
                      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                        <div className="text-xs text-pink-600 font-medium">RIGHT PATH</div>
                        <div className="font-mono text-lg text-pink-800">{step.rightPathSum}</div>
                        <div className="text-xs text-pink-600 mt-1">Right subtree max</div>
                      </div>
                    </>
                  )}
                  
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="text-xs text-emerald-600 font-medium">GLOBAL MAX</div>
                    <div className="font-mono text-lg text-emerald-800">
                      {step.maxPathSum === -Infinity ? '-∞' : step.maxPathSum}
                    </div>
                    <div className="text-xs text-emerald-600 mt-1">Best path found</div>
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

              <div className="space-y-4">
                {testCases.map(([input, expected], caseIndex) => (
                  <div
                    key={caseIndex}
                    onClick={() => runTestCase(input)}
                    className="bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200 p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono break-all">
                        {input.length === 0 ? 'empty tree' : input.map(v => v === null ? 'null' : v).join(',')}
                      </code>
                      <div className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 self-start sm:self-auto">
                        Max: {expected}
                      </div>
                    </div>
                    
                    {/* Visual Tree Representation */}
                    <div className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="text-xs text-slate-600 mb-2 text-center">Tree Structure</div>
                      <div 
                        className="scale-75 origin-top overflow-x-auto"
                        dangerouslySetInnerHTML={{ 
                          __html: createTreeVisualization(input, -1, new Set(), [], [], -Infinity) 
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
                  {/* Recursive Solution */}
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3">✅ Recursive Approach</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">maxPathSum</span> = <span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">-Infinity</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span> === <span className="text-blue-400">null</span> && <span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> {`{`}{'\n'}
                          {'    '}<span className="text-purple-400">return</span> <span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> + <span className="text-yellow-300">Math</span><span className="text-slate-400">.</span><span className="text-yellow-300">max</span><span className="text-slate-400">(</span>{'\n'}
                          {'    '}<span className="text-yellow-300">maxPathSum</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span><span className="text-slate-400">),</span>{'\n'}
                          {'    '}<span className="text-yellow-300">maxPathSum</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span><span className="text-slate-400">)</span>{'\n'}
                          {'  '}<span className="text-slate-400">);</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Recursive Strategy</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <div><strong>Base Cases:</strong> null node (-Infinity) and leaf node (node value)</div>
                        <div><strong>Recursive Case:</strong> current + max(left path, right path)</div>
                        <div><strong>Optimization:</strong> Choose the child that leads to maximum sum</div>
                        <div className="text-xs text-green-600 mt-2">Elegant solution using recursive thinking</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Every node must choose between left and right subtree paths</li>
                      <li>Leaf nodes form the base case with just their own value</li>
                      <li>The algorithm guarantees a complete root-to-leaf path</li>
                      <li>This pattern extends to many tree optimization problems</li>
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