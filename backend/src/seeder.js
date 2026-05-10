const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  shortDescription: String,
  price: Number,
  discountPrice: Number,
  category: String,
  isFeatured: Boolean,
  stock: Number,
  specifications: Object,
  features: Array,
  applications: Array,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'customer' }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

// Data
const products = [
  {
    name: "Gypsum Board Standard 9mm",
    description: "High-quality standard gypsum board, perfect for interior walls and ceilings. Manufactured with precision for smooth finish and easy installation.",
    shortDescription: "Standard 9mm gypsum board for walls and ceilings",
    price: 75000,
    category: "gypsum-board",
    isFeatured: true,
    stock: 500,
    specifications: { thickness: "9mm", width: "1200mm", length: "2400mm", weight: "17.5 kg/sheet", color: "White", material: "Gypsum" },
    features: [{ title: "Fire Resistant", description: "Excellent fire protection", icon: "🔥" }],
    applications: ["Interior walls", "Ceilings", "Partitions"]
  },
  {
    name: "Gypsum Board Moisture Resistant 12mm",
    description: "Special moisture-resistant gypsum board designed for wet areas like bathrooms and kitchens.",
    shortDescription: "Water-resistant 12mm board for wet areas",
    price: 95000,
    discountPrice: 85000,
    category: "gypsum-board",
    isFeatured: true,
    stock: 350,
    specifications: { thickness: "12mm", width: "1200mm", length: "2400mm", weight: "23 kg/sheet", color: "Green", material: "Moisture-Resistant Gypsum" }
  },
  {
    name: "Gypsum Powder Premium",
    description: "Fine quality gypsum powder for making cornices, moldings, and decorative elements.",
    shortDescription: "Premium gypsum powder for decorative work",
    price: 25000,
    category: "gypsum-powder",
    isFeatured: true,
    stock: 1000,
    specifications: { weight: "25 kg/bag", color: "White", material: "Pure Gypsum" }
  },
  {
    name: "PVC Ceiling Tiles 60x60",
    description: "Modern PVC ceiling tiles that combine aesthetics with functionality. Lightweight, durable, and easy to maintain.",
    shortDescription: "Modern PVC ceiling tiles",
    price: 45000,
    category: "ceiling-tiles",
    isFeatured: false,
    stock: 750,
    specifications: { thickness: "5mm", width: "595mm", length: "595mm", color: "White", material: "PVC" }
  },
  {
    name: "Gypsum Cornice Classic",
    description: "Elegant gypsum cornice for decorative ceiling-wall junctions. Adds a touch of luxury to any room.",
    shortDescription: "Classic gypsum cornice molding",
    price: 35000,
    category: "cornice",
    isFeatured: true,
    stock: 200,
    specifications: { length: "2000mm", color: "White", material: "Gypsum" }
  },
  {
    name: "Joint Compound 20kg",
    description: "Ready-mix joint compound for filling joints, corner beads, and fasteners. Smooth application with excellent adhesion.",
    shortDescription: "Ready-mix joint compound",
    price: 85000,
    category: "compound",
    isFeatured: false,
    stock: 300,
    specifications: { weight: "20 kg", color: "White", material: "Gypsum Compound" }
  },
  {
    name: "Metal Stud 75mm",
    description: "Galvanized steel metal stud for partition framing. Strong, durable, and easy to work with.",
    shortDescription: "Galvanized metal stud 75mm",
    price: 28000,
    category: "accessories",
    isFeatured: false,
    stock: 600,
    specifications: { width: "75mm", length: "4000mm", material: "Galvanized Steel" }
  },
  {
    name: "Drywall Screws 1 inch",
    description: "Self-tapping drywall screws for attaching gypsum boards to metal or wood studs.",
    shortDescription: "Self-tapping drywall screws",
    price: 15000,
    category: "accessories",
    isFeatured: false,
    stock: 2000,
    specifications: { size: "1 inch", quantity: "100 pcs/pack", material: "Steel" }
  }
];

const users = [
  {
    name: "Admin",
    email: "admin@gypsumpro.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Demo Customer",
    email: "customer@gypsumpro.com",
    password: "customer123",
    role: "customer"
  }
];

// Seed function
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Insert products
    await Product.insertMany(products);
    console.log(`${products.length} products inserted`);

    // Insert users
    for (const user of users) {
      await User.create(user);
    }
    console.log(`${users.length} users created`);

    console.log('\n✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('\n📋 Demo Accounts:');
    console.log('  Admin:    admin@gypsumpro.com / admin123');
    console.log('  Customer: customer@gypsumpro.com / customer123');
    console.log('\n🌐 Access:');
    console.log('  Website:     http://localhost:5173');
    console.log('  Admin Login: http://localhost:5173/login');
    console.log('  Sign Up:     http://localhost:5173/signup');

    process.exit();
  } catch (error) {
    console.error('Seeder Error:', error);
    process.exit(1);
  }
};

seed();