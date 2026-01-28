import {
  CalculatorInput,
  CalculatorResult,
  CurrentPerformance,
  ProjectionResult,
  PaidAdsComparison,
  TimelineBreakdown,
  ROIAnalysis,
  StrategicRecommendation,
  GMBPosition,
} from '../types/calculator';

import {
  SEARCH_VOLUME_FACTORS,
  POPULATION_MULTIPLIERS,
  POSITION_CTR,
  CLICK_TO_LEAD_RATES,
  LEAD_TO_JOB_RATES,
  CONSERVATIVE_TARGET_POSITIONS,
  MODERATE_TARGET_POSITIONS,
  CONSERVATIVE_MARKET_SHARE,
  MODERATE_MARKET_SHARE,
  MINIMUM_GROWTH_CONSERVATIVE,
  MINIMUM_GROWTH_MODERATE,
  ANNUAL_REVENUE_MULTIPLIER,
  HIGH_TICKET_THRESHOLD,
  HIGH_TICKET_MULTIPLIER,
  TIER_1_ADJUSTMENT,
  MIN_PAYBACK_CONSERVATIVE,
  MIN_PAYBACK_MODERATE,
  CPC_BY_SERVICE,
  LOW_ROI_THRESHOLD,
} from './constants';

export function calculateROI(input: CalculatorInput): CalculatorResult {
  // Step 1: Calculate Monthly Search Volume
  const baseSearchVolume = SEARCH_VOLUME_FACTORS[input.serviceType];
  const populationMultiplier = POPULATION_MULTIPLIERS[input.population];
  const monthlySearchVolume = baseSearchVolume * populationMultiplier;

  // Step 2: Calculate Current Performance
  const currentPerformance = calculateCurrentPerformance(input, monthlySearchVolume);

  // Step 3: Calculate performance multiplier (how much user outperforms market)
  const marketEstimateJobs = calculateMarketJobs(
    monthlySearchVolume,
    input.currentGMBPosition,
    input.serviceType,
    input.population
  );
  
  const performanceMultiplier = marketEstimateJobs > 0 
    ? currentPerformance.currentJobsFromSearch / marketEstimateJobs 
    : 1.0;

  // Step 4: Calculate Conservative Projection
  const conservative = calculateProjection(
    input,
    monthlySearchVolume,
    currentPerformance,
    performanceMultiplier,
    'conservative'
  );

  // Step 5: Calculate Moderate Projection
  const moderate = calculateProjection(
    input,
    monthlySearchVolume,
    currentPerformance,
    performanceMultiplier,
    'moderate'
  );

  // Step 6: Calculate ROI Analysis
  const roiAnalysis = calculateROIAnalysis(input, conservative, moderate);

  // Step 7: Calculate Paid Ads Comparison
  const paidAdsComparison = calculatePaidAdsComparison(input, moderate);

  // Step 8: Calculate Timeline Breakdown
  const timelineBreakdown = calculateTimelineBreakdown(moderate);

  // Step 9: Generate Key Insights
  const keyInsights = generateKeyInsights(input, currentPerformance, conservative, moderate, performanceMultiplier);

  // Step 10: Generate Strategic Recommendations
  const strategicRecommendations = generateStrategicRecommendations(input, moderate, monthlySearchVolume);

  // Step 11: Determine if strategic recommendations should show prominently
  const showStrategicRecommendations = moderate.roi < LOW_ROI_THRESHOLD;

  return {
    input,
    currentPerformance,
    conservative,
    moderate,
    roiAnalysis,
    paidAdsComparison,
    timelineBreakdown,
    keyInsights,
    strategicRecommendations,
    showStrategicRecommendations,
    totalAnnualInvestment: input.monthlyInvestment * 12,
    performanceMultiplier: Math.round(performanceMultiplier * 10) / 10,
  };
}

