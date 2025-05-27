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
  action: 'initialize' | 'visit_node' | 'compare' | 'update_min' | 'add_children' | 'dequeue' | 'pop_stack' | 'complete' | 'recursive_call' | 'base_case' | 'combine_results';
  currentNode?: number | null;
  currentMin: number;
  nodeValue?: number;
  treeVisualization: string;
  approach: 'recursive' | 'iterative_dfs' | 'iterative_bfs';
  recursionDepth?: number;
  queue?: number[];
  stack?: number[];
  leftMin?: number;
  rightMin?: number;
  result?: number;
}

export function TreeMinValuePlayground() {
  const [inputStructure, setInputStructure] = useState("3,11,4,4,-2,null,1");
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState<'recursive' | 'iterative_dfs' | 'iterative_bfs'>('recursive');

  const parseValue = (val: string): number | null => {
    if (val.toLowerCase() === 'null') return null;
    const numVal = parseFloat(val);
    return isNaN(numVal) ? null : numVal;
  };

  const createTreeVisualization = (
    structure: (number | null)[], 
    currentIndex: number = -1,
    visitedNodes: Set<number> = new Set(),
    queue: number[] = [],
    stack: number[] = [],
    currentMin: number = Infinity,
    minNode?: number
  ): string => {
    if (structure.length === 0 || structure[0] === null) {
      return '<div class="text-center text-slate-500 py-8">Empty Tree</div>';
    }

    // Helper function to get node display
    const getNodeDisplay = (index: number, value: number | null): string => {
      if (value === null) return '';
      
      let nodeClass = 'bg-white border-slate-300';
      let label = '';
      
      if (minNode !== undefined && value === minNode && currentMin !== Infinity) {
        nodeClass = 'bg-green-100 text-green-800 border-green-300';
        label = '<div class="text-xs text-green-600 text-center mb-2 font-medium">🏆 current min</div>';
      } else if (visitedNodes.has(index)) {
        nodeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        label = '<div class="text-xs text-emerald-600 text-center mb-2 font-medium">✓ visited</div>';
      } else if (index === currentIndex) {
        nodeClass = 'bg-blue-100 text-blue-800 border-blue-300';
        label = '<div class="text-xs text-blue-600 text-center mb-2 font-medium">→ current</div>';
      } else if (queue.includes(value)) {
        nodeClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
        label = '<div class="text-xs text-yellow-600 text-center mb-2 font-medium">⏳ in queue</div>';
      } else if (stack.includes(value)) {
        nodeClass = 'bg-purple-100 text-purple-800 border-purple-300';
        label = '<div class="text-xs text-purple-600 text-center mb-2 font-medium">📚 in stack</div>';
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

  const treeMinValueRecursive = (structure: (number | null)[]) => {
    const steps: AlgorithmStep[] = [];
    const root = buildTreeFromArray(structure);
    
    if (root === null) {
      steps.push({
        step: 1,
        description: "Empty tree - return Infinity",
        details: "Tree is null, so we return Infinity",
        action: 'complete',
        currentMin: Infinity,
        treeVisualization: createTreeVisualization([]),
        approach: 'recursive',
        result: Infinity
      });
      return { result: Infinity, steps };
    }

    const visitedNodes = new Set<number>();
    let stepCount = 0;
    let globalMin = Infinity;
    
    steps.push({
      step: ++stepCount,
      description: "Starting recursive minimum search",
      details: `Finding minimum value in tree using DFS recursion`,
      action: 'initialize',
      currentMin: Infinity,
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes, [], [], Infinity),
      approach: 'recursive',
      recursionDepth: 0
    });

    const findMinRecursive = (node: TreeNode | null, nodeIndex: number, depth: number): number => {
      if (node === null) {
        steps.push({
          step: ++stepCount,
          description: `Base case: null node`,
          details: `Recursion depth ${depth}: Reached null node, return Infinity`,
          action: 'base_case',
          currentMin: Infinity,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], [], globalMin),
          approach: 'recursive',
          recursionDepth: depth,
          result: Infinity
        });
        return Infinity;
      }

      steps.push({
        step: ++stepCount,
        description: `Recursive call for node ${node.val}`,
        details: `Recursion depth ${depth}: Processing node with value ${node.val}`,
        action: 'recursive_call',
        currentNode: node.val,
        nodeValue: node.val,
        currentMin: globalMin,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], [], globalMin),
        approach: 'recursive',
        recursionDepth: depth
      });

      steps.push({
        step: ++stepCount,
        description: `Visit node ${node.val}`,
        details: `Recursion depth ${depth}: Consider current node value ${node.val}`,
        action: 'visit_node',
        currentNode: node.val,
        nodeValue: node.val,
        currentMin: globalMin,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], [], globalMin),
        approach: 'recursive',
        recursionDepth: depth
      });

      // Get left subtree minimum
      const leftMin = findMinRecursive(node.left, nodeIndex * 2 + 1, depth + 1);
      
      // Get right subtree minimum
      const rightMin = findMinRecursive(node.right, nodeIndex * 2 + 2, depth + 1);

      // Combine results
      const localMin = Math.min(node.val, leftMin, rightMin);
      globalMin = Math.min(globalMin, localMin);
      visitedNodes.add(nodeIndex);
      
      steps.push({
        step: ++stepCount,
        description: `Combine results for node ${node.val}`,
        details: `Recursion depth ${depth}: min(${node.val}, ${leftMin === Infinity ? '∞' : leftMin}, ${rightMin === Infinity ? '∞' : rightMin}) = ${localMin}`,
        action: 'combine_results',
        currentNode: node.val,
        nodeValue: node.val,
        currentMin: localMin,
        leftMin: leftMin === Infinity ? undefined : leftMin,
        rightMin: rightMin === Infinity ? undefined : rightMin,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], [], globalMin, localMin),
        approach: 'recursive',
        recursionDepth: depth
      });

      return localMin;
    };

    const finalResult = findMinRecursive(root, 0, 0);

    steps.push({
      step: ++stepCount,
      description: "Recursive minimum search complete!",
      details: `All recursive calls finished. Minimum value: ${finalResult}`,
      action: 'complete',
      currentMin: finalResult,
      treeVisualization: createTreeVisualization(structure, -1, visitedNodes, [], [], finalResult, finalResult),
      approach: 'recursive',
      result: finalResult
    });

    return { result: finalResult, steps };
  };

  const treeMinValueIterativeDFS = (structure: (number | null)[]) => {
    const steps: AlgorithmStep[] = [];
    const root = buildTreeFromArray(structure);
    
    if (root === null) {
      steps.push({
        step: 1,
        description: "Empty tree - return Infinity",
        details: "Tree is null, so we return Infinity",
        action: 'complete',
        currentMin: Infinity,
        treeVisualization: createTreeVisualization([]),
        approach: 'iterative_dfs',
        result: Infinity
      });
      return { result: Infinity, steps };
    }

    const stack: TreeNode[] = [root];
    let smallest = Infinity;
    const visitedNodes = new Set<number>();
    let stepCount = 0;
    
    steps.push({
      step: ++stepCount,
      description: "Initialize stack with root node",
      details: "Start DFS traversal to find minimum using a stack",
      action: 'initialize',
      currentNode: root.val,
      currentMin: smallest,
      stack: [root.val],
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes, [], [root.val], smallest),
      approach: 'iterative_dfs'
    });

    let nodeIndex = 0;
    while (stack.length > 0) {
      const node = stack.pop()!;
      
      steps.push({
        step: ++stepCount,
        description: `Pop node ${node.val} from stack`,
        details: `Remove node ${node.val} from top of stack`,
        action: 'pop_stack',
        currentNode: node.val,
        nodeValue: node.val,
        currentMin: smallest,
        stack: stack.map(n => n.val),
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], stack.map(n => n.val), smallest),
        approach: 'iterative_dfs'
      });

      steps.push({
        step: ++stepCount,
        description: `Compare ${node.val} with current minimum ${smallest === Infinity ? '∞' : smallest}`,
        details: `Check if current node has smaller value`,
        action: 'compare',
        currentNode: node.val,
        nodeValue: node.val,
        currentMin: smallest,
        stack: stack.map(n => n.val),
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], stack.map(n => n.val), smallest),
        approach: 'iterative_dfs'
      });

      if (node.val < smallest) {
        smallest = node.val;
        steps.push({
          step: ++stepCount,
          description: `🏆 New minimum found: ${node.val}`,
          details: `Update minimum from ${smallest === node.val ? '∞' : 'previous'} to ${node.val}`,
          action: 'update_min',
          currentNode: node.val,
          nodeValue: node.val,
          currentMin: smallest,
          stack: stack.map(n => n.val),
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], stack.map(n => n.val), smallest, node.val),
          approach: 'iterative_dfs'
        });
      }

      visitedNodes.add(nodeIndex);

      // Add children to stack (right first, then left for correct DFS order)
      if (node.right !== null || node.left !== null) {
        const childrenToAdd = [];
        
        if (node.right !== null) {
          stack.push(node.right);
          childrenToAdd.push(`right child ${node.right.val}`);
        }
        
        if (node.left !== null) {
          stack.push(node.left);
          childrenToAdd.push(`left child ${node.left.val}`);
        }

        steps.push({
          step: ++stepCount,
          description: `Push children: ${childrenToAdd.join(', ')}`,
          details: `Add children to stack for processing`,
          action: 'add_children',
          currentNode: node.val,
          currentMin: smallest,
          stack: stack.map(n => n.val),
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], stack.map(n => n.val), smallest, smallest),
          approach: 'iterative_dfs'
        });
      }
      
      nodeIndex++;
    }

    steps.push({
      step: ++stepCount,
      description: "Iterative DFS minimum search complete!",
      details: `Finished processing all nodes. Minimum value: ${smallest}`,
      action: 'complete',
      currentMin: smallest,
      stack: [],
      treeVisualization: createTreeVisualization(structure, -1, visitedNodes, [], [], smallest, smallest),
      approach: 'iterative_dfs',
      result: smallest
    });

    return { result: smallest, steps };
  };

  const treeMinValueIterativeBFS = (structure: (number | null)[]) => {
    const steps: AlgorithmStep[] = [];
    const root = buildTreeFromArray(structure);
    
    if (root === null) {
      steps.push({
        step: 1,
        description: "Empty tree - return Infinity",
        details: "Tree is null, so we return Infinity",
        action: 'complete',
        currentMin: Infinity,
        treeVisualization: createTreeVisualization([]),
        approach: 'iterative_bfs',
        result: Infinity
      });
      return { result: Infinity, steps };
    }

    const queue: TreeNode[] = [root];
    let smallest = Infinity;
    const visitedNodes = new Set<number>();
    let stepCount = 0;
    
    steps.push({
      step: ++stepCount,
      description: "Initialize queue with root node",
      details: "Start BFS traversal to find minimum using a queue",
      action: 'initialize',
      currentNode: root.val,
      currentMin: smallest,
      queue: [root.val],
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes, [root.val], [], smallest),
      approach: 'iterative_bfs'
    });

    let nodeIndex = 0;
    while (queue.length > 0) {
      const node = queue.shift()!;
      
      steps.push({
        step: ++stepCount,
        description: `Dequeue node ${node.val}`,
        details: `Remove node ${node.val} from front of queue`,
        action: 'dequeue',
        currentNode: node.val,
        nodeValue: node.val,
        currentMin: smallest,
        queue: queue.map(n => n.val),
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), [], smallest),
        approach: 'iterative_bfs'
      });

      steps.push({
        step: ++stepCount,
        description: `Compare ${node.val} with current minimum ${smallest === Infinity ? '∞' : smallest}`,
        details: `Check if current node has smaller value`,
        action: 'compare',
        currentNode: node.val,
        nodeValue: node.val,
        currentMin: smallest,
        queue: queue.map(n => n.val),
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), [], smallest),
        approach: 'iterative_bfs'
      });

      if (node.val < smallest) {
        smallest = node.val;
        steps.push({
          step: ++stepCount,
          description: `🏆 New minimum found: ${node.val}`,
          details: `Update minimum from ${smallest === node.val ? '∞' : 'previous'} to ${node.val}`,
          action: 'update_min',
          currentNode: node.val,
          nodeValue: node.val,
          currentMin: smallest,
          queue: queue.map(n => n.val),
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), [], smallest, node.val),
          approach: 'iterative_bfs'
        });
      }

      visitedNodes.add(nodeIndex);

      // Add children to queue
      if (node.left !== null || node.right !== null) {
        const childrenToAdd = [];
        
        if (node.left !== null) {
          queue.push(node.left);
          childrenToAdd.push(`left child ${node.left.val}`);
        }
        
        if (node.right !== null) {
          queue.push(node.right);
          childrenToAdd.push(`right child ${node.right.val}`);
        }

        steps.push({
          step: ++stepCount,
          description: `Enqueue children: ${childrenToAdd.join(', ')}`,
          details: `Add children to queue for processing`,
          action: 'add_children',
          currentNode: node.val,
          currentMin: smallest,
          queue: queue.map(n => n.val),
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), [], smallest, smallest),
          approach: 'iterative_bfs'
        });
      }
      
      nodeIndex++;
    }

    steps.push({
      step: ++stepCount,
      description: "Iterative BFS minimum search complete!",
      details: `Finished processing all nodes. Minimum value: ${smallest}`,
      action: 'complete',
      currentMin: smallest,
      queue: [],
      treeVisualization: createTreeVisualization(structure, -1, visitedNodes, [], [], smallest, smallest),
      approach: 'iterative_bfs',
      result: smallest
    });

    return { result: smallest, steps };
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
    let algorithmResult;
    
    switch (selectedApproach) {
      case 'recursive':
        algorithmResult = treeMinValueRecursive(structure);
        break;
      case 'iterative_dfs':
        algorithmResult = treeMinValueIterativeDFS(structure);
        break;
      case 'iterative_bfs':
        algorithmResult = treeMinValueIterativeBFS(structure);
        break;
    }
    
    const endTime = performance.now();
    
    setResult(algorithmResult.result);
    setSteps(algorithmResult.steps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testStructure: (number | null)[]) => {
    setInputStructure(testStructure.map(v => v === null ? 'null' : v.toString()).join(','));
    
    setTimeout(() => {
      const startTime = performance.now();
      let algorithmResult;
      
      switch (selectedApproach) {
        case 'recursive':
          algorithmResult = treeMinValueRecursive(testStructure);
          break;
        case 'iterative_dfs':
          algorithmResult = treeMinValueIterativeDFS(testStructure);
          break;
        case 'iterative_bfs':
          algorithmResult = treeMinValueIterativeBFS(testStructure);
          break;
      }
      
      const endTime = performance.now();
      
      setResult(algorithmResult.result);
      setSteps(algorithmResult.steps);
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
    // Tree 1: Mixed positive and negative
    [[3, 11, 4, 4, -2, null, 1], -2],
    
    // Tree 2: All positive
    [[5, 11, 3, 4, 14, null, 12], 3],
    
    // Tree 3: All negative
    [[-1, -6, -5, -3, -4, null, -13, null, null, -2, null, null, null, null, -2], -13],
    
    // Tree 4: Single node
    [[42], 42],
    
    // Tree 5: Two nodes
    [[10, 5], 5],
    
    // Tree 6: Larger tree
    [[100, 50, 200, 25, 75, 150, 300], 25]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Tree Min Value</span>
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
              <i className="fas fa-arrow-down text-orange-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Tree Min Value</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that finds the minimum value in a binary tree containing number values. 
                This problem demonstrates different traversal strategies for finding optimal values and shows how recursive and iterative approaches can solve the same optimization problem.
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
                Algorithm Approach
              </Label>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setSelectedApproach('recursive')}
                  variant={selectedApproach === 'recursive' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-recycle"></i>
                  <span>Recursive DFS</span>
                </Button>
                <Button
                  onClick={() => setSelectedApproach('iterative_dfs')}
                  variant={selectedApproach === 'iterative_dfs' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-layer-group"></i>
                  <span>Iterative DFS</span>
                </Button>
                <Button
                  onClick={() => setSelectedApproach('iterative_bfs')}
                  variant={selectedApproach === 'iterative_bfs' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-list"></i>
                  <span>Iterative BFS</span>
                </Button>
              </div>
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

            {/* Tree Optimization Explainer */}
            <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                Tree Optimization Strategies
              </h4>
              <div className="text-sm text-orange-700 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-100 rounded-lg p-3">
                    <div className="font-semibold mb-2">Recursive DFS</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Uses <strong>call stack</strong> naturally</li>
                      <li>Combines results <strong>on return</strong></li>
                      <li>Pattern: min(current, left_min, right_min)</li>
                      <li>Clean mathematical approach</li>
                    </ul>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-3">
                    <div className="font-semibold mb-2">Iterative DFS</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Uses <strong>stack</strong> explicitly</li>
                      <li>Maintains <strong>running minimum</strong></li>
                      <li>LIFO processing order</li>
                      <li>Explicit control flow</li>
                    </ul>
                  </div>
                  <div className="bg-cyan-100 rounded-lg p-3">
                    <div className="font-semibold mb-2">Iterative BFS</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Uses <strong>queue</strong> for traversal</li>
                      <li>Processes <strong>level by level</strong></li>
                      <li>FIFO processing order</li>
                      <li>Same result, different path</li>
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
                <i className="fas fa-arrow-down mr-2"></i>
                Find Minimum Value
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
                      Minimum Value Found!
                    </div>
                    <div className="text-sm opacity-75 text-emerald-700">
                      Minimum: {result}
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
                  <Badge variant="secondary">
                    {selectedApproach === 'recursive' ? 'Recursive DFS' : 
                     selectedApproach === 'iterative_dfs' ? 'Iterative DFS' : 'Iterative BFS'}
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
                  step.action === 'update_min' ? 'border-green-400' : 
                  step.action === 'combine_results' ? 'border-purple-400' : 'border-blue-400'
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
                <h4 className="text-sm font-medium text-slate-700 mb-3">Algorithm State</h4>
                <div className={`grid grid-cols-1 ${
                  selectedApproach === 'recursive' && step.leftMin !== undefined ? 'md:grid-cols-3' : 'md:grid-cols-2'
                } gap-4`}>
                  {selectedApproach === 'iterative_bfs' && (
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <div className="text-xs text-cyan-600 font-medium">QUEUE</div>
                      <div className="font-mono text-sm text-cyan-800">
                        [{step.queue ? step.queue.join(', ') : ''}]
                      </div>
                      <div className="text-xs text-cyan-600 mt-1">Nodes to process</div>
                    </div>
                  )}
                  
                  {selectedApproach === 'iterative_dfs' && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="text-xs text-purple-600 font-medium">STACK</div>
                      <div className="font-mono text-sm text-purple-800">
                        [{step.stack ? step.stack.join(', ') : ''}]
                      </div>
                      <div className="text-xs text-purple-600 mt-1">Nodes to process</div>
                    </div>
                  )}
                  
                  {selectedApproach === 'recursive' && step.leftMin !== undefined && (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-xs text-blue-600 font-medium">LEFT SUBTREE MIN</div>
                        <div className="font-mono text-lg text-blue-800">{step.leftMin ?? '∞'}</div>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="text-xs text-purple-600 font-medium">RIGHT SUBTREE MIN</div>
                        <div className="font-mono text-lg text-purple-800">{step.rightMin ?? '∞'}</div>
                      </div>
                    </>
                  )}
                  
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="text-xs text-emerald-600 font-medium">CURRENT MINIMUM</div>
                    <div className="font-mono text-lg text-emerald-800">
                      {step.currentMin === Infinity ? '∞' : step.currentMin}
                    </div>
                    {step.nodeValue !== undefined && (
                      <div className="text-xs text-emerald-600 mt-1">
                        Node value: {step.nodeValue}
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
                      <div className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700 self-start sm:self-auto">
                        Min: {expected}
                      </div>
                    </div>
                    
                    {/* Visual Tree Representation */}
                    <div className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="text-xs text-slate-600 mb-2 text-center">Tree Structure</div>
                      <div 
                        className="scale-75 origin-top overflow-x-auto"
                        dangerouslySetInnerHTML={{ 
                          __html: createTreeVisualization(input, -1, new Set(), [], [], Infinity) 
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">treeMinValue</span> = <span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">Infinity</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">leftMin</span> = <span className="text-yellow-300">treeMinValue</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">rightMin</span> = <span className="text-yellow-300">treeMinValue</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">Math</span><span className="text-slate-400">.</span><span className="text-yellow-300">min</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span>, <span className="text-yellow-300">leftMin</span>, <span className="text-yellow-300">rightMin</span><span className="text-slate-400">);</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Iterative DFS Solution */}
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-3">📚 Iterative DFS</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">treeMinValue</span> = <span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">stack</span> = <span className="text-slate-400">[</span><span className="text-orange-300">root</span><span className="text-slate-400">];</span>{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">smallest</span> = <span className="text-blue-400">Infinity</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">stack</span><span className="text-slate-400">.</span><span className="text-yellow-300">length</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-blue-400">const</span> <span className="text-yellow-300">current</span> = <span className="text-yellow-300">stack</span><span className="text-slate-400">.</span><span className="text-yellow-300">pop</span><span className="text-slate-400">();</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> &lt; <span className="text-yellow-300">smallest</span><span className="text-slate-400">)</span> <span className="text-yellow-300">smallest</span> = <span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-yellow-300">stack</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-yellow-300">stack</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">smallest</span><span className="text-slate-400">;</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Recursive</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <div><strong>Pattern:</strong> min(current, left, right)</div>
                        <div><strong>Base case:</strong> null returns Infinity</div>
                        <div><strong>Space:</strong> O(h) call stack</div>
                        <div className="text-xs text-green-600 mt-2">Mathematical elegance</div>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Iterative DFS</h4>
                      <div className="text-sm text-purple-700 space-y-1">
                        <div><strong>Pattern:</strong> maintain running minimum</div>
                        <div><strong>Data structure:</strong> Stack (LIFO)</div>
                        <div><strong>Space:</strong> O(h) stack size</div>
                        <div className="text-xs text-purple-600 mt-2">Explicit control</div>
                      </div>
                    </div>
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <h4 className="font-semibold text-cyan-800 mb-2">Iterative BFS</h4>
                      <div className="text-sm text-cyan-700 space-y-1">
                        <div><strong>Pattern:</strong> level-by-level comparison</div>
                        <div><strong>Data structure:</strong> Queue (FIFO)</div>
                        <div><strong>Space:</strong> O(w) queue width</div>
                        <div className="text-xs text-cyan-600 mt-2">Different order, same result</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>All approaches visit every node exactly once (O(n) time)</li>
                      <li>Recursive approach naturally combines minimum values</li>
                      <li>Iterative approaches maintain running minimum during traversal</li>
                      <li>Finding extrema (min/max) is fundamental to optimization problems</li>
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