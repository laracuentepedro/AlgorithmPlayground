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
  action: 'initialize' | 'visit_node' | 'push_children' | 'pop_stack' | 'add_to_result' | 'complete' | 'recursive_call' | 'base_case' | 'combine_results';
  currentNode?: string | number | null;
  stack?: (string | number)[];
  result: (string | number)[];
  treeVisualization: string;
  approach: 'iterative' | 'recursive';
  recursionDepth?: number;
  leftSubtree?: (string | number)[];
  rightSubtree?: (string | number)[];
}

export function DepthFirstValuesPlayground() {
  const [inputStructure, setInputStructure] = useState("a,b,c,d,e,null,f");
  const [result, setResult] = useState<(string | number)[] | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState<'iterative' | 'recursive'>('iterative');

  const parseValue = (val: string): string | number | null => {
    if (val.toLowerCase() === 'null') return null;
    const numVal = parseFloat(val);
    return isNaN(numVal) ? val : numVal;
  };

  const createTreeVisualization = (
    structure: (string | number | null)[], 
    currentIndex: number = -1,
    visitedNodes: Set<number> = new Set(),
    stack: (string | number)[] = []
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
        label = '<div class="text-xs text-emerald-600 text-center mb-2 font-medium">✓ visited</div>';
      } else if (index === currentIndex) {
        nodeClass = 'bg-blue-100 text-blue-800 border-blue-300';
        label = '<div class="text-xs text-blue-600 text-center mb-2 font-medium">→ current</div>';
      } else if (stack.includes(value)) {
        nodeClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
        label = '<div class="text-xs text-yellow-600 text-center mb-2 font-medium">📚 in stack</div>';
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

    // Create hierarchical tree visualization for any depth
    const maxDepth = Math.floor(Math.log2(structure.length)) + 1;
    
    if (maxDepth <= 5) { // Handle trees up to 5 levels properly
      const nodes = [];
      
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
          nodes.push(`
            <div class="flex justify-center items-end gap-${gapSize} mb-8">
              ${levelNodes.join('')}
            </div>
          `);
        }
      }
      
      return `
        <div class="tree-visualization py-6 overflow-x-auto">
          <div class="min-w-fit mx-auto">
            ${nodes.join('')}
          </div>
        </div>
      `;
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
          node.left = new TreeNode(arr[i]);
          queue.push(node.left);
        } else {
          queue.push(null);
        }
        i++;
      }
      
      // Right child
      if (i < arr.length) {
        if (arr[i] !== null) {
          node.right = new TreeNode(arr[i]);
          queue.push(node.right);
        } else {
          queue.push(null);
        }
        i++;
      }
    }
    
    return root;
  };

  const depthFirstIterative = (structure: (string | number | null)[]) => {
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
        approach: 'iterative'
      });
      return { result: [], steps };
    }

    const values: (string | number)[] = [];
    const stack: TreeNode[] = [root];
    const visitedNodes = new Set<number>();
    
    // Create a mapping from node values to their indices in the structure array
    const nodeValueToIndex = new Map<string | number, number>();
    structure.forEach((val, idx) => {
      if (val !== null) {
        nodeValueToIndex.set(val, idx);
      }
    });
    
    steps.push({
      step: 1,
      description: "Initialize stack with root node",
      details: "Start DFS by pushing root onto stack. Stack works LIFO (Last In, First Out).",
      action: 'initialize',
      currentNode: root.val,
      stack: [root.val],
      result: [],
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes, [root.val]),
      approach: 'iterative'
    });

    while (stack.length > 0) {
      const node = stack.pop()!;
      const currentIndex = nodeValueToIndex.get(node.val) || 0;
      
      steps.push({
        step: steps.length + 1,
        description: `Pop node "${node.val}" from stack`,
        details: `Remove and process top node from stack. Current stack size: ${stack.length}`,
        action: 'pop_stack',
        currentNode: node.val,
        stack: stack.map(n => n.val),
        result: [...values],
        treeVisualization: createTreeVisualization(structure, currentIndex, visitedNodes, stack.map(n => n.val)),
        approach: 'iterative'
      });

      steps.push({
        step: steps.length + 1,
        description: `Visit node "${node.val}"`,
        details: `Process current node and add its value to result array`,
        action: 'visit_node',
        currentNode: node.val,
        stack: stack.map(n => n.val),
        result: [...values],
        treeVisualization: createTreeVisualization(structure, currentIndex, visitedNodes, stack.map(n => n.val)),
        approach: 'iterative'
      });

      values.push(node.val);
      visitedNodes.add(currentIndex);

      steps.push({
        step: steps.length + 1,
        description: `Add "${node.val}" to result`,
        details: `Value added to result array. Result so far: [${[...values].join(', ')}]`,
        action: 'add_to_result',
        currentNode: node.val,
        stack: stack.map(n => n.val),
        result: [...values],
        treeVisualization: createTreeVisualization(structure, currentIndex, visitedNodes, stack.map(n => n.val)),
        approach: 'iterative'
      });

      // Push children to stack (right first, then left for correct DFS order)
      if (node.right !== null || node.left !== null) {
        const childrenToPush = [];
        
        if (node.right !== null) {
          stack.push(node.right);
          childrenToPush.push(`right child "${node.right.val}"`);
        }
        
        if (node.left !== null) {
          stack.push(node.left);
          childrenToPush.push(`left child "${node.left.val}"`);
        }

        steps.push({
          step: steps.length + 1,
          description: `Push children to stack: ${childrenToPush.join(', ')}`,
          details: `Push right child first, then left child. This ensures left is processed before right (DFS order).`,
          action: 'push_children',
          currentNode: node.val,
          stack: stack.map(n => n.val),
          result: [...values],
          treeVisualization: createTreeVisualization(structure, currentIndex, visitedNodes, stack.map(n => n.val)),
          approach: 'iterative'
        });
      }
    }

    steps.push({
      step: steps.length + 1,
      description: "DFS traversal complete!",
      details: `Finished processing all nodes. Final result: [${values.join(', ')}]`,
      action: 'complete',
      stack: [],
      result: values,
      treeVisualization: createTreeVisualization(structure, -1, visitedNodes, []),
      approach: 'iterative'
    });

    return { result: values, steps };
  };

  const depthFirstRecursive = (structure: (string | number | null)[]) => {
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
        approach: 'recursive'
      });
      return { result: [], steps };
    }

    // Create a mapping from node values to their indices in the structure array
    const nodeValueToIndex = new Map<string | number, number>();
    structure.forEach((val, idx) => {
      if (val !== null) {
        nodeValueToIndex.set(val, idx);
      }
    });

    const visitedNodes = new Set<number>();

    steps.push({
      step: 1,
      description: "Starting recursive DFS traversal",
      details: "Begin depth-first search using recursive approach",
      action: 'initialize',
      result: [],
      treeVisualization: createTreeVisualization(structure, 0, visitedNodes),
      approach: 'recursive',
      recursionDepth: 0
    });

    const dfsRecursive = (node: TreeNode | null, depth: number): (string | number)[] => {
      if (node === null) {
        steps.push({
          step: steps.length + 1,
          description: `Base case: null node`,
          details: `Recursion depth ${depth}: Reached null node, return empty array`,
          action: 'base_case',
          result: [],
          treeVisualization: createTreeVisualization(structure, -1, visitedNodes),
          approach: 'recursive',
          recursionDepth: depth
        });
        return [];
      }

      const currentIndex = nodeValueToIndex.get(node.val) || 0;

      steps.push({
        step: steps.length + 1,
        description: `Recursive call for node "${node.val}"`,
        details: `Recursion depth ${depth}: Processing node "${node.val}"`,
        action: 'recursive_call',
        currentNode: node.val,
        result: [],
        treeVisualization: createTreeVisualization(structure, currentIndex, visitedNodes),
        approach: 'recursive',
        recursionDepth: depth
      });

      // Mark as visited for visualization
      visitedNodes.add(currentIndex);

      steps.push({
        step: steps.length + 1,
        description: `Visit node "${node.val}"`,
        details: `Recursion depth ${depth}: Processing current node value`,
        action: 'visit_node',
        currentNode: node.val,
        result: [],
        treeVisualization: createTreeVisualization(structure, currentIndex, visitedNodes),
        approach: 'recursive',
        recursionDepth: depth
      });

      // Get left subtree values (following exact proposed solution pattern)
      const leftValues = dfsRecursive(node.left, depth + 1);
      
      // Get right subtree values (following exact proposed solution pattern)
      const rightValues = dfsRecursive(node.right, depth + 1);

      // Combine: current node + left subtree + right subtree (exact proposed solution pattern)
      const result = [node.val, ...leftValues, ...rightValues];
      
      steps.push({
        step: steps.length + 1,
        description: `Combine results for node "${node.val}"`,
        details: `Recursion depth ${depth}: [${node.val}] + [${leftValues.join(', ')}] + [${rightValues.join(', ')}] = [${result.join(', ')}]`,
        action: 'combine_results',
        currentNode: node.val,
        result: result,
        leftSubtree: leftValues,
        rightSubtree: rightValues,
        treeVisualization: createTreeVisualization(structure, currentIndex, visitedNodes),
        approach: 'recursive',
        recursionDepth: depth
      });

      return result;
    };

    const algorithmResult = dfsRecursive(root, 0);

    steps.push({
      step: steps.length + 1,
      description: "Recursive DFS traversal complete!",
      details: `All recursive calls finished. Final result: [${algorithmResult.join(', ')}]`,
      action: 'complete',
      result: algorithmResult,
      treeVisualization: createTreeVisualization(structure, -1, visitedNodes),
      approach: 'recursive'
    });

    return { result: algorithmResult, steps };
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
    const { result: traversalResult, steps: algorithmSteps } = selectedApproach === 'iterative' 
      ? depthFirstIterative(structure)
      : depthFirstRecursive(structure);
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
      const { result: traversalResult, steps: algorithmSteps } = selectedApproach === 'iterative' 
        ? depthFirstIterative(testStructure)
        : depthFirstRecursive(testStructure);
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
    // Test 00: a(b(d,e),c(null,f)) -> [a,b,c,d,e,null,f]
    [['a', 'b', 'c', 'd', 'e', null, 'f'], ['a', 'b', 'd', 'e', 'c', 'f']],
    
    // Test 01: a(b(d,e(g,null)),c(null,f)) -> [a,b,c,d,e,null,f,null,null,g,null]
    [['a', 'b', 'c', 'd', 'e', null, 'f', null, null, 'g', null], ['a', 'b', 'd', 'e', 'g', 'c', 'f']],
    
    // Test 02: Just root 'a'
    [['a'], ['a']],
    
    // Test 03: a(null,b(null,c(null,d(null,e)))) -> Right-skewed tree
    [['a', null, 'b', null, null, null, 'c', null, null, null, null, null, null, null, 'd', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'e'], ['a', 'b', 'c', 'd', 'e']],
    
    // Test 04: Empty tree
    [[], []],
    
    // Additional test: Perfect binary tree with numbers
    [[1, 2, 3, 4, 5, 6, 7], [1, 2, 4, 5, 3, 6, 7]]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Depth First Values</span>
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
              <i className="fas fa-sitemap text-purple-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Depth First Values</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that returns all values in a binary tree using depth-first traversal. 
                This fundamental tree algorithm teaches stack-based and recursive traversal patterns that form the foundation for many tree operations.
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
                  onClick={() => setSelectedApproach('iterative')}
                  variant={selectedApproach === 'iterative' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-layer-group"></i>
                  <span>Iterative (Stack)</span>
                </Button>
                <Button
                  onClick={() => setSelectedApproach('recursive')}
                  variant={selectedApproach === 'recursive' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <i className="fas fa-recycle"></i>
                  <span>Recursive (Call Stack)</span>
                </Button>
              </div>
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

            {/* Tree Building Explainer */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                How to Build Binary Trees from Arrays
              </h4>
              <div className="text-sm text-blue-700 space-y-2">
                <p>Arrays represent trees in <strong>level-order</strong> (breadth-first) format:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Index 0:</strong> Root node</li>
                  <li><strong>Index 1:</strong> Left child of root</li>
                  <li><strong>Index 2:</strong> Right child of root</li>
                  <li><strong>Index 3:</strong> Left child of node at index 1</li>
                  <li><strong>Index 4:</strong> Right child of node at index 1</li>
                  <li><strong>Index 5:</strong> Left child of node at index 2</li>
                  <li><strong>Index 6:</strong> Right child of node at index 2</li>
                </ul>
                <p className="mt-3">
                  <strong>Formula:</strong> For node at index <em>i</em>, left child is at <em>2i+1</em>, right child is at <em>2i+2</em>
                </p>
                <p>Use <code className="bg-blue-100 px-1 rounded">"null"</code> to represent missing nodes and maintain proper tree structure.</p>
              </div>
            </div>

            {/* Live Tree Preview */}
            {inputStructure && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Live Tree Preview</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4 overflow-x-auto">
                  <div className="w-full min-w-0">
                    <div 
                      className="flex justify-center w-max mx-auto"
                      dangerouslySetInnerHTML={{ 
                        __html: createTreeVisualization(parseStructure(inputStructure)) 
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-sitemap mr-2"></i>
                Traverse Tree (DFS)
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
                      DFS Traversal Complete!
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
                  step.action === 'visit_node' ? 'border-blue-400' : 'border-purple-400'
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
                <div className="p-3 sm:p-6 bg-slate-50 rounded-lg min-h-[8rem] sm:min-h-[12rem] overflow-x-auto">
                  <div className="w-full min-w-0 flex justify-center items-center h-full">
                    <div 
                      className="w-max mx-auto"
                      dangerouslySetInnerHTML={{ __html: step.treeVisualization }}
                    />
                  </div>
                </div>
              </div>

              {/* Algorithm State */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Algorithm State</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Current Node */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-xs text-blue-600 font-medium">CURRENT NODE</div>
                    <div className="font-mono text-lg text-blue-800 font-bold">
                      {step.currentNode || 'null'}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">Being processed</div>
                  </div>

                  {selectedApproach === 'iterative' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="text-xs text-yellow-600 font-medium">STACK</div>
                      <div className="font-mono text-sm text-yellow-800">
                        [{step.stack ? step.stack.join(', ') : ''}]
                      </div>
                      <div className="text-xs text-yellow-600 mt-1">LIFO: Last In, First Out</div>
                    </div>
                  )}
                  
                  {selectedApproach === 'recursive' && step.leftSubtree !== undefined && (
                    <>
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <div className="text-xs text-indigo-600 font-medium">LEFT SUBTREE</div>
                        <div className="font-mono text-sm text-indigo-800">
                          [{step.leftSubtree.join(', ')}]
                        </div>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="text-xs text-purple-600 font-medium">RIGHT SUBTREE</div>
                        <div className="font-mono text-sm text-purple-800">
                          [{step.rightSubtree?.join(', ') || ''}]
                        </div>
                      </div>
                    </>
                  )}
                  
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

              <div className="grid gap-3 sm:gap-4">
                {testCases.map(([input, expected], caseIndex) => (
                  <div
                    key={caseIndex}
                    onClick={() => runTestCase(input)}
                    className="bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200 p-3 sm:p-4 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                      <code className="text-xs sm:text-sm bg-white px-2 sm:px-3 py-1 rounded border font-mono break-all">
                        {input.length === 0 ? 'empty tree' : input.map(v => v === null ? 'null' : v).join(',')}
                      </code>
                      <div className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-emerald-100 text-emerald-700 self-start sm:self-auto">
                        DFS: [{expected.join(', ')}]
                      </div>
                    </div>
                    
                    {/* Visual Tree Representation */}
                    <div className="bg-white rounded-lg border border-slate-200 p-2 sm:p-3 overflow-hidden">
                      <div className="text-xs text-slate-600 mb-2 text-center">Tree Structure</div>
                      <div className="w-full overflow-x-auto">
                        <div className="flex justify-center items-center min-h-[80px] sm:min-h-[120px] min-w-0">
                          <div 
                            className="scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.9] xl:scale-100 origin-center transform-gpu flex-shrink-0"
                            style={{ 
                              width: 'max-content',
                              transformOrigin: 'center center'
                            }}
                            dangerouslySetInnerHTML={{ 
                              __html: createTreeVisualization(input, -1, new Set(), []) 
                            }}
                          />
                        </div>
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
                    <h4 className="font-semibold text-emerald-800 mb-3">✅ Iterative Approach (Stack)</h4>
                    <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto mb-4">
                      <pre className="text-sm text-slate-300 font-mono">
                        <code>
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">depthFirstValues</span> = <span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-slate-400">[];</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">values</span> = <span className="text-slate-400">[];</span>{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">stack</span> = <span className="text-slate-400">[</span> <span className="text-orange-300">root</span> <span className="text-slate-400">];</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">while</span> <span className="text-slate-400">(</span><span className="text-yellow-300">stack</span><span className="text-slate-400">.</span><span className="text-yellow-300">length</span> &gt; <span className="text-green-400">0</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                          {'    '}<span className="text-blue-400">const</span> <span className="text-yellow-300">node</span> = <span className="text-yellow-300">stack</span><span className="text-slate-400">.</span><span className="text-yellow-300">pop</span><span className="text-slate-400">();</span>{'\n'}
                          {'    '}<span className="text-yellow-300">values</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span>{'\n'}
                          {'      '}<span className="text-yellow-300">stack</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span><span className="text-slate-400">);</span>{'\n'}
                          {'    '}{'\n'}
                          {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span> !== <span className="text-blue-400">null</span><span className="text-slate-400">)</span>{'\n'}
                          {'      '}<span className="text-yellow-300">stack</span><span className="text-slate-400">.</span><span className="text-yellow-300">push</span><span className="text-slate-400">(</span><span className="text-yellow-300">node</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-yellow-300">values</span><span className="text-slate-400">;</span>{'\n'}
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
                          <span className="text-blue-400">const</span> <span className="text-yellow-300">depthFirstValues</span> = <span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                          {'  '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-orange-300">root</span> === <span className="text-blue-400">null</span><span className="text-slate-400">)</span> <span className="text-purple-400">return</span> <span className="text-slate-400">[];</span>{'\n'}
                          {'  '}{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">leftValues</span> = <span className="text-yellow-300">depthFirstValues</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">left</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">rightValues</span> = <span className="text-yellow-300">depthFirstValues</span><span className="text-slate-400">(</span><span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">right</span><span className="text-slate-400">);</span>{'\n'}
                          {'  '}<span className="text-purple-400">return</span> <span className="text-slate-400">[</span> <span className="text-orange-300">root</span><span className="text-slate-400">.</span><span className="text-yellow-300">val</span><span className="text-slate-400">, ...</span><span className="text-yellow-300">leftValues</span><span className="text-slate-400">, ...</span><span className="text-yellow-300">rightValues</span> <span className="text-slate-400">];</span>{'\n'}
                          <span className="text-slate-400">{`};`}</span>
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2">Iterative (Stack)</h4>
                      <div className="text-sm text-emerald-700 space-y-1">
                        <div><strong>Time:</strong> O(n) - Visit each node once</div>
                        <div><strong>Space:</strong> O(h) - Stack height ≤ tree height</div>
                        <div className="text-xs text-emerald-600 mt-2">Uses explicit stack data structure</div>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Recursive (Call Stack)</h4>
                      <div className="text-sm text-purple-700 space-y-1">
                        <div><strong>Time:</strong> O(n²) - Array concatenation</div>
                        <div><strong>Space:</strong> O(n) - Call stack + arrays</div>
                        <div className="text-xs text-purple-600 mt-2">Uses implicit call stack</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>DFS explores as deep as possible before backtracking</li>
                      <li>Push right child first, then left child for correct order</li>
                      <li>Stack simulates the recursive call pattern</li>
                      <li>Pre-order traversal: root → left → right</li>
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