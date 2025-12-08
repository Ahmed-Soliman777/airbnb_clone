import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HelpContact = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleContact = () => {
        navigate("/register");
    };

    return (
        <div className="bg-gray-50 p-10 rounded-xl border border-gray-200 h-full">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {t("help.Need to get in touch?")}
            </h3>

            <p className="text-gray-600 mb-6">
                {t("help.We’ll start with some questions and get you to the right place.")}
            </p>

            <button
                onClick={handleContact}
                className="w-full py-3 rounded-lg text-black font-medium mb-4 border border-black cursor-pointer"
            >
                {t("help.Contact us")}
            </button>

            <p className="text-gray-600 text-center">
              
                <a href="#" className="text-black hover:underline">
                    {t("help.give us feedback.")}
                </a>.
            </p>
        </div>
    );
};

export default HelpContact;
