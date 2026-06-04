import { Search, MapPin, Navigation, Star, Phone, ChevronRight, X, Share2, Heart, Maximize2 } from "lucide-react";
import { TENCENT_MAP_KEY } from '../config/map';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { BottomNav } from "../components/BottomNav";
import { postsApi, placesApi, discoverApi } from "../api/client";
import { useScrollRestore } from "../hooks/useScrollRestore";

/* ─── Note Expanded Modal ─── */
function NoteExpanded({ note, onClose, likedNotes, onToggleLike }: any) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-[85] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-full max-h-[80vh] overflow-y-auto w-[320px]" onClick={e => e.stopPropagation()}>
        {note.images && note.images[0] && (
          <img src={note.images[0]} className="w-full object-cover max-h-[320px]" />
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <img src={note.avatar} className="w-8 h-8 rounded-full object-cover" />
            <div>
              <div className="text-[14px] font-semibold text-[#333] dark:text-gray-100">{note.user}</div>
              <div className="text-[11px] text-[#BBB] dark:text-gray-500">{note.time}</div>
            </div>
          </div>
          <p className="text-[14px] text-[#555] dark:text-gray-300 leading-relaxed">{note.content}</p>
          <div className="mt-3 text-[12px] text-[#999] dark:text-gray-400"><Heart className={`w-3 h-3 inline mr-0.5 cursor-pointer ${likedNotes && likedNotes.has(note.id) ? 'text-[#FF4D4F] fill-[#FF4D4F]' : 'text-[#999]'}`} onClick={() => onToggleLike && onToggleLike(note.id)} />{note.likes + (likedNotes && likedNotes.has(note.id) ? 1 : 0)} {t('common.like')}</div>
        </div>
        <button onClick={onClose} className="w-full py-3 text-[14px] text-[#999] dark:text-gray-400 border-t border-[#EEE] dark:border-gray-700">{t('common.close')}</button>
      </div>
    </div>
  );
}

