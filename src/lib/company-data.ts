// Epitome Kia - Real Business Data
// Source: epitomekia.in + kia.com/in

// Type definitions
export interface Location {
    id: string
    name: string
    label?: string
    address: string
    salesPhone: string[]
    servicePhone: string[]
    email: string
    mapUrl: string
    placeId?: string // Google Place ID for reviews
}

export interface CarModelData {
    name: string
    slug: string
    tagline: string
    image: string
    startingPrice: string
    category: 'suv' | 'mpv' | 'ev'
    isNew?: boolean
    isElectric?: boolean
    isPremium?: boolean
    isComingSoon?: boolean
}

export const COMPANY_INFO = {
    name: 'Epitome Automobiles Private Limited',
    brand: 'Epitome Kia',
    tagline: 'Movement that Inspires',
    description: 'Authorized sales, service & spares dealer for Kia India. Present in Whitefield, International Airport Road-Yelahanka, Avalahalli, Kolar and Varthur.',
    copyrightTemplate: 'Epitome Automobiles Private Limited. All Rights Reserved.',
    logo: '/logo-black.png',
}

// Google Place IDs for each location
// To find Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id
// Or use: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
export const LOCATIONS: Location[] = [
    {
        id: 'yelahanka',
        name: 'Yelahanka',
        label: 'Corporate Office',
        address: '#99, New Airport Road, Yelahanka, Karnataka 560064',
        salesPhone: ['07829933669', '08047363737'],
        servicePhone: ['08047363838'],
        email: 'ccm.ylk@epitomekia.in',
        mapUrl: 'https://www.google.com/maps/place/Epitome+Automobiles+%7C+Kia+Showroom+Yelahanka/@13.0989064,77.5975807,17z',
        placeId: 'ChIJK6kKNHYVrjsRjJm3tVbHVgY', // Epitome Kia Yelahanka
    },
    {
        id: 'whitefield',
        name: 'Whitefield',
        address: '19/A, Visvesvaraya Industrial Area, Hoodi Main Road, Whitefield, Bengaluru 560048',
        salesPhone: ['06366243243', '08047363737'],
        servicePhone: ['08047363838'],
        email: 'ccm@epitomekia.in',
        mapUrl: 'https://www.google.com/maps/place/Epitome+Kia+Whitefield/@12.9988,77.7144,17z',
        placeId: 'ChIJa7Z0TKkUrjsRd6fKYL4RSGU', // Epitome Kia Whitefield
    },
    {
        id: 'avalahalli',
        name: 'Avalahalli',
        address: '45 Poojambika Layout, NS Paradise Township, Virgonagar, Old Madras Road, Bangalore 560049',
        salesPhone: ['07022317666', '08047363737'],
        servicePhone: ['08047363838'],
        email: 'ccm@epitomekia.in',
        mapUrl: 'https://www.google.com/maps/place/Epitome+Kia+Avalahalli/@13.0156,77.6789,17z',
        placeId: 'ChIJYdZyqrsUrjsRBBNJ0TDVoQs', // Epitome Kia Avalahalli
    },
    {
        id: 'kolar',
        name: 'Kolar',
        address: 'Plot No 30, CV Ramaiah Layout, Near Sri RV International School, Kolar 563101',
        salesPhone: ['08951903224', '08047363737'],
        servicePhone: ['08047363838'],
        email: 'ccm@epitomekia.in',
        mapUrl: 'https://www.google.com/maps/place/Epitome+Kia+Kolar/@13.1358,78.1292,17z',
        placeId: 'ChIJ8U0rvqwzszsRuJ2LfRcWDGU', // Epitome Kia Kolar
    },
    {
        id: 'varthur',
        name: 'Varthur',
        address: '224/6, Gunjur Road, Varthur, Bangalore 560087',
        salesPhone: ['09844240044', '08047363737'],
        servicePhone: ['08047363838'],
        email: 'ccm@epitomekia.in',
        mapUrl: 'https://www.google.com/maps/place/Epitome+Kia+Varthur/@12.9456,77.7512,17z',
        placeId: 'ChIJLwBx8KQUrjsRGlA4nD2xKoQ', // Epitome Kia Varthur
    },
]

export const SOCIAL_LINKS = {
    facebook: 'https://www.facebook.com/EpitomeKia',
    instagram: 'https://www.instagram.com/epitome_kia/',
    youtube: 'https://www.youtube.com/channel/UCy5CsK9RGxlP4L-KzPw5JjQ',
    linkedin: 'https://www.linkedin.com/company/epitomekia/',
    twitter: 'https://www.x.com/epitome_kia',
}

export const QUICK_LINKS = [
    { label: 'Service Booking', href: '/service' },
    { label: 'Insurance Renewals', href: '/insurance' },
    { label: 'About Us', href: '/about' },
    { label: 'Our Locations', href: '/contact' },
    { label: 'Contact Us', href: '/contact' },
]

// Complete Kia India lineup as of 2024
export const CAR_MODELS: CarModelData[] = [
    {
        name: 'Kia Seltos',
        slug: 'seltos',
        tagline: 'The Badass. Reborn.',
        image: '/models/seltos.png',
        startingPrice: '₹10.90 Lakh',
        category: 'suv',
        isNew: true,
    },
    {
        name: 'Kia Sonet',
        slug: 'sonet',
        tagline: 'The Wild. Reborn.',
        image: '/models/sonet.png',
        startingPrice: '₹7.99 Lakh',
        category: 'suv',
        isNew: true,
    },
    {
        name: 'Kia Carens',
        slug: 'carens',
        tagline: 'Space for Everything.',
        image: '/models/carens.png',
        startingPrice: '₹10.52 Lakh',
        category: 'mpv',
    },
    {
        name: 'Kia Carnival',
        slug: 'carnival',
        tagline: 'The Grand Experience.',
        image: '/models/carnival.png',
        startingPrice: '₹63.90 Lakh',
        category: 'mpv',
        isPremium: true,
    },
    {
        name: 'Kia EV6',
        slug: 'ev6',
        tagline: 'Fully Electric. Fully Charged.',
        image: '/models/ev6.png',
        startingPrice: '₹60.95 Lakh',
        category: 'ev',
        isElectric: true,
    },
    {
        name: 'Kia EV9',
        slug: 'ev9',
        tagline: 'The Future of Electric.',
        image: '/models/ev9.png',
        startingPrice: '₹1.30 Crore',
        category: 'ev',
        isElectric: true,
        isPremium: true,
    },
    {
        name: 'Kia Syros',
        slug: 'syros',
        tagline: 'Bold. Compact. Progressive.',
        image: '/models/syros.png',
        startingPrice: 'Coming Soon',
        category: 'suv',
        isNew: true,
        isComingSoon: true,
    },
    {
        name: 'Kia Clavis',
        slug: 'clavis',
        tagline: 'The New Urban SUV.',
        image: '/models/clavis.png',
        startingPrice: 'Coming Soon',
        category: 'suv',
        isNew: true,
        isComingSoon: true,
    },
    {
        name: 'Kia Clavis EV',
        slug: 'clavis-ev',
        tagline: 'Electric Urban Freedom.',
        image: '/models/clavis-ev.png',
        startingPrice: 'Coming Soon',
        category: 'ev',
        isElectric: true,
        isNew: true,
        isComingSoon: true,
    },
]

export type CarModel = CarModelData
