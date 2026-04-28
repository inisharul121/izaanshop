/**
 * Revalidation Utility
 * 
 * Triggers Next.js cache revalidation when data changes
 */

const axios = require('axios');

const revalidateCache = async (tag = 'shop-init') => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn('NEXT_PUBLIC_API_URL not set - cache revalidation skipped');
      return false;
    }

    if (!process.env.REVALIDATE_SECRET) {
      console.warn('REVALIDATE_SECRET not set - cache revalidation skipped');
      return false;
    }

    const frontendUrl = process.env.NEXT_PUBLIC_API_URL
      .replace('/api', '')
      .replace(/\/$/, '');

    const response = await axios.post(
      `${frontendUrl}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`,
      { tag },
      { timeout: 5000 }
    );

    console.log(`✅ Cache revalidated for tag: ${tag}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Cache revalidation failed: ${error.message}`);
    // Don't throw - cache invalidation is nice-to-have, not critical
    return false;
  }
};

module.exports = { revalidateCache };
