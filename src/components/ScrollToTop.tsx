import React, { useEffect, useState } from "react";

export default function ScrollToTop(): React.JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Guard clause for SSR frameworks like Next.js where 'window' is not defined on the server
    if (typeof window === "undefined") return;

    const toggleVisibility = (): void => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = (): void => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-24 right-8 z-50 p-3 rounded-full border border-blue-500/30 bg-[#0d0d0d]/80 text-blue-400 backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-blue-500 hover:text-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black ${
        isVisible
          ? "opacity-100 translate-y-0 visible"
          : "opacity-0 translate-y-4 invisible"
      }`}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