function calculateCurrentPerformance(
  input: CalculatorInput,
  monthlySearchVolume: number
): CurrentPerformance {
  const currentCTR = POSITION_CTR[input.currentGMBPosition];
  let currentClicks = (monthlySearchVolume / 1000) * currentCTR;
  
  // Apply Tier 1 adjustment for large cities
  if (input.population === '1M+') {
    currentClicks *= TIER_1_ADJUSTMENT;
  }

  const clickToLeadRate = CLICK_TO_LEAD_RATES[input.serviceType];
  const leadToJobRate = LEAD_TO_JOB_RATES[input.serviceType];
  
  const currentLeads = currentClicks * clickToLeadRate;
  
  // Use actual user input for current jobs from search
  const currentJobsFromSearch = Math.round(input.monthlyJobs * (input.localSearchPercentage / 100));
  const currentMonthlyRevenue = currentJobsFromSearch * input.averageTicket;

  // Calculate market estimate
  const estimatedJobsFromMarket = Math.round(currentClicks * clickToLeadRate * leadToJobRate);

  // Calculate market share
  const marketSharePercentage = estimatedJobsFromMarket > 0 
    ? (currentJobsFromSearch / estimatedJobsFromMarket) * 100 
    : 0;

  // Generate insight - handle cases where user outperforms market expectations
  let insight = '';
  if (marketSharePercentage > 100) {
    const outperformMultiple = (marketSharePercentage / 100).toFixed(1);
    insight = `Based on your input, your business currently acquires ${currentJobsFromSearch} jobs and $${currentMonthlyRevenue.toLocaleString()} in revenue monthly from local search. Impressive: Your business is outperforming market benchmarks by ${outperformMultiple}x at your current GMB position of ${input.currentGMBPosition}. This strong performance has been factored into our projections.`;
  } else {
    insight = `Based on your input, your business currently acquires ${currentJobsFromSearch} jobs and $${currentMonthlyRevenue.toLocaleString()} in revenue monthly from local search. Based on your current GMB position of ${input.currentGMBPosition}, you are currently capturing approximately ${Math.round(marketSharePercentage)}% of the available local search opportunity in your market.`;
  }

  return {
    estimatedMonthlySearches: Math.round(monthlySearchVolume),
    estimatedMonthlyClicks: Math.round(currentClicks),
    estimatedMonthlyLeads: Math.round(currentLeads),
    currentJobsFromSearch,
    currentMonthlyRevenue,
    marketSharePercentage: Math.round(marketSharePercentage * 10) / 10,
    estimatedJobsFromMarket,
    insight,
  };
}

function calculateMarketJobs(
  monthlySearchVolume: number,
  position: GMBPosition,
  serviceType: CalculatorInput['serviceType'],
  population: CalculatorInput['population']
): number {
  const ctr = POSITION_CTR[position];
  let clicks = (monthlySearchVolume / 1000) * ctr;
  
  if (population === '1M+') {
    clicks *= TIER_1_ADJUSTMENT;
  }

  const leads = clicks * CLICK_TO_LEAD_RATES[serviceType];
  const jobs = leads * LEAD_TO_JOB_RATES[serviceType];
  
  return jobs;
}

