export type Treatment = {
  slug: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  short: string;
  description: string;
  benefits: string[];
  suitableFor: string[];
  aftercare: string[];
  cloudinaryPublicId: string;
  fallbackImage: string;
};

export const treatments: Treatment[] = [
  {
    slug: "rejuvenating-facial",
    name: "Rejuvenating Facial",
    category: "Skin & Facial Treatments",
    price: 25,
    duration: 60,
    short: "A personalised facial designed to refresh dull, tired-looking skin.",
    description: "A relaxing, skin-focused facial tailored around your current skin needs. The treatment journey can include cleansing, exfoliation, massage and finishing products selected for comfort and glow.",
    benefits: ["Fresh, radiant-looking skin", "Gentle skin reset", "Relaxing one-to-one experience", "Personalised product selection"],
    suitableFor: ["Dull skin", "Dry-feeling skin", "First-time facial clients", "Routine skin maintenance"],
    aftercare: ["Keep skincare gentle for 24 hours", "Wear SPF during daytime", "Avoid excessive heat immediately after treatment"],
    cloudinaryPublicId: "luminous-skin-clinic/treatments/rejuvenating-facial",
    fallbackImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "dermaplaning",
    name: "Dermaplaning",
    category: "Skin & Facial Treatments",
    price: 25,
    duration: 45,
    short: "Professional exfoliation to leave skin feeling smoother and looking brighter.",
    description: "Dermaplaning is a surface exfoliation treatment that removes dead skin build-up and fine vellus hair using a sterile professional blade. A consultation helps confirm suitability before treatment.",
    benefits: ["Smoother-looking skin", "Brighter complexion", "Removes surface build-up", "Creates a smoother base for makeup"],
    suitableFor: ["Dullness", "Rough texture", "Peach fuzz", "Pre-event skin preparation"],
    aftercare: ["Use SPF daily", "Avoid exfoliating acids for several days", "Avoid heat and strenuous exercise for 24 hours"],
    cloudinaryPublicId: "luminous-skin-clinic/treatments/dermaplaning",
    fallbackImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "microneedling",
    name: "Microneedling",
    category: "Advanced Skin Treatments",
    price: 25,
    duration: 60,
    short: "A consultation-led skin treatment commonly chosen for texture and overall skin renewal.",
    description: "Microneedling uses controlled micro-channels in the skin as part of a professional treatment plan. Suitability, treatment depth and aftercare should always be decided following an appropriate consultation.",
    benefits: ["Supports smoother-looking texture", "Popular for skin-renewal plans", "Can be incorporated into treatment courses", "Consultation-led approach"],
    suitableFor: ["Uneven-looking texture", "Post-blemish appearance", "Fine lines", "General skin renewal goals"],
    aftercare: ["Avoid active skincare until advised", "Use gentle cleanser and moisturiser", "Wear SPF", "Follow all practitioner-specific aftercare"],
    cloudinaryPublicId: "luminous-skin-clinic/treatments/microneedling",
    fallbackImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "led-light-treatment",
    name: "LED Light Treatment",
    category: "Skin & Facial Treatments",
    price: 30,
    duration: 30,
    short: "A relaxing LED session that can complement a personalised skin plan.",
    description: "LED light treatment is a non-invasive service that can be used as part of a wider skincare routine. Your practitioner can recommend the most appropriate plan for your goals.",
    benefits: ["Non-invasive treatment", "Comfortable appointment", "Can complement other services", "Minimal interruption to your day"],
    suitableFor: ["Routine skin maintenance", "Clients seeking a gentle option", "Complementary treatment plans"],
    aftercare: ["Follow your normal gentle skincare routine", "Wear SPF", "Follow practitioner recommendations"],
    cloudinaryPublicId: "luminous-skin-clinic/treatments/led-light-treatment",
    fallbackImage: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "high-frequency",
    name: "High Frequency",
    category: "Skin & Facial Treatments",
    price: 35,
    duration: 30,
    short: "A targeted add-on style treatment used within selected facial routines.",
    description: "High frequency can be incorporated into selected facial treatments following a suitability check. The practitioner will explain what to expect and how it fits your skin goals.",
    benefits: ["Targeted treatment step", "Short appointment", "Can complement facial services", "Personalised use"],
    suitableFor: ["Selected congestion concerns", "Facial add-on plans", "Routine skin appointments"],
    aftercare: ["Keep products gentle after treatment", "Avoid unnecessary irritation", "Wear SPF"],
    cloudinaryPublicId: "luminous-skin-clinic/treatments/high-frequency",
    fallbackImage: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "microdermabrasion",
    name: "Microdermabrasion",
    category: "Advanced Skin Treatments",
    price: 60,
    duration: 60,
    short: "A professional exfoliation treatment for clients wanting a more polished skin feel.",
    description: "Microdermabrasion provides controlled mechanical exfoliation and is commonly chosen to improve the look and feel of surface texture. Treatment suitability is confirmed before proceeding.",
    benefits: ["Polished skin feel", "Improves appearance of dull surface build-up", "Professional exfoliation", "Can support a regular skin routine"],
    suitableFor: ["Dull-looking skin", "Uneven surface texture", "Routine exfoliation goals"],
    aftercare: ["Protect skin with SPF", "Avoid strong exfoliants temporarily", "Keep skin moisturised"],
    cloudinaryPublicId: "luminous-skin-clinic/treatments/microdermabrasion",
    fallbackImage: "https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "facial-massage",
    name: "Facial Massage",
    category: "Wellness & Relaxation",
    price: 20,
    duration: 30,
    short: "A calming facial massage focused on relaxation and client comfort.",
    description: "A dedicated facial massage appointment designed to create a relaxing one-to-one experience. Ideal when your goal is rest, comfort and a refreshed feeling.",
    benefits: ["Relaxing appointment", "Calming self-care experience", "Pairs well with facial routines", "Affordable wellness option"],
    suitableFor: ["Relaxation", "Self-care", "Clients wanting a gentle appointment"],
    aftercare: ["Hydrate well", "Continue gentle skincare", "Enjoy a calm post-treatment routine"],
    cloudinaryPublicId: "luminous-skin-clinic/treatments/facial-massage",
    fallbackImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "hot-stone-therapy",
    name: "Hot Stone Therapy",
    category: "Wellness & Relaxation",
    price: 35,
    duration: 60,
    short: "A warm, relaxing wellness treatment designed to help you unwind.",
    description: "Hot stone therapy combines warmth and massage-style techniques to create a deeply relaxing wellness experience. Your practitioner will check suitability before the session.",
    benefits: ["Deep relaxation", "Warm, calming experience", "Dedicated self-care time", "Comfort-focused session"],
    suitableFor: ["Relaxation", "Stress relief routines", "Wellness appointments"],
    aftercare: ["Drink water", "Take it easy after treatment", "Follow any personalised advice"],
    cloudinaryPublicId: "luminous-skin-clinic/treatments/hot-stone-therapy",
    fallbackImage: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=85"
  }
];

