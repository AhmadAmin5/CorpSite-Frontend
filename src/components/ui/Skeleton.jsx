const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-secondary/10 ${className}`}
      {...props}
    />
  );
};

export default Skeleton;