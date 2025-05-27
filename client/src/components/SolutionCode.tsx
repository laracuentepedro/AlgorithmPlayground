import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SolutionCode() {
  const [showSolution, setShowSolution] = useState(false);

  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-code text-amber-600"></i>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Solution Implementation</h3>
        </div>
        <Button
          onClick={toggleSolution}
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
                <span className="text-blue-400">const</span> <span className="text-yellow-300">anagrams</span> = <span className="text-slate-400">(</span><span className="text-orange-300">s1</span><span className="text-slate-400">,</span> <span className="text-orange-300">s2</span><span className="text-slate-400">) =&gt; {`{`}</span>{'\n'}
                {'  '}<span className="text-blue-400">const</span> <span className="text-yellow-300">count</span> = <span className="text-slate-400">{`{}`};</span>{'\n'}
                {'  '}{'\n'}
                {'  '}<span className="text-gray-500">// Count characters in first string</span>{'\n'}
                {'  '}<span className="text-purple-400">for</span> <span className="text-slate-400">(</span><span className="text-blue-400">let</span> <span className="text-yellow-300">char</span> <span className="text-purple-400">of</span> <span className="text-orange-300">s1</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(!(</span><span className="text-yellow-300">char</span> <span className="text-purple-400">in</span> <span className="text-yellow-300">count</span><span className="text-slate-400">)) {`{`}</span>{'\n'}
                {'      '}<span className="text-yellow-300">count</span><span className="text-slate-400">[</span><span className="text-yellow-300">char</span><span className="text-slate-400">] =</span> <span className="text-green-400">0</span><span className="text-slate-400">;</span>{'\n'}
                {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                {'    '}<span className="text-yellow-300">count</span><span className="text-slate-400">[</span><span className="text-yellow-300">char</span><span className="text-slate-400">] +=</span> <span className="text-green-400">1</span><span className="text-slate-400">;</span>{'\n'}
                {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                {'\n'}
                {'  '}<span className="text-gray-500">// Process second string</span>{'\n'}
                {'  '}<span className="text-purple-400">for</span> <span className="text-slate-400">(</span><span className="text-blue-400">let</span> <span className="text-yellow-300">char</span> <span className="text-purple-400">of</span> <span className="text-orange-300">s2</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">count</span><span className="text-slate-400">[</span><span className="text-yellow-300">char</span><span className="text-slate-400">] ===</span> <span className="text-blue-400">undefined</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                {'      '}<span className="text-purple-400">return</span> <span className="text-red-400">false</span><span className="text-slate-400">;</span>{'\n'}
                {'    '}<span className="text-slate-400">{`} else {`}</span>{'\n'}
                {'      '}<span className="text-yellow-300">count</span><span className="text-slate-400">[</span><span className="text-yellow-300">char</span><span className="text-slate-400">] -=</span> <span className="text-green-400">1</span><span className="text-slate-400">;</span>{'\n'}
                {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                {'\n'}
                {'  '}<span className="text-gray-500">// Check if all counts are zero</span>{'\n'}
                {'  '}<span className="text-purple-400">for</span> <span className="text-slate-400">(</span><span className="text-blue-400">let</span> <span className="text-yellow-300">char</span> <span className="text-purple-400">in</span> <span className="text-yellow-300">count</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                {'    '}<span className="text-purple-400">if</span> <span className="text-slate-400">(</span><span className="text-yellow-300">count</span><span className="text-slate-400">[</span><span className="text-yellow-300">char</span><span className="text-slate-400">] !==</span> <span className="text-green-400">0</span><span className="text-slate-400">) {`{`}</span>{'\n'}
                {'      '}<span className="text-purple-400">return</span> <span className="text-red-400">false</span><span className="text-slate-400">;</span>{'\n'}
                {'    '}<span className="text-slate-400">{`}`}</span>{'\n'}
                {'  '}<span className="text-slate-400">{`}`}</span>{'\n'}
                {'\n'}
                {'  '}<span className="text-purple-400">return</span> <span className="text-green-400">true</span><span className="text-slate-400">;</span>{'\n'}
                <span className="text-slate-400">{`};`}</span>
              </code>
            </pre>
          </div>

          {/* Algorithm Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h4 className="font-semibold text-emerald-800 mb-2">Algorithm Steps</h4>
              <ol className="text-sm text-emerald-700 space-y-1 list-decimal list-inside">
                <li>Initialize character count object</li>
                <li>Count all characters in first string</li>
                <li>Decrement counts for second string characters</li>
                <li>Return false if character not found</li>
                <li>Verify all counts are zero</li>
              </ol>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Complexity Analysis</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div><strong>Time:</strong> O(n + m) - Single pass through both strings</div>
                <div><strong>Space:</strong> O(n) - Character count object</div>
                <div className="text-xs text-blue-600 mt-2">n = length of string 1, m = length of string 2</div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Key Insights</h4>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>This approach is more efficient than sorting both strings (which would be O(n log n))</li>
              <li>Early termination when a character is not found saves computation time</li>
              <li>Hash table provides O(1) average case lookup and update operations</li>
              <li>The final zero-check ensures both strings have exactly the same character frequencies</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
