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
        email: 'admin@epitomekia.in',
        passwordHash: adminPassword,
        fullName: 'Admin User',
        role: 'admin',
        isActive: true,
      },
      {
        email: 'sales@epitomekia.in',
        passwordHash: staffPassword,
        fullName: 'Sales Manager',
        role: 'sales_manager',
        isActive: true,
      },
      {
        email: 'service@epitomekia.in',
        passwordHash: staffPassword,
        fullName: 'Service Advisor',
        role: 'service_advisor',
        isActive: true,
      },
    ],
  })

  console.log('Creating dealer locations (Bangalore)...')

  // Create dealer locations - matching company-data.ts
  const yelahanka = await prisma.dealerLocation.create({
    data: {
      name: 'Epitome Kia - Yelahanka',
      slug: 'yelahanka',
      addressLine1: '#99, New Airport Road',
      addressLine2: 'Yelahanka',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560064',
      country: 'IN',
      phone: '+91 78299 33669',
      email: 'ccm.ylk@epitomekia.in',
      latitude: 13.0989064,
      longitude: 77.5975807,
      hours: 'Mon-Sat: 9AM-7PM, Sun: 10AM-5PM',
      isActive: true,
    },
  })

  const whitefield = await prisma.dealerLocation.create({
    data: {
      name: 'Epitome Kia - Whitefield',
      slug: 'whitefield',
      addressLine1: 'Whitefield Main Road',
      addressLine2: 'Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560066',
      country: 'IN',
      phone: '+91 63662 43243',
      email: 'ccm@epitomekia.in',
      hours: 'Mon-Sat: 9AM-7PM, Sun: 10AM-5PM',
      isActive: true,
    },
  })

  const avalahalli = await prisma.dealerLocation.create({
    data: {
      name: 'Epitome Kia - Avalahalli',
      slug: 'avalahalli',
      addressLine1: 'Avalahalli Main Road',
      addressLine2: 'Avalahalli',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560060',
      country: 'IN',
      phone: '+91 70223 17666',
      email: 'ccm@epitomekia.in',
      hours: 'Mon-Sat: 9AM-7PM, Sun: 10AM-5PM',
      isActive: true,
    },
  })

  const kolar = await prisma.dealerLocation.create({
    data: {
      name: 'Epitome Kia - Kolar',
      slug: 'kolar',
      addressLine1: 'KGF Road',
      addressLine2: 'Kolar',
      city: 'Kolar',
      state: 'Karnataka',
      postalCode: '563101',
      country: 'IN',
      phone: '+91 89519 03224',
      email: 'ccm@epitomekia.in',
      hours: 'Mon-Sat: 9AM-7PM, Sun: 10AM-5PM',
      isActive: true,
    },
  })

  const varthur = await prisma.dealerLocation.create({
    data: {
      name: 'Epitome Kia - Varthur',
      slug: 'varthur',
      addressLine1: 'Varthur Main Road',
      addressLine2: 'Varthur',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560087',
      country: 'IN',
      phone: '+91 98442 40044',
      email: 'ccm@epitomekia.in',
      hours: 'Mon-Sat: 9AM-7PM, Sun: 10AM-5PM',
      isActive: true,
    },
  })

  console.log('Creating car models (all 9 Kia India models)...')

  // ============= 1. KIA SELTOS =============
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

  await prisma.specification.createMany({
    data: [
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
    ],
  })

  // ============= 2. KIA SONET =============
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

  const sonetHTE = await prisma.variant.create({
    data: {
      carModelId: sonet.id,
      name: 'HTE',
      slug: 'sonet-hte',
      trimLevel: 'Base',
      basePrice: 730138, // ₹7.30 Lakh (Dec 2025, post GST cut)
      isActive: true,
    },
  })

  const sonetHTK = await prisma.variant.create({
    data: {
      carModelId: sonet.id,
      name: 'HTK+',
      slug: 'sonet-htk-plus',
      trimLevel: 'Mid',
      basePrice: 910125, // ₹9.10 Lakh (Dec 2025, post GST cut)
      isActive: true,
    },
  })

  const sonetHTX = await prisma.variant.create({
    data: {
      carModelId: sonet.id,
      name: 'HTX',
      slug: 'sonet-htx',
      trimLevel: 'Top',
      basePrice: 1080328, // ₹10.80 Lakh (Dec 2025, post GST cut)
      isActive: true,
    },
  })

  const sonetGTX = await prisma.variant.create({
    data: {
      carModelId: sonet.id,
      name: 'GTX+',
      slug: 'sonet-gtx-plus',
      trimLevel: 'Premium',
      basePrice: 1350652, // ₹13.50 Lakh (Dec 2025, post GST cut)
      isActive: true,
    },
  })

  await prisma.specification.createMany({
    data: [
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
    ],
  })

  // ============= 3. KIA CARENS =============
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

  const carensPremium = await prisma.variant.create({
    data: {
      carModelId: carens.id,
      name: 'Premium',
      slug: 'carens-premium',
      trimLevel: 'Base',
      basePrice: 1099159, // ₹10.99 Lakh (Dec 2025, post GST cut)
      isActive: true,
    },
  })

  const carensPrestige = await prisma.variant.create({
    data: {
      carModelId: carens.id,
      name: 'Prestige',
      slug: 'carens-prestige',
      trimLevel: 'Mid',
      basePrice: 1150000, // ₹11.50 Lakh approx
      isActive: true,
    },
  })

  const carensLuxury = await prisma.variant.create({
    data: {
      carModelId: carens.id,
      name: 'Luxury',
      slug: 'carens-luxury',
      trimLevel: 'Top',
      basePrice: 1200000, // ₹12.00 Lakh approx
      isActive: true,
    },
  })

  const carensLuxuryPlus = await prisma.variant.create({
    data: {
      carModelId: carens.id,
      name: 'Luxury Plus',
      slug: 'carens-luxury-plus',
      trimLevel: 'Premium',
      basePrice: 1277000, // ₹12.77 Lakh (Dec 2025, post GST cut - top variant)
      isActive: true,
    },
  })

  await prisma.specification.createMany({
    data: [
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
    ],
  })

  // ============= 4. KIA CARNIVAL =============
  const carnival = await prisma.carModel.create({
    data: {
      name: 'Kia Carnival',
      slug: 'carnival',
      modelYear: 2024,
      description:
        'The Kia Carnival is the ultimate luxury MPV that redefines premium travel. With its grand proportions, opulent interiors, and powerful performance, the Carnival offers a first-class experience for discerning buyers.',
      isActive: true,
    },
  })

  const carnivalLimousinePlus = await prisma.variant.create({
    data: {
      carModelId: carnival.id,
      name: 'Limousine Plus',
      slug: 'carnival-limousine-plus',
      trimLevel: 'Premium',
      basePrice: 5942459, // ₹59.42 Lakh (Dec 2025, post GST cut)
      isActive: true,
    },
  })

  await prisma.specification.createMany({
    data: [
      { variantId: carnivalLimousinePlus.id, specKey: 'engine', specValue: '2.2L CRDi Diesel', unit: null },
      { variantId: carnivalLimousinePlus.id, specKey: 'power', specValue: '190', unit: 'PS' },
      { variantId: carnivalLimousinePlus.id, specKey: 'torque', specValue: '441', unit: 'Nm' },
      { variantId: carnivalLimousinePlus.id, specKey: 'transmission', specValue: '8-Speed AT', unit: null },
      { variantId: carnivalLimousinePlus.id, specKey: 'fuel_type', specValue: 'Diesel', unit: null },
      { variantId: carnivalLimousinePlus.id, specKey: 'seating_capacity', specValue: '7', unit: 'persons' },
      { variantId: carnivalLimousinePlus.id, specKey: 'sunroof', specValue: 'Dual Sunroof', unit: null },
      { variantId: carnivalLimousinePlus.id, specKey: 'display', specValue: '12.3 inch Dual Screens', unit: null },
    ],
  })

  // ============= 5. KIA EV6 =============
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

  const ev6GT = await prisma.variant.create({
    data: {
      carModelId: ev6.id,
      name: 'GT Line AWD',
      slug: 'ev6-gt-line-awd',
      trimLevel: 'Premium',
      basePrice: 6590000, // ₹65.90 Lakh (Dec 2025)
      isActive: true,
    },
  })

  await prisma.specification.createMany({
    data: [
      { variantId: ev6GT.id, specKey: 'motor', specValue: 'Dual Motor AWD', unit: null },
      { variantId: ev6GT.id, specKey: 'power', specValue: '325', unit: 'PS' },
      { variantId: ev6GT.id, specKey: 'torque', specValue: '605', unit: 'Nm' },
      { variantId: ev6GT.id, specKey: 'battery', specValue: '84', unit: 'kWh' },
      { variantId: ev6GT.id, specKey: 'range', specValue: '663', unit: 'km' },
      { variantId: ev6GT.id, specKey: 'charging_time', specValue: '18 min (10-80%)', unit: null },
      { variantId: ev6GT.id, specKey: '0_to_100', specValue: '5.2', unit: 'seconds' },
      { variantId: ev6GT.id, specKey: 'drive_type', specValue: 'All Wheel Drive', unit: null },
    ],
  })

  // ============= 6. KIA EV9 =============
  const ev9 = await prisma.carModel.create({
    data: {
      name: 'Kia EV9',
      slug: 'ev9',
      modelYear: 2024,
      description:
        'The Kia EV9 is a revolutionary all-electric flagship SUV. With its futuristic design, three-row seating, and advanced technology, the EV9 sets a new benchmark for electric luxury vehicles.',
      isActive: true,
    },
  })

  const ev9GTLine = await prisma.variant.create({
    data: {
      carModelId: ev9.id,
      name: 'GT Line AWD',
      slug: 'ev9-gt-line-awd',
      trimLevel: 'Premium',
      basePrice: 12990000, // ₹1.30 Crore (Dec 2025)
      isActive: true,
    },
  })

  await prisma.specification.createMany({
    data: [
      { variantId: ev9GTLine.id, specKey: 'motor', specValue: 'Dual Motor AWD', unit: null },
      { variantId: ev9GTLine.id, specKey: 'power', specValue: '384', unit: 'PS' },
      { variantId: ev9GTLine.id, specKey: 'torque', specValue: '700', unit: 'Nm' },
      { variantId: ev9GTLine.id, specKey: 'battery', specValue: '99.8', unit: 'kWh' },
      { variantId: ev9GTLine.id, specKey: 'range', specValue: '541', unit: 'km' },
      { variantId: ev9GTLine.id, specKey: 'charging_time', specValue: '24 min (10-80%)', unit: null },
      { variantId: ev9GTLine.id, specKey: 'seating_capacity', specValue: '6', unit: 'persons' },
      { variantId: ev9GTLine.id, specKey: 'drive_type', specValue: 'All Wheel Drive', unit: null },
    ],
  })

  // ============= 7. KIA SYROS =============
  const syros = await prisma.carModel.create({
    data: {
      name: 'Kia Syros',
      slug: 'syros',
      modelYear: 2025,
      description:
        'The Kia Syros is a bold and compact SUV that brings progressive design to the urban landscape. Featuring cutting-edge technology and a versatile interior, the Syros is designed for the modern explorer.',
      isActive: true,
    },
  })

  const syrosHTK = await prisma.variant.create({
    data: {
      carModelId: syros.id,
      name: 'HTK',
      slug: 'syros-htk',
      trimLevel: 'Base',
      basePrice: 867053, // ₹8.67 Lakh (Dec 2025, post GST cut)
      isActive: true,
    },
  })

  const syrosHTX = await prisma.variant.create({
    data: {
      carModelId: syros.id,
      name: 'HTX',
      slug: 'syros-htx',
      trimLevel: 'Mid',
      basePrice: 1210484, // ₹12.10 Lakh (Dec 2025, post GST cut)
      isActive: true,
    },
  })

  const syrosHTXPlus = await prisma.variant.create({
    data: {
      carModelId: syros.id,
      name: 'HTX+',
      slug: 'syros-htx-plus',
      trimLevel: 'Top',
      basePrice: 1456233, // ₹14.56 Lakh (Dec 2025, post GST cut)
      isActive: true,
    },
  })

  await prisma.specification.createMany({
    data: [
      { variantId: syrosHTK.id, specKey: 'engine', specValue: '1.0L Turbo GDi Petrol', unit: null },
      { variantId: syrosHTK.id, specKey: 'transmission', specValue: '6-Speed Manual / 7-Speed DCT', unit: null },
      { variantId: syrosHTK.id, specKey: 'seating_capacity', specValue: '5', unit: 'persons' },
    ],
  })

  // ============= 8. KIA CLAVIS =============
  const clavis = await prisma.carModel.create({
    data: {
      name: 'Kia Clavis',
      slug: 'clavis',
      modelYear: 2025,
      description:
        'The Kia Clavis is a new urban SUV designed for city dwellers. With its compact dimensions and smart features, the Clavis offers the perfect blend of practicality and style.',
      isActive: true,
    },
  })

  const clavisHTK = await prisma.variant.create({
    data: {
      carModelId: clavis.id,
      name: 'HTK',
      slug: 'clavis-htk',
      trimLevel: 'Base',
      basePrice: 1107829, // ₹11.07 Lakh (Dec 2025 - Carens Clavis starting price)
      isActive: true,
    },
  })

  await prisma.specification.createMany({
    data: [
      { variantId: clavisHTK.id, specKey: 'engine', specValue: '1.2L Petrol / 1.5L Diesel', unit: null },
      { variantId: clavisHTK.id, specKey: 'seating_capacity', specValue: '5', unit: 'persons' },
    ],
  })

  // ============= 9. KIA CLAVIS EV =============
  const clavisEV = await prisma.carModel.create({
    data: {
      name: 'Kia Clavis EV',
      slug: 'clavis-ev',
      modelYear: 2025,
      description:
        'The Kia Clavis EV brings electric urban freedom. As the electric variant of the Clavis, it offers zero-emission driving with all the practicality of its ICE counterpart.',
      isActive: true,
    },
  })

  const clavisEVBase = await prisma.variant.create({
    data: {
      carModelId: clavisEV.id,
      name: 'Standard',
      slug: 'clavis-ev-standard',
      trimLevel: 'Base',
      basePrice: 1799000, // ₹17.99 Lakh (Dec 2025 - Carens Clavis EV starting price)
      isActive: true,
    },
  })

  await prisma.specification.createMany({
    data: [
      { variantId: clavisEVBase.id, specKey: 'motor', specValue: 'Single Motor FWD', unit: null },
      { variantId: clavisEVBase.id, specKey: 'seating_capacity', specValue: '5', unit: 'persons' },
    ],
  })

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
        carModelId: carnival.id,
        title: 'Carnival Luxury Experience',
        slug: 'carnival-luxury-experience',
        description:
          'Experience luxury like never before! Get ₹2 lakh exchange bonus, 5 years comprehensive warranty, and premium accessories kit.',
        startAt: now,
        endAt: nextMonth,
        isActive: true,
      },
      {
        carModelId: ev9.id,
        title: 'EV9 Launch Celebration',
        slug: 'ev9-launch-celebration',
        description:
          'Be among the first to own the flagship EV9! Exclusive benefits include priority delivery, complimentary home charger, and VIP service package.',
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
      {
        title: 'Introducing the All-New Kia EV9: A New Era of Electric SUVs',
        slug: 'kia-ev9-introduction',
        summary:
          'Meet the Kia EV9 - the flagship electric SUV that redefines luxury and sustainability.',
        content:
          'The Kia EV9 represents the pinnacle of electric vehicle engineering...',
        authorName: 'Epitome Kia Team',
        isPublished: true,
        publishedAt: now,
      },
    ],
  })

  console.log('Seeding completed successfully!')
  console.log('Created: 9 car models, 5 dealer locations, 7 offers, 2 pages, 4 FAQs, 4 blog posts')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
