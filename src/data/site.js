export const siteMeta = {
  brandName: "Northstar Supply",
  tagline: "Streetwear essentials shaped for everyday motion.",
  announcement: "Free delivery inside Dhaka on orders above BDT 2,500. Cash on delivery confirmation required.",
  contact: {
    phone: "+880 1814-740554",
    email: "hello@northstarsupply.co",
    address: "Mirpur DOHS, Dhaka, Bangladesh"
  },
  socialLinks: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "YouTube", href: "#" }
  ],
  trustHighlights: [
    {
      title: "Responsive storefront",
      copy: "Built mobile-first with reusable components and predictable layout behavior."
    },
    {
      title: "Vanilla JS interactions",
      copy: "Cart, search, filters, quantity controls, and checkout states without a framework."
    },
    {
      title: "Maintainable styling",
      copy: "Tailwind utilities plus separated token, component, and section layers for fast updates."
    }
  ]
};

export const commerceMeta = {
  freeShippingThreshold: 2500,
  cartBenefits: [
    {
      title: "Confirmation-first delivery",
      copy: "The cart and checkout are already structured for a phone-confirmation cash-on-delivery workflow."
    },
    {
      title: "Shared local state",
      copy: "Mini cart, cart page, and checkout summary all read from the same localStorage-based state."
    },
    {
      title: "Backend-ready layout",
      copy: "Shipping logic, payment methods, and order notes can be swapped in later without layout rewrites."
    }
  ],
  checkoutSteps: ["Cart review", "Shipping details", "Confirmation call", "Delivery"],
  shippingZones: [
    {
      id: "dhaka",
      label: "Inside Dhaka",
      cost: 120,
      eta: "2 to 3 working days"
    },
    {
      id: "outside-dhaka",
      label: "Outside Dhaka",
      cost: 180,
      eta: "3 to 5 working days"
    }
  ],
  promoCodes: [
    {
      code: "NORTH10",
      label: "10% off order",
      type: "percent",
      value: 10,
      description: "A demo promo for quick launch-style conversions.",
      minimumSubtotal: 1800
    },
    {
      code: "FREESHIP",
      label: "Free shipping",
      type: "shipping",
      value: 100,
      description: "Overrides shipping cost for any supported delivery zone.",
      minimumSubtotal: 1200
    }
  ],
  paymentMethods: [
    {
      id: "cod",
      label: "Cash on delivery",
      description: "Best aligned with the current confirmation-first workflow."
    },
    {
      id: "bkash",
      label: "bKash placeholder",
      description: "UI placeholder for future mobile-wallet integration."
    },
    {
      id: "nagad",
      label: "Nagad placeholder",
      description: "Use this slot later for production payment support."
    }
  ],
  checkoutNotes: [
    {
      title: "Shipping note",
      copy: "Replace the current placeholder delivery policy with actual zone, charge, and return conditions before launch."
    },
    {
      title: "Payment note",
      copy: "The UI already supports multiple methods, but live payment status and transaction validation still need backend integration."
    }
  ]
};

const categoryMedia = {
  outerwear: "/media/categories/outerwear.svg",
  eyewear: "/media/categories/eyewear.svg",
  bracelets: "/media/categories/bracelets.svg",
  bandanas: "/media/categories/bandanas.svg",
  essentials: "/media/categories/essentials.svg"
};

function buildProductMedia(slug) {
  return `/media/products/${slug}.svg`;
}

