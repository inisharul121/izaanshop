/**
 * On-Demand Revalidation API
 * 
 * Called by backend when products/categories change
 * Clears Next.js cache so homepage shows fresh data immediately
 * 
 * Usage (from backend):
 * POST /api/revalidate?secret=YOUR_SECRET
 * Body: { tag: "shop-init" }
 */

import { revalidateTag } from 'next/cache';

export async function POST(request) {
  try {
    // Verify secret token (prevents cache manipulation)
    const secret = request.nextUrl.searchParams.get('secret');
    if (secret !== process.env.REVALIDATE_SECRET) {
      return new Response('Invalid secret', { status: 401 });
    }

    const body = await request.json();
    const tag = body.tag || 'shop-init';

    // Revalidate the cache tag
    revalidateTag(tag);

    return new Response(
      JSON.stringify({
        revalidated: true,
        tag,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Revalidation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        revalidated: false 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
