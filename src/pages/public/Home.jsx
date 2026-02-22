import HomeHero from '../../components/home/HomeHero';
import FeaturesSection from '../../components/home/FeaturesSection';
import RecentPostsSection from '../../components/home/RecentPostsSection';
import ServicesSection from '../../components/home/ServicesSection';
import { CtaBlock } from '../../components';

const Home = () => {
  return (
    <div className="min-h-screen bg-(--background)">
      <HomeHero />
      <FeaturesSection />
      <ServicesSection />
      <RecentPostsSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
        <CtaBlock
          title="Ready to transform your technical infrastructure?"
          description="Join the industry leaders who trust CorpSite to engineer their digital future. Connect with our technical specialists today."
          primaryText="Schedule a Consultation"
          primaryLink="/contact"
          secondaryText="View Our Case Studies"
          secondaryLink="/solutions"
        />
      </div>
    </div>
  );
};

export default Home;
