import React from 'react';
import { User } from 'lucide-react';

interface RequesterInfoProps {
  requester: {
    name: string;
    avatar: string;
    joinDate: string;
  };
}

const RequesterInfo: React.FC<RequesterInfoProps> = ({ requester }) => {
  return (
    <div className="card bg-base-100 shadow-lg rounded-2xl p-6 mb-8">
      <h2 className="text-xl font-bold text-deep-teal mb-4">About the Requester</h2>
      
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-14 h-14 rounded-full">
            {requester.avatar ? (
              <img src={requester.avatar} alt={requester.name} />
            ) : (
              <div className="bg-gray-200 flex items-center justify-center w-full h-full">
                <User className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <p className="font-semibold text-deep-teal">{requester.name}</p>
          <p className="text-sm text-gray-500">Joined {requester.joinDate}</p>
        </div>
      </div>
    </div>
  );
};

export default RequesterInfo;