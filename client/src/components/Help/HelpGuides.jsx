import React from 'react';
const HelpGuides = () => {
    return (
        <>
          <section className=" py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-xl font-bold text-black">
                            Guides for getting started
                        </h2>
                        <button className="text-black cursor-pointer font-normal ">
                            Browse all topics
                        </button>
                    </div>

                    {/* Guides Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8  ">

                        {/* Item 1 */}
                        <div className=" cursor-pointer   ">
                            <div className="h-64 mb-3">
                                <img
                                    src="https://images.contentstack.io/v3/assets/bltec2ed8e3c4b1e16d/blt7b9def132e4aa927/617b2bd19ff3ae1079a91a6b/help-with-a-reservation-optimized.jpg"
                                    alt="Managing your reservation"
                                    className="w-full h-full object-cover  border rounded-xl "
                                />
                            </div>
                            <h2 className="text-lg font-semibold text-black">
                                Managing your reservation:
                            </h2>
                            <p className="text-black">
                                payments, changes, and cancellations
                            </p>
                        </div>

                        {/* Item 2 */}
                        <div className="cursor-pointer">
                            <div className="h-64 mb-3">
                                <img
                                    src="https://images.contentstack.io/v3/assets/bltec2ed8e3c4b1e16d/blt5912675266dfa56f/AC_Guests_HG_EN_S@3x.png"
                                    alt="Managing your reservation"
                                    className="w-full h-full object-cover border rounded-xl"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-black">
                                AirCover for guests
                            </h3>
                        </div>

                        {/* Item 3 */}
                        <div className="cursor-pointer">
                            <div className="h-64 mb-3">
                                <img
                                    src="https://images.contentstack.io/v3/assets/bltec2ed8e3c4b1e16d/bltc2c41caec93eaf03/617b2bbfb187491e7c56dfce/help-with-hosting-optimized.jpg"
                                    alt="Managing your reservation"
                                    className="w-full h-full object-cover border rounded-xl"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-black">
                                Essential resources for new hosts
                            </h3>
                        </div>

                        {/* Item 4 */}
                        <div className="cursor-pointer">
                            <div className="h-64 mb-3">
                                <img
                                    src="https://images.contentstack.io/v3/assets/bltec2ed8e3c4b1e16d/blt7af0ed915470bd33/how-reviews-work-optimized.jpg"
                                    alt="Managing your reservation"
                                    className="w-full h-full object-cover border rounded-xl"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-black">
                                Getting started as a guest on Airbnb
                            </h3>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}
export default HelpGuides;