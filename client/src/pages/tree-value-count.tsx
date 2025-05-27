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
  action: 'initialize' | 'visit_node' | 'check_match' | 'found_match' | 'add_children' | 'dequeue' | 'pop_stack' | 'complete' | 'recursive_call' | 'base_case' | 'combine_results';
  currentNode?: string | number | null;
  target: string | number;
  currentCount: number;
  nodeValue?: string | number;
  treeVisualization: string;
  approach: 'recursive' | 'iterative_dfs' | 'iterative_bfs';
  recursionDepth?: number;
  queue?: (string | number)[];
  stack?: (string | number)[];
  leftCount?: number;
  rightCount?: number;
  result?: number;
}

export function TreeValueCountPlayground() {
  const [inputStructure, setInputStructure] = useState("12,6,6,4,6,null,12");
  const [targetValue, setTargetValue] = useState("6");
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState<'recursive' | 'iterative_dfs' | 'iterative_bfs'>('recursive');

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
    stack: (string | number)[] = [],
    target: string | number = "",
    matchedNodes: Set<number> = new Set()
  ): string => {
    if (structure.length === 0 || structure[0] === null) {
      return '<div class="text-center text-slate-500 py-8">Empty Tree</div>';
    }

    // Helper function to get node display
    const getNodeDisplay = (index: number, value: string | number | null): string => {
      if (value === null) return '';
      
      let nodeClass = 'bg-white border-slate-300';
      let label = '';
      
      if (matchedNodes.has(index) && value === target) {
        nodeClass = 'bg-green-100 text-green-800 border-green-300';
        label = '<div class="text-xs text-green-600 text-center mb-2 font-medium">🎯 match</div>';
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

  const treeValueCountRecursive = (structure: (string | number | null)[], target: string | number) => {
    const steps: AlgorithmStep[] = [];
    const root = buildTreeFromArray(structure);
    
    if (root === null) {
      steps.push({
        step: 1,
        description: "Empty tree - return count of 0",
        details: "Tree is null, so target count is 0",
        action: 'complete',
        target: target,
        currentCount: 0,
        treeVisualization: createTreeVisualization([]),
        approach: 'recursive',
        result: 0
      });
      return { result: 0, steps };
    }

    const visitedNodes = new Set<number>();
    const matchedNodes = new Set<number>();
    let stepCount = 0;
    let globalCount = 0;
    
    steps.push({
      step: ++stepCount,
      description: "Starting recursive value count search",
      details: `Counting occurrences of "${target}" using DFS recursion`,
      action: 'initialize',
      target: target,
      currentCount: 0,
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes, [], [], target, matchedNodes),
      approach: 'recursive',
      recursionDepth: 0
    });

    const countRecursive = (node: TreeNode | null, nodeIndex: number, depth: number): number => {
      if (node === null) {
        steps.push({
          step: ++stepCount,
          description: `Base case: null node`,
          details: `Recursion depth ${depth}: Reached null node, return 0`,
          action: 'base_case',
          target: target,
          currentCount: 0,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], [], target, matchedNodes),
          approach: 'recursive',
          recursionDepth: depth,
          result: 0
        });
        return 0;
      }

      steps.push({
        step: ++stepCount,
        description: `Recursive call for node "${node.val}"`,
        details: `Recursion depth ${depth}: Processing node with value "${node.val}"`,
        action: 'recursive_call',
        currentNode: node.val,
        nodeValue: node.val,
        target: target,
        currentCount: globalCount,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], [], target, matchedNodes),
        approach: 'recursive',
        recursionDepth: depth
      });

      steps.push({
        step: ++stepCount,
        description: `Check if "${node.val}" equals target "${target}"`,
        details: `Recursion depth ${depth}: Comparing current node value with target`,
        action: 'check_match',
        currentNode: node.val,
        nodeValue: node.val,
        target: target,
        currentCount: globalCount,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], [], target, matchedNodes),
        approach: 'recursive',
        recursionDepth: depth
      });

      const isMatch = node.val === target;
      const matchValue = isMatch ? 1 : 0;
      
      if (isMatch) {
        globalCount++;
        matchedNodes.add(nodeIndex);
        steps.push({
          step: ++stepCount,
          description: `🎯 Match found!`,
          details: `Recursion depth ${depth}: "${node.val}" equals target, increment count`,
          action: 'found_match',
          currentNode: node.val,
          nodeValue: node.val,
          target: target,
          currentCount: globalCount,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], [], target, matchedNodes),
          approach: 'recursive',
          recursionDepth: depth
        });
      }

      // Get left and right subtree counts
      const leftCount = countRecursive(node.left, nodeIndex * 2 + 1, depth + 1);
      const rightCount = countRecursive(node.right, nodeIndex * 2 + 2, depth + 1);

      // Combine results
      const totalCount = matchValue + leftCount + rightCount;
      visitedNodes.add(nodeIndex);
      
      steps.push({
        step: ++stepCount,
        description: `Combine counts for node "${node.val}"`,
        details: `Recursion depth ${depth}: ${matchValue} (current) + ${leftCount} (left) + ${rightCount} (right) = ${totalCount}`,
        action: 'combine_results',
        currentNode: node.val,
        nodeValue: node.val,
        target: target,
        currentCount: totalCount,
        leftCount: leftCount,
        rightCount: rightCount,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], [], target, matchedNodes),
        approach: 'recursive',
        recursionDepth: depth
      });

      return totalCount;
    };

    const finalResult = countRecursive(root, 0, 0);

    steps.push({
      step: ++stepCount,
      description: "Recursive value count complete!",
      details: `All recursive calls finished. Total count: ${finalResult}`,
      action: 'complete',
      target: target,
      currentCount: finalResult,
      treeVisualization: createTreeVisualization(structure, -1, visitedNodes, [], [], target, matchedNodes),
      approach: 'recursive',
      result: finalResult
    });

    return { result: finalResult, steps };
  };

  const treeValueCountIterativeDFS = (structure: (string | number | null)[], target: string | number) => {
    const steps: AlgorithmStep[] = [];
    const root = buildTreeFromArray(structure);
    
    if (root === null) {
      steps.push({
        step: 1,
        description: "Empty tree - return count of 0",
        details: "Tree is null, so target count is 0",
        action: 'complete',
        target: target,
        currentCount: 0,
        treeVisualization: createTreeVisualization([]),
        approach: 'iterative_dfs',
        result: 0
      });
      return { result: 0, steps };
    }

    const stack: TreeNode[] = [root];
    let count = 0;
    const visitedNodes = new Set<number>();
    const matchedNodes = new Set<number>();
    let stepCount = 0;
    
    steps.push({
      step: ++stepCount,
      description: "Initialize stack with root node",
      details: "Start DFS traversal to count target occurrences using a stack",
      action: 'initialize',
      currentNode: root.val,
      target: target,
      currentCount: count,
      stack: [root.val],
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes, [], [root.val], target, matchedNodes),
      approach: 'iterative_dfs'
    });

    let nodeIndex = 0;
    while (stack.length > 0) {
      const node = stack.pop()!;
      
      steps.push({
        step: ++stepCount,
        description: `Pop node "${node.val}" from stack`,
        details: `Remove node "${node.val}" from top of stack`,
        action: 'pop_stack',
        currentNode: node.val,
        nodeValue: node.val,
        target: target,
        currentCount: count,
        stack: stack.map(n => n.val),
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], stack.map(n => n.val), target, matchedNodes),
        approach: 'iterative_dfs'
      });

      steps.push({
        step: ++stepCount,
        description: `Check if "${node.val}" equals target "${target}"`,
        details: `Compare current node value with target`,
        action: 'check_match',
        currentNode: node.val,
        nodeValue: node.val,
        target: target,
        currentCount: count,
        stack: stack.map(n => n.val),
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], stack.map(n => n.val), target, matchedNodes),
        approach: 'iterative_dfs'
      });

      if (node.val === target) {
        count++;
        matchedNodes.add(nodeIndex);
        steps.push({
          step: ++stepCount,
          description: `🎯 Match found! Count: ${count}`,
          details: `Found "${target}", increment count to ${count}`,
          action: 'found_match',
          currentNode: node.val,
          nodeValue: node.val,
          target: target,
          currentCount: count,
          stack: stack.map(n => n.val),
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], stack.map(n => n.val), target, matchedNodes),
          approach: 'iterative_dfs'
        });
      }

      visitedNodes.add(nodeIndex);

      // Add children to stack (right first, then left for correct DFS order)
      if (node.right !== null || node.left !== null) {
        const childrenToAdd = [];
        
        if (node.right !== null) {
          stack.push(node.right);
          childrenToAdd.push(`right child "${node.right.val}"`);
        }
        
        if (node.left !== null) {
          stack.push(node.left);
          childrenToAdd.push(`left child "${node.left.val}"`);
        }

        steps.push({
          step: ++stepCount,
          description: `Push children: ${childrenToAdd.join(', ')}`,
          details: `Add children to stack for processing`,
          action: 'add_children',
          currentNode: node.val,
          target: target,
          currentCount: count,
          stack: stack.map(n => n.val),
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], stack.map(n => n.val), target, matchedNodes),
          approach: 'iterative_dfs'
        });
      }
      
      nodeIndex++;
    }

    steps.push({
      step: ++stepCount,
      description: "Iterative DFS value count complete!",
      details: `Finished processing all nodes. Total count: ${count}`,
      action: 'complete',
      target: target,
      currentCount: count,
      stack: [],
      treeVisualization: createTreeVisualization(structure, -1, visitedNodes, [], [], target, matchedNodes),
      approach: 'iterative_dfs',
      result: count
    });

    return { result: count, steps };
  };

  const treeValueCountIterativeBFS = (structure: (string | number | null)[], target: string | number) => {
    const steps: AlgorithmStep[] = [];
    const root = buildTreeFromArray(structure);
    
    if (root === null) {
      steps.push({
        step: 1,
        description: "Empty tree - return count of 0",
        details: "Tree is null, so target count is 0",
        action: 'complete',
        target: target,
        currentCount: 0,
        treeVisualization: createTreeVisualization([]),
        approach: 'iterative_bfs',
        result: 0
      });
      return { result: 0, steps };
    }

    const queue: TreeNode[] = [root];
    let count = 0;
    const visitedNodes = new Set<number>();
    const matchedNodes = new Set<number>();
    let stepCount = 0;
    
    steps.push({
      step: ++stepCount,
      description: "Initialize queue with root node",
      details: "Start BFS traversal to count target occurrences using a queue",
      action: 'initialize',
      currentNode: root.val,
      target: target,
      currentCount: count,
      queue: [root.val],
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes, [root.val], [], target, matchedNodes),
      approach: 'iterative_bfs'
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
        nodeValue: node.val,
        target: target,
        currentCount: count,
        queue: queue.map(n => n.val),
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), [], target, matchedNodes),
        approach: 'iterative_bfs'
      });

      steps.push({
        step: ++stepCount,
        description: `Check if "${node.val}" equals target "${target}"`,
        details: `Compare current node value with target`,
        action: 'check_match',
        currentNode: node.val,
        nodeValue: node.val,
        target: target,
        currentCount: count,
        queue: queue.map(n => n.val),
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), [], target, matchedNodes),
        approach: 'iterative_bfs'
      });

      if (node.val === target) {
        count++;
        matchedNodes.add(nodeIndex);
        steps.push({
          step: ++stepCount,
          description: `🎯 Match found! Count: ${count}`,
          details: `Found "${target}", increment count to ${count}`,
          action: 'found_match',
          currentNode: node.val,
          nodeValue: node.val,
          target: target,
          currentCount: count,
          queue: queue.map(n => n.val),
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), [], target, matchedNodes),
          approach: 'iterative_bfs'
        });
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
          currentCount: count,
          queue: queue.map(n => n.val),
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, queue.map(n => n.val), [], target, matchedNodes),
          approach: 'iterative_bfs'
        });
      }
      
      nodeIndex++;
    }

    steps.push({
      step: ++stepCount,
      description: "Iterative BFS value count complete!",
      details: `Finished processing all nodes. Total count: ${count}`,
      action: 'complete',
      target: target,
      currentCount: count,
      queue: [],
      treeVisualization: createTreeVisualization(structure, -1, visitedNodes, [], [], target, matchedNodes),
      approach: 'iterative_bfs',
      result: count
    });

    return { result: count, steps };
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
      alert('Please enter a target value to count');
      return;
    }

    const target = parseValue(targetValue);
    if (target === null) {
      alert('Target value cannot be null');
      return;
    }

    const startTime = performance.now();
    let algorithmResult;
    
    switch (selectedApproach) {
      case 'recursive':
        algorithmResult = treeValueCountRecursive(structure, target);
        break;
      case 'iterative_dfs':
        algorithmResult = treeValueCountIterativeDFS(structure, target);
        break;
      case 'iterative_bfs':
        algorithmResult = treeValueCountIterativeBFS(structure, target);
        break;
    }
    
    const endTime = performance.now();
    
    setResult(algorithmResult.result);
    setSteps(algorithmResult.steps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testStructure: (string | number | null)[], testTarget: string | number) => {
    setInputStructure(testStructure.map(v => v === null ? 'null' : v.toString()).join(','));
    setTargetValue(testTarget.toString());
    
    setTimeout(() => {
      const startTime = performance.now();
      let algorithmResult;
      
      switch (selectedApproach) {
        case 'recursive':
          algorithmResult = treeValueCountRecursive(testStructure, testTarget);
          break;
        case 'iterative_dfs':
          algorithmResult = treeValueCountIterativeDFS(testStructure, testTarget);
          break;
        case 'iterative_bfs':
          algorithmResult = treeValueCountIterativeBFS(testStructure, testTarget);
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
    setTargetValue("");
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setShowVisualization(false);
    setExecutionTime(0);
  };

  const testCases: [(string | number | null)[], string | number, number][] = [
    // Tree 1: Count 6s
    [[12, 6, 6, 4, 6, null, 12], 6, 3],
    [[12, 6, 6, 4, 6, null, 12], 12, 2],
    
    // Tree 2: Count 1s in deeper tree
    [[7, 5, 1, 1, 8, null, 7, null, null, 1, null, null, null, null, 1], 1, 4],
    [[7, 5, 1, 1, 8, null, 7, null, null, 1, null, null, null, null, 1], 9, 0],
    
    // Tree 3: Single node
    [[42], 42, 1],
    [[42], 99, 0],
    
    // Tree 4: All same value
    [[5, 5, 5], 5, 3]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Tree Value Count</span>
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-calculator text-violet-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Tree Value Count</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that counts the number of times a target value appears in a binary tree. 
                This problem demonstrates counting patterns and showcases how all three traversal approaches (recursive DFS, iterative DFS, and BFS) can solve the same problem.
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
                Counting Algorithm Approach
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
                  placeholder="e.g. 12,6,6,4,6,null,12"
                />
                <div className="mt-2 text-xs text-slate-500">
                  Enter values in level-order. Use "null" for missing nodes.
                </div>
              </div>

              <div>
                <Label htmlFor="targetValue" className="block text-sm font-medium text-slate-700 mb-2">
                  Target Value to Count
                </Label>
                <Input
                  id="targetValue"
                  type="text"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. 6"
                />
                <div className="mt-2 text-xs text-slate-500">
                  Enter the value to count occurrences of.
                </div>
              </div>
            </div>

            {/* Counting Strategy Explainer */}
            <div className="mb-6 bg-violet-50 border border-violet-200 rounded-lg p-4">
              <h4 className="font-semibold text-violet-800 mb-3 flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                Tree Counting Strategies
              </h4>
              <div className="text-sm text-violet-700 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-100 rounded-lg p-3">
                    <div className="font-semibold mb-2">Recursive DFS</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Approach:</strong> current + left_count + right_count</li>
                      <li><strong>Base case:</strong> null node returns 0</li>
                      <li><strong>Combines:</strong> results through return values</li>
                      <li><strong>Style:</strong> Elegant and mathematical</li>
                    </ul>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-3">
                    <div className="font-semibold mb-2">Iterative DFS</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Approach:</strong> Stack-based traversal</li>
                      <li><strong>Counter:</strong> Running count variable</li>
                      <li><strong>Order:</strong> LIFO processing</li>
                      <li><strong>Control:</strong> Explicit loop management</li>
                    </ul>
                  </div>
                  <div className="bg-cyan-100 rounded-lg p-3">
                    <div className="font-semibold mb-2">Iterative BFS</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Approach:</strong> Queue-based traversal</li>
                      <li><strong>Counter:</strong> Running count variable</li>
                      <li><strong>Order:</strong> Level-by-level processing</li>
                      <li><strong>Pattern:</strong> FIFO queue operations</li>
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
                      __html: createTreeVisualization(parseStructure(inputStructure), -1, new Set(), [], [], targetValue, new Set()) 
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
                <i className="fas fa-calculator mr-2"></i>
                Count Occurrences
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
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-800">
                      Count Complete!
                    </div>
                    <div className="text-sm opacity-75 text-emerald-700">
                      Found {result} occurrence{result !== 1 ? 's' : ''} of "{targetValue}"
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
                  step.action === 'found_match' ? 'border-green-400' : 
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
                <h4 className="text-sm font-medium text-slate-700 mb-3">Counting State</h4>
                <div className={`grid grid-cols-1 ${
                  selectedApproach === 'recursive' && step.leftCount !== undefined ? 'md:grid-cols-4' : 
                  selectedApproach !== 'recursive' ? 'md:grid-cols-3' : 'md:grid-cols-2'
                } gap-4`}>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-xs text-purple-600 font-medium">TARGET</div>
                    <div className="font-mono text-lg text-purple-800">"{step.target}"</div>
                    <div className="text-xs text-purple-600 mt-1">Looking for this value</div>
                  </div>
                  
                  {selectedApproach === 'iterative_bfs' && (
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <div className="text-xs text-cyan-600 font-medium">QUEUE</div>
                      <div className="font-mono text-sm text-cyan-800">
                        [{step.queue ? step.queue.map(v => `"${v}"`).join(', ') : ''}]
                      </div>
                      <div className="text-xs text-cyan-600 mt-1">Nodes to process</div>
                    </div>
                  )}
                  
                  {selectedApproach === 'iterative_dfs' && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="text-xs text-purple-600 font-medium">STACK</div>
                      <div className="font-mono text-sm text-purple-800">
                        [{step.stack ? step.stack.map(v => `"${v}"`).join(', ') : ''}]
                      </div>
                      <div className="text-xs text-purple-600 mt-1">Nodes to process</div>
                    </div>
                  )}
                  
                  {selectedApproach === 'recursive' && step.leftCount !== undefined && (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-xs text-blue-600 font-medium">LEFT COUNT</div>
                        <div className="font-mono text-lg text-blue-800">{step.leftCount}</div>
                        <div className="text-xs text-blue-600 mt-1">Left subtree matches</div>
                      </div>
                      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                        <div className="text-xs text-pink-600 font-medium">RIGHT COUNT</div>
                        <div className="font-mono text-lg text-pink-800">{step.rightCount}</div>
                        <div className="text-xs text-pink-600 mt-1">Right subtree matches</div>
                      </div>
                    </>
                  )}
                  
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="text-xs text-emerald-600 font-medium">CURRENT COUNT</div>
                    <div className="font-mono text-lg text-emerald-800">{step.currentCount}</div>
                    <div className="text-xs text-emerald-600 mt-1">Total matches found</div>
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
                      <div className="px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-700 self-start sm:self-auto">
                        Count: {expected}
                      </div>
                    </div>
                    
                    {/* Visual Tree Representation */}
                    {input.length > 0 && (
                      <div className="bg-white rounded-lg border border-slate-200 p-3">
                        <div className="text-xs text-slate-600 mb-2 text-center">Tree Structure</div>
                        <div 
                          className="scale-75 origin-top overflow-x-auto"
                          dangerouslySetInnerHTML={{ 
                            __html: createTreeVisualization(input, -1, new Set(), [], [], target, new Set()) 
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
                    <h4 className="font-semibold text-green-800 mb-3">✅ Recursive Approach</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">treeValueCount</span> = <span className="text-slate-400">(</span><span className="text-orange-300">root</span>, <span className="text-orange-300">target</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">match</span> = <span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> === <span className="text-orange-300">target</span> ? <span className="text-green-400">1</span> : <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">match</span> + <span className="text-yellow-300">treeValueCount</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span>, <span className="text-orange-300">target</span><span className="text-slate-400">) +</span>{'\n'}
                          {'         '}<span className="text-yellow-300">treeValueCount</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span>, <span className="text-orange-300">target</span><span className="text-slate-400">);</span>{'\n'}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">treeValueCount</span> = <span className="text-slate-400">(</span><span className="text-orange-300">root</span>, <span className="text-orange-300">target</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">let</span> <span className="text-yellow-300">count</span> = <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">stack</span> = <span className="text-slate-400">[</span> <span className="text-orange-300">root</span> <span className="text-slate-400">];</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">stack</span><span className="text-slate-400">.</span><span className="text-yellow-300">length</span> &gt; <span className="text-green-400">0</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-blue-400">const</span> <span className="text-yellow-300">current</span> = <span className="text-yellow-300">stack</span><span className="text-slate-400">.</span><span className="text-yellow-300">pop</span><span className="text-slate-400">();</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> === <span className="text-orange-300">target</span><span className="text-slate-400">)</span> <span className="text-yellow-300">count</span> += <span className="text-green-400">1</span><span className="text-slate-400">;</span>{'\n'}
                          {'    '}{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span><span className="text-slate-400">)</span> <span className="text-yellow-300">stack</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span><span className="text-slate-400">)</span> <span className="text-yellow-300">stack</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">current</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">count</span><span className="text-slate-400">;</span>{'\n'}
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
                        <div><strong>Pattern:</strong> match + left + right</div>
                        <div><strong>Base case:</strong> null returns 0</div>
                        <div><strong>Combines:</strong> naturally through return</div>
                        <div className="text-xs text-green-600 mt-2">Mathematical elegance</div>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Iterative DFS</h4>
                      <div className="text-sm text-purple-700 space-y-1">
                        <div><strong>Pattern:</strong> running counter</div>
                        <div><strong>Data structure:</strong> Stack (LIFO)</div>
                        <div><strong>Control:</strong> explicit loop</div>
                        <div className="text-xs text-purple-600 mt-2">Direct accumulation</div>
                      </div>
                    </div>
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <h4 className="font-semibold text-cyan-800 mb-2">Iterative BFS</h4>
                      <div className="text-sm text-cyan-700 space-y-1">
                        <div><strong>Pattern:</strong> running counter</div>
                        <div><strong>Data structure:</strong> Queue (FIFO)</div>
                        <div><strong>Order:</strong> level-by-level</div>
                        <div className="text-xs text-cyan-600 mt-2">Same result, different path</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>All approaches visit every node exactly once (O(n) time)</li>
                      <li>Counting demonstrates accumulation patterns across different traversals</li>
                      <li>The choice of approach depends on preference and constraints</li>
                      <li>This pattern extends to many tree aggregation problems</li>
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