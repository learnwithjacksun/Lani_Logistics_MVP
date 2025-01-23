import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = ({ 
  label, 
  error, 
  icon,
  type = 'text',
  className = '',
  ...props 
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);

  const togglePassword = () => {
    setShowPassword(!showPassword);
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-sub font-medium mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sub">
            {icon}
          </span>
        )}
        
        <input
          type={inputType}
          className={`
            w-full px-4 h-10 rounded-lg border border-line
            focus:border-primary_1 bg-background text-xs text-main placeholder:text-sub placeholder:text-sm
            ${icon ? 'pl-10 text-sub' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sub hover:text-main"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input; 