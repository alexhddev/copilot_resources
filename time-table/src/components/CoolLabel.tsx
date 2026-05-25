import React from 'react';
import './CoolLabel.css';

interface CoolLabelPropZ {
  /**
   * The text content to display in the label
   */
  text: string;
  /**
   * Optional CSS class for additional styling
   */
  className?: string;
}

/**
 * CoolLabel Component
 * A simple, reusable label component for displaying text with custom styling.
 *
 * @param props - Component props
 * @returns JSX element
 */
const CoolLabel: React.FC<CoolLabelPropZ> = ({ text, className = '' }) => {
  return (
    <div className={`cool-label ${className}`.trim()}>
      {text}
    </div>
  );
};

export default CoolLabel;
