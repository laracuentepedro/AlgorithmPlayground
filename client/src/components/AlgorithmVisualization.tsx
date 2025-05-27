import { Button } from "@/components/ui/button";
import { AlgorithmStep } from "@/pages/anagrams";

interface AlgorithmVisualizationProps {
  steps: AlgorithmStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function AlgorithmVisualization({ steps, currentStep, onStepChange }: AlgorithmVisualizationProps) {
  const step = steps[currentStep];

  const previousStep = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    }
  };

  return (
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
        <div
          className={`bg-slate-50 rounded-lg p-4 border-l-4 ${
            step.action === 'success' ? 'border-emerald-400' :
            step.action === 'not_found' || step.action === 'non_zero' ? 'border-red-400' :
            'border-blue-400'
          }`}
        >
          <div className="font-medium text-slate-900 mb-2">{step.description}</div>
          <div className="text-sm text-slate-600">{step.details}</div>
        </div>
      </div>

      {/* Character Count Visualization */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Character Count Object</h4>
        <div className="bg-slate-900 text-emerald-400 p-4 rounded-lg font-mono text-sm">
          {Object.keys(step.count).length === 0 ? (
            <span className="text-slate-500">// Empty count object</span>
          ) : (
            <pre>{JSON.stringify(step.count, null, 2)}</pre>
          )}
        </div>
      </div>

      {/* String Processing Visualization */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">String 1 Processing</h4>
          <div 
            className="font-mono text-lg tracking-wider min-h-[2rem] flex items-center"
            dangerouslySetInnerHTML={{ __html: step.s1Processing || '' }}
          />
        </div>
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">String 2 Processing</h4>
          <div 
            className="font-mono text-lg tracking-wider min-h-[2rem] flex items-center"
            dangerouslySetInnerHTML={{ __html: step.s2Processing || '' }}
          />
        </div>
      </div>
    </div>
  );
}
