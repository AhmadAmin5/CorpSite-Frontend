import { ArrowRight, Terminal, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../';

const HomeHero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-(--background) pt-24 pb-16 lg:pt-36 lg:pb-16 border-b border-(--border)">
      {/* Background Gradients */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--secondary)/10 border border-(--border) text-sm font-medium text-(--foreground) mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="flex h-2 w-2 rounded-full bg-primary"></span>
          CorpSite Engine v2.0 is now live
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-(--foreground) tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          Next-Generation <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-400">
            Enterprise Engineering
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-(--secondary) mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          We architect, build, and scale resilient software ecosystems for
          forward-thinking companies. Transform your technical debt into a
          decisive competitive advantage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Button
            size="lg"
            onClick={() => navigate('/services')}
            text="Explore Services"
            icon={<ArrowRight />}
            iconPosition="right"
            className="w-full sm:w-auto text-lg px-8 py-4 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all"
          />
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate('/about')}
            text="Our Methodology"
            className="w-full sm:w-auto text-lg px-8 py-4 border border-(--border) bg-(--card) hover:bg-(--secondary)/10"
          />
        </div>

        {/* Feature Ticker */}
        <div className="mt-20 pt-10 border-t border-(--border)/50 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-(--foreground)">
                Clean Architecture
              </h3>
              <p className="text-sm text-(--secondary)">
                Scalable and maintainable codebases.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10 text-success">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-(--foreground)">
                Zero-Trust Security
              </h3>
              <p className="text-sm text-(--secondary)">
                Military-grade infrastructure protection.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent/10 text-accent">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-(--foreground)">
                High Performance
              </h3>
              <p className="text-sm text-(--secondary)">
                Optimized for speed and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
