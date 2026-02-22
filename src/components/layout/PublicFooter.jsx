import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  Linkedin,
  Youtube,
  Twitter,
  ChevronRight,
} from 'lucide-react';
import { Button, Input, Logo } from '../../components';
import { useGetMenuBySlugQuery } from '../../features/menu/menuApi';

// Helper for formatting URLs
const getLinkPath = (url) => {
  if (!url) return '/';
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/${url}`;
};

const FooterLink = ({ to, children }) => {
  const isExternal = to.startsWith('http');
  const baseClass =
    'block text-sm text-slate-300 hover:text-white mb-3.5 font-medium relative group w-fit';

  const content = (
    <>
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
    </>
  );

  return isExternal ? (
    <a
      href={to}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClass}
    >
      {content}
    </a>
  ) : (
    <Link to={to} className={baseClass}>
      {content}
    </Link>
  );
};

const FooterSection = ({ title, children, className = '' }) => (
  <div className={className}>
    {title && (
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-5">
        {title}
      </h4>
    )}
    {children}
  </div>
);

const PublicFooter = () => {
  const headerSlug = 'main-footer';
  const { data: menuData, isLoading } = useGetMenuBySlugQuery(headerSlug, {
    skip: !headerSlug,
  });

  const menuItems = menuData?.data?.items || [];

  return (
    <footer className="bg-[#0b1121] text-slate-300 relative overflow-hidden pt-20 pb-10">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-1/4 -right-1/4 w-[60%] h-[150%] bg-slate-900/40 transform -skew-x-12" />
        <div className="absolute bottom-0 left-10 w-32 h-1 bg-cyan-500/30 blur-sm" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-14">
          {/* FIX: Forced the logo to stay light regardless of theme */}
          <div className="brightness-0 invert">
            <Logo size={50} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-4 w-24 bg-slate-800 rounded animate-pulse"></div>
                  <div className="space-y-3 pt-2">
                    <div className="h-3 w-32 bg-slate-800/50 rounded animate-pulse"></div>
                    <div className="h-3 w-28 bg-slate-800/50 rounded animate-pulse"></div>
                    <div className="h-3 w-36 bg-slate-800/50 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : (
              <>
                {menuItems.map((item) => (
                  <div key={item._id} className="space-y-12">
                    {item.children && item.children.length > 0 ? (
                      <FooterSection title={item.label}>
                        {item.children.map((child) => (
                          <FooterLink
                            key={child._id}
                            to={getLinkPath(child.url)}
                          >
                            {child.label}
                          </FooterLink>
                        ))}
                      </FooterSection>
                    ) : (
                      <FooterSection title={item.label}>
                        <FooterLink to={getLinkPath(item.url)}>
                          {item.label}
                        </FooterLink>
                      </FooterSection>
                    )}
                  </div>
                ))}
                <div className="space-y-12">
                  <FooterSection title="Contact & Locations">
                    <div className="space-y-4 pt-1">
                      <a
                        href="/locations"
                        className="flex items-center gap-3 text-sm text-slate-300 hover:text-white group"
                      >
                        <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                        Locations
                      </a>
                      <a
                        href="/contact"
                        className="flex items-center gap-3 text-sm text-slate-300 hover:text-white group"
                      >
                        <Mail className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                        Contact Support
                      </a>
                    </div>
                  </FooterSection>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-10 lg:pt-0 lg:pl-10 flex flex-col justify-between">
            <div className="space-y-8 mb-12 lg:mb-0">
              <h3 className="text-2xl text-white font-light leading-snug">
                Stay ahead of emerging threats so you can stay on-top of new
                opportunities.
              </h3>
              <Button
                variant="ghost"
                onClick={() => (window.location.href = '/contact')}
                className="border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 rounded-none px-6 py-3 tracking-widest text-xs font-semibold transition-all"
                text="CONNECT WITH US"
                icon={<ChevronRight className="w-4 h-4" />}
                iconPosition="right"
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-base text-white font-light">
                Subscribe to Marketing News and Events
              </h4>
              <div className="flex flex-col sm:flex-row gap-0 items-end">
                <div className="grow w-full">
                  <Input
                    placeholder="Email*"
                    className="w-full"
                    inputClassName="bg-white text-slate-900 border-none rounded-none px-4 py-2.5 focus:ring-0 focus:outline-none h-[42px]"
                  />
                </div>
                <Button
                  variant="primary"
                  className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-slate-900 font-bold rounded-none h-10.5 px-8 whitespace-nowrap border-none"
                  text="SUBSCRIBE"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800/80 gap-6">
          <div className="flex items-center gap-5">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-600 hover:text-cyan-400"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-600 hover:text-cyan-400"
            >
              <Youtube className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-600 hover:text-cyan-400"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-xs text-slate-400">
            <Link
              to="/privacy"
              className="hover:text-white underline decoration-slate-600 underline-offset-4"
            >
              Privacy Policy
            </Link>
            <span className="hidden sm:inline text-slate-700">|</span>
            <Link
              to="/do-not-sell"
              className="hover:text-white underline decoration-slate-600 underline-offset-4"
            >
              Do Not Sell or Share My Personal Information
            </Link>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span>©{new Date().getFullYear()} CorpSite</span>
          </div>

          <div className="text-white opacity-90 hover:opacity-100 transition-opacity">
            {/* FIX: Forced the monogram logo to stay white */}
            <Logo
              iconOnly={true}
              size={40}
              className="text-white drop-shadow-lg brightness-0 invert"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
