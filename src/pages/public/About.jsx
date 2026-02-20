import React from 'react';
import { Hero } from '../../components';
import MissionSection from '../../components/about/MissionSection';
import StatsSection from '../../components/about/StatsSection';
import ValuesSection from '../../components/about/ValuesSection';
import TeamSection from '../../components/about/TeamSection';
import CtaBlock from '../../components/block/CtaBlock';

const About = () => {
  return (
    <div className="min-h-screen bg-(--background) pb-20">
      <Hero
        title="Pioneering the Future of Digital Experiences"
        description="We are a global collective of engineers, designers, and strategists dedicated to building scalable, secure, and innovative tech solutions for modern enterprises."
      />

      <div className="flex flex-col gap-24 mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MissionSection />
        <StatsSection />
        <ValuesSection />
        <TeamSection />
        <CtaBlock />
      </div>
    </div>
  );
};

export default About;
