import React from 'react';

const HelpExploreMore = () => {
   

    return (
        <>
         <section className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Left Column - Explore more */}
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                {/* Community Policies */}
                                <div className="lg:col-span-2">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                        Explore more
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                        {/* Community Policies */}
                                        <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src="https://images.contentstack.io/v3/assets/bltec2ed8e3c4b1e16d/bltfd0c4aa52a78e466/618406a16676ac790d1b8f8f/policy-feature-page-banner-optimized.png"
                                                    alt="Our community policies"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="bg-black text-white p-6">
                                                <h3 className="text-xl font-semibold mb-3">
                                                    Our community policies
                                                </h3>
                                                <p className="mb-4 opacity-90">
                                                    How we build a foundation of trust.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Safety Tips  */}
                                        <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden ">
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src="https://images.contentstack.io/v3/assets/bltec2ed8e3c4b1e16d/blt93efaa7b7d28041c/Airbnb-Safety-Web.png"
                                                    alt="Safety tips and guidelines"
                                                    className="w-full h-full object-cover "
                                                />
                                            </div>
                                            <div className="bg-black text-white p-6">
                                                <h3 className="text-xl font-semibold mb-3">
                                                    Safety tips and guidelines
                                                </h3>
                                                <p className="mb-4 opacity-90">
                                                    Resources to help travelers stay safe.
                                                </p>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right Column - Contact us */}
                       
                    </div>
                </div>
            </section>
        </>
    );
};
export default HelpExploreMore;