
import React from 'react';
import { GeneratedPost } from '../types';

interface PostCardProps {
  post: GeneratedPost;
  index: number;
  onContentChange: (content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onContentChange }) => {
  return (
    <textarea
      className="w-full h-[600px] p-6 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all resize-none text-base leading-relaxed text-slate-300 placeholder-slate-600 font-sans custom-scrollbar"
      value={post.content}
      onChange={(e) => onContentChange(e.target.value)}
      spellCheck={true}
    />
  );
};

export default PostCard;
