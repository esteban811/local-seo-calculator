import { ServiceType, PopulationTier, GMBPosition } from '../types/calculator';

// Search Volume per 100k population by service type
export const SEARCH_VOLUME_FACTORS: Record<ServiceType, number> = {
  'Plumbing': 2150,    // 1,800-2,500 avg
  'HVAC': 1500,        // 1,200-1,800 avg
  'Electrical': 1000,  // 800-1,200 avg
  'Roofing': 550,      // 400-700 avg
};

// Population multipliers
export const POPULATION_MULTIPLIERS: Record<PopulationTier, number> = {
  'Under 100k': 0.75,
  '100k-500k': 3,
  '500k-1M': 7.5,
  '1M+': 15,
};

// CTR by GMB Position (clicks per 1,000 searches)
export const POSITION_CTR: Record<GMBPosition, number> = {
  '#1-3': 380,      // 38%
  '#4-7': 18,       // 1.8%
  '#8-10': 8,       // 0.8%
  '#11-15': 4,      // 0.4%
  '#15+': 2,        // 0.2%
  "Don't know": 4,  // Assume #11-15
};

// Click to Lead conversion rates by service
export const CLICK_TO_LEAD_RATES: Record<ServiceType, number> = {
  'Plumbing': 0.25,     // 25%
  'HVAC': 0.175,        // 17.5%
  'Electrical': 0.15,   // 15%
  'Roofing': 0.085,     // 8.5%
};

// Lead to Job conversion rates by service
export const LEAD_TO_JOB_RATES: Record<ServiceType, number> = {
  'Plumbing': 0.45,     // 45%
  'HVAC': 0.30,         // 30%
  'Electrical': 0.35,   // 35%
  'Roofing': 0.15,      // 15%
};

// Target positions for projections
export const CONSERVATIVE_TARGET_POSITIONS: Record<GMBPosition, GMBPosition> = {
  '#15+': '#8-10',
  '#11-15': '#8-10',
  '#8-10': '#4-7',
  '#4-7': '#4-7',
  '#1-3': '#1-3',
  "Don't know": '#8-10',
};

export const MODERATE_TARGET_POSITIONS: Record<GMBPosition, GMBPosition> = {
  '#15+': '#4-7',
  '#11-15': '#4-7',
  '#8-10': '#4-7',
  '#4-7': '#1-3',
  '#1-3': '#1-3',
  "Don't know": '#4-7',
};

// Market share capture factors
// FIXED: Conservative at 55% of Moderate
export const CONSERVATIVE_MARKET_SHARE = 0.11;  // 11% (55% of 20%)
export const MODERATE_MARKET_SHARE = 0.20;      // 20%

// Minimum growth percentages when outperforming
export const MINIMUM_GROWTH_CONSERVATIVE = 0.15;  // 15%
export const MINIMUM_GROWTH_MODERATE = 0.25;      // 25%

// Timeline ramp multiplier for annual revenue calculation
// Months 1-3: 0% = 0 months
// Months 4-6: 25% × 3 = 0.75 months
// Months 7-12: 100% × 6 = 6 months
// Total: 6.75 months equivalent
export const ANNUAL_REVENUE_MULTIPLIER = 6.75;

// High ticket multiplier (for tickets > $3,000)
export const HIGH_TICKET_THRESHOLD = 3000;
export const HIGH_TICKET_MULTIPLIER = 0.85;

// Tier 1 city competition adjustment
export const TIER_1_ADJUSTMENT = 0.85;  // -15%

// Minimum payback periods
export const MIN_PAYBACK_CONSERVATIVE = 6;
export const MIN_PAYBACK_MODERATE = 3;

// Cost Per Click by service type
export const CPC_BY_SERVICE: Record<ServiceType, number> = {
  'Plumbing': 47.50,
  'HVAC': 35.00,
  'Electrical': 27.50,
  'Roofing': 42.50,
};

// Booking URL for CTA
export const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/5VmHaA6BoYwnQOeSOBja';

// ROI threshold for showing strategic recommendations
export const LOW_ROI_THRESHOLD = 0.50;  // 50%
