const axios = require('axios');

async function testConsolidatedAPI() {
  console.log('🧪 Testing CONSOLIDATED API (/api/shop/init)...');
  try {
    const res = await axios.get('http://localhost:5001/api/shop/init');
    console.log('✅ API SUCCESS!');
    console.log('📦 Data Received:');
    console.log(`   - Banners: ${res.data.banners.length}`);
    console.log(`   - Categories: ${res.data.categories.length}`);
    console.log(`   - Products: ${res.data.products.length}`);
    console.log(`   - Max Price: ${res.data.maxPrice}`);
    
    if (res.data.banners.length > 0 && res.data.products.length > 0) {
      console.log('🌟 VERIFICATION PASSED: All data consolidated successfully.');
    } else {
      console.warn('⚠️ WARNING: Some data is missing in the response.');
    }
  } catch (err) {
    console.error('❌ API FAILED!');
    console.error('Error:', err.message);
  }
}

testConsolidatedAPI();
