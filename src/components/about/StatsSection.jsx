const StatsSection = () => {
  const stats = [
    { value: '10+', label: 'Years of Excellence' },
    { value: '500+', label: 'Enterprise Projects' },
    { value: '99.9%', label: 'System Uptime' },
    { value: '150+', label: 'Global Experts' },
  ];

  return (
    <section className="bg-(--card) border border-(--border) rounded-3xl p-8 md:p-12 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-(--border)">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center px-4 first:border-l-0"
          >
            <span className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 mb-2">
              {stat.value}
            </span>
            <span className="text-sm md:text-base font-medium text-(--secondary)">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
