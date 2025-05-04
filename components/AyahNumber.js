// components/AyahNumber.js
import { useMemo } from 'react';

/**
 * Component for displaying Quranic ayah numbers with proper styling
 * Supports different display styles: traditional ornamental, simple, and minimalist
 */
const AyahNumber = ({ 
  number, 
  displayStyle = 'traditional',
  color = 'inherit',
  size = 'medium',
  className = ''
}) => {
  // Convert number to string with proper locale
  const numberText = useMemo(() => {
    return number.toLocaleString('ar-SA');
  }, [number]);
  
  // Get CSS classes based on size
  const sizeClass = useMemo(() => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'large':
        return 'text-lg';
      case 'xlarge':
        return 'text-xl';
      case 'medium':
      default:
        return 'text-sm';
    }
  }, [size]);
  
  // Render different styles of ayah numbers
  switch (displayStyle) {
    case 'simple':
      // Simple style: just parentheses
      return (
        <span 
          className={`inline-block mx-1 ${sizeClass} ${className}`}
          style={{ color }}
        >
          ({numberText})
        </span>
      );
      
    case 'minimalist':
      // Minimalist style: just the number with a subtle mark
      return (
        <span 
          className={`inline-block mx-1 ${sizeClass} ${className}`}
          style={{ color }}
        >
          {numberText}°
        </span>
      );
    
    case 'traditional':
    default:
      // Traditional style: ornamental brackets ﴿١٢٣﴾
      return (
        <span 
          className={`inline-block mx-1 ${sizeClass} ${className}`}
          style={{ color }}
          aria-label={`Ayah ${number}`}
        >
          ﴿{numberText}﴾
        </span>
      );
  }
};

export default AyahNumber;
