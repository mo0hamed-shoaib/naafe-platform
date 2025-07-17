import React from 'react';
import { User } from 'lucide-react';
import { ServiceComment } from '../types/service';

interface CommentsSectionProps {
  comments: ServiceComment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-deep-teal mb-4">Comments</h2>
      
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="avatar flex-shrink-0">
              <div className="w-10 h-10 rounded-full">
                {comment.avatar ? (
                  <img src={comment.avatar} alt={comment.author} />
                ) : (
                  <div className="bg-gray-200 flex items-center justify-center w-full h-full">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-baseline gap-2 text-sm mb-1">
                <span className="font-semibold text-deep-teal">{comment.author}</span>
                <span className="text-gray-500">{comment.timestamp}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;