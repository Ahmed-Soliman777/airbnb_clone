import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { englishLanguage, arabicLanguage } from "@/store/Slices/languageSlice";

export default function GlobalModal({ isOpen, closeModal }) {
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const { direction } = useSelector((state) => state.lang);

  const [visible, setVisible] = useState(false); // for fade in/out
  const [render, setRender] = useState(isOpen);  // controls mounting
  const [currentLang, setCurrentLang] = useState('en');

  // Handle mounting/unmounting with smooth transition
  useEffect(() => {
    if (isOpen) {
      setRender(true); // mount first
      setTimeout(() => setVisible(true), 10); // trigger transition next tick
    } else {
      setVisible(false); // start fade out
      setTimeout(() => setRender(false), 350); // unmount after animation
    }
  }, [isOpen]);

  // Close modal on click outside
  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handler);
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.removeEventListener("mousedown", handler);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, closeModal]);

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
    }
  };

  if (!render) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        transition-opacity duration-350
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <div
        ref={modalRef}
        dir={direction}
        className={`
          bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm
          transform transition-transform duration-350
          ${visible ? "scale-100" : "scale-95"}
        `}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-neutral-400 hover:text-black text-lg"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-6">Choose a language and region</h3>

        <div className="grid grid-cols-2 gap-3">
          {/* English */}
          <div
            onClick={() => { closeModal(); changeLanguage('en') }}
            className="border rounded-lg p-3 cursor-pointer flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 transition"
          >
            <div className="leading-tight">
              <span className="font-medium">English</span>
              <div className="text-sm opacity-70">United States</div>
            </div>
          </div>

          {/* Arabic */}
          <div
            onClick={() => { closeModal(); changeLanguage('ar') }}
            className="border rounded-lg p-3 cursor-pointer flex items-center gap-2 justify-end bg-neutral-100 hover:bg-neutral-200 transition text-end"
          >
            <div className="leading-tight">
              <span className="font-medium">العربية</span>
              <div className="text-sm opacity-70">العالم</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}