import { CalculatorResult } from '../types/calculator';
import { BOOKING_URL } from '../services/constants';

interface ResultsProps {
  result: CalculatorResult;
  onReset: () => void;
}

export default function Results({ result, onReset }: ResultsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Calculate break-even month for conservative
  const conservativeBreakEvenMonth = result.conservative.additionalMonthlyRevenue > 0
    ? Math.ceil(result.roiAnalysis.totalInvestment / result.conservative.additionalMonthlyRevenue)
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-makarios-dark mb-2">
          Your Personalized ROI Projections
        </h2>
        <p className="text-gray-600">
          {result.input.serviceType} in {result.input.cityName}
        </p>
      </div>

      {/* ============================================ */}
      {/* EXECUTIVE SUMMARY - THE BOTTOM LINE */}
      {/* ============================================ */}
      <div className="bg-gradient-to-r from-makarios-dark to-makarios-green rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-4 text-center">📊 The Bottom Line</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-white/70 text-sm">Annual Investment</p>
            <p className="text-2xl font-bold">{formatCurrency(result.totalAnnualInvestment)}</p>
          </div>
          <div>
            <p className="text-white/70 text-sm">Projected Annual Return</p>
            <p className="text-2xl font-bold">{formatCurrency(result.moderate.additionalAnnualRevenue)}</p>
          </div>
          <div>
            <p className="text-white/70 text-sm">12-Month ROI</p>
            <p className={`text-2xl font-bold ${result.roiAnalysis.moderateROI >= 0 ? 'text-makarios-lime' : 'text-red-300'}`}>
              {result.roiAnalysis.moderateROI >= 0 ? '+' : ''}{result.roiAnalysis.moderateROI.toFixed(0)}%
            </p>
          </div>
        </div>
        {result.roiAnalysis.moderateROI >= 100 && (
          <p className="text-center mt-4 text-white/90 text-sm">
            For every $1 invested, you could generate ${((result.roiAnalysis.moderateROI / 100) + 1).toFixed(2)} in return
          </p>
        )}
      </div>

      {/* ============================================ */}
      {/* SECTION 1: CURRENT PERFORMANCE SNAPSHOT */}
      {/* ============================================ */}
      <div className="results-card">
        <h3 className="section-header">Current Performance Snapshot</h3>
        
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-makarios-dark mb-3">Your Current Local Search Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Estimated Monthly Searches:</p>
              <p className="font-semibold">{formatNumber(result.currentPerformance.estimatedMonthlySearches)}</p>
            </div>
            <div>
              <p className="text-gray-500">Estimated Clicks from Volume:</p>
              <p className="font-semibold">{formatNumber(result.currentPerformance.estimatedMonthlyClicks)}</p>
            </div>
            <div>
              <p className="text-gray-500">Estimated Leads from Volume:</p>
              <p className="font-semibold">{formatNumber(result.currentPerformance.estimatedMonthlyLeads)}</p>
            </div>
            <div>
              <p className="text-gray-500">Actual Current Jobs from Local Search (User Input):</p>
              <p className="font-semibold">{result.currentPerformance.currentJobsFromSearch} jobs</p>
            </div>
            <div>
              <p className="text-gray-500">Estimated Jobs from Market Potential:</p>
              <p className="font-semibold">{result.currentPerformance.estimatedJobsFromMarket} jobs</p>
            </div>
            <div>
              <p className="text-gray-500">Actual Current Monthly Revenue from Local Search (User Input):</p>
              <p className="font-semibold">{formatCurrency(result.currentPerformance.currentMonthlyRevenue)}</p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 italic text-sm">
          {result.currentPerformance.insight}
        </p>
      </div>

      {/* ============================================ */}
      {/* SECTION 2: PROJECTED GROWTH SCENARIOS */}
      {/* ============================================ */}
      <div>
        <h3 className="section-header mb-4">Projected Growth Scenarios</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Conservative */}
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-makarios-dark">
            <h4 className="text-lg font-bold text-makarios-dark mb-1">Conservative Projection (6 Months)</h4>
            <div className="space-y-2 text-sm mb-4">
              <p><span className="text-gray-500">Target GMB Position:</span> <span className="font-semibold">{result.conservative.targetPosition}</span></p>
              <p><span className="text-gray-500">Projected Monthly Clicks:</span> <span className="font-semibold">{formatNumber(result.conservative.projectedMonthlyClicks)}</span></p>
              <p><span className="text-gray-500">Projected Monthly Leads:</span> <span className="font-semibold">{formatNumber(result.conservative.projectedMonthlyLeads)}</span></p>
              <p><span className="text-gray-500">Projected Monthly Jobs:</span> <span className="font-semibold">{result.conservative.projectedMonthlyJobs} jobs</span></p>
              <p><span className="text-gray-500">Additional Monthly Jobs:</span> <span className="font-semibold">{result.conservative.additionalMonthlyJobs} jobs</span></p>
              <p><span className="text-gray-500">Additional Monthly Revenue:</span> <span className="font-semibold">{formatCurrency(result.conservative.additionalMonthlyRevenue)}</span></p>
              <p><span className="text-gray-500">Additional Annual Revenue:</span> <span className="font-semibold">{formatCurrency(result.conservative.additionalAnnualRevenue)}</span></p>
            </div>
            <p className="text-gray-600 italic text-sm border-t pt-3">
              {result.conservative.insight}
            </p>
          </div>

          {/* Moderate */}
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-makarios-green">
            <h4 className="text-lg font-bold text-makarios-green mb-1">Moderate Projection (12 Months)</h4>
            <div className="space-y-2 text-sm mb-4">
              <p><span className="text-gray-500">Target GMB Position:</span> <span className="font-semibold">{result.moderate.targetPosition}</span></p>
              <p><span className="text-gray-500">Projected Monthly Clicks:</span> <span className="font-semibold">{formatNumber(result.moderate.projectedMonthlyClicks)}</span></p>
              <p><span className="text-gray-500">Projected Monthly Leads:</span> <span className="font-semibold">{formatNumber(result.moderate.projectedMonthlyLeads)}</span></p>
              <p><span className="text-gray-500">Projected Monthly Jobs:</span> <span className="font-semibold">{result.moderate.projectedMonthlyJobs} jobs</span></p>
              <p><span className="text-gray-500">Additional Monthly Jobs:</span> <span className="font-semibold text-makarios-green">{result.moderate.additionalMonthlyJobs} jobs</span></p>
              <p><span className="text-gray-500">Additional Monthly Revenue:</span> <span className="font-semibold text-makarios-green">{formatCurrency(result.moderate.additionalMonthlyRevenue)}</span></p>
              <p><span className="text-gray-500">Additional Annual Revenue:</span> <span className="font-semibold text-makarios-green">{formatCurrency(result.moderate.additionalAnnualRevenue)}</span></p>
            </div>
            <p className="text-gray-600 italic text-sm border-t pt-3">
              {result.moderate.insight}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECTION 3: ROI & PAYBACK ANALYSIS */}
      {/* ============================================ */}
      <div className="results-card">
        <h3 className="section-header">ROI & Payback Analysis</h3>
        
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-makarios-dark mb-3">Investment Return</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total 12-Month SEO Investment:</p>
              <p className="font-semibold">{formatCurrency(result.roiAnalysis.totalInvestment)}</p>
            </div>
            
            {/* Conservative - Show progress instead of negative ROI */}
            <div>
              <p className="text-gray-500">Conservative (6-Month Progress):</p>
              {conservativeBreakEvenMonth && conservativeBreakEvenMonth <= 18 ? (
                <p className="font-semibold text-makarios-green">
                  On track for positive ROI by month {conservativeBreakEvenMonth}
                </p>
              ) : (
                <p className="font-semibold text-amber-600">
                  Building foundation for long-term growth
                </p>
              )}
            </div>
            <div>
              <p className="text-gray-500">Conservative Payback Period:</p>
              <p className="font-semibold">
                {result.roiAnalysis.conservativePayback ? `${result.roiAnalysis.conservativePayback} months` : 'N/A'}
              </p>
            </div>
            
            {/* Moderate - Show actual ROI */}
            <div>
              <p className="text-gray-500">Moderate ROI (12 Months):</p>
              <p className={`font-semibold text-lg ${result.roiAnalysis.moderateROI >= 0 ? 'text-makarios-green' : 'text-red-600'}`}>
                {result.roiAnalysis.moderateROI >= 0 ? '+' : ''}{result.roiAnalysis.moderateROI.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-gray-500">Moderate Payback Period:</p>
              <p className="font-semibold">
                {result.roiAnalysis.moderatePayback ? `${result.roiAnalysis.moderatePayback} months` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 italic text-sm">
          {result.roiAnalysis.insight}
        </p>
      </div>

      {/* ============================================ */}
      {/* SECTION 4: SEO VS PAID ADVERTISING */}
      {/* ============================================ */}
      <div className="results-card">
        <h3 className="section-header">SEO vs. Paid Advertising</h3>
        
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-makarios-dark mb-3">Cost Comparison</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Estimated Cost Per Click (CPC):</p>
              <p className="font-semibold">{formatCurrency(result.paidAdsComparison.cpcForService)}</p>
            </div>
            <div>
              <p className="text-gray-500">Estimated Cost Per Lead (CPL):</p>
              <p className="font-semibold">{formatCurrency(result.paidAdsComparison.cplForService)}</p>
            </div>
            <div>
              <p className="text-gray-500">Monthly Paid Ads Cost for Equivalent Leads:</p>
              <p className="font-semibold">{formatCurrency(result.paidAdsComparison.monthlyPaidAdsCost)}</p>
            </div>
            <div>
              <p className="text-gray-500">Cost Efficiency Advantage:</p>
              <p className="font-semibold text-makarios-green">{Math.abs(result.paidAdsComparison.costEfficiencyAdvantage).toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 italic text-sm">
          {result.paidAdsComparison.insight}
        </p>
      </div>

      {/* ============================================ */}
      {/* SECTION 5: PROJECTED TIMELINE BREAKDOWN */}
      {/* ============================================ */}
      <div className="results-card">
        <h3 className="section-header">Projected Timeline Breakdown (Moderate Scenario)</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Months 1-3 */}
          <div className="bg-white rounded-lg p-4 border-l-4 border-gray-300">
            <h4 className="font-semibold text-makarios-dark mb-2">Months 1-3 (Foundation Phase)</h4>
            <p className="text-sm mb-2">
              <span className="text-gray-500">Additional Monthly Revenue:</span>{' '}
              <span className="font-semibold">{formatCurrency(result.timelineBreakdown.months1to3.additionalMonthlyRevenue)}</span>
            </p>
            <p className="text-gray-600 text-sm italic">
              {result.timelineBreakdown.months1to3.insight}
            </p>
          </div>

          {/* Months 4-6 */}
          <div className="bg-white rounded-lg p-4 border-l-4 border-makarios-lime">
            <h4 className="font-semibold text-makarios-dark mb-2">Months 4-6 (Early Results Phase)</h4>
            <p className="text-sm mb-2">
              <span className="text-gray-500">Additional Monthly Revenue:</span>{' '}
              <span className="font-semibold">{formatCurrency(result.timelineBreakdown.months4to6.additionalMonthlyRevenue)}</span>
            </p>
            <p className="text-gray-600 text-sm italic">
              {result.timelineBreakdown.months4to6.insight}
            </p>
          </div>

          {/* Months 7-12 */}
          <div className="bg-white rounded-lg p-4 border-l-4 border-makarios-green">
            <h4 className="font-semibold text-makarios-dark mb-2">Months 7-12 (Full Maturity Phase)</h4>
            <p className="text-sm mb-2">
              <span className="text-gray-500">Additional Monthly Revenue:</span>{' '}
              <span className="font-semibold text-makarios-green">{formatCurrency(result.timelineBreakdown.months7to12.additionalMonthlyRevenue)}</span>
            </p>
            <p className="text-gray-600 text-sm italic">
              {result.timelineBreakdown.months7to12.insight}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECTION 6: KEY STRATEGIC INSIGHTS */}
      {/* ============================================ */}
      <div className="results-card">
        <h3 className="section-header">Key Strategic Insights</h3>
        <ul className="space-y-3">
          {result.keyInsights.map((insight, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-makarios-green font-bold">•</span>
              <span className="text-gray-700 text-sm">{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ============================================ */}
      {/* SECTION 7: STRATEGIC RECOMMENDATIONS */}
      {/* ============================================ */}
      <div className={`rounded-xl p-6 ${result.showStrategicRecommendations ? 'bg-amber-50 border border-amber-200' : 'results-card'}`}>
        <h3 className="section-header">Strategic Recommendations for Your Market</h3>
        
        <p className="text-gray-700 mb-4 text-sm">
          Based on your market conditions (approximately {formatNumber(result.currentPerformance.estimatedMonthlySearches)} monthly searches for {result.input.serviceType} in {result.input.cityName}), here's how to maximize your marketing investment:
        </p>
        
        <div className="space-y-4">
          {result.strategicRecommendations.map((rec, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-makarios-green">
              <h4 className="font-semibold text-makarios-dark mb-2">{index + 1}. {rec.title}</h4>
              <p className="text-gray-700 text-sm mb-2">{rec.description}</p>
              {rec.details && (
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {rec.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* CTA SECTION */}
      {/* ============================================ */}
      <div className="bg-gradient-to-r from-makarios-dark to-makarios-green rounded-xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Schedule a Free Strategy Session with Makarios</h3>
        <p className="mb-6 opacity-90">
          Let our team help you design a multi-channel marketing strategy optimized for your specific market conditions. We'll analyze your current performance and recommend the most cost-effective mix of tactics to drive qualified leads.
        </p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-makarios-dark font-semibold py-3 px-8 rounded-lg hover:bg-makarios-lime transition-colors"
        >
          Schedule Free Consultation
        </a>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center">
        These projections are based on industry benchmarks and average performance data. Actual results may vary based on local competition, review velocity, website quality, NAP consistency, and ongoing optimization efforts. Past performance does not guarantee future results.
      </p>

      {/* Reset Button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="text-makarios-green hover:text-makarios-dark font-medium transition-colors"
        >
          ← Calculate Another Scenario
        </button>
      </div>
    </div>
  );
}
