import { Cloud, Cpu, Lock, Smartphone } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Cloud,
      title: 'Cloud-Native Architecture',
      description:
        'Build resilient, auto-scaling infrastructure using modern containerization and serverless paradigms to drastically reduce operational overhead.',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'group-hover:border-blue-500/50',
    },
    {
      icon: Cpu,
      title: 'Applied Artificial Intelligence',
      description:
        'Integrate predictive analytics, machine learning models, and generative AI to automate workflows and unlock deep data insights.',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'group-hover:border-purple-500/50',
    },
    {
      icon: Lock,
      title: 'Enterprise CyberSecurity',
      description:
        'Implement military-grade encryption, rigorous compliance standards, and zero-trust architectures to protect your most valuable digital assets.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'group-hover:border-emerald-500/50',
    },
    {
      icon: Smartphone,
      title: 'Cross-Platform Experiences',
      description:
        'Deliver lightning-fast, highly accessible, and beautiful cross-platform applications that your users will love across web and mobile.',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'group-hover:border-orange-500/50',
    },
  ];

  return (
    <section className="py-24 bg-(--background)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-(--foreground) mb-4">
            Capabilities that define the future
          </h2>
          <p className="text-lg text-(--secondary)">
            We provide end-to-end technical solutions designed to tackle complex
            business challenges, ensuring your systems are robust, secure, and
            ready to scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`group p-8 rounded-3xl bg-(--card) border border-(--border) ${feat.border} transition-all duration-300 hover:shadow-lg`}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${feat.bg} flex items-center justify-center mb-6`}
              >
                <feat.icon className={`w-7 h-7 ${feat.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-(--foreground) mb-3">
                {feat.title}
              </h3>
              <p className="text-(--secondary) leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
