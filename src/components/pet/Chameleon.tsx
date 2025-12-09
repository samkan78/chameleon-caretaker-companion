/**
 * Chameleon Component
 * Renders an animated chameleon SVG that grows, reacts, and changes color
 * Features: mood-based expressions, evolution stages, reaction animations
 */

import { useState, useEffect } from 'react';
import { PetMood, ChameleonType, ReactionType, CHAMELEON_TYPES, EVOLUTION_STAGES } from '@/types/pet';
import { cn } from '@/lib/utils';

interface ChameleonProps {
  mood: PetMood;
  color: string;
  name: string;
  type: ChameleonType;
  evolutionStage: 1 | 2 | 3;
  reaction: ReactionType;
  className?: string;
}

export function Chameleon({ 
  mood, 
  color, 
  name, 
  type, 
  evolutionStage, 
  reaction,
  className 
}: ChameleonProps) {
  const [showReaction, setShowReaction] = useState(false);
  const [reactionEmoji, setReactionEmoji] = useState('');

  // Handle reaction animations
  useEffect(() => {
    if (reaction !== 'none') {
      const emojis: Record<ReactionType, string> = {
        love: '❤️',
        eating: '😋',
        playing: '🎉',
        sleeping: '💤',
        healing: '✨',
        sparkle: '⭐',
        none: '',
      };
      setReactionEmoji(emojis[reaction]);
      setShowReaction(true);
      const timer = setTimeout(() => setShowReaction(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [reaction]);

  // Eye expressions based on mood
  const getEyeExpression = () => {
    switch (mood) {
      case 'happy': return { eyeY: 85, pupilSize: 12, lidHeight: 0 };
      case 'sad': return { eyeY: 90, pupilSize: 10, lidHeight: 6 };
      case 'sick': return { eyeY: 88, pupilSize: 8, lidHeight: 8 };
      case 'energetic': return { eyeY: 82, pupilSize: 14, lidHeight: 0 };
      case 'tired': return { eyeY: 92, pupilSize: 6, lidHeight: 10 };
      case 'hungry': return { eyeY: 86, pupilSize: 13, lidHeight: 0 };
      case 'dirty': return { eyeY: 88, pupilSize: 9, lidHeight: 4 };
      default: return { eyeY: 85, pupilSize: 11, lidHeight: 0 };
    }
  };

  const { eyeY, pupilSize, lidHeight } = getEyeExpression();
  const stageInfo = EVOLUTION_STAGES[evolutionStage];
  const typeInfo = CHAMELEON_TYPES[type];

  // Animation class based on mood and reaction
  const getAnimationClass = () => {
    if (reaction === 'playing') return 'animate-wiggle';
    if (reaction === 'eating') return 'animate-bounce-soft';
    if (mood === 'energetic') return 'animate-bounce-soft';
    if (mood === 'tired' || mood === 'sick') return '';
    return 'animate-float';
  };

  // Pattern based on chameleon type
  const renderPattern = () => {
    switch (typeInfo.pattern) {
      case 'spotted':
        return (
          <g className="transition-all duration-700">
            <circle cx="80" cy="100" r="6" fill={`${color}88`} />
            <circle cx="100" cy="115" r="5" fill={`${color}66`} />
            <circle cx="120" cy="100" r="7" fill={`${color}88`} />
            <circle cx="90" cy="120" r="4" fill={`${color}55`} />
          </g>
        );
      case 'gradient':
        return (
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={`${color}88`} />
            </linearGradient>
          </defs>
        );
      default: // striped
        return (
          <g className="transition-all duration-700">
            <ellipse cx="100" cy="110" rx="50" ry="35" fill="none" stroke={`${color}88`} strokeWidth="3" />
            <ellipse cx="100" cy="110" rx="35" ry="25" fill="none" stroke={`${color}66`} strokeWidth="2" />
          </g>
        );
    }
  };

  // Horns for Jackson's chameleon
  const renderHorns = () => {
    if (type !== 'jackson') return null;
    return (
      <g className="transition-all duration-700">
        <path d="M 160 60 L 155 45 L 158 62" fill={color} stroke={color} strokeWidth="2" />
        <path d="M 170 55 L 172 38 L 175 57" fill={color} stroke={color} strokeWidth="2" />
        <path d="M 180 60 L 185 45 L 182 62" fill={color} stroke={color} strokeWidth="2" />
      </g>
    );
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Reaction particles */}
      {showReaction && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="absolute text-2xl animate-float"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0.8,
              }}
            >
              {reactionEmoji}
            </span>
          ))}
        </div>
      )}

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
        {mood === 'hungry' && '🍽️'}
        {mood === 'dirty' && '🫧'}
      </div>

      {/* Evolution stage badge */}
      <div 
        className="absolute -top-2 -left-2 px-2 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30 z-10"
      >
        {stageInfo.name}
      </div>

      <svg
        viewBox="0 0 200 180"
        className={cn(
          "w-full h-full transition-transform duration-500",
          getAnimationClass()
        )}
        style={{ 
          filter: `drop-shadow(0 10px 20px ${color}40)`,
          transform: `scale(${stageInfo.sizeMultiplier})`,
          maxWidth: `${200 + evolutionStage * 40}px`,
        }}
      >
        {renderPattern()}
        
        {/* Tail - curled spiral */}
        <path
          d="M 30 130 Q 10 130 10 115 Q 10 100 25 100 Q 40 100 40 110 Q 40 120 30 120"
          fill="none"
          stroke={typeInfo.pattern === 'gradient' ? 'url(#bodyGradient)' : color}
          strokeWidth={evolutionStage * 3 + 5}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
        
        {/* Back leg */}
        <ellipse
          cx="70"
          cy="140"
          rx={12 + evolutionStage * 2}
          ry={16 + evolutionStage * 2}
          fill={color}
          className="transition-all duration-700"
        />
        
        {/* Front leg */}
        <ellipse
          cx="130"
          cy="140"
          rx={12 + evolutionStage * 2}
          ry={16 + evolutionStage * 2}
          fill={color}
          className="transition-all duration-700"
        />

        {/* Body */}
        <ellipse
          cx="100"
          cy="110"
          rx={55 + evolutionStage * 3}
          ry={40 + evolutionStage * 3}
          fill={typeInfo.pattern === 'gradient' ? 'url(#bodyGradient)' : color}
          className="transition-all duration-700"
        />

        {/* Head */}
        <ellipse
          cx="155"
          cy="85"
          rx={30 + evolutionStage * 3}
          ry={25 + evolutionStage * 3}
          fill={color}
          className="transition-all duration-700"
        />

        {/* Crest/helmet (taller for veiled) */}
        <path
          d={type === 'veiled' 
            ? "M 165 45 Q 185 35 190 55 Q 193 70 180 80"
            : "M 165 55 Q 180 50 185 65 Q 188 75 180 80"
          }
          fill={color}
          className="transition-all duration-700"
        />

        {/* Jackson's horns */}
        {renderHorns()}

        {/* Eye dome */}
        <circle
          cx="165"
          cy="80"
          r={16 + evolutionStage}
          fill="#ffffff"
          stroke={color}
          strokeWidth="3"
          className="transition-all duration-700"
        />

        {/* Eyelid (for tired/sick) */}
        {lidHeight > 0 && (
          <ellipse
            cx="165"
            cy={80 - 10 + lidHeight / 2}
            rx={16 + evolutionStage}
            ry={lidHeight}
            fill={color}
            className="transition-all duration-300"
          />
        )}

        {/* Pupil */}
        <circle
          cx="168"
          cy={eyeY}
          r={pupilSize}
          fill="#1a1a2e"
          className="transition-all duration-500"
        />

        {/* Eye shine */}
        <circle cx="171" cy={eyeY - 3} r="3" fill="#ffffff" />

        {/* Snout */}
        <ellipse
          cx="188"
          cy="95"
          rx={7 + evolutionStage}
          ry={5 + evolutionStage}
          fill={color}
          className="transition-all duration-700"
        />

        {/* Smile/mouth based on mood */}
        {(mood === 'happy' || mood === 'energetic') && (
          <path
            d="M 175 100 Q 182 108 190 100"
            fill="none"
            stroke="#1a1a2e"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        {(mood === 'sad' || mood === 'sick') && (
          <path
            d="M 175 105 Q 182 98 190 105"
            fill="none"
            stroke="#1a1a2e"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        {mood === 'hungry' && (
          <ellipse cx="182" cy="102" rx="4" ry="3" fill="#1a1a2e" />
        )}
        {(mood === 'neutral' || mood === 'tired' || mood === 'dirty') && (
          <line x1="175" y1="102" x2="188" y2="102" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* Feet details */}
        <ellipse cx="60" cy="155" rx="8" ry="5" fill={color} opacity="0.8" />
        <ellipse cx="80" cy="155" rx="8" ry="5" fill={color} opacity="0.8" />
        <ellipse cx="120" cy="155" rx="8" ry="5" fill={color} opacity="0.8" />
        <ellipse cx="140" cy="155" rx="8" ry="5" fill={color} opacity="0.8" />

        {/* Tongue for eating reaction */}
        {reaction === 'eating' && (
          <path
            d="M 188 100 Q 210 95 220 85"
            fill="none"
            stroke="#FF6B6B"
            strokeWidth="3"
            strokeLinecap="round"
            className="animate-wiggle"
          />
        )}
      </svg>

      {/* Pet name with type indicator */}
      <div 
        className="mt-2 px-4 py-1.5 rounded-full font-display text-sm font-semibold flex items-center gap-2"
        style={{ 
          backgroundColor: `${color}20`,
          color: color,
          borderColor: color,
          borderWidth: '2px'
        }}
      >
        <span>{typeInfo.icon}</span>
        <span>{name}</span>
      </div>
    </div>
  );
}
