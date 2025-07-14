import React from 'react';
import { Crown, Check } from 'lucide-react';

interface AvatarCardProps {
  avatar: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isPremium?: boolean;
}

const AvatarCard: React.FC<AvatarCardProps> = ({
  avatar,
  name,
  title,
  location,
  rating,
  reviewCount,
  isVerified,
  isPremium = false,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
      <div className="relative shrink-0">
        <div 
          className="w-32 h-32 rounded-full bg-cover bg-center ring-4 ring-white/50"
          style={{ backgroundImage: `url(${avatar})` }}
        />
        {isVerified && (
          <div className="absolute bottom-1 right-1 bg-success rounded-full p-1.5 border-2 border-white">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col justify-center text-center lg:text-left">
        <div className="flex items-center gap-2 justify-center lg:justify-start">
          <h2 className="text-2xl font-bold text-neutral font-cairo">{name}</h2>
          {isPremium && (
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full ring-2 ring-yellow-300 flex items-center gap-1">
              <Crown className="w-3 h-3" />
              <span className="text-xs font-semibold">Gold</span>
            </div>
          )}
        </div>
        <p className="text-neutral/70 text-base font-medium font-jakarta">{title}</p>
        <p className="text-neutral/70 text-sm font-jakarta">{location}</p>
        
        <div className="flex items-center gap-2 mt-2 justify-center lg:justify-start">
          <div className="flex items-center text-accent">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span className="text-neutral font-bold">{rating}</span>
          <span className="text-neutral/70 text-sm font-jakarta">({reviewCount} reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default AvatarCard;