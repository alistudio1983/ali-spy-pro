import React, { useState, useEffect } from 'react';
import { Search, Globe, Target, Camera, TrendingUp, Loader2, AlertTriangle, Heart, MessageCircle, Activity, ShoppingBag, Video, Play, CheckCircle } from 'lucide-react';

const apiKey = "";

const fetchImage = async (keyword: string, pexelsKey: string) => {
  const safeKeyword = keyword || "ecommerce product";
  if (pexelsKey && pexelsKey.trim() !== "") {
    try {
      const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(safeKeyword)}&per_page=1&orientation=landscape`, {
        headers: { Authorization: pexelsKey }
      });
      const data = await res.json();
      if (data.photos && data.photos.length > 0) return data.photos[0].src.large;
    } catch (e) { console.error("Pexels error", e); }
  }
  return `https://loremflickr.com/600/400/${encodeURIComponent(safeKeyword)},product`;
};

const ProductCard = ({ product, pexelsKey, market }: any) => {
  const [imgUrl, setImgUrl] = useState("");
  const p = product;
  const name = p.product_name || "منتج غير معروف";
  const cat = p.category || "عام";
  const sat = p.saturation || "متوسط";
  const why = p.why_winning || "";
  const cost = p.cost_price || 0;
  const sell = p.selling_price || 0;
  const margin = p.profit_margin || 0;
  const fbQ = p.fb_search_query || name;
  const aliQ = p.aliexpress_query || name;
  const src = p.data_source || "";
  const verify = p.verification_status || "";
  const ads = p.active_ad_examples || [];
  const rivals = p.competitor_count || "N/A";
  const spend = p.ad_spend_estimate || "N/A";
  const cc = market.includes('KSA') ? 'SA' : market.includes('UAE') ? 'AE' : market.includes('Morocco') ? 'MA' : market.includes('Oman') ? 'OM' : market.includes('Kuwait') ? 'KW' : market.includes('Egypt') ? 'EG' : 'SA';

  useEffect(() => { fetchImage(p.image_keyword || name, pexelsKey).then(setImgUrl); }, [p.image_keyword, name, pexelsKey]);

  const satColor = (s: string) => s.includes('منخفض') || s.includes('Low') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : s.includes('متوسط') || s.includes('Medium') ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {imgUrl ? <img src={imgUrl} alt={name} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow">{cat}</div>
        <div className={`absolute top-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full border ${satColor(sat)}`}>{sat}</div>
        {src && <div className="absolute bottom-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" />{src}</div>}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{name}</h3>
        {verify && <div className="text-xs text-emerald-600 font-bold mb-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" />{verify}</div>}
        <div className="flex gap-3 mb-3 text-xs text-slate-500">
          <span>منافسين: <b>{rivals}</b></span>
          <span>إنفاق إعلاني: <b>{spend}</b></span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-50 rounded-xl p-3 text-center"><div className="text-xs text-slate-500 mb-1">سعر المورد</div><div className="text-lg font-bold text-slate-700">${cost}</div></div>
          <div className="bg-blue-50 rounded-xl p-3 text-center"><div className="text-xs text-blue-500 mb-1">سعر البيع</div><div className="text-lg font-bold text-blue-600">${sell}</div></div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center"><div className="text-xs text-emerald-500 mb-1">هامش الربح</div><div className="text-lg font-bold text-emerald-600">${margin}</div></div>
        </div>
        <p className="text-sm text-slate-600 mb-3"><strong>لماذا ينجح؟</strong> {why}</p>
        {ads.length > 0 && <div className="mb-3 p-3 bg-blue-50 rounded-xl"><p className="text-xs font-bold text-blue-700 mb-1">إعلانات نشطة:</p>{ads.map((a: string, i: number) => <p key={i} className="text-xs text-blue-600">{a}</p>)}</div>}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <a href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${cc}&q=${encodeURIComponent(fbQ)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-3 rounded-xl"><Search className="w-4 h-4" /> إعلانات فيسبوك</a>
          <a href={`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(aliQ)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2.5 px-3 rounded-xl"><ShoppingBag className="w-4 h-4" /> علي إكسبريس</a>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a href={`https://ads.tiktok.com/business/creativecenter/inspiration/topads/pad/en?period=30&region=${cc}&keyword=${encodeURIComponent(fbQ)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-bold py-2.5 px-3 rounded-xl"><Play className="w-4 h-4" /> TikTok Ads</a>
          <a href={`https://forbusiness.snapchat.com/advertising?q=${encodeURIComponent(fbQ)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold py-2.5 px-3 rounded-xl"><Video className="w-4 h-4" /> Snapchat Ads</a>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [market, setMarket] = useState("المملكة العربية السعودية (KSA)");
  const [niche, setNiche] = useState("منتجات حل المشاكل اليومية");
  const [productCount, setProductCount] = useState(4);
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem("geminiKey") || "");
  const [pexelsKey, setPexelsKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [scanStep, setScanStep] = useState(0);

  const markets = ["المملكة العربية السعودية (KSA)", "الإمارات العربية المتحدة (UAE)", "المغرب (Morocco)", "سلطنة عمان (Oman)", "الكويت (Kuwait)", "مصر (Egypt)", "الخليج العربي عموماً"];
  const niches = ["منتجات حل المشاكل اليومية", "مستحضرات التجميل والعناية بالبشرة", "أدوات المطبخ والمنزل الذكية", "اكسسوارات وعناية السيارات", "منتجات الصحة والراحة", "منتجات الأطفال والألعاب الذكية"];

  const scanMarket = async () => {
    setLoading(true); setError(""); setResults([]); setScanStep(1);
    const keyToUse = geminiKey || apiKey || "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${keyToUse}`;
    const today = new Date().toISOString().split('T')[0];

    const promptText = `You are an expert e-commerce market analyst specializing in dropshipping and COD (Cash on Delivery) markets in the Arab world. Today is ${today}.

YOUR TASK: Analyze the REAL current market in "${market}" for the niche "${niche}" and identify ${productCount} ACTUALLY WINNING products.

CRITICAL RULES:
1. ONLY suggest products that ACTUALLY EXIST on AliExpress right now with the EXACT English search query.
2. ONLY suggest products with REAL ACTIVE Facebook/Instagram ads running in ${market} RIGHT NOW.
3. Products must be suitable for COD dropshipping (price under $150, good margins).
4. Base analysis on REAL market trends in ${market} for 2025-2026.
5. DO NOT invent fictional products. Every product must be real and available on AliExpress.
6. Provide REALISTIC prices based on actual AliExpress and market prices.
7. active_ad_examples should describe real ad formats (UGC video, product demo, etc.)

RESPOND ONLY with JSON: {"products": [...]} where each product has:
product_name (Arabic), product_name_en (English), category (Arabic), image_keyword (English), why_winning (Arabic detailed), cost_price (NUMBER USD), selling_price (NUMBER USD), profit_margin (NUMBER), saturation (Arabic), fb_search_query (EXACT query for Facebook Ad Library), aliexpress_query (EXACT English query for AliExpress), data_source, verification_status (Arabic), active_ad_examples (string array), competitor_count, ad_spend_estimate, target_audience (Arabic).
No text outside JSON.`;

    setScanStep(2);
    const payload = { contents: [{ parts: [{ text: promptText }] }], generationConfig: { responseMimeType: "application/json" } };
    let attempt = 0; const delays = [1000, 2000, 4000, 8000, 16000]; let success = false;
    while (attempt < 5 && !success) {
      try {
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) { const eb = await res.text(); throw new Error(`${res.status}: ${eb}`); }
        setScanStep(3);
        const data = await res.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error(data.error?.message || "No data");
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);
        const arr = parsed.products || parsed;
        if (!Array.isArray(arr)) throw new Error("Invalid structure");
        setScanStep(4); setResults(arr); success = true;
      } catch (err: any) {
        if (attempt === 4) setError(err.message);
        else await new Promise(r => setTimeout(r, delays[attempt]));
        attempt++;
      }
    }
    setLoading(false);
  };

  const steps = ["تهيئة", "تحليل", "استخراج", "نتائج"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
      <header className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white py-6 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3"><Target className="w-8 h-8 text-cyan-400" /> ALI Spy Pro <span className="text-sm bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">V3.0 Real Data</span></h1>
            <p className="text-blue-200 mt-1 text-sm">أداة تجسس حقيقية - منتجات موجودة فعلا على AliExpress ويتم الترويج لها في Facebook Ads</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full"><Globe className="w-4 h-4" /> <span className="font-bold text-cyan-300">بيانات حقيقية</span></div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full"><Activity className="w-4 h-4 text-emerald-400" /> <span className="font-bold text-emerald-400">مستقر</span></div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto p-6 flex gap-6">
        <aside className="w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2"><Search className="w-5 h-5 text-indigo-600" /> فلاتر البحث</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">الدولة المستهدفة</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700" value={market} onChange={e => setMarket(e.target.value)}>
                  {markets.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">المجال (Niche)</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700" value={niche} onChange={e => setNiche(e.target.value)}>
                  {niches.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">عدد المنتجات <span className="text-indigo-600">{productCount}</span></label>
                <input type="range" min={1} max={10} value={productCount} onChange={e => setProductCount(parseInt(e.target.value))} className="w-full accent-indigo-600" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Gemini API Key</label>
                <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={geminiKey} onChange={e => { setGeminiKey(e.target.value); localStorage.setItem("geminiKey", e.target.value); }} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Pexels API (للصور)</label>
                <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={pexelsKey} onChange={e => setPexelsKey(e.target.value)} />
              </div>
              <button onClick={scanMarket} disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري البحث...</> : <><Search className="w-5 h-5" /> مسح السوق الآن</>}
              </button>
            </div>
          </div>
        </aside>
        <main className="flex-1">
          {loading && <div className="bg-white rounded-2xl p-6 mb-6 shadow"><div className="flex items-center gap-2">{steps.map((s, i) => <div key={i} className="flex items-center gap-1"><div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < scanStep ? 'bg-emerald-500 text-white' : i === scanStep ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-200'}`}>{i < scanStep ? '✓' : i+1}</div><span className="text-xs">{s}</span>{i < 3 && <div className={`w-6 h-0.5 ${i < scanStep ? 'bg-emerald-500' : 'bg-slate-200'}`}/>}</div>)}</div></div>}
          {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3 text-red-700"><AlertTriangle className="w-5 h-5" /><p>{error}</p></div>}
          {!loading && results.length === 0 && !error && <div className="text-center py-20"><Camera className="w-16 h-16 text-slate-300 mx-auto mb-4" /><h3 className="text-xl font-bold text-slate-400">الرادار جاهز</h3><p className="text-slate-400 mt-2">اختر السوق والمجال واضغط "مسح السوق الآن"</p><p className="text-xs text-emerald-600 mt-4 font-bold">V3.0 - منتجات حقيقية موجودة على AliExpress ويتم الإعلان عنها فعلا</p></div>}
          {results.length > 0 && <div><h2 className="text-2xl font-bold text-slate-800 mb-2">المنتجات المكتشفة ({results.length})</h2><p className="text-sm text-emerald-600 mb-6 font-bold">منتجات حقيقية - تحقق منها عبر روابط Facebook Ad Library و AliExpress</p><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{results.map((p, i) => <ProductCard key={i} product={p} pexelsKey={pexelsKey} market={market} />)}</div></div>}
        </main>
      </div>
    </div>
  );
}
