import { ShieldCheck, Zap, Users, Globe } from 'lucide-react';

const ValuesSection = () => {
  const values = [
    {
      icon: Zap,
      title: 'Relentless Innovation',
      description:
        'We continuously adopt emerging technologies to build future-proof solutions that keep you ahead of the curve.',
    },
    {
      icon: ShieldCheck,
      title: 'Uncompromising Security',
      description:
        'Security is not an afterthought; it is woven into the very fabric of every line of code we deploy.',
    },
    {
      icon: Users,
      title: 'Radical Collaboration',
      description:
        'We operate as an extension of your team, ensuring total alignment, transparent communication, and shared success.',
    },
    {
      icon: Globe,
      title: 'Global Perspective',
      description:
        'Our diverse, distributed talent pool brings multifaceted perspectives to solve localized and global challenges.',
    },
  ];

  return (
    <section>
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-(--foreground) mb-4">
          The DNA of CorpSite
        </h2>
        <p className="text-(--secondary) text-lg">
          Our core values dictate every architectural decision, every line of
          code, and every client interaction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {values.map((value, idx) => (
          <div
            key={idx}
            className="group p-8 bg-(--card) border border-(--border) rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-14 h-14 bg-(--background) border border-(--border) rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/10">
              <value.icon className="w-7 h-7 text-(--foreground) group-hover:text-primary" />
            </div>
            <h3 className="text-xl font-bold text-(--foreground) mb-3">
              {value.title}
            </h3>
            <p className="text-(--secondary) leading-relaxed">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ValuesSection;
