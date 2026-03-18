import React, { useState, useEffect } from 'react';
import { Search, Globe, Target, Camera, TrendingUp, Loader2, AlertTriangle, Heart, MessageCircle, Activity, ShoppingBag, Video, Play, CheckCircle, ExternalLink, Eye } from 'lucide-react';

const apiKey = "";

// Search for product image using Gemini with Google Search grounding
const searchProductImage = async (query: string, geminiKey: string): Promise<string> => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
    const payload = {
      contents: [{ parts: [{ text: `Search AliExpress for product: "${query}". Find the main product listing image. Return ONLY the direct image URL starting with https://ae01.alicdn.com or https://i.alicdn.com. Return ONLY the URL string, nothing else. No markdown, no explanation.` }] }],
      tools: [{ google_search: {} }],
      generationConfig: { maxOutputTokens: 300 }
    };
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) return '';
    const data = await res.json();
    // Extract URLs from all parts including grounding
    let allText = '';
    const parts = data.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.text) allText += ' ' + part.text;
    }
    // Also check grounding metadata for image URLs
    const grounding = data.candidates?.[0]?.groundingMetadata;
    if (grounding?.groundingChunks) {
      for (const chunk of grounding.groundingChunks) {
        if (chunk.web?.uri) allText += ' ' + chunk.web.uri;
      }
    }
    // Match alicdn URLs first
    const aliMatch = allText.match(/https?:\/\/[^\s"'<>]*alicdn\.com[^\s"'<>]*/i);
    if (aliMatch) return aliMatch[0].replace(/["'\s].*$/, '');
    // Then try any image URL
    const imgMatch = allText.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)[^\s"'<>]*/i);
    if (imgMatch) return imgMatch[0].replace(/["'\s].*$/, '');
    return '';
  } catch {
    return '';
  }
};

const ProductCard = ({ product, market, geminiKey }: any) => {
  const p = product;
  const name = p.product_name || "منتج غير معروف";
  const nameEn = p.product_name_en || "";
  const cat = p.category || "عام";
  const sat = p.saturation || "متوسط";
  const why = p.why_winning || "";
  const cost = p.cost_price || 0;
  const sell = p.selling_price || 0;
  const margin = p.profit_margin || 0;
  const fbQ = p.fb_search_query || name;
  const aliQ = p.aliexpress_query || nameEn || name;
  const src = p.data_source || "";
  const verify = p.verification_status || "";
  const ads = p.active_ad_examples || [];
  const rivals = p.competitor_count || "N/A";
  const spend = p.ad_spend_estimate || "N/A";
  const audience = p.target_audience || "";
  const imgUrl = p.image_url || "";
  const cc = market.includes('KSA') ? 'SA' : market.includes('UAE') ? 'AE' : market.includes('Morocco') ? 'MA' : market.includes('Oman') ? 'OM' : market.includes('Kuwait') ? 'KW' : market.includes('Egypt') ? 'EG' : 'SA';

  const [imgSrc, setImgSrc] = useState("");
  const [imgLoading, setImgLoading] = useState(true);
  const [imgFailed, setImgFailed] = useState(false);

  const testImage = (url: string): Promise<boolean> => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      setTimeout(() => resolve(false), 5000);
    });
  };

  useEffect(() => {
    let cancelled = false;
    const loadImage = async () => {
      setImgLoading(true);
      setImgFailed(false);

      // Step 1: Try image_url from Gemini response
      if (imgUrl && imgUrl.startsWith('http')) {
        const ok = await testImage(imgUrl);
        if (!cancelled && ok) { setImgSrc(imgUrl); setImgLoading(false); return; }
      }

      // Step 2: Try Gemini Search grounding to find real product image
      const keyToUse = geminiKey || apiKey;
      if (keyToUse) {
        const searchQuery = aliQ || nameEn || name;
        const searchImg = await searchProductImage(searchQuery, keyToUse);
        if (!cancelled && searchImg) {
          const ok2 = await testImage(searchImg);
          if (!cancelled && ok2) { setImgSrc(searchImg); setImgLoading(false); return; }
        }
      }

      // Step 3: Fallback - Use product-relevant keywords for placeholder
      if (!cancelled) {
        const keywords = (nameEn || aliQ || 'product').replace(/[^a-zA-Z0-9 ]/g, '').trim().split(' ').slice(0, 3).join('+');
        setImgSrc(`https://image.pollinations.ai/prompt/${encodeURIComponent('Professional product photo of ' + (nameEn || aliQ || 'product') + ', white background, studio lighting')}?width=600&height=400&nologo=true`);
        setImgLoading(false);
      }
    };
    loadImage();
    return () => { cancelled = true; };
  }, [imgUrl]);

  const handleImgError = () => {
    if (!imgFailed) {
      setImgFailed(true);
      const keywords = (nameEn || aliQ || 'ecommerce').replace(/[^a-zA-Z0-9 ]/g, '').trim().split(' ').slice(0, 2).join('+');
      setImgSrc(`https://image.pollinations.ai/prompt/${encodeURIComponent('Product photo ' + (nameEn || aliQ || 'item') + ' white background')}?width=600&height=400&nologo=true`);
    }
  };

  const satColor = (s: string) =>
    s.includes('منخفض') || s.includes('Low') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
    s.includes('متوسط') || s.includes('Medium') ? 'bg-amber-100 text-amber-700 border-amber-200' :
    'bg-red-100 text-red-700 border-red-200';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-52 bg-gradient-to-br from-slate-100 to-slate-200">
        {imgLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <span className="ml-2 text-sm text-slate-500">جاري تحميل الصورة...</span>
          </div>
        ) : imgSrc ? (
          <img src={imgSrc} alt={name} className="w-full h-full object-cover" onError={handleImgError} crossOrigin="anonymous" referrerPolicy="no-referrer" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Camera className="w-12 h-12 text-slate-300" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <span className={`text-xs px-2 py-1 rounded-full border ${satColor(sat)}`}>{sat}</span>
        </div>
        <div className="absolute top-2 left-2">
          <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">{cat}</span>
        </div>
        {src && <div className="absolute bottom-2 left-2"><span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{src}</span></div>}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">{name}</h3>
        {verify && <p className="text-xs text-green-600 mb-2"><CheckCircle className="w-3 h-3 inline mr-1" />{verify}</p>}
        <div className="flex gap-4 text-xs text-slate-500 mb-3">
          <span>منافسين: <b>{rivals}</b></span>
          <span>إنفاق إعلاني: <b>{spend}</b></span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">سعر المورد</p>
            <p className="font-bold text-slate-700">${cost}</p>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">سعر البيع</p>
            <p className="font-bold text-green-600">${sell}</p>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">هامش الربح</p>
            <p className="font-bold text-indigo-600">${margin}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-2"><b>لماذا ينجح؟</b> {why}</p>
        {audience && <p className="text-xs text-slate-400 mb-2"><Target className="w-3 h-3 inline mr-1" />{audience}</p>}

        {ads.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-bold text-slate-500 mb-1">إعلانات نشطة:</p>
            {ads.map((a: string, i: number) => <p key={i} className="text-xs text-slate-400 truncate">{a}</p>)}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <a href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${cc}&q=${encodeURIComponent(fbQ)}`} target="_blank" rel="noreferrer" className="text-center py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition">إعلانات فيسبوك</a>
          <a href={`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(aliQ)}`} target="_blank" rel="noreferrer" className="text-center py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-100 transition">علي إكسبريس</a>
          <a href={`https://ads.tiktok.com/business/creativecenter/inspiration/topads/pad/en?period=30&region=${cc}&keyword=${encodeURIComponent(fbQ)}`} target="_blank" rel="noreferrer" className="text-center py-2 bg-pink-50 text-pink-600 rounded-lg text-xs font-bold hover:bg-pink-100 transition">TikTok Ads</a>
          <a href={`https://forbusiness.snapchat.com/advertising?q=${encodeURIComponent(fbQ)}`} target="_blank" rel="noreferrer" className="text-center py-2 bg-yellow-50 text-yellow-600 rounded-lg text-xs font-bold hover:bg-yellow-100 transition">Snapchat Ads</a>
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
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [scanStep, setScanStep] = useState(0);

  const markets = ["المملكة العربية السعودية (KSA)", "الإمارات العربية المتحدة (UAE)", "المغرب (Morocco)", "سلطنة عمان (Oman)", "الكويت (Kuwait)", "مصر (Egypt)", "الخليج العربي عموماً"];
  const niches = ["منتجات حل المشاكل اليومية", "مستحضرات التجميل والعناية بالبشرة", "أدوات المطبخ والمنزل الذكية", "اكسسوارات وعناية السيارات", "منتجات الصحة والراحة", "منتجات الأطفال والألعاب الذكية"];

  const scanMarket = async () => {
    setLoading(true); setError(""); setResults([]); setScanStep(1);
    const keyToUse = geminiKey || apiKey || "";
    if (!keyToUse) { setError("يرجى إدخال Gemini API Key"); setLoading(false); return; }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${keyToUse}`;
    const today = new Date().toISOString().split('T')[0];
    const promptText = `You are an expert e-commerce market analyst specializing in dropshipping and COD markets in the Arab world. Today is ${today}.

TASK: Find ${productCount} REAL winning products currently being advertised in "${market}" for niche "${niche}".

CRITICAL RULES:
1. Products MUST actually exist on AliExpress with exact search query
2. Products MUST have active Facebook/Instagram ads in ${market}
3. Suitable for COD dropshipping (under $150, good margins)
4. For image_url: provide a working product image URL. Use format https://ae01.alicdn.com/kf/XXXXX.jpg or similar real AliExpress CDN URLs
5. aliexpress_query MUST be accurate English search term that finds the exact product
6. product_name_en MUST be the accurate English product name

RESPOND ONLY with valid JSON:
{"products": [...]}

Each product object MUST have ALL these fields:
- product_name (Arabic name)
- product_name_en (English name)
- category (Arabic)
- image_url (real product image URL from AliExpress CDN)
- why_winning (Arabic, 2-3 sentences)
- cost_price (number in USD)
- selling_price (number in USD)
- profit_margin (number in USD)
- saturation (Arabic: منخفض/متوسط/مرتفع or منخفض إلى متوسط)
- fb_search_query (for Facebook Ad Library search)
- aliexpress_query (English search query)
- data_source (e.g. "AliExpress", "Facebook Ads")
- verification_status (Arabic)
- active_ad_examples (array of strings - ad descriptions)
- competitor_count (number)
- ad_spend_estimate (number)
- target_audience (Arabic description)

No text outside JSON. Only valid JSON.`;

    setScanStep(2);
    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { thinkingConfig: { thinkingBudget: 0 }, responseMimeType: "application/json" }
    };

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

  const steps = ["تهيئة", "تحليل", "استخراج", "نتائج"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ALI Spy Pro <span className="text-lg">V4.0</span> <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">AI Images</span>
          </h1>
          <p className="text-slate-500 mt-2">صور حقيقية عبر Gemini Search - منتجات يتم الترويج لها في Facebook Ads</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            {loading && (
              <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-white rounded-xl shadow">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < scanStep ? 'bg-green-500 text-white' : i === scanStep ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-200 text-slate-500'}`}>
                      {i < scanStep ? '\u2713' : i+1}
                    </div>
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
                <h3 className="text-xl font-bold text-slate-600">الرادار جاهز</h3>
                <p className="text-slate-400">اختر السوق والمجال واضغط "مسح السوق الآن"</p>
              </div>
            )}

            {results.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">المنتجات المكتشفة ({results.length})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.map((p, i) => <ProductCard key={i} product={p} market={market} geminiKey={geminiKey} />)}
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-slate-800 mb-4">فلاتر البحث</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-600">الدولة المستهدفة</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700" value={market} onChange={e => setMarket(e.target.value)}>
                    {markets.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-600">المجال (Niche)</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700" value={niche} onChange={e => setNiche(e.target.value)}>
                    {niches.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-600">عدد المنتجات: {productCount}</label>
                  <input type="range" min={1} max={10} value={productCount} onChange={e => setProductCount(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-600">Gemini API Key</label>
                  <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={geminiKey} onChange={e => { setGeminiKey(e.target.value); localStorage.setItem("geminiKey", e.target.value); }} />
                </div>
                <button onClick={scanMarket} disabled={loading} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin inline mr-2" />جاري البحث...</> : <>مسح السوق الآن</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
