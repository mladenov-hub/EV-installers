import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand */}
                <div className="col-span-1 md:col-span-2">
                    <Link href="/" className="text-2xl font-bold text-white mb-4 block">
                        Antigravity<span className="text-blue-500">.</span>
                    </Link>
                    <p className="text-sm max-w-sm">
                        Connecting EV owners with verified, licensed electricians for safe and efficient home charging station installation.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-bold mb-4">Platform</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-white transition-colors">Find Installers</Link></li>
                        <li><Link href="/admin/dashboard" className="hover:text-white transition-colors">Installer Login</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h3 className="text-white font-bold mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-xs text-center">
                <p>&copy; {new Date().getFullYear()} Antigravity EV Installers. All rights reserved.</p>
                <p className="mt-2 text-slate-600">
                    Disclaimer: We are a directory service and do not perform installations directly.
                    Amazon links are affiliate links that support this platform.
                </p>
            </div>
        </footer>
    );
}
