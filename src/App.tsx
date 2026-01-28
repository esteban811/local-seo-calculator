import { useState } from 'react';
import Calculator from './components/Calculator';
import Results from './components/Results';
import { CalculatorInput, CalculatorResult } from './types/calculator';
import { calculateROI } from './services/calculatorService';

const LOGO_URL = 'https://makariosmarketing.com/wp-content/uploads/2025/04/Makarios-01.png';

function App() {
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleCalculate = (input: CalculatorInput) => {
    const calculationResult = calculateROI(input);
    setResult(calculationResult);
    // Scroll to top when showing results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={LOGO_URL} 
              alt="Makarios Marketing" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-makarios-dark mb-2">
            Local SEO ROI Calculator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover your potential return on investment from local SEO. 
            Enter your business details below to see realistic projections for your market.
          </p>
        </div>

        {/* Main Card */}
        <div className="card">
          {result ? (
            <Results result={result} onReset={handleReset} />
          ) : (
            <Calculator onCalculate={handleCalculate} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Powered by <span className="text-makarios-green font-semibold">Makarios Marketing</span>
          </p>
          <p className="mt-1">
            Helping home service businesses achieve predictable, long-term growth through SEO and AI.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
