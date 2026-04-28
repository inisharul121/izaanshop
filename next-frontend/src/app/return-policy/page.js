'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ReturnPolicy = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
            <h1 className="text-3xl md:text-4xl font-black text-dark mb-8 uppercase tracking-tight border-b-4 border-primary inline-block pb-2">
              Return, Exchange & Refund Policy
            </h1>

            <div className="prose prose-lg max-w-none text-gray-600 space-y-10">
              {/* English Section */}
              <section className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xl font-black text-dark uppercase flex items-center gap-2">
                    <span className="text-2xl">📌</span> Eligibility
                  </h2>
                  <p>
                    Return, exchange, or refund is applicable only if the delivered product is damaged, defective, incomplete, or incorrect. We carefully verify every claim to ensure a fair and smooth resolution for our customers.
                  </p>
                </div>

                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-4">
                  <h2 className="text-xl font-black text-dark uppercase flex items-center gap-2">
                    <span className="text-2xl">📹</span> Proof Requirement
                  </h2>
                  <p className="font-bold text-dark">
                    To process any claim, an unboxing video is strictly required at the time of receiving the product. This helps us verify the condition of the product accurately.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                    <li>You must report any issue within 3 days of receiving the product along with proper video or photo proof.</li>
                    <li>Please note that no claim will be accepted without valid proof.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-black text-dark uppercase flex items-center gap-2">
                    <span className="text-2xl">🔄</span> Exchange Policy
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                    <li>Once your complaint is reviewed and approved, the exchange process will be completed within 7 days.</li>
                    <li>A replacement product will be sent to your address through our delivery partner.</li>
                    <li>You must hand over the defective or incorrect product to the delivery person, ensuring it is properly packed.</li>
                    <li>For valid issues, Izaan Shop will bear all exchange and delivery charges, so you won’t have to pay anything extra.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-black text-dark uppercase flex items-center gap-2">
                    <span className="text-2xl">💰</span> Refund Policy
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                    <li>If a replacement is not possible or applicable, a full refund will be provided for valid claims.</li>
                    <li>The refund process begins after the returned product is received and successfully passes our quality check.</li>
                    <li>Refunds are usually issued via bank transfer or voucher, depending on the situation.</li>
                    <li>The processing time may take approximately 1–7 working days.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-black text-dark uppercase flex items-center gap-2">
                    <span className="text-2xl">🚚</span> Return Process
                  </h2>
                  <p>
                    In eligible cases, our support team may arrange a pickup service from your address (conditions apply).
                  </p>
                  <p className="text-sm italic bg-red-50 p-4 rounded-xl border border-red-100 text-red-700">
                    However, if the returned product does not meet our policy conditions or the claim is found invalid, the product will be sent back to you, and the return and re-delivery cost must be borne by the customer.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                  <h2 className="text-sm font-black text-dark uppercase flex items-center gap-2">
                    <span className="text-xl">⚠️</span> Important Notes
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-[13px] font-bold leading-relaxed">
                    <li>Return or exchange requests will not be accepted for change of mind, personal preference, or dislike of color, design, or features after purchase.</li>
                    <li>If a wrong product is ordered by the customer, an exchange may be possible, but additional delivery charges will apply.</li>
                    <li>Products categorized as C Grade are not eligible for return, exchange, or refund under any circumstances.</li>
                    <li>Customers are strongly advised to check the product in front of the delivery person at the time of delivery to avoid any issues later.</li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-100 my-12" />

              {/* Bengali Section */}
              <section className="space-y-8 font-bengali">
                <h2 className="text-2xl font-black text-dark uppercase border-b-2 border-primary/20 inline-block pb-1">
                  🔄 Izaan Shop – রিটার্ন, এক্সচেঞ্জ ও রিফান্ড পলিসি
                </h2>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <span className="text-2xl">📌</span> প্রযোজ্যতা
                  </h2>
                  <p>
                    শুধুমাত্র সেই ক্ষেত্রে রিটার্ন, এক্সচেঞ্জ বা রিফান্ড প্রযোজ্য হবে, যখন সরবরাহকৃত পণ্যটি ড্যামেজড, ডিফেক্টিভ, অসম্পূর্ণ বা ভুল হয়। প্রতিটি অভিযোগ আমরা যাচাই করে যথাযথ সমাধান দেওয়ার চেষ্টা করি।
                  </p>
                </div>

                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-4">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <span className="text-2xl">📹</span> প্রমাণ প্রয়োজন
                  </h2>
                  <p className="font-bold text-dark">
                    যেকোনো অভিযোগের জন্য প্রোডাক্ট হাতে পাওয়ার সময় Unboxing Video করা বাধ্যতামূলক। এর মাধ্যমে আমরা পণ্যের অবস্থা সঠিকভাবে যাচাই করতে পারি।
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                    <li>পণ্য পাওয়ার ৩ দিনের মধ্যে ভিডিও বা ছবিসহ আমাদের জানাতে হবে।</li>
                    <li>দয়া করে মনে রাখবেন, প্রমাণ ছাড়া কোনো অভিযোগ গ্রহণযোগ্য হবে না।</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <span className="text-2xl">🔄</span> এক্সচেঞ্জ পলিসি
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                    <li>অভিযোগ যাচাই করে অনুমোদন পাওয়ার পর সর্বোচ্চ ৭ দিনের মধ্যে এক্সচেঞ্জ সম্পন্ন করা হবে।</li>
                    <li>নতুন প্রোডাক্ট ডেলিভারি পার্টনারের মাধ্যমে আপনার ঠিকানায় পৌঁছে দেওয়া হবে।</li>
                    <li>আপনাকে সমস্যাযুক্ত পণ্যটি ভালোভাবে প্যাক করে ডেলিভারি ম্যানের কাছে হস্তান্তর করতে হবে।</li>
                    <li>যদি অভিযোগটি বৈধ হয়, তাহলে সমস্ত এক্সচেঞ্জ ও ডেলিভারি চার্জ Izaan Shop বহন করবে।</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <span className="text-2xl">💰</span> রিফান্ড পলিসি
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                    <li>যদি কোনো কারণে এক্সচেঞ্জ সম্ভব না হয়, তাহলে বৈধ অভিযোগের ক্ষেত্রে সম্পূর্ণ রিফান্ড প্রদান করা হবে।</li>
                    <li>পণ্যটি রিটার্ন হয়ে আমাদের কাছে পৌঁছানোর পর এবং যাচাই সম্পন্ন হলে রিফান্ড প্রসেস শুরু হবে।</li>
                    <li>রিফান্ড সাধারণত ব্যাংক ট্রান্সফার বা ভাউচার এর মাধ্যমে প্রদান করা হয়।</li>
                    <li>এই প্রক্রিয়াটি সম্পন্ন হতে প্রায় ১–৭ কার্যদিবস সময় লাগতে পারে।</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <span className="text-2xl">🚚</span> রিটার্ন প্রসেস
                  </h2>
                  <p>
                    প্রয়োজনে আমাদের টিম আপনার ঠিকানা থেকে পণ্য সংগ্রহ (pickup) করার ব্যবস্থা করতে পারে (শর্ত সাপেক্ষে)।
                  </p>
                  <p className="text-sm italic bg-red-50 p-4 rounded-xl border border-red-100 text-red-700">
                    তবে যদি যাচাই করে দেখা যায় অভিযোগটি সঠিক নয়, তাহলে পণ্যটি পুনরায় আপনাকে ফেরত পাঠানো হবে এবং রিটার্ন ও পুনরায় ডেলিভারির খরচ আপনাকেই বহন করতে হবে।
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                  <h2 className="text-base font-bold text-dark mb-2 flex items-center gap-2">
                    <span className="text-xl">⚠️</span> গুরুত্বপূর্ণ নোট
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-sm font-bold leading-relaxed">
                    <li>পণ্য পছন্দ না হওয়া, রঙ/ডিজাইন ভালো না লাগা বা মত পরিবর্তনের কারণে কোনো রিটার্ন বা এক্সচেঞ্জ গ্রহণযোগ্য নয়।</li>
                    <li>গ্রাহক ভুল করে পণ্য অর্ডার করলে এক্সচেঞ্জ করা যেতে পারে, তবে সে ক্ষেত্রে অতিরিক্ত ডেলিভারি চার্জ প্রযোজ্য হবে।</li>
                    <li>C Grade পণ্যের ক্ষেত্রে কোনো রিটার্ন, এক্সচেঞ্জ বা রিফান্ড প্রযোজ্য নয়।</li>
                    <li>ডেলিভারির সময় অবশ্যই ডেলিভারি ম্যানের সামনে প্রোডাক্ট চেক করার জন্য অনুরোধ করা হচ্ছে।</li>
                  </ul>
                </div>

                <div className="pt-8 text-center text-primary text-lg font-black uppercase tracking-widest">
                  🤝 ধন্যবাদ Izaan Shop এর সাথে থাকার জন্য।
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

export default ReturnPolicy;
