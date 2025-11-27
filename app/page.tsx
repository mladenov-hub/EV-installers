import Image from "next/image";
import Link from "next/link";
import { Zap, Shield, DollarSign, MapPin, ArrowRight, Star, CheckCircle2, ChevronDown } from "lucide-react";
import ZipSearch from "@/components/ZipSearch";
import USAMap from "@/components/USAMap";

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

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-12">
          <div className="w-full max-w-3xl space-y-8 animate-fade-in-up">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md text-blue-100 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Tracking 14,203+ Active Installers
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
              The Future of Driving <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Starts at Home.
              </span>
            </h1>

            <p className="text-xl text-slate-200 leading-relaxed max-w-2xl">
              Stop searching. Start charging. Find top-rated, licensed electricians to install your Level 2 charger today.
            </p>

            {/* Zip Search Component */}
            <div className="pt-4">
              <ZipSearch />
              <p className="text-slate-400 text-sm mt-3 ml-2">
                Popular: <Link href="/installers/tx/austin" className="hover:text-white underline decoration-slate-500">Austin</Link>, <Link href="/installers/ca/los-angeles" className="hover:text-white underline decoration-slate-500">Los Angeles</Link>, <Link href="/installers/ny/new-york" className="hover:text-white underline decoration-slate-500">New York</Link>
              </p>
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

      {/* Brand Trust Section */}
      <div className="bg-slate-50 border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Trusted by owners of</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Text-based logos for simplicity and speed, replace with SVGs if available */}
            <span className="text-2xl font-bold text-slate-800">TESLA</span>
            <span className="text-2xl font-bold text-slate-800">RIVIAN</span>
            <span className="text-2xl font-bold text-slate-800">FORD</span>
            <span className="text-2xl font-bold text-slate-800">CHARGEPOINT</span>
            <span className="text-2xl font-bold text-slate-800">HYUNDAI</span>
          </div>
        </div>
      </div>

      {/* How It Works (Value Props) */}
      <section className="py-24 bg-white">
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
              title="Enter Your Zip Code"
              desc="We'll instantly match you with verified EV specialists in your specific neighborhood."
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

      {/* Browse by State Section */}
      <section id="locations" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Browse Installers by State</h2>
            <p className="text-xl text-slate-600">Select your state to find local professionals in your area.</p>
          </div>

          <div className="w-full flex justify-center relative bg-white rounded-3xl shadow-sm border border-slate-200 p-4 md:p-8 overflow-hidden">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            <USAMap />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Don't see your state? <Link href="/installers" className="text-blue-600 hover:underline">View all locations</Link>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Common Questions</h2>
            <p className="text-xl text-slate-600">Everything you need to know about home EV charging.</p>
          </div>

          <div className="space-y-6">
            <FaqItem
              question="How much does it cost to install a Level 2 charger?"
              answer="Installation costs typically range from $750 to $1,500, depending on your home's electrical panel capacity, the distance from the panel to the parking spot, and local permit fees."
            />
            <FaqItem
              question="Do I need a permit for a Tesla Wall Connector?"
              answer="Yes, almost all jurisdictions require an electrical permit for installing a dedicated 240V circuit and EV charger. Our verified installers handle the permitting process for you."
            />
            <FaqItem
              question="What is the difference between hardwired and NEMA 14-50?"
              answer="Hardwired connections are safer, more reliable, and allow for faster charging speeds (up to 48A). NEMA 14-50 outlets offer flexibility (you can unplug the charger) but are limited to 40A charging and require a GFCI breaker."
            />
            <FaqItem
              question="How long does installation take?"
              answer="Most standard installations are completed in 2-4 hours. However, if a panel upgrade is required, it may take a full day."
            />
          </div>

          <div className="mt-12 text-center">
            <Link href="/faq" className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1">
              View All FAQs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, desc, step }: { icon: any, title: string, desc: string, step: string }) {
  return (
    <div className="relative p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="absolute top-6 right-8 text-6xl font-bold text-slate-200 -z-10 select-none group-hover:text-blue-100 transition-colors">
        {step}
      </div>
      <div className="mb-6 p-4 bg-white rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 ring-1 ring-slate-200 shadow-sm">{icon}</div>
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

function FaqItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="border border-slate-200 rounded-xl p-6 hover:border-blue-200 transition-colors bg-slate-50">
      <h3 className="text-lg font-bold text-slate-900 mb-2">{question}</h3>
      <p className="text-slate-600">{answer}</p>
    </div>
  );
}