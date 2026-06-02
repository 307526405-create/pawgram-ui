import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { PostCard } from "../components/PostCard";
import { useState, useRef } from "react";
import { posts } from "../data/mockData";
function PetCreateForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [breed, setBreed] = useState("");
  const [customBreed, setCustomBreed] = useState("");
  const [birthday, setBirthday] = useState("");
  const [weight, setWeight] = useState("");
  const [bio, setBio] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const breedRef = useRef<HTMLDivElement>(null);

  const dogBreeds = ["金毛","柯基","泰迪","萨摩耶","柴犬","哈士奇","拉布拉多","比熊","法斗","边牧","德牧","雪纳瑞","博美","吉娃娃","约克夏","阿拉斯加","秋田","松狮","巴哥","腊肠","杜宾","罗威纳","大丹","圣伯纳","苏牧","喜乐蒂","蝴蝶犬","马尔济斯","西施","巴吉度","可卡","阿富汗","灵缇","沙皮","纽芬兰","大白熊","伯恩山","银狐","比格","万能梗","牛头梗","西高地","凯恩梗","贝灵顿","藏獒","高加索","中亚","卡斯罗","其他"];
  const catBreeds = ["布偶猫","橘猫","英短","美短","暹罗","波斯","缅因","折耳","无毛","蓝猫","加菲","金吉拉","德文卷","阿比","孟加拉","挪威森林","西伯利亚","土耳其梵","埃及猫","柯尼斯卷","东方短毛","新加坡猫","白猫","黑猫","三花","虎斑","奶牛猫","其他"];
  const breeds = category === '犬' ? dogBreeds : catBreeds;
  const isDone = name.trim() && category && (breed && breed !== '其他' ? true : customBreed.trim());

  const handleCatScroll = () => {
    const el = catRef.current; if (!el) return;
    const idx = Math.round((el.scrollTop - 110) / 40);
    const cats = ['犬','猫'];
    if (idx >= 0 && idx < cats.length) setCategory(cats[idx]);
  };
  const handleBreedScroll = () => {
    const el = breedRef.current; if (!el) return;
    const idx = Math.round((el.scrollTop - 110) / 40);
    if (idx >= 0 && idx < breeds.length) setBreed(breeds[idx]);
  };

  return (
    <div className="px-4">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3 border-2 border-dashed border-[#DDD]">
          <span className="text-3xl text-[#CCC]">+</span>
        </div>
        <p className="text-[12px] text-[#999]">添加头像</p>
      </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F0F0F0] space-y-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="宠物名字" className="w-full h-10 bg-[#F5F5F5] rounded-lg px-3 text-[14px] outline-none"/>
        <div onClick={() => setShowPicker(true)} className="flex items-center justify-between h-10 bg-[#F5F5F5] rounded-lg px-3 cursor-pointer">
          <span className={category && breed ? 'text-[14px] text-[#333]' : 'text-[14px] text-[#999]'}>{category && breed ? `${category}·${breed === '其他' ? customBreed || '其他' : breed}` : '选择品种'}</span>
          <span className="text-[#CCC] text-sm">›</span>
        </div>
        <input value={birthday}onChange={e => setBirthday(e.target.value)} placeholder="生日（如2024-03-15）" className="w-full h-10 bg-[#F5F5F5] rounded-lg px-3 text-[14px] outline-none"/>
        <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="体重（如28kg）" className="w-full h-10 bg-[#F5F5F5] rounded-lg px-3 text-[14px] outline-none"/>
        <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="简介..." rows={2} className="w-full bg-[#F5F5F5] rounded-lg px-3 py-2 text-[14px] outline-none resize-none"/>
      </div>

      <button onClick={onDone} disabled={!isDone}
        className={`w-full mt-6 h-12 rounded-xl text-[15px] font-bold ${isDone ? 'bg-[#FF8C42] text-white' : 'bg-[#E5E5E5] text-[#BBB]'}`}>
        创建宠物档案
      </button>

      {/* Breed Picker Sheet */}
      {showPicker && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/40" onClick={() => setShowPicker(false)}>
          <div className="bg-white rounded-t-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0F0]">
              <button onClick={() => setShowPicker(false)} className="text-[15px] text-[#999]">取消</button>
              <h2 className="text-[16px] font-bold text-[#333]">选择品种</h2>
              <button onClick={() => setShowPicker(false)} className="text-[15px] text-[#FF8C42] font-bold">完成</button>
            </div>
            
            <div className="relative h-[260px] flex bg-[#F5F5F5]">
              <div className="absolute inset-0 pointer-events-none z-10" style={{background:'linear-gradient(to bottom, rgba(245,245,245,1) 0%, rgba(245,245,245,0) 30%, rgba(245,245,245,0) 70%, rgba(245,245,245,1) 100%)'}}/>
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-10 border-t border-b border-[#DDD] pointer-events-none z-10 mx-4"/>
              
              <div ref={catRef} onScroll={handleCatScroll} className="w-[100px] border-r border-[#E5E5E5] overflow-y-auto snap-y snap-mandatory [&::-webkit-scrollbar]:hidden" style={{WebkitOverflowScrolling:'touch'}}>
                <div className="py-[110px]"/>
                {['犬','猫'].map(c => (
                  <div key={c}
                    className={`h-10 flex items-center justify-center text-[17px] snap-center ${c === category ? 'text-[#333] font-semibold' : 'text-[#BBB]'}`}>{c}</div>
                ))}
                <div className="py-[110px]"/>
              </div>
              
              <div ref={breedRef} onScroll={handleBreedScroll} className="flex-1 overflow-y-auto snap-y snap-mandatory [&::-webkit-scrollbar]:hidden" style={{WebkitOverflowScrolling:'touch'}}>
                <div className="py-[110px]"/>
                {category ? (category === '犬' ? dogBreeds : catBreeds).map(b => (
                  <div key={b} onClick={() => { setBreed(b === breed ? '' : b); setCustomBreed(''); }}
                    className={`h-10 flex items-center px-4 text-[17px] snap-center ${b === breed ? 'text-[#333] font-semibold' : 'text-[#BBB]'}`}>{b}</div>
                )) : (
                  <div className="h-10 flex items-center px-4 text-[#BBB] text-[15px]">请先选择品类</div>
                )}
                <div className="py-[110px]"/>
              </div>
            </div>

            {breed === '其他' && (
              <div className="px-4 py-3 border-t border-[#F0F0F0]">
                <input autoFocus value={customBreed} onChange={e => setCustomBreed(e.target.value)}
                  placeholder="请输入品种名称" className="w-full h-10 bg-[#F5F5F5] rounded-lg px-3 text-[15px] outline-none"/>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function PetProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = (location.state as any)?.new;
  const petData = (location.state as any)?.pet;
  
  const pet = petData || { name:"豆豆", type:"金毛", avatar:"https://images.unsplash.com/photo-1581285217236-a2355291f9c9?w=1080" };
  const petPosts = posts.filter(p => p.breedId === 'golden-retriever');
  const checkIns = Array.from({ length: 30 }).map((_, i) => ![5, 12, 14, 25, 28].includes(i));
  const albumImages = [
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=1080",
    "https://images.unsplash.com/photo-1539692177343-b2b990faef15?w=1080",
    "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=1080"
  ];

  return (
    <div className="h-full bg-[#FAFAFA] relative flex flex-col">
      <div className="bg-[#FAFAFA]/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#333] p-1 -ml-1"><ChevronLeft className="w-6 h-6" /></button>
        <h1 className="text-[17px] font-bold text-[#333]">{isNew ? '添加宠物' : '宠物档案'}</h1>
        <div className="w-8"/>
      </div>

      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden">
        {isNew ? (
          <PetCreateForm onDone={() => navigate(-1)} />
        ) : (
          <>
            <div className="flex flex-col items-center mt-2 mb-6">
              <ImageWithFallback src={pet.avatar} className="w-20 h-20 rounded-full object-cover border-[3px] border-white shadow-sm"/>
              <h2 className="text-[18px] font-bold text-[#333] mt-3">{pet.name}</h2>
              <p className="text-[14px] text-[#999] mt-0.5">犬·{pet.type}·2岁</p>
            </div>
            <div className="px-4 mb-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F0F0F0] space-y-4">
                <div className="flex items-center"><span className="text-[16px] mr-2">🎂</span><span className="text-[14px] text-[#999] w-10">生日</span><span className="text-[14px] font-medium text-[#333] ml-auto">2024年3月15日</span></div>
                <div className="flex items-center"><span className="text-[16px] mr-2">⚖️</span><span className="text-[14px] text-[#999] w-10">体重</span><span className="text-[14px] font-medium text-[#333] ml-auto">28kg</span></div>
                <div className="flex items-center"><span className="text-[16px] mr-2">🏷️</span><span className="text-[14px] text-[#999] w-10">品种</span><span className="text-[14px] font-medium text-[#333] ml-auto">犬·{pet.type}</span></div>
                <div className="flex items-start"><span className="text-[16px] mr-2 mt-0.5">📝</span><span className="text-[14px] text-[#999] w-10">简介</span><span className="text-[14px] font-medium text-[#333] ml-auto text-right flex-1">爱笑的金毛大暖男</span></div>
              </div>
            </div>
            <div className="px-4 mb-8">
              <h3 className="text-[14px] font-bold text-[#333] mb-3">成长相册</h3>
              <div className="grid grid-cols-3 gap-3">{albumImages.map((img, idx) => <div key={idx}><ImageWithFallback src={img} className="w-full aspect-square rounded-lg object-cover"/></div>)}</div>
            </div>
            <div className="px-4 mb-8">
              <h3 className="text-[14px] font-bold text-[#333] mb-3">打卡记录 <span className="text-[12px] text-[#999] font-normal ml-1">最近30天</span></h3>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#F0F0F0]">
                <div className="flex flex-wrap gap-[6px]">{checkIns.map((isDone, idx) => <div key={idx} className={`w-4 h-4 rounded ${isDone ? 'bg-[#FF8C42]' : 'bg-[#E5E5E5]'}`}/>)}</div>
              </div>
            </div>
            <div className="px-4 mb-4">
              <h3 className="text-[14px] font-bold text-[#333] mb-4">相关动态</h3>
              <div className="space-y-4">{petPosts.map(post => <PostCard key={post.id} post={post} />)}</div>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