export const concerns = [
  { slug: "acne-breakouts", name: "Acne & Breakouts", text: "Explore consultation-led options for congested and breakout-prone skin.", recommended: ["high-frequency", "led-light-treatment", "rejuvenating-facial"] },
  { slug: "pigmentation", name: "Pigmentation", text: "Build a personalised plan around uneven-looking tone and visible pigmentation.", recommended: ["microneedling", "microdermabrasion"] },
  { slug: "dull-skin", name: "Dull Skin", text: "Refresh tired-looking skin with professional exfoliation and facial care.", recommended: ["dermaplaning", "rejuvenating-facial", "microdermabrasion"] },
  { slug: "dry-skin", name: "Dry Skin", text: "Choose gentle, comfort-focused treatments that support a refreshed appearance.", recommended: ["rejuvenating-facial", "led-light-treatment"] },
  { slug: "fine-lines", name: "Fine Lines", text: "Explore skin-renewal treatments selected around your goals and suitability.", recommended: ["microneedling", "led-light-treatment"] },
  { slug: "uneven-texture", name: "Uneven Texture", text: "Professional treatments for smoother-looking, more refined surface texture.", recommended: ["dermaplaning", "microneedling", "microdermabrasion"] }
];

export const reviews = [
  { name: "Aisha", treatment: "Rejuvenating Facial", quote: "A welcoming, relaxing experience from start to finish. My skin looked fresh and felt beautifully cared for." },
  { name: "Sophie", treatment: "Dermaplaning", quote: "Everything was explained clearly and I felt comfortable throughout. I loved how smooth my skin felt afterwards." },
  { name: "Hannah", treatment: "Facial Massage", quote: "Exactly the kind of calm, personal appointment I needed. The whole experience felt warm and professional." }
];

export const faqs = [
  ["How do I know which treatment to book?", "Start with your main skin concern or book a consultation. We can guide you towards the most suitable option based on your goals and treatment suitability."],
  ["Do I need to pay a deposit?", "Deposit rules can vary by treatment. The live booking system will show any required deposit clearly before you confirm."],
  ["Can I reschedule my appointment?", "Yes, subject to the clinic's cancellation and rescheduling policy. Your booking confirmation will include the relevant instructions."],
  ["Are treatments suitable for sensitive skin?", "Suitability depends on the treatment and your individual circumstances. Please tell the practitioner about sensitivity and relevant contraindications before treatment."],
  ["Where is the clinic?", "Luminous Skin Clinic is based in Leeds. The final address, map and parking information can be added in the website settings before launch."],
  ["When will I see results?", "Results vary by individual, concern and treatment. Some clients enjoy an immediate refreshed appearance, while other goals may require a longer treatment plan." ]
];
