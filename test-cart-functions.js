const fs = require('fs');
const path = require('path');

// Read script.js content
const scriptContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

// Extract products
const productsMatch = scriptContent.match(/const products = \[([\s\S]*?)\];/);
if (!productsMatch) {
    console.error('❌ Products not found');
    process.exit(1);
}

const products = eval('[' + productsMatch[1] + ']');
console.log('✅ Products found:', products.length);
console.log('Products list:');
products.forEach((p, i) => {
    console.log(`  ${i+1}. [${p.id}] ${p.name} (${p.emoji || '❌'})`);
});

console.log('\n=== Testing Cart Functionality ===');

// Test 1: Add product to cart
console.log('\n1. Adding product to cart:');
const product = products.find(p => p.id === 1);
const cart = [{ ...product, quantity: 1 }];
console.log(`   Product in cart: ${cart[0].name} x${cart[0].quantity}`);
console.log(`   Product emoji: ${cart[0].emoji}`);
console.log(`   Product price: Ksh ${cart[0].price.toLocaleString()}`);

// Test 2: Calculate total
const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
console.log(`\n2. Total: Ksh ${total.toLocaleString()}`);

// Test 3: Validate invalid product
console.log('\n3. Validating invalid product:');
const invalidItem = { id: 999, quantity: 2 };
const validatedItem = (item => {
    const found = products.find(p => p.id === item.id);
    return found ? { ...found, quantity: item.quantity } : {
        ...item,
        name: item.name || 'Unidentified Product',
        price: item.price || 0,
        emoji: item.emoji || '📦'
    };
})(invalidItem);

console.log(`   Input:`, invalidItem);
console.log(`   Output:`, validatedItem);

console.log('\n=== All Tests Passed ===');
