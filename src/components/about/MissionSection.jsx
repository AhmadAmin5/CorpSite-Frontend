import { Target, Lightbulb, CheckCircle } from 'lucide-react';

const MissionSection = () => {
  const highlights = [
    'Enterprise-grade scalable architectures',
    'Agile and transparent delivery models',
    'Uncompromising data security standards',
  ];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
          <Target className="w-4 h-4" />
          <span>Our Mission</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-(--foreground) leading-tight">
          Transforming complexity into{' '}
          <span className="text-primary">competitive advantage.</span>
        </h2>
        <p className="text-lg text-(--secondary) leading-relaxed">
          Founded on the belief that technology should enable growth rather than
          hinder it, CorpSite bridges the gap between ambitious business goals
          and technical execution. We don't just write code; we engineer
          ecosystems that drive revenue, optimize operations, and secure your
          digital assets against tomorrow's threats.
        </p>

        <ul className="space-y-3 pt-4">
          {highlights.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-(--foreground)"
            >
              <CheckCircle className="w-6 h-6 text-success shrink-0" />
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50"></div>
        <div className="relative bg-(--card) border border-(--border) rounded-2xl p-8 shadow-lg">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
            <Lightbulb className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-(--foreground) mb-4">
            Our Vision
          </h3>
          <p className="text-(--secondary) leading-relaxed mb-6">
            To be the undisputed catalyst for digital transformation, empowering
            organizations worldwide to operate at the bleeding edge of
            technological innovation while maintaining absolute systemic
            reliability.
          </p>
          <div className="h-1 w-20 bg-primary rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
