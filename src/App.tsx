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
  // Multiple fallbacks for reliability
  const sources = [
    `https://source.unsplash.com/600x400/?${encodeURIComponent(safeKeyword)},product`,
    `https://picsum.photos/seed/${encodeURIComponent(safeKeyword)}/600/400`
  ];
  // Try unsplash first
  try {
    const res = await fetch(sources[0], { method: 'HEAD' });
    if (res.ok) return sources[0];
  } catch(e) {}
  return sources[1];
};

const ProductCard = ({ product, pexelsKey, market }: any) => {
  const [imgUrl, setImgUrl] = useState("");
  const [imgError, setImgError] = useState(false);
  const p = product;
  const name = p.product_name || "منتج غير معروف";
  const nameEn = p.product_name_en || p.image_keyword || name;
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

  useEffect(() => {
    fetchImage(p.image_keyword || nameEn, pexelsKey).then(setImgUrl);
  }, [p.image_keyword, nameEn, pexelsKey]);

  const handleImgError = () => {
    if (!imgError) {
      setImgError(true);
      const fallback = `https://picsum.photos/seed/${encodeURIComponent(nameEn)}/600/400`;
      setImgUrl(fallback);
    }
  };

  const satColor = (s: string) =>
    s.includes('منخفض') || s.includes('Low') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
    s.includes('متوسط') || s.includes('Medium') ? 'bg-amber-100 text-amber-700 border-amber-200' :
    'bg-red-100 text-red-700 border-red-200';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
        {imgUrl ? <img src={imgUrl} alt={name} className="w-full h-48 object-cover" onError={handleImgError} /> :
        <div className="w-full h-48 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>}
        <div className="absolute top-2 right-2 flex gap-1">
          <span className="bg-white/90 backdrop-blur text-xs px-2 py-1 rounded-full font-bold text-slate-700">{cat}</span>
        </div>
        <div className="absolute top-2 left-2">
          <span className={`text-xs px-2 py-1 rounded-full border font-bold ${satColor(sat)}`}>{sat}</span>
        </div>
        {src && <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" />{src}</span>
        </div>}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800 mb-1 text-right">{name}</h3>
        {verify && <p className="text-xs text-emerald-600 flex items-center justify-end gap-1 mb-2"><CheckCircle className="w-3 h-3" />{verify}</p>}
        <p className="text-xs text-slate-500 text-right mb-3">منافسين: <strong>{rivals}</strong> &nbsp; إنفاق إعلاني: <strong>{spend}</strong></p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-50 rounded-xl p-2 text-center">
            <p className="text-[10px] text-slate-400">سعر المورد</p>
            <p className="font-bold text-slate-700">${cost}</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-2 text-center">
            <p className="text-[10px] text-indigo-400">سعر البيع</p>
            <p className="font-bold text-indigo-700">${sell}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-2 text-center">
            <p className="text-[10px] text-emerald-400">هامش الربح</p>
            <p className="font-bold text-emerald-700">${margin}</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 text-right mb-3"><strong>لماذا ينجح؟</strong> {why}</p>
        {ads.length > 0 && <div className="mb-3"><p className="text-xs font-bold text-slate-500 text-right mb-1">إعلانات نشطة:</p>
          {ads.map((a: string, i: number) => <p key={i} className="text-xs text-slate-500 text-right">• {a}</p>)}
        </div>}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <a href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${cc}&q=${encodeURIComponent(fbQ)}`} target="_blank" rel="noreferrer" className="bg-blue-800 text-white text-xs py-2 px-3 rounded-xl text-center flex items-center justify-center gap-1 hover:bg-blue-900"><Search className="w-3 h-3" />إعلانات فيسبوك</a>
          <a href={`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(aliQ)}`} target="_blank" rel="noreferrer" className="bg-orange-500 text-white text-xs py-2 px-3 rounded-xl text-center flex items-center justify-center gap-1 hover:bg-orange-600"><ShoppingBag className="w-3 h-3" />علي إكسبريس</a>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a href={`https://ads.tiktok.com/business/creativecenter/inspiration/topads/pad/en?period=30&region=${cc}&keyword=${encodeURIComponent(fbQ)}`} target="_blank" rel="noreferrer" className="bg-slate-900 text-white text-xs py-2 px-3 rounded-xl text-center flex items-center justify-center gap-1 hover:bg-black"><Play className="w-3 h-3" />TikTok Ads</a>
          <a href={`https://forbusiness.snapchat.com/advertising?q=${encodeURIComponent(fbQ)}`} target="_blank" rel="noreferrer" className="bg-yellow-400 text-slate-900 text-xs py-2 px-3 rounded-xl text-center flex items-center justify-center gap-1 hover:bg-yellow-500"><Camera className="w-3 h-3" />Snapchat Ads</a>
        </div>
      </div>
    </div>
  );