const productProfiles = {
  "stellar-heavyweight-hoodie": {
    rating: "4.9",
    reviews: 28,
    fit: "Oversized heavyweight layer",
    material: "480 GSM double-layer fleece",
    care: "Cold wash inside out and air dry to keep the fleece body structured.",
    styling: "Best over compact tees with wider trousers and heavier sneakers.",
    dispatch: "Folded with shoulder shape retention for structured arrival.",
    sizeGuide: "Choose your regular size for the intended oversized block, or size down for a cleaner fit.",
    overview: "Built as a statement hoodie with enough density and structure to carry the outfit on its own.",
    support: "Use the help center or checkout support route for sizing and delivery questions after purchase."
  },
  "district-zip-hoodie": {
    rating: "4.8",
    reviews: 24,
    fit: "Relaxed zip-through silhouette",
    material: "Heavy brushed fleece with rib finish",
    care: "Zip up before washing and dry flat to keep the front clean and stable.",
    styling: "Works as a lighter alternative to the pullover hoodie while still keeping a strong streetwear profile.",
    dispatch: "Packed flat with the zip protected to reduce handling marks.",
    sizeGuide: "Stay true to size for a relaxed fit with room for layering underneath.",
    overview: "Designed for customers who want a structured zip layer that still feels substantial rather than basic.",
    support: "A good candidate for customer fit questions because the zipper and body shape change how it layers."
  },
  "metro-polo-tee": {
    rating: "4.7",
    reviews: 19,
    fit: "Relaxed polo tee shape",
    material: "Soft jersey with contrast stripe layout",
    care: "Gentle wash and low heat help keep the collar and stripe definition clean.",
    styling: "Easy to wear under open outerwear or as a standalone piece with looser bottoms.",
    dispatch: "Folded flat to preserve collar shape during delivery.",
    sizeGuide: "Choose your standard size for a relaxed daily fit with a clean drape.",
    overview: "A bridge piece between a tee and a smarter casual top, intended to add structure without losing ease.",
    support: "Useful for customers who want guidance on fit compared with the oversized tees in the same catalog."
  },
  "void-y2k-sunglasses": {
    rating: "4.8",
    reviews: 31,
    fit: "Low-profile wrap-inspired frame",
    material: "Light molded frame with tinted lens",
    care: "Store in a pouch and clean only with microfiber to avoid lens scratches.",
    styling: "Adds a sharper finish to simple looks and works best when the rest of the outfit stays restrained.",
    dispatch: "Packed with a rigid insert to reduce transit pressure on the frame.",
    sizeGuide: "One-size frame intended for quick styling rather than adjustable fit grading.",
    overview: "The visual focus is the angular lens line and compact profile rather than overt branding or decoration.",
    support: "Support guidance should later include lens care, scratch handling, and packaging expectations."
  },
  "arc-link-bracelet": {
    rating: "4.7",
    reviews: 17,
    fit: "Close wrist accessory fit",
    material: "Slim graphite-toned link construction",
    care: "Wipe after wear and avoid prolonged moisture exposure to keep the finish cleaner.",
    styling: "Built for stacking beside a watch or other slim accessories without overpowering the wrist.",
    dispatch: "Delivered in a soft pouch to control surface contact during transit.",
    sizeGuide: "One-size accessory meant for an easy daily wrist fit.",
    overview: "The bracelet is intentionally understated, designed to add polish rather than dominate the look.",
    support: "Later support copy should explain finish care and wear expectations for accessory customers."
  },
  "signal-bandana": {
    rating: "4.6",
    reviews: 14,
    fit: "Flexible tie-and-wrap accessory",
    material: "Soft woven cotton square",
    care: "Cool wash and line dry to keep the edges and drape looking cleaner for longer.",
    styling: "Designed for neck, wrist, or bag styling when the rest of the outfit needs a small contrast hit.",
    dispatch: "Packed flat so the fabric arrives ready to wear.",
    sizeGuide: "One-size format with multiple styling positions.",
    overview: "A quick styling piece intended to change the look without adding bulk or heavy layering.",
    support: "Good support content later would cover fabric care and styling suggestions rather than complex sizing."
  },
  "nightshift-oversized-tee": {
    rating: "4.8",
    reviews: 26,
    fit: "Boxy oversized tee block",
    material: "Dense cotton jersey with compact rib neck",
    care: "Wash inside out on a gentle cycle to keep the body weight and neckline in better condition.",
    styling: "Works as a reliable base layer with denim, cargos, or under structured outerwear.",
    dispatch: "Folded for low-bulk packing with neckline support.",
    sizeGuide: "Take your usual size for the intended oversized cut.",
    overview: "This is the everyday anchor piece in the catalog, built to be worn repeatedly across multiple outfit types.",
    support: "Useful for customers comparing it with the polo tee or combo pack for day-to-day use."
  },
  "gridline-denim-pants": {
    rating: "4.8",
    reviews: 22,
    fit: "Wide-leg baggy denim fit",
    material: "Washed denim with seam-led line detail",
    care: "Wash cold and inside out to protect the wash tone and seam definition.",
    styling: "Pairs best with simpler tops because the seam geometry already gives the outfit enough movement.",
    dispatch: "Packed flat to control creasing while keeping bulk manageable.",
    sizeGuide: "Choose the waist that matches your normal denim size for the intended baggy leg shape.",
    overview: "The silhouette is meant to do more visual work than a basic jean, so the rest of the outfit can stay simple.",
    support: "Support later should clarify waist measurement, inseam expectations, and exchange handling for sizing issues."
  },
  "vector-wrap-shades": {
    rating: "4.7",
    reviews: 18,
    fit: "Bold wrap-style frame",
    material: "Curved molded frame with smoked lens",
    care: "Use a pouch and wipe gently after wear to keep the lens surface cleaner.",
    styling: "Best used as a futuristic accent when the rest of the fit is more grounded.",
    dispatch: "Protected with a rigid insert to reduce pressure during delivery.",
    sizeGuide: "One-size eyewear format with styling-led appeal rather than adjustable fit.",
    overview: "A more directional eyewear option intended for customers who want a stronger profile than the slimmer pair.",
    support: "A later live version should explain lens care and packaging expectations clearly."
  },
  "stacked-bead-bracelet": {
    rating: "4.6",
    reviews: 16,
    fit: "Stretch-led stacked wrist fit",
    material: "Matte bead construction with comfortable core",
    care: "Keep dry when possible and avoid rough contact to preserve the bead finish.",
    styling: "Designed to add texture beside slim bracelets or watches without needing much adjustment.",
    dispatch: "Packed in a pouch to keep the bead surface protected.",
    sizeGuide: "One-size stretch format intended for quick everyday wear.",
    overview: "A lower-cost accessory option that still adds texture and layering interest to the cart mix.",
    support: "Later support content should clarify wear expectations and what counts as normal accessory variation."
  },
  "monochrome-scarf-bandana": {
    rating: "4.7",
    reviews: 15,
    fit: "Soft drape accessory format",
    material: "Light woven fabric with fluid fall",
    care: "Cool wash and line dry to keep the drape and edges looking clean.",
    styling: "A softer styling move for darker outfits or layered transitional looks.",
    dispatch: "Packed flat to maintain an easy first wear experience.",
    sizeGuide: "One-size accessory designed for multiple tie and wrap positions.",
    overview: "This piece is meant to soften the outfit rather than sharpen it, which gives the accessories mix more range.",
    support: "Useful for support content that later covers fabric care and accessory handling."
  },
  "relay-combo-pack": {
    rating: "4.9",
    reviews: 34,
    fit: "Relaxed three-tee pack fit",
    material: "Multi-tee jersey pack built for rotation",
    care: "Wash similar colors together and avoid excessive heat to preserve shape across the set.",
    styling: "Built for customers who want quick wardrobe coverage without losing the relaxed Northstar silhouette.",
    dispatch: "Packed as a grouped set so the customer receives the drop as one clean bundle.",
    sizeGuide: "Choose your regular size for the intended relaxed fit across the full pack.",
    overview: "The value proposition is volume without sacrificing the silhouette language used elsewhere in the storefront.",
    support: "Support later should explain pack contents, exchange conditions, and whether partial returns are allowed."
  }
};

