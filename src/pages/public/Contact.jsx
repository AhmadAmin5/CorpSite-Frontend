import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Hero, CtaBlock } from '../../components';
import ContactForm from '../../features/contact/components/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen bg-(--background) pb-20">
      <Hero
        title="Get in Touch"
        description="Have a question, need technical support, or want to discuss a new project? Our engineering team is ready to help you build the future."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* --- LEFT COLUMN: Contact Information --- */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-(--card) border border-(--border) rounded-3xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-(--foreground) mb-8">
                Contact Information
              </h3>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-(--foreground)">
                      Our Headquarters
                    </h4>
                    <p className="text-(--secondary) mt-1 leading-relaxed">
                      123 Engineering Blvd
                      <br />
                      Suite 400
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-success/10 rounded-xl text-success shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-(--foreground)">Phone</h4>
                    <p className="text-(--secondary) mt-1">+1 (555) 123-4567</p>
                    <p className="text-sm text-(--secondary) mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Mon-Fri, 8am - 6pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-xl text-accent shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-(--foreground)">
                      Email Support
                    </h4>
                    <p className="text-(--secondary) mt-1">
                      support@corpsite.com
                    </p>
                    <p className="text-sm text-(--secondary) mt-1">
                      We aim to respond within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Immediate Help Card */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-(--foreground) mb-3">
                Need Immediate Help?
              </h3>
              <p className="text-(--secondary) text-sm mb-5 leading-relaxed">
                For urgent technical support, existing enterprise clients can
                reach our 24/7 dedicated engineering incident hotline.
              </p>
              <a
                href="tel:+18005559999"
                className="inline-flex items-center gap-2 font-bold text-primary hover:text-primary/80"
              >
                <Phone className="w-5 h-5" /> 1-800-555-9999
              </a>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Contact Form --- */}
          <div className="lg:col-span-2">
            <div className="bg-(--card) border border-(--border) rounded-3xl p-8 md:p-12 shadow-sm h-full">
              <div className="mb-10 border-b border-(--border) pb-6">
                <h3 className="text-3xl font-bold text-(--foreground) mb-3">
                  Send us a message
                </h3>
                <p className="text-(--secondary) text-lg">
                  Fill out the form below and our technical team will get back
                  to you as soon as possible.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>

        {/* Call to Action Block */}
        <div className="mt-8">
          <CtaBlock
            title="Prefer to browse our solutions first?"
            description="Check out our comprehensive suite of enterprise-grade tools and services designed to scale your business."
            primaryText="View Solutions"
            primaryLink="/solutions"
            secondaryText="Read our Blog"
            secondaryLink="/blog"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
