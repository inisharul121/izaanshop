'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ShippingPolicy = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
            <h1 className="text-3xl md:text-4xl font-black text-dark mb-8 uppercase tracking-tight border-b-4 border-primary inline-block pb-2">
              Shipping & Delivery Policy
            </h1>

            <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
              {/* English Section */}
              <section className="space-y-6">
                <p className="font-medium text-lg">
                  Once your order is confirmed, each product goes through a careful quality check and is securely packed before being handed over to our delivery partner.
                </p>

                <div className="space-y-4">
                  <h2 className="text-xl font-black text-dark uppercase flex items-center gap-2">
                    <span className="text-2xl">📮</span> Delivery Process
                  </h2>
                  <p>
                    Our delivery team ensures the fastest possible delivery. If needed, they will contact you to ensure smooth delivery.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-black text-dark uppercase flex items-center gap-2">
                    <span className="text-2xl">🔒</span> Closed Box Delivery
                  </h2>
                  <p>
                    We follow a closed box delivery system to ensure product authenticity, customer privacy, and prevent any tampering.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-black text-dark uppercase flex items-center gap-2">
                    <span className="text-2xl">📦</span> Packaging
                  </h2>
                  <p>
                    Products are packed in white poly mailer bags along with the invoice. Fragile items are secured with bubble wrap.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <div className="space-y-2">
                    <h2 className="text-lg font-black text-dark uppercase flex items-center gap-2">
                      <span className="text-xl">💰</span> Delivery Charges
                    </h2>
                    <ul className="text-sm font-bold space-y-1">
                      <li>Inside Dhaka: <span className="text-primary text-lg">60 BDT</span></li>
                      <li>Outside Dhaka: <span className="text-primary text-lg">120 BDT</span></li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-black text-dark uppercase flex items-center gap-2">
                      <span className="text-xl">⏱️</span> Delivery Time
                    </h2>
                    <ul className="text-sm font-bold space-y-1">
                      <li>Inside Dhaka: <span className="text-dark">1–2 Days</span></li>
                      <li>Outside Dhaka: <span className="text-dark">3–5 Days</span></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                   <h2 className="text-sm font-black text-orange-600 uppercase mb-2 flex items-center gap-2">
                    <span className="text-xl">⚠️</span> Note:
                  </h2>
                  <p className="text-sm font-medium text-orange-700 italic">
                    Delivery may be delayed due to natural disasters, political issues, or transportation problems. Our team will inform you accordingly.
                  </p>
                </div>
              </section>

              <hr className="border-gray-100 my-12" />

              {/* Bengali Section */}
              <section className="space-y-6 font-bengali">
                <h2 className="text-2xl font-black text-dark uppercase border-b-2 border-primary/20 inline-block pb-1">
                  🚚 Izaan Shop – ডেলিভারি নীতিমালা
                </h2>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <span className="text-2xl">📦</span> অর্ডার প্রসেসিং
                  </h2>
                  <p>
                    আপনার অর্ডার কনফার্ম হওয়ার পর প্রতিটি প্রোডাক্ট সতর্কভাবে কোয়ালিটি চেক করে নিরাপদভাবে প্যাক করে ডেলিভারি পার্টনারের কাছে হস্তান্তর করা হয়।
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <span className="text-2xl">📮</span> ডেলিভারি প্রক্রিয়া
                  </h2>
                  <p>
                    ডেলিভারি টিম দ্রুততম সময়ে পণ্য পৌঁছে দেয় এবং প্রয়োজন হলে আপনার সাথে যোগাযোগ করে।
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <span className="text-2xl">🔒</span> ক্লোজড বক্স ডেলিভারি
                  </h2>
                  <p>
                    পণ্যের অরিজিনালিটি, কাস্টমারের গোপনীয়তা এবং কোনো পরিবর্তন রোধে আমরা ক্লোজড বক্স ডেলিভারি নিশ্চিত করি।
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <span className="text-2xl">📦</span> প্যাকেজিং
                  </h2>
                  <p>
                    প্রোডাক্টগুলো সাদা পলি মেইলার ব্যাগে ইনভয়েসসহ প্যাক করা হয় এবং ভঙ্গুর পণ্য বাবল র্যাপ দিয়ে সুরক্ষিত রাখা হয়।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-dark flex items-center gap-2">
                      <span className="text-xl">💰</span> ডেলিভারি চার্জ
                    </h2>
                    <ul className="text-base font-bold space-y-1">
                      <li>ঢাকার ভিতরে: <span className="text-primary text-xl">৬০ টাকা</span></li>
                      <li>ঢাকার বাইরে: <span className="text-primary text-xl">১২০ টাকা</span></li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-dark flex items-center gap-2">
                      <span className="text-xl">⏱️</span> ডেলিভারি সময়
                    </h2>
                    <ul className="text-base font-bold space-y-1">
                      <li>ঢাকার ভিতরে: <span className="text-dark">১–২ দিন</span></li>
                      <li>ঢাকার বাইরে: <span className="text-dark">৩–৫ দিন</span></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                   <h2 className="text-base font-bold text-orange-600 mb-2 flex items-center gap-2">
                    <span className="text-xl">⚠️</span> বিশেষ দ্রষ্টব্য:
                  </h2>
                  <p className="text-sm font-medium text-orange-700 italic">
                    প্রাকৃতিক দুর্যোগ, রাজনৈতিক পরিস্থিতি বা পরিবহন সমস্যার কারণে ডেলিভারিতে দেরি হতে পারে। এ ক্ষেত্রে আমাদের টিম আপনাকে অবহিত করবে।
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ShippingPolicy;