function calculateProjection(
  input: CalculatorInput,
  monthlySearchVolume: number,
  currentPerformance: CurrentPerformance,
  performanceMultiplier: number,
  type: 'conservative' | 'moderate'
): ProjectionResult {
  const isConservative = type === 'conservative';
  
  // Determine target position
  const targetPosition = isConservative 
    ? CONSERVATIVE_TARGET_POSITIONS[input.currentGMBPosition]
    : MODERATE_TARGET_POSITIONS[input.currentGMBPosition];

  // Calculate projected clicks at target position
  const targetCTR = POSITION_CTR[targetPosition];
  let projectedClicks = (monthlySearchVolume / 1000) * targetCTR;
  
  // Apply Tier 1 adjustment
  if (input.population === '1M+') {
    projectedClicks *= TIER_1_ADJUSTMENT;
  }

  // Store full clicks for display
  const fullProjectedClicks = projectedClicks;

  // Apply market share factor
  const marketShare = isConservative ? CONSERVATIVE_MARKET_SHARE : MODERATE_MARKET_SHARE;
  const projectedClicksWithShare = projectedClicks * marketShare;

  // Calculate projected leads and jobs from market
  const clickToLeadRate = CLICK_TO_LEAD_RATES[input.serviceType];
  const leadToJobRate = LEAD_TO_JOB_RATES[input.serviceType];
  
  const projectedLeads = fullProjectedClicks * clickToLeadRate;
  let projectedMarketJobs = projectedClicksWithShare * clickToLeadRate * leadToJobRate;

  // Apply performance multiplier if user outperforms (>1.2x)
  if (performanceMultiplier > 1.2) {
    projectedMarketJobs *= performanceMultiplier;
  }

  // CRITICAL FIX: Enforce performance floor
  let projectedJobs = Math.max(projectedMarketJobs, currentPerformance.currentJobsFromSearch);

  // CRITICAL FIX: Force minimum growth if still showing no improvement
  if (projectedJobs <= currentPerformance.currentJobsFromSearch) {
    const minimumGrowth = isConservative ? MINIMUM_GROWTH_CONSERVATIVE : MINIMUM_GROWTH_MODERATE;
    const growthJobs = currentPerformance.currentJobsFromSearch * minimumGrowth;
    projectedJobs = currentPerformance.currentJobsFromSearch + growthJobs;
  }

  // Round to whole number
  projectedJobs = Math.round(projectedJobs);

  // FINAL SAFETY CHECK: Ensure at least 1 additional job
  if (projectedJobs <= currentPerformance.currentJobsFromSearch) {
    projectedJobs = currentPerformance.currentJobsFromSearch + 1;
  }

  // Calculate additional jobs
  let additionalJobs = projectedJobs - currentPerformance.currentJobsFromSearch;
  additionalJobs = Math.max(0, additionalJobs);

  // Calculate revenue
  let additionalMonthlyRevenue = additionalJobs * input.averageTicket;

  // Apply high ticket multiplier if applicable
  if (input.averageTicket > HIGH_TICKET_THRESHOLD) {
    additionalMonthlyRevenue *= HIGH_TICKET_MULTIPLIER;
  }

  // Calculate annual revenue using the 6.75 multiplier
  const additionalAnnualRevenue = additionalMonthlyRevenue * ANNUAL_REVENUE_MULTIPLIER;

  // Calculate ROI
  const totalInvestment = input.monthlyInvestment * 12;
  const roi = totalInvestment > 0 
    ? ((additionalAnnualRevenue - totalInvestment) / totalInvestment) * 100
    : 0;

  // Calculate payback period
  let paybackMonths: number | null = null;
  if (additionalMonthlyRevenue > 0) {
    paybackMonths = Math.ceil(totalInvestment / additionalMonthlyRevenue);
    const minPayback = isConservative ? MIN_PAYBACK_CONSERVATIVE : MIN_PAYBACK_MODERATE;
    paybackMonths = Math.max(paybackMonths, minPayback);
  }

  // Generate insight
  const timeframe = isConservative ? 'first 6 months' : 'full 12-month period';
  const percentage = isConservative ? '55% of the moderate scenario\'s potential' : '20% of top-position traffic';
  
  let insight = '';
  if (isConservative) {
    insight = `Over the ${timeframe}, with conservative optimization toward position ${targetPosition}, you could generate approximately $${additionalMonthlyRevenue.toLocaleString()}/month in additional revenue by month 6, reaching ${percentage}, with an annualized projection of $${Math.round(additionalAnnualRevenue).toLocaleString()} as your rankings stabilize at this conservative level.`;
  } else {
    insight = `Over the ${timeframe}, with aggressive optimization to position ${targetPosition}, you could capture approximately ${percentage}, generating approximately $${Math.round(additionalAnnualRevenue).toLocaleString()} in additional revenue during the first year, with ongoing revenue of $${additionalMonthlyRevenue.toLocaleString()}/month once full maturity is achieved in month 12.`;
    
    if (performanceMultiplier > 1.2) {
      insight += ` Your business is currently outperforming market benchmarks by approximately ${performanceMultiplier.toFixed(1)}x at your current position. We've factored this strong performance into projections for improved positions, assuming you'll maintain this competitive advantage with continued optimization.`;
    }
  }

  return {
    targetPosition,
    projectedMonthlyClicks: Math.round(fullProjectedClicks),
    projectedMonthlyLeads: Math.round(projectedLeads),
    projectedMonthlyJobs: projectedJobs,
    additionalMonthlyJobs: additionalJobs,
    additionalMonthlyRevenue: Math.round(additionalMonthlyRevenue),
    additionalAnnualRevenue: Math.round(additionalAnnualRevenue),
    roi: Math.round(roi * 10) / 10,
    paybackMonths,
    insight,
  };
}

