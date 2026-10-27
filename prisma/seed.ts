import prisma from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding NR Industrial Enterprises database with authentic catalog...");

  // 1. Seed SiteSettings with authentic NR Industrial Enterprises profile (Ranigunj, Secunderabad)
  const settingsData = {
    companyName: "NR Industrial Enterprises",
    tagline:
      "House Of Industrial Supplies — Hose Pipes, Rubber Sheets, PVC Ducts & Sealing Solutions",
    logoUrl: "/logo.png",
    faviconUrl: "/logo.png",
    seoOgImage: "/logo.png",
    aboutTitle: "About NR Industrial Enterprises",
    aboutDescription:
      "NR Industrial Enterprises is a leading manufacturer and supplier of high-quality industrial products. With a commitment to innovation and excellence, we provide solutions that meet the diverse needs of our clients across various industries.",
    aboutExtended:
      "Serving residential, commercial, and heavy industrial needs from our hub in Ranigunj, Secunderabad, we specialize in heavy-duty PVC duct hoses, transparent copper-coated steel wire flexible hoses, canvas & hydraulic hose pipes, carbon-free hoses, silicone rubber sheets, durable rubber mats, Teflon thread seal tapes, and asbestos cloth.",
    aboutMission:
      "To supply durable, tested, and cost-effective hoses, rubber sheets, and sealing products that keep residential, commercial, and industrial operations running smoothly.",
    aboutVision:
      "To be the most dependable one-stop partner for flexible hoses, industrial rubber linings, and thermal sealing products across India.",
    aboutImage:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85",
    establishedYear: "2010",
    isoCertification: "Verified IndiaMART & TradeIndia Supplier",
    statsJson: JSON.stringify([
      { label: "Product Varieties", value: "250+" },
      { label: "Happy Clients", value: "1,500+" },
      { label: "Sectors Served", value: "Residential, Commercial & Industrial" },
      { label: "Stock Availability", value: "Ready Dispatch" },
    ]),
    heroBadge: "SERVING RESIDENTIAL, COMMERCIAL & HEAVY INDUSTRIAL NEEDS",
    heroTitle:
      "Premium Hose Pipes, Rubber Sheets & Industrial Sealing Solutions",
    heroSubtitle:
      "NR Industrial Enterprises is a leading manufacturer and supplier of high-quality industrial products. With a commitment to innovation and excellence, we provide solutions that meet the diverse needs of our clients across various industries.",
    heroImage:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=85",
    heroPrimaryCtaText: "Browse All Products",
    heroPrimaryCtaLink: "/products",
    heroSecondaryCtaText: "Contact Us for Quote",
    heroSecondaryCtaLink: "/contact",
    whatsappNumber: "+919876543210",
    whatsappDefaultMsg:
      "Hello NR Industrial Enterprises, I would like to enquire about your hoses, rubber sheets, and industrial products.",
    adminEmail: "sales@nrindustrial.com",
    supportEmail: "info@nrindustrial.com",
    salesPhone: "+91 98765 43210",
    supportPhone: "+91 40 2771 0000",
    addressLine1: "Near Mahakali Police Station, Ranigunj",
    addressLine2: "Industrial Market Area",
    city: "Secunderabad",
    state: "Telangana",
    postalCode: "500003",
    country: "India",
    workingHours: "Mon - Sat: 9:30 AM - 8:00 PM",
    r2AccountId:
      process.env.R2_ACCOUNT_ID || "dea007631f3af58f9336129089cc2f14",
    r2AccessKeyId:
      process.env.R2_ACCESS_KEY_ID || "7734643724b22c5c1a4601e7d4530e21",
    r2SecretAccessKey:
      process.env.R2_SECRET_ACCESS_KEY ||
      "0a70d788c34679305f1efc3704f5645de01b0cc55a27671b2daacf8e4f12721b",
    r2BucketName: process.env.R2_BUCKET_NAME || "projects-bucket",
    r2PublicUrl:
      process.env.R2_PUBLIC_URL ||
      "https://pub-723d911c6a3442c78b2f69b731577d2b.r2.dev",
    seoDefaultTitle:
      "NR Industrial Enterprises | Hose Pipes, Rubber Sheets, PVC Ducts & Teflon Tapes",
    seoTitleTemplate: "%s | NR Industrial Enterprises",
    seoDefaultDescription:
      "NR Industrial Enterprises is a leading manufacturer and supplier of heavy-duty PVC duct hoses, copper-coated steel wire flexible hoses, canvas hoses, hydraulic hoses, silicone rubber sheets, rubber mats, Teflon tapes, and asbestos cloth.",
    seoDefaultKeywords:
      "NR Industrial Enterprises, PVC duct hose, copper coated steel wire flexible hose, canvas hose, hydraulic hose pipe, carbon free rubber hose, silicone rubber sheet, rubber mats, Teflon tape, asbestos cloth, Secunderabad",
  };

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: settingsData,
    create: {
      id: "default",
      ...settingsData,
    },
  });

  // 2. Clear old sample products & categories so only the authentic catalog exists
  await prisma.inquiry.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 3. Seed Authentic Categories
  const categoriesData = [
    {
      name: "Hose Pipes & Ducts",
      slug: "hose-pipes-and-ducts",
      shortDescription:
        "Heavy-duty PVC duct hoses, transparent copper-coated steel wire flexible hoses, canvas hoses, and hydraulic hose pipes.",
      description:
        "Complete range of flexible and reinforced hose pipes and ducting solutions for residential ventilation, commercial air/water transfer, dust extraction, agricultural water delivery, and high-pressure hydraulic machinery.",
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
      bannerImage:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85",
      featured: true,
      sortOrder: 1,
      metaTitle:
        "Hose Pipes & PVC Ducts | PVC, Steel Wire, Canvas & Hydraulic Hoses",
      metaDescription:
        "Buy heavy-duty PVC duct hoses, transparent copper-coated steel wire flexible hoses, canvas hoses, and hydraulic hose pipes from NR Industrial Enterprises.",
    },
    {
      name: "Industrial Linings & Rubber Sheets",
      slug: "industrial-linings-and-sheets",
      shortDescription:
        "Carbon-free rubber hoses, high-temperature silicone rubber sheets, neoprene sheets, and durable rubber mats.",
      description:
        "High-grade industrial rubber sheets, electrical safety flooring mats, high-temperature silicone sheets, and specialized carbon-free rubber hoses designed for furnaces, commercial kitchens, workshops, and electrical substations.",
      image:
        "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1000&q=80",
      bannerImage:
        "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1400&q=85",
      featured: true,
      sortOrder: 2,
      metaTitle:
        "Industrial Rubber Sheets, Mats & Carbon-Free Hoses | NR Industrial",
      metaDescription:
        "Supplier of silicone rubber sheets, durable rubber flooring mats, and carbon-free rubber hoses for commercial and industrial applications.",
    },
    {
      name: "Sealing & Industrial Textiles",
      slug: "sealing-and-textiles",
      shortDescription:
        "Industrial thread seal Teflon tapes (PTFE), woven asbestos cloth, thermal insulation textiles, and gland packings.",
      description:
        "Reliable leak-proof pipe thread sealing tapes and high-temperature thermal insulation fabrics including PTFE Teflon tapes and heavy-duty woven asbestos cloth for plumbing, boilers, exhausts, and industrial pipelines.",
      image:
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80",
      bannerImage:
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=85",
      featured: true,
      sortOrder: 3,
      metaTitle: "Teflon Tapes & Asbestos Cloth | Sealing & Industrial Textiles",
      metaDescription:
        "High-density industrial thread seal Teflon tapes and heat-resistant asbestos cloth supplied by NR Industrial Enterprises.",
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created.id;
  }

  // 4. Seed Authentic Products
  const productsData = [
    {
      name: "Heavy-Duty PVC Duct Hose Pipe",
      slug: "heavy-duty-pvc-duct-hose-pipe",
      sku: "NR-HD-101",
      shortDescription:
        "Flexible rigid-spiral reinforced PVC ducting hose for dust extraction, air ventilation, fume removal, and water suction.",
      description:
        "Our Heavy-Duty PVC Duct Hose is manufactured with a smooth soft PVC wall reinforced with a crush-resistant rigid PVC helix spiral. Ideal for residential, commercial, and industrial ventilation, woodworking dust collection, chiller ducting, and light material handling.",
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
      ]),
      specifications: JSON.stringify([
        { label: "Inner Diameter", value: "1 inch (25mm) to 12 inch (300mm)" },
        { label: "Material", value: "Soft PVC Wall with Rigid PVC Spiral" },
        { label: "Color", value: "Grey / White / Blue" },
        { label: "Temperature Range", value: "-10°C to +65°C" },
        { label: "Standard Roll Length", value: "10m / 15m / 30m" },
      ]),
      features: JSON.stringify([
        "Highly flexible with small bending radius for tight installations",
        "Smooth inner bore minimizes air and fluid friction loss",
        "Weather, abrasion, and mild chemical resistant",
        "Suitable for both domestic ventilation and factory dust blowers",
      ]),
      applications: JSON.stringify([
        "Air Conditioning & HVAC Ventilation",
        "Woodworking & CNC Dust Extraction",
        "Industrial Fume & Smoke Exhaust",
        "Agricultural & Commercial Water Drainage",
      ]),
      priceLabel: "Best Wholesale Price",
      minOrderQty: "10 Meters",
      unit: "Meter / Roll",
      inStock: true,
      featured: true,
      sortOrder: 1,
      categoryId: categoryMap["hose-pipes-and-ducts"],
    },
    {
      name: "Transparent Copper-Coated Steel Wire Flexible Hose",
      slug: "transparent-copper-coated-steel-wire-flexible-hose",
      sku: "NR-HD-102",
      shortDescription:
        "Crystal-clear flexible PU/PVC hose reinforced with a high-tensile copper-coated spring steel wire helix.",
      description:
        "Engineered for full visual flow monitoring and high suction/vacuum strength. The embedded copper-coated steel wire spiral prevents kinking and collapsing under vacuum while allowing static electricity grounding when connected properly.",
      image:
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80",
      ]),
      specifications: JSON.stringify([
        { label: "Size Range", value: "25 mm (1\") to 200 mm (8\") ID" },
        { label: "Reinforcement", value: "Copper-Coated Spring Steel Wire Helix" },
        { label: "Wall Material", value: "Transparent PU / Virgin PVC" },
        { label: "Wall Thickness", value: "0.6 mm to 2.5 mm" },
        { label: "Operating Temperature", value: "-20°C to +80°C" },
      ]),
      features: JSON.stringify([
        "100% transparent body for easy visual inspection of material flow",
        "Crush and kink resistant under heavy suction and vacuum pressure",
        "High abrasion and tear resistance for granules, powder, and air",
        "Food-safe and non-toxic grade options available",
      ]),
      applications: JSON.stringify([
        "Pharmaceutical & Food Powder Transfer",
        "CNC Router & Woodworking Chip Suction",
        "Plastic Granule Loader Conveying",
        "Commercial Vacuum & Suction Systems",
      ]),
      priceLabel: "Request Quote",
      minOrderQty: "10 Meters",
      unit: "Meter / Roll",
      inStock: true,
      featured: true,
      sortOrder: 2,
      categoryId: categoryMap["hose-pipes-and-ducts"],
    },
    {
      name: "Heavy-Duty Water & Fire Delivery Canvas Hose Pipe",
      slug: "heavy-duty-canvas-hose-pipe",
      sku: "NR-HD-103",
      shortDescription:
        "Woven synthetic polyester/cotton canvas lay-flat hose with rubberized inner lining for water delivery, agriculture, and firefighting.",
      description:
        "Lightweight, roll-flat canvas hose pipe designed for high-volume water discharge, construction site dewatering, gardening, agricultural irrigation, and fire hydrant systems. Rolls up compactly for easy storage and transport.",
      image:
        "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=1000&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=1000&q=80",
      ]),
      specifications: JSON.stringify([
        { label: "Diameter", value: "1.5 inch (38mm), 2 inch (50mm), 2.5 inch (63mm), 3 inch (75mm)" },
        { label: "Jacket Material", value: "High-Tenacity Woven Polyester / Canvas" },
        { label: "Working Pressure", value: "8 Bar to 16 Bar" },
        { label: "Roll Length", value: "15 Meters / 30 Meters" },
      ]),
      features: JSON.stringify([
        "Lay-flat design rolls up easily for compact storage",
        "Mildew, rot, and weather-resistant woven outer jacket",
        "Available with or without Gunmetal / Aluminum couplings",
      ]),
      applications: JSON.stringify([
        "Commercial & Residential Building Fire Safety",
        "Agricultural Farm Irrigation & Water Supply",
        "Construction Site Dewatering Pumps",
        "Municipal & Garden Watering",
      ]),
      priceLabel: "Best Price Guaranteed",
      minOrderQty: "1 Roll",
      unit: "Roll",
      inStock: true,
      featured: true,
      sortOrder: 3,
      categoryId: categoryMap["hose-pipes-and-ducts"],
    },
    {
      name: "High-Pressure Wire Braided Hydraulic Hose Pipe",
      slug: "high-pressure-hydraulic-hose-pipe",
      sku: "NR-HD-104",
      shortDescription:
        "SAE 100 R1 / R2 high-tensile steel wire braided hydraulic hose for earthmovers, lifts, presses, and industrial machinery.",
      description:
        "Built with oil-resistant synthetic nitrile rubber inner tube and single or double high-tensile steel wire braid reinforcement. Engineered to handle extreme hydraulic oil pressures, impulses, and outdoor abrasion.",
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
      ]),
      specifications: JSON.stringify([
        { label: "Standard", value: "SAE 100 R1AT / R2AT / EN 853 1SN & 2SN" },
        { label: "Inner Diameter", value: "1/4\" to 2\" NB" },
        { label: "Working Pressure", value: "Up to 400 Bar (Depending on Size)" },
        { label: "Temperature Rating", value: "-40°C to +100°C" },
      ]),
      features: JSON.stringify([
        "High-tensile braided steel wire reinforcement for impulse durability",
        "Weather, ozone, and oil-resistant synthetic rubber outer cover",
        "Custom crimping with end fittings available on request",
      ]),
      applications: JSON.stringify([
        "JCB, Excavators & Construction Machinery",
        "Hydraulic Presses & Injection Molding",
        "Agricultural Tractors & Trolleys",
        "Commercial Car Wash & High-Pressure Cleaners",
      ]),
      priceLabel: "Request Quote",
      minOrderQty: "10 Meters",
      unit: "Meter",
      inStock: true,
      featured: true,
      sortOrder: 4,
      categoryId: categoryMap["hose-pipes-and-ducts"],
    },
    {
      name: "Carbon-Free Rubber Hose (Electrical Insulation Grade)",
      slug: "carbon-free-rubber-hose",
      sku: "NR-LS-201",
      shortDescription:
        "Non-conductive carbon-free rubber hose engineered for induction furnaces, steel plants, and electrical cable cooling.",
      description:
        "Specially compounded EPDM/Natural synthetic rubber completely free of conductive carbon black. Provides high dielectric breakdown voltage resistance while carrying cooling water or air near high-voltage induction furnaces and transformers.",
      image:
        "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1000&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1000&q=80",
      ]),
      specifications: JSON.stringify([
        { label: "Inner Diameter", value: "12 mm (1/2\") to 100 mm (4\")" },
        { label: "Leakage Current", value: "Less than 20 Micro-Amps at 5000V DC" },
        { label: "Working Pressure", value: "10 kg/cm² to 15 kg/cm²" },
        { label: "Color", value: "Green / Red / White (Non-Conductive)" },
      ]),
      features: JSON.stringify([
        "100% Carbon-free non-conductive elastomer compound",
        "High thermal resistance against radiant furnace heat",
        "Synthetic textile ply reinforcement for kink resistance",
      ]),
      applications: JSON.stringify([
        "Induction Melting Furnaces & Foundries",
        "High-Voltage Electrical Cable Cooling",
        "Welding Equipment & Steel Rolling Mills",
      ]),
      priceLabel: "Request Quote",
      minOrderQty: "15 Meters",
      unit: "Meter",
      inStock: true,
      featured: true,
      sortOrder: 5,
      categoryId: categoryMap["industrial-linings-and-sheets"],
    },
    {
      name: "High-Temperature Silicone Rubber Sheet",
      slug: "high-temperature-silicone-rubber-sheet",
      sku: "NR-LS-202",
      shortDescription:
        "Flexible heat-resistant silicone rubber sheets for gaskets, food processing, pharma, and high-temperature sealing.",
      description:
        "Premium virgin silicone rubber sheets offering exceptional resistance to extreme temperatures (-60°C to +250°C), UV, ozone, and aging. Available in translucent food/pharma grade as well as red oxide and white industrial grades.",
      image:
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1000&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1000&q=80",
      ]),
      specifications: JSON.stringify([
        { label: "Thickness Range", value: "0.5 mm to 25 mm" },
        { label: "Standard Roll Width", value: "1.0 Meter / 1.2 Meter" },
        { label: "Temperature Resistance", value: "-60°C to +250°C" },
        { label: "Hardness", value: "50 to 65 Shore A" },
        { label: "Colors Available", value: "Translucent (Clear), Red, White, Grey" },
      ]),
      features: JSON.stringify([
        "Odorless, non-toxic, and compliant with food & pharmaceutical standards",
        "Remains flexible without cracking at high oven temperatures",
        "Easy to die-cut into custom flange gaskets and strips",
      ]),
      applications: JSON.stringify([
        "Pharmaceutical & Food Processing Seals",
        "High-Temperature Oven & Autoclave Door Gaskets",
        "Vacuum Laminating & Solar Panel Presses",
        "Commercial Kitchen & Bakery Equipment",
      ]),
      priceLabel: "Best Wholesale Price",
      minOrderQty: "1 Roll / Sheet",
      unit: "Kg / Roll",
      inStock: true,
      featured: true,
      sortOrder: 6,
      categoryId: categoryMap["industrial-linings-and-sheets"],
    },
    {
      name: "Heavy-Duty Anti-Slip & Electrical Safety Rubber Mat",
      slug: "heavy-duty-durable-rubber-mats",
      sku: "NR-LS-203",
      shortDescription:
        "Durable anti-fatigue, checkered, and IS 15652 electrical insulating rubber floor mats for residential, gym, commercial, and factory floors.",
      description:
        "Manufactured from high-density natural and synthetic rubber compounds for impact absorption, slip prevention, and electrical shock protection. Ideal for workshops, electrical control panels, gyms, commercial kitchens, and residential garages.",
      image:
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80",
      ]),
      specifications: JSON.stringify([
        { label: "Surface Patterns", value: "Checkered, Ribbed, Coin-Dot, Hollow Ring, Plain" },
        { label: "Thickness", value: "2 mm to 25 mm" },
        { label: "Standard Size", value: "1m × 2m Sheets or 1m × 10m Rolls" },
        { label: "Electrical Grade Option", value: "IS 15652 Certified (3.3kV / 11kV / 33kV)" },
      ]),
      features: JSON.stringify([
        "Heavy-duty tear and abrasion resistance under foot and trolley traffic",
        "Anti-skid textured surface works in wet and oily areas",
        "Absorbs machinery vibration and reduces worker fatigue",
      ]),
      applications: JSON.stringify([
        "Factory Floors & Machine Workshops",
        "Electrical Panel Rooms & Substations",
        "Commercial Kitchens, Hotels & Gyms",
        "Residential Garages & Entrance Flooring",
      ]),
      priceLabel: "Request Quote",
      minOrderQty: "1 Sheet / Roll",
      unit: "Piece / Roll",
      inStock: true,
      featured: true,
      sortOrder: 7,
      categoryId: categoryMap["industrial-linings-and-sheets"],
    },
    {
      name: "Industrial PTFE Thread Seal Teflon Tape",
      slug: "industrial-thread-seal-teflon-tape",
      sku: "NR-ST-301",
      shortDescription:
        "100% virgin PTFE high-density thread seal tape for leak-proof plumbing, gas lines, pneumatic fittings, and industrial piping.",
      description:
        "High-density virgin PTFE Teflon thread seal tape that lubricates and seals pipe threads instantly against water, air, oil, gas, and chemical leaks. Will not harden, crack, or dry out over time.",
      image:
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80",
      ]),
      specifications: JSON.stringify([
        { label: "Tape Width", value: "12 mm (1/2\"), 19 mm (3/4\"), 25 mm (1\")" },
        { label: "Length per Spool", value: "10m / 12m / 15m" },
        { label: "Material", value: "100% Virgin PTFE (Polytetrafluoroethylene)" },
        { label: "Temperature Range", value: "-190°C to +260°C" },
      ]),
      features: JSON.stringify([
        "High density ensures tight sealing with fewer wraps",
        "Chemically inert and resistant to solvents, acids, and gases",
        "Prevents thread galling and corrosion on brass, GI, SS, and PVC pipes",
      ]),
      applications: JSON.stringify([
        "Residential & Commercial Plumbing Fittings",
        "Pneumatic Air Compressor Lines",
        "Industrial Water, Oil & Chemical Pipelines",
        "RO Water Purifiers & Sanitary Installations",
      ]),
      priceLabel: "Wholesale Box Pricing",
      minOrderQty: "50 Pieces (1 Box)",
      unit: "Box / Piece",
      inStock: true,
      featured: true,
      sortOrder: 8,
      categoryId: categoryMap["sealing-and-textiles"],
    },
    {
      name: "Heat-Resistant Woven Asbestos Cloth",
      slug: "heat-resistant-woven-asbestos-cloth",
      sku: "NR-ST-302",
      shortDescription:
        "Heavy-duty woven chrysotile asbestos cloth for boiler lagging, exhaust pipe wrapping, furnace curtains, and thermal insulation.",
      description:
        "Tightly woven from high-grade long-fiber asbestos yarn to provide superior thermal insulation, flame resistance, and mechanical strength in high-temperature industrial environments. Available in plain and metallic wire-reinforced grades.",
      image:
        "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=1000&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=1000&q=80",
      ]),
      specifications: JSON.stringify([
        { label: "Thickness", value: "1.5 mm, 2.0 mm, 3.0 mm, 5.0 mm" },
        { label: "Standard Roll Width", value: "1 Meter (40 inches)" },
        { label: "Working Temperature", value: "Up to 450°C - 550°C" },
        { label: "Packaging", value: "25 Kg / 50 Kg Rolls" },
      ]),
      features: JSON.stringify([
        "Excellent thermal barrier for steam lines, boilers, and exhaust manifolds",
        "Resistant to flame, molten metal splashes, and industrial heat",
        "Flexible weave wraps easily around curved pipes and valves",
      ]),
      applications: JSON.stringify([
        "Boiler, Turbine & Steam Pipe Lagging",
        "Generator & Heavy Vehicle Exhaust Wrapping",
        "Furnace Heat Curtains & Welding Blankets",
        "High-Temperature Flange & Manhole Gaskets",
      ]),
      priceLabel: "Request Quote",
      minOrderQty: "1 Roll (25 Kg)",
      unit: "Kg / Roll",
      inStock: true,
      featured: true,
      sortOrder: 9,
      categoryId: categoryMap["sealing-and-textiles"],
    },
  ];

  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }

  // 5. Seed Realistic Customer Inquiries
  const firstProduct = await prisma.product.findFirst();
  await prisma.inquiry.createMany({
    data: [
      {
        type: "PRODUCT_EMAIL",
        name: "Ramesh Reddy",
        email: "ramesh@hyderabadbuilders.in",
        phone: "+91 98480 22334",
        company: "Sri Sai MEP Contractors",
        subject: "Quote for 4-inch Transparent Copper-Coated Steel Wire Hose & PVC Ducts",
        message:
          "Hello NR Industrial Enterprises, we need 60 meters of 4-inch Transparent Copper-Coated Steel Wire Flexible Hose and 100 meters of Heavy-Duty PVC Duct Hose for a commercial site in Hyderabad. Please share your best rate.",
        quantity: "160 Meters Total",
        productId: firstProduct?.id,
        productName: firstProduct?.name,
        productSku: firstProduct?.sku,
        status: "NEW",
        emailSent: true,
      },
      {
        type: "CONTACT_FORM",
        name: "Srinivas Rao",
        email: "purchase@deccanfoods.com",
        phone: "+91 99490 88776",
        company: "Deccan Food Processing Pvt Ltd",
        subject: "Requirement: Food-Grade Silicone Rubber Sheets & Teflon Tapes",
        message:
          "We are looking for 3mm and 5mm translucent Silicone Rubber Sheets along with 5 boxes of Industrial PTFE Teflon Tape. Please let us know ready stock availability at your Ranigunj store.",
        quantity: "5 Rolls + 5 Boxes",
        status: "IN_PROGRESS",
        emailSent: true,
      },
    ],
  });

  console.log("✅ Authentic catalog seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
