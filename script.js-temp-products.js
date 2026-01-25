// ===== PRODUCT DATA =====
const products = [
    {
        id: 1,
        name: "Classic Zippo Lighter",
        category: "lighters",
        price: 3899,
        description: "Iconic windproof lighter with lifetime guarantee",
        images: ["https://www.hansonellis.com/mm5/graphics/00000001/engraved-silver-polished-classic-zippo-lighter.jpg", "https://www.zippo.com/cdn/shop/products/zau89ndsgta0yvs3nprh.jpg?v=1744725583&width=1445", "https://assets.katogroup.eu/i/katogroup/ZP250-023085_01_zippo"],
        video: "flames.mp4",
        emoji: "🔥"
    },
    {
        id: 2,
        name: "Torch Lighter Pro",
        category: "lighters",
        price: 5199,
        description: "Professional grade torch lighter with adjustable flame",
        images: ["https://www.greenlion.net/web/image/315624-38c1bc5d/Green%20Lion%20Jet%20Flame%20Pro%20Windproof%20Lighter%20-%20Black%20%282%29.webp", "https://sc04.alicdn.com/kf/H406dd289a52a4ba2b8a62ce58fd9a2fbv.jpg"],
        video: "flames.mp4",
        emoji: "🔥"
    },
    {
        id: 3,
        name: "Electric Arc Lighter",
        category: "lighters",
        price: 3249,
        description: "USB rechargeable plasma arc lighter",
        images: ["https://m.media-amazon.com/images/I/519Yri1MxPL._UF1000,1000_QL80_.jpg", "https://m.media-amazon.com/images/I/61QTYr-g2HL.jpg"],
        video: "flames.mp4",
        emoji: "⚡"
    },
    {
        id: 4,
        name: "Premium Rolling Papers",
        category: "accessories",
        price: 649,
        description: "Ultra-thin slow-burn rolling papers (50 pack)",
        images: ["https://image.made-in-china.com/202f0j00cNzQCRpaaZrK/14GSM-Make-Your-Own-Brand-Classic-Type-Unbleached-Cigarette-Rolling-Paper-with-Filter-Tips-Package.webp", "https://image.made-in-china.com/202f0j00aosiNztnEOkI/Premium-Cigarette-Rolling-Papers-with-Tips-single-1-1-4-kingslim-size-.webp"],
        video: "flames.mp4",
        emoji: "📄"
    },
    {
        id: 5,
        name: "Grinder Deluxe",
        category: "accessories",
        price: 2599,
        description: "4-piece aluminum grinder with pollen catcher",
        images: ["https://powerhouseexpress.com.pk/cdn/shop/files/anex-ag-639-deluxe-grinder-1.webp?v=1747308208&width=1445", "https://nazarjanssupermarket.com/cdn/shop/files/anex-deluxe-grinder-ag-632-nazar-jan-s-supermarket-2.jpg?v=1715281294"],
        video: "flames.mp4",
        emoji: "⚙️"
    },
    {
        id: 6,
        name: "Glass Ashtray",
        category: "accessories",
        price: 1949,
        description: "Heavy-duty crystal glass ashtray",
        images: ["https://m.media-amazon.com/images/I/51xIA3As5ZL._UF1000,1000_QL80_.jpg", "https://m.media-amazon.com/images/I/61XiEbe55sL._UF1000,1000_QL80_.jpg"],
        video: "flames.mp4",
        emoji: "🚬"
    },
    {
        id: 7,
        name: "Portable Vaporizer",
        category: "gadgets",
        price: 11699,
        description: "Compact dry herb vaporizer with temperature control",
        images: ["https://www.vapor.com/cdn/shop/files/9284486_ef9b251a-d168-42dd-b53c-cc4a67a2f938.png?v=1689910145&width=533", "https://cdn.shopify.com/s/files/1/0083/3817/8111/collections/shop-portable-vaporizers.jpg?v=1739396445"],
        video: "flames.mp4",
        emoji: "💨"
    },
    {
        id: 8,
        name: "LED Lighter Display",
        category: "gadgets",
        price: 4549,
        description: "Rechargeable lighter with LED display",
        images: ["https://www.awelled.com/wp-content/uploads/sites/8/2021/10/LED-Revolving-Ligh-for-jewelry-display-t-AW-RL1120-3-smaller-600x600.jpg", "https://i.ytimg.com/vi/VFALE_lYEyQ/sddefault.jpg"],
        video: "flames.mp4",
        emoji: "💡"
    },
    {
        id: 9,
        name: "Smoking Pipe Set",
        category: "accessories",
        price: 5849,
        description: "Premium wooden pipe with cleaning kit",
        images: ["https://i.ebayimg.com/images/g/TDYAAOSw3EFjQZ4i/s-l1200.png", "https://i.ebayimg.com/images/g/lj4AAeSwbaln~Pl4/s-l1200.jpg"],
        video: "flames.mp4",
        emoji: " 🚬"
    },
    {
        id: 10,
        name: "Butane Refill Pack",
        category: "accessories",
        price: 1689,
        description: "Premium butane fuel (3 pack)",
        images: ["https://image.made-in-china.com/2f0j00fsVhJtdnZTGl/150ml-Butane-Gas-Can-96-Pack-Universal-Gas-Lighter-Refill-Can-Refillable-Butane-Gas.webp", "https://images-na.ssl-images-amazon.com/images/I/81tnULKtwpL._AC_UL495_SR435,495_.jpg"],
        video: "flames.mp4",
        emoji: "⛽"
    },
    {
        id: 11,
        name: "Gold Plated Lighter",
        category: "lighters",
        price: 10399,
        description: "Luxury gold-plated lighter with engraving",
        images: ["https://i.redd.it/q36ksr30m27c1.jpeg", "https://lightersdirect.com/cdn/shop/files/DU24RRR5101710TU-3_1400x.jpg?v=1708963033"],
        video: "flames.mp4",
        emoji: "✨"
    },
    {
        id: 12,
        name: "Smart Lighter Case",
        category: "gadgets",
        price: 3899,
        description: "Protective case with built-in tracker",
        images: ["https://img.drz.lazcdn.com/static/bd/p/d6383feb5b2ac5ab19f157159d61c405.jpg_720x720q80.jpg", "https://m.media-amazon.com/images/I/51jV7M4vUIL.jpg"],
        video: "flames.mp4",
        emoji: "📱"
    }
];
