import React from 'react';
import { useTranslation } from 'react-i18next';

const HelpCategories = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* categories Section */}
      <section>
        <div className="bg-[#f7f7f7] text-gray-700 py-6 mt-8">
          <div className="max-w-6xl mx-auto px-8 mr-48">
            <div className="flex flex-wrap justify-items-start gap-8">

              <h2 className="text-lg font-medium text-gray-900 cursor-pointer hover:underline">
                {t("help.Guest")}
              </h2>

              <h2 className="text-lg font-medium text-gray-900 cursor-pointer hover:underline">
                {t("help.Home host")}
              </h2>

              <h2 className="text-lg font-medium text-gray-900 cursor-pointer hover:underline">
                {t("help.Experience host")}
              </h2>

              <h2 className="text-lg font-medium text-gray-900 cursor-pointer hover:underline">
                {t("help.Service host")}
              </h2>

              <h2 className="text-lg font-medium text-gray-900 cursor-pointer hover:underline">
                {t("help.Travel admin")}
              </h2>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HelpCategories;
