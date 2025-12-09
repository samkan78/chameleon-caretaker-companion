/**
 * Chameleon Component
 * Renders an animated chameleon SVG that changes color based on mood
 * The chameleon's appearance reflects its current emotional state
 */

import { PetMood } from '@/types/pet';
import { cn } from '@/lib/utils';

interface ChameleonProps {
  mood: PetMood;
  color: string;
  name: string;
  className?: string;
}

export function Chameleon({ mood, color, name, className }: ChameleonProps) {
  // Eye expressions based on mood
  const getEyeExpression = () => {
    switch (mood) {
      case 'happy':
        return { eyeY: 85, pupilSize: 12 };
      case 'sad':
        return { eyeY: 90, pupilSize: 10 };
      case 'sick':
        return { eyeY: 88, pupilSize: 8 };
      case 'energetic':
        return { eyeY: 82, pupilSize: 14 };
      case 'tired':
        return { eyeY: 92, pupilSize: 6 };
      default:
        return { eyeY: 85, pupilSize: 11 };
    }
  };

  const { eyeY, pupilSize } = getEyeExpression();

  // Animation class based on mood
  const animationClass = mood === 'energetic' 
    ? 'animate-bounce-soft' 
    : mood === 'tired' 
      ? '' 
      : 'animate-float';

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Mood indicator bubble */}
      <div 
        className="absolute -top-2 -right-2 text-2xl animate-bounce-soft z-10"
        title={`${name} is feeling ${mood}`}
      >
        {mood === 'happy' && '😊'}
        {mood === 'sad' && '😢'}
        {mood === 'sick' && '🤒'}
        {mood === 'energetic' && '⚡'}
        {mood === 'tired' && '😴'}
        {mood === 'neutral' && '😐'}
      </div>

      <svg
        viewBox="0 0 200 180"
        className={cn("w-full h-full max-w-[280px]", animationClass)}
        style={{ filter: `drop-shadow(0 10px 20px ${color}40)` }}
      >
        {/* Tail - curled spiral */}
        <path
          d="M 30 130 Q 10 130 10 115 Q 10 100 25 100 Q 40 100 40 110 Q 40 120 30 120"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          className="transition-all duration-700"
        />
        
        {/* Back leg */}
        <ellipse
          cx="70"
          cy="140"
          rx="15"
          ry="20"
          fill={color}
          className="transition-all duration-700"
        />
        
        {/* Front leg */}
        <ellipse
          cx="130"
          cy="140"
          rx="15"
          ry="20"
          fill={color}
          className="transition-all duration-700"
        />

        {/* Body */}
        <ellipse
          cx="100"
          cy="110"
          rx="60"
          ry="45"
          fill={color}
          className="transition-all duration-700"
        />

        {/* Body pattern/stripes */}
        <ellipse
          cx="100"
          cy="110"
          rx="50"
          ry="35"
          fill="none"
          stroke={`${color}88`}
          strokeWidth="3"
          className="transition-all duration-700"
        />
        <ellipse
          cx="100"
          cy="110"
          rx="35"
          ry="25"
          fill="none"
          stroke={`${color}66`}
          strokeWidth="2"
          className="transition-all duration-700"
        />

        {/* Head */}
        <ellipse
          cx="155"
          cy="85"
          rx="35"
          ry="30"
          fill={color}
          className="transition-all duration-700"
        />

        {/* Crest/helmet */}
        <path
          d="M 165 55 Q 180 50 185 65 Q 188 75 180 80"
          fill={color}
          className="transition-all duration-700"
        />

        {/* Eye dome */}
        <circle
          cx="165"
          cy="80"
          r="18"
          fill="#ffffff"
          stroke={color}
          strokeWidth="3"
          className="transition-all duration-700"
        />

        {/* Pupil */}
        <circle
          cx="168"
          cy={eyeY}
          r={pupilSize}
          fill="#1a1a2e"
          className="transition-all duration-500"
        />

        {/* Eye shine */}
        <circle
          cx="171"
          cy={eyeY - 3}
          r="3"
          fill="#ffffff"
        />

        {/* Snout */}
        <ellipse
          cx="188"
          cy="95"
          rx="8"
          ry="6"
          fill={color}
          className="transition-all duration-700"
        />

        {/* Smile/mouth based on mood */}
        {mood === 'happy' || mood === 'energetic' ? (
          <path
            d="M 175 100 Q 182 108 190 100"
            fill="none"
            stroke="#1a1a2e"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ) : mood === 'sad' || mood === 'sick' ? (
          <path
            d="M 175 105 Q 182 98 190 105"
            fill="none"
            stroke="#1a1a2e"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ) : (
          <line
            x1="175"
            y1="102"
            x2="188"
            y2="102"
            stroke="#1a1a2e"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* Feet details */}
        <ellipse cx="60" cy="155" rx="8" ry="5" fill={color} opacity="0.8" />
        <ellipse cx="80" cy="155" rx="8" ry="5" fill={color} opacity="0.8" />
        <ellipse cx="120" cy="155" rx="8" ry="5" fill={color} opacity="0.8" />
        <ellipse cx="140" cy="155" rx="8" ry="5" fill={color} opacity="0.8" />
      </svg>

      {/* Pet name */}
      <div 
        className="mt-2 px-4 py-1 rounded-full font-display text-lg font-semibold"
        style={{ 
          backgroundColor: `${color}20`,
          color: color,
          borderColor: color,
          borderWidth: '2px'
        }}
      >
        {name}
      </div>
    </div>
  );
}
