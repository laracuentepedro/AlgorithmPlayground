import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AnagramsPlaygroundProps {
  string1: string;
  string2: string;
  result: boolean | null;
  executionTime: number;
  onString1Change: (value: string) => void;
  onString2Change: (value: string) => void;
  onRunAlgorithm: () => void;
  onReset: () => void;
}

export function AnagramsPlayground({
  string1,
  string2,
  result,
  executionTime,
  onString1Change,
  onString2Change,
  onRunAlgorithm,
  onReset
}: AnagramsPlaygroundProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
          <i className="fas fa-play text-emerald-600"></i>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Interactive Testing</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="string1" className="block text-sm font-medium text-slate-700 mb-2">
            First String
          </Label>
          <Input
            id="string1"
            type="text"
            value={string1}
            onChange={(e) => onString1Change(e.target.value)}
            className="font-mono"
            placeholder="Enter first string"
          />
        </div>
        <div>
          <Label htmlFor="string2" className="block text-sm font-medium text-slate-700 mb-2">
            Second String
          </Label>
          <Input
            id="string2"
            type="text"
            value={string2}
            onChange={(e) => onString2Change(e.target.value)}
            className="font-mono"
            placeholder="Enter second string"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <Button
          onClick={onRunAlgorithm}
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
        >
          <i className="fas fa-play mr-2"></i>
          Run Algorithm
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="px-6"
        >
          <i className="fas fa-undo"></i>
        </Button>
      </div>

      {/* Result Display */}
      {result !== null && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg border-l-4 flex items-center space-x-3 ${
              result
                ? 'border-emerald-400 bg-emerald-50 animate-pulse-success'
                : 'border-red-400 bg-red-50 animate-pulse-error'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                result
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              <i className={`fas ${result ? 'fa-check' : 'fa-times'}`}></i>
            </div>
            <div>
              <div
                className={`font-semibold ${
                  result ? 'text-emerald-800' : 'text-red-800'
                }`}
              >
                {result ? '✓ ANAGRAMS' : '✗ NOT ANAGRAMS'}
              </div>
              <div
                className={`text-sm opacity-75 ${
                  result ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                "{string1}" and "{string2}" {result ? 'contain the same characters' : 'have different character compositions'}
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
  );
}
