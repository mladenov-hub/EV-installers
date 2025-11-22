import Image from "next/image";
import Link from "next/link";
import { Zap, Shield, DollarSign, MapPin, ArrowRight, Star } from "lucide-react";

// The Architect (Claude 4.5 Sonnet)
// Component: Modern Homepage
// Task: High-conversion landing page with trust signals and clear navigation.

export default function Home() {
  const popularCities = [
    { city: "Austin", state: "TX" },
    { city: "San-Francisco", state: "CA" },
    { city: "Miami", state: "FL" },
    { city: "New-York", state: "NY" },
    { city: "Los-Angeles", state: "CA" },
    { city: "Seattle", state: "WA" },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[600px] w-full overflow-hidden">
        <Image
          src="/images/hero-bg.png"
          alt="Modern EV Charging Station"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-3xl space-y-6 animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-600/20 border border-blue-400 text-blue-100 text-sm font-medium backdrop-blur-sm">
              #1 Network for EV Charger Installation
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              The Future of Driving <br />
              <span className="text-blue-400">Starts at Home.</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Find top-rated, licensed electricians to install your Level 2 charger.
              Compare quotes, check availability, and get powered up fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="#locations"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-8 rounded-full transition-all transform hover:scale-105 flex items-center gap-2"
              >
                Find an Installer <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Value Props */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-yellow-500" />}
              title="Fast Installation"
              desc="Most pros can schedule your installation within 48 hours. Get powered up sooner."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-blue-500" />}
              title="Verified Professionals"
              desc="Every electrician in our network is licensed, insured, and vetted for EV expertise."
            />
            <FeatureCard
              icon={<DollarSign className="w-8 h-8 text-green-500" />}
              title="Upfront Pricing"
              desc="No hidden fees. Compare transparent quotes from multiple local installers."
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/trust-electrician.png"
                  alt="Professional Electrician"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100 max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <span className="font-bold text-slate-900">5.0</span>
                </div>
                <p className="text-slate-600 text-sm">"The installer was professional, on time, and did a clean job. Highly recommend!"</p>
                <p className="text-slate-400 text-xs mt-2">- Sarah J., Tesla Owner</p>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl font-bold text-slate-900">
                Don&apos;t Trust Your Home to <br />
                <span className="text-blue-600">Just Anyone.</span>
              </h2>
              <p className="text-lg text-slate-600">
                EV chargers draw a significant amount of power. Improper installation can lead to fire hazards, breaker trips, and voided warranties.
              </p>
              <ul className="space-y-4">
                <CheckItem text="NEMA 14-50 Outlet Installation" />
                <CheckItem text="Hardwired Wall Connector Setup" />
                <CheckItem text="Panel Upgrades & Load Management" />
                <CheckItem text="Permit Handling & Inspection" />
              </ul>
              <Link href="/safety" className="mt-8 text-blue-600 font-semibold flex items-center gap-2 hover:gap-4 transition-all">
                Learn more about safety <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Grid - Horizontal Scroll */}
      <div id="locations" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Installers Near You</h2>
            <p className="text-xl text-gray-600">Connecting you with top-rated professionals in major cities across the US.</p>
          </div>

          <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory hide-scrollbar">
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
            ].map((loc) => (
              <Link
                key={loc.city}
                href={`/installers/${loc.state.toLowerCase()}/${loc.city.toLowerCase().replace(" ", "-")}`}
                className="flex-none w-72 group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 snap-center"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                <img
                  src={loc.img}
                  alt={`${loc.city} Skyline`}
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-1">{loc.city}</h3>
                  <p className="text-blue-200 font-medium">{loc.state}</p>
                  <div className="mt-4 flex items-center text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    View Installers <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 text-gray-500 text-sm">
            Scroll to see more locations →
          </div>
        </div>
      </div>


    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 p-3 bg-slate-50 rounded-xl w-fit">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{desc}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-green-600" />
      </div>
      <span className="text-slate-700 font-medium">{text}</span>
    </div>
  );
}