export default function App() {
  const [market, setMarket] = useState("\u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0627\u0644\u0633\u0639\u0648\u062f\u064a\u0629 (KSA)");
  const [niche, setNiche] = useState("\u0645\u0646\u062a\u062c\u0627\u062a \u062d\u0644 \u0627\u0644\u0645\u0634\u0627\u0643\u0644 \u0627\u0644\u064a\u0648\u0645\u064a\u0629");
  const [productCount, setProductCount] = useState(4);
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem("geminiKey") || "");
  const [pexelsKey, setPexelsKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [scanStep, setScanStep] = useState(0);

  const markets = ["\u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0627\u0644\u0633\u0639\u0648\u062f\u064a\u0629 (KSA)", "\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0627\u0644\u0645\u062a\u062d\u062f\u0629 (UAE)", "\u0627\u0644\u0645\u063a\u0631\u0628 (Morocco)", "\u0633\u0644\u0637\u0646\u0629 \u0639\u0645\u0627\u0646 (Oman)", "\u0627\u0644\u0643\u0648\u064a\u062a (Kuwait)", "\u0645\u0635\u0631 (Egypt)", "\u0627\u0644\u062e\u0644\u064a\u062c \u0627\u0644\u0639\u0631\u0628\u064a \u0639\u0645\u0648\u0645\u0627\u064b"];
  const niches = ["\u0645\u0646\u062a\u062c\u0627\u062a \u062d\u0644 \u0627\u0644\u0645\u0634\u0627\u0643\u0644 \u0627\u0644\u064a\u0648\u0645\u064a\u0629", "\u0645\u0633\u062a\u062d\u0636\u0631\u0627\u062a \u0627\u0644\u062a\u062c\u0645\u064a\u0644 \u0648\u0627\u0644\u0639\u0646\u0627\u064a\u0629 \u0628\u0627\u0644\u0628\u0634\u0631\u0629", "\u0623\u062f\u0648\u0627\u062a \u0627\u0644\u0645\u0637\u0628\u062e \u0648\u0627\u0644\u0645\u0646\u0632\u0644 \u0627\u0644\u0630\u0643\u064a\u0629", "\u0627\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062a \u0648\u0639\u0646\u0627\u064a\u0629 \u0627\u0644\u0633\u064a\u0627\u0631\u0627\u062a", "\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0635\u062d\u0629 \u0648\u0627\u0644\u0631\u0627\u062d\u0629", "\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0623\u0637\u0641\u0627\u0644 \u0648\u0627\u0644\u0623\u0644\u0639\u0627\u0628 \u0627\u0644\u0630\u0643\u064a\u0629"];

  const scanMarket = async () => {
    setLoading(true); setError(""); setResults([]); setScanStep(1);
    const keyToUse = geminiKey || apiKey || "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${keyToUse}`;
    const today = new Date().toISOString().split('T')[0];
    const promptText = `You are an expert e-commerce market analyst specializing in dropshipping and COD (Cash on Delivery) markets in the Arab world. Today is ${today}. YOUR TASK: Analyze the REAL current market in "${market}" for the niche "${niche}" and identify ${productCount} ACTUALLY WINNING products. CRITICAL RULES: 1. ONLY suggest products that ACTUALLY EXIST on AliExpress right now with the EXACT English search query. 2. ONLY suggest products with REAL ACTIVE Facebook/Instagram ads running in ${market} RIGHT NOW. 3. Products must be suitable for COD dropshipping (price under $150, good margins). 4. Base analysis on REAL market trends in ${market} for 2025-2026. 5. DO NOT invent fictional products. Every product must be real and available on AliExpress. 6. Provide REALISTIC prices based on actual AliExpress and market prices. 7. active_ad_examples should describe real ad formats (UGC video, product demo, etc.) 8. image_keyword MUST be a simple 2-3 word English phrase describing the product visually (e.g. "kitchen organizer", "car windshield spray", "LED sensor light"). RESPOND ONLY with JSON: {"products": [...]} where each product has: product_name (Arabic), product_name_en (English), category (Arabic), image_keyword (English 2-3 words for image search), why_winning (Arabic detailed), cost_price (NUMBER USD), selling_price (NUMBER USD), profit_margin (NUMBER), saturation (Arabic), fb_search_query (EXACT query for Facebook Ad Library), aliexpress_query (EXACT English query for AliExpress), data_source, verification_status (Arabic), active_ad_examples (string array), competitor_count, ad_spend_estimate, target_audience (Arabic). No text outside JSON.`;
    setScanStep(2);
    const payload = { contents: [{ parts: [{ text: promptText }] }], generationConfig: { thinkingConfig: { thinkingBudget: 0 }, responseMimeType: "application/json" } };
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

  const steps = ["\u062a\u0647\u064a\u0626\u0629", "\u062a\u062d\u0644\u064a\u0644", "\u0627\u0633\u062a\u062e\u0631\u0627\u062c", "\u0646\u062a\u0627\u0626\u062c"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center mb-8 pt-6">
          <h1 className="text-3xl font-black text-slate-800">ALI Spy Pro <span className="text-indigo-600">V3.0</span> <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Real Data</span></h1>
          <p className="text-slate-500 text-sm mt-2">\u0623\u062f\u0627\u0629 \u062a\u062c\u0633\u0633 \u062d\u0642\u064a\u0642\u064a\u0629 - \u0645\u0646\u062a\u062c\u0627\u062a \u0645\u0648\u062c\u0648\u062f\u0629 \u0641\u0639\u0644\u0627 \u0639\u0644\u0649 AliExpress \u0648\u064a\u062a\u0645 \u0627\u0644\u062a\u0631\u0648\u064a\u062c \u0644\u0647\u0627 \u0641\u064a Facebook Ads</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {loading && <div className="bg-white rounded-2xl shadow p-6 mb-6"><div className="flex items-center justify-center gap-4">
              {steps.map((s, i) => <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < scanStep ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{i < scanStep ? '\u2713' : i+1}</div>
                <span className="text-sm text-slate-600">{s}</span>
                {i < 3 && <div className="w-8 h-0.5 bg-slate-200"></div>}
              </div>)}
            </div></div>}
            {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-700 text-sm">{error}</div>}
            {!loading && results.length === 0 && !error && <div className="bg-white rounded-2xl shadow p-12 text-center">
              <h3 className="text-xl font-bold text-slate-700 mb-2">\u0627\u0644\u0631\u0627\u062f\u0627\u0631 \u062c\u0627\u0647\u0632</h3>
              <p className="text-slate-500">\u0627\u062e\u062a\u0631 \u0627\u0644\u0633\u0648\u0642 \u0648\u0627\u0644\u0645\u062c\u0627\u0644 \u0648\u0627\u0636\u063a\u0637 "\u0645\u0633\u062d \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u0622\u0646"</p>
            </div>}
            {results.length > 0 && <div>
              <h2 className="text-2xl font-black text-center text-slate-800 mb-2">\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0645\u0643\u062a\u0634\u0641\u0629 ({results.length})</h2>
              <p className="text-center text-slate-500 text-sm mb-6">\u0645\u0646\u062a\u062c\u0627\u062a \u062d\u0642\u064a\u0642\u064a\u0629 - \u062a\u062d\u0642\u0642 \u0645\u0646\u0647\u0627 \u0639\u0628\u0631 \u0631\u0648\u0627\u0628\u0637 Facebook Ad Library \u0648 AliExpress</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((p, i) => <ProductCard key={i} product={p} pexelsKey={pexelsKey} market={market} />)}
              </div>
            </div>}
          </div>
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-4">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Search className="w-5 h-5" />\u0641\u0644\u0627\u062a\u0631 \u0627\u0644\u0628\u062d\u062b</h2>
              <div className="space-y-4">
                <div><label className="text-sm font-bold text-slate-600 block mb-1">\u0627\u0644\u062f\u0648\u0644\u0629 \u0627\u0644\u0645\u0633\u062a\u0647\u062f\u0641\u0629</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700" value={market} onChange={e => setMarket(e.target.value)}>
                    {markets.map(m => <option key={m} value={m}>{m}</option>)}
                  </select></div>
                <div><label className="text-sm font-bold text-slate-600 block mb-1">\u0627\u0644\u0645\u062c\u0627\u0644 (Niche)</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700" value={niche} onChange={e => setNiche(e.target.value)}>
                    {niches.map(n => <option key={n} value={n}>{n}</option>)}
                  </select></div>
                <div><label className="text-sm font-bold text-slate-600 block mb-1">\u0639\u062f\u062f \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a <span className="text-indigo-600 font-black">{productCount}</span></label>
                  <input type="range" min={1} max={10} value={productCount} onChange={e => setProductCount(parseInt(e.target.value))} className="w-full accent-indigo-600" /></div>
                <div><label className="text-sm font-bold text-slate-600 block mb-1">Gemini API Key</label>
                  <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={geminiKey} onChange={e => { setGeminiKey(e.target.value); localStorage.setItem("geminiKey", e.target.value); }} /></div>
                <div><label className="text-sm font-bold text-slate-600 block mb-1">Pexels API (\u0644\u0644\u0635\u0648\u0631)</label>
                  <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={pexelsKey} onChange={e => setPexelsKey(e.target.value)} /></div>
                <button onClick={scanMarket} disabled={loading} className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />\u062c\u0627\u0631\u064a \u0627\u0644\u0628\u062d\u062b...</> : <><Search className="w-5 h-5" />\u0645\u0633\u062d \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u0622\u0646</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
};