function calculateROIAnalysis(
  input: CalculatorInput,
  conservative: ProjectionResult,
  moderate: ProjectionResult
): ROIAnalysis {
  const totalInvestment = input.monthlyInvestment * 12;
  
  // Calculate break-even month for conservative
  const conservativeBreakEven = conservative.additionalMonthlyRevenue > 0
    ? Math.ceil(totalInvestment / conservative.additionalMonthlyRevenue)
    : null;
  
  let insight = '';
  
  if (conservative.roi < 0 && moderate.roi > 0) {
    insight = `Your investment of $${input.monthlyInvestment.toLocaleString()}/month positions you for long-term growth. At the conservative pace, you're on track to reach positive ROI by month ${conservativeBreakEven || 15}. At the moderate pace, you could see +${moderate.roi.toFixed(1)}% ROI within 12 months. These projections assume consistent implementation including: ongoing content creation, active review management (targeting 5-10 new reviews monthly), technical website optimization, citation building and maintenance, and regular GMB updates. SEO is a long-term investment—results compound over time.`;
  } else if (conservative.roi < 0 && moderate.roi < 0) {
    insight = `Based on our analysis, your current monthly investment of $${input.monthlyInvestment.toLocaleString()} may be too high relative to your market's search volume and revenue potential. In markets with limited search volume (under 2,000 monthly searches) and lower average tickets (under $500), a more modest SEO investment of $400-$800/month may be more appropriate, or you may want to explore alternative marketing channels that offer better cost-effectiveness for smaller service areas.`;
  } else {
    insight = `With a projected +${moderate.roi.toFixed(1)}% ROI over 12 months, this investment in local SEO is positioned to deliver strong returns. Your investment of $${input.monthlyInvestment.toLocaleString()}/month aligns with professional local SEO services (Makarios Marketing's typical programs range from $1,700-$2,000+/month). These projections assume consistent implementation including: ongoing content creation, active review management, technical website optimization, citation building, and regular GMB updates.`;
  }

  return {
    totalInvestment,
    conservativeROI: conservative.roi,
    moderateROI: moderate.roi,
    conservativePayback: conservative.paybackMonths,
    moderatePayback: moderate.paybackMonths,
    insight,
  };
}

