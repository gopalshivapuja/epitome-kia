import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, Linkedin, Twitter, Phone, Mail, MapPin } from 'lucide-react'
import { COMPANY_INFO, LOCATIONS, SOCIAL_LINKS, QUICK_LINKS } from '@/lib/company-data'

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="block">
              <Image
                src={COMPANY_INFO.logo}
                alt={COMPANY_INFO.brand}
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              {COMPANY_INFO.description}
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Models */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6">Models</h3>
            <ul className="space-y-3">
              <li><Link href="/models/seltos" className="text-gray-400 hover:text-white transition-colors text-sm">Kia Seltos</Link></li>
              <li><Link href="/models/sonet" className="text-gray-400 hover:text-white transition-colors text-sm">Kia Sonet</Link></li>
              <li><Link href="/models/carens" className="text-gray-400 hover:text-white transition-colors text-sm">Kia Carens</Link></li>
              <li><Link href="/models/ev6" className="text-gray-400 hover:text-white transition-colors text-sm">Kia EV6</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6">Corporate Office</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-kia-red shrink-0 mt-0.5" />
                <span className="text-gray-400">{LOCATIONS[0].address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-kia-red shrink-0" />
                <a href={`tel:${LOCATIONS[0].salesPhone[0]}`} className="text-gray-400 hover:text-white transition-colors">
                  {LOCATIONS[0].salesPhone[0]}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-kia-red shrink-0" />
                <a href={`mailto:${LOCATIONS[0].email}`} className="text-gray-400 hover:text-white transition-colors">
                  {LOCATIONS[0].email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
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
