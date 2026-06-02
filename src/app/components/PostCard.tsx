import { Heart, MessageCircle, Share2, MapPin } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function PostCard({ post }: { post: any }) {
  // API format: { user: {name, avatar}, content, images, breed, location, like_count, comment_count, created_at }
  const user = post.user || { name: '用户', avatar: '' };
  const timeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return '刚刚';
    if (hours < 24) return hours + '小时前';
    return Math.floor(hours / 24) + '天前';
  };

  return (
    <div className="bg-white rounded-xl mb-4 shadow-sm border border-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <ImageWithFallback 
            src={user.avatar} 
            alt={user.name} 
            className="w-10 h-10 rounded-full object-cover border border-gray-100"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{user.name}</h3>
            <p className="text-xs text-gray-400">{timeAgo(post.created_at)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium px-2 py-1 bg-orange-50 text-[#FF8C42] rounded-md mb-1">
            {post.breed}
          </span>
          {post.location && (
            <div className="flex items-center text-xs text-gray-400">
              <MapPin className="w-3 h-3 mr-0.5" />
              {post.location}
            </div>
          )}
        </div>
      </div>

      {/* Image Carousel (Scroll Snap) */}
      <Link to={`/post/${post.id}`} className="block relative w-full aspect-square bg-gray-50 overflow-hidden">
        <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {post.images.map((img: string, idx: number) => (
            <div key={idx} className="w-full h-full shrink-0 snap-center relative">
              <ImageWithFallback 
                src={img} 
                alt={`Post image ${idx + 1}`} 
                className="w-full h-full object-cover"
              />
              {post.images.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  {idx + 1}/{post.images.length}
                </div>
              )}
            </div>
          ))}
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between p-3 pb-2">
        <div className="flex items-center gap-4 text-gray-600">
          <button className={`flex items-center gap-1.5 ${post.is_liked ? 'text-[#FF8C42]' : ''}`}>
            <Heart className={`w-6 h-6 ${post.is_liked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{post.like_count}</span>
          </button>
          <Link to={`/post/${post.id}`} className="flex items-center gap-1.5">
            <MessageCircle className="w-6 h-6" />
            <span className="text-sm font-medium">{post.comment_count}</span>
          </Link>
          <button className="flex items-center gap-1.5">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="px-3 pb-4">
        <p className="text-sm text-gray-800 leading-relaxed line-clamp-2">
          <span className="font-semibold mr-2">{user.name}</span>
          {post.content}
        </p>
      </div>
    </div>
  );
}
