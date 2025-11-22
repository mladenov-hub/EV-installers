import Image from "next/image";
import Link from "next/link";
import { Zap, Shield, DollarSign, MapPin, ArrowRight, Star, CheckCircle2 } from "lucide-react";

// The Architect (Claude 4.5 Sonnet)
// Component: Modern Homepage
// Task: High-conversion landing page with trust signals and clear navigation.

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[700px] w-full overflow-hidden">
        {/* Image with better positioning to show the car */}
        <Image
          src="/images/hero-bg.png"
          alt="Modern EV Charging Station"
          fill
          className="object-cover object-center"
          priority
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md text-blue-100 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              #1 Network for EV Charger Installation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
              The Future of Driving <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Starts at Home.
              </span>
            </h1>
            
            <p className="text-xl text-slate-200 max-w-2xl leading-relaxed">
              Stop searching. Start charging. Find top-rated, licensed electricians to install your Level 2 charger today. 
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="#locations"
                className="bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold py-4 px-8 rounded-full transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                Find an Installer <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-lg font-semibold py-4 px-8 rounded-full transition-all border border-white/10 flex items-center justify-center"
              >
                How it Works
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Verified Licenses
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Top Rated Pros
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works (Value Props) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Simple Process</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Get Powered Up in 3 Steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              step="01"
              icon={<MapPin className="w-8 h-8 text-blue-600" />}
              title="Choose Your Location"
              desc="Select your city to see a curated list of verified EV specialists in your area."
            />
            <FeatureCard
               step="02"
              icon={<Shield className="w-8 h-8 text-blue-600" />}
              title="Compare Quotes"
              desc="View profiles, read reviews, and request free quotes from multiple pros instantly."
            />
            <FeatureCard
               step="03"
              icon={<Zap className="w-8 h-8 text-blue-600" />}
              title="Install & Charge"
              desc="Hire your favorite pro and get your Level 2 charger installed in as little as 48 hours."
            />
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <div id="locations" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Popular Service Areas</h2>
            <p className="text-xl text-slate-600">Connecting you with top-rated professionals across the nation.</p>
          </div>

          {/* Responsive Grid Layout instead of Horizontal Scroll */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { city: "San Francisco", state: "CA", img: "/images/city-west.png" },
              { city: "Los Angeles", state: "CA", img: "/images/city-west.png" },
              { city: "New York", state: "NY", img: "/images/city-east.png" },
              { city: "Miami", state: "FL", img: "/images/city-west.png" },
              { city: "Austin", state: "TX", img: "/images/city-tech.png" },
              { city: "Seattle", state: "WA", img: "/images/city-west.png" },
              { city: "Denver", state: "CO", img: "/images/city-tech.png" },
              { city: "Phoenix", state: "AZ", img: "/images/city-west.png" },
              { city: "Boston", state: "MA", img: "/images/city-east.png" },
              { city: "Chicago", state: "IL", img: "/images/city-east.png" },
              { city: "Houston", state: "TX", img: "/images/city-tech.png" },
              { city: "Atlanta", state: "GA", img: "/images/city-east.png" },
            ].map((loc) => (
              <Link
                key={loc.city}
                // Robust URL generation: replace spaces with hyphens, handle casing
                href={`/installers/${loc.state.toLowerCase()}/${loc.city.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative h-64 overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10 opacity-90" />
                <Image
                  src={loc.img}
                  alt={`${loc.city} EV Installers`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{loc.city}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-slate-300 text-sm font-medium">{loc.state}</p>
                    <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/installers/tx/austin" className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1">
              View All Locations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative order-2 lg:order-1">
              <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
                <Image
                  src="/images/trust-electrician.png"
                  alt="Professional Electrician Installing EV Charger"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs animate-fade-in">
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="font-bold text-slate-900 ml-2">5.0</span>
                </div>
                <p className="text-slate-700 text-sm italic">"The installer was professional, on time, and did a clean job. Highly recommend!"</p>
                <div className="flex items-center gap-3 mt-4">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">SJ</div>
                    <p className="text-slate-500 text-xs font-medium">Sarah J. • Tesla Owner</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-8 order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                Don&apos;t Trust Your Home to <br />
                <span className="text-blue-600">Just Anyone.</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                EV chargers draw a significant amount of power—often more than your dryer or oven. Improper installation can lead to fire hazards, breaker trips, and voided warranties. Our network ensures you get it done right the first time.
              </p>
              <ul className="space-y-4">
                <CheckItem text="Certified NEMA 14-50 Installation" />
                <CheckItem text="Hardwired Wall Connector Setup" />
                <CheckItem text="Panel Upgrades & Load Calculations" />
                <CheckItem text="Permit Handling & Inspection Guarantee" />
              </ul>
              <Link href="/safety" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group">
                Learn more about safety protocols <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, desc, step }: { icon: any, title: string, desc: string, step: string }) {
  return (
    <div className="relative p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="absolute top-6 right-8 text-6xl font-bold text-slate-100 -z-10 select-none group-hover:text-blue-50 transition-colors">
          {step}
      </div>
      <div className="mb-6 p-4 bg-blue-50 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 ring-1 ring-blue-100">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 group">
      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
      <span className="text-slate-700 font-medium">{text}</span>
    </div>
  );
}