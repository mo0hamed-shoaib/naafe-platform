import React from 'react';

interface ServiceGalleryProps {
  images: string[];
  title: string;
}

const ServiceGallery: React.FC<ServiceGalleryProps> = ({ images, title }) => {
  const mainImage = images[0];
  const thumbnails = images.slice(1, 4);
  const remainingCount = Math.max(0, images.length - 4);

  return (
    <div className="mb-8">
      <div className="aspect-video mb-4">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {thumbnails.map((image, index) => (
          <div key={index} className="aspect-square">
            <img
              src={image}
              alt={`${title} - Image ${index + 2}`}
              className="w-full h-full object-cover rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            />
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors cursor-pointer">
            <span className="text-sm font-medium">+{remainingCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceGallery;