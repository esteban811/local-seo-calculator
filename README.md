# Local SEO ROI Calculator - Makarios Marketing

A React + TypeScript calculator that helps home service businesses understand their potential ROI from local SEO investment.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed on your computer
- npm (comes with Node.js)

### Installation

1. **Open your terminal and navigate to this folder:**
   ```bash
   cd local-seo-calculator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser to:**
   ```
   http://localhost:3000
   ```

## 📦 Project Structure

```
local-seo-calculator/
├── src/
│   ├── components/
│   │   ├── Calculator.tsx    # Input form component
│   │   └── Results.tsx       # Results display component
│   ├── services/
│   │   ├── constants.ts      # All benchmarks and configuration
│   │   └── calculatorService.ts  # Core calculation logic
│   ├── types/
│   │   └── calculator.ts     # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # React entry point
│   └── index.css            # Tailwind + custom styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 🔧 Key Fixes Applied

### 1. Conservative Projection (55% of Moderate)
- `CONSERVATIVE_MARKET_SHARE = 0.11` (55% of Moderate's 0.20)
- Ensures Conservative always shows meaningful but modest growth

### 2. Annual Revenue Calculation (6.75x multiplier)
- Accounts for realistic revenue ramp:
  - Months 1-3: 0% (foundation)
  - Months 4-6: 25% (early results)
  - Months 7-12: 100% (full maturity)
- Formula: `annual = monthly × 6.75`

### 3. Performance Floor Logic
- Projections can never be lower than current performance
- Minimum growth of 15% (Conservative) or 25% (Moderate) enforced
- Final safety check ensures at least 1 additional job

### 4. CTA Link Updated
- All "Schedule Consultation" buttons link to:
  `https://api.leadconnectorhq.com/widget/booking/5VmHaA6BoYwnQOeSOBja`

## 🎨 Brand Guidelines

- **Makarios Green:** #4FA941
- **Dark Forest Green:** #224432
- **Lime Green:** #BAF915
- **Typography:** DM Sans

## 📊 Test Cases

### Dallas Plumbing (verify Conservative fix)
```
Service: Plumbing
City: Dallas
Population: 1M+
Avg Ticket: $850
Monthly Jobs: 40
Local Search %: 37.5
Position: #15+
Investment: $2,000
```
Expected: Conservative shows 2-3 additional jobs, ~$11,000 annual revenue

### Charlotte HVAC (verify performance floor)
```
Service: HVAC
City: Charlotte
Population: 1M+
Avg Ticket: $2,800
Monthly Jobs: 35
Local Search %: 20
Position: #11-15
Investment: $1,700
```
Expected: Conservative shows 1+ additional job (not 0)

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready for deployment.

## 📝 License

Property of Makarios Marketing. All rights reserved.
