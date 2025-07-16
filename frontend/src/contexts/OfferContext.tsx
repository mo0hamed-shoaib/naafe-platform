import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface Offer {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  price: number;
  specialties: string[];
  verified?: boolean;
  message?: string;
  estimatedTimeDays?: number;
  availableDates?: string[];
  timePreferences?: string[];
  createdAt?: string;
}

interface OfferContextType {
  offers: Offer[];
  addNewOffer: (offer: Offer) => void;
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
}

const OfferContext = createContext<OfferContextType | undefined>(undefined);

export const useOfferContext = () => {
  const context = useContext(OfferContext);
  if (context === undefined) {
    throw new Error('useOfferContext must be used within an OfferProvider');
  }
  return context;
};

interface OfferProviderProps {
  children: ReactNode;
}

export const OfferProvider: React.FC<OfferProviderProps> = ({ children }) => {
  const [offers, setOffers] = useState<Offer[]>([]);

  const addNewOffer = useCallback((offer: Offer) => {
    setOffers(prev => [offer, ...prev]);
  }, []);

  return (
    <OfferContext.Provider value={{
      offers,
      addNewOffer,
      setOffers
    }}>
      {children}
    </OfferContext.Provider>
  );
}; 