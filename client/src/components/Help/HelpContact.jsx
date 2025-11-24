import React from "react";
import { useNavigate } from "react-router-dom";

const HelpContact = ()=> {
         const navigate = useNavigate();

    const handelCotact = () => {
        navigate("/register");
    };
    return (
        <>
         <div className="  p-10 mt-16 ">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                Need to get in touch?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                We'll start with some questions and get you to the right place.
                            </p>
                            <button
                                // style={{ backgroundColor: "#FF385C" }}
                                onChange={handelCotact}
                                className="w-full py-3 border border-black rounded-lg text-black font-medium mb-4">
                                Contact us
                            </button>
                            <p className=''> You can also give us <a href="#" className='border border-b-black'> feedback </a> </p>
                        </div>
        </>
    )
}
export default HelpContact;