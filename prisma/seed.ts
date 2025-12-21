import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.adminUser.deleteMany()
  await prisma.aIContentReview.deleteMany()
  await prisma.aIContentDraft.deleteMany()
  await prisma.chatMessage.deleteMany()
  await prisma.chatSession.deleteMany()
  await prisma.pickupRequest.deleteMany()
  await prisma.serviceBooking.deleteMany()
  await prisma.testDriveRequest.deleteMany()
  await prisma.customerLead.deleteMany()
  await prisma.fAQ.deleteMany()
  await prisma.page.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.offer.deleteMany()
  await prisma.specification.deleteMany()
  await prisma.variant.deleteMany()
  await prisma.carModel.deleteMany()
  await prisma.dealerLocation.deleteMany()

  console.log('Creating admin users...')

  // Create admin users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const staffPassword = await bcrypt.hash('staff123', 10)

  await prisma.adminUser.createMany({
    data: [
      {
        email: 'admin@epitomekia.com',
        passwordHash: adminPassword,
        fullName: 'Admin User',
        role: 'admin',
        isActive: true,
      },
      {
        email: 'sales@epitomekia.com',
        passwordHash: staffPassword,
        fullName: 'Sales Manager',
        role: 'sales_manager',
        isActive: true,
      },
      {
        email: 'service@epitomekia.com',
        passwordHash: staffPassword,
        fullName: 'Service Advisor',
        role: 'service_advisor',
        isActive: true,
      },
    ],
  })

  console.log('Creating dealer locations...')

  // Create dealer locations
  const mainShowroom = await prisma.dealerLocation.create({
    data: {
      name: 'Epitome Kia - Main Showroom',
      slug: 'main-showroom',
      addressLine1: '123 Auto Plaza',
      addressLine2: 'Near City Center',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'IN',
      phone: '+91 22 1234 5678',
      email: 'sales@epitomekia.com',
      latitude: 19.076,
      longitude: 72.8777,
      hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
      isActive: true,
    },
  })

  const serviceCenter = await prisma.dealerLocation.create({
    data: {
      name: 'Epitome Kia - Service Center',
      slug: 'service-center',
      addressLine1: '456 Industrial Area',
      addressLine2: 'Phase 2',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400002',
      country: 'IN',
      phone: '+91 22 1234 5679',
      email: 'service@epitomekia.com',
      latitude: 19.086,
      longitude: 72.8877,
      hours: 'Mon-Sat: 8AM-7PM',
      isActive: true,
    },
  })

  console.log('Creating car models...')

  // Create Kia Seltos
  const seltos = await prisma.carModel.create({
    data: {
      name: 'Kia Seltos',
      slug: 'seltos',
      modelYear: 2024,
      description:
        'The Kia Seltos is a bold and sophisticated compact SUV that combines premium design, cutting-edge technology, and powerful performance. With its distinctive tiger-nose grille and LED lighting, the Seltos makes a strong statement on the road.',
      isActive: true,
    },
  })

  // Seltos Variants
  const seltosHTE = await prisma.variant.create({
    data: {
      carModelId: seltos.id,
      name: 'HTE',
      slug: 'seltos-hte',
      trimLevel: 'Base',
      basePrice: 1090000,
      isActive: true,
    },
  })

  const seltosHTK = await prisma.variant.create({
    data: {
      carModelId: seltos.id,
      name: 'HTK',
      slug: 'seltos-htk',
      trimLevel: 'Mid',
      basePrice: 1250000,
      isActive: true,
    },
  })

  const seltosHTX = await prisma.variant.create({
    data: {
      carModelId: seltos.id,
      name: 'HTX',
      slug: 'seltos-htx',
      trimLevel: 'Top',
      basePrice: 1450000,
      isActive: true,
    },
  })

  const seltosGTX = await prisma.variant.create({
    data: {
      carModelId: seltos.id,
      name: 'GTX+',
      slug: 'seltos-gtx-plus',
      trimLevel: 'Premium',
      basePrice: 1790000,
      isActive: true,
    },
  })

  // Seltos Specifications
  const seltosSpecs = [
    { variantId: seltosHTE.id, specKey: 'engine', specValue: '1.5L Smartstream Petrol', unit: null },
    { variantId: seltosHTE.id, specKey: 'power', specValue: '115', unit: 'PS' },
    { variantId: seltosHTE.id, specKey: 'torque', specValue: '144', unit: 'Nm' },
    { variantId: seltosHTE.id, specKey: 'transmission', specValue: '6-Speed Manual', unit: null },
    { variantId: seltosHTE.id, specKey: 'fuel_type', specValue: 'Petrol', unit: null },
    { variantId: seltosHTE.id, specKey: 'mileage', specValue: '16.8', unit: 'kmpl' },
    { variantId: seltosHTE.id, specKey: 'seating_capacity', specValue: '5', unit: 'persons' },
    { variantId: seltosHTE.id, specKey: 'boot_space', specValue: '433', unit: 'L' },
    { variantId: seltosGTX.id, specKey: 'engine', specValue: '1.5L Turbo Petrol', unit: null },
    { variantId: seltosGTX.id, specKey: 'power', specValue: '160', unit: 'PS' },
    { variantId: seltosGTX.id, specKey: 'torque', specValue: '253', unit: 'Nm' },
    { variantId: seltosGTX.id, specKey: 'transmission', specValue: '7-Speed DCT', unit: null },
    { variantId: seltosGTX.id, specKey: 'fuel_type', specValue: 'Petrol', unit: null },
    { variantId: seltosGTX.id, specKey: 'mileage', specValue: '16.5', unit: 'kmpl' },
    { variantId: seltosGTX.id, specKey: 'seating_capacity', specValue: '5', unit: 'persons' },
    { variantId: seltosGTX.id, specKey: 'sunroof', specValue: 'Panoramic', unit: null },
    { variantId: seltosGTX.id, specKey: 'display', specValue: '10.25 inch Touchscreen', unit: null },
  ]

  await prisma.specification.createMany({ data: seltosSpecs })

  // Create Kia Sonet
  const sonet = await prisma.carModel.create({
    data: {
      name: 'Kia Sonet',
      slug: 'sonet',
      modelYear: 2024,
      description:
        'The Kia Sonet is a wild and capable compact SUV designed for urban adventures. With its bold styling, connected car technology, and versatile features, the Sonet is perfect for those who want to stand out.',
      isActive: true,
    },
  })

  // Sonet Variants
  const sonetHTE = await prisma.variant.create({
    data: {
      carModelId: sonet.id,
      name: 'HTE',
      slug: 'sonet-hte',
      trimLevel: 'Base',
      basePrice: 799000,
      isActive: true,
    },
  })

  const sonetHTK = await prisma.variant.create({
    data: {
      carModelId: sonet.id,
      name: 'HTK+',
      slug: 'sonet-htk-plus',
      trimLevel: 'Mid',
      basePrice: 999000,
      isActive: true,
    },
  })

  const sonetHTX = await prisma.variant.create({
    data: {
      carModelId: sonet.id,
      name: 'HTX+',
      slug: 'sonet-htx-plus',
      trimLevel: 'Top',
      basePrice: 1199000,
      isActive: true,
    },
  })

  const sonetGTX = await prisma.variant.create({
    data: {
      carModelId: sonet.id,
      name: 'GTX+',
      slug: 'sonet-gtx-plus',
      trimLevel: 'Premium',
      basePrice: 1499000,
      isActive: true,
    },
  })

  // Sonet Specifications
  const sonetSpecs = [
    { variantId: sonetHTE.id, specKey: 'engine', specValue: '1.2L Smartstream Petrol', unit: null },
    { variantId: sonetHTE.id, specKey: 'power', specValue: '83', unit: 'PS' },
    { variantId: sonetHTE.id, specKey: 'torque', specValue: '115', unit: 'Nm' },
    { variantId: sonetHTE.id, specKey: 'transmission', specValue: '5-Speed Manual', unit: null },
    { variantId: sonetHTE.id, specKey: 'fuel_type', specValue: 'Petrol', unit: null },
    { variantId: sonetHTE.id, specKey: 'mileage', specValue: '18.4', unit: 'kmpl' },
    { variantId: sonetGTX.id, specKey: 'engine', specValue: '1.0L Turbo GDi Petrol', unit: null },
    { variantId: sonetGTX.id, specKey: 'power', specValue: '120', unit: 'PS' },
    { variantId: sonetGTX.id, specKey: 'torque', specValue: '172', unit: 'Nm' },
    { variantId: sonetGTX.id, specKey: 'transmission', specValue: '7-Speed DCT', unit: null },
    { variantId: sonetGTX.id, specKey: 'fuel_type', specValue: 'Petrol', unit: null },
    { variantId: sonetGTX.id, specKey: 'mileage', specValue: '18.2', unit: 'kmpl' },
  ]

  await prisma.specification.createMany({ data: sonetSpecs })

  // Create Kia Carens
  const carens = await prisma.carModel.create({
    data: {
      name: 'Kia Carens',
      slug: 'carens',
      modelYear: 2024,
      description:
        'The Kia Carens is a recreational vehicle designed for families who love to travel together. With three rows of spacious seating, premium features, and versatile configurations, the Carens is the perfect companion for memorable journeys.',
      isActive: true,
    },
  })

  // Carens Variants
  const carensPremium = await prisma.variant.create({
    data: {
      carModelId: carens.id,
      name: 'Premium',
      slug: 'carens-premium',
      trimLevel: 'Base',
      basePrice: 1052000,
      isActive: true,
    },
  })

  const carensPrestige = await prisma.variant.create({
    data: {
      carModelId: carens.id,
      name: 'Prestige',
      slug: 'carens-prestige',
      trimLevel: 'Mid',
      basePrice: 1299000,
      isActive: true,
    },
  })

  const carensLuxury = await prisma.variant.create({
    data: {
      carModelId: carens.id,
      name: 'Luxury',
      slug: 'carens-luxury',
      trimLevel: 'Top',
      basePrice: 1599000,
      isActive: true,
    },
  })

  const carensLuxuryPlus = await prisma.variant.create({
    data: {
      carModelId: carens.id,
      name: 'Luxury Plus',
      slug: 'carens-luxury-plus',
      trimLevel: 'Premium',
      basePrice: 1799000,
      isActive: true,
    },
  })

  // Carens Specifications
  const carensSpecs = [
    { variantId: carensPremium.id, specKey: 'engine', specValue: '1.5L Smartstream Petrol', unit: null },
    { variantId: carensPremium.id, specKey: 'power', specValue: '115', unit: 'PS' },
    { variantId: carensPremium.id, specKey: 'torque', specValue: '144', unit: 'Nm' },
    { variantId: carensPremium.id, specKey: 'transmission', specValue: '6-Speed Manual', unit: null },
    { variantId: carensPremium.id, specKey: 'seating_capacity', specValue: '6', unit: 'persons' },
    { variantId: carensLuxuryPlus.id, specKey: 'engine', specValue: '1.5L Turbo Petrol', unit: null },
    { variantId: carensLuxuryPlus.id, specKey: 'power', specValue: '160', unit: 'PS' },
    { variantId: carensLuxuryPlus.id, specKey: 'torque', specValue: '253', unit: 'Nm' },
    { variantId: carensLuxuryPlus.id, specKey: 'transmission', specValue: '7-Speed DCT', unit: null },
    { variantId: carensLuxuryPlus.id, specKey: 'seating_capacity', specValue: '7', unit: 'persons' },
    { variantId: carensLuxuryPlus.id, specKey: 'sunroof', specValue: 'Single Pane', unit: null },
  ]

  await prisma.specification.createMany({ data: carensSpecs })

  // Create Kia EV6
  const ev6 = await prisma.carModel.create({
    data: {
      name: 'Kia EV6',
      slug: 'ev6',
      modelYear: 2024,
      description:
        'The Kia EV6 is a groundbreaking all-electric crossover that redefines sustainable mobility. With its stunning design, ultra-fast charging capability, and impressive range, the EV6 represents the future of driving.',
      isActive: true,
    },
  })

  // EV6 Variants
  const ev6GT = await prisma.variant.create({
    data: {
      carModelId: ev6.id,
      name: 'GT Line AWD',
      slug: 'ev6-gt-line-awd',
      trimLevel: 'Premium',
      basePrice: 6095000,
      isActive: true,
    },
  })

  // EV6 Specifications
  const ev6Specs = [
    { variantId: ev6GT.id, specKey: 'motor', specValue: 'Dual Motor AWD', unit: null },
    { variantId: ev6GT.id, specKey: 'power', specValue: '325', unit: 'PS' },
    { variantId: ev6GT.id, specKey: 'torque', specValue: '605', unit: 'Nm' },
    { variantId: ev6GT.id, specKey: 'battery', specValue: '77.4', unit: 'kWh' },
    { variantId: ev6GT.id, specKey: 'range', specValue: '528', unit: 'km' },
    { variantId: ev6GT.id, specKey: 'charging_time', specValue: '18 min (10-80%)', unit: null },
    { variantId: ev6GT.id, specKey: '0_to_100', specValue: '5.2', unit: 'seconds' },
    { variantId: ev6GT.id, specKey: 'drive_type', specValue: 'All Wheel Drive', unit: null },
  ]

  await prisma.specification.createMany({ data: ev6Specs })

  console.log('Creating offers...')

  // Create Offers
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())

  await prisma.offer.createMany({
    data: [
      {
        carModelId: seltos.id,
        title: 'Seltos Year-End Bonanza',
        slug: 'seltos-year-end-bonanza',
        description:
          'Get up to ₹75,000 off on Kia Seltos! Includes exchange bonus, corporate discount, and free accessories worth ₹25,000.',
        startAt: now,
        endAt: nextMonth,
        isActive: true,
      },
      {
        carModelId: sonet.id,
        title: 'Sonet Festival Special',
        slug: 'sonet-festival-special',
        description:
          'Drive home the Kia Sonet with benefits up to ₹50,000! Includes 3 years free service, extended warranty, and more.',
        startAt: now,
        endAt: nextMonth,
        isActive: true,
      },
      {
        carModelId: carens.id,
        title: 'Carens Family Package',
        slug: 'carens-family-package',
        description:
          'Special family offer on Kia Carens! Get free accessories worth ₹30,000, 5 years warranty, and attractive exchange bonus.',
        startAt: now,
        endAt: nextMonth,
        isActive: true,
      },
      {
        carModelId: ev6.id,
        title: 'EV6 Green Mobility Offer',
        slug: 'ev6-green-mobility-offer',
        description:
          'Switch to electric with exclusive benefits! Free home charger installation, 8 years battery warranty, and complimentary first year insurance.',
        startAt: now,
        endAt: nextMonth,
        isActive: true,
      },
      {
        variantId: seltosGTX.id,
        title: 'Seltos GTX+ Special Edition',
        slug: 'seltos-gtx-plus-special',
        description:
          'Exclusive offer on Seltos GTX+! Get ₹1 lakh off with exchange, 5 years extended warranty, and premium accessories kit.',
        startAt: now,
        endAt: nextMonth,
        isActive: true,
      },
    ],
  })

  console.log('Creating pages and FAQs...')

  // Create Pages
  const testDrivePage = await prisma.page.create({
    data: {
      title: 'Book a Test Drive',
      slug: 'test-drive',
      content: 'Experience the Kia difference with a personalized test drive.',
      seoTitle: 'Book a Test Drive | Epitome Kia',
      seoDescription:
        'Schedule a test drive at Epitome Kia and experience our range of vehicles.',
      isPublished: true,
      publishedAt: now,
    },
  })

  const servicePage = await prisma.page.create({
    data: {
      title: 'Service & Maintenance',
      slug: 'service',
      content: 'Keep your Kia running at its best with our expert service team.',
      seoTitle: 'Service & Maintenance | Epitome Kia',
      seoDescription:
        'Book service appointments and maintenance for your Kia at Epitome Kia service center.',
      isPublished: true,
      publishedAt: now,
    },
  })

  // Create FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        pageId: testDrivePage.id,
        question: 'How long does a test drive take?',
        answer:
          'A typical test drive takes about 30-45 minutes, including time for a brief orientation of the vehicle features.',
        displayOrder: 1,
        isActive: true,
      },
      {
        pageId: testDrivePage.id,
        question: 'What documents do I need for a test drive?',
        answer:
          'You will need a valid driving license. We recommend bringing a government-issued ID as well.',
        displayOrder: 2,
        isActive: true,
      },
      {
        pageId: servicePage.id,
        question: 'How often should I service my Kia?',
        answer:
          'We recommend servicing your Kia every 10,000 km or 12 months, whichever comes first.',
        displayOrder: 1,
        isActive: true,
      },
      {
        pageId: servicePage.id,
        question: 'Do you offer pickup and drop service?',
        answer:
          'Yes! We offer complimentary pickup and drop service within a 10 km radius of our service center.',
        displayOrder: 2,
        isActive: true,
      },
    ],
  })

  console.log('Creating blog posts...')

  // Create Blog Posts
  await prisma.blogPost.createMany({
    data: [
      {
        title: '2024 Kia Seltos: Everything You Need to Know',
        slug: '2024-kia-seltos-guide',
        summary:
          'A comprehensive guide to the 2024 Kia Seltos, covering features, variants, and why it\'s the perfect SUV for Indian roads.',
        content:
          'The 2024 Kia Seltos continues to set the benchmark for compact SUVs in India...',
        authorName: 'Epitome Kia Team',
        isPublished: true,
        publishedAt: now,
      },
      {
        title: '5 Tips for Maintaining Your Kia During Monsoon',
        slug: 'monsoon-maintenance-tips',
        summary:
          'Essential tips to keep your Kia in top condition during the rainy season.',
        content:
          'The monsoon season can be challenging for vehicles. Here are our top tips...',
        authorName: 'Service Team',
        isPublished: true,
        publishedAt: now,
      },
      {
        title: 'Why the Kia EV6 is Leading the Electric Revolution',
        slug: 'kia-ev6-electric-revolution',
        summary:
          'Discover how the Kia EV6 is changing the game in the electric vehicle segment.',
        content:
          'Electric vehicles are the future, and the Kia EV6 is at the forefront...',
        authorName: 'Epitome Kia Team',
        isPublished: true,
        publishedAt: now,
      },
    ],
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
