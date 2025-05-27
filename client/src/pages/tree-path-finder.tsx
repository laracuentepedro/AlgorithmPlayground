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
  action: 'initialize' | 'visit_node' | 'check_target' | 'found_target' | 'search_left' | 'search_right' | 'build_path' | 'backtrack' | 'complete' | 'recursive_call' | 'base_case';
  currentNode?: string | number | null;
  target: string | number;
  currentPath: (string | number)[];
  foundPath: (string | number)[] | null;
  treeVisualization: string;
  approach: 'spread_operator' | 'push_reverse';
  recursionDepth?: number;
  leftPath?: (string | number)[] | null;
  rightPath?: (string | number)[] | null;
  result?: (string | number)[] | null;
}

export function TreePathFinderPlayground() {
  const [inputStructure, setInputStructure] = useState("a,b,c,d,e,null,f");
  const [targetValue, setTargetValue] = useState("e");
  const [result, setResult] = useState<(string | number)[] | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState<'spread_operator' | 'push_reverse'>('spread_operator');

  const parseValue = (val: string): string | number | null => {
    if (val.toLowerCase() === 'null') return null;
    const numVal = parseFloat(val);
    return isNaN(numVal) ? val : numVal;
  };

  const createTreeVisualization = (
    structure: (string | number | null)[], 
    currentIndex: number = -1,
    visitedNodes: Set<number> = new Set(),
    currentPath: (string | number)[] = [],
    foundPath: (string | number)[] | null = null,
    target: string | number = ""
  ): string => {
    if (structure.length === 0 || structure[0] === null) {
      return '<div class="text-center text-slate-500 py-8">Empty Tree</div>';
    }

    // Helper function to get node display
    const getNodeDisplay = (index: number, value: string | number | null): string => {
      if (value === null) return '';
      
      let nodeClass = 'bg-white border-slate-300';
      let label = '';
      
      if (foundPath && foundPath.includes(value)) {
        nodeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        label = '<div class="text-xs text-emerald-600 text-center mb-2 font-medium">🎯 path</div>';
      } else if (value === target && foundPath) {
        nodeClass = 'bg-green-100 text-green-800 border-green-300';
        label = '<div class="text-xs text-green-600 text-center mb-2 font-medium">✓ target</div>';
      } else if (currentPath.includes(value)) {
        nodeClass = 'bg-blue-100 text-blue-800 border-blue-300';
        label = '<div class="text-xs text-blue-600 text-center mb-2 font-medium">📍 exploring</div>';
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

  const pathFinderSpreadOperator = (structure: (string | number | null)[], target: string | number) => {
    const steps: AlgorithmStep[] = [];
    const root = buildTreeFromArray(structure);
    
    if (root === null) {
      steps.push({
        step: 1,
        description: "Empty tree - return null",
        details: "Tree is null, so target cannot exist",
        action: 'complete',
        target: target,
        currentPath: [],
        foundPath: null,
        treeVisualization: createTreeVisualization([]),
        approach: 'spread_operator',
        result: null
      });
      return { result: null, steps };
    }

    const visitedNodes = new Set<number>();
    let stepCount = 0;
    let finalPath: (string | number)[] | null = null;
    
    steps.push({
      step: ++stepCount,
      description: "Starting recursive path search",
      details: `Looking for path to "${target}" using DFS with spread operator`,
      action: 'initialize',
      target: target,
      currentPath: [],
      foundPath: null,
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes, [], null, target),
      approach: 'spread_operator',
      recursionDepth: 0
    });

    const findPathRecursive = (node: TreeNode | null, nodeIndex: number, depth: number): (string | number)[] | null => {
      if (node === null) {
        steps.push({
          step: ++stepCount,
          description: `Base case: null node`,
          details: `Recursion depth ${depth}: Reached null node, return null`,
          action: 'base_case',
          target: target,
          currentPath: [],
          foundPath: finalPath,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], finalPath, target),
          approach: 'spread_operator',
          recursionDepth: depth,
          result: null
        });
        return null;
      }

      steps.push({
        step: ++stepCount,
        description: `Recursive call for node "${node.val}"`,
        details: `Recursion depth ${depth}: Visiting node with value "${node.val}"`,
        action: 'recursive_call',
        currentNode: node.val,
        target: target,
        currentPath: [node.val],
        foundPath: finalPath,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [node.val], finalPath, target),
        approach: 'spread_operator',
        recursionDepth: depth
      });

      steps.push({
        step: ++stepCount,
        description: `Check if "${node.val}" equals target "${target}"`,
        details: `Recursion depth ${depth}: Comparing current node value with target`,
        action: 'check_target',
        currentNode: node.val,
        target: target,
        currentPath: [node.val],
        foundPath: finalPath,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [node.val], finalPath, target),
        approach: 'spread_operator',
        recursionDepth: depth
      });

      if (node.val === target) {
        finalPath = [node.val];
        visitedNodes.add(nodeIndex);
        steps.push({
          step: ++stepCount,
          description: `🎯 Target found!`,
          details: `Recursion depth ${depth}: Found "${target}" at current node`,
          action: 'found_target',
          currentNode: node.val,
          target: target,
          currentPath: [node.val],
          foundPath: finalPath,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [node.val], finalPath, target),
          approach: 'spread_operator',
          recursionDepth: depth,
          result: finalPath
        });
        return finalPath;
      }

      // Search left subtree
      steps.push({
        step: ++stepCount,
        description: `Search left subtree of "${node.val}"`,
        details: `Recursion depth ${depth}: Exploring left child for target`,
        action: 'search_left',
        currentNode: node.val,
        target: target,
        currentPath: [node.val],
        foundPath: finalPath,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [node.val], finalPath, target),
        approach: 'spread_operator',
        recursionDepth: depth
      });

      const leftPath = findPathRecursive(node.left, nodeIndex * 2 + 1, depth + 1);
      
      if (leftPath !== null) {
        const fullPath = [node.val, ...leftPath];
        finalPath = fullPath;
        visitedNodes.add(nodeIndex);
        
        steps.push({
          step: ++stepCount,
          description: `Build path from left subtree`,
          details: `Recursion depth ${depth}: Prepend "${node.val}" to left path [${leftPath.join(', ')}]`,
          action: 'build_path',
          currentNode: node.val,
          target: target,
          currentPath: fullPath,
          foundPath: fullPath,
          leftPath: leftPath,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, fullPath, fullPath, target),
          approach: 'spread_operator',
          recursionDepth: depth,
          result: fullPath
        });
        return fullPath;
      }

      // Search right subtree
      steps.push({
        step: ++stepCount,
        description: `Search right subtree of "${node.val}"`,
        details: `Recursion depth ${depth}: Left search failed, exploring right child`,
        action: 'search_right',
        currentNode: node.val,
        target: target,
        currentPath: [node.val],
        foundPath: finalPath,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [node.val], finalPath, target),
        approach: 'spread_operator',
        recursionDepth: depth
      });

      const rightPath = findPathRecursive(node.right, nodeIndex * 2 + 2, depth + 1);
      
      if (rightPath !== null) {
        const fullPath = [node.val, ...rightPath];
        finalPath = fullPath;
        visitedNodes.add(nodeIndex);
        
        steps.push({
          step: ++stepCount,
          description: `Build path from right subtree`,
          details: `Recursion depth ${depth}: Prepend "${node.val}" to right path [${rightPath.join(', ')}]`,
          action: 'build_path',
          currentNode: node.val,
          target: target,
          currentPath: fullPath,
          foundPath: fullPath,
          rightPath: rightPath,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, fullPath, fullPath, target),
          approach: 'spread_operator',
          recursionDepth: depth,
          result: fullPath
        });
        return fullPath;
      }

      // Backtrack - no path found through this node
      visitedNodes.add(nodeIndex);
      steps.push({
        step: ++stepCount,
        description: `Backtrack from "${node.val}"`,
        details: `Recursion depth ${depth}: No path found through this node, return null`,
        action: 'backtrack',
        currentNode: node.val,
        target: target,
        currentPath: [],
        foundPath: finalPath,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], finalPath, target),
        approach: 'spread_operator',
        recursionDepth: depth,
        result: null
      });

      return null;
    };

    const pathResult = findPathRecursive(root, 0, 0);

    steps.push({
      step: ++stepCount,
      description: pathResult ? "Path search complete!" : "Path search complete - target not found",
      details: pathResult ? `Found path: [${pathResult.join(' → ')}]` : `Target "${target}" does not exist in tree`,
      action: 'complete',
      target: target,
      currentPath: pathResult || [],
      foundPath: pathResult,
      treeVisualization: createTreeVisualization(structure, -1, visitedNodes, [], pathResult, target),
      approach: 'spread_operator',
      result: pathResult
    });

    return { result: pathResult, steps };
  };

  const pathFinderPushReverse = (structure: (string | number | null)[], target: string | number) => {
    const steps: AlgorithmStep[] = [];
    const root = buildTreeFromArray(structure);
    
    if (root === null) {
      steps.push({
        step: 1,
        description: "Empty tree - return null",
        details: "Tree is null, so target cannot exist",
        action: 'complete',
        target: target,
        currentPath: [],
        foundPath: null,
        treeVisualization: createTreeVisualization([]),
        approach: 'push_reverse',
        result: null
      });
      return { result: null, steps };
    }

    const visitedNodes = new Set<number>();
    let stepCount = 0;
    let finalPath: (string | number)[] | null = null;
    
    steps.push({
      step: ++stepCount,
      description: "Starting recursive path search with push/reverse optimization",
      details: `Looking for path to "${target}" using DFS with push and reverse`,
      action: 'initialize',
      target: target,
      currentPath: [],
      foundPath: null,
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes, [], null, target),
      approach: 'push_reverse',
      recursionDepth: 0
    });

    const findPathHelper = (node: TreeNode | null, nodeIndex: number, depth: number): (string | number)[] | null => {
      if (node === null) {
        steps.push({
          step: ++stepCount,
          description: `Base case: null node`,
          details: `Recursion depth ${depth}: Reached null node, return null`,
          action: 'base_case',
          target: target,
          currentPath: [],
          foundPath: finalPath,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], finalPath, target),
          approach: 'push_reverse',
          recursionDepth: depth,
          result: null
        });
        return null;
      }

      steps.push({
        step: ++stepCount,
        description: `Helper call for node "${node.val}"`,
        details: `Recursion depth ${depth}: Processing node "${node.val}" in reverse-build mode`,
        action: 'recursive_call',
        currentNode: node.val,
        target: target,
        currentPath: [node.val],
        foundPath: finalPath,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [node.val], finalPath, target),
        approach: 'push_reverse',
        recursionDepth: depth
      });

      if (node.val === target) {
        finalPath = [node.val];
        visitedNodes.add(nodeIndex);
        steps.push({
          step: ++stepCount,
          description: `🎯 Target found!`,
          details: `Recursion depth ${depth}: Found "${target}", return array with target`,
          action: 'found_target',
          currentNode: node.val,
          target: target,
          currentPath: [node.val],
          foundPath: finalPath,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [node.val], finalPath, target),
          approach: 'push_reverse',
          recursionDepth: depth,
          result: finalPath
        });
        return [node.val];
      }

      // Search left subtree
      const leftPath = findPathHelper(node.left, nodeIndex * 2 + 1, depth + 1);
      
      if (leftPath !== null) {
        leftPath.push(node.val);
        const reversedPath = [...leftPath].reverse();
        finalPath = reversedPath;
        visitedNodes.add(nodeIndex);
        
        steps.push({
          step: ++stepCount,
          description: `Build path from left: push "${node.val}" to [${leftPath.slice(0, -1).join(', ')}]`,
          details: `Recursion depth ${depth}: Add current node to path end, will reverse later`,
          action: 'build_path',
          currentNode: node.val,
          target: target,
          currentPath: leftPath,
          foundPath: reversedPath,
          leftPath: leftPath,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, reversedPath, reversedPath, target),
          approach: 'push_reverse',
          recursionDepth: depth,
          result: leftPath
        });
        return leftPath;
      }

      // Search right subtree
      const rightPath = findPathHelper(node.right, nodeIndex * 2 + 2, depth + 1);
      
      if (rightPath !== null) {
        rightPath.push(node.val);
        const reversedPath = [...rightPath].reverse();
        finalPath = reversedPath;
        visitedNodes.add(nodeIndex);
        
        steps.push({
          step: ++stepCount,
          description: `Build path from right: push "${node.val}" to [${rightPath.slice(0, -1).join(', ')}]`,
          details: `Recursion depth ${depth}: Add current node to path end, will reverse later`,
          action: 'build_path',
          currentNode: node.val,
          target: target,
          currentPath: rightPath,
          foundPath: reversedPath,
          rightPath: rightPath,
          treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, reversedPath, reversedPath, target),
          approach: 'push_reverse',
          recursionDepth: depth,
          result: rightPath
        });
        return rightPath;
      }

      visitedNodes.add(nodeIndex);
      steps.push({
        step: ++stepCount,
        description: `Backtrack from "${node.val}"`,
        details: `Recursion depth ${depth}: No path found through this node`,
        action: 'backtrack',
        currentNode: node.val,
        target: target,
        currentPath: [],
        foundPath: finalPath,
        treeVisualization: createTreeVisualization(structure, nodeIndex, visitedNodes, [], finalPath, target),
        approach: 'push_reverse',
        recursionDepth: depth,
        result: null
      });

      return null;
    };

    const helperResult = findPathHelper(root, 0, 0);
    const pathResult = helperResult ? [...helperResult].reverse() : null;

    if (pathResult) {
      steps.push({
        step: ++stepCount,
        description: `Reverse final path: [${helperResult!.join(', ')}] → [${pathResult.join(', ')}]`,
        details: `Convert bottom-up path to top-down path by reversing`,
        action: 'build_path',
        target: target,
        currentPath: pathResult,
        foundPath: pathResult,
        treeVisualization: createTreeVisualization(structure, -1, visitedNodes, [], pathResult, target),
        approach: 'push_reverse'
      });
    }

    steps.push({
      step: ++stepCount,
      description: pathResult ? "Optimized path search complete!" : "Path search complete - target not found",
      details: pathResult ? `Found path: [${pathResult.join(' → ')}]` : `Target "${target}" does not exist in tree`,
      action: 'complete',
      target: target,
      currentPath: pathResult || [],
      foundPath: pathResult,
      treeVisualization: createTreeVisualization(structure, -1, visitedNodes, [], pathResult, target),
      approach: 'push_reverse',
      result: pathResult
    });

    return { result: pathResult, steps };
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
    const { result: pathResult, steps: algorithmSteps } = selectedApproach === 'spread_operator' 
      ? pathFinderSpreadOperator(structure, target)
      : pathFinderPushReverse(structure, target);
    const endTime = performance.now();
    
    setResult(pathResult);
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
      const { result: pathResult, steps: algorithmSteps } = selectedApproach === 'spread_operator' 
        ? pathFinderSpreadOperator(testStructure, testTarget)
        : pathFinderPushReverse(testStructure, testTarget);
      const endTime = performance.now();
      
      setResult(pathResult);
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

  const testCases: [(string | number | null)[], string | number, (string | number)[] | null][] = [
    // Basic path finding
    [["a", "b", "c", "d", "e", null, "f"], "e", ["a", "b", "e"]],
    [["a", "b", "c", "d", "e", null, "f"], "p", null],
    
    // Deeper tree
    [["a", "b", "c", "d", "e", null, "f", null, null, "g", null, null, null, null, "h"], "c", ["a", "c"]],
    [["a", "b", "c", "d", "e", null, "f", null, null, "g", null, null, null, null, "h"], "h", ["a", "c", "f", "h"]],
    
    // Single node
    [["x"], "x", ["x"]],
    
    // Root target
    [["root", "left", "right"], "root", ["root"]],
    
    // Deep right path
    [[1, null, 2, null, null, null, 3], 3, [1, 2, 3]]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Tree Path Finder</span>
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
              <i className="fas fa-map-marked-alt text-cyan-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Tree Path Finder</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that finds a path from the root to a target value in a binary tree. 
                This problem demonstrates advanced path tracking techniques and showcases two different optimization strategies for building paths efficiently.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <i className="fas fa-clock"></i>
                  <span>Time: O(n) - O(n²)</span>
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

            {/* Algorithm Approach Selection */}
            <div className="mb-6">
              <Label className="block text-sm font-medium text-slate-700 mb-3">
                Path Building Strategy
              </Label>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setSelectedApproach('spread_operator')}
                  variant={selectedApproach === 'spread_operator' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-expand-arrows-alt"></i>
                  <span>Spread Operator (O(n²))</span>
                </Button>
                <Button
                  onClick={() => setSelectedApproach('push_reverse')}
                  variant={selectedApproach === 'push_reverse' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-undo"></i>
                  <span>Push & Reverse (O(n))</span>
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
                  Target Value to Find
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
                  Enter the value to find the path to.
                </div>
              </div>
            </div>

            {/* Path Building Strategy Explainer */}
            <div className="mb-6 bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-800 mb-3 flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                Path Building Optimization Strategies
              </h4>
              <div className="text-sm text-cyan-700 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-100 rounded-lg p-3">
                    <div className="font-semibold mb-2">Spread Operator (Simple)</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Approach:</strong> [current, ...childPath]</li>
                      <li><strong>Time:</strong> O(n²) due to array copying</li>
                      <li><strong>Space:</strong> O(n) call stack + copies</li>
                      <li><strong>Readability:</strong> Very clear and intuitive</li>
                    </ul>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3">
                    <div className="font-semibold mb-2">Push & Reverse (Optimized)</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>Approach:</strong> Build bottom-up, then reverse</li>
                      <li><strong>Time:</strong> O(n) with single array modification</li>
                      <li><strong>Space:</strong> O(n) call stack only</li>
                      <li><strong>Efficiency:</strong> Better for large trees</li>
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
                      __html: createTreeVisualization(parseStructure(inputStructure), -1, new Set(), [], null, targetValue) 
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
                <i className="fas fa-map-marked-alt mr-2"></i>
                Find Path
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
                    <i className={`fas ${result ? 'fa-route' : 'fa-times'}`}></i>
                  </div>
                  <div>
                    <div className={`font-semibold ${result ? 'text-emerald-800' : 'text-red-800'}`}>
                      {result ? 'Path Found!' : 'Path Not Found'}
                    </div>
                    <div className={`text-sm opacity-75 ${result ? 'text-emerald-700' : 'text-red-700'}`}>
                      {result ? `Path: [${result.join(' → ')}]` : 'Target does not exist in tree'}
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
                    {selectedApproach === 'spread_operator' ? 'Spread Operator' : 'Push & Reverse'}
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
                  step.action === 'build_path' ? 'border-green-400' : 
                  step.action === 'backtrack' ? 'border-yellow-400' : 'border-blue-400'
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
                <h4 className="text-sm font-medium text-slate-700 mb-3">Path Tracking</h4>
                <div className={`grid grid-cols-1 ${step.leftPath !== undefined || step.rightPath !== undefined ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-xs text-purple-600 font-medium">TARGET</div>
                    <div className="font-mono text-lg text-purple-800">"{step.target}"</div>
                    <div className="text-xs text-purple-600 mt-1">Looking for this value</div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-xs text-blue-600 font-medium">CURRENT PATH</div>
                    <div className="font-mono text-sm text-blue-800">
                      [{step.currentPath.join(' → ')}]
                    </div>
                    <div className="text-xs text-blue-600 mt-1">Path being explored</div>
                  </div>
                  
                  {(step.leftPath !== undefined || step.rightPath !== undefined) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-xs text-green-600 font-medium">CHILD PATHS</div>
                      <div className="font-mono text-xs text-green-800">
                        {step.leftPath !== undefined && <div>Left: [{step.leftPath.join(', ')}]</div>}
                        {step.rightPath !== undefined && <div>Right: [{step.rightPath.join(', ')}]</div>}
                      </div>
                      <div className="text-xs text-green-600 mt-1">Subtree results</div>
                    </div>
                  )}
                  
                  <div className={`border rounded-lg p-4 ${step.foundPath ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`text-xs font-medium ${step.foundPath ? 'text-emerald-600' : 'text-slate-600'}`}>FINAL PATH</div>
                    <div className={`font-mono text-sm ${step.foundPath ? 'text-emerald-800' : 'text-slate-800'}`}>
                      {step.foundPath ? `[${step.foundPath.join(' → ')}]` : 'Not found yet'}
                    </div>
                    <div className={`text-xs mt-1 ${step.foundPath ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {step.foundPath ? 'Root to target path' : 'Still searching...'}
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
                        {expected ? `Path: [${expected.join(' → ')}]` : 'Not Found'}
                      </div>
                    </div>
                    
                    {/* Visual Tree Representation */}
                    {input.length > 0 && (
                      <div className="bg-white rounded-lg border border-slate-200 p-3">
                        <div className="text-xs text-slate-600 mb-2 text-center">Tree Structure</div>
                        <div 
                          className="scale-75 origin-top overflow-x-auto"
                          dangerouslySetInnerHTML={{ 
                            __html: createTreeVisualization(input, -1, new Set(), [], expected, target) 
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
                  {/* Spread Operator Solution */}
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-3">📊 Spread Operator Approach</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">pathFinder</span> = <span className="text-slate-400">(</span><span className="text-orange-300">root</span>, <span className="text-orange-300">target</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">null</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> === <span className="text-orange-300">target</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-slate-400">[</span> <span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> <span className="text-slate-400">];</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">leftPath</span> = <span className="text-yellow-300">pathFinder</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span>, <span className="text-orange-300">target</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">leftPath</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-slate-400">[</span> <span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span>, <span className="text-slate-400">...</span><span className="text-yellow-300">leftPath</span><span className="text-slate-400">];</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">rightPath</span> = <span className="text-yellow-300">pathFinder</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span>, <span className="text-orange-300">target</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">rightPath</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-slate-400">[</span> <span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span>, <span className="text-slate-400">...</span><span className="text-yellow-300">rightPath</span><span className="text-slate-400">];</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-blue-400">null</span><span className="text-slate-400">;</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Push & Reverse Solution */}
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3">⚡ Push & Reverse (Optimized)</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">pathFinder</span> = <span className="text-slate-400">(</span><span className="text-orange-300">root</span>, <span className="text-orange-300">target</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">result</span> = <span className="text-yellow-300">pathFinderHelper</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span>, <span className="text-orange-300">target</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">result</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">null</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">result</span><span className="text-slate-400">.</span><span className="text-yellow-300">reverse</span><span className="text-slate-400">();</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>{'\n'}
                          {'\n'}
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">pathFinderHelper</span> = <span className="text-slate-400">(</span><span className="text-orange-300">root</span>, <span className="text-orange-300">target</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-blue-400">null</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> === <span className="text-orange-300">target</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-slate-400">[</span> <span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span> <span className="text-slate-400">];</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">leftPath</span> = <span className="text-yellow-300">pathFinderHelper</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span>, <span className="text-orange-300">target</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">leftPath</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-yellow-300">leftPath</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}<span className="text-purple-400">return</span> <span className="text-yellow-300">leftPath</span><span className="text-slate-400">;</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}<span className="text-slate-400">// similar for rightPath...</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-800 mb-2">Spread Operator</h4>
                      <div className="text-sm text-orange-700 space-y-1">
                        <div><strong>Time:</strong> O(n²) - array copying at each level</div>
                        <div><strong>Space:</strong> O(n²) - multiple array copies</div>
                        <div><strong>Readability:</strong> Very intuitive</div>
                        <div className="text-xs text-orange-600 mt-2">Simple but less efficient</div>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Push & Reverse</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <div><strong>Time:</strong> O(n) - single array operations</div>
                        <div><strong>Space:</strong> O(n) - one array reused</div>
                        <div><strong>Efficiency:</strong> Optimized for performance</div>
                        <div className="text-xs text-green-600 mt-2">More complex but faster</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Path finding demonstrates backtracking and recursive exploration</li>
                      <li>Different approaches can have significantly different time complexities</li>
                      <li>Array operations (spread vs push) matter for performance</li>
                      <li>This pattern is fundamental to many tree navigation problems</li>
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