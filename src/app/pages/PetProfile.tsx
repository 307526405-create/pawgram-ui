import { ChevronLeft, PenSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { PostCard } from "../components/PostCard";
import { useState, useRef } from "react";
import { posts } from "../data/mockData";
import { usePageTransition } from "../hooks/usePageTransition";

function PetCreateForm({ onDone, initialData }: { onDone: () => void; initialData?: any }) {
  const { t } = useTranslation();
  const init = initialData || {};
  const dogBreeds = ["金毛","柯基","泰迪","萨摩耶","柴犬","哈士奇","拉布拉多","比熊","法斗","边牧","德牧","雪纳瑞","博美","吉娃娃","约克夏","阿拉斯加","秋田","松狮","巴哥","腊肠","杜宾","罗威纳","大丹","圣伯纳","苏牧","喜乐蒂","蝴蝶犬","马尔济斯","西施","巴吉度","可卡","阿富汗","灵缇","沙皮","纽芬兰","大白熊","伯恩山","银狐","比格","万能梗","牛头梗","西高地","凯恩梗","贝灵顿","藏獒","高加索","中亚","卡斯罗","其他"];
  const catBreeds = ["布偶猫","橘猫","英短","美短","暹罗","波斯","缅因","折耳","无毛","蓝猫","加菲","金吉拉","德文卷","阿比","孟加拉","挪威森林","西伯利亚","土耳其梵","埃及猫","柯尼斯卷","东方短毛","新加坡猫","白猫","黑猫","三花","虎斑","奶牛猫","其他"];
  const [name, setName] = useState(init.name || "");
  const [category, setCategory] = useState(init.type ? (catBreeds.includes(init.type) ? 'cat' : 'dog') : '');
  const [breed, setBreed] = useState(init.type || "");
  const [customBreed, setCustomBreed] = useState("");
  const [birthday, setBirthday] = useState(init.birthday || "");
  const [weight, setWeight] = useState(init.weight || "");
  const [bio, setBio] = useState(init.bio || "");
  const [showPicker, setShowPicker] = useState(false);
  const [avatar, setAvatar] = useState(init.avatar || "");
  const hasAvatar = !!avatar;
  const catRef = useRef<HTMLDivElement>(null);
  const breedRef = useRef<HTMLDivElement>(null);
  const breeds = category === 'dog' ? dogBreeds : catBreeds;
  const isDone = name.trim() && category && (breed && breed !== '其他' ? true : customBreed.trim());
  const getBreedDisplay = (b: string) => b === '其他' ? t('common.other') : t(`pet.breeds.${b}`, b);
  const getCategoryDisplay = (c: string) => c === 'dog' ? t('pet.dog') : t('pet.cat');

  const handleCatScroll = () => {
    const el = catRef.current; if (!el) return;
    const idx = Math.round((el.scrollTop - 110) / 40);
    const cats = ['dog','cat'];
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
        {hasAvatar ? (
          <ImageWithFallback src={avatar} className="w-20 h-20 rounded-full object-cover border-[3px] border-white dark:border-gray-900 shadow-sm mb-3" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#F5F5F5] dark:bg-gray-800 flex items-center justify-center mb-3 border-2 border-dashed border-[#DDD] dark:border-gray-600">
            <span className="text-3xl text-[#CCC] dark:text-gray-600">+</span>
          </div>
        )}
<p className="text-[12px] text-[#999] dark:text-gray-400">{hasAvatar ? name || t("pet.petName") : t("pet.addAvatar")}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-[#F0F0F0] dark:border-gray-700 space-y-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder={t('pet.petName')} className="w-full h-10 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 text-[14px] outline-none"/>
        <div onClick={() => setShowPicker(true)} className="flex items-center justify-between h-10 bg-[#F5F5F5] dark:bg-gray-800 rounded-lg px-3 cursor-pointer">
          <span className={category && breed ? 'text-[14px] text-[#333] dark:text-gray-100' : 'text-[14px] text-[#999] dark:text-gray-400'}>{category && breed ? `${getCategoryDisplay(category)}·${breed === '其他' ? customBreed || t('common.other') : getBreedDisplay(breed)}` : t('pet.selectBreed')}</span>
          <span className="text-[#CCC] dark:text-gray-600 text-sm">›</span>
        </div>
        <input value={birthday}onChange={e => setBirthday(e.target.value)} placeholder={t('pet.birthdayPlaceholder')} className="w-full h-10 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 text-[14px] outline-none"/>
        <input value={weight} onChange={e => setWeight(e.target.value)} placeholder={t('pet.weightPlaceholder')} className="w-full h-10 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 text-[14px] outline-none"/>
        <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder={t('pet.bio')} rows={2} className="w-full bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-[14px] outline-none resize-none"/>
      </div>

      <button onClick={onDone} disabled={!isDone}
        className={`w-full mt-6 h-12 rounded-xl text-[15px] font-bold ${isDone ? 'bg-[#FF8C42] text-white' : 'bg-[#E5E5E5] dark:bg-gray-700 text-[#BBB] dark:text-gray-500'}`}>
        {t('pet.createProfile')}
      </button>

      {showPicker && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/40" onClick={() => setShowPicker(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0F0] dark:border-gray-700">
              <button onClick={() => setShowPicker(false)} className="text-[15px] text-[#999] dark:text-gray-400">{t('common.cancel')}</button>
              <h2 className="text-[16px] font-bold text-[#333] dark:text-gray-100">{t('pet.selectBreed')}</h2>
              <button onClick={() => setShowPicker(false)} className="text-[15px] text-[#FF8C42] font-bold">{t('common.done')}</button>
            </div>

            <div className="relative h-[260px] flex bg-[#F5F5F5] dark:bg-gray-800">
              <div className="absolute inset-0 pointer-events-none z-10" style={{background:'linear-gradient(to bottom, rgba(245,245,245,1) 0%, rgba(245,245,245,0) 30%, rgba(245,245,245,0) 70%, rgba(245,245,245,1) 100%)'}}/>
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-10 border-t border-b border-[#DDD] dark:border-gray-600 pointer-events-none z-10 mx-4"/>

              <div ref={catRef} onScroll={handleCatScroll} className="w-[100px] border-r border-[#E5E5E5] dark:border-gray-600 overflow-y-auto snap-y snap-mandatory [&::-webkit-scrollbar]:hidden" style={{WebkitOverflowScrolling:'touch'}}>
                <div className="py-[110px]"/>
                {[t('pet.dog'),t('pet.cat')].map((c, idx) => (
                  <div key={c}
                    className={`h-10 flex items-center justify-center text-[17px] snap-center ${(idx === 0 ? 'dog' : 'cat') === category ? 'text-[#333] dark:text-gray-100 font-semibold' : 'text-[#BBB] dark:text-gray-500'}`}>{c}</div>
                ))}
                <div className="py-[110px]"/>
              </div>

              <div ref={breedRef} onScroll={handleBreedScroll} className="flex-1 overflow-y-auto snap-y snap-mandatory [&::-webkit-scrollbar]:hidden" style={{WebkitOverflowScrolling:'touch'}}>
                <div className="py-[110px]"/>
                {category ? (category === 'dog' ? dogBreeds : catBreeds).map(b => (
                  <div key={b} onClick={() => { setBreed(b === breed ? '' : b); setCustomBreed(''); }}
                    className={`h-10 flex items-center px-4 text-[17px] snap-center ${b === breed ? 'text-[#333] dark:text-gray-100 font-semibold' : 'text-[#BBB] dark:text-gray-500'}`}>{getBreedDisplay(b)}</div>
                )) : (
                  <div className="h-10 flex items-center px-4 text-[#BBB] dark:text-gray-500 text-[15px]">{t('pet.selectCategoryFirst')}</div>
                )}
                <div className="py-[110px]"/>
              </div>
            </div>

            {breed === '其他' && (
              <div className="px-4 py-3 border-t border-[#F0F0F0] dark:border-gray-700">
                <input autoFocus value={customBreed} onChange={e => setCustomBreed(e.target.value)}
                  placeholder={t('pet.enterBreedName')} className="w-full h-10 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 text-[15px] outline-none"/>
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
  const { className, handleBack } = usePageTransition();
  const location = useLocation();
  const { t } = useTranslation();
  const getBreedDisplay = (b: string) => b === '其他' ? t('common.other') : t(`pet.breeds.${b}`, b);
  const isNew = (location.state as any)?.new;
  const petData = (location.state as any)?.pet;
  const [isEditing, setIsEditing] = useState(false);

  const pet = petData || { name:"豆豆", type:"金毛", avatar:"https://images.unsplash.com/photo-1581285217236-a2355291f9c9?w=1080" };
  const petPosts = posts.filter(p => p.breedId === 'golden-retriever');
  const checkIns = Array.from({ length: 30 }).map((_, i) => ![5, 12, 14, 25, 28].includes(i));
  const albumImages = [
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=1080",
    "https://images.unsplash.com/photo-1539692177343-b2b990faef15?w=1080",
    "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=1080"
  ];

  const [vaccines, setVaccines] = useState<{id: number, name: string, date: string}[]>([
    { id: 1, name: t('pet.rabiesVaccine'), date: '2025-03-15' },
    { id: 2, name: t('pet.distemperVaccine'), date: '2025-01-20' },
  ]);
  const [showVaccineForm, setShowVaccineForm] = useState(false);
  const [newVaccineName, setNewVaccineName] = useState('');
  const [newVaccineDate, setNewVaccineDate] = useState('');
  const vaccineIdRef = useRef(3);

  const [dailyNotes, setDailyNotes] = useState<{id: number, note: string, date: string}[]>([
    { id: 1, note: t('pet.exampleNote'), date: '2025-05-20' },
  ]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteDate, setNewNoteDate] = useState('');
  const noteIdRef = useRef(2);

  return (
    <div className={`h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col ${className}`}>
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 z-10">
        <button onClick={() => { if (isEditing) setIsEditing(false); else handleBack(() => navigate(-1)); }} className="text-[#333] dark:text-gray-100 p-1 -ml-1"><ChevronLeft className="w-6 h-6" /></button>
<h1 className="text-[17px] font-bold text-[#333] dark:text-gray-100">{isNew || isEditing ? t("pet.addPet") : t("pet.title")}</h1>
        {isNew ? <div className="w-8"/> : <button onClick={() => setIsEditing(true)} className="p-1"><PenSquare className="w-5 h-5 text-[#666] dark:text-gray-400"/></button>}
      </div>

      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden">
        {isNew || isEditing ? (
          <PetCreateForm onDone={() => setIsEditing(false)} initialData={isEditing ? pet : undefined} />
        ) : (
          <>
            <div className="flex flex-col items-center mt-2 mb-6">
              <ImageWithFallback src={pet.avatar} className="w-20 h-20 rounded-full object-cover border-[3px] border-white dark:border-gray-900 shadow-sm"/>
              <h2 className="text-[18px] font-bold text-[#333] dark:text-gray-100 mt-3">{pet.name}</h2>
              <p className="text-[14px] text-[#999] dark:text-gray-400 mt-0.5">{t('pet.dog')}·{getBreedDisplay(pet.type)}·{t('pet.exampleAge')}</p>
            </div>
            <div className="px-4 mb-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-[#F0F0F0] dark:border-gray-700 space-y-4">
                <div className="flex items-center"><span className="text-[16px] mr-2">🎂</span><span className="text-[14px] text-[#999] dark:text-gray-400 w-10">{t('pet.birthday')}</span><span className="text-[14px] font-medium text-[#333] dark:text-gray-100 ml-auto">{t('pet.exampleBirthday')}</span></div>
                <div className="flex items-center"><span className="text-[16px] mr-2">⚖️</span><span className="text-[14px] text-[#999] dark:text-gray-400 w-10">{t('pet.weight')}</span><span className="text-[14px] font-medium text-[#333] dark:text-gray-100 ml-auto">28kg</span></div>
                <div className="flex items-center"><span className="text-[16px] mr-2">🏷️</span><span className="text-[14px] text-[#999] dark:text-gray-400 w-10">{t('pet.breed')}</span><span className="text-[14px] font-medium text-[#333] dark:text-gray-100 ml-auto">{t('pet.dog')}·{getBreedDisplay(pet.type)}</span></div>
                <div className="flex items-start"><span className="text-[16px] mr-2 mt-0.5">📝</span><span className="text-[14px] text-[#999] dark:text-gray-400 w-10">{t('pet.bio').replace('...','')}</span><span className="text-[14px] font-medium text-[#333] dark:text-gray-100 ml-auto text-right flex-1">{t('pet.exampleBio')}</span></div>
              </div>
            </div>

            {/* 疫苗记录 */}
            <div className="px-4 mb-6">
              <h3 className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">💉 {t('pet.vaccineRecords')}</h3>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-[#F0F0F0] dark:border-gray-700 space-y-3">
                {vaccines.map(v => (
                  <div key={v.id} className="flex items-center gap-3">
                    <span className="text-[14px] font-medium text-[#333] dark:text-gray-100 flex-1">{v.name}</span>
                    <span className="text-[12px] text-[#999] dark:text-gray-400">{v.date}</span>
                    <button onClick={() => setVaccines(vaccines.filter(x => x.id !== v.id))} className="text-[#CCC] dark:text-gray-600 hover:text-red-400 p-0.5">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>
                ))}
                {vaccines.length === 0 && !showVaccineForm && (
                  <p className="text-[13px] text-[#BBB] dark:text-gray-500 text-center py-2">{t('common.noData')}</p>
                )}
                {showVaccineForm ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input value={newVaccineName} onChange={e => setNewVaccineName(e.target.value)} placeholder={t('pet.vaccineName')} className="flex-1 h-9 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 text-[13px] outline-none" />
                    <input type="date" value={newVaccineDate} onChange={e => setNewVaccineDate(e.target.value)} className="w-[128px] h-9 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 text-[13px] outline-none" />
                    <button onClick={() => { setShowVaccineForm(false); setNewVaccineName(''); setNewVaccineDate(''); }} className="text-[13px] text-[#999] dark:text-gray-400 shrink-0">{t('common.cancel')}</button>
                    <button onClick={() => { if (newVaccineName.trim()) { setVaccines([...vaccines, { id: vaccineIdRef.current++, name: newVaccineName.trim(), date: newVaccineDate || new Date().toISOString().slice(0, 10) }]); setNewVaccineName(''); setNewVaccineDate(''); setShowVaccineForm(false); } }} className="text-[13px] text-[#FF8C42] font-bold shrink-0">{t('common.save')}</button>
                  </div>
                ) : (
                  <button onClick={() => setShowVaccineForm(true)} className="flex items-center justify-center w-full h-9 border border-dashed border-[#DDD] dark:border-gray-600 rounded-lg text-[#999] dark:text-gray-400 text-[13px] hover:border-[#FF8C42] hover:text-[#FF8C42] transition-colors">
                    + {t('pet.vaccineRecords')}
                  </button>
                )}
              </div>
            </div>

            {/* 日常笔记 */}
            <div className="px-4 mb-6">
              <h3 className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">📒 {t('pet.dailyNotes')}</h3>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-[#F0F0F0] dark:border-gray-700 space-y-3">
                {dailyNotes.map(n => (
                  <div key={n.id} className="flex items-start gap-3">
                    <span className="text-[14px] text-[#333] dark:text-gray-100 flex-1 leading-relaxed">{n.note}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[12px] text-[#999] dark:text-gray-400">{n.date}</span>
                      <button onClick={() => setDailyNotes(dailyNotes.filter(x => x.id !== n.id))} className="text-[#CCC] dark:text-gray-600 hover:text-red-400 p-0.5">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
                {dailyNotes.length === 0 && !showNoteForm && (
                  <p className="text-[13px] text-[#BBB] dark:text-gray-500 text-center py-2">{t('common.noData')}</p>
                )}
                {showNoteForm ? (
                  <div className="space-y-2 pt-1">
                    <textarea value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} placeholder={t('pet.noteContent')} rows={2} className="w-full bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-[13px] outline-none resize-none" />
                    <div className="flex items-center gap-2">
                      <input type="date" value={newNoteDate} onChange={e => setNewNoteDate(e.target.value)} className="flex-1 h-9 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 text-[13px] outline-none" />
                      <button onClick={() => { setShowNoteForm(false); setNewNoteContent(''); setNewNoteDate(''); }} className="text-[13px] text-[#999] dark:text-gray-400 shrink-0">{t('common.cancel')}</button>
                      <button onClick={() => { if (newNoteContent.trim()) { setDailyNotes([...dailyNotes, { id: noteIdRef.current++, note: newNoteContent.trim(), date: newNoteDate || new Date().toISOString().slice(0, 10) }]); setNewNoteContent(''); setNewNoteDate(''); setShowNoteForm(false); } }} className="text-[13px] text-[#FF8C42] font-bold shrink-0">{t('common.save')}</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowNoteForm(true)} className="flex items-center justify-center w-full h-9 border border-dashed border-[#DDD] dark:border-gray-600 rounded-lg text-[#999] dark:text-gray-400 text-[13px] hover:border-[#FF8C42] hover:text-[#FF8C42] transition-colors">
                    + {t('pet.dailyNotes')}
                  </button>
                )}
              </div>
            </div>

            <div className="px-4 mb-8">
              <h3 className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">{t('pet.gallery')}</h3>
              <div className="grid grid-cols-3 gap-3">{albumImages.map((img, idx) => <div key={idx}><ImageWithFallback src={img} className="w-full aspect-square rounded-lg object-cover"/></div>)}</div>
            </div>
            <div className="px-4 mb-8">
              <h3 className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">{t('pet.checkIn')} <span className="text-[12px] text-[#999] dark:text-gray-400 font-normal ml-1">{t('pet.recentDays')}</span></h3>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-[#F0F0F0] dark:border-gray-700">
                <div className="flex flex-wrap gap-[6px]">{checkIns.map((isDone, idx) => <div key={idx} className={`w-4 h-4 rounded ${isDone ? 'bg-[#FF8C42]' : 'bg-[#E5E5E5] dark:bg-gray-700'}`}/>)}</div>
              </div>
            </div>
            <div className="px-4 mb-4">
              <h3 className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-4">{t('pet.relatedPosts')}</h3>
              <div className="space-y-4">{petPosts.map(post => <PostCard key={post.id} post={post} />)}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