function calculatePaidAdsComparison(
  input: CalculatorInput,
  moderate: ProjectionResult
): PaidAdsComparison {
  const cpc = CPC_BY_SERVICE[input.serviceType];
  const clickToLeadRate = CLICK_TO_LEAD_RATES[input.serviceType];
  const cpl = cpc / clickToLeadRate;

  // Calculate how many leads needed for additional jobs
  const leadToJobRate = LEAD_TO_JOB_RATES[input.serviceType];
  const leadsNeeded = moderate.additionalMonthlyJobs / leadToJobRate;
  
  const monthlyPaidAdsCost = leadsNeeded * cpl;
  const annualSavingsVsPaidAds = (monthlyPaidAdsCost - input.monthlyInvestment) * 12;
  
  const costEfficiencyAdvantage = monthlyPaidAdsCost > 0 
    ? ((monthlyPaidAdsCost - input.monthlyInvestment) / monthlyPaidAdsCost) * 100
    : 0;

  const insight = `Local SEO delivers the same lead volume at significantly lower ongoing costs—$${input.monthlyInvestment.toLocaleString()}/month vs $${Math.round(monthlyPaidAdsCost).toLocaleString()}/month for equivalent results. This represents a ${Math.abs(Math.round(costEfficiencyAdvantage))}% cost efficiency advantage for sustained, long-term visibility without the recurring click costs of paid advertising.`;

  return {
    cpcForService: cpc,
    cplForService: Math.round(cpl),
    monthlyPaidAdsCost: Math.round(monthlyPaidAdsCost),
    annualSavingsVsPaidAds: Math.round(annualSavingsVsPaidAds),
    costEfficiencyAdvantage: Math.round(costEfficiencyAdvantage * 10) / 10,
    insight,
  };
}

function calculateTimelineBreakdown(moderate: ProjectionResult): TimelineBreakdown {
  const fullMonthlyRevenue = moderate.additionalMonthlyRevenue;
  
  return {
    months1to3: {
      additionalMonthlyRevenue: 0,
      insight: 'In the first 3 months, expect foundational work including technical optimization, NAP consistency, citation building, and initial content creation. Rankings will begin to shift but revenue generation is minimal during this setup phase.',
    },
    months4to6: {
      additionalMonthlyRevenue: Math.round(fullMonthlyRevenue * 0.25),
      insight: 'By months 4-6, your strategy will start yielding tangible results. Expect to see approximately 25% of your full projected gains as improved rankings begin driving increased visibility and lead flow.',
    },
    months7to12: {
      additionalMonthlyRevenue: fullMonthlyRevenue,
      insight: 'Reaching the 7-12 month mark, your local SEO efforts should be at full maturity, consistently generating the full projected additional monthly revenue as your sustained rankings solidify market dominance.',
    },
  };
}

function generateKeyInsights(
  input: CalculatorInput,
  currentPerformance: CurrentPerformance,
  conservative: ProjectionResult,
  moderate: ProjectionResult,
  performanceMultiplier: number
): string[] {
  const insights: string[] = [];

  // Insight 1: Performance multiplier
  if (performanceMultiplier > 1.2) {
    insights.push(
      `Your business is currently outperforming market benchmarks by approximately ${performanceMultiplier.toFixed(1)}x at your current position. We've factored this strong performance into projections for improved positions, assuming you'll maintain this competitive advantage with continued optimization.`
    );
  }

  // Insight 2: Implementation reality
  insights.push(
    `Implementation Reality: These projections assume optimal execution including consistent technical optimization, content creation, active review generation, and citation management. Local SEO is not a one-time fix but requires ongoing strategic effort over 6-12 months to achieve these results.`
  );

  // Insight 3: Service-specific insight
  if (input.serviceType === 'Plumbing') {
    insights.push(
      `For your Plumbing business in ${input.cityName}, moving from ${input.currentGMBPosition} to a moderate target of ${moderate.targetPosition} could mean an additional $${moderate.additionalMonthlyRevenue.toLocaleString()}/month in revenue. Prioritize optimizing for specific, high-intent service keywords.`
    );
    insights.push(
      `The urgency of plumbing emergencies makes top local rankings critical. Ensuring 24/7 availability is reflected in your GMB and website can capture high-value, immediate-need customers.`
    );
  } else if (input.serviceType === 'HVAC') {
    insights.push(
      `For your HVAC business in ${input.cityName}, moving from ${input.currentGMBPosition} to ${moderate.targetPosition} could mean an additional $${moderate.additionalMonthlyRevenue.toLocaleString()}/month. HVAC businesses benefit significantly from seasonal search spikes—strong positioning before peak seasons amplifies results.`
    );
    insights.push(
      `Consider creating seasonal content targeting "AC repair" in summer and "heating repair" in winter to capture time-sensitive, high-intent searches.`
    );
  } else if (input.serviceType === 'Roofing') {
    insights.push(
      `For your Roofing business in ${input.cityName}, your $${input.averageTicket.toLocaleString()} average ticket means each additional job has significant impact. Moving to position ${moderate.targetPosition} could add $${moderate.additionalAnnualRevenue.toLocaleString()} annually.`
    );
    insights.push(
      `Roofing has longer sales cycles—focus on review generation and before/after project galleries to build trust with prospects researching multiple contractors.`
    );
  } else if (input.serviceType === 'Electrical') {
    insights.push(
      `For your Electrical business in ${input.cityName}, improved visibility at position ${moderate.targetPosition} could capture both emergency calls and planned project work, diversifying your lead sources.`
    );
    insights.push(
      `Electrical services benefit from targeting both residential and commercial keywords. Consider separate landing pages for each to maximize relevance.`
    );
  }

  // Insight 4: Position opportunity
  insights.push(
    `Your current GMB position of ${input.currentGMBPosition} shows significant room for growth. A targeted strategy to climb into the #1-3 map pack spots can dramatically increase your visibility and lead capture, potentially unlocking an additional $${moderate.additionalAnnualRevenue.toLocaleString()} in annual revenue.`
  );

  return insights;
}

