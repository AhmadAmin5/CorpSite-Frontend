const Hero = ({ title, description, children }) => {
  return (
    <div className="relative overflow-hidden bg-(--card) py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-(--border)">
      {/* Decorative background elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[50%] rounded-full bg-accent/10 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <h1 className="text-4xl font-extrabold tracking-tight text-(--foreground) sm:text-5xl lg:text-6xl drop-shadow-sm">
          {title}
        </h1>
        {description && (
          <p className="text-xl text-(--secondary) max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
};

export default Hero;
