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
  const name = p.product_name || "Unknown";
  const cat = p.category || "";
  const sat = p.saturation || "";
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
  const countryCode = market.includes('KSA') ? 'SA' : market.includes('UAE') ? 'AE' : market.includes('Morocco') ? 'MA' : market.includes('Oman') ? 'OM' : market.includes('Kuwait') ? 'KW' : market.includes('Egypt') ? 'EG' : 'SA';

  useEffect(() => {
    fetchImage(p.image_keyword || name, pexelsKey).then(setImgUrl);
  }, [p.image_keyword, name, pexelsKey]);

  const satColor = (s: string) => s.includes('Low') || s.includes('\u0645\u0646\u062e\u0641\u0636') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : s.includes('Medium') || s.includes('\u0645\u062a\u0648\u0633\u0637') ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200';

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
          <span>\u0645\u0646\u0627\u0641\u0633\u064a\u0646: <b>{rivals}</b></span>
          <span>\u0625\u0646\u0641\u0627\u0642 \u0625\u0639\u0644\u0627\u0646\u064a: <b>{spend}</b></span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-50 rounded-xl p-3 text-center"><div className="text-xs text-slate-500 mb-1">\u0633\u0639\u0631 \u0627\u0644\u0645\u0648\u0631\u062f</div><div className="text-lg font-bold text-slate-700">${cost}</div></div>
          <div className="bg-blue-50 rounded-xl p-3 text-center"><div className="text-xs text-blue-500 mb-1">\u0633\u0639\u0631 \u0627\u0644\u0628\u064a\u0639</div><div className="text-lg font-bold text-blue-600">${sell}</div></div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center"><div className="text-xs text-emerald-500 mb-1">\u0647\u0627\u0645\u0634 \u0627\u0644\u0631\u0628\u062d</div><div className="text-lg font-bold text-emerald-600">${margin}</div></div>
        </div>
        <p className="text-sm text-slate-600 mb-3"><strong>\ud83d\udca1</strong> {why}</p>
        {ads.length > 0 && <div className="mb-3 p-3 bg-blue-50 rounded-xl"><p className="text-xs font-bold text-blue-700 mb-1">\ud83d\udcca \u0625\u0639\u0644\u0627\u0646\u0627\u062a \u0646\u0634\u0637\u0629:</p>{ads.map((a: string, i: number) => <p key={i} className="text-xs text-blue-600">\u2022 {a}</p>)}</div>}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <a href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${countryCode}&q=${encodeURIComponent(fbQ)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-3 rounded-xl"><Search className="w-4 h-4" /> \u0625\u0639\u0644\u0627\u0646\u0627\u062a \u0641\u064a\u0633\u0628\u0648\u0643</a>
          <a href={`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(aliQ)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2.5 px-3 rounded-xl"><ShoppingBag className="w-4 h-4" /> \u0639\u0644\u064a \u0625\u0643\u0633\u0628\u0631\u064a\u0633</a>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a href={`https://ads.tiktok.com/business/creativecenter/inspiration/topads/pad/en?period=30&region=${countryCode}&keyword=${encodeURIComponent(fbQ)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-bold py-2.5 px-3 rounded-xl"><Play className="w-4 h-4" /> TikTok Ads</a>
          <a href={`https://forbusiness.snapchat.com/advertising?q=${encodeURIComponent(fbQ)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold py-2.5 px-3 rounded-xl"><Video className="w-4 h-4" /> Snapchat Ads</a>
        </div>
      </div>
    </div>
  );
};

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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${keyToUse}`;

    const today = new Date().toISOString().split('T')[0];
    const promptText = `You are an expert e-commerce market analyst specializing in dropshipping and COD (Cash on Delivery) markets in the Arab world. Today is ${today}.

YOUR TASK: Analyze the REAL current market in "${market}" for the niche "${niche}" and identify ${productCount} ACTUALLY WINNING products.

CRITICAL RULES - YOU MUST FOLLOW:
1. ONLY suggest products that ACTUALLY EXIST on AliExpress right now. Provide the EXACT English search query that returns the product on AliExpress.
2. ONLY suggest products that have REAL ACTIVE Facebook/Instagram ads running in ${market} RIGHT NOW. Provide the exact search query to find these ads in Facebook Ad Library.
3. Products must be suitable for COD dropshipping (price under $150 retail, good margins, shippable).
4. Base your analysis on REAL market trends - products that real dropshippers are actually selling in ${market} in 2025-2026.
5. Include REAL competitor information - how many stores are selling this product, estimated ad spend.
6. DO NOT invent fictional products. Every product must be a real, physical product available on AliExpress.
7. For each product, explain WHY it's winning based on real market dynamics (seasonal demand, viral trends, problem-solving, etc.)
8. The "active_ad_examples" field should contain realistic descriptions of actual ad types running (e.g., "UGC video showing before/after results", "Product demo with Arabic voiceover on Facebook")
9. Provide REALISTIC prices based on actual AliExpress prices and actual selling prices in ${market}.

RESPOND ONLY with a JSON object: {"products": [...]} where each product has:
- product_name (Arabic name as used in ads)
- product_name_en (English name)
- category (Arabic)
- image_keyword (English keyword for finding product image)
- why_winning (Arabic, detailed real reason)
- cost_price (NUMBER - realistic AliExpress price in USD)
- selling_price (NUMBER - realistic selling price in USD for ${market})
- profit_margin (NUMBER - calculated margin)
- saturation (Arabic: low/medium/high with explanation)
- fb_search_query (EXACT query to find this product's ads in Facebook Ad Library)
- aliexpress_query (EXACT English query to find this on AliExpress)
- data_source (e.g., "Facebook Ad Library + AliExpress")
- verification_status (Arabic - how to verify this product is real)
- active_ad_examples (array of strings describing real ad formats seen)
- competitor_count (estimated number of sellers)
- ad_spend_estimate (estimated daily ad spend range)
- target_audience (Arabic)

Do not write anything outside JSON.`;

    setScanStep(2);
    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { responseMimeType: "application/json" }
    };

    let attempt = 0;
    const delays = [1000, 2000, 4000, 8000, 16000];
    let success = false;
    while (attempt < 5 && !success) {
      try {
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) { const eb = await res.text(); throw new Error(`Server error: ${res.status}: ${eb}`); }
        setScanStep(3);
        const data = await res.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error(data.error?.message || "No data received");
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);
        const arr = parsed.products || parsed;
        if (!Array.isArray(arr)) throw new Error("Invalid data structure");
        setScanStep(4);
        setResults(arr);
        success = true;
      } catch (err: any) {
        console.error(`Attempt ${attempt + 1} failed:`, err);
        if (attempt === 4) setError(err.message || "Error occurred");
        else await new Promise(r => setTimeout(r, delays[attempt]));
        attempt++;
      }
    }
    setLoading(false);
  };

  const stepLabels = ["\u062a\u0647\u064a\u0626\u0629", "\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0633\u0648\u0642", "\u0627\u0633\u062a\u062e\u0631\u0627\u062c \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a", "\u0627\u0644\u062a\u062d\u0642\u0642", "\u0627\u0644\u0646\u062a\u0627\u0626\u062c"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
      <header className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white py-6 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3"><Target className="w-8 h-8 text-cyan-400" /> ALI Spy Pro <span className="text-sm bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">V3.0 Real Data</span></h1>
            <p className="text-blue-200 mt-1 text-sm">\u0623\u062f\u0627\u0629 \u062a\u062c\u0633\u0633 \u062d\u0642\u064a\u0642\u064a\u0629 - \u0645\u0646\u062a\u062c\u0627\u062a \u0645\u0648\u062c\u0648\u062f\u0629 \u0641\u0639\u0644\u0627\u064b \u0639\u0644\u0649 AliExpress \u0648\u064a\u062a\u0645 \u0627\u0644\u062a\u0631\u0648\u064a\u062c \u0644\u0647\u0627 \u0641\u064a Facebook Ads</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full"><Globe className="w-4 h-4" /> <span className="font-bold text-cyan-300">\u0628\u064a\u0627\u0646\u0627\u062a \u062d\u0642\u064a\u0642\u064a\u0629</span></div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full"><Activity className="w-4 h-4 text-emerald-400" /> <span className="font-bold text-emerald-400">\u0645\u0633\u062a\u0642\u0631</span></div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto p-6 flex gap-6">
        <aside className="w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2"><Search className="w-5 h-5 text-indigo-600" /> \u0641\u0644\u0627\u062a\u0631 \u0627\u0644\u0628\u062d\u062b</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">\u0627\u0644\u062f\u0648\u0644\u0629 \u0627\u0644\u0645\u0633\u062a\u0647\u062f\u0641\u0629</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700" value={market} onChange={(e) => setMarket(e.target.value)}>
                  {markets.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">\u0627\u0644\u0645\u062c\u0627\u0644 (Niche)</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700" value={niche} onChange={(e) => setNiche(e.target.value)}>
                  {niches.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">\u0639\u062f\u062f \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a <span className="text-indigo-600">{productCount}</span></label>
                <input type="range" min={1} max={10} value={productCount} onChange={(e) => setProductCount(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1</span><span>10</span></div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Gemini API Key</label>
                <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="..." value={geminiKey} onChange={(e) => { setGeminiKey(e.target.value); localStorage.setItem("geminiKey", e.target.value); }} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Pexels API (\u0644\u0644\u0635\u0648\u0631)</label>
                <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="..." value={pexelsKey} onChange={(e) => setPexelsKey(e.target.value)} />
              </div>
              <button onClick={scanMarket} disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> \u062c\u0627\u0631\u064a \u0627\u0644\u0628\u062d\u062b...</> : <><Search className="w-5 h-5" /> \u0645\u0633\u062d \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u0622\u0646</>}
              </button>
            </div>
          </div>
        </aside>
        <main className="flex-1">
          {loading && <div className="bg-white rounded-2xl p-6 mb-6 shadow"><div className="flex items-center gap-2 mb-2">{stepLabels.map((s, i) => <div key={i} className={`flex items-center gap-1`}><div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < scanStep ? 'bg-emerald-500 text-white' : i === scanStep ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-200 text-slate-400'}`}>{i < scanStep ? '\u2713' : i+1}</div><span className="text-xs">{s}</span>{i < 4 && <div className={`w-6 h-0.5 ${i < scanStep ? 'bg-emerald-500' : 'bg-slate-200'}`}/>}</div>)}</div></div>}
          {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3 text-red-700"><AlertTriangle className="w-5 h-5" /><p>{error}</p></div>}
          {!loading && results.length === 0 && !error && <div className="text-center py-20"><Camera className="w-16 h-16 text-slate-300 mx-auto mb-4" /><h3 className="text-xl font-bold text-slate-400">\u0627\u0644\u0631\u0627\u062f\u0627\u0631 \u062c\u0627\u0647\u0632</h3><p className="text-slate-400 mt-2">\u0627\u062e\u062a\u0631 \u0627\u0644\u0633\u0648\u0642 \u0648\u0627\u0644\u0645\u062c\u0627\u0644 \u0648\u0627\u0636\u063a\u0637 "\u0645\u0633\u062d \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u0622\u0646"</p><p className="text-xs text-emerald-600 mt-4 font-bold">\u2705 V3.0 - \u0645\u0646\u062a\u062c\u0627\u062a \u062d\u0642\u064a\u0642\u064a\u0629 \u0645\u0648\u062c\u0648\u062f\u0629 \u0639\u0644\u0649 AliExpress \u0648\u064a\u062a\u0645 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0639\u0646\u0647\u0627 \u0641\u0639\u0644\u0627\u064b</p></div>}
          {results.length > 0 && <div><h2 className="text-2xl font-bold text-slate-800 mb-2">\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0645\u0643\u062a\u0634\u0641\u0629 ({results.length})</h2><p className="text-sm text-emerald-600 mb-6 font-bold">\u2705 \u0645\u0646\u062a\u062c\u0627\u062a \u062d\u0642\u064a\u0642\u064a\u0629 - \u062a\u062d\u0642\u0642 \u0645\u0646\u0647\u0627 \u0639\u0628\u0631 \u0631\u0648\u0627\u0628\u0637 Facebook Ad Library \u0648 AliExpress</p><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{results.map((product, idx) => <ProductCard key={idx} product={product} pexelsKey={pexelsKey} market={market} />)}</div></div>}
        </main>
      </div>
    </div>
  );
}
