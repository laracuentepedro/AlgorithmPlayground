import { useState } from "react";
import { ProblemsSidebar } from "@/components/ProblemsSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AlgorithmStep {
  step: number;
  description: string;
  details: string;
  previousNums: Record<string, number>;
  action: 'initialize' | 'check_complement' | 'found_pair' | 'store_number';
  result?: number[];
  currentIndex: number;
  currentNum: number;
  complement: number;
  arrayProcessing: string;
  highlight?: number;
}

export function PairProductPlayground() {
  const [inputArray, setInputArray] = useState("3,2,5,4,1");
  const [targetProduct, setTargetProduct] = useState("8");
  const [result, setResult] = useState<number[] | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVisualization, setShowVisualization] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);

  const pairProductWithSteps = (numbers: number[], targetProduct: number) => {
    const steps: AlgorithmStep[] = [];
    const previousNums: Record<string, number> = {};
    
    steps.push({
      step: 1,
      description: "Initialize hash map to store seen numbers",
      details: `Looking for two numbers that multiply to ${targetProduct}`,
      previousNums: {},
      action: 'initialize',
      currentIndex: -1,
      currentNum: 0,
      complement: 0,
      arrayProcessing: numbers.map((num, idx) => `<span class="px-2 py-1 rounded border">${num}</span>`).join(' ')
    });

    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i];
      const complement = targetProduct / num;
      
      // Create visual representation with current element highlighted
      const arrayVisual = numbers.map((n, idx) => {
        if (idx < i) {
          return `<span class="px-2 py-1 rounded bg-gray-100 text-gray-600">${n}</span>`;
        } else if (idx === i) {
          return `<span class="px-2 py-1 rounded bg-blue-100 text-blue-800 font-bold">${n}</span>`;
        } else {
          return `<span class="px-2 py-1 rounded border">${n}</span>`;
        }
      }).join(' ');

      steps.push({
        step: steps.length + 1,
        description: `Processing element at index ${i}: ${num}`,
        details: `Need to find complement: ${targetProduct} ÷ ${num} = ${complement}`,
        previousNums: { ...previousNums },
        action: 'check_complement',
        currentIndex: i,
        currentNum: num,
        complement: complement,
        arrayProcessing: arrayVisual,
        highlight: i
      });

      if (complement in previousNums) {
        const complementIndex = previousNums[complement];
        const finalArrayVisual = numbers.map((n, idx) => {
          if (idx === i || idx === complementIndex) {
            return `<span class="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold">${n}</span>`;
          } else if (idx < i) {
            return `<span class="px-2 py-1 rounded bg-gray-100 text-gray-600">${n}</span>`;
          } else {
            return `<span class="px-2 py-1 rounded border">${n}</span>`;
          }
        }).join(' ');

        steps.push({
          step: steps.length + 1,
          description: `Found pair! Complement ${complement} exists at index ${complementIndex}`,
          details: `numbers[${complementIndex}] × numbers[${i}] = ${numbers[complementIndex]} × ${num} = ${targetProduct}`,
          previousNums: { ...previousNums },
          action: 'found_pair',
          result: [complementIndex, i],
          currentIndex: i,
          currentNum: num,
          complement: complement,
          arrayProcessing: finalArrayVisual,
          highlight: i
        });

        return { result: [complementIndex, i], steps };
      }

      previousNums[num] = i;

      steps.push({
        step: steps.length + 1,
        description: `Complement not found, storing ${num} at index ${i}`,
        details: `Hash map now contains: {${Object.entries(previousNums).map(([k, v]) => `${k}: ${v}`).join(', ')}}`,
        previousNums: { ...previousNums },
        action: 'store_number',
        currentIndex: i,
        currentNum: num,
        complement: complement,
        arrayProcessing: arrayVisual,
        highlight: i
      });
    }

    return { result: [], steps };
  };

  const parseArray = (input: string): number[] => {
    return input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  };

  const runAlgorithm = () => {
    const numbers = parseArray(inputArray);
    const target = parseInt(targetProduct);
    
    if (numbers.length < 2 || isNaN(target)) {
      alert('Please enter a valid array (comma-separated numbers) and target product');
      return;
    }

    const startTime = performance.now();
    const { result: indices, steps: algorithmSteps } = pairProductWithSteps(numbers, target);
    const endTime = performance.now();
    
    setResult(indices);
    setSteps(algorithmSteps);
    setCurrentStep(0);
    setExecutionTime(endTime - startTime);
    setShowVisualization(true);
  };

  const runTestCase = (testArray: number[], testTarget: number) => {
    setInputArray(testArray.join(','));
    setTargetProduct(testTarget.toString());
    
    setTimeout(() => {
      const startTime = performance.now();
      const { result: indices, steps: algorithmSteps } = pairProductWithSteps(testArray, testTarget);
      const endTime = performance.now();
      
      setResult(indices);
      setSteps(algorithmSteps);
      setCurrentStep(0);
      setExecutionTime(endTime - startTime);
      setShowVisualization(true);
    }, 100);
  };

  const resetPlayground = () => {
    setInputArray("");
    setTargetProduct("");
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setShowVisualization(false);
    setExecutionTime(0);
  };

  const testCases: [number[], number, number[]][] = [
    [[3, 2, 5, 4, 1], 8, [1, 3]],
    [[3, 2, 5, 4, 1], 10, [1, 2]],
    [[4, 7, 9, 2, 5, 1], 5, [4, 5]],
    [[4, 7, 9, 2, 5, 1], 35, [1, 4]],
    [[4, 6, 8, 2], 16, [2, 3]]
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
              <span className="hidden sm:inline text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Pair Product</span>
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
              <i className="fas fa-times text-orange-600 text-base sm:text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Pair Product</h2>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Write a function that takes an array and a target product. Return the indices of two numbers that multiply to the target. 
                There is guaranteed to be exactly one solution.
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

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="inputArray" className="block text-sm font-medium text-slate-700 mb-2">
                  Array (comma-separated)
                </Label>
                <Input
                  id="inputArray"
                  type="text"
                  value={inputArray}
                  onChange={(e) => setInputArray(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. 3,2,5,4,1"
                />
              </div>
              <div>
                <Label htmlFor="targetProduct" className="block text-sm font-medium text-slate-700 mb-2">
                  Target Product
                </Label>
                <Input
                  id="targetProduct"
                  type="number"
                  value={targetProduct}
                  onChange={(e) => setTargetProduct(e.target.value)}
                  className="font-mono"
                  placeholder="e.g. 8"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={runAlgorithm}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-play mr-2"></i>
                Find Pair Indices
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
                      Pair found at indices: [{result.join(', ')}]
                    </div>
                    <div className="text-sm opacity-75 text-emerald-700">
                      Elements: {parseArray(inputArray)[result[0]]} × {parseArray(inputArray)[result[1]]} = {targetProduct}
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
                  step.action === 'found_pair' ? 'border-emerald-400' : 'border-blue-400'
                }`}>
                  <div className="font-medium text-slate-900 mb-2">{step.description}</div>
                  <div className="text-sm text-slate-600">{step.details}</div>
                </div>
              </div>

              {/* Hash Map Visualization */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Hash Map (previousNums)</h4>
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-lg font-mono text-sm">
                  {Object.keys(step.previousNums).length === 0 ? (
                    <span className="text-slate-500">// Empty hash map</span>
                  ) : (
                    <pre>{JSON.stringify(step.previousNums, null, 2)}</pre>
                  )}
                </div>
              </div>

              {/* Array Processing Visualization */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Array Processing</h4>
                <div 
                  className="font-mono text-lg tracking-wider min-h-[3rem] flex items-center flex-wrap gap-2"
                  dangerouslySetInnerHTML={{ __html: step.arrayProcessing || '' }}
                />
              </div>

              {/* Current Analysis */}
              {step.currentIndex >= 0 && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">Current Element</h4>
                    <div className="text-sm text-orange-700">
                      <div>Index: {step.currentIndex}</div>
                      <div>Value: {step.currentNum}</div>
                      <div>Looking for: {step.complement}</div>
                    </div>
                  </div>
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                    <h4 className="font-semibold text-violet-800 mb-2">Hash Map Status</h4>
                    <div className="text-sm text-violet-700">
                      <div>Contains {Object.keys(step.previousNums).length} entries</div>
                      <div>Complement found: {step.complement in step.previousNums ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>
              )}
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
                {testCases.map(([array, target, expected], index) => (
                  <div
                    key={index}
                    onClick={() => runTestCase(array, target)}
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200"
                  >
                    <div className="flex items-center space-x-4">
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono">[{array.join(',')}]</code>
                      <span className="text-slate-400">×</span>
                      <code className="text-sm bg-white px-3 py-1 rounded border font-mono">{target}</code>
                    </div>
                    <div className="w-auto px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                      [{expected.join(', ')}]
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
                  {/* Solution Code */}
                  <div className="bg-slate-900 rounded-lg p-4 sm:p-6 overflow-x-auto">
                    <pre className="text-sm text-slate-300 font-mono">
                      <code>
                        <span className="text-blue-400">const</span> <span className="text-yellow-300">pairProduct</span> = <span className="text-slate-400">(</span><span className="text-orange-300">numbers</span><span className="text-slate-400">,</span> <span className="text-orange-300">targetProduct</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                        {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">previousNums</span> = <span className="text-slate-400">{`{}`};</span>{'\n'}
                        {'  '}{'\n'}
                        {'  '}<span className="text-purple-400">for</span> <span className="text-slate-400">(</span><span className="text-blue-400">let</span> <span className="text-yellow-300">i</span> = <span className="text-green-400">0</span><span className="text-slate-400">;</span> <span className="text-yellow-300">i</span> &lt; <span className="text-orange-300">numbers</span><span className="text-slate-400">.</span><span className="text-yellow-300">length</span><span className="text-slate-400">;</span> <span className="text-yellow-300">i</span> += <span className="text-green-400">1</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                        {'    '}<span className="text-blue-400">const</span> <span className="text-yellow-300">num</span> = <span className="text-orange-300">numbers</span><span className="text-slate-400">[</span><span className="text-yellow-300">i</span><span className="text-slate-400">];</span>{'\n'}
                        {'    '}<span className="text-blue-400">const</span> <span className="text-yellow-300">complement</span> = <span className="text-orange-300">targetProduct</span> / <span className="text-yellow-300">num</span><span className="text-slate-400">;</span>{'\n'}
                        {'    '}{'\n'}
                        {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">complement</span> <span className="text-purple-400">in</span> <span className="text-yellow-300">previousNums</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                        {'      '}<span className="text-purple-400">return</span> <span className="text-slate-400">[</span><span className="text-yellow-300">previousNums</span><span className="text-slate-400">[</span><span className="text-yellow-300">complement</span><span className="text-slate-400">],</span> <span className="text-yellow-300">i</span><span className="text-slate-400">];</span>{'\n'}
                        {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                        {'    '}{'\n'}
                        {'    '}<span className="text-yellow-300">previousNums</span><span className="text-slate-400">[</span><span className="text-yellow-300">num</span><span className="text-slate-400">] =</span> <span className="text-yellow-300">i</span><span className="text-slate-400">;</span>{'\n'}
                        {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                        <span className="text-slate-400">{`};`}</span>
                      </code>
                    </pre>
                  </div>

                  {/* Algorithm Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2">Algorithm Steps</h4>
                      <ol className="text-sm text-emerald-700 space-y-1 list-decimal list-inside">
                        <li>Initialize hash map for seen numbers</li>
                        <li>For each element, calculate complement by division</li>
                        <li>Check if complement exists in hash map</li>
                        <li>If found, return both indices</li>
                        <li>Otherwise, store current number and index</li>
                      </ol>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Complexity Analysis</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div><strong>Time:</strong> O(n) - Single pass through array</div>
                        <div><strong>Space:</strong> O(n) - Hash map storage</div>
                        <div className="text-xs text-blue-600 mt-2">n = length of input array</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Same hash map pattern as pair sum, but using division instead of subtraction</li>
                      <li>Division calculates the multiplicative complement needed</li>
                      <li>Still achieves O(1) lookup time with hash map optimization</li>
                      <li>Pattern generalizes to any binary operation with an inverse</li>
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