export type ServiceType = 'Plumbing' | 'HVAC' | 'Electrical' | 'Roofing';

export type PopulationTier = 'Under 100k' | '100k-500k' | '500k-1M' | '1M+';

export type GMBPosition = '#1-3' | '#4-7' | '#8-10' | '#11-15' | '#15+' | "Don't know";

export interface CalculatorInput {
  serviceType: ServiceType;
  cityName: string;
  population: PopulationTier;
  averageTicket: number;
  monthlyJobs: number;
  localSearchPercentage: number;
  currentGMBPosition: GMBPosition;
  monthlyInvestment: number;
}

export interface ProjectionResult {
  targetPosition: string;
  projectedMonthlyClicks: number;
  projectedMonthlyLeads: number;
  projectedMonthlyJobs: number;
  additionalMonthlyJobs: number;
  additionalMonthlyRevenue: number;
  additionalAnnualRevenue: number;
  roi: number;
  paybackMonths: number | null;
  insight: string;
}

export interface CurrentPerformance {
  estimatedMonthlySearches: number;
  estimatedMonthlyClicks: number;
  estimatedMonthlyLeads: number;
  currentJobsFromSearch: number;
  currentMonthlyRevenue: number;
  marketSharePercentage: number;
  estimatedJobsFromMarket: number;
  insight: string;
}

export interface PaidAdsComparison {
  cpcForService: number;
  cplForService: number;
  monthlyPaidAdsCost: number;
  annualSavingsVsPaidAds: number;
  costEfficiencyAdvantage: number;
  insight: string;
}

export interface TimelinePhase {
  additionalMonthlyRevenue: number;
  insight: string;
}

export interface TimelineBreakdown {
  months1to3: TimelinePhase;
  months4to6: TimelinePhase;
  months7to12: TimelinePhase;
}

export interface ROIAnalysis {
  totalInvestment: number;
  conservativeROI: number;
  moderateROI: number;
  conservativePayback: number | null;
  moderatePayback: number | null;
  insight: string;
}

export interface StrategicRecommendation {
  title: string;
  description: string;
  details?: string[];
}

export interface CalculatorResult {
  input: CalculatorInput;
  currentPerformance: CurrentPerformance;
  conservative: ProjectionResult;
  moderate: ProjectionResult;
  roiAnalysis: ROIAnalysis;
  paidAdsComparison: PaidAdsComparison;
  timelineBreakdown: TimelineBreakdown;
  keyInsights: string[];
  strategicRecommendations: StrategicRecommendation[];
  showStrategicRecommendations: boolean;
  totalAnnualInvestment: number;
  performanceMultiplier: number;
}
