import { forwardRef } from 'react';
import { handleKeyboardSubmit } from '../../utils/accessibility';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = 'btn';
  const variantStyles = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 dark:hover:bg-purple-500',
    secondary: 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50 dark:bg-gray-800 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-gray-700',
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      onKeyDown={(e) => handleKeyboardSubmit(e, props.onClick)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button; 