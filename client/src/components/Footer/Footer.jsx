import React from "react";
import { RiTwitterXFill } from "react-icons/ri";
import { MdOutlineFacebook } from "react-icons/md";
import { IoLogoInstagram } from "react-icons/io";
import { BsCurrencyEuro } from "react-icons/bs";
import { TbWorld } from "react-icons/tb";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#f7f7f7] text-gray-700 py-6 px-4 sm:px-6 md:px-12">

      {/* ===== Top Section ===== */}
      <div className="max-w-12xl mx-auto gap-12 py-6">
        <h3 className="font-semibold flex justify-start mb-4 text-lg sm:text-xl text-black">
          {t("footer.Support")}
        </h3>

        {/* <div className="hidden lg:flex justify-between text-sm max-w-[900px] text-[#222222]">
          <div className="cursor-pointer hover:underline ">{t("footer.Popular")}</div>
          <div className="cursor-pointer hover:underline">{t("footer.Arts & culture")}</div>
          <div className="cursor-pointer hover:underline">{t("footer.Beach")}</div>
          <div className="cursor-pointer hover:underline">{t("footer.Mountains")}</div>
          <div className="cursor-pointer hover:underline">{t("footer.Outdoors")}</div>
          <div className="cursor-pointer hover:underline">{t("footer.Things to do")}</div>
          <div className="cursor-pointer hover:underline">Travel tips & inspiration</div>
          <div className="cursor-pointer hover:underline">Airbnb-friendly apartments</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:hidden gap-3 text-sm text-[#222222]">
          <div className="cursor-pointer hover:underline">{t("footer.Popular")}</div>
          <div className="cursor-pointer hover:underline">{t("footer.Arts & culture")}</div>
          <div className="cursor-pointer hover:underline">{t("footer.Beach")}</div>
          <div className="cursor-pointer hover:underline">{t("footer.Mountains")}</div>
          <div className="cursor-pointer hover:underline">{t("footer.Outdoors")}</div>
          <div className="cursor-pointer hover:underline">{t("footer.Things to do")}</div>
          <div className="cursor-pointer hover:underline">Travel tips & inspiration</div>
          <div className="cursor-pointer hover:underline">Airbnb-friendly apartments</div>
        </div> */}
      </div>

      <hr />

      {/* ===== second section ===== */}
      <div className="text-[#222222] py-6 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Support Section */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">{t("footer.Support")}</h3>
            <div className="flex flex-col space-y-4 text-sm">
              <div className="hover:underline cursor-pointer">{t("footer.Help Center")}</div>
              <div className="hover:underline cursor-pointer">
                {t("footer.Get help with a safety issue")}
              </div>
              <div className="hover:underline cursor-pointer">{t("footer.AirCover")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Anti-discrimination")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Disability support")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Cancellation options")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Report neighborhood concern")}</div>
            </div>
          </div>

          {/* Hosting Section */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">{t("footer.Hosting")}</h3>
            <div className="flex flex-col space-y-4 text-sm">
              <div className="hover:underline cursor-pointer">{t("footer.Airbnb your home")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Airbnb your experience")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Airbnb your servuce")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Hosting resources")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Community forum")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Hosting responsibly")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Join a free Hosting class")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Find a co-host")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Refer a host")}</div>
            </div>
          </div>

          {/* Airbnb Section */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">{t("footer.Airbnb")}</h3>
            <div className="flex flex-col space-y-4 text-sm">
              <div className="hover:underline cursor-pointer">{t("footer.2025 Summer Release")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Newsroom")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Careers")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Investors")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Gift cards")}</div>
              <div className="hover:underline cursor-pointer">{t("footer.Airbnb.org emergency stays")}</div>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* ===== Bottom Section with Icons ===== */}
      <div className="text-[#222222] pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <span>© 2025 Airbnb, Inc.</span>
            <span className="hover:underline cursor-pointer">{t("footer.Privacy")}</span>
            <span className="hover:underline cursor-pointer">{t("footer.Terms")}</span>
            <span className="hover:underline cursor-pointer">{t("footer.Your Privacy Choices")}</span>
          </div>

          {/* Social Icons */}
          <div className="flex gap-2 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-full hover:bg-gray-200 cursor-pointer transition">
              <TbWorld className="text-base sm:text-lg" />
            </div>
            <div className="p-2 sm:p-3 rounded-full hover:bg-gray-200 cursor-pointer transition">
              <BsCurrencyEuro className="text-base sm:text-lg" />
            </div>
            <div className="p-2 sm:p-3 rounded-full hover:bg-gray-200 cursor-pointer transition">
              <MdOutlineFacebook className="text-base sm:text-lg" />
            </div>
            <div className="p-2 sm:p-3 rounded-full hover:bg-gray-200 cursor-pointer transition">
              <RiTwitterXFill className="text-base sm:text-lg" />
            </div>
            <div className="p-2 sm:p-3 rounded-full hover:bg-gray-200 cursor-pointer transition">
              <IoLogoInstagram className="text-base sm:text-lg" />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
