const variants = {
  success: 'bg-success/10 text-success border-success/20',
  error: 'bg-error/10 text-error border-error/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  info: 'bg-primary/10 text-primary border-primary/20',
  neutral: 'bg-(--secondary)/10 text-(--secondary) border-(--border)',
};

const Badge = ({
  children,
  variant = 'neutral',
  icon: Icon,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 
        rounded-full text-xs font-medium border 
        ${variants[variant] || variants.neutral} 
        ${className}
      `}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
};

export default Badge;
