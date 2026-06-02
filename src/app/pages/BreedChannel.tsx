import { ChevronLeft, Info, Search, Heart, MessageCircle } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router";
import { breeds, posts, users } from "../data/mockData";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Masonry from "react-responsive-masonry";

export function BreedChannel() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const breed = breeds.find(b => b.id === id);
  const breedPosts = posts.filter(p => p.breedId === id);

  if (!breed) {
    return <div className="p-4 text-center mt-10">Breed not found</div>;
  }

  return (
    <div className="min-h-full bg-[#FAFAFA] pb-20 relative">
      {/* Transparent Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between h-[var(--app-header-height)] px-4 pt-[var(--app-safe-top)] bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-white active:scale-95 bg-black/20 rounded-full backdrop-blur-sm">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-3">
          <button onClick={() => navigate('/search')} className="p-1.5 text-white active:scale-95 bg-black/20 rounded-full backdrop-blur-sm">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Cover */}
      <div className="relative w-full h-64 bg-gray-200">
        <ImageWithFallback src={breed.cover} alt={breed.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-between items-end">
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-1">{breed.name}</h1>
              <p className="text-sm text-white/80 font-medium mb-2">{breed.enName}</p>
              <p className="text-xs text-white/90 line-clamp-2 max-w-[260px] leading-relaxed">
                {breed.description}
              </p>
            </div>
            <button className="flex flex-col items-center justify-center gap-1 shrink-0 active:scale-95">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                <Info className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] text-white font-medium">查看百科</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feed Tabs */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-100 px-4 flex items-center gap-6 pt-2">
        <button className="text-[15px] font-bold text-gray-900 pb-2.5 relative">
          热门内容
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#FF8C42] rounded-full"></span>
        </button>
        <button className="text-[15px] font-medium text-gray-400 pb-2.5">
          最新发布
        </button>
      </div>

      {/* Posts Feed */}
      <div className="p-2">
        {breedPosts.length > 0 ? (
          <Masonry columnsCount={2} gutter="8px">
            {breedPosts.map(post => {
              const user = users[post.userId as keyof typeof users];
              return (
                <Link key={post.id} to={`/post/${post.id}`} className="bg-white rounded-xl shadow-sm border border-gray-50 overflow-hidden mb-2 break-inside-avoid">
                  <ImageWithFallback src={post.images[0]} alt="Post" className="w-full h-auto object-cover bg-gray-100 min-h-[120px]" />
                  <div className="p-2.5">
                    <p className="text-xs text-gray-800 font-medium line-clamp-2 leading-relaxed mb-2">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ImageWithFallback src={user.avatar} alt={user.name} className="w-4 h-4 rounded-full object-cover" />
                        <span className="text-[10px] text-gray-500 truncate max-w-[60px]">{user.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Heart className="w-3 h-3" />
                        <span className="text-[10px]">{post.likes}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </Masonry>
        ) : (
          <div className="py-20 text-center text-gray-400 text-sm">
            暂无内容，快来发布第一条吧~
          </div>
        )}
      </div>

      {/* Floating Add Button for Breed */}
      <button className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#FF8C42] text-white px-6 py-3 rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-2 font-semibold text-sm active:scale-95 z-50">
        <MessageCircle className="w-4 h-4" />
        发布{breed.name}日常
      </button>
    </div>
  );
}
