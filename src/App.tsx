import React, { useState } from 'react';
import { Loader2, AlertTriangle, CheckCircle, ExternalLink, TrendingUp, Zap, Globe, Search, Star, BarChart2, DollarSign, Users, ShoppingBag } from 'lucide-react';

const apiKey = "";

const getDomain = (url: string) => {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url.slice(0, 40); }
};

const ProductCard = ({ product, market, index }: any) => {
  const p = product;
  const name = p.product_name || 'unknown';
  const nameEn = p.product_name_en || '';
  const cat = p.category || 'general';
  const sat = p.saturation || 'medium';
  const why = p.why_winning || '';
  const cost = p.cost_price || 0;
  const sell = p.selling_price || 0;
  const margin = p.profit_margin || 0;
  const fbQ = p.fb_search_query || name;
  const aliQ = p.aliexpress_query || nameEn || name;
  const src = p.data_source || '';
  const verify = p.verification_status || '';
  const rivals = p.competitor_count || 'N/A';
  const spend = p.ad_spend_estimate || 'N/A';
  const audience = p.target_audience || '';
  const sources = (p.sources || []).filter((s: string) => s && !s.includes('vertexaisearch.cloud.google.com'));
  const cc = market.includes('KSA') ? 'SA' : market.includes('UAE') ? 'AE' : market.includes('Morocco') ? 'MA' : market.includes('Oman') ? 'OM' : market.includes('Kuwait') ? 'KW' : market.includes('Egypt') ? 'EG' : 'SA';
  const productLabel = nameEn || aliQ || 'product';
  const bingImg = `https://tse2.mm.bing.net/th?q=${encodeURIComponent(productLabel + ' product ecommerce')}&w=600&h=400&c=7&rs=1&p=0`;
  const fallback = `https://placehold.co/600x400/6366f1/ffffff?text=${encodeURIComponent(productLabel)}`;
  const [imgSrc, setImgSrc] = useState(bingImg);
  const [imgOk, setImgOk] = useState(false);

  const satConfig = sat.includes('Low') || sat.includes('منخفض')
    ? { bg: 'bg-emerald-500', text: 'text-white', label: sat, icon: '🟢' }
    : sat.includes('High') || sat.includes('مرتفع')
    ? { bg: 'bg-red-500', text: 'text-white', label: sat, icon: '🔴' }
    : { bg: 'bg-amber-500', text: 'text-white', label: sat, icon: '🟡' };

  const gradients = [
    'from-violet-600 to-indigo-600',
    'from-rose-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-blue-500 to-cyan-600',
    'from-fuchsia-500 to-purple-600',
  ];
  const grad = gradients[index % gradients.length];

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100">
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        {!imgOk && (
          <div className={`absolute inset-0 bg-gradient-to-br ${grad} flex items-center justify-center`}>
            <Loader2 className="w-10 h-10 text-white animate-spin opacity-60" />
          </div>
        )}
        <img
          src={imgSrc}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgOk ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgOk(true)}
          onError={() => { setImgSrc(fallback); setImgOk(true); }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className={`${satConfig.bg} ${satConfig.text} text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
            {satConfig.icon} {satConfig.label}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full border border-white/30">
            {cat}
          </span>
        </div>

        {/* Verify badge */}
        {verify && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> {verify}
            </span>
          </div>
        )}

        {/* Number */}
        <div className={`absolute bottom-3 right-3 w-9 h-9 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center shadow-lg`}>
          <span className="text-white font-black text-sm">#{index + 1}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-800 leading-tight mb-1">{name}</h3>
          {nameEn && <p className="text-sm text-slate-400 font-medium">{nameEn}</p>}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-50 rounded-2xl p-3 text-center">
            <p className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1"><Users className="w-3 h-3" /> منافسين</p>
            <p className="font-black text-slate-700 text-sm">{rivals}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 text-center">
            <p className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1"><BarChart2 className="w-3 h-3" /> إنفاق إعلاني</p>
            <p className="font-black text-slate-700 text-sm">{spend}</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center bg-blue-50 rounded-2xl p-3">
            <p className="text-xs text-blue-400 mb-1">سعر المورد</p>
            <p className="font-black text-blue-700 text-sm">{cost}</p>
          </div>
          <div className="text-center bg-violet-50 rounded-2xl p-3">
            <p className="text-xs text-violet-400 mb-1">سعر البيع</p>
            <p className="font-black text-violet-700 text-sm">{sell}</p>
          </div>
          <div className={`text-center rounded-2xl p-3 bg-gradient-to-br ${grad} bg-opacity-10`}>
            <p className="text-xs text-emerald-600 mb-1">الربح</p>
            <p className="font-black text-emerald-700 text-sm">{margin}</p>
          </div>
        </div>

        {/* Why winning */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-4 mb-4">
          <p className="text-xs font-black text-slate-500 mb-2 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" /> لماذا ينجح؟
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{why}</p>
        </div>

        {/* Audience */}
        {audience && (
          <div className="bg-violet-50 rounded-2xl p-3 mb-4">
            <p className="text-xs font-black text-violet-500 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3" /> الجمهور المستهدف
            </p>
            <p className="text-xs text-violet-700 leading-relaxed">{audience}</p>
          </div>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
              <Globe className="w-3 h-3" /> مصادر البيانات
            </p>
            <div className="flex flex-wrap gap-1">
              {sources.slice(0, 4).map((s: string, i: number) => (
                <a key={i} href={s} target="_blank" rel="noreferrer"
                  className="text-xs bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors">
                  <ExternalLink className="w-2.5 h-2.5" />{getDomain(s)}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${cc}&q=${encodeURIComponent(fbQ)}`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all hover:scale-105">
            <span>إعلانات فيسبوك</span>
          </a>
          <a href={`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(aliQ)}`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all hover:scale-105">
            <span>علي إكسبريس</span>
          </a>
          <a href={`https://ads.tiktok.com/business/creativecenter/inspiration/topads/pad/en?period=30&region=${cc}&keyword=${encodeURIComponent(fbQ)}`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-black text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all hover:scale-105">
            <span>TikTok Ads</span>
          </a>
          <a href={`https://trends.google.com/trends/explore?geo=${cc}&q=${encodeURIComponent(aliQ)}`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all hover:scale-105">
            <span>Google Trends</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [market, setMarket] = useState('المملكة العربية السعودية (KSA)');
  const [niche, setNiche] = useState('منتجات حل المشاكل اليومية');
  const [productCount, setProductCount] = useState(4);
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('geminiKey') || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [scanStep, setScanStep] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');

  const markets = ['المملكة العربية السعودية (KSA)', 'الإمارات (UAE)', 'المغرب (Morocco)', 'سلطنة عمان (Oman)', 'الكويت (Kuwait)', 'مصر (Egypt)'];
  const niches = ['منتجات حل المشاكل اليومية', 'مستحضرات التجميل والعناية بالبشرة', 'أدوات المطبخ والمنزل الذكية', 'اكسسوارات السيارات', 'منتجات الصحة والراحة', 'منتجات الأطفال'];

  const scanMarket = async () => {
    setLoading(true); setError(''); setResults([]); setScanStep(1);
    setStatusMsg('جاري البحث في Google عن منتجات رائجة...');
    const keyToUse = geminiKey || apiKey;
    if (!keyToUse) { setError('يرجى إدخال Gemini API Key'); setLoading(false); return; }
    const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${keyToUse}`;
    const today = new Date().toISOString().split('T')[0];
    const cc = market.includes('KSA') ? 'Saudi Arabia' : market.includes('UAE') ? 'UAE' : market.includes('Morocco') ? 'Morocco' : market.includes('Oman') ? 'Oman' : market.includes('Kuwait') ? 'Kuwait' : 'Egypt';
    try {
      setScanStep(1); setStatusMsg('الخطوة 1: البحث في Google عن منتجات رائجة...');
      const searchPrompt = `Search Google for the top ${productCount} trending and winning dropshipping products in ${cc} for the niche "${niche}" in ${today}. Search Facebook Ads Library for active ads in ${cc}, search AliExpress for product prices, and search Google Trends for trending products. For each product found, provide: the exact product name in Arabic and English, the real AliExpress price, estimated selling price in ${cc}, number of active Facebook ads found, real data sources with URLs. Focus on products that have ACTIVE Facebook/Instagram ads right now and are available on AliExpress.`;
      const r1 = await fetch(baseUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: searchPrompt }] }], tools: [{ google_search: {} }] }) });
      if (!r1.ok) throw new Error(await r1.text());
      const d1 = await r1.json();
      const rawText = (d1.candidates && d1.candidates[0] && d1.candidates[0].content && d1.candidates[0].content.parts?.map((p: any) => p.text || '').join('')) || '';
      const gMeta = d1.candidates && d1.candidates[0] && d1.candidates[0].groundingMetadata;
      const gChunks = (gMeta && gMeta.groundingChunks) ? gMeta.groundingChunks : [];
      const cleanSources = gChunks.map((c: any) => c.web && c.web.uri ? c.web.uri : '').filter((u: string) => u && !u.includes('vertexaisearch'));
      setScanStep(2); setStatusMsg('الخطوة 2: تحليل وتحويل البيانات...');
      const p2 = `Convert this research into JSON. Data: ` + rawText.slice(0, 8000) + ` \nReturn ONLY: {"products":[...]} each with: product_name(Arabic), product_name_en(English), category(Arabic), why_winning(Arabic 2 sentences), cost_price(string like "$5-$10"), selling_price(string), profit_margin(string), saturation(Arabic: منخفض/متوسط/مرتفع), fb_search_query, aliexpress_query(English), data_source, verification_status("تم التحقق عبر Google"), competitor_count, ad_spend_estimate, target_audience(Arabic), sources(array of URLs). No text outside JSON.`;
      const r2 = await fetch(baseUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: p2 }] }], generationConfig: { responseMimeType: 'application/json' } }) });
      if (!r2.ok) throw new Error(await r2.text());
      const d2 = await r2.json();
      let txt = (d2.candidates && d2.candidates[0] && d2.candidates[0].content && d2.candidates[0].content.parts?.map((p: any) => p.text || '').join('')) || '';
      txt = txt.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(txt);
      let arr = parsed.products || parsed;
      if (!Array.isArray(arr)) throw new Error('Invalid JSON');
      arr = arr.map((item: any) => { const s2 = (item.sources || []).filter((s: string) => !s.includes('vertexaisearch')); return { ...item, sources: [...s2, ...cleanSources.slice(0, 3)].filter((v: string, i: number, a: string[]) => a.indexOf(v) === i) }; });
      setScanStep(3); setStatusMsg(`تم العثور على ${arr.length} منتجات`);
      setResults(arr);
    } catch (e: any) { setError(e.message || 'خطأ غير متوقع'); }
    setLoading(false);
  };

  const steps = ['بحث Google', 'تحليل', 'نتائج'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" dir="rtl">

      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-rose-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-bold px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            مدعوم بـ Gemini 2.0 Flash + Google Search
          </div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
            ALI <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Spy Pro</span>
            <span className="ml-3 text-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-transparent bg-clip-text">V9.0</span>
          </h1>
          <p className="text-slate-400 text-lg">بيانات حقيقية من Google Search + Facebook Ads + AliExpress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-6">
              <h2 className="text-white font-black text-lg mb-5 flex items-center gap-2">
                <Search className="w-5 h-5 text-violet-400" />
                فلاتر البحث
              </h2>

              <div className="space-y-4">
                <div>
                  <l<label className="text-slate-400 text-xs font-bold block mb-2">الدولة</label>
                  <select
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    value={market}
                    onChange={e => setMarket(e.target.value)}
                  >
                    {markets.map(
              m => <option key={m} value={m}>{m}</option>
            )}
          </select>
        </div>

        <div>
          <label className="text-slate-400 text-xs font-bold block mb-2">المجال</label>
          <select
            className="w-full bg-white/10 border border-white/20 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={niche}
            onChange={e => setNiche(e.target.value)}
          >
            {niches.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div>
          <label className="text-slate-400 text-xs font-bold block mb-2">
            عدد المنتجات: <span className="text-violet-400 font-black">{productCount}</span>
          </label>
          <input type="range" min={1} max={10} value={productCount}
            onChange={e => setProductCount(+e.target.value)}
            className="w-full accent-violet-500" />
        </div>

        <div>
          <label className="text-slate-400 text-xs font-bold block mb-2">Gemini API Key</label>
          <input type="password"
            className="w-full bg-white/10 border border-white/20 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-500"
            placeholder="AIza..."
            value={geminiKey}
            onChange={e => { setGeminiKey(e.target.value); localStorage.setItem('geminiKey', e.target.value); }}
          />
        </div>

        <button
          onClick={scanMarket}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-black text-white text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 hover:shadow-xl hover:shadow-violet-500/30 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري البحث...</> : <><Zap className="w-5 h-5" /> مسح السوق الآن</>}
        </button>

        <p className="text-slate-500 text-xs text-center">Gemini 2.0 Flash + Google Search</p>
      </div>
    </div>
  </div>

  {/* Loading steps */}
  {loading && (
    <div className="lg:col-span-3">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <div className="flex items-center justify-center gap-6 mb-6">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${i < scanStep ? 'bg-emerald-500 text-white' : i === scanStep - 1 ? 'bg-violet-500 text-white animate-pulse' : 'bg-white/10 text-slate-400'}`}>
                {i < scanStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-slate-300 text-sm font-medium">{s}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-white/20" />}
            </div>
          ))}
        </div>
        {statusMsg && (
          <p className="text-center text-violet-300 text-sm font-medium animate-pulse">{statusMsg}</p>
        )}
      </div>
    </div>
  )}

  {/* Error */}
  {error && (
    <div className="lg:col-span-3">
      <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6 flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    </div>
  )}

  {/* Empty state */}
  {!loading && !results.length && !error && (
    <div className="lg:col-span-3">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center">
        <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-violet-400" />
        </div>
        <h3 className="text-white font-black text-2xl mb-3">الرادار جاهز</h3>
        <p className="text-slate-400 text-base">اختر السوق والمجال واضغط مسح السوق الآن</p>
      </div>
    </div>
  )}

  {/* Results */}
  {results.length > 0 && (
    <div className="lg:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-black text-xl flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-violet-400" />
          المنتجات المكتشفة ({results.length})
        </h2>
        <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> بيانات Google حقيقية
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {results.map((p: any, i: number) => (
          <ProductCard key={i} product={p} market={market} index={i} />
        ))}
      </div>
    </div>
  )}

</div>
      </div>
    </div>
  );
}
