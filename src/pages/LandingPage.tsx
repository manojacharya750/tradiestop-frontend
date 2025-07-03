import React from 'react';
import { BuildingStorefrontIcon, CheckBadgeIcon, UsersIcon, WrenchScrewdriverIcon, MagnifyingGlassIcon, CalendarDaysIcon, CreditCardIcon } from '../components/icons';
import Footer from '../components/Footer';

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const StatItem: React.FC<{icon: React.ReactNode, value: string, label: string}> = ({ icon, value, label }) => (
    <div className="flex flex-col items-center text-center">
        <div className="text-blue-500">{icon}</div>
        <p className="text-4xl font-bold text-slate-800 mt-2">{value}</p>
        <p className="text-slate-500">{label}</p>
    </div>
);

const FeatureItem: React.FC<{icon: React.ReactNode, title: string, children: React.ReactNode}> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="text-blue-600 inline-block p-3 bg-blue-100 rounded-full mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600">{children}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, onSignUp }) => {
  return (
    <div className="bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center text-blue-600">
            <BuildingStorefrontIcon className="h-8 w-8 mr-2" />
            <span className="font-bold text-2xl">TradieStop</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onSignIn} className="text-slate-600 font-medium hover:text-blue-600">Sign In</button>
            <button onClick={onSignUp} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Sign Up</button>
          </div>
        </nav>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="bg-white">
            <div className="container mx-auto px-6 py-24 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900">
                    Find Trusted Tradies, <br/> Get The Job Done Right.
                </h1>
                <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
                    TradieStop is the easiest way to connect with skilled, vetted, and reliable tradespeople for any job, big or small.
                </p>
                <div className="mt-8">
                    <button onClick={onSignUp} className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105 text-lg">
                        Get Started for Free
                    </button>
                </div>
            </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
            <div className="container mx-auto px-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                     <StatItem icon={<WrenchScrewdriverIcon className="h-12 w-12"/>} value="1,200+" label="Verified Tradies" />
                     <StatItem icon={<UsersIcon className="h-12 w-12"/>} value="15,000+" label="Happy Clients" />
                     <StatItem icon={<CheckBadgeIcon className="h-12 w-12"/>} value="5,000+" label="Jobs Completed" />
                 </div>
            </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-slate-800">How It Works</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">A seamless experience from search to satisfaction in three easy steps.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <FeatureItem icon={<MagnifyingGlassIcon className="h-8 w-8"/>} title="1. Find Your Pro">
                        Search our network of qualified tradies. Filter by trade, location, and read genuine reviews.
                    </FeatureItem>
                     <FeatureItem icon={<CalendarDaysIcon className="h-8 w-8"/>} title="2. Book with Ease">
                        View availability, request a booking, and manage your schedule all in one place.
                    </FeatureItem>
                     <FeatureItem icon={<CreditCardIcon className="h-8 w-8"/>} title="3. Pay Securely">
                        Receive invoices and make secure payments directly through the platform once the job is done.
                    </FeatureItem>
                </div>
            </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-24">
            <div className="container mx-auto px-6 text-center">
                 <h2 className="text-4xl font-bold text-slate-800">Ready to Get Started?</h2>
                 <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                    Join thousands of homeowners and find the perfect tradie for your next project, or sign up as a professional to grow your business.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                     <button onClick={onSignUp} className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-base">
                        I'm looking for a Tradie
                    </button>
                     <button onClick={onSignUp} className="bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors text-base">
                        I am a Tradie
                    </button>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;