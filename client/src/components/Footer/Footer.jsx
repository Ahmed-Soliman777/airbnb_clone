import React from "react";
import { RiTwitterXFill } from "react-icons/ri";
import { MdOutlineFacebook } from "react-icons/md";
import { IoLogoInstagram } from "react-icons/io";
import { BsCurrencyEuro } from "react-icons/bs";
import { TbWorld } from "react-icons/tb";
export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-700 mt-10">
            {/* ===== Top Section ===== */}
            <div className="max-w-12xl mx-auto px-6 py-10 gap-12 border-b border-gray-300">
                {/* Inspiration Section */}
                <div>
                    <h3 className="font-semibold flex justify-start mb-4 w-100 text-xl text-black ">
                        Inspiration for future getaways
                    </h3>
                    <div className="flex  justify-between text-sm  w-[900px] text-[#222222]">
                        <div className="cursor-pointer hover:underline ">Popular</div>
                        <div className="cursor-pointer hover:underline  ">Arts & culture</div>
                        <div className="cursor-pointer hover:underline  ">Beach</div>
                        <div className="cursor-pointer hover:underline ">Mountains</div>
                        <div className="cursor-pointer hover:underline ">Outdoors</div>
                        <div className="cursor-pointer hover:underline ">Things to do</div>
                        <div className="cursor-pointer hover:underline ">Travel tips & inspiration</div>
                        <div className="cursor-pointer hover:underline ">Airbnb-friendly apartments</div>
                    </div>
                </div>
            </div>
            {/* ===== scound section ===== */}
            <div className="max-w-7xl mx-auto px-4 py-8 text-[#222222]" >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Support Section */}
                    <div>
                        <h3 className="font-semibold mb-4 text-lg">Support</h3>
                        <div className="flex flex-col space-y-2 text-sm">
                            <div className="hover:underline cursor-pointer">Help Center</div>
                            <div className="hover:underline cursor-pointer">Get help with a safety issue</div>
                            <div className="hover:underline cursor-pointer">AirCover</div>
                            <div className="hover:underline cursor-pointer">Anti-discrimination</div>
                            <div className="hover:underline cursor-pointer">Disability support</div>
                            <div className="hover:underline cursor-pointer">Cancellation options</div>
                            <div className="hover:underline cursor-pointer">Report neighborhood concern</div>
                        </div>
                    </div>

                    {/* Hosting Section */}
                    <div>
                        <h3 className="font-semibold mb-4 text-lg">Hosting</h3>
                        <div className="flex flex-col space-y-2 text-sm">
                            <div className="hover:underline cursor-pointer">Airbnb your home</div>
                            <div className="hover:underline cursor-pointer">Airbnb your experience</div>
                            <div className="hover:underline cursor-pointer">Airbnb your servuce</div>
                            <div className="hover:underline cursor-pointer">AirCover for Hosts</div>
                            <div className="hover:underline cursor-pointer">Hosting resources</div>
                            <div className="hover:underline cursor-pointer">Community forum</div>
                            <div className="hover:underline cursor-pointer">Hosting responsibly</div>
                            <div className="hover:underline cursor-pointer">Airbnb-friendly apartments</div>
                            <div className="hover:underline cursor-pointer">Join a free Hosting class</div>
                            <div className="hover:underline cursor-pointer">Find a co‑host</div>
                            <div className="hover:underline cursor-pointer">Refer a host</div>

                        </div>
                    </div>
                    {/* Airbnb Section */}
                    <div>
                        <h3 className="font-semibold mb-4 text-lg">Airbnb</h3>
                        <div className="flex flex-col space-y-2 text-sm">
                            <div className="hover:underline cursor-pointer">2025 Summer Release</div>
                            <div className="hover:underline cursor-pointer">Newsroom</div>
                            <div className="hover:underline cursor-pointer">Careers</div>
                            <div className="hover:underline cursor-pointer">Investors</div>
                            <div className="hover:underline cursor-pointer">Gift cards</div>
                            <div className="hover:underline cursor-pointer">Airbnb.org emergency stays</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Bottom Section with React Icons ===== */}
            <div className="mt-8 pt-8 border-t border-gray-300 text-[#222222]">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-6 mb-4 md:mb-0">
                        <span className="text-sm">© 2025 Airbnb, Inc.</span>
                        <span className="text-sm hover:underline cursor-pointer">Privacy</span>
                        <span className="text-sm hover:underline cursor-pointer">Terms</span>
                        <span className="text-sm hover:underline cursor-pointer">Your Privacy Choices</span>
                    </div>

                    {/* Social Media Icons from React Icons */}
                    <div className="flex gap-4">
                        <div className="p-3 rounded-full hover:bg-gray-200 cursor-pointer transition ">
                            <h6><TbWorld /></h6>
                        </div>
                        <div className="p-3 rounded-full hover:bg-gray-200 cursor-pointer transition ">
                            <h6><BsCurrencyEuro title="currency" /></h6>
                        </div>
                        <div className="p-3 rounded-full hover:bg-gray-200 cursor-pointer transition ">
                            <h6><MdOutlineFacebook title="Tfacebook" /></h6>
                        </div>

                        < div className="p-3 rounded-full hover:bg-gray-200 cursor-pointer transition ">
                            <h6>
                                <RiTwitterXFill title="Twitter" /></h6>
                        </div>

                        <div className="p-3 rounded-full hover:bg-gray-200 cursor-pointer transition ">
                            <h6>
                                <IoLogoInstagram title="insta" />
                            </h6>
                        </div>

                    </div>

                </div>
            </div>

        </footer>
    );
}