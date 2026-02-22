import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../components';

const CtaBlock = ({
  title = 'Ready to scale your technical infrastructure?',
  description = "Join hundreds of enterprises that trust CorpSite to engineer their digital future. Let's discuss how we can solve your most complex engineering challenges.",
  primaryText = 'Explore Our Solutions',
  primaryLink = '/solutions',
  secondaryText = 'Contact Sales',
  secondaryLink = '/contact',
}) => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-(--card) border border-(--border) px-6 py-16 md:py-20 md:px-12 text-center shadow-sm w-full my-12 duration-300">
      {/* Background visual accents - tailored to look great in both light and dark modes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-(--foreground)">
          {title}
        </h2>
        <p className="text-(--secondary) text-lg max-w-2xl mx-auto">
          {description}
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto shadow-md hover:scale-105 transition-transform"
            text={primaryText}
            onClick={() => navigate(primaryLink)}
          />
          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto border border-(--border) bg-(--background) hover:bg-(--secondary)/10"
            text={secondaryText}
            icon={<ArrowRight />}
            iconPosition="right"
            onClick={() => navigate(secondaryLink)}
          />
        </div>
      </div>
    </section>
  );
};

export default CtaBlock;
