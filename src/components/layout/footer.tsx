import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, Linkedin, Twitter } from 'lucide-react'
import { COMPANY_INFO, LOCATIONS, SOCIAL_LINKS } from '@/lib/company-data'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="block">
              <Image
                src={COMPANY_INFO.logo}
                alt={COMPANY_INFO.brand}
                width={140}
                height={45}
                className="h-8 w-auto brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {COMPANY_INFO.description}
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Models */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5">Models</h3>
            <ul className="space-y-3">
              <li><Link href="/models/seltos" className="text-gray-400 hover:text-white transition-colors text-sm">Kia Seltos</Link></li>
              <li><Link href="/models/sonet" className="text-gray-400 hover:text-white transition-colors text-sm">Kia Sonet</Link></li>
              <li><Link href="/models/carens" className="text-gray-400 hover:text-white transition-colors text-sm">Kia Carens</Link></li>
              <li><Link href="/models/ev6" className="text-gray-400 hover:text-white transition-colors text-sm">Kia EV6</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/test-drive" className="text-gray-400 hover:text-white transition-colors text-sm">Book Test Drive</Link></li>
              <li><Link href="/service" className="text-gray-400 hover:text-white transition-colors text-sm">Service Booking</Link></li>
              <li><Link href="/emi-calculator" className="text-gray-400 hover:text-white transition-colors text-sm">EMI Calculator</Link></li>
              <li><Link href="/offers" className="text-gray-400 hover:text-white transition-colors text-sm">Current Offers</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5">Contact</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-400">{LOCATIONS[0].address}</p>
              <a href={`tel:${LOCATIONS[0].salesPhone[0]}`} className="block text-gray-400 hover:text-white transition-colors">
                {LOCATIONS[0].salesPhone[0]}
              </a>
              <a href={`mailto:${LOCATIONS[0].email}`} className="block text-gray-400 hover:text-white transition-colors">
                {LOCATIONS[0].email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            {COMPANY_INFO.copyright}
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
