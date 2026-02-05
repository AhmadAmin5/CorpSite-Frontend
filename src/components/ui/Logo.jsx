import { Link } from 'react-router-dom';

const Logo = ({ className = '', iconOnly = false, size = 32, link = true }) => {
  const Component = link ? Link : 'div';
  const props = link ? { to: '/' } : {};

  return (
    <Component
      {...props}
      className={`flex items-center gap-2 select-none ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary shrink-0"
      >
        <rect
          x="4"
          y="4"
          width="12"
          height="12"
          rx="4"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <rect
          x="16"
          y="16"
          width="12"
          height="12"
          rx="4"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <path
          d="M10 10H22V22H10V10Z"
          fill="currentColor"
          className="drop-shadow-sm"
        />
        <path
          d="M22 10L26 6M10 22L6 26"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {!iconOnly && (
        <span
          style={{ fontSize: size * 0.75 }}
          className="font-bold tracking-tight text-(--foreground)"
        >
          Corp<span className="text-primary">Site</span>
        </span>
      )}
    </Component>
  );
};

export default Logo;
