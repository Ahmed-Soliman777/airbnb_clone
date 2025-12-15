import React from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HelpLoginSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <section className="bg-white max-w-5xl mx-auto flex items-center justify-center py-8 px-6 border border-[#dddddd] rounded-lg">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-semibold text-black mb-2">
              {t("help.We're here for you")}
            </h3>
            <p className="text-black">
  {t("help.Log in to get help with your reservations, account, and more")}
</p>

          </div>

          <div className="flex gap-4">
            <button
              style={{ backgroundColor: "#FF385C" }}
              className="px-6 py-3 rounded-lg text-white font-normal cursor-pointer"
              onClick={handleLogin}
            >
              {t('help.Log in or signup')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpLoginSection;
