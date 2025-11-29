import React from 'react';

const HelpCategories = () => {
  return (
    <>
      {/* categories Section */}
      <section>
        <div className="bg-[#f7f7f7] text-gray-700 py-6 mt-8">
          <div className="max-w-6xl mx-auto px-8 mr-48">
            <div className="flex flex-wrap justify-items-start gap-8">
              <h2 className="text-lg font-medium text-gray-900 cursor-pointer hover:underline">Guest</h2>
              <h2 className="text-lg font-medium text-gray-900 cursor-pointer hover:underline">Home host</h2>
              <h2 className="text-lg font-medium text-gray-900 cursor-pointer hover:underline">Experience host</h2>
              <h2 className="text-lg font-medium text-gray-900 cursor-pointer hover:underline">Service host</h2>
              <h2 className="text-lg font-medium text-gray-900 cursor-pointer hover:underline">Travel admin</h2>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HelpCategories;
