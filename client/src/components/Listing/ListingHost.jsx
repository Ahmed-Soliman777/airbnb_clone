import React from "react";

export default function HostSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      {/* Title */}
      <h2 className="text-3xl font-semibold mb-8">Meet your host</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT CARD */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 flex flex-col items-center w-full lg:w-1/3">
          <img
            src="/images/host.jpg"
            alt="Host"
            className="w-24 h-24 rounded-full object-cover mb-3"
          />

          <h3 className="text-2xl font-semibold">Jo</h3>

          <span className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <span className="bg-red-500 text-white px-2 py-0.5 text-xs rounded-full">
              Superhost
            </span>
          </span>

          <div className="mt-5 w-full text-center">
            <p className="text-2xl font-semibold">217</p>
            <p className="text-sm text-gray-600 mb-3">Reviews</p>

            <p className="text-2xl font-semibold">4.89⭐</p>
            <p className="text-sm text-gray-600 mb-3">Rating</p>

            <p className="text-2xl font-semibold">8</p>
            <p className="text-sm text-gray-600">Years hosting</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold">Jo is a Superhost</h3>
          <p className="text-gray-700 mt-2 leading-relaxed">
            Superhosts are experienced, highly rated hosts who are committed to
            providing great stays for guests.
          </p>

          {/* Co-hosts */}
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-3">Co-Hosts</h4>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <img
                  src="/images/cohost1.jpg"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-gray-700">Daniel</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="/images/cohost2.jpg"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-gray-700">Pancho</span>
              </div>
            </div>
          </div>

          {/* Host details */}
          <div className="mt-8">
            <h4 className="text-lg font-medium mb-2">Host details</h4>
            <p className="text-gray-700">Response rate: 100%</p>
            <p className="text-gray-700">Responds within an hour</p>
          </div>

          {/* Message button */}
          <button className="mt-8 bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-black transition">
            Message host
          </button>

          {/* Bio */}
          <p className="mt-10 text-gray-700 leading-relaxed">
            Hello, my name is Jo. I am originally from England, and after living
            and travelling and living in many countries I have returned to
            Suffolk, England.
          </p>
        </div>
      </div>
    </section>
  );
}
