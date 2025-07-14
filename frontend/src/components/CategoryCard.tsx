
import { ServiceCategory } from '../types';
import BaseCard from './ui/BaseCard';

interface CategoryCardProps {
  category: ServiceCategory;
  onClick?: (category: ServiceCategory) => void;
}

const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  const { name, serviceCount, startingPrice, icon: Icon } = category;

  return (
    <BaseCard
      hover
      onClick={() => onClick?.(category)}
      className="bg-light-cream group"
    >
      <div className="flex h-32 items-center justify-center bg-light-cream">
        <Icon className="h-16 w-16 text-deep-teal transition-transform group-hover:scale-110" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-text-primary">{name}</h3>
        <p className="text-sm text-text-secondary">{serviceCount} خدمة</p>
        <p className="text-sm font-semibold text-deep-teal">يبدأ من ${startingPrice}</p>
      </div>
    </BaseCard>
  );
};

export default CategoryCard;