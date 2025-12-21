import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const footerLinks = {
  models: [
    { name: 'Seltos', href: '/models/seltos' },
    { name: 'Sonet', href: '/models/sonet' },
    { name: 'Carens', href: '/models/carens' },
    { name: 'EV6', href: '/models/ev6' },
    { name: 'Carnival', href: '/models/carnival' },
  ],
  services: [
    { name: 'Book a Service', href: '/service' },
    { name: 'Pickup & Drop', href: '/service#pickup' },
    { name: 'Genuine Parts', href: '/parts' },
    { name: 'Warranty', href: '/warranty' },
    { name: 'Roadside Assistance', href: '/roadside-assistance' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Locations', href: '/locations' },
    { name: 'Careers', href: '/careers' },
    { name: 'News & Events', href: '/blog' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'YouTube', href: '#', icon: Youtube },
]

export function Footer() {
  return (
    <footer className="border-t bg-kia-black text-white">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <div className="flex h-12 w-24 items-center justify-center rounded bg-kia-red">
                <span className="text-2xl font-bold tracking-wider text-white">KIA</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Epitome Kia - Your trusted Kia dealership for new cars, service, and genuine parts.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a href="tel:+911234567890" className="flex items-center gap-2 text-gray-400 hover:text-white">
                <Phone className="h-4 w-4" />
                <span>+91 123 456 7890</span>
              </a>
              <a href="mailto:info@epitomekia.com" className="flex items-center gap-2 text-gray-400 hover:text-white">
                <Mail className="h-4 w-4" />
                <span>info@epitomekia.com</span>
              </a>
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>123 Auto Plaza, Main Road, City - 400001</span>
              </div>
            </div>
          </div>

          {/* Models */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Models</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.models.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Services</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Stay Connected</h3>
            <p className="mt-4 text-sm text-gray-400">
              Follow us for latest updates, offers, and news.
            </p>
            <div className="mt-4 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Epitome Kia. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
