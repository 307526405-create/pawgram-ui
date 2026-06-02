import { Search, MapPin, Navigation, Star, Phone, ChevronRight, X, Share2, Heart, Maximize2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { mapPreviewImage } from "../data/mockData";
import { placesApi, discoverApi } from "../api/client";

/* ─── Note Expanded Modal ─── */
function NoteExpanded({ note, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[85] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-full max-h-[80vh] overflow-y-auto w-[320px]" onClick={e => e.stopPropagation()}>
        {note.images && note.images[0] && (
          <img src={note.images[0]} className="w-full object-cover max-h-[320px]" />
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <img src={note.avatar} className="w-8 h-8 rounded-full object-cover" />
            <div>
              <div className="text-[14px] font-semibold text-[#333]">{note.user}</div>
              <div className="text-[11px] text-[#BBB]">{note.time}</div>
            </div>
          </div>
          <p className="text-[14px] text-[#555] leading-relaxed">{note.content}</p>
          <div className="mt-3 text-[12px] text-[#999]">❤ {note.likes} 赞</div>
        </div>
        <button onClick={onClose} className="w-full py-3 text-[14px] text-[#999] border-t border-[#EEE]">关闭</button>
      </div>
    </div>
  );
}

/* ───────── Place Detail Panel ───────── */
function PlaceDetail({ place, userLoc, isFavorite, wantCount, onToggleFavorite, onClose, distanceKm }: any) {
  const [notes, setNotes] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [expandedNote, setExpandedNote] = useState<any>(null);

  useEffect(() => {
    fetch(`http://192.168.3.52:3000/api/places/${place.id}/notes`)
      .then(r => r.json()).then(d => setNotes(d.data?.list || [])).catch(() => {});
  }, [place.id]);

  useEffect(() => {
    const profiles = [
      { key: 'driving', label: '驾车', flag: 'd' },
      { key: 'walking', label: '步行', flag: 'w' },
      { key: 'cycling', label: '骑行', flag: 'b' },
    ];
    if (!userLoc) {
      setRoutes([{ label: '驾车', flag: 'd', duration: null }, { label: '步行', flag: 'w', duration: null }, { label: '骑行', flag: 'b', duration: null }, { label: '公交', flag: 'r', duration: null }]);
      setRoutesLoading(false); return;
    }
    Promise.all(profiles.map(async p => {
      try {
        const r = await fetch(`https://router.project-osrm.org/route/v1/${p.key}/${userLoc.lng},${userLoc.lat};${place.lng},${place.lat}?overview=false`);
        const d = await r.json();
        if (d.routes?.[0]) return { ...p, duration: d.routes[0].duration, distance: d.routes[0].distance };
      } catch {}
      return { ...p, duration: null };
    })).then(results => { results.push({ label: '公交', flag: 'r', duration: null }); setRoutes(results); setRoutesLoading(false); })
      .catch(() => { setRoutes([{ label: '驾车', flag: 'd', duration: null }, { label: '步行', flag: 'w', duration: null }, { label: '骑行', flag: 'b', duration: null }, { label: '公交', flag: 'r', duration: null }]); setRoutesLoading(false); });
  }, [place, userLoc]);

  const fmt = (s: number) => s < 60 ? '<1分钟' : s < 3600 ? `${Math.round(s / 60)}分钟` : `${Math.floor(s / 3600)}h${Math.round((s % 3600) / 60)}min`;

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-[20px] px-5 pt-5 pb-8 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-[18px] font-bold text-[#333] flex-1">{place.name}</h2>
          <div className="flex items-center gap-1">
            <button onClick={onToggleFavorite} className={`p-1 ${isFavorite ? 'text-[#FF4444]' : 'text-[#999]'} active:opacity-70`}>
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#FF4444]' : ''}`} />
            </button>
            <button onClick={() => {
              const url = `http://maps.apple.com/?q=${place.lat},${place.lng}`;
              const text = `${place.name}\n⭐${place.rating} · ${place.type}\n${place.desc}\n📍 在地图中查看: ${url}`;
              if (navigator.share) navigator.share({ title: place.name, text, url });
              else navigator.clipboard?.writeText(text);
            }} className="p-1 text-[#999] active:text-[#FF8C42]"><Share2 className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5 text-[#FF8C42]"><Star className="w-3.5 h-3.5 fill-[#FF8C42]" /><span className="text-[13px] font-medium">{place.rating}</span></div>
          <span className="text-[12px] text-[#999]">{place.reviews}条 · {place.type || ''}</span>
          <span className="text-[12px] text-[#999]">{userLoc ? `${getDistanceKm(place).toFixed(1)}km` : place.distance}</span>
          <span className="text-[12px] text-[#FF8C42]">已有{wantCount}人想去</span>
        </div>
        <p className="text-[14px] text-[#666] leading-relaxed mb-4">{place.desc}</p>

        {place.phone && (
          <div className="bg-[#F8F8F8] rounded-xl p-3 mb-4">
            <a href={`tel:${place.phone}`} className="flex items-center gap-2 text-[14px] text-[#333]">
              <Phone className="w-4 h-4 text-[#999]" /><span className="flex-1">{place.phone}</span><ChevronRight className="w-4 h-4 text-[#CCC]" />
            </a>
          </div>
        )}

        <div className="bg-[#F8F8F8] rounded-xl p-3 mb-4">
          <div className="flex items-center gap-1.5 mb-2"><Navigation className="w-3.5 h-3.5 text-[#FF8C42]" /><span className="text-[13px] font-bold text-[#333]">去这里</span></div>
          {routesLoading ? <div className="text-[12px] text-[#999] py-2">计算路线中...</div> : (
            <div className="grid grid-cols-4 gap-1.5">
              {routes.map((r: any) => (
                <button key={r.flag} onClick={() => { onClose(); window.open(`http://maps.apple.com/?daddr=${place.lat},${place.lng}&dirflg=${r.flag}`, '_blank'); }}
                  className="bg-white rounded-lg py-2 flex flex-col items-center gap-0.5 active:bg-[#F5F5F5]">
                  <span className="text-[12px] font-medium text-[#333]">{r.label}</span>
                  <span className="text-[10px] text-[#999]">{r.duration ? fmt(r.duration) : '查看'}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {notes.length > 0 && (
          <div>
            <h3 className="text-[14px] font-bold text-[#333] mb-3">达人说 ({notes.length})</h3>
            {(() => {
              const left: any[] = [], right: any[] = [];
              notes.forEach((n: any, i: number) => (i % 2 === 0 ? left : right).push(n));
              return (
                <div className="flex gap-2">
                  {[left, right].map((col, ci) => (
                    <div key={ci} className="flex-1 flex flex-col gap-2">
                      {col.map((n: any) => (
                        <div key={n.id} onClick={() => setExpandedNote(n)} className="bg-[#F8F8F8] rounded-xl overflow-hidden cursor-pointer active:opacity-80 relative group">
                          {n.images && n.images[0] && (
                            <img src={n.images[0]} className="w-full object-cover" style={{ aspectRatio: '1/1.2' }} />
                          )}
                          <div className="p-2.5">
                            <p className="text-[12px] text-[#333] leading-snug line-clamp-3 mb-2">{n.content}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <img src={n.avatar} className="w-5 h-5 rounded-full object-cover" />
                                <span className="text-[11px] text-[#999]">{n.user}</span>
                              </div>
                              <span className="text-[10px] text-[#BBB]">❤ {n.likes}</span>
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

        <button onClick={onClose} className="w-full h-10 mt-4 text-[#999] text-[13px] border-t border-[#EEE] pt-3">关闭</button>
      </div>
      {expandedNote && <NoteExpanded note={expandedNote} onClose={() => setExpandedNote(null)} />}
    </div>
  );
}

/* ───────── New Place Form ───────── */
function MarkPlaceForm({ lat, lng, onClose }: any) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [desc, setDesc] = useState('');
  const [phone, setPhone] = useState('');
  const typeOptions = ['公园', '咖啡馆', '医院', '餐厅', '小区', '户外', '美容', '商店', '其他'];
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
      <div className="w-full bg-white rounded-t-[20px] px-5 pt-10 pb-10 text-center" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-3"><span className="text-2xl">✅</span></div>
        <h3 className="text-[17px] font-bold text-[#333] mb-1">提交成功！</h3><p className="text-[13px] text-[#999]">审核通过后将在地图上展示</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-[20px] px-5 pt-5 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><h2 className="text-[17px] font-bold text-[#333]">标记宠物友好地点</h2><button onClick={onClose}><X className="w-5 h-5 text-[#999]" /></button></div>
        <p className="text-[12px] text-[#999] mb-4">位置: {lat.toFixed(5)}, {lng.toFixed(5)}</p>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="地点名称（必填）" className="w-full h-11 bg-[#F5F5F5] rounded-lg px-3 text-[14px] mb-3 outline-none" />
        <div className="flex flex-wrap gap-2 mb-3">{typeOptions.map(t => (<button key={t} onClick={() => setType(type === t ? '' : t)} className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${type === t ? 'bg-[#FF8C42] text-white' : 'bg-[#F5F5F5] text-[#666]'}`}>{t}</button>))}</div>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="描述一下这个地方..." rows={3} className="w-full bg-[#F5F5F5] rounded-lg px-3 py-2 text-[14px] mb-3 outline-none resize-none" />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="联系电话（选填）" className="w-full h-11 bg-[#F5F5F5] rounded-lg px-3 text-[14px] mb-4 outline-none" />
        <button onClick={handleSubmit} disabled={!name.trim()} className={`w-full h-12 rounded-xl text-[15px] font-bold ${name.trim() ? 'bg-[#FF8C42] text-white active:bg-[#E67A35]' : 'bg-[#E5E5E5] text-[#999]'}`}>提交审核</button>
        <button onClick={onClose} className="w-full h-10 mt-2 text-[#999] text-[13px]">取消</button>
      </div>
    </div>
  );
}

/* ───────── Main Discover Page ───────── */
export function Discover() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [markForm, setMarkForm] = useState<{ lat: number; lng: number } | null>(null);
  const [feed, setFeed] = useState<any[]>([]);
  const [feedLimit, setFeedLimit] = useState(6);
  const [feedTotal, setFeedTotal] = useState(0);
  const [feedLoading, setFeedLoading] = useState(false);
  const [mapFilter, setMapFilter] = useState('全部');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [feedSort, setFeedSort] = useState<'hot' | 'nearby' | 'newest'>('hot');
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('pawgram_favorites') || '[]')); } catch { return new Set(); }
  });
  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);
  const mapRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pullState, setPullState] = useState<'idle' | 'pulling' | 'ready' | 'loading'>('idle');
  const [pullDist, setPullDist] = useState(0);
  const touchStartY = useRef(0);

  const mapTypes = ['全部', ...Array.from(new Set(places.map(p => p.type)))];
  let filteredPlaces = mapFilter === '全部' ? places : places.filter(p => p.type === mapFilter);
  if (favoritesOnly) filteredPlaces = filteredPlaces.filter(p => favorites.has(p.id));

  const getDistanceKm = (p: any) => {
    if (!userLoc) return Infinity;
    const R = 6371, dLat = (p.lat - userLoc.lat) * Math.PI / 180, dLng = (p.lng - userLoc.lng) * Math.PI / 180;
    return R * 2 * Math.atan2(Math.sqrt(Math.sin(dLat/2)**2+Math.cos(userLoc.lat*Math.PI/180)*Math.cos(p.lat*Math.PI/180)*Math.sin(dLng/2)**2), Math.sqrt(1-(Math.sin(dLat/2)**2+Math.cos(userLoc.lat*Math.PI/180)*Math.cos(p.lat*Math.PI/180)*Math.sin(dLng/2)**2)));
  };
  const wantCount = (id: number) => (id * 37 + 15) % 200 + 5;
  const sortedPlaces = [...filteredPlaces].sort((a, b) => getDistanceKm(a) - getDistanceKm(b));
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

  const fetchFeed = async (limit?: number) => {
    setFeedLoading(true);
    try { const d = await placesApi.discoverFeed(limit); setFeed(d.list); setFeedTotal(d.total||0); } catch {}
    setFeedLoading(false);
  };

  useEffect(() => { placesApi.list().then(d => setPlaces(d.list)).catch(() => {}); }, []);
  useEffect(() => { fetchFeed(feedLimit); }, [feedLimit]);
  const loadMore = () => { if (feed.length < feedTotal && !feedLoading) setFeedLimit(l => l + 6); };

  const handleTouchStart = (e: React.TouchEvent) => { if (scrollRef.current?.scrollTop===0) touchStartY.current=e.touches[0].clientY; };
  const handleTouchMove = (e: React.TouchEvent) => { if (scrollRef.current?.scrollTop!==0||touchStartY.current===0) return; const d=e.touches[0].clientY-touchStartY.current; if(d>0){setPullDist(Math.min(d*.5,80));setPullState(d>60?'ready':'pulling');} };
  const handleTouchEnd = async () => { if(pullState==='ready'){setPullState('loading');setPullDist(40);setFeedLimit(6);await fetchFeed(6);setPullState('idle');setPullDist(0);}else{setPullState('idle');setPullDist(0);} touchStartY.current=0; };
  const handleScroll = () => { const el=scrollRef.current; if(!el)return; if(el.scrollHeight-el.scrollTop-el.clientHeight<200)loadMore(); };
  useEffect(() => { navigator.geolocation?.getCurrentPosition(p=>setUserLoc({lat:p.coords.latitude,lng:p.coords.longitude}),()=>setUserLoc({lat:23.132,lng:113.321})); },[]);
  useEffect(() => { if (userLoc) { discoverApi.nearby(userLoc.lat, userLoc.lng, 8).then(d => setNearbyUsers(d.users || [])).catch(() => {}); } }, [userLoc]);
  useEffect(() => { const h=()=>{setShowMap(false);setSelectedPlace(null);setMarkForm(null);}; window.addEventListener('pawgram:discover-tab-click',h); return ()=>window.removeEventListener('pawgram:discover-tab-click',h); },[]);

  useEffect(() => { if(!showMap||places.length===0)return; const L=(window as any).L; if(!L){const link=document.createElement('link');link.rel='stylesheet';link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(link);const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.onload=()=>initMap(L);document.head.appendChild(script);}else{initMap(L);}
    function initMap(L:any){const el=document.getElementById('pawgram-leaflet-map');if(!el||(el as any)._leaflet_map)return;const map=L.map(el).setView([23.132,113.321],13);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:19}).addTo(map);if(userLoc)L.circleMarker([userLoc.lat,userLoc.lng],{radius:6,color:'#4A90D9',fillColor:'#4A90D9',fillOpacity:1,weight:3}).addTo(map).bindPopup('我的位置');addMarkers(L,map,filteredPlaces);
      let pressTimer:any,startX=0,startY=0;const container=map.getContainer();container.addEventListener('pointerdown',(e:PointerEvent)=>{startX=e.clientX;startY=e.clientY;pressTimer=setTimeout(()=>{const ll=map.containerPointToLatLng(map.mouseEventToContainerPoint(e));setMarkForm({lat:ll.lat,lng:ll.lng});},600);});container.addEventListener('pointermove',(e:PointerEvent)=>{if(Math.abs(e.clientX-startX)>8||Math.abs(e.clientY-startY)>8)clearTimeout(pressTimer);});container.addEventListener('pointerup',()=>clearTimeout(pressTimer));container.addEventListener('pointercancel',()=>clearTimeout(pressTimer));
      (el as any)._leaflet_map=map;mapRef.current=map;setTimeout(()=>map.invalidateSize(),200);}
  },[showMap,places,userLoc]);

  function addMarkers(L:any,map:any,list:any[]){const c:Record<string,string>={'公园':'#4CAF50','咖啡馆':'#795548','医院':'#F44336','餐厅':'#FF8C42','户外':'#2196F3','美容':'#E91E63','小区':'#9C27B0','商店':'#607D8B'};list.forEach(p=>{L.circleMarker([p.lat,p.lng],{radius:8,color:'#fff',weight:2.5,fillColor:c[p.type]||'#FF8C42',fillOpacity:.9}).addTo(map).on('click',()=>setSelectedPlace(p));});}

  useEffect(()=>{const map=mapRef.current;if(!map)return;const L=(window as any).L;map.eachLayer((l:any)=>{if(l instanceof L.Marker||l instanceof L.CircleMarker||l instanceof L.Circle)map.removeLayer(l);});if(userLoc)L.circleMarker([userLoc.lat,userLoc.lng],{radius:6,color:'#4A90D9',fillColor:'#4A90D9',fillOpacity:1,weight:3}).addTo(map).bindPopup('我的位置');addMarkers(L,map,filteredPlaces);},[filteredPlaces]);

  const getMarkerColor = (t: string) => ({'公园':'#4CAF50','咖啡馆':'#795548','医院':'#F44336','餐厅':'#FF8C42','户外':'#2196F3','美容':'#E91E63','小区':'#9C27B0','商店':'#607D8B'} as any)[t]||'#FF8C42';

  return (
    <div className="h-full bg-[#FAFAFA] relative flex flex-col">
      <div className="bg-[#FAFAFA]/90 pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-center shrink-0"><h1 className="text-[17px] font-bold text-[#333]">发现</h1></div>
      {showMap&&(<div className="fixed inset-0 z-50 bg-white flex flex-col" style={{paddingBottom:'calc(50px + env(safe-area-inset-bottom))'}}>
        <div className="flex items-center justify-between px-5 bg-white shrink-0" style={{paddingTop:'calc(env(safe-area-inset-top) + 4px)',paddingBottom:'2px'}}><button onClick={()=>setShowMap(false)} className="text-[#FF8C42] text-[15px] font-medium py-1 px-1">← 返回</button><h2 className="text-[17px] font-bold text-[#333]">遛宠地图</h2><div className="w-12"/></div>
        <div className="text-center text-[10px] text-[#CCC] pb-1 shrink-0">长按地图标记新地点</div>
        <div className="flex gap-2 px-4 py-1.5 overflow-x-auto bg-white border-b border-[#F0F0F0] shrink-0">
          <button onClick={() => { setFavoritesOnly(!favoritesOnly); if (!favoritesOnly) setMapFilter('全部'); }} className={`shrink-0 px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1 ${favoritesOnly ? 'bg-[#FF4444] text-white' : 'bg-[#F5F5F5] text-[#666]'}`}>
            <Heart className={`w-3 h-3 ${favoritesOnly ? 'fill-white' : ''}`} /> 收藏
          </button>
          {mapTypes.map(t=>(<button key={t} onClick={()=>{setFavoritesOnly(false);setMapFilter(t===mapFilter?'全部':t);}} className={`shrink-0 px-3 py-1 rounded-full text-[12px] font-medium ${!favoritesOnly&&mapFilter===t?'bg-[#FF8C42] text-white':'bg-[#F5F5F5] text-[#666]'}`}>{t}</button>))}
        </div>
        <div id="pawgram-leaflet-map" className="flex-1 w-full"/>
        <div className="flex gap-2 p-3 overflow-x-auto bg-white border-t border-[#EEE] shrink-0">{sortedPlaces.map(p=>(<div key={p.id} onClick={()=>setSelectedPlace(p)} className="shrink-0 bg-white rounded-xl px-3 py-2 cursor-pointer shadow-sm border border-[#F0F0F0]" style={{borderLeftWidth:'3px',borderLeftColor:getMarkerColor(p.type)}}><div className="flex items-center gap-1.5"><span className="text-[13px] font-semibold text-[#333]">{p.name}</span>{favorites.has(p.id)&&<Heart className="w-3 h-3 text-[#FF4444] fill-[#FF4444] shrink-0"/>}</div><div className="text-[11px] text-[#FF8C42] mt-0.5">★{p.rating} · {getDistanceKm(p)===Infinity?p.distance:`${getDistanceKm(p).toFixed(1)}km`}</div></div>))}</div>
      </div>)}
      {selectedPlace&&<PlaceDetail place={selectedPlace} userLoc={userLoc} isFavorite={favorites.has(selectedPlace.id)} wantCount={wantCount(selectedPlace.id)} onToggleFavorite={()=>toggleFavorite(selectedPlace.id)} onClose={()=>setSelectedPlace(null)}/>}
      {markForm&&<MarkPlaceForm lat={markForm.lat} lng={markForm.lng} onClose={()=>setMarkForm(null)}/>}
      <div className="flex-1 overflow-y-auto pb-24" ref={scrollRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onScroll={handleScroll}>
        {pullState!=='idle'&&(<div className="flex items-center justify-center text-[12px] text-[#999]" style={{height:pullDist}}>{pullState==='pulling'&&'下拉刷新'}{pullState==='ready'&&'释放刷新'}{pullState==='loading'&&'刷新中...'}</div>)}
        <div className="px-4 mt-5" onClick={()=>navigate('/search')}><div className="bg-white border border-[#E5E5E5] rounded-lg px-3 py-2.5 flex items-center cursor-pointer"><Search className="w-4 h-4 text-[#999] mr-2 shrink-0"/><span className="flex-1 text-[14px] text-[#999]">搜索宠物、用户或话题</span></div></div>
        <div className="mt-8"><div className="flex items-center justify-between px-4 mb-4"><h2 className="text-[14px] font-bold text-[#333]">遛宠地图</h2><button className="text-[#FF8C42] text-[12px] font-medium" onClick={()=>setShowMap(true)}>查看全部</button></div><div className="px-4"><div onClick={()=>setShowMap(true)} className="bg-white rounded-xl border border-[#EEE] overflow-hidden shadow-sm cursor-pointer active:opacity-80"><div className="relative h-[120px] w-full"><ImageWithFallback src={mapPreviewImage} alt="地图" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"/><div className="absolute bottom-3 left-3 flex items-center text-white"><MapPin className="w-4 h-4 mr-1"/><span className="text-[12px] font-medium">发现附近 {places.length} 个宠物友好地点</span></div></div></div></div></div>
        {favPlaces.length>0&&(<div className="mt-8"><h2 className="px-4 text-[14px] font-bold text-[#333] mb-3">我的想去 ({favPlaces.length})</h2><div className="flex gap-3 px-4 overflow-x-auto pb-2">{favPlaces.map(p=>(<div key={p.id} onClick={()=>setSelectedPlace(p)} className="shrink-0 w-[130px] bg-white rounded-xl overflow-hidden shadow-sm border border-[#F0F0F0] cursor-pointer active:opacity-80"><div className="h-[70px] flex items-center justify-center" style={{backgroundColor:getMarkerColor(p.type)+'20'}}><MapPin className="w-6 h-6" style={{color:getMarkerColor(p.type)}}/></div><div className="p-2.5"><div className="text-[13px] font-semibold text-[#333] truncate">{p.name}</div><div className="text-[11px] text-[#999] mt-0.5">{p.type} · ★{p.rating}</div></div></div>))}</div></div>)}
        {feed.length>0&&(<div className="mt-8 mb-6"><div className="flex items-center justify-between px-4 mb-3"><h2 className="text-[14px] font-bold text-[#333]">附近热门</h2><div className="flex gap-1">{[{k:'hot',l:'热门'},{k:'nearby',l:'附近'},{k:'newest',l:'最新'}].map(s=>(<button key={s.k} onClick={()=>setFeedSort(s.k as any)} className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${feedSort===s.k?'bg-[#FF8C42] text-white':'bg-[#F5F5F5] text-[#999]'}`}>{s.l}</button>))}</div></div>{(()=>{const left:any[]=[],right:any[]=[];sortedFeed.forEach((n:any,i:number)=>(i%2===0?left:right).push(n));return(<div className="flex gap-2 px-4">{[left,right].map((col,ci)=>(<div key={ci} className="flex-1 flex flex-col gap-2">{col.map((n:any)=>(<div key={n.id} onClick={()=>{const p=places.find((pl:any)=>pl.id===n.placeId);if(p)setSelectedPlace(p);}} className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#F0F0F0] cursor-pointer active:opacity-80">{n.images&&n.images[0]&&(<img src={n.images[0]} className="w-full object-cover" style={{aspectRatio:'1/1.1'}}/>)}<div className="p-2.5"><p className="text-[12px] text-[#333] leading-snug line-clamp-2 mb-2">{n.content}</p><div className="flex items-center justify-between"><div className="flex items-center gap-1.5 min-w-0"><img src={n.avatar} className="w-4 h-4 rounded-full object-cover shrink-0"/><span className="text-[10px] text-[#999] truncate">{n.user}</span></div><span className="text-[10px] text-[#FF8C42] shrink-0">❤ {n.likes}</span></div>{n.placeName&&(<div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#BBB]"><MapPin className="w-2.5 h-2.5"/><span className="truncate">{n.placeName}</span></div>)}</div></div>))}</div>))}</div>);})()}</div>)}
        {feedLoading&&<div className="text-center py-4 text-[12px] text-[#999]">加载中...</div>}
        {!feedLoading&&feed.length<feedTotal&&<div className="text-center py-3 text-[12px] text-[#BBB]">上拉加载更多</div>}
        
        {/* 附近的宠物达人 */}
        <div className="mt-8 mb-6">
          <h2 className="px-4 text-[14px] font-bold text-[#333] mb-3">附近的人</h2>
          <div className="flex gap-3 px-4 overflow-x-auto pb-2">
            {[{name:"大黄铲屎官",av:"https://images.unsplash.com/photo-1761933808230-9a2e78956daa?w=200",dist:"0.5km",pet:"金毛"},{name:"橘猫日记",av:"https://images.unsplash.com/photo-1536548665027-b96d34a005ae?w=200",dist:"1.2km",pet:"橘猫"},{name:"柯基小短腿",av:"https://images.unsplash.com/photo-1615464670798-6e92fafa2a89?w=200",dist:"1.8km",pet:"柯基"},{name:"布偶猫主人",av:"https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=200",dist:"2.1km",pet:"布偶猫"}].map(u=>(
            <div key={u.name} className="shrink-0 w-[100px] bg-white rounded-xl p-3 flex flex-col items-center border border-[#F0F0F0] shadow-sm">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB380] p-[2px] mb-2">
                <img src={u.av} className="w-full h-full rounded-full object-cover border-2 border-white"/>
              </div>
              <span className="text-[12px] font-bold text-[#333] truncate w-full text-center">{u.name}</span>
              <span className="text-[10px] text-[#999]">{u.pet} · {u.dist}</span>
            </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav/>
    </div>
  );
}
