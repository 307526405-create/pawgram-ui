import { useParams, useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { posts } from "../data/mockData";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const getMediaUrl = (item: any) => typeof item === 'string' ? item : item?.poster || item?.url || '';

export function BreedPage() {
  const { breed } = useParams();
  const navigate = useNavigate();
  const breedPosts = posts.filter(p => p.breed === decodeURIComponent(breed || ''));

  return (
    <div className="h-full bg-[#FAFAFA] dark:bg-gray-950 flex flex-col">
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1"><ChevronLeft className="w-6 h-6 text-[#333] dark:text-gray-100" /></button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[#333] dark:text-gray-100 mr-8">{decodeURIComponent(breed || '')}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {breedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#999]">暂无{decodeURIComponent(breed)}的帖子</div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {breedPosts.map(p => (
              <div key={p.id} onClick={() => navigate(`/post/${p.id}`)} className="aspect-square bg-[#F0F0F0] dark:bg-gray-800 cursor-pointer relative overflow-hidden">
                <ImageWithFallback src={getMediaUrl(p.images?.[0])} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
