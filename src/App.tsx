import React, { useState, useEffect } from 'react';
import { Search, Globe, Target, Camera, TrendingUp, Loader2, AlertTriangle, Heart, MessageCircle, Activity, ShoppingBag, Video, Play, CheckCircle } from 'lucide-react';

const apiKey = "";

const scrapeAliExpressImage = async (query: string): Promise<string> => {
  try {
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent('https://www.aliexpress.com/wholesale?SearchText=' + encodeURIComponent(query))}`;
    const res = await fetch(url);
    const data = await res.json();
    const html = data.contents || '';
    const imgMatches = html.match(/\/\/ae-pic-a1\.aliexpress-media\.com\/kf\/[^"'\s]+\.(?:jpg|png|webp)/gi)
      || html.match(/\/\/ae01\.alicdn\.com\/kf\/[^"'\s]+\.(?:jpg|png|webp)/gi)
      || html.match(/\/\/i\.alicdn\.com\/[^"'\s]+\.(?:jpg|png|webp)/gi);
    if (imgMatches && imgMatches.length > 0) {
      return 'https:' + imgMatches[0];
    }
    return '';
  } catch {
    return '';
  }
};

const ProductCard = ({ product, market }: any) => {
  const p = product;
  const name = p.product_name || "\u0645\u0646\u062a\u062c \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641";
  const cat = p.category || "\u0639\u0627\u0645";
  const sat = p.saturation || "\u0645\u062a\u0648\u0633\u0637";
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
  const imgUrl = p.image_url || "";
  const cc = market.includes('KSA') ? 'SA' : market.includes('UAE') ? 'AE' : market.includes('Morocco') ? 'MA' : market.includes('Oman') ? 'OM' : market.includes('Kuwait') ? 'KW' : market.includes('Egypt') ? 'EG' : 'SA';

  const [imgSrc, setImgSrc] = useState("");
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadImage = async () => {
      setImgLoading(true);
      // Step 1: Try Gemini-provided URL
      if (imgUrl) {
        const img = new Image();
        const ok = await new Promise<boolean>(r => { img.onload = () => r(true); img.onerror = () => r(false); img.src = imgUrl; });
        if (!cancelled && ok) { setImgSrc(imgUrl); setImgLoading(false); return; }
      }
      // Step 2: Scrape AliExpress
      const aliImg = await scrapeAliExpressImage(p.aliexpress_query || p.product_name_en || name);
      if (!cancelled && aliImg) {
        const img2 = new Image();
        const ok2 = await new Promise<boolean>(r => { img2.onload = () => r(true); img2.onerror = () => r(false); img2.src = aliImg; });
        if (!cancelled && ok2) { setImgSrc(aliImg); setImgLoading(false); return; }
      }
      // Step 3: Fallback placeholder
      if (!cancelled) { setImgSrc(`https://picsum.photos/seed/${encodeURIComponent(p.product_name_en || name)}/600/400`); setImgLoading(false); }
    };
    loadImage();
    return () => { cancelled = true; };
  }, [imgUrl]);

  const handleImgError = () => {
    setImgSrc(`https://picsum.photos/seed/${encodeURIComponent(p.product_name_en || name)}/600/400`);
  };

  const satColor = (s: string) =>
    s.includes('\u0645\u0646\u062e\u0641\u0636') || s.includes('Low') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
    s.includes('\u0645\u062a\u0648\u0633\u0637') || s.includes('Medium') ? 'bg-amber-100 text-amber-700 border-amber-200' :
    'bg-red-100 text-red-700 border-red-200';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
        {imgLoading ? (
          <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /><span className="ml-2 text-sm text-slate-500">Loading from AliExpress...</span></div>
        ) : imgSrc ? (
          <img src={imgSrc} alt={name} className="w-full h-full object-cover" onError={handleImgError} />
        ) : (
          <div className="flex items-center justify-center h-full"><Camera className="w-12 h-12 text-slate-300" /></div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <span className={`text-xs px-2 py-1 rounded-full border ${satColor(sat)}`}>{sat}</span>
        </div>
        <div className="absolute top-2 left-2"><span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">{cat}</span></div>
        {src && <div className="absolute bottom-2 left-2"><span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{src}</span></div>}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">{name}</h3>
        {verify && <p className="text-xs text-green-600 mb-2"><CheckCircle className="w-3 h-3 inline mr-1" />{verify}</p>}
        <div className="flex gap-4 text-xs text-slate-500 mb-3">
          <span>\u0645\u0646\u0627\u0641\u0633\u064a\u0646: <b>{rivals}</b></span>
          <span>\u0625\u0646\u0641\u0627\u0642 \u0625\u0639\u0644\u0627\u0646\u064a: <b>{spend}</b></span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-slate-50 rounded-lg"><p className="text-xs text-slate-500">\u0633\u0639\u0631 \u0627\u0644\u0645\u0648\u0631\u062f</p><p className="font-bold text-slate-700">${cost}</p></div>
          <div className="text-center p-2 bg-slate-50 rounded-lg"><p className="text-xs text-slate-500">\u0633\u0639\u0631 \u0627\u0644\u0628\u064a\u0639</p><p className="font-bold text-green-600">${sell}</p></div>
          <div className="text-center p-2 bg-slate-50 rounded-lg"><p className="text-xs text-slate-500">\u0647\u0627\u0645\u0634 \u0627\u0644\u0631\u0628\u062d</p><p className="font-bold text-indigo-600">${margin}</p></div>
        </div>
        <p className="text-sm text-slate-600 mb-3"><b>\u0644\u0645\u0627\u0630\u0627 \u064a\u0646\u062c\u062d\u061f</b> {why}</p>
        {ads.length > 0 && <div className="mb-3"><p className="text-xs font-bold text-slate-500 mb-1">\u0625\u0639\u0644\u0627\u0646\u0627\u062a \u0646\u0634\u0637\u0629:</p>{ads.map((a: string, i: number) => <p key={i} className="text-xs text-slate-400">\u2022 {a}</p>)}</div>}
        <div className="grid grid-cols-2 gap-2">
          <a href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${cc}&q=${encodeURIComponent(fbQ)}`} target="_blank" rel="noreferrer" className="text-center py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100">\u0625\u0639\u0644\u0627\u0646\u0627\u062a \u0641\u064a\u0633\u0628\u0648\u0643</a>
          <a href={`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(aliQ)}`} target="_blank" rel="noreferrer" className="text-center py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-100">\u0639\u0644\u064a \u0625\u0643\u0633\u0628\u0631\u064a\u0633</a>
          <a href={`https://ads.tiktok.com/business/creativecenter/inspiration/topads/pad/en?period=30&region=${cc}&keyword=${encodeURIComponent(fbQ)}`} target="_blank" rel="noreferrer" className="text-center py-2 bg-pink-50 text-pink-600 rounded-lg text-xs font-bold hover:bg-pink-100">TikTok Ads</a>
          <a href={`https://forbusiness.snapchat.com/advertising?q=${encodeURIComponent(fbQ)}`} target="_blank" rel="noreferrer" className="text-center py-2 bg-yellow-50 text-yellow-600 rounded-lg text-xs font-bold hover:bg-yellow-100">Snapchat Ads</a>
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
    const promptText = `You are an expert e-commerce market analyst specializing in dropshipping and COD markets in the Arab world. Today is ${today}. TASK: Find ${productCount} REAL winning products in "${market}" for niche "${niche}". CRITICAL RULES: 1. Products MUST actually exist on AliExpress with exact search query. 2. Products MUST have active Facebook/Instagram ads in ${market}. 3. Suitable for COD dropshipping (under $150, good margins). 4. image_url: Provide a REAL product image URL from ae01.alicdn.com or m.media-amazon.com CDN. 5. NEVER use placeholder URLs. 6. aliexpress_query MUST be an accurate English search term for the product on AliExpress. RESPOND ONLY with JSON: {"products": [...]} where each product has: product_name (Arabic), product_name_en (English), category (Arabic), image_url (REAL URL), why_winning (Arabic), cost_price (NUMBER), selling_price (NUMBER), profit_margin (NUMBER), saturation (Arabic), fb_search_query, aliexpress_query (English), data_source, verification_status (Arabic), active_ad_examples (string array), competitor_count, ad_spend_estimate, target_audience (Arabic). No text outside JSON.`;
    setScanStep(2);
    const payload = { contents: [{ parts: [{ text: promptText }] }], generationConfig: { thinkingConfig: { thinkingBudget: 0 }, responseMimeType: "application/json" } };
    let attempt = 0;
    const delays = [1000, 2000, 4000, 8000, 16000];
    let success = false;
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
        setScanStep(4);
        setResults(arr);
        success = true;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ALI Spy Pro <span className="text-lg">V3.2</span> <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">Real Images</span></h1>
          <p className="text-slate-500 mt-2">\u0635\u0648\u0631 \u062d\u0642\u064a\u0642\u064a\u0629 \u0645\u0646 AliExpress - \u0645\u0646\u062a\u062c\u0627\u062a \u064a\u062a\u0645 \u0627\u0644\u062a\u0631\u0648\u064a\u062c \u0644\u0647\u0627 \u0641\u064a Facebook Ads</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            {loading && (
              <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-white rounded-xl shadow">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < scanStep ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{i < scanStep ? '\u2713' : i+1}</div>
                    <span className="text-xs text-slate-500">{s}</span>
                    {i < 3 && <div className="w-8 h-0.5 bg-slate-200"></div>}
                  </div>
                ))}
              </div>
            )}
            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-6"><AlertTriangle className="w-5 h-5 inline mr-2" />{error}</div>}

            {!loading && results.length === 0 && !error && (
              <div className="text-center py-20">
                <Activity className="w-16 h-16 mx-auto text-indigo-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-600">\u0627\u0644\u0631\u0627\u062f\u0627\u0631 \u062c\u0627\u0647\u0632</h3>
                <p className="text-slate-400">\u0627\u062e\u062a\u0631 \u0627\u0644\u0633\u0648\u0642 \u0648\u0627\u0644\u0645\u062c\u0627\u0644 \u0648\u0627\u0636\u063a\u0637 "\u0645\u0633\u062d \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u0622\u0646"</p>
              </div>
            )}

            {results.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0645\u0643\u062a\u0634\u0641\u0629 ({results.length})</h2>
                  <p className="text-xs text-slate-400">\u0635\u0648\u0631 \u062d\u0642\u064a\u0642\u064a\u0629 \u0645\u0646 AliExpress - \u062a\u062d\u0642\u0642 \u0639\u0628\u0631 \u0627\u0644\u0631\u0648\u0627\u0628\u0637</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.map((p, i) => <ProductCard key={i} product={p} market={market} />)}
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-slate-800 mb-4">\u0641\u0644\u0627\u062a\u0631 \u0627\u0644\u0628\u062d\u062b</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-600">\u0627\u0644\u062f\u0648\u0644\u0629 \u0627\u0644\u0645\u0633\u062a\u0647\u062f\u0641\u0629</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700" value={market} onChange={e => setMarket(e.target.value)}>
                    {markets.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-600">\u0627\u0644\u0645\u062c\u0627\u0644 (Niche)</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700" value={niche} onChange={e => setNiche(e.target.value)}>
                    {niches.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-600">\u0639\u062f\u062f \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a: {productCount}</label>
                  <input type="range" min={1} max={10} value={productCount} onChange={e => setProductCount(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-600">Gemini API Key</label>
                  <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={geminiKey} onChange={e => { setGeminiKey(e.target.value); localStorage.setItem("geminiKey", e.target.value); }} />
                </div>
                <button onClick={scanMarket} disabled={loading} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all">
                  {loading ? <>\u062c\u0627\u0631\u064a \u0627\u0644\u0628\u062d\u062b...</> : <>\u0645\u0633\u062d \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u0622\u0646</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
