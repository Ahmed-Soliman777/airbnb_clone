import React from "react";

const HelpArticles = () => {
  return (
    <>
      <section className="">
        <div className="max-w-6xl mx-auto px-4 ">
          {/* Header */}
          <div className="flex justify-between items-center mb-12 ">
            <h2 className="text-3xl font-bold text-black">Top articles</h2>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {/* Article 1 */}
            <div className="bg-white0 p-6  border-b border-[#dddddd] ">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 cursor-pointer">
                Cancel your home reservation as a guest
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Your plans have changed and now you need to cancel your home
                reservation. No problem.
              </p>
            </div>

            {/* Article 2 */}
            <div className="bg-white  p-6  border-b border-[#dddddd]">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 cursor-pointer">
                Change the date or time of your service or experience
                reservation
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                If you booked a service or experience, but the date or time no
                longer works for you, don’t...
              </p>
            </div>

            {/* Article 3 */}
            <div className="bg-white border-b border-[#dddddd] p-6 ">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 cursor-pointer">
                If your host cancels your home reservation
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                While it’s rare, sometimes a host may need to cancel a
                reservation. We understand this can...
              </p>
            </div>

            {/* Article 4 */}
            <div className="bg-white border-b border-[#dddddd] p-6 ">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 cursor-pointer">
                Payment methods accepted
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Airbnb accepts a variety of payment methods. However, your
                available options will vary by...
              </p>
            </div>

            {/* Article 5 */}
            <div className="bg-white border-b border-[#dddddd] p-6 ">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Add or remove a payment method
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                If an existing payment method on your account is incorrect (ex:
                an expired credit card..)
              </p>
            </div>

            {/* Article 6 */}
            <div className="bg-white border-b border-[#dddddd]p-6 ">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 cursor-pointer">
                When you’ll pay for your reservation
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Want to know when you’ll be charged for a reservation? It all
                depends on the type of...
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default HelpArticles;
