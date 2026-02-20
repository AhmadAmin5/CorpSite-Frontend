import { Img } from '../../components';

const TeamSection = () => {
  const team = [
    {
      name: 'Sarah Jenkins',
      role: 'Chief Executive Officer',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'David Chen',
      role: 'Chief Technology Officer',
      image:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Head of Engineering',
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Marcus Thorne',
      role: 'VP of Product Strategy',
      image:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
    },
  ];

  return (
    <section>
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-(--foreground) mb-4">
          Leadership Team
        </h2>
        <p className="text-(--secondary) text-lg max-w-2xl">
          Led by industry veterans, our team combines decades of enterprise
          architecture experience with a passion for disruptive innovation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, idx) => (
          <div key={idx} className="flex flex-col group">
            <div className="relative overflow-hidden rounded-2xl aspect-3/4 mb-4 border border-(--border)">
              <Img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-lg font-bold text-(--foreground)">
              {member.name}
            </h3>
            <p className="text-sm font-medium text-primary">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