function buildFallbackProductProfile(product) {
  return {
    rating: "4.7",
    reviews: 18,
    fit: "Relaxed product fit",
    material: product.shortDescription,
    care: "Follow gentle-care handling until final business care guidance is added.",
    styling: product.description,
    dispatch: "Packed carefully for standard delivery handling.",
    sizeGuide: product.sizes.length > 1
      ? `Choose from ${product.sizes.join(", ")} based on your preferred fit.`
      : "One-size format intended for straightforward everyday use.",
    overview: product.description,
    support: "Use the help center for delivery, fit, and order-support questions."
  };
}

function buildAvailabilityDetails(stock) {
  if (stock === "Low stock") {
    return {
      label: stock,
      status: "low-stock",
      note: "Low-stock items may need one extra confirmation step before dispatch is locked."
    };
  }

  return {
    label: stock,
    status: "in-stock",
    note: "Currently available for standard confirmation-first dispatch."
  };
}

function buildShippingDetails(product, profile) {
  const dispatchLabel = ["eyewear", "bracelets", "bandanas"].includes(product.category)
    ? "Dispatch within 24 hours"
    : "Dispatch within 24 to 48 hours";

  return {
    dispatchLabel,
    deliveryNote: `${commerceMeta.shippingZones[0].label}: ${commerceMeta.shippingZones[0].eta}. ${commerceMeta.shippingZones[1].label}: ${commerceMeta.shippingZones[1].eta}.`,
    note: buildAvailabilityDetails(product.stock).status === "low-stock"
      ? `${dispatchLabel}. Final dispatch timing may depend on low-stock confirmation.`
      : `${dispatchLabel}. No extra handling delay is expected in the current demo flow.`,
    supportLine: profile.support
  };
}

function buildCareDetails(profile) {
  return {
    summary: profile.care,
    material: profile.material,
    note: "Refer to the product detail page after purchase for the full care direction stored in the product dataset."
  };
}

const categorySeed = [
  {
    id: "outerwear",
    slug: "outerwear",
    name: "Jackets & Hoodies",
    kicker: "Heavyweight layers",
    description: "Oversized silhouettes, dense fleece, and tonal colors for off-duty wear.",
    theme: "carbon"
  },
  {
    id: "eyewear",
    slug: "eyewear",
    name: "Sunglasses",
    kicker: "Sharp accessories",
    description: "Angular frames and low-profile shades designed for quick styling lifts.",
    theme: "ocean"
  },
  {
    id: "bracelets",
    slug: "bracelets",
    name: "Bracelets",
    kicker: "Stacked details",
    description: "Minimal metal and bead bracelets that layer easily with daily outfits.",
    theme: "sand"
  },
  {
    id: "bandanas",
    slug: "bandanas",
    name: "Bandanas",
    kicker: "Utility add-ons",
    description: "Easy add-on pieces that bring contrast, texture, and a bit of attitude.",
    theme: "wine"
  },
  {
    id: "essentials",
    slug: "essentials",
    name: "All Collection",
    kicker: "Core drops",
    description: "Mixed highlights from every release, ready to anchor the storefront homepage.",
    theme: "olive"
  }
];

export const categories = categorySeed.map((category) => ({
  ...category,
  media: categoryMedia[category.slug]
}));

