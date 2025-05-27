export function Sidebar() {
  const problems = [
    { name: "Anagrams", active: true, completed: false },
    { name: "Two Sum", active: false, completed: false },
    { name: "Valid Parentheses", active: false, completed: false },
    { name: "Binary Search", active: false, completed: false },
  ];

  const relatedProblems = [
    { name: "Group Anagrams", description: "Categorize strings by anagram groups" },
    { name: "Valid Anagram", description: "Check if two strings are anagrams" },
    { name: "Find All Anagrams", description: "Find all anagram substrings in text" },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Problems</h2>
        <nav className="space-y-2">
          {problems.map((problem, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                problem.active
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={`fas ${problem.active ? 'fa-play-circle' : 'fa-circle'} text-sm ${
                problem.active ? '' : 'text-slate-300'
              }`}></i>
              <span className={problem.active ? 'font-medium' : ''}>{problem.name}</span>
            </div>
          ))}
        </nav>
        
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Difficulty</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">Easy</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Time Complexity</span>
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">O(n + m)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Space Complexity</span>
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">O(n)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-lightbulb text-rose-600"></i>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Key Insights</h3>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700">Character frequency counting is a fundamental pattern in string problems</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700">Hash maps provide O(1) lookup time for character existence checks</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700">Early returns optimize performance when mismatch is detected</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700">Final verification ensures all characters are perfectly balanced</p>
          </div>
        </div>
      </div>

      {/* Related Problems */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-link text-teal-600"></i>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Related Problems</h3>
        </div>

        <div className="space-y-3">
          {relatedProblems.map((problem, index) => (
            <a
              key={index}
              href="#"
              className="block p-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-slate-900 text-sm">{problem.name}</div>
              <div className="text-xs text-slate-600 mt-1">{problem.description}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