function generateStrategicRecommendations(
  input: CalculatorInput,
  moderate: ProjectionResult,
  monthlySearchVolume: number
): StrategicRecommendation[] {
  const recommendations: StrategicRecommendation[] = [];

  // Recommendation 1: Right-size investment
  const recommendedMin = monthlySearchVolume < 5000 ? 400 : 1500;
  const recommendedMax = monthlySearchVolume < 5000 ? 800 : 2000;
  
  recommendations.push({
    title: 'Right-Size Your SEO Investment',
    description: `Current investment: $${input.monthlyInvestment.toLocaleString()}/month`,
    details: [
      `Recommended for this market: $${recommendedMin.toLocaleString()}-$${recommendedMax.toLocaleString()}/month for foundational SEO maintenance`,
      input.monthlyInvestment > recommendedMax 
        ? `Potential savings: $${(input.monthlyInvestment - recommendedMax).toLocaleString()}/month to reallocate to higher-ROI channels`
        : `Your investment is well-aligned with market opportunity`,
    ],
  });

  // Recommendation 2: Diversify channels
  recommendations.push({
    title: 'Diversify with Higher-ROI Marketing Channels',
    description: 'Consider allocating your marketing budget across multiple channels:',
    details: [
      `Google Local Service Ads (LSAs): Pay only for qualified calls, typically $30-$50 per lead`,
      `Strategic Paid Search: Target high-intent keywords during peak season`,
      `Referral Program: Incentivize past customers (especially effective for ${input.serviceType})`,
      `Partnership Marketing: home warranty companies, property management firms, real estate agents`,
    ],
  });

  // Recommendation 3: Geographic expansion
  if (monthlySearchVolume < 10000) {
    recommendations.push({
      title: 'Consider Geographic Expansion',
      description: `Expanding your service area to nearby cities could significantly increase your addressable market and make SEO investment more viable. This is particularly effective when your current market has limited search volume (under 3,000 monthly searches).`,
    });
  } else {
    recommendations.push({
      title: 'Double Down on Local Dominance',
      description: `With ${monthlySearchVolume.toLocaleString()} monthly searches in your market, there's significant opportunity to capture more share. Focus on dominating the local pack before expanding to adjacent markets.`,
    });
  }

  return recommendations;
}
