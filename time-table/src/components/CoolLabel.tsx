import React from 'react';
import './CoolLabel.css';

interface CoolLabelPropZ {
  text: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

/**
 * CoolLabel component displays a stylized label with customizable variant styling.
 * @param text - The text content to display in the label
 * @param variant - The visual style variant (primary, secondary, accent)
 */
const CoolLabel: React.FC<CoolLabelPropZ> = ({ text, variant = 'primary' }) => {
  return (
    <label className={`cool-label cool-label--${variant}`}>
      {text}
    </label>
  );
};

export default CoolLabel;
