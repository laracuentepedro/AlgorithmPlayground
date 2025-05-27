interface TestCasesProps {
  onRunTestCase: (s1: string, s2: string) => void;
}

export function TestCases({ onRunTestCase }: TestCasesProps) {
  const testCases = [
    ['restful', 'fluster', true],
    ['cats', 'tocs', false],
    ['monkeyswrite', 'newyorktimes', true],
    ['paper', 'reapa', false],
    ['elbow', 'below', true],
    ['tax', 'taxi', false],
    ['taxi', 'tax', false],
    ['night', 'thing', true],
    ['abbc', 'aabc', false],
    ['po', 'popp', false],
    ['pp', 'oo', false]
  ] as const;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
          <i className="fas fa-list-check text-indigo-600"></i>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Test Cases</h3>
      </div>

      <div className="grid gap-3">
        {testCases.map(([s1, s2, expected], index) => (
          <div
            key={index}
            onClick={() => onRunTestCase(s1, s2)}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-200"
          >
            <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap sm:flex-nowrap min-w-0">
              <code className="text-xs sm:text-sm bg-white px-2 py-1 rounded border font-mono break-all">"{s1}"</code>
              <i className="fas fa-arrows-alt-h text-slate-400 flex-shrink-0"></i>
              <code className="text-xs sm:text-sm bg-white px-2 py-1 rounded border font-mono break-all">"{s2}"</code>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mt-2 sm:mt-0 self-end sm:self-auto flex-shrink-0 ${
                expected
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {expected ? '✓' : '✗'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
