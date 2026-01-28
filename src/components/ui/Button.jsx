const Button = ({
  children,
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
}) => {
  const baseStyle =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-primary text-primary-content hover:bg-(--color-primary-hover) focus:ring-primary',

    secondary:
      'bg-secondary text-secondary-content hover:bg-(--color-secondary-hover) focus:ring-secondary',

    danger:
      'bg-error text-error-content hover:bg-(--color-error-hover) focus:ring-error',

    success:
      'bg-success text-success-content hover:bg-(--color-success-hover) focus:ring-success',

    ghost: 'bg-transparent text-(--foreground) hover:bg-(--foreground)/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
