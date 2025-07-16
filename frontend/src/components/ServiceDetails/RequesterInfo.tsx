import React from 'react';

interface RequesterInfoProps {
  requester: {
    name: string;
    avatar: string;
    createdAt?: string;
  };
}

function formatJoinDate(dateString?: string): string {
  if (!dateString) return 'غير متوفر';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'انضم اليوم';
  if (diffDays < 7) return `انضم منذ ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`;

  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  return `انضم في ${months[date.getMonth()]} ${date.getFullYear()}`;
}

const RequesterInfo: React.FC<RequesterInfoProps> = ({ requester }) => {
  if (!requester) return null;
  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4 flex items-center gap-4 text-right">
      <img
        src={requester.avatar}
        alt={requester.name}
        className="w-16 h-16 rounded-full object-cover border border-gray-200"
      />
      <div>
        <div className="font-bold text-lg">{requester.name}</div>
        <div className="text-sm text-gray-500">{formatJoinDate(requester.createdAt)}</div>
      </div>
    </div>
  );
};

export default RequesterInfo; 