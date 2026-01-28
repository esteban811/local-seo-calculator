import React, { useState, useRef } from 'react';
import { CalculatorInput, ServiceType, PopulationTier, GMBPosition } from '../types/calculator';

interface CalculatorProps {
  onCalculate: (input: CalculatorInput) => void;
}

const SERVICE_TYPES: ServiceType[] = ['Plumbing', 'HVAC', 'Electrical', 'Roofing'];
const POPULATION_TIERS: PopulationTier[] = ['Under 100k', '100k-500k', '500k-1M', '1M+'];
const GMB_POSITIONS: GMBPosition[] = ['#1-3', '#4-7', '#8-10', '#11-15', '#15+', "Don't know"];

interface ValidationErrors {
  [key: string]: string;
}

export default function Calculator({ onCalculate }: CalculatorProps) {
  const [formData, setFormData] = useState<Partial<CalculatorInput>>({
    serviceType: 'Plumbing',
    population: '500k-1M',
    currentGMBPosition: '#11-15',
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const validateField = (name: string, value: string | number | undefined): string => {
    if (value === undefined || value === '') {
      return 'This field is required';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    switch (name) {
      case 'cityName':
        if (typeof value === 'string' && value.trim().length < 2) {
          return 'Please enter a valid city name';
        }
        break;
      case 'averageTicket':
        if (isNaN(numValue) || numValue <= 0) {
          return 'Please enter a valid amount greater than 0';
        }
        if (numValue > 100000) {
          return 'Please enter a realistic ticket size';
        }
        break;
      case 'monthlyJobs':
        if (isNaN(numValue) || numValue < 0) {
          return 'Please enter a valid number of jobs';
        }
        if (numValue > 1000) {
          return 'Please enter a realistic number of jobs';
        }
        break;
      case 'localSearchPercentage':
        if (isNaN(numValue) || numValue < 0 || numValue > 100) {
          return 'Please enter a percentage between 0 and 100';
        }
        break;
      case 'monthlyInvestment':
        if (isNaN(numValue) || numValue <= 0) {
          return 'Please enter a valid investment amount';
        }
        if (numValue > 50000) {
          return 'Please enter a realistic monthly investment';
        }
        break;
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const newValue = ['averageTicket', 'monthlyJobs', 'localSearchPercentage', 'monthlyInvestment'].includes(name)
      ? (value === '' ? undefined : parseFloat(value))
      : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate on change if field was already touched
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    const numValue = ['averageTicket', 'monthlyJobs', 'localSearchPercentage', 'monthlyInvestment'].includes(name)
      ? (value === '' ? undefined : parseFloat(value))
      : value;

    const error = validateField(name, numValue);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: ValidationErrors = {};
    const fieldsToValidate = ['cityName', 'averageTicket', 'monthlyJobs', 'localSearchPercentage', 'monthlyInvestment'];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof CalculatorInput]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      cityName: true,
      averageTicket: true,
      monthlyJobs: true,
      localSearchPercentage: true,
      monthlyInvestment: true,
    });

    if (Object.keys(newErrors).length === 0 && isFormValid()) {
      onCalculate(formData as CalculatorInput);
    }
  };

  const isFormValid = () => {
    return (
      formData.serviceType &&
      formData.cityName &&
      formData.population &&
      formData.averageTicket !== undefined &&
      formData.averageTicket > 0 &&
      formData.monthlyJobs !== undefined &&
      formData.monthlyJobs >= 0 &&
      formData.localSearchPercentage !== undefined &&
      formData.localSearchPercentage >= 0 &&
      formData.localSearchPercentage <= 100 &&
      formData.currentGMBPosition &&
      formData.monthlyInvestment !== undefined &&
      formData.monthlyInvestment > 0
    );
  };

  const InputError = ({ error }: { error?: string }) => {
    if (!error) return null;
    return <p className="text-red-500 text-xs mt-1">{error}</p>;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Service Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Type
          <span className="ml-1 text-makarios-green cursor-help" title="Select your primary service category">ⓘ</span>
        </label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="w-full"
        >
          {SERVICE_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* City Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City Name
          <span className="ml-1 text-makarios-green cursor-help" title="Enter your primary service area city">ⓘ</span>
        </label>
        <input
          type="text"
          name="cityName"
          value={formData.cityName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., Dallas, Phoenix, Austin"
          className={`w-full ${errors.cityName && touched.cityName ? 'border-red-500' : ''}`}
        />
        <InputError error={touched.cityName ? errors.cityName : undefined} />
      </div>

      {/* City Population */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City Population
          <span className="ml-1 text-makarios-green cursor-help" title="Select the approximate metro area population">ⓘ</span>
        </label>
        <select
          name="population"
          value={formData.population}
          onChange={handleChange}
          className="w-full"
        >
          {POPULATION_TIERS.map(tier => (
            <option key={tier} value={tier}>{tier}</option>
          ))}
        </select>
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Ticket */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Ticket Size ($)
            <span className="ml-1 text-makarios-green cursor-help" title="Enter your average revenue per job">ⓘ</span>
          </label>
          <input
            type="number"
            name="averageTicket"
            value={formData.averageTicket ?? ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., 850"
            min="0"
            step="0.01"
            className={`w-full ${errors.averageTicket && touched.averageTicket ? 'border-red-500' : ''}`}
          />
          <InputError error={touched.averageTicket ? errors.averageTicket : undefined} />
        </div>

        {/* Monthly Jobs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Monthly Jobs
            <span className="ml-1 text-makarios-green cursor-help" title="Enter total jobs you complete per month">ⓘ</span>
          </label>
          <input
            type="number"
            name="monthlyJobs"
            value={formData.monthlyJobs ?? ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., 40"
            min="0"
            step="1"
            className={`w-full ${errors.monthlyJobs && touched.monthlyJobs ? 'border-red-500' : ''}`}
          />
          <InputError error={touched.monthlyJobs ? errors.monthlyJobs : undefined} />
        </div>

        {/* Local Search % */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            % Jobs from Local Search
            <span className="ml-1 text-makarios-green cursor-help" title="Percentage of jobs that come from Google Search or Maps">ⓘ</span>
          </label>
          <input
            type="number"
            name="localSearchPercentage"
            value={formData.localSearchPercentage ?? ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., 35"
            min="0"
            max="100"
            step="0.1"
            className={`w-full ${errors.localSearchPercentage && touched.localSearchPercentage ? 'border-red-500' : ''}`}
          />
          <InputError error={touched.localSearchPercentage ? errors.localSearchPercentage : undefined} />
        </div>

        {/* Monthly Investment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly SEO Investment ($)
            <span className="ml-1 text-makarios-green cursor-help" title="How much you plan to invest in SEO monthly">ⓘ</span>
          </label>
          <input
            type="number"
            name="monthlyInvestment"
            value={formData.monthlyInvestment ?? ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., 2000"
            min="0"
            step="0.01"
            className={`w-full ${errors.monthlyInvestment && touched.monthlyInvestment ? 'border-red-500' : ''}`}
          />
          <InputError error={touched.monthlyInvestment ? errors.monthlyInvestment : undefined} />
        </div>
      </div>

      {/* GMB Position */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current GMB Position
          <span className="ml-1 text-makarios-green cursor-help" title="Your current ranking position in Google Maps for main service keywords">ⓘ</span>
        </label>
        <select
          name="currentGMBPosition"
          value={formData.currentGMBPosition}
          onChange={handleChange}
          className="w-full"
        >
          {GMB_POSITIONS.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn-primary w-full"
      >
        Calculate My ROI
      </button>
    </form>
  );
}
