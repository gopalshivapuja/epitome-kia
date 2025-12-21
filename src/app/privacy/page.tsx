import { Metadata } from 'next'
import { COMPANY_INFO, LOCATIONS } from '@/lib/company-data'

export const metadata: Metadata = {
  title: 'Privacy Policy | Epitome Kia',
  description: 'Learn how Epitome Kia collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'December 2024'
  const primaryLocation = LOCATIONS[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-kia-midnight text-white py-16 pt-32">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-300">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              {COMPANY_INFO.name} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
              visit our website, book a test drive, schedule a service, or interact with us in any way.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Personal Information</h3>
            <p className="text-gray-600 leading-relaxed">
              We may collect personal information that you voluntarily provide to us, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
              <li>Name, email address, and phone number</li>
              <li>Vehicle preferences and purchase intentions</li>
              <li>Service history and vehicle details</li>
              <li>Communication preferences</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-600 leading-relaxed">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website addresses</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
              <li>Process test drive bookings and service appointments</li>
              <li>Respond to inquiries and provide customer support</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">4. Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
              <li><strong>Kia India:</strong> As an authorized dealer, we share customer data with Kia India for warranty and service purposes</li>
              <li><strong>Service Providers:</strong> Third-party vendors who assist us in operating our business</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the 
              Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              Under applicable data protection laws, you have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">7. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website uses cookies to enhance your browsing experience. You can control cookies through 
              your browser settings. Disabling cookies may affect the functionality of some features on our website.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">8. Third-Party Links</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy 
              practices or content of these external sites. We encourage you to read the privacy policies of 
              any third-party sites you visit.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children. If you believe we have collected information from a child, 
              please contact us immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. The updated version will be indicated by 
              an updated &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">11. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="mt-4 space-y-2 text-gray-700">
              <p><strong>{COMPANY_INFO.name}</strong></p>
              <p>{primaryLocation.address}</p>
              <p>Email: <a href={`mailto:${primaryLocation.email}`} className="text-kia-red hover:underline">{primaryLocation.email}</a></p>
              <p>Phone: <a href={`tel:${primaryLocation.salesPhone[0]}`} className="text-kia-red hover:underline">{primaryLocation.salesPhone[0]}</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

