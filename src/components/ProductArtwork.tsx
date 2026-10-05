import React from 'react';

interface ProductArtworkProps {
  type: string;
  className?: string;
  title?: string;
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  type,
  className = '',
  title = '',
}) => {
  switch (type) {
    case 'thermal-flask-750':
      return (
        <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#E2ECE5] via-[#D5E4DB] to-[#C4D8CB] ${className}`}>
          {/* Subtle architectural background grid & glow */}
          <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          <svg viewBox="0 0 240 240" className="w-4/5 h-4/5 drop-shadow-md z-10" fill="none">
            {/* Ambient drop shadow */}
            <ellipse cx="120" cy="205" rx="36" ry="6" fill="#0B2518" fillOpacity="0.12" />
            
            {/* Flask Body */}
            <rect x="94" y="68" width="52" height="130" rx="10" fill="#0B2518" />
            {/* Metal trim highlight */}
            <rect x="96" y="70" width="8" height="126" rx="4" fill="#FFFFFF" fillOpacity="0.12" />
            <rect x="136" y="70" width="8" height="126" rx="4" fill="#000000" fillOpacity="0.2" />
            
            {/* Flask Neck & Ring */}
            <rect x="103" y="52" width="34" height="18" rx="3" fill="#D1D5DB" />
            <rect x="106" y="50" width="28" height="4" rx="2" fill="#9CA3AF" />
            
            {/* Handle Lid */}
            <path d="M107 50 C107 36 133 36 133 50" stroke="#0B2518" strokeWidth="6" strokeLinecap="round" />
            <circle cx="120" cy="38" r="5" fill="#10B981" />
            
            {/* Subtle ice/temperature badge */}
            <g transform="translate(108, 120)">
              <rect width="24" height="16" rx="4" fill="#10B981" fillOpacity="0.18" />
              <text x="12" y="11" textAnchor="middle" fill="#10B981" fontSize="8" fontWeight="600" fontFamily="sans-serif">24h</text>
            </g>
          </svg>
        </div>
      );

    case 'cordless-brass-lamp':
      return (
        <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#EFEAE2] via-[#E4DDD2] to-[#D5CBBF] ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(#B45309_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          <svg viewBox="0 0 240 240" className="w-4/5 h-4/5 drop-shadow-md z-10" fill="none">
            {/* Lamp base shadow */}
            <ellipse cx="120" cy="205" rx="42" ry="7" fill="#2A1F1B" fillOpacity="0.14" />
            
            {/* Solid Oak Base */}
            <rect x="92" y="194" width="56" height="12" rx="4" fill="#854D0E" />
            <rect x="94" y="196" width="52" height="4" rx="2" fill="#A16207" fillOpacity="0.6" />
            
            {/* Touch dimmer button */}
            <circle cx="120" cy="200" r="2.5" fill="#FEF08A" />

            {/* Brushed Brass Stem */}
            <rect x="117" y="70" width="6" height="126" rx="2" fill="#CA8A04" />
            <rect x="118" y="70" width="2" height="126" rx="1" fill="#FEF08A" fillOpacity="0.5" />
            
            {/* Soft Warm Light Cone */}
            <polygon points="120,68 60,185 180,185" fill="url(#warmLampGlow)" opacity="0.45" />
            <defs>
              <linearGradient id="warmLampGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Architectural Brass Dome Shade */}
            <path d="M86 70 C86 46 154 46 154 70 Z" fill="#B45309" />
            <path d="M90 70 C90 50 150 50 150 70 Z" fill="#CA8A04" />
            <ellipse cx="120" cy="70" rx="32" ry="4" fill="#FEF08A" />
          </svg>
        </div>
      );

    case 'slim-power-bank-10k':
      return (
        <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#E2E8F0] via-[#D8E1EC] to-[#C9D6E4] ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          <svg viewBox="0 0 240 240" className="w-4/5 h-4/5 drop-shadow-md z-10" fill="none">
            {/* Shadow */}
            <ellipse cx="120" cy="200" rx="44" ry="7" fill="#0F172A" fillOpacity="0.12" />
            
            {/* Anodized Aluminum Power Bank Chassis */}
            <rect x="85" y="55" width="70" height="135" rx="14" fill="#1E293B" />
            <rect x="88" y="58" width="64" height="129" rx="11" stroke="#334155" strokeWidth="1.5" />
            
            {/* Magnetic ring indicator */}
            <circle cx="120" cy="118" r="22" stroke="#475569" strokeWidth="2.5" strokeDasharray="6 3" />
            <circle cx="120" cy="118" r="6" fill="#10B981" fillOpacity="0.3" />
            
            {/* Battery LED Pips */}
            <circle cx="106" cy="170" r="2" fill="#10B981" />
            <circle cx="115" cy="170" r="2" fill="#10B981" />
            <circle cx="124" cy="170" r="2" fill="#10B981" />
            <circle cx="133" cy="170" r="2" fill="#10B981" fillOpacity="0.35" />
            
            {/* Braided USB-C Cable Accent */}
            <path d="M120 55 C120 35 155 35 155 58" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 1.5" />
            <rect x="151" y="58" width="8" height="12" rx="2" fill="#0F172A" />
            
            {/* 30W Fast Charge Badge */}
            <text x="120" y="78" textAnchor="middle" fill="#94A3B8" fontSize="8" fontWeight="600" fontFamily="sans-serif">30W PD</text>
          </svg>
        </div>
      );

    case 'borosilicate-pour-over':
      return (
        <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#EAEFE9] via-[#DFE9E0] to-[#CFDED1] ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          <svg viewBox="0 0 240 240" className="w-4/5 h-4/5 drop-shadow-md z-10" fill="none">
            {/* Base shadow */}
            <ellipse cx="120" cy="204" rx="42" ry="7" fill="#0B2518" fillOpacity="0.14" />
            
            {/* Borosilicate Glass Carafe Body */}
            <path d="M102 96 L82 186 C80 196 90 200 120 200 C150 200 160 196 158 186 L138 96 Z" fill="#FFFFFF" fillOpacity="0.65" stroke="#9CA3AF" strokeWidth="2" />
            
            {/* Liquid Amber Coffee level */}
            <path d="M87 165 C95 162 145 162 153 165 L156 186 C154 194 146 196 120 196 C94 196 86 194 84 186 Z" fill="#78350F" fillOpacity="0.85" />
            
            {/* Measurement markings */}
            <line x1="140" y1="140" x2="148" y2="140" stroke="#9CA3AF" strokeWidth="1.5" />
            <line x1="142" y1="155" x2="148" y2="155" stroke="#9CA3AF" strokeWidth="1.5" />
            <line x1="144" y1="170" x2="148" y2="170" stroke="#9CA3AF" strokeWidth="1.5" />
            
            {/* Ceramic Heat Collar */}
            <rect x="99" y="88" width="42" height="14" rx="3" fill="#0B2518" />
            <rect x="100" y="99" width="40" height="2" rx="1" fill="#10B981" />
            
            {/* Stainless Steel Dripper Cone */}
            <polygon points="120,92 84,45 156,45" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1.5" />
            <polygon points="120,86 92,48 148,48" fill="#E5E7EB" />
            
            {/* Coffee drip */}
            <circle cx="120" cy="115" r="2.5" fill="#78350F" />
          </svg>
        </div>
      );

    case 'everyday-desk-bundle':
    case 'hero':
      return (
        <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#E7EFEA] via-[#D8E6DD] to-[#C6DACD] ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(#0B2518_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
          <svg viewBox="0 0 320 220" className="w-full h-full p-4 drop-shadow-md z-10" fill="none">
            {/* Oak organizer tray */}
            <rect x="35" y="145" width="250" height="55" rx="8" fill="#854D0E" fillOpacity="0.3" />
            <rect x="38" y="140" width="244" height="52" rx="6" fill="#D8C1A3" stroke="#A88B67" strokeWidth="1.5" />
            
            {/* Flask on left */}
            <rect x="65" y="65" width="38" height="95" rx="8" fill="#0B2518" />
            <rect x="72" y="52" width="24" height="15" rx="2" fill="#D1D5DB" />
            <path d="M76 52 C76 42 92 42 92 52" stroke="#0B2518" strokeWidth="4" />
            
            {/* Brass lamp in center */}
            <rect x="145" y="60" width="4" height="98" rx="2" fill="#CA8A04" />
            <path d="M125 60 C125 42 169 42 169 60 Z" fill="#B45309" />
            <ellipse cx="147" cy="60" rx="22" ry="3" fill="#FEF08A" />
            <ellipse cx="147" cy="158" rx="24" ry="5" fill="#854D0E" />

            {/* Coffee Carafe on right */}
            <path d="M215 95 L200 155 C198 160 205 162 225 162 C245 162 252 160 250 155 L235 95 Z" fill="#FFFFFF" fillOpacity="0.8" stroke="#9CA3AF" strokeWidth="1.5" />
            <polygon points="225,92 205,62 245,62" fill="#D1D5DB" />
            
            {/* Curated tag */}
            <g transform="translate(195, 30)">
              <rect width="85" height="22" rx="6" fill="#0B2518" />
              <text x="42.5" y="15" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="600" fontFamily="sans-serif">3-PIECE SET</text>
            </g>
          </svg>
        </div>
      );

    case 'travel-power-kit':
    default:
      return (
        <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#E1ECE5] via-[#D2E2D8] to-[#C1D5C8] ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          <svg viewBox="0 0 240 240" className="w-4/5 h-4/5 drop-shadow-md z-10" fill="none">
            {/* Shadow */}
            <ellipse cx="120" cy="205" rx="55" ry="8" fill="#0B2518" fillOpacity="0.12" />
            
            {/* Power bank on left */}
            <rect x="58" y="75" width="50" height="115" rx="10" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            <circle cx="83" cy="120" r="14" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
            
            {/* Flask on right */}
            <rect x="125" y="60" width="46" height="130" rx="8" fill="#0B2518" />
            <rect x="133" y="48" width="30" height="14" rx="2" fill="#D1D5DB" />
            <path d="M136 48 C136 38 160 38 160 48" stroke="#0B2518" strokeWidth="5" />
            
            {/* Connecting power cable */}
            <path d="M83 75 C83 45 130 45 140 100" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 2" />
          </svg>
        </div>
      );
  }
};
