import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AIRecommendation = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        city: '',
        propertyType: '',
        amenities: [],
        pricePerNight: { min: '', max: '' }
    });

    const propertyTypes = [
        { value: 'apartment', label: 'Apartment', icon: '🏢' },
        { value: 'house', label: 'House', icon: '🏠' },
        { value: 'private_room', label: 'Private Room', icon: '🚪' },
        { value: 'shared_room', label: 'Shared Room', icon: '🛏️' },
        { value: 'villa', label: 'Villa', icon: '🏰' },
        { value: 'studio', label: 'Studio', icon: '🏘️' }
    ];

    const purposeOptions = [
        { value: 'business', label: 'Business', icon: '💼' },
        { value: 'tourism', label: 'Tourism', icon: '🗺️' },
        { value: 'family', label: 'Family Vacation', icon: '👨‍👩‍👧‍👦' },
        { value: 'romantic', label: 'Romantic Getaway', icon: '💑' },
        { value: 'adventure', label: 'Adventure', icon: '🏔️' },
        { value: 'relaxation', label: 'Relaxation', icon: '🧘' }
    ];

    const amenitiesList = [
        { _id: "6916d655d8ded2e7a06424e3", value: 'Pool', label: 'Pool', icon: '🏊' },
        { _id: "6916d655d8ded2e7a06424eb", value: 'TV', label: 'TV', icon: '📺' },
        { _id: "6916d655d8ded2e7a06424ef", value: 'Heating', label: 'Heating', icon: '🔥' },
        { _id: "6916d655d8ded2e7a06424e2", value: 'Terrace', label: 'Terrace', icon: '🌅' },
        { _id: "6916d655d8ded2e7a06424ed", value: 'Breakfast', label: 'Breakfast', icon: '🍳' },
        { _id: "6916d655d8ded2e7a06424df", value: 'Iron', label: 'Iron', icon: '♨' },
        { _id: "6916d655d8ded2e7a06424de", value: 'Laptop Friendly Workspace', label: 'Laptop Friendly Workspace', icon: '💻' },
        { _id: "6916d655d8ded2e7a06424f4", value: 'Elevator', label: 'Elevator', icon: '🔺🔻' },
    ];

    const handleNext = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleCityChange = (e) => {
        setFormData({ ...formData, city: e.target.value });
    };

    const handleTypeSelect = (propertyType) => {
        setFormData({ ...formData, propertyType });
    };

    const handlePurposeSelect = (purpose) => {
        setFormData({ ...formData, purpose });
    };

    const handleAmenityToggle = (amenity) => {
        const updatedAmenities = formData.amenities.includes(amenity)
            ? formData.amenities.filter(a => a !== amenity)
            : [...formData.amenities, amenity];
        setFormData({ ...formData, amenities: updatedAmenities });
    };

    const handlePriceChange = (field, value) => {
        setFormData({
            ...formData,
            pricePerNight: { ...formData.pricePerNight, [field]: value }
        });
    };

    const handleSubmit = () => {
        navigate('/recommended-homes', {
            state: {
                filters: {
                    ...formData,
                    pricePerNight: {
                        min: Number(formData.pricePerNight.min) || 0,
                        max: Number(formData.pricePerNight.max) || Infinity
                    }
                }
            }
        });
    };


    const renderProgressBar = () => {
        const steps = ['City', 'Type', 'Purpose', 'Amenities', 'Price'];
        return (
            <div className="mb-12 px-4">
                <div className="flex justify-between items-center relative">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 relative">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base z-10 transition-all duration-300 ${index + 1 === currentStep
                                    ? 'bg-[#FF385C] text-white shadow-[0_0_0_4px_rgba(255,56,92,0.2)] scale-110'
                                    : index + 1 < currentStep
                                        ? 'bg-[#E31C5F] text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {index + 1 < currentStep ? '✓' : index + 1}
                            </div>
                            <span className="mt-3 text-xs font-medium text-gray-600 text-center">
                                {step}
                            </span>
                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5 transition-colors duration-300 ${index + 1 < currentStep ? 'bg-[#E31C5F]' : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="text-center animate-[slideIn_0.4s_ease-out]">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                            {t('aiRecommendation.going')}
                        </h2>
                        <p className="text-base text-gray-600 mb-8">Search for your destination</p>
                        <input
                            type="text"
                            className="w-full max-w-lg mx-auto px-6 py-4 text-base border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-[#FF385C] focus:shadow-[0_0_0_3px_rgba(255,56,92,0.1)] placeholder-gray-500"
                            placeholder="e.g., New York, Paris, Tokyo..."
                            value={formData.city}
                            onChange={handleCityChange}
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="text-center animate-[slideIn_0.4s_ease-out]">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                            {t('aiRecommendation.type')}
                        </h2>
                        <p className="text-base text-gray-600 mb-8">
                            {t('aiRecommendation.choose')}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                            {propertyTypes.map((type) => (
                                <div
                                    key={type.value}
                                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center gap-3 hover:-translate-y-1 hover:shadow-lg ${formData.propertyType === type.value

                                        ? 'border-[#FF385C] bg-[#FF385C]/5 shadow-[0_0_0_1px_#FF385C]'
                                        : 'border-gray-200 bg-white hover:border-[#FF385C]'
                                        }`}
                                    onClick={() => handleTypeSelect(type.value)}
                                >
                                    <span className="text-4xl">{type.icon}</span>
                                    <span className="text-sm font-medium text-gray-900">{type.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="text-center animate-[slideIn_0.4s_ease-out]">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                            {t('aiRecommendation.purpose')}
                        </h2>
                        <p className="text-base text-gray-600 mb-8">
                            {t('aiRecommendation.purposeDesc')}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                            {purposeOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center gap-3 hover:-translate-y-1 hover:shadow-lg ${formData.purpose === option.value
                                        ? 'border-[#FF385C] bg-[#FF385C]/5 shadow-[0_0_0_1px_#FF385C]'
                                        : 'border-gray-200 bg-white hover:border-[#FF385C]'
                                        }`}
                                    onClick={() => handlePurposeSelect(option.value)}
                                >
                                    <span className="text-4xl">{option.icon}</span>
                                    <span className="text-sm font-medium text-gray-900">{option.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="text-center animate-[slideIn_0.4s_ease-out]">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                            {t('aiRecommendation.amenities')}
                        </h2>
                        <p className="text-base text-gray-600 mb-8">
                            {t('aiRecommendation.amenitiesDesc')}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                            {amenitiesList.map((amenity) => (
                                <div
                                    key={amenity._id}
                                    className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center gap-2 relative hover:-translate-y-0.5 hover:shadow-md ${formData.amenities.includes(amenity._id)
                                        ? 'border-[#FF385C] bg-[#FF385C]/5'
                                        : 'border-gray-200 bg-white hover:border-[#FF385C]'
                                        }`}
                                    onClick={() => handleAmenityToggle(amenity._id)}
                                >
                                    <span className="text-3xl">{amenity.icon}</span>
                                    <span className="text-xs font-medium text-gray-900 text-center">
                                        {amenity.label}
                                    </span>
                                    {formData.amenities.includes(amenity._id) && (
                                        <span className="absolute top-2 right-2 w-6 h-6 bg-[#FF385C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            ✓
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="text-center animate-[slideIn_0.4s_ease-out]">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                            {t('aiRecommendation.budget')}
                        </h2>
                        <p className="text-base text-gray-600 mb-8">
                            {t('aiRecommendation.budgetDesc')}
                        </p>
                        <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
                            <div className="flex-1 min-w-[200px] max-w-[250px]">
                                <label className="block text-sm font-medium text-gray-900 mb-2 text-left">
                                    {t('aiRecommendation.budgetMin')}
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-lg font-semibold text-gray-900">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full pl-9 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-[#FF385C] focus:shadow-[0_0_0_3px_rgba(255,56,92,0.1)]"
                                        value={formData.pricePerNight.min}
                                        onChange={(e) => handlePriceChange('min', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="text-2xl text-gray-500 font-light mt-7">—</div>
                            <div className="flex-1 min-w-[200px] max-w-[250px]">
                                <label className="block text-sm font-medium text-gray-900 mb-2 text-left">
                                    {t('aiRecommendation.budgetMax')}
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-lg font-semibold text-gray-900">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        placeholder="1000+"
                                        className="w-full pl-9 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-[#FF385C] focus:shadow-[0_0_0_3px_rgba(255,56,92,0.1)]"
                                        value={formData.pricePerNight.max}
                                        onChange={(e) => handlePriceChange('max', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                            <p className="text-base text-gray-900 font-medium">
                                {t('aiRecommendation.budgetDesc')}
                                ${formData.pricePerNight.min || '0'} - $
                                {formData.pricePerNight.max || '1000+'} per night
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-white py-10 px-5">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 animate-[fadeInUp_0.6s_ease-out]">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-semibold text-gray-900 mb-3">
                        {t('aiRecommendation.findYourPerfectStay')}
                    </h1>
                    <p className="text-base text-gray-600">
                        {t('aiRecommendation.findYourPerfectStayDesc')}
                    </p>
                </div>

                {renderProgressBar()}

                <div key={currentStep} className="min-h-[400px]">{renderStepContent()}</div>

                <div className="flex justify-between gap-4 mt-12">
                    {currentStep > 1 && (
                        <button
                            className="px-8 py-3.5 text-base font-semibold border-2 border-gray-200 rounded-lg cursor-pointer transition-all duration-300 min-w-[140px] text-gray-900 hover:border-gray-900 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                            onClick={handlePrevious}
                        >
                            ←{t('aiRecommendation.previous')}
                        </button>
                    )}
                    {currentStep < 5 ? (
                        <button
                            className="px-8 py-3.5 text-base font-semibold border-none rounded-lg cursor-pointer transition-all duration-300 min-w-[140px] ml-auto bg-linear-to-br from-[#FF385C] to-[#E31C5F] text-white hover:from-[#E31C5F] hover:to-[#FF385C] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                            onClick={handleNext}
                        >
                            {t('aiRecommendation.next')}→
                        </button>
                    ) : (
                        <button
                            className="px-8 py-3.5 text-base font-semibold border-none rounded-lg cursor-pointer transition-all duration-300 min-w-[140px] ml-auto bg-linear-to-br from-[#FF385C] to-[#E31C5F] text-white hover:from-[#E31C5F] hover:to-[#FF385C] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                            onClick={handleSubmit}
                        >
                            {t('aiRecommendation.getRecommendations')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIRecommendation;