import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import fs from "node:fs";
import path from "node:path";

function loadEnvVar(name: string): string {
  const fromProcess = process.env[name];
  if (fromProcess) return fromProcess;
  const envPath = path.resolve(".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(new RegExp(`^${name}=(.+)$`, "m"));
    if (match) {
      const value = match[1].trim();
      return value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value;
    }
  }
  throw new Error(`${name} is not set in environment or .env file.`);
}

const connectionString = loadEnvVar("DATABASE_URL");

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const sofa = await prisma.category.upsert({
    where: { slug: "sofa" },
    update: {},
    create: { name: "Sofas", slug: "sofa", description: "Comfortable sofas for every living room", image: "/images/sofa-hero.jpg" },
  });

  const chair = await prisma.category.upsert({
    where: { slug: "chair" },
    update: {},
    create: { name: "Chairs", slug: "chair", description: "Stylish chairs for any room", image: "/images/chair-hero.jpg" },
  });

  const bed = await prisma.category.upsert({
    where: { slug: "bed" },
    update: {},
    create: { name: "Beds", slug: "bed", description: "Beds for a restful sleep", image: "/images/bed-hero.jpg" },
  });

  const dining = await prisma.category.upsert({
    where: { slug: "dining" },
    update: {},
    create: { name: "Dining", slug: "dining", description: "Dining tables and sets", image: "/images/dining-table-hero.jpg" },
  });

  const kitchen = await prisma.category.upsert({
    where: { slug: "kitchen" },
    update: {},
    create: { name: "Kitchen", slug: "kitchen", description: "Kitchen furniture and interiors", image: "/images/kitchen-hero.jpg" },
  });

  const lighting = await prisma.category.upsert({
    where: { slug: "lighting" },
    update: {},
    create: { name: "Lighting", slug: "lighting", description: "Lighting fixtures and lamps", image: "/images/light-hero.jpg" },
  });

  const products: {
    name: string; description: string; price: number; salePrice: number | null;
    stock: number; categoryId: string; imageUrl: string; color?: string; colorHex?: string;
    isFeatured?: boolean; isNewArrival?: boolean; isBestSeller?: boolean; isOnSale?: boolean;
    material?: string; dimensions?: string; weight?: number; details?: string; brand?: string; sku?: string;
  }[] = [
    // === SOFAS (11 products) ===
    { name: "Black Leather Sofa", description: "A sleek and modern black leather sofa that adds sophistication to any living room. Features clean lines, deep seating, and premium Italian leather upholstery.", price: 899.99, salePrice: 809.99, stock: 10, categoryId: sofa.id, isBestSeller: true, imageUrl: "/images/sofa/black.jpg", color: "Black", colorHex: "#1C1C1C", material: "Italian leather, hardwood frame", dimensions: '220 x 90 x 85 cm', weight: 45, details: "Premium Italian leather upholstery\nReinforced hardwood frame with steel springs\nRemovable and washable cushion covers\nDeep-seat design for maximum comfort\nMatching ottoman available separately", brand: "Aristocraft", sku: "SOF-BLK-001" },
    { name: "Blue Velvet Sofa", description: "A stunning blue velvet sofa that brings a bold pop of color and luxury comfort. The rich velvet texture adds a touch of opulence to any living space.", price: 1099.99, salePrice: 934.99, stock: 8, categoryId: sofa.id, isFeatured: true, imageUrl: "/images/sofa/blue.jpg", color: "Blue", colorHex: "#1E3A5F", material: "Velvet upholstery, solid wood frame", dimensions: '230 x 95 x 88 cm', weight: 50, details: "Luxurious velvet fabric in deep navy\nSolid eucalyptus wood frame\nHigh-resilience foam cushioning\nGold-finished tapered legs\n5-year frame warranty", brand: "Aristocraft", sku: "SOF-BLU-002" },
    { name: "Brown Classic Sofa", description: "A timeless brown sofa with plush cushioning, perfect for cozy family rooms. Its classic design complements both traditional and contemporary interiors.", price: 749.99, salePrice: 689.99, stock: 15, categoryId: sofa.id, imageUrl: "/images/sofa/brown.jpg", color: "Brown", colorHex: "#6B4226", material: "Polyester upholstery, plywood frame", dimensions: '210 x 85 x 82 cm', weight: 38, details: "Durable polyester-cotton blend fabric\nKiln-dried plywood frame\nPocket coil seating with foam wrap\nSide pockets for remote and magazines\nEasy assembly required", brand: "Aristocraft", sku: "SOF-BRN-003" },
    { name: "Brown Fabric Sofa", description: "A warm brown fabric sofa offering exceptional comfort and everyday durability. Ideal for high-traffic family rooms.", price: 799.99, salePrice: 703.99, stock: 12, categoryId: sofa.id, imageUrl: "/images/sofa/brown_sofa.jpg", color: "Brown", colorHex: "#8B6914", material: "Linen-blend fabric, hardwood frame", dimensions: '215 x 92 x 86 cm', weight: 42, details: "Linen-blend fabric with stain-resistant finish\nKiln-dried hardwood frame\nRemovable seat cushions with high-resiliency foam\nReversible seat cushions for even wear\nReinforced corner blocking", brand: "Aristocraft", sku: "SOF-BRN2-004" },
    { name: "Green Modern Sofa", description: "A vibrant green sofa that makes a fresh and contemporary statement in your living space. Its clean silhouette fits modern aesthetics.", price: 999.99, salePrice: 949.99, stock: 7, categoryId: sofa.id, isNewArrival: true, imageUrl: "/images/sofa/green.jpg", color: "Green", colorHex: "#2D5A27", material: "Performance fabric, engineered wood frame", dimensions: '225 x 90 x 84 cm', weight: 44, details: "Performance fabric with water-repellent coating\nEngineered wood with sinuous spring suspension\nLoose back pillows for adjustable comfort\nSlim track arms for a modern profile\nNon-marking plastic feet glides", brand: "Aristocraft", sku: "SOF-GRN-005" },
    { name: "Cream Linen Sofa", description: "An elegant cream linen sofa with clean lines for a bright and airy aesthetic that instantly lifts any room.", price: 1149.99, salePrice: null, stock: 6, categoryId: sofa.id, isFeatured: true, imageUrl: "/images/sofa/liner sofa cream.jpg", color: "Cream", colorHex: "#F5F0E1", material: "Belgian linen, hardwood frame", dimensions: '235 x 98 x 90 cm', weight: 52, details: "Premium Belgian linen upholstery\nHardwood frame with dowelled joints\nDown-blend seat cushion filling\nRemovable back and seat cushions\nCustom order fabric options available", brand: "Aristocraft", sku: "SOF-CRM-006" },
    { name: "Orange Statement Sofa", description: "A bold orange sofa that energizes your living room with warmth and personality. A true conversation starter.", price: 949.99, salePrice: 883.49, stock: 5, categoryId: sofa.id, imageUrl: "/images/sofa/orange.jpg", color: "Orange", colorHex: "#D4692C", material: "Velvet upholstery, metal frame", dimensions: '220 x 88 x 82 cm', weight: 40, details: "Rich orange velvet with subtle sheen\nSturdy metal frame with powder-coated finish\nHigh-density foam seat cushions\nDecorative button-tufted backrest\nAnti-slip rubber feet", brand: "Aristocraft", sku: "SOF-ORN-007" },
    { name: "Purple Luxe Sofa", description: "A regal purple sofa that brings depth and drama to any interior design. Its deep hue creates a luxurious focal point.", price: 1199.99, salePrice: 1079.99, stock: 4, categoryId: sofa.id, isBestSeller: true, imageUrl: "/images/sofa/purple.jpg", color: "Purple", colorHex: "#4A2C5D", material: "Chenille upholstery, hardwood frame", dimensions: '240 x 100 x 92 cm', weight: 55, details: "Soft chenille fabric in royal purple\nHardwood frame with lifetime warranty\nGel-infused memory foam seat cushions\nWingback design with nailhead trim\nIncludes two matching throw pillows", brand: "Aristocraft", sku: "SOF-PUR-008" },
    { name: "Green Shyann 2-Seater Sofa", description: "A compact and stylish green 2-seater sofa, ideal for apartments and smaller spaces. Big on style, small on footprint.", price: 699.99, salePrice: 594.99, stock: 9, categoryId: sofa.id, isOnSale: true, imageUrl: "/images/sofa/Shyann 2 Seater Sofa_green.jpg", color: "Green", colorHex: "#5B7B5A", material: "Polyester blend, engineered wood frame", dimensions: '160 x 82 x 78 cm', weight: 32, details: "Compact 2-seater design for small spaces\nPolyester blend fabric with soft texture\nEngineered wood frame with reinforced joints\nFold-down centre armrest with cup holders\nSpace-saving slim profile", brand: "Aristocraft", sku: "SOF-GRN2-009" },
    { name: "Yellow Accent Sofa", description: "A cheerful yellow sofa that brightens any room with its sunny and uplifting presence. Instant mood booster.", price: 879.99, salePrice: 703.99, stock: 6, categoryId: sofa.id, isOnSale: true, imageUrl: "/images/sofa/yellow.jpg", color: "Yellow", colorHex: "#E8C34A", material: "Polyester microfiber, plywood frame", dimensions: '210 x 88 x 84 cm', weight: 39, details: "Stain-resistant microfiber upholstery\nPlywood frame with reinforced seat deck\nCool-gel memory foam seat cushions\nSleek silver metal legs with floor protectors\nEasy-clean fabric technology", brand: "Aristocraft", sku: "SOF-YEL-011" },
    { name: "Watercolor Pastel Sofa", description: "A dreamy watercolor-toned sofa with a soft pastel finish for a whimsical touch. Artistic and unique.", price: 1249.99, salePrice: null, stock: 3, categoryId: sofa.id, isFeatured: true, imageUrl: "/images/sofa/water_color.jpg", color: "Multicolor", colorHex: "#D4C5D6", material: "Textured weave fabric, solid wood frame", dimensions: '230 x 95 x 86 cm', weight: 48, details: "Unique watercolor-inspired fabric pattern\nSolid ash wood frame with mortise and tenon joints\nPlush fibre-down seat and back cushions\nScalloped edge detail on backrest\nHandcrafted by skilled artisans", brand: "Aristocraft", sku: "SOF-PST-010" },

    // === CHAIRS (7 products) ===
    { name: "Blue Accent Chair", description: "A chic blue accent chair with a sturdy frame and comfortable upholstery. Perfect for adding a pop of color to any corner.", price: 299.99, salePrice: 284.99, stock: 20, categoryId: chair.id, imageUrl: "/images/chairs/blue_chair (1).jpg", color: "Blue", colorHex: "#5B7EBD", material: "Polyester upholstery, rubberwood frame", dimensions: '72 x 68 x 86 cm', weight: 12, details: "Mid-century modern silhouette\nRubberwood legs with walnut finish\nHigh-density foam padded seat\nErgonomic curved backrest\nFloor-protecting felt pads on legs", brand: "Aristocraft", sku: "CHR-BLU-001" },
    { name: "Blue Lounge Chair", description: "A relaxed blue lounge chair perfect for reading nooks and cozy corners. Deep seating invites hours of relaxation.", price: 319.99, salePrice: 287.99, stock: 15, categoryId: chair.id, imageUrl: "/images/chairs/blue_chair (2).jpg", color: "Blue", colorHex: "#4A7FB5", material: "Linen blend, metal frame", dimensions: '78 x 74 x 90 cm', weight: 14, details: "Deep lounge-style seat with plush cushion\nPowder-coated metal frame in matte black\nBreathable linen-blend fabric cover\nRemovable seat cushion for easy cleaning\n360-degree swivel base", brand: "Aristocraft", sku: "CHR-BLU2-002" },
    { name: "Blue Designer Chair", description: "A statement blue designer chair that combines form and function beautifully. Sculptural and comfortable.", price: 349.99, salePrice: 321.99, stock: 12, categoryId: chair.id, isBestSeller: true, imageUrl: "/images/chairs/blue_chair (6).jpg", color: "Blue", colorHex: "#2C5270", material: "Velvet upholstery, stainless steel base", dimensions: '68 x 70 x 92 cm', weight: 16, details: "Designer wingback shape in velvet\nPolished stainless steel swivel base\nHigh-density foam with memory foam topper\nDecorative button-tufted back\n360-degree smooth swivel mechanism", brand: "Aristocraft", sku: "CHR-BLU3-003" },
    { name: "Gray Accent Chair", description: "A versatile gray accent chair that complements any color palette effortlessly. Neutral yet stylish.", price: 279.99, salePrice: null, stock: 25, categoryId: chair.id, imageUrl: "/images/chairs/gray_chair.jpg", color: "Gray", colorHex: "#8C8C8C", material: "Polyester boucle, engineered wood frame", dimensions: '70 x 66 x 82 cm', weight: 11, details: "Trendy boucle fabric in warm gray\nEngineered wood frame with reinforced joinery\nGenerous foam padding for all-day comfort\nTapered wooden legs in natural finish\nLightweight and easy to move", brand: "Aristocraft", sku: "CHR-GRY-004" },
    { name: "Red Pair Accent Chairs", description: "A pair of bold red accent chairs, perfect for symmetrical arrangements in living rooms or reception areas.", price: 599.99, salePrice: 527.99, stock: 8, categoryId: chair.id, isFeatured: true, imageUrl: "/images/chairs/pair_red.jpg", color: "Red", colorHex: "#B22222", material: "Polyester velvet, metal frame", dimensions: '75 x 72 x 88 cm', weight: 28, details: "Sold as a matched pair (2 chairs)\nRich crimson velvet upholstery\nGold-finished metal legs with anti-scratch pads\nCurved shell design with foam padding\nNailhead trim detail on front edge", brand: "Aristocraft", sku: "CHR-RED-005" },
    { name: "White Accent Chair", description: "A clean and minimalist single white chair that adds freshness to any space. Pure simplicity.", price: 259.99, salePrice: 220.99, stock: 18, categoryId: chair.id, isOnSale: true, imageUrl: "/images/chairs/single_white_chair.jpg", color: "White", colorHex: "#F0F0F0", material: "Faux leather, plywood frame", dimensions: '68 x 64 x 80 cm', weight: 10, details: "Sleek faux leather with easy-wipe surface\nPlywood frame with spring suspension\nSmooth-sitting foam cushion\nChrome sled base with floor protectors\nStackable design for storage", brand: "Aristocraft", sku: "CHR-WHT-006" },
    { name: "Yellow Accent Chair", description: "A vibrant yellow accent chair that adds a playful and energetic touch to your decor. Fun and functional.", price: 289.99, salePrice: 260.99, stock: 14, categoryId: chair.id, imageUrl: "/images/chairs/yellow_chair.jpg", color: "Yellow", colorHex: "#F4C542", material: "Cotton blend, hardwood frame", dimensions: '72 x 68 x 84 cm', weight: 13, details: "Sunny yellow cotton-blend upholstery\nHardwood frame with lifetime warranty\nTufted backrest with button details\nSplayed wood legs in dark espresso\nNon-slip rubber feet pads", brand: "Aristocraft", sku: "CHR-YEL-007" },

    // === BEDS (10 products) ===
    { name: "Warby Bouclé Bed", description: "A luxurious sculptural bed with rounded edges and tufted terracotta bouclé texture.", price: 1899.99, salePrice: 1709.99, stock: 5, categoryId: bed.id, isFeatured: true, imageUrl: "/images/bed/bed(34).jpg", material: "Bouclé fabric, engineered wood frame", dimensions: '210 x 190 x 130 cm', weight: 75, details: "Sculptural rounded silhouette\nTextured terracotta bouclé upholstery\nPadded headboard with vertical tufting\nSolid slat support system\nBox spring not required", brand: "Aristocraft", sku: "BED-WRB-001" },
    { name: "Cozy Aesthetic Bed", description: "A cozy and stylish bed frame designed to create a warm, inviting bedroom sanctuary.", price: 1299.99, salePrice: 1234.99, stock: 8, categoryId: bed.id, imageUrl: "/images/bed/Cozy Bed Aesthetic.jpg", color: "Beige", colorHex: "#D4C5B0", material: "Linen upholstery, solid wood frame", dimensions: '200 x 180 x 120 cm', weight: 60, details: "Upholstered headboard with button tufting\nSolid pine wood frame with center support\nEasy assembly with pre-drilled holes\nAvailable in multiple fabric colors\nWooden slats included", brand: "Aristocraft", sku: "BED-COZ-002" },
    { name: "Modern Platform Bed", description: "A sleek modern platform bed with a low-profile design and premium upholstered headboard.", price: 1499.99, salePrice: 1379.99, stock: 6, categoryId: bed.id, isBestSeller: true, imageUrl: "/images/bed/bedroom.jpg", color: "Charcoal", colorHex: "#36454F", material: "Polyester fabric, MDF frame", dimensions: '205 x 185 x 105 cm', weight: 55, details: "Low-profile platform design (no box spring needed)\nUpholstered headboard in charcoal fabric\nBuilt-in LED lighting with remote control\nUnder-bed storage drawers (2)\nStrong wood slat support system", brand: "Aristocraft", sku: "BED-MOD-003" },
    { name: "Upholstered Bed Frame", description: "An elegantly upholstered bed frame offering both style and a padded headboard for comfort.", price: 1099.99, salePrice: null, stock: 10, categoryId: bed.id, imageUrl: "/images/bed/Bed.jpg", color: "Navy", colorHex: "#1B2A4A", material: "Polyester velvet, plywood frame", dimensions: '200 x 175 x 115 cm', weight: 50, details: "Padded headboard with diamond stitching\nPlywood frame with reinforced corners\nVertical slats with center leg support\nEasy 30-minute assembly\nNavy velvet upholstery", brand: "Aristocraft", sku: "BED-UPH-004" },
    { name: "Classic Wooden Bed", description: "A classic wooden bed frame with rich grain details and timeless craftsmanship.", price: 1199.99, salePrice: 1055.99, stock: 7, categoryId: bed.id, imageUrl: "/images/bed/4a193d931634689b6ccfdeb1faab3138.jpg", material: "Solid oak wood", dimensions: '210 x 190 x 110 cm', weight: 65, details: "Solid oak construction with natural grain\nTraditional panel headboard and footboard\nSlat support system with center rail\nNon-toxic water-based finish\nHeirloom-quality craftsmanship", brand: "Aristocraft", sku: "BED-CLS-005" },
    { name: "Minimalist Bed Frame", description: "A clean minimalist bed frame with straight lines, ideal for contemporary bedrooms.", price: 999.99, salePrice: 929.99, stock: 9, categoryId: bed.id, imageUrl: "/images/bed/69352a0cf530689429a01ced420fcba8.jpg", color: "White", colorHex: "#E8E0D8", material: "Engineered wood, MDF", dimensions: '198 x 178 x 100 cm', weight: 45, details: "Clean minimalist design with straight lines\nWhite laminate finish with subtle woodgrain\nEasy tool-free assembly system\nUnder-bed clearance for storage boxes\nReinforced center support bar", brand: "Aristocraft", sku: "BED-MIN-006" },
    { name: "Luxury Bedroom Bed", description: "A hotel-inspired luxury bed set with padded headboard and premium finish.", price: 2199.99, salePrice: 1869.99, stock: 3, categoryId: bed.id, isFeatured: true, isOnSale: true, imageUrl: "/images/bed/download (19).jpg", color: "Ivory", colorHex: "#FFFFF0", material: "Premium linen, hardwood frame", dimensions: '215 x 195 x 135 cm', weight: 80, details: "Hotel-style padded headboard with wingbacks\nPremium Belgian linen upholstery\nHardwood frame with metal cross-bracing\nDeep button tufting on headboard\nIncludes matching footboard bench", brand: "Aristocraft", sku: "BED-LUX-007" },
    { name: "Premium Comfort Bed", description: "A premium comfort bed with deep padding and a high-end upholstered base.", price: 1799.99, salePrice: 1619.99, stock: 4, categoryId: bed.id, isBestSeller: true, imageUrl: "/images/bed/download (20).jpg", color: "Gray", colorHex: "#9E9E9E", material: "Chenille fabric, engineered wood frame", dimensions: '205 x 190 x 128 cm', weight: 70, details: "Extra-padded headboard for sit-up comfort\nSoft chenille fabric with subtle sheen\nVertical channel-tufted headboard design\nWood slat foundation with extra center support\nNo box spring needed", brand: "Aristocraft", sku: "BED-PRM-008" },
    { name: "Contemporary Bed Frame", description: "A contemporary bed frame with subtle curves and modern fabric finishings.", price: 1349.99, salePrice: 1282.49, stock: 6, categoryId: bed.id, imageUrl: "/images/bed/download (21).jpg", color: "Beige", colorHex: "#D4C5A9", material: "Polyester fabric, plywood frame", dimensions: '200 x 180 x 118 cm', weight: 58, details: "Subtle curved headboard silhouette\nLight beige fabric with texture weave\nPlywood frame with reinforced stress points\nIntegrated USB charging ports on both sides\nVelvet touch fabric finish", brand: "Aristocraft", sku: "BED-CON-009" },
    { name: "Elegant Canopy Bed", description: "An elegant canopy-style bed that adds drama and grandeur to your sleeping space.", price: 2499.99, salePrice: null, stock: 2, categoryId: bed.id, isFeatured: true, imageUrl: "/images/bed/download (22).jpg", material: "Iron, brass finish", dimensions: '220 x 200 x 200 cm', weight: 90, details: "Grand canopy frame with four posts\nWrought iron construction with brass accents\nAntique bronze finish with clear coat\nCanopy drapery not included\nAssembly by two professionals recommended", brand: "Aristocraft", sku: "BED-CAN-010" },

    // === DINING (7 products) ===
    { name: "Oval Luxury Dining Table Set", description: "A stylish oval dining table set with premium upholstered chairs for a refined dining experience.", price: 2299.99, salePrice: 2069.99, stock: 4, categoryId: dining.id, isFeatured: true, imageUrl: "/images/dining/Stylish Oval Dining Table Sets for Luxury Dining Room Interiors.jpg", material: "Marble, stainless steel, velvet", dimensions: '180 x 110 x 76 cm', weight: 120, details: "Genuine marble tabletop (oval)\nPolished stainless steel base\nIncludes 6 upholstered dining chairs\nPremium velvet chair upholstery\nGold-finished chair legs", brand: "Aristocraft", sku: "DIN-OVL-001" },
    { name: "Corporate Dining Table", description: "A large dining table suitable for cafes, restaurants, and hotels with a modern aesthetic.", price: 1899.99, salePrice: 1747.99, stock: 5, categoryId: dining.id, imageUrl: "/images/dining/CAFE _ RESTAURANT _ HOTEL _ You can contact us for your corporate and individual bulk purchases_.jpg", material: "Laminate, MDF, metal", dimensions: '240 x 100 x 75 cm', weight: 85, details: "Large commercial-grade dining table\nScratch-resistant laminate surface\nSturdy metal base with adjustable feet\nSeats up to 10 guests comfortably\nCommercial warranty included", brand: "Aristocraft", sku: "DIN-CRP-002" },
    { name: "Classic Dining Set", description: "A classic dining room set with solid construction and timeless design.", price: 1299.99, salePrice: 1143.99, stock: 7, categoryId: dining.id, imageUrl: "/images/dining/download (19).jpg", material: "Solid wood, polyester fabric", dimensions: '160 x 90 x 75 cm', weight: 70, details: "Solid acacia wood table and chairs\nIncludes table + 4 side chairs\nWarm walnut finish with protective coating\nPadded seat cushions in beige fabric\nEasy assembly with included tools", brand: "Aristocraft", sku: "DIN-CLS-003" },
    { name: "Modern Dining Table", description: "A sleek modern dining table perfect for contemporary homes and open-plan kitchens.", price: 999.99, salePrice: 849.99, stock: 8, categoryId: dining.id, isOnSale: true, imageUrl: "/images/dining/download (20).jpg", material: "Glass, stainless steel", dimensions: '150 x 85 x 76 cm', weight: 55, details: "Tempered glass tabletop (10mm thick)\nStainless steel X-frame base\nFrosted glass option available\nSeats 4-6 people comfortably\nAnti-slip rubber floor pads", brand: "Aristocraft", sku: "DIN-MOD-004" },
    { name: "Rustic Dining Set", description: "A charming rustic dining set with warm wood tones and farmhouse-inspired style.", price: 1149.99, salePrice: null, stock: 6, categoryId: dining.id, imageUrl: "/images/dining/download (21).jpg", material: "Reclaimed wood, iron", dimensions: '180 x 90 x 76 cm', weight: 78, details: "Reclaimed pine wood tabletop\nWrought iron trestle base\nIncludes 6 matching cross-back chairs\nHand-distressed finish for rustic charm\nSeats up to 8 guests", brand: "Aristocraft", sku: "DIN-RST-005" },
    { name: "Contemporary Dining Suite", description: "A contemporary dining suite with upholstered seating and a statement table design.", price: 1599.99, salePrice: 1487.99, stock: 3, categoryId: dining.id, isBestSeller: true, imageUrl: "/images/dining/download (22).jpg", material: "Engineered wood, PU leather", dimensions: '170 x 90 x 75 cm', weight: 65, details: "Contemporary table with waterfall edge\nPU leather upholstered chairs with chrome base\nIncludes table + 4 chairs\nIntegrated self-storage in table base\nEasy-glide floor glides on chairs", brand: "Aristocraft", sku: "DIN-CNT-006" },
    { name: "Minimalist Dining Table", description: "A minimalist dining table with clean edges and a neutral palette for any interior.", price: 849.99, salePrice: 764.99, stock: 10, categoryId: dining.id, imageUrl: "/images/dining/download (23).jpg", material: "MDF, lacquer", dimensions: '140 x 80 x 75 cm', weight: 42, details: "Clean white lacquer finish\nCompact size perfect for apartments\nTapered legs with brass ferrules\nScratch-resistant surface\nSeats 4 people", brand: "Aristocraft", sku: "DIN-MIN-007" },

    // === KITCHEN (3 products) ===
    { name: "Luxury Kitchen Interior", description: "A high-end luxury kitchen interior with island seating and designer fixtures.", price: 6999.99, salePrice: 6299.99, stock: 2, categoryId: kitchen.id, isFeatured: true, imageUrl: "/images/kitchen/f2b26cb007d73961921c8318a931e814.jpg", material: "Solid wood, quartz, stainless steel", dimensions: '400 x 300 x 220 cm', weight: 350, details: "Custom designed luxury kitchen package\nSolid wood cabinetry with soft-close hinges\nQuartz countertops with waterfall edge\nPremium stainless steel appliances included\nKitchen island with breakfast bar seating", brand: "Aristocraft", sku: "KIT-LUX-001" },
    { name: "Modern Kitchen Setup", description: "A fully equipped modern kitchen with premium cabinetry and sleek countertops.", price: 4999.99, salePrice: 4749.99, stock: 3, categoryId: kitchen.id, imageUrl: "/images/kitchen/2095848275e79854004664013a0e3dce.jpg", material: "Engineered wood, granite", dimensions: '350 x 280 x 210 cm', weight: 280, details: "Modern handleless kitchen design\nHigh-gloss lacquer cabinet fronts\nGranite countertops with integrated sink\nPull-out storage solutions throughout\nIntegrated LED under-cabinet lighting", brand: "Aristocraft", sku: "KIT-MOD-002" },
    { name: "Contemporary Kitchen Design", description: "A contemporary kitchen design with integrated appliances and minimalist storage solutions.", price: 5499.99, salePrice: null, stock: 2, categoryId: kitchen.id, isBestSeller: true, imageUrl: "/images/kitchen/5c0862bfed32004c6b79766f6ebe786d.jpg", material: "Marine plywood, solid surface", dimensions: '380 x 290 x 215 cm', weight: 310, details: "Contemporary handleless kitchen\nMarine plywood carcass for durability\nSolid surface countertops with seamless finish\nIntegrated Bosch appliances\nSoft-close drawers with push-to-open mechanism", brand: "Aristocraft", sku: "KIT-CNT-003" },

    // === LIGHTING (7 products) ===
    { name: "Avant-Garde LED Chandelier", description: "A striking avant-garde LED chandelier that transforms any dining room into a showpiece.", price: 899.99, salePrice: 764.99, stock: 15, categoryId: lighting.id, isFeatured: true, imageUrl: "/images/light/Contemporary Dining Room with Avant-Garde LED Chandelier.jpg", material: "Aluminum, acrylic, LED", dimensions: '90 x 90 x 60 cm', weight: 8, details: "Modern geometric ring design\nIntegrated LED module (3000K warm white)\nDimmable with standard wall dimmer\nAluminum frame with gold finish\nAdjustable cable length (up to 150cm)", brand: "Aristocraft", sku: "LIT-AVG-001" },
    { name: "Lampmaster 3-Ring LED Pendant", description: "A modern 3-ring LED pendant light with a wooden accent and warm white glow.", price: 349.99, salePrice: 279.99, stock: 20, categoryId: lighting.id, isOnSale: true, imageUrl: "/images/light/Lampmaster 3-Ring LED Pendant Light _ Modern Hanging Ceiling Lamp with Wooden Accent & Warm White Gl.jpg", material: "Steel, wood, acrylic", dimensions: '70 x 25 x 120 cm', weight: 5, details: "Three-tier ring pendant design\nNatural walnut wood accents\nIntegrated warm white LEDs (2700K)\nHeight adjustable suspension\nSuitable for dining and living areas", brand: "Aristocraft", sku: "LIT-LMP-002" },
    { name: "Classic Pendant Lamp", description: "A timeless pendant lamp with a clean design suitable for kitchens, dining areas, and hallways.", price: 199.99, salePrice: 189.99, stock: 30, categoryId: lighting.id, imageUrl: "/images/light/Pendant lamp.jpg", material: "Glass, brass", dimensions: '30 x 30 x 35 cm', weight: 2, details: "Clear glass shade with brass fittings\nSuitable for E27 standard bulbs\nSupports up to 60W (LED recommended)\nAdjustable hanging height\nEasy ceiling mount included", brand: "Aristocraft", sku: "LIT-CLS-003" },
    { name: "The Big Present Chandelier", description: "A bold statement chandelier with a sculptural silhouette that anchors large living spaces.", price: 1299.99, salePrice: 1169.99, stock: 5, categoryId: lighting.id, isBestSeller: true, imageUrl: "/images/light/The Big Present.jpg", material: "Metal, crystal, LED", dimensions: '110 x 110 x 80 cm', weight: 15, details: "Grand sculptural chandelier design\nK9 crystal accents with rainbow refraction\nIntegrated RGB LED with remote control\nGold-plated metal frame\nProfessional installation recommended", brand: "Aristocraft", sku: "LIT-BGP-004" },
    { name: "Modern Ceiling Light", description: "A versatile modern ceiling light with a neutral design that suits any room in the home.", price: 249.99, salePrice: null, stock: 25, categoryId: lighting.id, imageUrl: "/images/light/download (19).jpg", material: "Metal, frosted glass", dimensions: '50 x 50 x 18 cm', weight: 3, details: "Sleek flush-mount ceiling fixture\nFrosted glass diffuser for even light\nSuitable for LED bulbs (E27)\nMatte white metal base\nQuick-install bracket system", brand: "Aristocraft", sku: "LIT-MOD-005" },
    { name: "Designer Hanging Light", description: "An elegantly designed hanging light fixture that adds warmth and character to your interiors.", price: 299.99, salePrice: 263.99, stock: 18, categoryId: lighting.id, imageUrl: "/images/light/download (20).jpg", material: "Brass, fabric shade", dimensions: '40 x 40 x 55 cm', weight: 3, details: "Brass hardware with antique finish\nLinen fabric shade in warm beige\nHeight adjustable from 50-150cm\nE27 socket (bulb not included)\nDimmable with compatible bulb", brand: "Aristocraft", sku: "LIT-DSN-006" },
    { name: "Contemporary Pendant Light", description: "A sleek contemporary pendant light with adjustable cord length for flexible installation.", price: 279.99, salePrice: 257.59, stock: 22, categoryId: lighting.id, isNewArrival: true, imageUrl: "/images/light/download (21).jpg", material: "Aluminum, polycarbonate", dimensions: '35 x 35 x 45 cm', weight: 2, details: "Minimalist cylindrical pendant design\nBrushed aluminum finish\nBuilt-in LED module (3000K)\nDimmable driver included\nSuitable for low ceilings", brand: "Aristocraft", sku: "LIT-CNT-007" },
  ];

  for (const p of products) {
    const slug = p.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const scalarData: Record<string, unknown> = {
      name: p.name,
      slug,
      description: p.description,
      price: p.price,
      salePrice: p.salePrice ?? null,
      stock: p.stock,
      categoryId: p.categoryId,
      isFeatured: p.isFeatured ?? false,
      isNewArrival: p.isNewArrival ?? false,
      isBestSeller: p.isBestSeller ?? false,
      isOnSale: p.isOnSale ?? false,
      isActive: true,
      brand: p.brand ?? null,
      sku: p.sku ?? null,
      material: p.material ?? null,
      dimensions: p.dimensions ?? null,
      weight: p.weight ?? null,
      details: p.details ?? null,
    };

    const existing = await prisma.product.findUnique({ where: { slug } });

    if (existing) {
      await prisma.product.update({
        where: { slug },
        data: scalarData,
      });

      if (p.imageUrl) {
        await prisma.productImage.deleteMany({ where: { productId: existing.id } });
        await prisma.productImage.create({
          data: { url: p.imageUrl, alt: p.name, productId: existing.id },
        });
      }

      if (p.color) {
        await prisma.productColor.deleteMany({ where: { productId: existing.id } });
        await prisma.productColor.create({
          data: { name: p.color, hex: p.colorHex ?? null, productId: existing.id },
        });
      }
    } else {
      const createData: Prisma.ProductCreateInput = {
        name: scalarData.name as string,
        slug: scalarData.slug as string,
        description: scalarData.description as string,
        price: scalarData.price as number,
        salePrice: scalarData.salePrice as number | null ?? null,
        stock: scalarData.stock as number,
        category: { connect: { id: scalarData.categoryId as string } },
        isFeatured: scalarData.isFeatured as boolean,
        isNewArrival: scalarData.isNewArrival as boolean,
        isBestSeller: scalarData.isBestSeller as boolean,
        isOnSale: scalarData.isOnSale as boolean,
        isActive: scalarData.isActive as boolean,
        brand: scalarData.brand as string | null ?? null,
        sku: scalarData.sku as string | null ?? null,
        material: scalarData.material as string | null ?? null,
        dimensions: scalarData.dimensions as string | null ?? null,
        weight: scalarData.weight as number | null ?? null,
        details: scalarData.details as string | null ?? null,
        images: p.imageUrl ? { create: [{ url: p.imageUrl, alt: p.name }] } : undefined,
        colors: p.color ? { create: [{ name: p.color, hex: p.colorHex ?? null }] } : undefined,
      };

      await prisma.product.create({ data: createData });
    }
  }

  // ================================================================
  //  DEFAULT ADMIN USER
  // ================================================================

  const existingAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@aristocraft.com",
        password: "$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9Rn6bm1FZwOJK3v0pMl0IRLG2y", // password: "admin123"
        role: "ADMIN",
      },
    });
    console.log("Created default admin user (admin@aristocraft.com / admin123)");
  } else {
    console.log("Admin user already exists, skipping.");
  }

  console.log(`Seeded ${products.length} products across 6 categories.`);

  // ================================================================
  //  FAKE REVIEWS
  // ================================================================

  const reviewUsers = [
    { name: "Sophia Chen", email: "sophia.chen@example.com" },
    { name: "James Mitchell", email: "james.mitchell@example.com" },
    { name: "Olivia Rodriguez", email: "olivia.rodriguez@example.com" },
    { name: "Ethan Park", email: "ethan.park@example.com" },
    { name: "Ava Thompson", email: "ava.thompson@example.com" },
    { name: "Marcus Williams", email: "marcus.williams@example.com" },
    { name: "Isabella Garcia", email: "isabella.garcia@example.com" },
    { name: "Noah Kim", email: "noah.kim@example.com" },
    { name: "Charlotte Brown", email: "charlotte.brown@example.com" },
    { name: "Liam O'Brien", email: "liam.obrien@example.com" },
  ];

  console.log("Seeding review users...");
  const createdUsers = await Promise.all(
    reviewUsers.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          name: u.name,
          email: u.email,
          password: "$2b$10$reviewseedplaceholder12345",
          role: "CUSTOMER",
        },
      })
    )
  );

  const reviewComments = [
    // Comfort
    "So comfortable! I find myself relaxing on it every evening.",
    "The cushions are firm but plush—perfect balance of support and softness.",
    "Sitting on this for hours and it still feels great. Back support is excellent.",
    "Really comfortable, though the seat is a bit shallower than I expected.",
    "Incredibly cozy. Best purchase I've made for the room this year.",
    "The padding is generous without being too soft. Just right for long sitting sessions.",
    // Quality
    "The craftsmanship is outstanding. Every seam is perfectly aligned.",
    "Solid build. You can tell this will last for years to come.",
    "Great quality for the price. Materials feel premium and well-chosen.",
    "Sturdy and well-made. Assembly was straightforward with clear instructions.",
    "The material is even better in person than in the photos. Very impressed with the quality.",
    "Precise stitching and no loose threads anywhere. Really well put together.",
    // Design / Aesthetic
    "Looks stunning in person! Photos don't do it justice at all.",
    "Exactly what I was looking for. The colour matches my decor perfectly.",
    "The design is gorgeous—minimalist but with plenty of character.",
    "Beautiful piece that completely transformed the room's atmosphere.",
    "Love the aesthetic! Gets compliments from every single guest.",
    "The silhouette is elegant without being overly fussy. Perfect proportions.",
    // Value
    "Excellent value for money. Feels much more expensive than it actually is.",
    "Worth every penny. I was hesitant at first but so glad I went for it.",
    "A bit pricey but the quality justifies the cost. Happy with my purchase.",
    "Good mid-range option—not the cheapest but definitely not overpriced.",
    "You get what you pay for and then some. Very fair pricing for this level of quality.",
    // Delivery / Assembly
    "Arrived well-packaged and earlier than expected. Assembly took about half an hour.",
    "Packaging could be better—there was a small scratch but customer service handled it quickly.",
    "Easy to put together with the included tools. Did it solo in about 20 minutes.",
    "Delivery was smooth and the team placed it exactly where I wanted it.",
    "Assembly instructions were clear and all hardware was included. No missing parts.",
    // Mixed / Constructive
    "Great product overall but the colour is slightly darker than shown online.",
    "Love the quality but wish it came in a few more colour options.",
    "Very happy with the purchase. Only minor issue is it attracts pet hair easily.",
    "Good quality but the assembly took longer than expected. Plan for an hour.",
    "Beautiful and comfortable. Would be 5 stars if the cushion covers were removable for cleaning.",
    "Solid piece of furniture. It's heavier than I anticipated though—hard to move around.",
    // Sofa / Chair specific
    "Perfect size for my apartment. Doesn't overwhelm the space at all.",
    "The fabric is pet-friendly and easy to wipe clean. Game changer for pet owners.",
    "Deep seats mean I can curl up with a book for hours. Absolutely love it.",
    "The armrests are at just the right height—comfortable for resting elbows or a cup of tea.",
    // Bed specific
    "Have been sleeping great since switching to this bed. No more back pain in the morning.",
    "The bed frame is rock solid and doesn't squeak at all. Very impressed with the build.",
    "Easy to assemble and the slats are sturdy. No box spring needed which saved me money.",
    "The headboard is beautifully padded. Perfect for sitting up and reading in bed.",
    // Dining specific
    "The dining table is the centrepiece of our home now. Everyone compliments it at dinner parties.",
    "Chairs are comfortable for long dinners. The padding is just right—firm enough for good posture.",
    "The table surface is easy to clean and resistant to spills and heat marks.",
    "Seats six comfortably and the extension leaf is a nice bonus for when we have guests.",
    // Lighting specific
    "The light fixture creates such a warm ambiance. Exactly what the room needed.",
    "Installation was straightforward. The instructions were clear and well-illustrated.",
    "The dimming function is smooth and the colour temperature is perfect for evenings.",
    "Looks so elegant when lit. Creates beautiful shadows and patterns on the walls.",
    // Kitchen specific
    "The cabinets are beautifully finished. Transformed the entire look of our kitchen.",
    "Storage solutions are brilliantly designed. Everything has its place and then some.",
    "The soft-close mechanism on the drawers is so satisfying. High-end feel throughout.",
  ];

  function weightedRating(): number {
    const r = Math.random();
    if (r < 0.45) return 5;
    if (r < 0.75) return 4;
    if (r < 0.90) return 3;
    if (r < 0.97) return 2;
    return 1;
  }

  function randomDate(daysBack = 180): Date {
    const now = Date.now();
    const past = now - daysBack * 86400000;
    return new Date(past + Math.random() * (now - past));
  }

  function shuffleArray<T>(arr: readonly T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  await prisma.review.deleteMany();

  console.log("Seeding reviews...");
  const allProducts = await prisma.product.findMany();
  const reviewData: {
    productId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[] = [];

  for (const product of allProducts) {
    const numReviews = 3 + Math.floor(Math.random() * 3);
    const chosenUsers = shuffleArray(createdUsers).slice(0, numReviews);

    for (const user of chosenUsers) {
      reviewData.push({
        productId: product.id,
        userId: user.id,
        rating: weightedRating(),
        comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        createdAt: randomDate(),
      });
    }
  }

  // Batch insert all reviews at once
  for (let i = 0; i < reviewData.length; i += 100) {
    await prisma.review.createMany({
      data: reviewData.slice(i, i + 100),
    });
  }

  // Recalculate denormalized rating + reviewCount for every product
  for (const product of allProducts) {
    const stats = await prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.product.update({
      where: { id: product.id },
      data: {
        rating: stats._avg.rating ?? 0,
        reviewCount: stats._count,
      },
    });
  }

  console.log(`Seeded ${reviewData.length} reviews across ${allProducts.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
