import React, { useEffect, useState } from 'react'

export default function GuestCount({ setGuestSummary }) {

    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [pets, setPets] = useState(0);

    useEffect(() => {
        const totalGuests = adults + children;
        let summary = "";

        if (totalGuests > 0) {
            summary += `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`;
        }

        if (infants > 0) {
            summary += `${summary ? ", " : ""}${infants} infant${infants > 1 ? "s" : ""
                }`;
        }

        if (pets > 0) {
            summary += `${summary ? ", " : ""}${pets} pet${pets > 1 ? "s" : ""}`;
        }

        if (!summary) summary = "Add guests";

        setGuestSummary(summary);
    }, [adults, children, infants, pets, setGuestSummary]);

    const increment = (setter, value) => setter(value + 1);
    const decrement = (setter, value) => setter(value > 0 ? value - 1 : 0);

    const Counter = ({ label, desc, value, setValue }) => (
        <div className="flex justify-between items-center mt-4">
            <div>
                <h5 className="capitalize">{label}</h5>
                <p className="text-sm text-(--color-gray)">{desc}</p>
            </div>

            <div className="max-w-xs">
                <div className="relative flex items-center max-w-32">
                    <button
                        type="button"
                        onClick={() => decrement(setValue, value)}
                        disabled={value === 0}
                        className={`${value === 0 ? "opacity-50 cursor-not-allowed" : ""
                            } bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none`}
                    >
                        <svg
                            className="w-3 h-3 text-gray-900"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 2"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h16"
                            />
                        </svg>
                    </button>

                    <input
                        type="text"
                        readOnly
                        value={value}
                        className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm block w-full py-2.5"
                    />

                    <button
                        type="button"
                        onClick={() => increment(setValue, value)}
                        className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                    >
                        <svg
                            className="w-3 h-3 text-gray-900"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 18"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 1v16M1 9h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-90">
            <Counter
                label="adults"
                desc="adults over 15"
                value={adults}
                setValue={setAdults}
            />
            <Counter
                label="children"
                desc="children between 2 and 15"
                value={children}
                setValue={setChildren}
            />
            <Counter
                label="infants"
                desc="infants between 0 and 2"
                value={infants}
                setValue={setInfants}
            />
            <Counter
                label="pets"
                desc="bring your pets"
                value={pets}
                setValue={setPets}
            />
        </div>
    );
}