const productSeed = [
  {
    id: 101,
    slug: "stellar-heavyweight-hoodie",
    name: "Stellar Heavyweight Hoodie",
    category: "outerwear",
    price: 1200,
    originalPrice: 1500,
    badge: "Save 20%",
    stock: "In stock",
    theme: "carbon",
    sizes: ["M", "L", "XL"],
    colors: ["Charcoal", "Stone"],
    shortDescription: "480 GSM double-layer fleece with a structured oversized block.",
    description:
      "An oversized hoodie designed around a dense cotton blend, dropped shoulders, and an easy streetwear silhouette.",
    featured: true,
    spotlight: true
  },
  {
    id: 102,
    slug: "district-zip-hoodie",
    name: "District Zip Hoodie",
    category: "outerwear",
    price: 1350,
    originalPrice: 1650,
    badge: "Save 18%",
    stock: "In stock",
    theme: "clay",
    sizes: ["M", "L", "XL"],
    colors: ["Clay", "Black"],
    shortDescription: "Full-zip layer with heavier rib finishing and clean hardware.",
    description:
      "Built to sit between a statement layer and a daily basic, with room through the body and a neat zip front.",
    featured: true,
    spotlight: false
  },
  {
    id: 103,
    slug: "metro-polo-tee",
    name: "Metro Stripe Polo Tee",
    category: "essentials",
    price: 700,
    originalPrice: null,
    badge: null,
    stock: "In stock",
    theme: "ocean",
    sizes: ["M", "L", "XL"],
    colors: ["Navy", "White"],
    shortDescription: "Soft jersey polo with contrast striping and a clean open collar.",
    description:
      "A transitional tee with a slightly relaxed profile, stitched for easy layering under jackets and overshirts.",
    featured: true,
    spotlight: true
  },
  {
    id: 104,
    slug: "void-y2k-sunglasses",
    name: "Void Y2K Sunglasses",
    category: "eyewear",
    price: 650,
    originalPrice: 950,
    badge: "Save 32%",
    stock: "In stock",
    theme: "ocean",
    sizes: ["One Size"],
    colors: ["Ink", "Smoke"],
    shortDescription: "Slim angular frame with tinted lenses and a low-rise profile.",
    description:
      "Minimal, sharp, and lightweight. A finishing piece that gives casual looks a more deliberate edge.",
    featured: true,
    spotlight: true
  },
  {
    id: 105,
    slug: "arc-link-bracelet",
    name: "Arc Link Bracelet",
    category: "bracelets",
    price: 350,
    originalPrice: 450,
    badge: "Save 22%",
    stock: "In stock",
    theme: "sand",
    sizes: ["One Size"],
    colors: ["Graphite"],
    shortDescription: "Slim interlocked bracelet with muted hardware and lightweight feel.",
    description:
      "A low-profile chain bracelet designed to sit cleanly on the wrist without overpowering layered looks.",
    featured: true,
    spotlight: true
  },
  {
    id: 106,
    slug: "signal-bandana",
    name: "Signal Utility Bandana",
    category: "bandanas",
    price: 220,
    originalPrice: null,
    badge: null,
    stock: "In stock",
    theme: "wine",
    sizes: ["One Size"],
    colors: ["Burgundy"],
    shortDescription: "Soft cotton square with clean edge finish and graphic placement zones.",
    description:
      "Made for styling across the neck, wrist, or bag handle, giving fast contrast without heavy layering.",
    featured: false,
    spotlight: true
  },
  {
    id: 107,
    slug: "nightshift-oversized-tee",
    name: "Nightshift Oversized Tee",
    category: "essentials",
    price: 600,
    originalPrice: null,
    badge: null,
    stock: "In stock",
    theme: "olive",
    sizes: ["M", "L", "XL"],
    colors: ["Olive", "Black"],
    shortDescription: "Dense drop-shoulder t-shirt cut with a boxy torso and compact rib neck.",
    description:
      "A daily anchor piece built for layering, with a shape that works on its own or under hoodies and jackets.",
    featured: false,
    spotlight: false
  },
  {
    id: 108,
    slug: "gridline-denim-pants",
    name: "Gridline Baggy Denim",
    category: "essentials",
    price: 1300,
    originalPrice: 1750,
    badge: "Save 26%",
    stock: "In stock",
    theme: "clay",
    sizes: ["30", "32", "34"],
    colors: ["Indigo"],
    shortDescription: "Wide-leg denim with geometric seam details and a soft washed finish.",
    description:
      "A roomy fit with distinctive line work, intended to pair with simple tops and heavier footwear.",
    featured: false,
    spotlight: false
  },
  {
    id: 109,
    slug: "vector-wrap-shades",
    name: "Vector Wrap Shades",
    category: "eyewear",
    price: 780,
    originalPrice: 1100,
    badge: "Save 29%",
    stock: "In stock",
    theme: "carbon",
    sizes: ["One Size"],
    colors: ["Black", "Silver"],
    shortDescription: "Curved frame sunglasses with a bold side profile and smoked lens tint.",
    description:
      "For styling that leans futuristic without losing everyday wearability.",
    featured: false,
    spotlight: false
  },
  {
    id: 110,
    slug: "stacked-bead-bracelet",
    name: "Stacked Bead Bracelet",
    category: "bracelets",
    price: 290,
    originalPrice: 390,
    badge: "Save 25%",
    stock: "Low stock",
    theme: "olive",
    sizes: ["One Size"],
    colors: ["Black"],
    shortDescription: "Textured bead stack with a matte finish and comfortable stretch core.",
    description:
      "An easy accessory for everyday stacking that adds texture without pulling focus.",
    featured: false,
    spotlight: false
  },
  {
    id: 111,
    slug: "monochrome-scarf-bandana",
    name: "Monochrome Scarf Bandana",
    category: "bandanas",
    price: 260,
    originalPrice: 320,
    badge: "Save 19%",
    stock: "In stock",
    theme: "sand",
    sizes: ["One Size"],
    colors: ["Sand"],
    shortDescription: "Muted scarf-bandana hybrid with soft drape and all-season wearability.",
    description:
      "A lighter accessory layer meant to soften darker looks and add movement.",
    featured: false,
    spotlight: false
  },
  {
    id: 112,
    slug: "relay-combo-pack",
    name: "Relay Tee Combo Pack",
    category: "essentials",
    price: 1000,
    originalPrice: 1400,
    badge: "Save 29%",
    stock: "In stock",
    theme: "wine",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Cream", "Grey"],
    shortDescription: "Three-piece drop-shoulder combo for quick wardrobe rotation.",
    description:
      "A multi-tee pack designed as a value-focused option without losing a streetwear-ready silhouette.",
    featured: true,
    spotlight: false
  }
];

