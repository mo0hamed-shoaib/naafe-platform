import React from 'react';
import { getPasswordStrength } from '../../utils/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  className = '' 
}) => {
  if (!password) return null;

  const { strength, score, feedback } = getPasswordStrength(password);
  
  const getStrengthColor = () => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'weak': return 'ضعيف';
      case 'medium': return 'متوسط';
      case 'strong': return 'قوي';
      default: return '';
    }
  };

  const getStrengthTextColor = () => {
    switch (strength) {
      case 'weak': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'strong': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`mt-2 ${className}`}>
      {/* Strength Bar */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(score / 6) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${getStrengthTextColor()}`}>
          {getStrengthText()}
        </span>
      </div>

      {/* Feedback */}
      {feedback.length > 0 && (
        <div className="text-xs text-gray-600 space-y-1">
          {feedback.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {/* Requirements Checklist */}
      <div className="text-xs text-gray-600 mt-2">
        <div className="grid grid-cols-2 gap-1">
          <div className={`flex items-center gap-1 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{password.length >= 8 ? '✓' : '○'}</span>
            <span>8 أحرف على الأقل</span>
          </div>
          <div className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span>
            <span>حرف كبير</span>
          </div>
          <div className={`flex items-center gap-1 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{/[a-z]/.test(password) ? '✓' : '○'}</span>
            <span>حرف صغير</span>
          </div>
          <div className={`flex items-center gap-1 ${/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{/\d/.test(password) ? '✓' : '○'}</span>
            <span>رقم</span>
          </div>
          <div className={`flex items-center gap-1 ${/[@$!%*?&]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{/[@$!%*?&]/.test(password) ? '✓' : '○'}</span>
            <span>رمز خاص</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator; 