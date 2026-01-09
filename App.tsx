
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Post, KPopGroup } from './types';
import { HOME_IMAGE, GROUPS } from './constants';

/** 
 * Persistent Storage Keys
 */
const STORAGE_KEY = 'pokshin_archive_posts_v1';
const DRAFT_PREFIX = 'pokshin_archive_draft_';

const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const addPost = (post: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...post,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return { posts, addPost, deletePost };
};

/**
 * Shared Components
 */
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="animate-in fade-in duration-700 ease-out fill-mode-both h-full">
    {children}
  </div>
);

const Header: React.FC<{ title: string; showBack?: boolean; onBack?: () => void; action?: React.ReactNode }> = ({ title, showBack, onBack, action }) => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 ios-card border-b border-neutral-100">
      <div className="min-w-[70px]">
        {showBack && (
          <button onClick={onBack || (() => navigate(-1))} className="p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
      </div>
      <h1 className="text-lg font-semibold tracking-tight truncate flex-1 text-center">{title}</h1>
      <div className="min-w-[70px] flex justify-end">
        {action}
      </div>
    </header>
  );
};

/**
 * Page: Landing (Home)
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div 
      className="min-h-screen relative flex flex-col items-center justify-center cursor-pointer group overflow-hidden bg-black"
      onClick={() => navigate('/select')}
    >
      <img 
        src={HOME_IMAGE} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] scale-100 group-hover:scale-110 opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
      
      <div className="relative z-10 text-center px-4 space-y-8">
        <div className="overflow-hidden">
          <h1 className="text-7xl md:text-9xl font-black text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] tracking-tighter transition-all duration-700 group-hover:tracking-normal animate-in slide-in-from-bottom-12">
            POKSHIN
          </h1>
        </div>
        <div className="h-[1px] w-12 bg-white/30 mx-auto transition-all duration-700 group-hover:w-48 group-hover:bg-white/60" />
        <p className="text-white/40 text-[10px] md:text-sm tracking-[0.8em] font-light uppercase animate-pulse">
          Click to enter archive
        </p>
      </div>
      
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <p className="text-white/10 text-[8px] uppercase tracking-[1em]">Infinite Memories</p>
      </div>
    </div>
  );
};

/**
 * Page: Category Selection
 */
const CategorySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center overflow-y-auto no-scrollbar py-12">
        <div className="max-w-5xl w-full mx-auto p-4 md:p-8">
          {/* 복구된 타이틀 섹션 (Select Domain 문구는 완전히 제거) */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase animate-in fade-in slide-in-from-top-4 duration-1000">
              POKSHIN ARCHIVE
            </h1>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
            {GROUPS.map((group) => {
              return (
                <div 
                  key={group.id}
                  onClick={() => navigate(`/archive/${group.id}`)}
                  className="relative aspect-square rounded-2xl md:rounded-[2.5rem] overflow-hidden cursor-pointer group transition-all active:scale-[0.97] bg-neutral-900 border border-white/5 hover:border-white/20 shadow-2xl"
                >
                  <img 
                    src={group.image} 
                    alt={group.id} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${group.color} opacity-30 mix-blend-overlay group-hover:opacity-20 transition-opacity`} />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <h3 className="text-2xl md:text-5xl font-black tracking-tighter uppercase text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:-translate-y-2">
                      {group.id}
                    </h3>
                    <p className="mt-2 text-[8px] md:text-[10px] tracking-[0.4em] text-white/60 uppercase opacity-0 group-hover:opacity-100 transition-all duration-500">
                      Archive
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

/**
 * Metadata Helpers
 */
const getCPList = (group: string) => {
  switch (group) {
    case 'ONEUS': return ['섷숀', '섷걶', '호학'];
    case 'ONF': return ['션윹'];
    case 'VERIVERY': return ['묭헌', '묭깡'];
    case 'P1HARMONY': return ['쫑테', '종쏠섭', '탁테', '웅양', '쏠키', '키즁'];
    default: return [];
  }
};

const getPenNames = (group: string) => {
  switch (group) {
    case 'ONEUS': return ['이백도', 'dawn'];
    case 'ONF': return ['이겨울'];
    case 'VERIVERY': return ['김리베'];
    case 'P1HARMONY': return ['모히또', '란'];
    default: return [];
  }
};

const GENRES = ['일상', '판타지', '신화', '재난', '시대물'];

const TEXT_COLORS = [
  '#000000', '#4B5563', '#9CA3AF', '#EF4444', '#F87171', '#B91C1C',
  '#F97316', '#FB923C', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
  '#16A34A', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6',
  '#1D4ED8', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
  '#F43F5E', '#BE185D', '#92400E', '#78350F', '#64748B', '#334155'
];

/**
 * Page: Post List
 */
const PostListPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { posts } = usePosts();
  
  const filteredPosts = useMemo(() => 
    posts.filter(p => p.groupId === groupId), 
  [posts, groupId]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f2f2f7] pb-24">
        <Header 
          title={`${groupId} Archive`} 
          showBack 
          onBack={() => navigate('/select')}
        />
        
        <div className="mx-auto w-full max-w-2xl md:max-w-5xl lg:max-w-6xl p-6 space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="py-32 text-center space-y-6">
              <div className="w-20 h-20 bg-neutral-200/50 rounded-full mx-auto flex items-center justify-center text-neutral-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 opacity-50">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <p className="text-neutral-400 font-light tracking-wide italic">No memories archived yet.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div 
                key={post.id}
                onClick={() => navigate(`/view/${post.id}`)}
                className="bg-white rounded-3xl p-6 shadow-sm active:scale-[0.98] transition-all cursor-pointer group relative overflow-hidden border border-neutral-100 hover:shadow-md"
              >
                {post.isAdult && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] px-4 py-1.5 font-black rounded-bl-2xl uppercase tracking-widest z-10 shadow-lg">
                    ADULT
                  </div>
                )}
                <div className="flex gap-5">
                  {post.imageUrl && (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-50 shadow-inner">
                      <img src={post.imageUrl} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xl font-bold group-hover:text-blue-600 transition-colors line-clamp-1 tracking-tight">{post.title}</h4>
                      </div>
                      <p className="text-[9px] text-neutral-400 font-bold tracking-[0.2em] uppercase">
                        {post.cp && <span className="text-neutral-600 mr-3">[{post.cp}]</span>}
                        {Array.isArray(post.genre) ? post.genre.join(' • ') : post.genre}
                      </p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400 font-medium">By</span>
                        <span className="text-xs font-semibold text-neutral-800 tracking-tight">{post.penName || 'Anonymous'}</span>
                      </div>
                      <span className="text-[10px] font-medium text-neutral-300 tabular-nums">{post.writingDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button 
          onClick={() => navigate(`/write/${groupId}`)}
          className="fixed bottom-10 right-8 w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all z-50 hover:bg-neutral-800 hover:-translate-y-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
        </button>
      </div>
    </PageTransition>
  );
};

/**
 * Page: Write Post
 */
const WritePage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { addPost } = usePosts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const cpOptions = useMemo(() => getCPList(groupId || ''), [groupId]);
  const penNameOptions = useMemo(() => getPenNames(groupId || ''), [groupId]);

  const [formData, setFormData] = useState({
    title: '',
    cp: cpOptions[0] || '',
    penName: penNameOptions[0] || '',
    writingDate: new Date().toISOString().split('T')[0],
    genre: [] as string[],
    isAdult: false,
    isCollab: false,
    collabName: '',
    content: '',
    imageUrl: ''
  });

  useEffect(() => {
    const savedDraft = localStorage.getItem(`${DRAFT_PREFIX}${groupId}`);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...parsed }));
        if (editorRef.current) {
          editorRef.current.innerHTML = parsed.content || '';
        }
      } catch (e) {
        console.error("Failed to load draft");
      }
    }
  }, [groupId]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleGenre = (g: string) => {
    setFormData(prev => {
      const alreadySelected = prev.genre.includes(g);
      return {
        ...prev,
        genre: alreadySelected 
          ? prev.genre.filter(item => item !== g) 
          : [...prev.genre, g]
      };
    });
  };

  const handleSave = () => {
    const htmlContent = editorRef.current?.innerHTML || '';
    if (!formData.title || !htmlContent || htmlContent === '<br>') {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    addPost({ 
      groupId: groupId as KPopGroup, 
      ...formData,
      content: htmlContent
    });
    localStorage.removeItem(`${DRAFT_PREFIX}${groupId}`);
    navigate(`/archive/${groupId}`);
  };

  const handleSaveDraft = () => {
    const htmlContent = editorRef.current?.innerHTML || '';
    const dataToSave = { ...formData, content: htmlContent };
    localStorage.setItem(`${DRAFT_PREFIX}${groupId}`, JSON.stringify(dataToSave));
    alert("임시 저장되었습니다.");
  };

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    if (command === 'foreColor') setShowColorPicker(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Header
  title="Archive Entry"
  showBack
  action={
    <div className="flex items-center gap-2">
      <button
        onClick={handleSaveDraft}
        className="bg-neutral-100 text-neutral-800 px-4 py-2.5 rounded-full font-bold text-xs active:scale-95 transition-all shadow whitespace-nowrap hover:bg-neutral-200"
      >
        DRAFT
      </button>

      <button
        onClick={handleSave}
        className="bg-black text-white px-6 py-2.5 rounded-full font-bold text-xs active:scale-95 transition-all shadow-xl whitespace-nowrap hover:bg-neutral-800"
      >
        SAVE
      </button>
    </div>
  }
/>

        
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="space-y-10 pb-48">
            <div className="relative">
              {formData.imageUrl ? (
                <div className="relative rounded-[2.5rem] overflow-hidden aspect-video group shadow-2xl border border-neutral-100">
                  <img src={formData.imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={() => updateField('imageUrl', '')}
                      className="bg-white/95 p-4 rounded-full shadow-2xl transition-transform active:scale-90"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-[2.5rem] border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-4 text-neutral-400 hover:bg-neutral-50 hover:border-neutral-300 transition-all group"
                >
                  <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6.75a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6.75v10.5a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Add Visual Asset</span>
                </button>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>

            <div className="space-y-8">
               <input 
                type="text" 
                placeholder="제목을 입력하세요"
                className="text-4xl font-black w-full border-none focus:ring-0 px-0 placeholder:text-neutral-100 tracking-tighter"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-6 bg-neutral-50/50 p-6 rounded-3xl border border-neutral-100">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black">Archive Domain</label>
                  <div className="w-full bg-white rounded-xl px-4 py-3 text-xs text-neutral-800 font-bold border border-neutral-100">{groupId}</div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black">CP / Pairing</label>
                  <select 
                    className="w-full bg-white rounded-xl px-4 py-3 text-xs border border-neutral-100 focus:ring-2 focus:ring-black/5 font-bold appearance-none cursor-pointer"
                    value={formData.cp}
                    onChange={(e) => updateField('cp', e.target.value)}
                  >
                    {cpOptions.map(cp => <option key={cp} value={cp}>{cp}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black">Pen Name</label>
                  {penNameOptions.length > 1 ? (
                    <select 
                      className="w-full bg-white rounded-xl px-4 py-3 text-xs border border-neutral-100 focus:ring-2 focus:ring-black/5 font-bold"
                      value={formData.penName}
                      onChange={(e) => updateField('penName', e.target.value)}
                    >
                      {penNameOptions.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                  ) : (
                    <div className="w-full bg-white rounded-xl px-4 py-3 text-xs text-neutral-800 font-bold border border-neutral-100">{formData.penName}</div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black">Timestamp</label>
                  <input 
                    type="date"
                    className="w-full bg-white rounded-xl px-4 py-3 text-xs border border-neutral-100 focus:ring-2 focus:ring-black/5 font-bold" 
                    value={formData.writingDate}
                    onChange={(e) => updateField('writingDate', e.target.value)}
                  />
                </div>
                <div className="col-span-2 space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black">Genre Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map(g => (
                      <button 
                        key={g} 
                        type="button" 
                        onClick={() => toggleGenre(g)} 
                        className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${formData.genre.includes(g) ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-white text-neutral-400 border-neutral-200 hover:border-neutral-400'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 pt-2">
                   <div className="flex items-center gap-8 px-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.isAdult ? 'bg-red-500 border-red-500' : 'border-neutral-200 group-hover:border-red-200'}`}>
                        {formData.isAdult && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                      </div>
                      <input type="checkbox" className="hidden" checked={formData.isAdult} onChange={(e) => updateField('isAdult', e.target.checked)} />
                      <span className="text-xs font-black uppercase tracking-widest text-red-500">ADULT CONTENT</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.isCollab ? 'bg-blue-600 border-blue-600' : 'border-neutral-200 group-hover:border-blue-200'}`}>
                        {formData.isCollab && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                      </div>
                      <input type="checkbox" className="hidden" checked={formData.isCollab} onChange={(e) => updateField('isCollab', e.target.checked)} />
                      <span className="text-xs font-black uppercase tracking-widest text-blue-600">COLLABORATION</span>
                    </label>
                  </div>
                </div>
              </div>
              {formData.isCollab && (
                <div className="space-y-1.5 animate-in slide-in-from-top duration-300">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black">Project Name</label>
                  <input placeholder="합작 명칭을 입력하세요" className="w-full bg-neutral-50 rounded-xl px-5 py-4 text-sm border-none focus:ring-2 focus:ring-black/5 font-medium" value={formData.collabName} onChange={(e) => updateField('collabName', e.target.value)} />
                </div>
              )}
            </div>

            <div 
              ref={editorRef}
              contentEditable
              data-placeholder="Start archiving your story..."
              className="w-full border-none focus:ring-0 px-0 text-xl leading-relaxed placeholder:text-neutral-100 outline-none font-light min-h-[500px] prose prose-neutral max-w-none"
              onInput={(e) => updateField('content', e.currentTarget.innerHTML)}
            />
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-neutral-100 safe-bottom">
            {showColorPicker && (
              <div className="bg-white p-6 border-b border-neutral-100 animate-in slide-in-from-bottom duration-300">
                <div className="grid grid-cols-10 gap-3 max-w-2xl mx-auto">
                  {TEXT_COLORS.map(color => (
                    <button key={color} onClick={() => execCommand('foreColor', color)} className="w-7 h-7 rounded-full border border-neutral-100 active:scale-90 transition-all hover:scale-110 shadow-sm" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-center gap-2 p-3 bg-neutral-50/30">
              <button onClick={() => execCommand('bold')} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-neutral-100 active:scale-90 transition-all"><span className="font-bold text-lg">B</span></button>
              <button onClick={() => execCommand('italic')} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-neutral-100 active:scale-90 transition-all"><span className="italic serif text-lg">I</span></button>
              <button onClick={() => execCommand('underline')} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-neutral-100 active:scale-90 transition-all"><span className="underline text-lg">U</span></button>
              <button onClick={() => setShowColorPicker(!showColorPicker)} className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl hover:bg-neutral-100 active:scale-90 transition-all ${showColorPicker ? 'bg-neutral-200' : ''}`}><span className="font-bold text-lg leading-none">A</span><div className="w-5 h-0.5 mt-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500" /></button>
              <div className="w-[1px] h-8 bg-neutral-200 mx-2" />
              <button onClick={() => execCommand('formatBlock', 'blockquote')} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-neutral-100 active:scale-90 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

/**
 * Page: View Post
 */
const ViewPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { posts, deletePost } = usePosts();
  const post = posts.find(p => p.id === postId);

  if (!post) return <div className="flex items-center justify-center min-h-screen">Entry not found</div>;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Header 
          title={post.groupId} 
          showBack 
          action={
            <button onClick={() => { if(confirm('삭제하시겠습니까?')) { deletePost(post.id); navigate(`/archive/${post.groupId}`); } }} className="text-neutral-300 hover:text-red-500 transition-colors p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          } 
        />
        <article className="mx-auto w-full max-w-2xl md:max-w-5xl lg:max-w-6xl p-6 pt-16 pb-32">
          {post.isAdult && <div className="inline-block bg-red-500 text-white text-[10px] px-4 py-1.5 font-black rounded-lg uppercase mb-6 shadow-xl">ADULT</div>}
          <h1 className="text-5xl md:text-6xl font-black mb-10 tracking-tighter leading-[1.1]">{post.title}</h1>
          <div className="flex flex-wrap gap-6 mb-12 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] border-y border-neutral-100 py-6">
             <div className="flex flex-col"><span className="text-neutral-300 font-medium mb-1">CP</span><span className="text-neutral-800">{post.cp}</span></div>
             <div className="flex flex-col"><span className="text-neutral-300 font-medium mb-1">Author</span><span className="text-neutral-800">{post.penName}</span></div>
             <div className="flex flex-col"><span className="text-neutral-300 font-medium mb-1">Date</span><span className="text-neutral-800 tabular-nums">{post.writingDate}</span></div>
          </div>
          {post.imageUrl && <img src={post.imageUrl} className="w-full rounded-[2.5rem] mb-12 shadow-2xl" />}
          <div className="prose prose-neutral max-w-none text-xl leading-[2] font-light text-neutral-800" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
    </PageTransition>
  );
};

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/select" element={<CategorySelectionPage />} />
      <Route path="/archive/:groupId" element={<PostListPage />} />
      <Route path="/write/:groupId" element={<WritePage />} />
      <Route path="/view/:postId" element={<ViewPostPage />} />
    </Routes>
  </Router>
);

export default App;
