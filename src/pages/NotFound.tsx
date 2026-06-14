import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Terminal, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [text, setText] = useState("");
  const fullText =
    "System Error: Sector not found. Unauthorized access logged.";

  useEffect(() => {
    // Optionally log to an analytics service here
    console.warn(`404 at ${location.pathname}`);
  }, [location.pathname]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black font-mono text-cyan-400 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 z-0 pointer-events-none"></div>

      <div className="z-10 text-center flex flex-col items-center space-y-6 max-w-md px-6">
        <div className="flex items-center justify-center space-x-3 text-red-500 animate-pulse">
          <AlertTriangle size={48} />
          <h1 className="text-7xl font-extrabold tracking-widest drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
            404
          </h1>
          <AlertTriangle size={48} />
        </div>

        <div className="w-full bg-zinc-900 border border-cyan-500/30 p-4 rounded-md shadow-[0_0_15px_rgba(34,211,238,0.1)] text-left h-24">
          <div className="flex items-center space-x-2 mb-2 border-b border-cyan-500/20 pb-2">
            <Terminal size={16} className="text-cyan-400" />
            <span className="text-xs text-cyan-400/70">root@e-vara:~</span>
          </div>
          <p className="text-sm md:text-base text-cyan-300">
            {text}
            <span className="animate-pulse">_</span>
          </p>
        </div>

        <Link
          to="/"
          className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 overflow-hidden rounded-sm uppercase tracking-widest"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
          <span className="relative">[ RETURN_TO_BASE ]</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
