import { Metadata } from 'next'
import { COMPANY_INFO, LOCATIONS } from '@/lib/company-data'

export const metadata: Metadata = {
  title: 'Terms of Service | Epitome Kia',
  description: 'Terms and conditions for using Epitome Kia website and services.',
}

export default function TermsOfServicePage() {
  const lastUpdated = 'December 2024'
  const primaryLocation = LOCATIONS[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-kia-midnight text-white py-16 pt-32">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-300">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using this website operated by {COMPANY_INFO.name} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Company&rdquo;), 
              you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">2. Description of Services</h2>
            <p className="text-gray-600 leading-relaxed">
              {COMPANY_INFO.brand} is an authorized dealer for Kia India. Through this website, we provide:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
              <li>Information about Kia vehicles and specifications</li>
              <li>Online test drive booking</li>
              <li>Service appointment scheduling</li>
              <li>EMI calculation tools</li>
              <li>Contact and inquiry forms</li>
              <li>Information about offers and promotions</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">3. User Responsibilities</h2>
            <p className="text-gray-600 leading-relaxed">When using our website and services, you agree to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
              <li>Provide accurate and complete information when filling out forms</li>
              <li>Not misuse or attempt to gain unauthorized access to our systems</li>
              <li>Not use the website for any unlawful purpose</li>
              <li>Not interfere with or disrupt the website&apos;s functionality</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">4. Test Drive Bookings</h2>
            <p className="text-gray-600 leading-relaxed">
              Test drive bookings made through our website are subject to the following conditions:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
              <li>Availability of the requested vehicle model</li>
              <li>Valid driving license required at the time of test drive</li>
              <li>Age requirement: 18 years or above</li>
              <li>We reserve the right to reschedule or cancel bookings</li>
              <li>Test drive routes and duration are at our discretion</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">5. Service Appointments</h2>
            <p className="text-gray-600 leading-relaxed">
              Service appointments are subject to the following terms:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
              <li>Appointments are confirmed upon receiving our confirmation</li>
              <li>Please arrive on time for your scheduled appointment</li>
              <li>Additional services may be recommended after vehicle inspection</li>
              <li>Pricing for services will be communicated before work begins</li>
              <li>Warranty terms are as per Kia India&apos;s official warranty policy</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">6. Pricing and Offers</h2>
            <p className="text-gray-600 leading-relaxed">
              All prices displayed on this website are indicative and subject to change. Please note:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
              <li>Ex-showroom prices do not include registration, insurance, or other charges</li>
              <li>Offers and promotions are valid for limited periods only</li>
              <li>Terms and conditions apply to all offers</li>
              <li>Final pricing will be confirmed at the time of purchase</li>
              <li>EMI calculations are for reference only and subject to bank approval</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the property of 
              {COMPANY_INFO.name} or Kia India and is protected by intellectual property laws. You may not reproduce, 
              distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed">
              This website is provided &ldquo;as is&rdquo; without any warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
              <li>The accuracy or completeness of information on this website</li>
              <li>Uninterrupted or error-free access to the website</li>
              <li>That the website will be free from viruses or harmful components</li>
              <li>The availability of specific vehicle models or colors</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              To the maximum extent permitted by law, {COMPANY_INFO.name} shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising from your use of this website or services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">10. Indemnification</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify and hold harmless {COMPANY_INFO.name}, its officers, directors, employees, and agents 
              from any claims, damages, losses, liabilities, and expenses arising from your use of this website or 
              violation of these terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">11. Third-Party Links</h2>
            <p className="text-gray-600 leading-relaxed">
              This website may contain links to third-party websites. We are not responsible for the content or 
              practices of these external sites. Accessing third-party links is at your own risk.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">12. Modifications to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective upon 
              posting to this website. Your continued use of the website after changes constitutes acceptance 
              of the modified terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">13. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of India. 
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts 
              in Bangalore, Karnataka.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">14. Severability</h2>
            <p className="text-gray-600 leading-relaxed">
              If any provision of these Terms of Service is found to be unenforceable or invalid, the remaining 
              provisions shall continue in full force and effect.
            </p>
          </section>

          <section className="mb-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-kia-midnight mb-4">15. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these Terms of Service, please contact us:
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

