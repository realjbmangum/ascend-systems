import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-gray-400 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <img src="/images/logo.png" alt="Ascend Systems" className="h-14" />
            <p className="mt-3 text-sm leading-relaxed max-w-sm">
              Custom software development, AI integrations, and business automation
              for mid-market companies ready to move faster.
            </p>
            <p className="mt-4 text-xs text-gray-500">
              {siteConfig.location} &middot; {siteConfig.company}
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white text-sm font-semibold mb-2">Get in Touch</h4>
              <p className="text-sm">{siteConfig.email}</p>
              <p className="text-sm">{siteConfig.phone}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-charcoal-light text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} {siteConfig.company}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
