
import { ServiceCategory } from '../types';
import BaseCard from './ui/BaseCard';

interface CategoryCardProps {
  category: ServiceCategory;
  onClick?: (category: ServiceCategory) => void;
}

const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  const { name, serviceCount, startingPrice, icon, numServices, avgServicePrice, numRequests, avgRequestPrice } = category;

  return (
    <BaseCard
      hover
      onClick={() => onClick?.(category)}
      className="bg-light-cream group"
    >
      <div className="flex h-32 items-center justify-center bg-light-cream">
        {typeof icon === 'string' ? (
          <img
            src={icon}
            alt={name}
            className="h-16 w-16 object-contain"
            style={{ maxWidth: '4rem', maxHeight: '4rem', display: 'block' }}
            onError={e => { (e.target as HTMLImageElement).src = '/default-category.png'; }}
          />
        ) : icon ? (
          <icon className="h-16 w-16 text-deep-teal transition-transform group-hover:scale-110" />
        ) : (
          <span className="h-16 w-16" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-text-primary">{name}</h3>
        {typeof numServices === 'number' && (
          <p className="text-sm text-text-secondary">عدد الخدمات: {numServices}</p>
        )}
        {typeof avgServicePrice === 'number' && (
          <p className="text-sm text-text-secondary">متوسط سعر الخدمة: {avgServicePrice.toFixed(2)} EGP</p>
        )}
        {typeof numRequests === 'number' && (
          <p className="text-sm text-text-secondary">عدد الطلبات: {numRequests}</p>
        )}
        {typeof avgRequestPrice === 'number' && (
          <p className="text-sm text-text-secondary">متوسط سعر الطلب: {avgRequestPrice.toFixed(2)} EGP</p>
        )}
      </div>
    </BaseCard>
  );
};

export default CategoryCard;