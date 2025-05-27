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
  action: 'initialize' | 'visit_node' | 'check_match' | 'found_target' | 'add_children' | 'dequeue' | 'not_found' | 'complete' | 'recursive_call' | 'base_case';
  currentNode?: string | number | null;
  target: string | number;
  found: boolean;
  treeVisualization: string;
  approach: 'recursive' | 'iterative';
  recursionDepth?: number;
  queue?: (string | number)[];
  result?: boolean;
}

export function TreeIncludesPlayground() {
  const [inputStructure, setInputStructure] = useState("a,b,c,d,e,null,f");
  const [targetValue, setTargetValue] = useState("e");
  const [result, setResult] = useState<boolean | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState<'recursive' | 'iterative'>('recursive');

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
    target: string | number = "",
    found: boolean = false
  ): string => {
    if (structure.length === 0 || structure[0] === null) {
      return '<div class="text-center text-slate-500 py-8">Empty Tree</div>';
    }

    // Helper function to get node display
    const getNodeDisplay = (index: number, value: string | number | null): string => {
      if (value === null) return '';
      
      let nodeClass = 'bg-white border-slate-300';
      let label = '';
      
      if (found && value === target) {
        nodeClass = 'bg-green-100 text-green-800 border-green-300';
        label = '<div class="text-xs text-green-600 text-center mb-2 font-medium">🎯 found!</div>';
      } else if (visitedNodes.has(index)) {
        nodeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        label = '<div class="text-xs text-emerald-600 text-center mb-2 font-medium">✓ visited</div>';
      } else if (index === currentIndex) {
        nodeClass = 'bg-blue-100 text-blue-800 border-blue-300';
        label = '<div class="text-xs text-blue-600 text-center mb-2 font-medium">→ current</div>';
      } else if (queue.includes(value)) {
        nodeClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
        label = '<div class="text-xs text-yellow-600 text-center mb-2 font-medium">⏳ in queue</div>';
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

  const treeIncludesRecursive = (structure: (string | number | null)[], target: string | number) => {
    const steps: AlgorithmStep[] = [];
    const root = buildTreeFromArray(structure);
    
    if (root === null) {
      steps.push({
        step: 1,
        description: "Empty tree - target not found",
        details: "Tree is null, so target cannot exist",
        action: 'complete',
        target: target,
        found: false,
        treeVisualization: createTreeVisualization([]),
        approach: 'recursive',
        result: false
      });
      return { result: false, steps };
    }

    const visitedNodes = new Set<number>();
    let stepCount = 0;
    let targetFound = false;
    
    steps.push({
      step: ++stepCount,
      description: "Starting recursive search for target",
      details: `Looking for "${target}" in the binary tree using DFS`,
      action: 'initialize',
      target: target,
      found: false,
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes, [], target),
      approach: 'recursive',
      recursionDepth: 0
    });

    const searchRecursive = (node: TreeNode | null, nodeIndex: number, depth: number): boolean => {
      if (node === null) {
        steps.push({
          step: ++stepCount,
          description: `Base case: null node`,
          details: `Recursion depth ${depth}: Reached null node, return false`,
          action: 'base_case',
          target: target,
          found: false,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], target),
          approach: 'recursive',
          recursionDepth: depth,
          result: false
        });
        return false;
      }

      steps.push({
        step: ++stepCount,
        description: `Recursive call for node "${node.val}"`,
        details: `Recursion depth ${depth}: Visiting node with value "${node.val}"`,
        action: 'recursive_call',
        currentNode: node.val,
        target: target,
        found: false,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], target),
        approach: 'recursive',
        recursionDepth: depth
      });

      steps.push({
        step: ++stepCount,
        description: `Check if "${node.val}" equals target "${target}"`,
        details: `Recursion depth ${depth}: Comparing current node value with target`,
        action: 'check_match',
        currentNode: node.val,
        target: target,
        found: node.val === target,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], target, node.val === target),
        approach: 'recursive',
        recursionDepth: depth
      });

      if (node.val === target) {
        targetFound = true;
        visitedNodes.add(nodeIndex);
        steps.push({
          step: ++stepCount,
          description: `🎯 Target found!`,
          details: `Recursion depth ${depth}: Found "${target}" at current node`,
          action: 'found_target',
          currentNode: node.val,
          target: target,
          found: true,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], target, true),
          approach: 'recursive',
          recursionDepth: depth,
          result: true
        });
        return true;
      }

      visitedNodes.add(nodeIndex);

      // Search left subtree
      const leftResult = searchRecursive(node.left, nodeIndex * 2 + 1, depth + 1);
      if (leftResult) return true;

      // Search right subtree  
      const rightResult = searchRecursive(node.right, nodeIndex * 2 + 2, depth + 1);
      
      return rightResult;
    };

    const finalResult = searchRecursive(root, 0, 0);

    if (!targetFound) {
      steps.push({
        step: ++stepCount,
        description: "Search complete - target not found",
        details: `Searched entire tree, "${target}" does not exist`,
        action: 'complete',
        target: target,
        found: false,
        treeVisualization: createTreeVisualization(structure, -1, visitedNodes, [], target),
        approach: 'recursive',
        result: false
      });
    }

    return { result: finalResult, steps };
  };

  const treeIncludesIterative = (structure: (string | number | null)[], target: string | number) => {
    const steps: AlgorithmStep[] = [];
    const root = buildTreeFromArray(structure);
    
    if (root === null) {
      steps.push({
        step: 1,
        description: "Empty tree - target not found",
        details: "Tree is null, so target cannot exist",
        action: 'complete',
        target: target,
        found: false,
        treeVisualization: createTreeVisualization([]),
        approach: 'iterative',
        result: false
      });
      return { result: false, steps };
    }

    const queue: TreeNode[] = [root];
    const visitedNodes = new Set<number>();
    let stepCount = 0;
    
    steps.push({
      step: ++stepCount,
      description: "Initialize queue with root node",
      details: "Start BFS traversal to search for target using a queue",
      action: 'initialize',
      currentNode: root.val,
      target: target,
      found: false,
      queue: [root.val],
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes, [root.val], target),
      approach: 'iterative'
    });

    let nodeIndex = 0;
    while (queue.length > 0) {
      const node = queue.shift()!;
      
      steps.push({
        step: ++stepCount,
        description: `Dequeue node "${node.val}"`,
        details: `Remove node "${node.val}" from front of queue`,
        action: 'dequeue',
        currentNode: node.val,
        target: target,
        found: false,
        queue: queue.map(n => n.val),
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), target),
        approach: 'iterative'
      });

      steps.push({
        step: ++stepCount,
        description: `Check if "${node.val}" equals target "${target}"`,
        details: `Compare current node value with target`,
        action: 'check_match',
        currentNode: node.val,
        target: target,
        found: node.val === target,
        queue: queue.map(n => n.val),
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), target, node.val === target),
        approach: 'iterative'
      });

      if (node.val === target) {
        visitedNodes.add(nodeIndex);
        steps.push({
          step: ++stepCount,
          description: `🎯 Target found!`,
          details: `Found "${target}" at current node`,
          action: 'found_target',
          currentNode: node.val,
          target: target,
          found: true,
          queue: queue.map(n => n.val),
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), target, true),
          approach: 'iterative',
          result: true
        });
        return { result: true, steps };
      }

      visitedNodes.add(nodeIndex);

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
          description: `Enqueue children: ${childrenToAdd.join(', ')}`,
          details: `Add children to queue for processing`,
          action: 'add_children',
          currentNode: node.val,
          target: target,
          found: false,
          queue: queue.map(n => n.val),
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), target),
          approach: 'iterative'
        });
      }
      
      nodeIndex++;
    }

    steps.push({
      step: ++stepCount,
      description: "Search complete - target not found",
      details: `Processed all nodes, "${target}" does not exist in tree`,
      action: 'complete',
      target: target,
      found: false,
      queue: [],
      treeVisualization: createTreeVisualization(structure, -1, visitedNodes, [], target),
      approach: 'iterative',
      result: false
    });

    return { result: false, steps };
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

    if (!targetValue.trim()) {
      alert('Please enter a target value to search for');
      return;
    }

    const target = parseValue(targetValue);
    if (target === null) {
      alert('Target value cannot be null');
      return;
    }

    const startTime = performance.now();
    const { result: searchResult, steps: algorithmSteps } = selectedApproach === 'recursive' 
      ? treeIncludesRecursive(structure, target)
      : treeIncludesIterative(structure, target);
    const endTime = performance.now();
    
    setResult(searchResult);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testStructure: (string | number | null)[], testTarget: string | number) => {
    setInputStructure(testStructure.map(v => v === null ? 'null' : v.toString()).join(','));
    setTargetValue(testTarget.toString());
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: searchResult, steps: algorithmSteps } = selectedApproach === 'recursive' 
        ? treeIncludesRecursive(testStructure, testTarget)
        : treeIncludesIterative(testStructure, testTarget);
      const endTime = performance.now();
      
      setResult(searchResult);
      setSteps(algorithmSteps);
      setCurrentStep(0);
      setExecutionTime(endTime - startTime);
      setShowVisualization(true);
    }, 100);
  };

  const resetPlayground = () => {
    setInputStructure("");
    setTargetValue("");
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setShowVisualization(false);
    setExecutionTime(0);
  };

  const testCases: [(string | number | null)[], string | number, boolean][] = [
    // Tree 1: Basic search cases
    [["a", "b", "c", "d", "e", null, "f"], "e", true],
    [["a", "b", "c", "d", "e", null, "f"], "a", true],
    [["a", "b", "c", "d", "e", null, "f"], "n", false],
    
    // Tree 2: Deeper tree
    [["a", "b", "c", "d", "e", null, "f", null, null, "g", null, null, null, null, "h"], "f", true],
    [["a", "b", "c", "d", "e", null, "f", null, null, "g", null, null, null, null, "h"], "p", false],
    
    // Tree 3: Single node
    [["root"], "root", true],
    [["root"], "missing", false],
    
    // Tree 4: Empty tree
    [[], "anything", false]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Tree Includes</span>
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
              <i className="fas fa-search text-purple-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Tree Includes</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that searches for a target value in a binary tree. 
                This problem showcases fundamental tree search algorithms and demonstrates how both BFS and DFS can solve the same search problem with different approaches.
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

            {/* Algorithm Approach Selection */}
            <div className="mb-6">
              <Label className="block text-sm font-medium text-slate-700 mb-3">
                Search Algorithm Approach
              </Label>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setSelectedApproach('recursive')}
                  variant={selectedApproach === 'recursive' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-recycle"></i>
                  <span>Recursive (DFS)</span>
                </Button>
                <Button
                  onClick={() => setSelectedApproach('iterative')}
                  variant={selectedApproach === 'iterative' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-layer-group"></i>
                  <span>Iterative (BFS)</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="inputStructure" className="block text-sm font-medium text-slate-700 mb-2">
                  Binary Tree Structure (level-order)
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
                  Enter values in level-order. Use "null" for missing nodes.
                </div>
              </div>

              <div>
                <Label htmlFor="targetValue" className="block text-sm font-medium text-slate-700 mb-2">
                  Target Value to Search
                </Label>
                <Input
                  id="targetValue"
                  type="text"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. e"
                />
                <div className="mt-2 text-xs text-slate-500">
                  Enter the value you want to find in the tree.
                </div>
              </div>
            </div>

            {/* Tree Search Algorithm Explainer */}
            <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                Tree Search Strategies
              </h4>
              <div className="text-sm text-purple-700 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-100 rounded-lg p-3">
                    <div className="font-semibold mb-2">Recursive DFS</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Uses <strong>call stack</strong> for traversal</li>
                      <li>Naturally <strong>goes deep</strong> first</li>
                      <li>Early termination on match</li>
                      <li>Clean, intuitive code</li>
                    </ul>
                  </div>
                  <div className="bg-cyan-100 rounded-lg p-3">
                    <div className="font-semibold mb-2">Iterative BFS</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Uses <strong>queue</strong> for traversal</li>
                      <li>Explores <strong>level by level</strong></li>
                      <li>Finds closest matches first</li>
                      <li>Explicit queue management</li>
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
                      __html: createTreeVisualization(parseStructure(inputStructure), -1, new Set(), [], targetValue) 
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
                <i className="fas fa-search mr-2"></i>
                Search Tree
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
                      {result ? 'Target Found!' : 'Target Not Found'}
                    </div>
                    <div className={`text-sm opacity-75 ${result ? 'text-emerald-700' : 'text-red-700'}`}>
                      Search result: {result.toString()}
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
                  <Badge variant={selectedApproach === 'recursive' ? 'secondary' : 'default'}>
                    {selectedApproach === 'recursive' ? 'Recursive DFS' : 'Iterative BFS'}
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
                  step.action === 'complete' && step.result ? 'border-emerald-400' :
                  step.action === 'complete' && !step.result ? 'border-red-400' :
                  step.action === 'check_match' && step.found ? 'border-green-400' : 'border-blue-400'
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
                <h4 className="text-sm font-medium text-slate-700 mb-3">Search State</h4>
                <div className={`grid grid-cols-1 ${selectedApproach === 'iterative' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-xs text-purple-600 font-medium">TARGET</div>
                    <div className="font-mono text-lg text-purple-800">"{step.target}"</div>
                    <div className="text-xs text-purple-600 mt-1">Looking for this value</div>
                  </div>
                  
                  {selectedApproach === 'iterative' && (
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <div className="text-xs text-cyan-600 font-medium">QUEUE</div>
                      <div className="font-mono text-sm text-cyan-800">
                        [{step.queue ? step.queue.map(v => `"${v}"`).join(', ') : ''}]
                      </div>
                      <div className="text-xs text-cyan-600 mt-1">Nodes to process</div>
                    </div>
                  )}
                  
                  <div className={`border rounded-lg p-4 ${step.found ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    <div className={`text-xs font-medium ${step.found ? 'text-emerald-600' : 'text-red-600'}`}>SEARCH STATUS</div>
                    <div className={`font-mono text-lg ${step.found ? 'text-emerald-800' : 'text-red-800'}`}>
                      {step.found ? '✓ FOUND' : '✗ NOT FOUND'}
                    </div>
                    {step.currentNode !== undefined && (
                      <div className={`text-xs mt-1 ${step.found ? 'text-emerald-600' : 'text-red-600'}`}>
                        Current: "{step.currentNode}"
                      </div>
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

              <div className="space-y-4">
                {testCases.map(([input, target, expected], caseIndex) => (
                  <div
                    key={caseIndex}
                    onClick={() => runTestCase(input, target)}
                    className="bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200 p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <div className="flex flex-col gap-2">
                        <code className="text-sm bg-white px-3 py-1 rounded border font-mono break-all">
                          Tree: {input.length === 0 ? 'empty' : input.map(v => v === null ? 'null' : v).join(',')}
                        </code>
                        <code className="text-sm bg-white px-3 py-1 rounded border font-mono">
                          Target: "{target}"
                        </code>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium self-start sm:self-auto ${
                        expected ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {expected ? '✓ Found' : '✗ Not Found'}
                      </div>
                    </div>
                    
                    {/* Visual Tree Representation */}
                    {input.length > 0 && (
                      <div className="bg-white rounded-lg border border-slate-200 p-3">
                        <div className="text-xs text-slate-600 mb-2 text-center">Tree Structure</div>
                        <div 
                          className="scale-75 origin-top overflow-x-auto"
                          dangerouslySetInnerHTML={{ 
                            __html: createTreeVisualization(input, -1, new Set(), [], target) 
                          }}
                        />
                      </div>
                    )}
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
                    <h4 className="font-semibold text-green-800 mb-3">✅ Recursive Approach (DFS)</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">treeIncludes</span> = <span className="text-slate-400">(</span><span className="text-orange-300">root</span>, <span className="text-orange-300">target</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">false</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> === <span className="text-orange-300">target</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">true</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">treeIncludes</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span>, <span className="text-orange-300">target</span><span className="text-slate-400">) ||</span>{'\n'}
                          {'         '}<span className="text-yellow-300">treeIncludes</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span>, <span className="text-orange-300">target</span><span className="text-slate-400">);</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Iterative Solution */}
                  <div>
                    <h4 className="font-semibold text-cyan-800 mb-3">🔄 Iterative Approach (BFS)</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">treeIncludes</span> = <span className="text-slate-400">(</span><span className="text-orange-300">root</span>, <span className="text-orange-300">target</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">false</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">queue</span> = <span className="text-slate-400">[</span><span className="text-orange-300">root</span><span className="text-slate-400">];</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">queue</span><span className="text-slate-400">.</span><span className="text-yellow-300">length</span> &gt; <span className="text-green-400">0</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-blue-400">const</span> <span className="text-yellow-300">node</span> = <span className="text-yellow-300">queue</span><span className="text-slate-400">.</span><span className="text-yellow-300">shift</span><span className="text-slate-400">();</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> === <span className="text-orange-300">target</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">true</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-yellow-300">queue</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-yellow-300">queue</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-blue-400">false</span><span className="text-slate-400">;</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Recursive DFS</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <div><strong>Pattern:</strong> Check current, then search subtrees</div>
                        <div><strong>Base cases:</strong> null node or target found</div>
                        <div><strong>Early exit:</strong> Stops when target found</div>
                        <div className="text-xs text-green-600 mt-2">Goes deep before exploring siblings</div>
                      </div>
                    </div>
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <h4 className="font-semibold text-cyan-800 mb-2">Iterative BFS</h4>
                      <div className="text-sm text-cyan-700 space-y-1">
                        <div><strong>Pattern:</strong> Process level by level</div>
                        <div><strong>Queue:</strong> FIFO for breadth-first order</div>
                        <div><strong>Early exit:</strong> Returns immediately on match</div>
                        <div className="text-xs text-cyan-600 mt-2">Finds closest matches first</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Both approaches have O(n) time complexity in worst case</li>
                      <li>DFS uses implicit call stack, BFS uses explicit queue</li>
                      <li>Both can exit early when target is found</li>
                      <li>Tree search is fundamental to many advanced algorithms</li>
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