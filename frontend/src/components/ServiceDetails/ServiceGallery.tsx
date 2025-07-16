import React from 'react';

interface ServiceGalleryProps {
  images: string[];
  title: string;
}

const ServiceGallery: React.FC<ServiceGalleryProps> = ({ images, title }) => {
  if (!images || images.length === 0) return null;
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2 text-right">معرض الصور</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg overflow-hidden">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={title}
            className="w-full h-40 object-cover rounded-lg border border-gray-200"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceGallery; 