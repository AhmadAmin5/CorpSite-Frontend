import { cloneElement, isValidElement } from 'react';
import Spinner from './Spinner';

const Button = ({
  children,
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
  isButtonLoading = false,
  icon,
  iconSize = size,
  iconPosition = 'left',
  text,
  loadingText = text,
}) => {
  const baseStyle =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-primary text-primary-content hover:bg-(--color-primary-hover) focus-visible:ring-primary',

    secondary:
      'bg-secondary text-secondary-content hover:bg-(--color-secondary-hover) focus-visible:ring-secondary',

    danger:
      'bg-error text-error-content hover:bg-(--color-error-hover) focus-visible:ring-error',

    success:
      'bg-success text-success-content hover:bg-(--color-success-hover) focus-visible:ring-success',

    ghost:
      'bg-transparent text-(--foreground) hover:bg-(--foreground)/10 focus-visible:ring-(--foreground)',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isButtonLoading || disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className} flex items-center gap-2`}
    >
      {isButtonLoading ? (
        <Spinner className={iconSizes[size]} />
      ) : (
        iconPosition == 'left' &&
        isValidElement(icon) &&
        cloneElement(icon, {
          className: `${iconSizes[iconSize]} ${icon.props.className || ''}`,
          strokeWidth: 2.5,
        })
      )}
      {isButtonLoading ? loadingText : text}

      {!isButtonLoading &&
        iconPosition == 'right' &&
        isValidElement(icon) &&
        cloneElement(icon, {
          className: `${iconSizes[iconSize]} ${icon.props.className || ''}`,
          strokeWidth: 2.5,
        })}

      {children}
    </button>
  );
};

export default Button;