/* ───────── Place Detail Panel ───────── */
function PlaceDetail({ place, userLoc, isFavorite, wantCount, onToggleFavorite, onClose, distanceKm }: any) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [expandedNote, setExpandedNote] = useState<any>(null);
  const [likedNotes, setLikedNotes] = useState<Set<number>>(new Set());
  const toggleNoteLike = (noteId: number) => { setLikedNotes(prev => { const next = new Set(prev); if (next.has(noteId)) next.delete(noteId); else next.add(noteId); return next; }); };

  useEffect(() => {
    fetch(`http://192.168.3.52:3000/api/places/${place.id}/notes`)
      .then(r => r.json()).then(d => setNotes(d.data?.list || [])).catch(() => {});
  }, [place.id]);

  useEffect(() => {
    const profiles = [
      { key: 'driving', label: t('discover.drive') || '驾车', flag: 'd' },
      { key: 'walking', label: t('discover.walk') || '步行', flag: 'w' },
      { key: 'cycling', label: t('discover.bike') || '骑行', flag: 'b' },
    ];
    if (!userLoc) {
      setRoutes([{ label: t('discover.drive') || '驾车', flag: 'd', duration: null }, { label: t('discover.walk') || '步行', flag: 'w', duration: null }, { label: t('discover.bike') || '骑行', flag: 'b', duration: null }, { label: t('discover.transit') || '公交', flag: 'r', duration: null }]);
      setRoutesLoading(false); return;
    }
    Promise.all(profiles.map(async p => {
      try {
        const r = await fetch(`https://router.project-osrm.org/route/v1/${p.key}/${userLoc.lng},${userLoc.lat};${place.lng},${place.lat}?overview=false`);
        const d = await r.json();
        if (d.routes?.[0]) return { ...p, duration: d.routes[0].duration, distance: d.routes[0].distance };
      } catch {}
      return { ...p, duration: null };
    })).then(results => { results.push({ label: t('discover.transit') || '公交', flag: 'r', duration: null }); setRoutes(results); setRoutesLoading(false); })
      .catch(() => { setRoutes([{ label: t('discover.drive') || '驾车', flag: 'd', duration: null }, { label: t('discover.walk') || '步行', flag: 'w', duration: null }, { label: t('discover.bike') || '骑行', flag: 'b', duration: null }, { label: t('discover.transit') || '公交', flag: 'r', duration: null }]); setRoutesLoading(false); });
  }, [place, userLoc, t]);

  const fmt = (s: number) => s < 60 ? '<1min' : s < 3600 ? `${Math.round(s / 60)}min` : `${Math.floor(s / 3600)}h${Math.round((s % 3600) / 60)}min`;

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white dark:bg-gray-900 rounded-t-[20px] px-5 pt-5 pb-8 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-[18px] font-bold text-[#333] dark:text-gray-100 flex-1">{getPlaceName(place)}</h2>
          <div className="flex items-center gap-1">
            <button onClick={onToggleFavorite} className={`p-1 ${isFavorite ? 'text-[#FF4444]' : 'text-[#999] dark:text-gray-400'} active:opacity-70`}>
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#FF4444]' : ''}`} />
            </button>
            <button onClick={() => {
              const url = `http://maps.apple.com/?q=${place.lat},${place.lng}`;
              const text = `${getPlaceName(place)}\n⭐${place.rating} · ${place.type}\n${place.desc}`;
              if (navigator.share) navigator.share({ title: getPlaceName(place), text, url });
              else navigator.clipboard?.writeText(text);
            }} className="p-1 text-[#999] dark:text-gray-400 active:text-[#FF8C42]"><Share2 className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5 text-[#FF8C42]"><Star className="w-3.5 h-3.5 fill-[#FF8C42]" /><span className="text-[13px] font-medium">{place.rating}</span></div>
          <span className="text-[12px] text-[#999] dark:text-gray-400">{place.reviews} · {place.type || ''}</span>
          <span className="text-[12px] text-[#999] dark:text-gray-400">{place.distance_km !== undefined ? `${place.distance_km.toFixed(1)}km` : (userLoc ? `${getDistanceKm(place).toFixed(1)}km` : place.distance)}</span>
          <span className="text-[12px] text-[#FF8C42]">{wantCount}{t('discover.wantGo') || '人想去'}</span>
        </div>
        <p className="text-[14px] text-[#666] dark:text-gray-400 leading-relaxed mb-4">{place.desc}</p>

        {place.phone && (
          <div className="bg-[#F8F8F8] dark:bg-gray-800 rounded-xl p-3 mb-4">
            <a href={`tel:${place.phone}`} className="flex items-center gap-2 text-[14px] text-[#333] dark:text-gray-100">
              <Phone className="w-4 h-4 text-[#999] dark:text-gray-400" /><span className="flex-1">{place.phone}</span><ChevronRight className="w-4 h-4 text-[#CCC] dark:text-gray-600" />
            </a>
          </div>
        )}

        <div className="bg-[#F8F8F8] dark:bg-gray-800 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-1.5 mb-2"><Navigation className="w-3.5 h-3.5 text-[#FF8C42]" /><span className="text-[13px] font-bold text-[#333] dark:text-gray-100">{t('discover.goHere')}</span></div>
          {routesLoading ? <div className="text-[12px] text-[#999] dark:text-gray-400 py-2">{t('discover.calculatingRoute')}</div> : (
            <div className="grid grid-cols-4 gap-1.5">
              {routes.map((r: any) => (
                <button key={r.flag} onClick={() => { onClose(); window.open(`http://maps.apple.com/?daddr=${place.lat},${place.lng}&dirflg=${r.flag}`, '_blank'); }}
                  className="bg-white dark:bg-gray-900 rounded-lg py-2 flex flex-col items-center gap-0.5 active:bg-[#F5F5F5] dark:active:bg-gray-800">
                  <span className="text-[12px] font-medium text-[#333] dark:text-gray-100">{r.label}</span>
                  <span className="text-[10px] text-[#999] dark:text-gray-400">{r.duration ? fmt(r.duration) : t('discover.view')}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {notes.length > 0 && (
          <div>
            <h3 className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">{t('discover.reviewerNotes')} ({notes.length})</h3>
            {(() => {
              const left: any[] = [], right: any[] = [];
              notes.forEach((n: any, i: number) => (i % 2 === 0 ? left : right).push(n));
              return (
                <div className="flex gap-2">
                  {[left, right].map((col, ci) => (
                    <div key={ci} className="flex-1 flex flex-col gap-2">
                      {col.map((n: any) => (
                        <div key={n.id} onClick={() => setExpandedNote(n)} className="bg-[#F8F8F8] dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer active:opacity-80 relative group">
                          {n.images && n.images[0] && (
                            <img src={getMediaUrl(n.images[0])} className="w-full object-cover" style={{ aspectRatio: '1/1.2' }} />
                          )}
                          <div className="p-2.5">
                            <p className="text-[12px] text-[#333] dark:text-gray-100 leading-snug line-clamp-3 mb-2">{n.content}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <img src={n.avatar} className="w-5 h-5 rounded-full object-cover" />
                                <span className="text-[11px] text-[#999] dark:text-gray-400">{n.user}</span>
                              </div>
                              <span className="text-[10px] text-[#BBB] dark:text-gray-500"><Heart className={`w-3 h-3 inline mr-0.5 cursor-pointer ${likedNotes.has(n.id) ? 'text-[#FF4D4F] fill-[#FF4D4F]' : 'text-[#999]'}`} onClick={(e) => { e.stopPropagation(); toggleNoteLike(n.id); }} />{n.likes + (likedNotes.has(n.id) ? 1 : 0)}</span>
                            </div>
                          </div>
                          <div className="absolute top-1 right-1 bg-black/40 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        <button onClick={onClose} className="w-full h-10 mt-4 text-[#999] dark:text-gray-400 text-[13px] border-t border-[#EEE] dark:border-gray-700 pt-3">{t('common.close')}</button>
      </div>
      {expandedNote && <NoteExpanded note={expandedNote} onClose={() => setExpandedNote(null)} likedNotes={likedNotes} onToggleLike={toggleNoteLike} />}
    </div>
  );
}

/* ───────── New Place Form ───────── */
function MarkPlaceForm({ lat, lng, onClose }: any) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [desc, setDesc] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    try {
      await fetch('http://192.168.3.52:3000/api/places', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), type: type.trim() || '宠物友好', desc: desc.trim(), phone: phone.trim(), lat, lng }) });
      setSubmitted(true); setTimeout(onClose, 2000);
    } catch {}
  };

  if (submitted) return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white dark:bg-gray-900 rounded-t-[20px] px-5 pt-10 pb-10 text-center" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-full bg-[#E8F5E9] dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3"><span className="text-2xl">✅</span></div>
        <h3 className="text-[17px] font-bold text-[#333] dark:text-gray-100 mb-1">{t('discover.submitted')}</h3><p className="text-[13px] text-[#999] dark:text-gray-400">{t('discover.reviewNotice')}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white dark:bg-gray-900 rounded-t-[20px] px-5 pt-5 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><h2 className="text-[17px] font-bold text-[#333] dark:text-gray-100">{t('discover.markPlace')}</h2><button onClick={onClose}><X className="w-5 h-5 text-[#999] dark:text-gray-400" /></button></div>
        <p className="text-[12px] text-[#999] dark:text-gray-400 mb-4">📍 {lat.toFixed(5)}, {lng.toFixed(5)}</p>
        <input value={name} onChange={e => setName(e.target.value)} placeholder={t('discover.placeNameRequired')} className="w-full h-11 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 text-[14px] mb-3 outline-none" />
        <div className="flex flex-wrap gap-2 mb-3">{typeOptions.map(tp => (<button key={tp.value} onClick={() => setType(type === tp.value ? '' : tp.value)} className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${type === tp.value ? 'bg-[#FF8C42] text-white' : 'bg-[#F5F5F5] dark:bg-gray-800 text-[#666] dark:text-gray-400'}`}>{t(tp.key)}</button>))}</div>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder={t('discover.describePlace')} rows={3} className="w-full bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-[14px] mb-3 outline-none resize-none" />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('discover.phoneOptional')} className="w-full h-11 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 text-[14px] mb-4 outline-none" />
        <button onClick={handleSubmit} disabled={!name.trim()} className={`w-full h-12 rounded-xl text-[15px] font-bold ${name.trim() ? 'bg-[#FF8C42] text-white active:bg-[#E67A35]' : 'bg-[#E5E5E5] dark:bg-gray-700 text-[#999] dark:text-gray-500'}`}>{t('discover.submitReview')}</button>
        <button onClick={onClose} className="w-full h-10 mt-2 text-[#999] dark:text-gray-400 text-[13px]">{t('common.cancel')}</button>
      </div>
    </div>
  );
}

function getDistanceKm(p: any, userLoc?: { lat: number; lng: number } | null) {
  if (!userLoc) return Infinity;
  const R = 6371, dLat = (p.lat - userLoc.lat) * Math.PI / 180, dLng = (p.lng - userLoc.lng) * Math.PI / 180;
  return R * 2 * Math.atan2(Math.sqrt(Math.sin(dLat/2)**2+Math.cos(userLoc.lat*Math.PI/180)*Math.cos(p.lat*Math.PI/180)*Math.sin(dLng/2)**2), Math.sqrt(1-(Math.sin(dLat/2)**2+Math.cos(userLoc.lat*Math.PI/180)*Math.cos(p.lat*Math.PI/180)*Math.sin(dLng/2)**2)));
}

/* ───────── Main Discover Page ───────── */
const getMediaUrl = (item: any) => typeof item === 'string' ? item : item?.poster || item?.url || '';

const typeOptions = [
  { value: '公园', key: 'discover.typePark' },
  { value: '咖啡馆', key: 'discover.typeCafe' },
  { value: '医院', key: 'discover.typeHospital' },
  { value: '餐厅', key: 'discover.typeRestaurant' },
  { value: '小区', key: 'discover.typeResidential' },
  { value: '户外', key: 'discover.typeOutdoor' },
  { value: '美容', key: 'discover.typeGrooming' },
  { value: '商店', key: 'discover.typeShop' },
  { value: '其他', key: 'common.other' },
];

const typeColors = ['#4CAF50', '#795548', '#F44336', '#FF8C42', '#2196F3', '#E91E63', '#9C27B0', '#607D8B', '#FF8C42'];

function getTypeColor(type: string): string {
  const idx = typeOptions.findIndex(o => o.value === type);
  return typeColors[idx] || '#FF8C42';
}

function getPlaceName(place: any): string {
  return i18n.language === 'en' && place.name_en ? place.name_en : place.name;
}

export function Discover() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [places, setPlaces] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [markForm, setMarkForm] = useState<{ lat: number; lng: number } | null>(null);
  const [feed, setFeed] = useState<any[]>([]);
  const [feedPage, setFeedPage] = useState(1);
  const [feedHasMore, setFeedHasMore] = useState(false);
  const [feedLoading, setFeedLoading] = useState(false);
  const [mapFilter, setMapFilter] = useState('全部');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [feedSort, setFeedSort] = useState<'hot' | 'nearby' | 'newest'>('hot');
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('pawgram_favorites') || '[]')); } catch { return new Set(); }
  });
  const [mapError, setMapError] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);
  const [likedNotes, setLikedNotes] = useState<Set<number>>(new Set());
  const toggleNoteLike = (noteId: number) => { setLikedNotes(prev => { const next = new Set(prev); if (next.has(noteId)) next.delete(noteId); else next.add(noteId); return next; }); };
  const { containerRef: scrollRef, onScroll: saveScrollPos } = useScrollRestore(!feedLoading);
  const [pullState, setPullState] = useState<'idle' | 'pulling' | 'ready' | 'loading'>('idle');
  const [pullDist, setPullDist] = useState(0);
  const touchStartY = useRef(0);

  const mapTypes = ['全部', ...Array.from(new Set(places.map(p => p.type)))];
  let filteredPlaces = mapFilter === '全部' ? places : places.filter(p => p.type === mapFilter);
  if (favoritesOnly) filteredPlaces = filteredPlaces.filter(p => favorites.has(p.id));

  const wantCount = (id: number) => (id * 37 + 15) % 200 + 5;
  const sortedPlaces = [...filteredPlaces].sort((a, b) => getDistanceKm(a, userLoc) - getDistanceKm(b, userLoc));
  const favPlaces = places.filter(p => favorites.has(p.id));

  const toggleFavorite = (placeId: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(placeId)) next.delete(placeId); else next.add(placeId);
      localStorage.setItem('pawgram_favorites', JSON.stringify([...next]));
      return next;
    });
  };

  const sortedFeed = [...feed].sort((a, b) => feedSort === 'hot' ? b.likes - a.likes : feedSort === 'newest' ? (b.id - a.id) : (a.distance||999)-(b.distance||999));

  const fetchFeed = async (page = 1) => {
    setFeedLoading(true);
    try {
      const d = await postsApi.list(page);
      const feedItems = d.list.map((p: any) => ({
        id: p.id,
        postId: p.id,
        user: p.user?.name || '',
        avatar: p.user?.avatar || '',
        content: p.content,
        images: p.images || [],
        likes: p.like_count || 0,
        comment_count: p.comment_count || 0,
        breed: p.breed || '',
        placeName: p.location || '',
        time: p.created_at,
      }));
      if (page === 1) {
        setFeed(feedItems);
      } else {
        setFeed(prev => [...prev, ...feedItems]);
      }
      setFeedHasMore(d.pagination?.hasMore || false);
    } catch {}
    setFeedLoading(false);
  };

  useEffect(() => { placesApi.list(userLoc?.lat, userLoc?.lng).then(d => setPlaces(d.list)).catch(() => {}); }, [userLoc]);
  useEffect(() => { fetchFeed(1); }, []);
  const loadMore = () => { if (feedHasMore && !feedLoading) { const next = feedPage + 1; setFeedPage(next); fetchFeed(next); } };

  const handleTouchStart = (e: React.TouchEvent) => { if (scrollRef.current?.scrollTop===0) touchStartY.current=e.touches[0].clientY; };
  const handleTouchMove = (e: React.TouchEvent) => { if (scrollRef.current?.scrollTop!==0||touchStartY.current===0) return; const d=e.touches[0].clientY-touchStartY.current; if(d>0){setPullDist(Math.min(d*.5,80));setPullState(d>60?'ready':'pulling');} };
  const handleTouchEnd = async () => { if(pullState==='ready'){setPullState('loading');setPullDist(40);setFeedPage(1);await fetchFeed(1);setPullState('idle');setPullDist(0);}else{setPullState('idle');setPullDist(0);} touchStartY.current=0; };
  const handleScroll = () => { saveScrollPos(); const el=scrollRef.current; if(!el)return; if(el.scrollHeight-el.scrollTop-el.clientHeight<200)loadMore(); };
  useEffect(() => { navigator.geolocation?.getCurrentPosition(p=>setUserLoc({lat:p.coords.latitude,lng:p.coords.longitude}),()=>setUserLoc({lat:23.1291,lng:113.2644})); },[]);
  useEffect(() => { if (userLoc) { discoverApi.nearby(userLoc.lat, userLoc.lng, 8).then(d => setNearbyUsers(d.users || [])).catch(() => {}); } }, [userLoc]);
  useEffect(() => { const h=()=>{setShowMap(false);setSelectedPlace(null);setMarkForm(null);}; window.addEventListener('pawgram:discover-tab-click',h); return ()=>window.removeEventListener('pawgram:discover-tab-click',h); },[]);

  // Initialize/destroy Tencent Map when full-screen map opens/closes
  useEffect(() => {
    if (!showMap) {
      mapInstanceRef.current = null;
      markersRef.current = [];
      return;
    }
    let cancelled = false;
    const initMap = () => {
      if (cancelled || !mapContainerRef.current) return;
      const TMap = (window as any).TMap;
      if (!TMap) { setTimeout(initMap, 300); return; }
      try {
        const map = new TMap.Map(mapContainerRef.current, {
          center: new TMap.LatLng(23.1291, 113.2644),
          zoom: 13,
        });
        map.on('rightclick', (e: any) => {
          setMarkForm({ lat: e.latLng.lat, lng: e.latLng.lng });
        });
        mapInstanceRef.current = map;
      } catch { if (!cancelled) setMapError(true); }
    };
    setTimeout(initMap, 100);
    return () => { cancelled = true; };
  }, [showMap]);

  // Update markers when sortedPlaces changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const TMap = (window as any).TMap;
    if (!TMap) return;
    markersRef.current.forEach((m: any) => m.setMap && m.setMap(null));
    markersRef.current = [];
    if (sortedPlaces.length === 0) return;
    const markerLayer = new TMap.MultiMarker({
      map,
      styles: {
        marker: new TMap.MarkerStyle({
          width: 25,
          height: 35,
          anchor: { x: 12, y: 35 },
        }),
      },
      geometries: sortedPlaces.map((p) => ({
        id: String(p.id),
        styleId: 'marker',
        position: new TMap.LatLng(p.lat, p.lng),
        properties: { place: p },
      })),
    });
    markerLayer.on('click', (e: any) => {
      const place = e.geometry?.properties?.place;
      if (place) setSelectedPlace(place);
    });
    markersRef.current.push(markerLayer);
  }, [sortedPlaces]);


  const sortLabels: Record<string, string> = { hot: t('discover.hot'), nearby: t('discover.nearby'), newest: t('discover.newest') };

  return (
    <div className="h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col">
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-center shrink-0"><h1 className="text-[17px] font-bold text-[#333] dark:text-gray-100">{t('discover.title')}</h1></div>
      {showMap&&(<div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col" style={{paddingBottom:'calc(50px + env(safe-area-inset-bottom))'}}>
        <div className="flex items-center justify-between px-5 bg-white dark:bg-gray-900 shrink-0" style={{paddingTop:'calc(env(safe-area-inset-top) + 4px)',paddingBottom:'2px'}}><button onClick={()=>setShowMap(false)} className="text-[#FF8C42] text-[15px] font-medium py-1 px-1">{t('discover.backToMap')}</button><h2 className="text-[17px] font-bold text-[#333] dark:text-gray-100">{t('discover.petMap')}</h2><div className="w-12"/></div>
        <div className="flex gap-2 px-4 py-1.5 overflow-x-auto bg-white dark:bg-gray-900 border-b border-[#F0F0F0] dark:border-gray-700 shrink-0">
          <button onClick={() => { setFavoritesOnly(!favoritesOnly); if (!favoritesOnly) setMapFilter('全部'); }} className={`shrink-0 px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1 ${favoritesOnly ? 'bg-[#FF4444] text-white' : 'bg-[#F5F5F5] dark:bg-gray-800 text-[#666] dark:text-gray-400'}`}>
            <Heart className={`w-3 h-3 ${favoritesOnly ? 'fill-white' : ''}`} /> {t('discover.favorites')}
          </button>
          {mapTypes.map(tp=>{const tn=tp==='全部'?t('discover.all'):tp==='公园'?t('discover.typePark'):tp==='咖啡馆'?t('discover.typeCafe'):tp==='医院'?t('discover.typeHospital'):tp==='餐厅'?t('discover.typeRestaurant'):tp==='小区'?t('discover.typeResidential'):tp==='户外'?t('discover.typeOutdoor'):tp==='美容'?t('discover.typeGrooming'):tp==='商店'?t('discover.typeShop'):tp;return(<button key={tp} onClick={()=>{setFavoritesOnly(false);setMapFilter(tp===mapFilter?'全部':tp);}} className={`shrink-0 px-3 py-1 rounded-full text-[12px] font-medium ${!favoritesOnly&&mapFilter===tp?'bg-[#FF8C42] text-white':'bg-[#F5F5F5] dark:bg-gray-800 text-[#666] dark:text-gray-400'}`}>{tn}</button>);})}
        </div>
        <div className="flex-1 relative bg-[#E8E8E8] dark:bg-gray-800 overflow-hidden">
          {!mapError ? (
            <>
              <div ref={mapContainerRef} id="qq-map-container" className="absolute inset-0 w-full h-full" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button onClick={() => window.open(`http://maps.apple.com/?q=${userLoc?.lat || 23.1291},${userLoc?.lng || 113.2644}`, '_blank')} className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-3 shadow-lg flex items-center gap-2 active:opacity-80">
                  <MapPin className="w-5 h-5 text-[#FF8C42]" />
                  <span className="text-[14px] font-bold text-[#333] dark:text-gray-100">{t('discover.openInMaps')}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFF3E6] dark:bg-orange-900/30 flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-[#FF8C42]" />
              </div>
              <p className="text-[15px] font-semibold text-[#333] dark:text-gray-100 mb-1">{t('discover.mapLoadFailed')}</p>
              <p className="text-[13px] text-[#999] dark:text-gray-400 mb-5">{t('discover.mapLoadFailedHint')}</p>
              <button
                onClick={() => setShowMap(false)}
                className="bg-[#FF8C42] text-white px-6 py-2.5 rounded-full text-[14px] font-bold active:bg-[#E67A35]"
              >
                {t('discover.viewPlaceList')}
              </button>
            </div>
          )}
        </div>
        <div className="flex gap-2 p-3 overflow-x-auto bg-white dark:bg-gray-900 border-t border-[#EEE] dark:border-gray-700 shrink-0">{sortedPlaces.map(p=>(<div key={p.id} onClick={()=>setSelectedPlace(p)} className="shrink-0 bg-white dark:bg-gray-900 rounded-xl px-3 py-2 cursor-pointer shadow-sm border border-[#F0F0F0] dark:border-gray-700" style={{borderLeftWidth:'3px',borderLeftColor:getTypeColor(p.type)}}><div className="flex items-center gap-1.5"><span className="text-[13px] font-semibold text-[#333] dark:text-gray-100">{getPlaceName(p)}</span>{favorites.has(p.id)&&<Heart className="w-3 h-3 text-[#FF4444] fill-[#FF4444] shrink-0"/>}</div><div className="text-[11px] text-[#FF8C42] mt-0.5">★{p.rating} · {getDistanceKm(p, userLoc)===Infinity?p.distance:`${getDistanceKm(p, userLoc).toFixed(1)}km`}</div></div>))}</div>
      </div>)}
      {selectedPlace&&<PlaceDetail place={selectedPlace} userLoc={userLoc} isFavorite={favorites.has(selectedPlace.id)} wantCount={wantCount(selectedPlace.id)} onToggleFavorite={()=>toggleFavorite(selectedPlace.id)} onClose={()=>setSelectedPlace(null)}/>}
      {markForm&&<MarkPlaceForm lat={markForm.lat} lng={markForm.lng} onClose={()=>setMarkForm(null)}/>}
      <div className="flex-1 overflow-y-auto pb-24" ref={scrollRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onScroll={handleScroll}>
        {pullState!=='idle'&&(<div className="flex items-center justify-center gap-2 text-[12px] text-[#999] dark:text-gray-400" style={{height:pullDist}}>{pullState==='loading'&&<span className="w-3.5 h-3.5 border-2 border-[#FF8C42] border-t-transparent rounded-full animate-spin"/>}{pullState==='pulling'&&t('common.pullRefresh')}{pullState==='ready'&&t('common.releaseRefresh')}{pullState==='loading'&&t('common.refreshing')}</div>)}
        <div className="px-4 mt-5" onClick={()=>navigate('/search')}><div className="bg-white dark:bg-gray-900 border border-[#E5E5E5] dark:border-gray-600 rounded-lg px-3 py-2.5 flex items-center cursor-pointer"><Search className="w-4 h-4 text-[#999] dark:text-gray-400 mr-2 shrink-0"/><span className="flex-1 text-[14px] text-[#999] dark:text-gray-400">{t('discover.searchPlaceholder')}</span></div></div>
        <div className="mt-8"><div className="flex items-center justify-between px-4 mb-4"><h2 className="text-[14px] font-bold text-[#333] dark:text-gray-100">{t('discover.petMap')}</h2><button className="text-[#FF8C42] text-[12px] font-medium" onClick={()=>setShowMap(true)}>{t('common.viewAll')}</button></div>{!showMap && (
          <div className="px-4">
            <div className="cursor-pointer" onClick={()=>setShowMap(true)}>
              <img src={`https://apis.map.qq.com/ws/staticmap/v2/?center=23.1291,113.2644&zoom=13&size=600*300&key=${TENCENT_MAP_KEY}`}
                   className="w-full h-[160px] object-cover rounded-xl" alt="" />
            </div>
          </div>
        )}
        </div>
        {favPlaces.length>0&&(<div className="mt-8"><h2 className="px-4 text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">{t('discover.myWishlist')} ({favPlaces.length})</h2><div className="flex gap-3 px-4 overflow-x-auto pb-2">{favPlaces.map(p=>(<div key={p.id} onClick={()=>setSelectedPlace(p)} className="shrink-0 w-[130px] bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-[#F0F0F0] dark:border-gray-700 cursor-pointer active:opacity-80"><div className="h-[70px] flex items-center justify-center" style={{backgroundColor:getTypeColor(p.type)+'20'}}><MapPin className="w-6 h-6" style={{color:getTypeColor(p.type)}}/></div><div className="p-2.5"><div className="text-[13px] font-semibold text-[#333] dark:text-gray-100 truncate">{getPlaceName(p)}</div><div className="text-[11px] text-[#999] dark:text-gray-400 mt-0.5">{p.type} · ★{p.rating}</div></div></div>))}</div></div>)}
        {nearbyUsers.length > 0 && (
          <div className="mt-6 px-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {nearbyUsers.map((u: any) => (
                <div key={u.id} className="shrink-0 w-[100px] bg-white dark:bg-gray-900 rounded-xl p-3 flex flex-col items-center border border-[#F0F0F0] dark:border-gray-700 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB380] p-[2px] mb-2">
                    <img src={u.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'} onClick={() => navigate(`/user/${u.id}`)} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900 cursor-pointer active:opacity-70"/>
                  </div>
                  <span className="text-[12px] font-bold text-[#333] dark:text-gray-100 truncate w-full text-center">{u.nickname}</span>
                  <span className="text-[10px] text-[#999] dark:text-gray-400">{u.distance_km != null ? `${u.distance_km}km` : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {feed.length>0&&(<div className="mt-8 mb-6"><div className="flex items-center justify-between px-4 mb-3"><h2 className="text-[14px] font-bold text-[#333] dark:text-gray-100">{t('discover.nearbyHot')}</h2><div className="flex gap-1">{[{k:'hot',l:t('discover.hot')},{k:'nearby',l:t('discover.nearby')},{k:'newest',l:t('discover.newest')}].map(s=>(<button key={s.k} onClick={()=>setFeedSort(s.k as any)} className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${feedSort===s.k?'bg-[#FF8C42] text-white':'bg-[#F5F5F5] dark:bg-gray-800 text-[#999] dark:text-gray-400'}`}>{s.l}</button>))}</div></div>{(()=>{const left:any[]=[],right:any[]=[];sortedFeed.forEach((n:any,i:number)=>(i%2===0?left:right).push(n));return(<div className="flex gap-2 px-4">{[left,right].map((col,ci)=>(<div key={ci} className="flex-1 flex flex-col gap-2">{col.map((n:any)=>(<div key={n.id} onClick={()=>navigate(`/post/${n.postId}`)} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-[#F0F0F0] dark:border-gray-700 cursor-pointer active:opacity-80">{n.images&&n.images[0]&&(<img src={getMediaUrl(n.images[0])} className="w-full object-cover" style={{aspectRatio:'1/1.1'}}/>)}<div className="p-2.5"><p className="text-[12px] text-[#333] dark:text-gray-100 leading-snug line-clamp-2 mb-2">{n.content}</p><div className="flex items-center justify-between"><div className="flex items-center gap-1.5 min-w-0"><img src={n.avatar} onClick={(e) => { e.stopPropagation(); navigate(`/user/${n.userId || n.user?.id}`); }} className="w-4 h-4 rounded-full object-cover shrink-0 cursor-pointer active:opacity-70"/><span className="text-[10px] text-[#999] dark:text-gray-400 truncate">{n.user}</span></div><span className="text-[10px] text-[#FF8C42] shrink-0"><Heart className={`w-3 h-3 inline mr-0.5 cursor-pointer ${likedNotes.has(n.id) ? 'text-[#FF4D4F] fill-[#FF4D4F]' : 'text-[#999]'}`} onClick={(e) => { e.stopPropagation(); toggleNoteLike(n.id); }} />{n.likes + (likedNotes.has(n.id) ? 1 : 0)}</span></div>{n.placeName&&(<div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#BBB] dark:text-gray-500"><MapPin className="w-2.5 h-2.5"/><span className="truncate">{n.placeName}</span></div>)}</div></div>))}</div>))}</div>);})()}</div>)}
        {feedLoading&&<div className="text-center py-4 text-[12px] text-[#999] dark:text-gray-400">{t('common.loading')}</div>}
        {!feedLoading&&feedHasMore&&<div className="text-center py-3 text-[12px] text-[#BBB] dark:text-gray-500">{t('common.loadMore')}</div>}
      </div>
      <BottomNav/>
    </div>
  );
}
