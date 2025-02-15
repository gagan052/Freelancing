import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={props.id} className="label dark:text-gray-200">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`input bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:border-purple-500 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 