export const products = productSeed.map((product) => {
  const profile = productProfiles[product.slug] ?? buildFallbackProductProfile(product);

  return {
    ...product,
    media: buildProductMedia(product.slug),
    profile,
    availability: buildAvailabilityDetails(product.stock),
    shipping: buildShippingDetails(product, profile),
    care: buildCareDetails(profile)
  };
});

export const staticPages = {
  about: {
    eyebrow: "Brand Profile",
    title: "Built for a sharp, everyday streetwear storefront.",
    intro:
      "Northstar Supply is a demo-first streetwear brand created to prove a maintainable ecommerce UI system without relying on a frontend framework.",
    highlights: [
      {
        title: "Design direction",
        copy: "Editorial streetwear structure, stronger product hierarchy, and reusable visual systems instead of one-off landing-page sections."
      },
      {
        title: "Code approach",
        copy: "Page shells stay thin while data, components, and commerce behavior are split into clear layers for safer future edits."
      },
      {
        title: "Handoff readiness",
        copy: "The storefront already carries cart persistence, checkout flows, seeded media assets, and maintainable CSS architecture."
      }
    ],
    sections: [
      {
        title: "What the brand stands for",
        body:
          "The direction focuses on oversized layers, compact accessories, and clean pricing presentation. It is intentionally structured to support future real product photography and backend integration without rewriting the layout system.",
        bullets: [
          "Category-led browsing stays central so the homepage merchandises clearly.",
          "Tone stays modern and direct rather than decorative or trend-chasing.",
          "The product experience is designed to feel commercially believable even in demo mode."
        ]
      },
      {
        title: "How this storefront is designed",
        body:
          "The UI is shaped around reusable sections, data-driven product cards, and shared shell components. Every page keeps the same visual grammar so the project remains easy to extend.",
        bullets: [
          "Shared card, shell, browse, and product-detail components avoid duplicated page markup.",
          "Cart, checkout, and promo pricing read from common helper logic instead of page-local calculations.",
          "Static content now follows the same design system as the storefront instead of falling back to plain policy text."
        ]
      },
      {
        title: "What comes next",
        body:
          "The current build is now strong enough for real content entry, backend handoff planning, and design QA across the complete purchase flow.",
        bullets: [
          "Replace seeded SVG product art with production photography or CDN-hosted media.",
          "Move category-driven guidance into product-level metadata where the business needs exact fabric, fit, and care notes.",
          "Connect checkout submission, payment routing, and customer notifications to production services."
        ]
      }
    ],
    sidebarCards: [
      {
        title: "Support contact",
        copy: "Use the existing contact channels for future customer-support and order-confirmation handoff.",
        lines: [siteMeta.contact.phone, siteMeta.contact.email, siteMeta.contact.address]
      },
      {
        title: "Store focus",
        copy: "This demo storefront is built for modern apparel and accessory merchandising with lightweight frontend tooling.",
        lines: ["Vanilla JS UI", "Reusable CSS layers", "Framework-free runtime"]
      }
    ],
    faq: [
      {
        question: "Is this intended to be a clone of the reference site?",
        answer: "No. The browsing rhythm and commerce hierarchy are inspired by the reference, but the brand, product data, wording, assets, and implementation structure are original."
      },
      {
        question: "Why keep this as a multi-page app instead of a frontend framework?",
        answer: "The user asked for plain HTML, CSS, Tailwind, and JavaScript only, so the project uses Vite only for development and build tooling while the runtime stays framework-free."
      }
    ],
    callout: {
      title: "Need a fuller brand-support section later?",
      copy: "This layout is now ready for shipping guidance, contact details, FAQ content, legal copy, and operational notes without needing another template rewrite.",
      actionLabel: "Browse products",
      actionKey: "products"
    }
  },
  help: {
    eyebrow: "Support",
    title: "Help, shipping, and support guidance in one place.",
    intro:
      "This dedicated help page turns the support system into a real customer-facing route instead of leaving contact and policy content fragmented across the footer and placeholder pages.",
    highlights: [
      {
        title: "Support-first layout",
        copy: "Customers can now reach contact details, delivery guidance, and common questions from a single reusable page template."
      },
      {
        title: "Storefront alignment",
        copy: "The page matches the same visual language as cart, checkout, and product pages, which keeps the overall experience consistent."
      },
      {
        title: "Future-ready structure",
        copy: "The layout can expand later with contact forms, live chat slots, ticketing rules, or post-purchase tracking guidance."
      }
    ],
    sections: [
      {
        title: "How customers should reach support",
        body:
          "A production storefront should make the support route obvious before and after checkout. This page now gives that route a dedicated home in the information architecture.",
        bullets: [
          "Use phone for urgent delivery confirmation or order-status issues.",
          "Use email for policy questions, return requests, or documentable support follow-up.",
          "Reuse the same contact details consistently across footer, checkout, and policy pages."
        ]
      },
      {
        title: "Shipping and delivery support",
        body:
          "The current storefront already models inside-Dhaka and outside-Dhaka shipping states, plus promo and free-shipping logic. This page is the right place to explain those rules in customer language.",
        bullets: [
          "Explain estimated delivery windows for each zone.",
          "Clarify how confirmation calls affect dispatch timing.",
          "State what happens when delivery attempts fail or the customer cannot be reached."
        ]
      },
      {
        title: "Order changes and after-purchase help",
        body:
          "As the storefront grows, this page can hold practical post-order support details that do not fit naturally into cart or checkout interfaces.",
        bullets: [
          "Address changes before dispatch",
          "Promo or pricing questions after submission",
          "Returns, cancellations, and damaged-item reporting routes"
        ]
      }
    ],
    sidebarCards: [
      {
        title: "Contact channels",
        copy: "These are the current support endpoints already used across the storefront shell.",
        lines: [siteMeta.contact.phone, siteMeta.contact.email, siteMeta.contact.address]
      },
      {
        title: "Suggested service hours",
        copy: "Placeholder operating guidance for a future live storefront.",
        lines: ["Sat to Thu", "10:00 AM to 8:00 PM", "Response target: within one business day"]
      },
      {
        title: "Linked policy routes",
        copy: "Support content works better when the customer can jump straight to the relevant policy page.",
        lines: ["Privacy policy", "Terms and conditions", "Returns and cancellations"]
      }
    ],
    faq: [
      {
        question: "Where should customers ask about shipping delays?",
        answer: "This help page should be the first support stop. In a production version, it would route the customer to the phone or email channel with the right operating-hour guidance."
      },
      {
        question: "Should this page include order tracking later?",
        answer: "Yes. If order tracking or status lookup is added later, this is the most natural place to introduce it without overloading the cart or checkout pages."
      },
      {
        question: "Why keep a separate help page if policies already exist?",
        answer: "Policy pages explain rules, but customers usually need a practical support route. A dedicated help page bridges that gap and reduces friction after purchase."
      }
    ],
    contactForm: {
      eyebrow: "Support request",
      title: "Send a support request through a structured storefront-style form.",
      intro:
        "This is still a frontend-only implementation, but it now mirrors the kind of support capture flow a real ecommerce help center would need before backend ticketing or CRM integration.",
      topics: [
        {
          value: "order-status",
          label: "Order status",
          description: "Use this for dispatch timing, confirmation-call delays, or delivery follow-up.",
          requiresReference: true,
          referenceLabel: "Order, phone, or checkout reference",
          referencePlaceholder: "Order ID, checkout phone, or confirmation reference",
          messagePlaceholder: "Share the order status issue, expected delivery timing, and any missed-call or dispatch details.",
          followUpTitle: "Order-status route",
          nextStep: "Support would check confirmation status, current dispatch stage, and the active delivery zone before replying.",
          responseTarget: "Priority follow-up during service hours, especially for active delivery issues."
        },
        {
          value: "size-and-fit",
          label: "Size and fit",
          description: "For pre-purchase or post-purchase questions about fit, sizing, or exchanges.",
          requiresReference: false,
          referenceLabel: "Product or order reference",
          referencePlaceholder: "Product name, SKU, or optional existing order reference",
          messagePlaceholder: "Explain the fit concern, preferred silhouette, current size, and whether this is before or after purchase.",
          followUpTitle: "Fit-guidance route",
          nextStep: "Support would reference the product fit profile, available sizes, and exchange guidance before responding.",
          responseTarget: "Written follow-up is usually the clearest route for size guidance and exchange planning."
        },
        {
          value: "returns-and-cancellations",
          label: "Returns or cancellations",
          description: "For cancellation timing, return requests, or damaged-item reporting.",
          requiresReference: true,
          referenceLabel: "Order or return reference",
          referencePlaceholder: "Order ID, delivery phone, or prior support reference",
          messagePlaceholder: "Describe the cancellation or return request, order stage, item condition, and any damage details.",
          followUpTitle: "Returns route",
          nextStep: "Support would confirm dispatch status first, then route the case into the appropriate return, cancellation, or damage workflow.",
          responseTarget: "Response timing depends on whether the order is still pending dispatch or already delivered."
        },
        {
          value: "payments-and-promos",
          label: "Payments or promos",
          description: "For promo-code behavior, checkout issues, or payment-method questions.",
          requiresReference: false,
          referenceLabel: "Promo or checkout reference",
          referencePlaceholder: "Promo code, payment method, or optional order reference",
          messagePlaceholder: "Describe the payment or promo issue, the attempted checkout step, and any code or total mismatch you noticed.",
          followUpTitle: "Payments route",
          nextStep: "Support would verify promo eligibility, shipping totals, and the selected payment path before following up.",
          responseTarget: "Most promo or payment clarification requests can be handled in the next written reply."
        }
      ],
      responsePromise: "In a live version, this would create a support ticket and return a reference ID for follow-up."
    },
    callout: {
      title: "Need the legal version of these rules?",
      copy: "Use the policy pages for the exact business wording once legal and operational rules are finalized.",
      actionLabel: "Open policy pages",
      actionKey: "privacy"
    }
  },
  privacy: {
    eyebrow: "Policy",
    title: "Privacy policy placeholder for a future production storefront.",
    intro:
      "This page demonstrates how policy content will be displayed in a clean, readable format. Replace the text with legally reviewed business content before launch.",
    highlights: [
      {
        title: "Readable structure",
        copy: "Policy content now uses the same visual hierarchy as commerce pages, which reduces the drop in quality between shopping and support content."
      },
      {
        title: "Business-ready slots",
        copy: "This layout can hold collection rules, retention notes, processor details, and contact routes without layout changes."
      },
      {
        title: "Launch reminder",
        copy: "The copy here is still placeholder guidance and must be replaced with legally reviewed production wording before release."
      }
    ],
    sections: [
      {
        title: "Data collection",
        body:
          "A production version may collect customer name, phone number, shipping address, email address, and order information for fulfillment and support.",
        bullets: [
          "Checkout currently demonstrates capture of name, phone, email, address, and order notes.",
          "Future analytics events should be documented alongside operational checkout data.",
          "Support channels need a clear disclosure about how customer communications are stored."
        ]
      },
      {
        title: "Cookies and analytics",
        body:
          "Analytics and cookie usage should be documented clearly, along with retention period, third-party processors, and customer opt-out controls.",
        bullets: [
          "Document which tools are essential for site function versus measurement.",
          "State retention windows for analytics, ad platforms, and support systems.",
          "Explain how a customer can request deletion or a copy of stored data."
        ]
      },
      {
        title: "Third-party services",
        body:
          "As payments, delivery coordination, and analytics are added, the policy should be expanded to explain which external platforms process customer information.",
        bullets: [
          "Payment platforms",
          "Shipping and fulfillment tools",
          "Email or SMS communication systems"
        ]
      }
    ],
    sidebarCards: [
      {
        title: "Privacy contact",
        copy: "Route future access or deletion requests through a dedicated support channel.",
        lines: [siteMeta.contact.email, siteMeta.contact.phone]
      },
      {
        title: "Before launch",
        copy: "Confirm that payment, analytics, ad tracking, and customer-support tools are all represented accurately in the final version.",
        lines: ["Map processors", "Set retention windows", "Add user-rights language"]
      }
    ],
    faq: [
      {
        question: "Can this placeholder be published as-is?",
        answer: "No. It is a UI and structure placeholder only and should be replaced by business-specific, legally reviewed policy text before launch."
      },
      {
        question: "What parts of the current demo already imply data capture?",
        answer: "Cart persistence, checkout fields, promo workflows, and future support contact handling all suggest customer data use, so those should be documented precisely later."
      }
    ],
    callout: {
      title: "Pair privacy copy with contact guidance",
      copy: "Add a dedicated help or contact page later so customers have a clear route for policy questions and support issues.",
      actionLabel: "Open help center",
      actionKey: "help"
    }
  },
  terms: {
    eyebrow: "Policy",
    title: "Terms and conditions layout for storefront operations.",
    intro:
      "Use this template to publish product, pricing, order, shipping, and refund terms in a way that matches the rest of the brand UI.",
    highlights: [
      {
        title: "Operational clarity",
        copy: "Terms should align with the real behavior of pricing, promos, shipping, and order acceptance shown in the storefront UI."
      },
      {
        title: "Reusable structure",
        copy: "The template can now support multiple operational sections without collapsing into long, unstructured paragraphs."
      },
      {
        title: "Commerce consistency",
        copy: "Promo behavior, checkout workflow, and returns language should all refer to the same business rules once connected to production data."
      }
    ],
    sections: [
      {
        title: "Orders and pricing",
        body:
          "Product availability, order acceptance, and promotional pricing rules should be explained clearly so the checkout flow stays transparent.",
        bullets: [
          "Explain when an order is considered confirmed versus submitted.",
          "Clarify how promo codes, sale pricing, and delivery charges are applied.",
          "Note that stock and pricing may change before order confirmation in a real commerce environment."
        ]
      },
      {
        title: "Content and usage",
        body:
          "Brand assets, catalog imagery, and storefront copy should remain protected, while customer obligations and dispute handling are documented explicitly.",
        bullets: [
          "Protect brand assets, copy, and product visuals from unauthorized reuse.",
          "Clarify acceptable site usage and customer conduct expectations.",
          "Document the dispute or complaint process in a way customers can actually follow."
        ]
      },
      {
        title: "Delivery commitments",
        body:
          "The production terms should explain estimated timelines, potential delays, failed-delivery handling, and what happens when customer contact attempts are unsuccessful.",
        bullets: [
          "Inside and outside Dhaka delivery expectations",
          "Confirmation-call workflow",
          "Handling of failed or refused deliveries"
        ]
      }
    ],
    sidebarCards: [
      {
        title: "Pricing system",
        copy: "This demo already includes promo codes and free-shipping thresholds, so production terms should match that logic exactly.",
        lines: ["Threshold shipping", "Promo code eligibility", "Order acceptance"]
      },
      {
        title: "Need support?",
        copy: "If a customer disputes an order, the support route should be visible from the terms page, not hidden elsewhere.",
        lines: [siteMeta.contact.phone, siteMeta.contact.email]
      }
    ],
    faq: [
      {
        question: "Should terms mention promo and sale logic?",
        answer: "Yes. The storefront already shows discounts and promo flows, so the production terms should explain eligibility, exclusions, and how pricing changes are handled."
      },
      {
        question: "Should delivery timing be guaranteed?",
        answer: "Usually no. It is safer to present timelines as estimates and explain delay scenarios clearly rather than over-promise exact dates."
      }
    ],
    callout: {
      title: "Returns should align with these terms",
      copy: "Refund, cancellation, and damage-report rules should reference the same order and shipping logic described here.",
      actionLabel: "Open help center",
      actionKey: "help"
    }
  },
  returns: {
    eyebrow: "Policy",
    title: "Return and cancellation rules presented in a simple customer-friendly format.",
    intro:
      "This placeholder page exists to prove the reusable static-page system. Replace it with the actual return windows, damage reporting process, and cancellation conditions for the business.",
    highlights: [
      {
        title: "Customer-friendly structure",
        copy: "Returns content should be easy to scan during a support issue, not buried inside dense legal language."
      },
      {
        title: "Operational fit",
        copy: "The layout can now support timelines, exclusions, reporting steps, and support channels in a more believable help-center format."
      },
      {
        title: "Launch caution",
        copy: "The rules here are still placeholders and should be replaced with exact business policy before the storefront goes live."
      }
    ],
    sections: [
      {
        title: "Returns",
        body:
          "Define the return window, product condition requirements, excluded items, and refund processing timeline before launch.",
        bullets: [
          "State the number of days customers have to report an issue.",
          "List excluded product categories clearly.",
          "Explain when refunds, exchanges, or store credit apply."
        ]
      },
      {
        title: "Cancellations",
        body:
          "Clarify whether customers can cancel before dispatch, what happens after shipment, and which communication channel should be used.",
        bullets: [
          "Cancellation before dispatch",
          "Refusal or cancellation after shipment",
          "Damage-reporting route and evidence requirements"
        ]
      },
      {
        title: "Damaged or incorrect items",
        body:
          "A production version should explain how customers report wrong-size, damaged, or incorrect shipments and how quickly the team responds.",
        bullets: [
          "Request photo proof where relevant",
          "Provide the contact route and response window",
          "Clarify whether replacement shipping is covered by the store"
        ]
      }
    ],
    sidebarCards: [
      {
        title: "Support route",
        copy: "Make the return-request channel explicit so customers are not forced to search the footer for help.",
        lines: [siteMeta.contact.phone, siteMeta.contact.email]
      },
      {
        title: "What to define later",
        copy: "The final business should lock reporting windows, refund timing, exchange rules, and shipping-cost responsibility.",
        lines: ["Return window", "Refund timing", "Exchange eligibility"]
      }
    ],
    faq: [
      {
        question: "Should all products be returnable?",
        answer: "Usually no. Accessories, sale items, intimate products, or damaged-after-use items are often excluded, but the exact rule must match the business model."
      },
      {
        question: "Can a customer cancel after dispatch?",
        answer: "That depends on the final business rule. If cancellations after dispatch are not allowed, that should be stated clearly and repeated in checkout messaging."
      }
    ],
    callout: {
      title: "Keep support pages connected",
      copy: "Returns, terms, and privacy pages should link into one another so the customer can navigate policy questions without dead ends.",
      actionLabel: "Visit help center",
      actionKey: "help"
    }
  }
};