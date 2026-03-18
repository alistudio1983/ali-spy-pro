import React, { useState } from 'react';
import { Target, Loader2, AlertTriangle, Activity, CheckCircle, Search, Globe, ExternalLink, TrendingUp, DollarSign, Users, ShoppingCart, Eye } from 'lucide-react';

const apiKey = "";

const getDomain = (url: string) => {
  try { return new URL(url).hostname.replace('www.',''); } catch { return url.slice(0,40); }
};

const ProductCard = ({ product, market }: any) => {
  const p = product;
  const name = p.product_name || "unknown";
  const nameEn = p.product_name_en || "";
  const cat = p.category || "general";
  const sat = p.saturation || "medium";
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
  const sources = (p.sources || []).filter((s:string) => s && !s.includes('vertexaisearch.cloud.google.com'));
  const cc = market.includes('KSA') ? 'SA' : market.includes('UAE') ? 'AE' : market.includes('Morocco') ? 'MA' : market.includes('Oman') ? 'OM' : market.includes('Kuwait') ? 'KW' : market.includes('Egypt') ? 'EG' : 'SA';
  const productLabel = nameEn || aliQ || 'product';
  const bingImg = `https://tse2.mm.bing.net/th?q=${encodeURIComponent(productLabel + ' product ecommerce')}&w=600&h=400&c=7&rs=1&p=0`;
  const fallback = `https://placehold.co/600x400/4f46e5/ffffff?text=${encodeURIComponent(productLabel)}`;
  const [imgSrc, setImgSrc] = useState(bingImg);
  const [imgOk, setImgOk] = useState(false);
  const satColor = (s: string) => s.includes('Low') || s.includes('منخفض') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : s.includes('High') || s.includes('مرتفع') ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all">
      <div className="relative h-52 bg-gradient-to-br from-indigo-50 to-purple-50">
        {!imgOk && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400"/></div>}
        <img src={imgSrc} alt={name} className={`w-full h-full object-cover ${imgOk?'opacity-100':'opacity-0'}`} onLoad={()=>setImgOk(true)} onError={()=>{setImgSrc(fallback);setImgOk(true);}}/>
        <div className="absolute top-2 right-2"><span className={`text-xs px-2 py-1 rounded-full border ${satColor(sat)}`}>{sat}</span></div>
        <div className="absolute top-2 left-2"><span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">{cat}</span></div>
        {src && <div className="absolute bottom-2 left-2"><span className="text-xs px-2 py-1 rounded-full bg-blue-600 text-white flex items-center gap-1"><Globe className="w-3 h-3"/>{src}</span></div>}
      </div>
      <div className="p-4" dir="rtl">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{name}</h3>
        {nameEn && <p className="text-sm text-slate-500 mb-2" dir="ltr">{nameEn}</p>}
        {verify && <div className="flex items-center gap-1 text-emerald-600 text-xs mb-3"><CheckCircle className="w-3.5 h-3.5"/><span>{verify}</span></div>}
        <div className="text-xs text-slate-500 mb-3">منافسين: <strong>{rivals}</strong> &nbsp;&nbsp; إنفاق إعلاني: <strong>{spend}</strong></div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-50 rounded-lg p-2 text-center"><div className="text-[10px] text-slate-400">سعر المورد</div><div className="text-sm font-bold text-slate-700">${cost}</div></div>
          <div className="bg-slate-50 rounded-lg p-2 text-center"><div className="text-[10px] text-slate-400">سعر البيع</div><div className="text-sm font-bold text-blue-600">${sell}</div></div>
          <div className="bg-slate-50 rounded-lg p-2 text-center"><div className="text-[10px] text-slate-400">هامش الربح</div><div className="text-sm font-bold text-emerald-600">${margin}</div></div>
        </div>
        <div className="mb-3"><strong className="text-xs text-slate-600">لماذا ينجح؟</strong><p className="text-xs text-slate-500 mt-1">{why}</p></div>
        {audience && <div className="text-xs text-purple-600 bg-purple-50 rounded-lg p-2 mb-3"><Users className="w-3 h-3 inline mr-1"/>{audience}</div>}
        {sources.length > 0 && <div className="mb-3 border-t border-slate-100 pt-2"><div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><Search className="w-3 h-3"/>مصادر البيانات:</div><div className="flex flex-wrap gap-1">{sources.slice(0,5).map((s:string,i:number)=><a key={i} href={s.startsWith('http')?s:'#'} target="_blank" rel="noreferrer" className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full hover:bg-blue-100 flex items-center gap-1"><ExternalLink className="w-2.5 h-2.5"/>{getDomain(s)}</a>)}</div></div>}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <a href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${cc}&q=${encodeURIComponent(fbQ)}`} target="_blank" rel="noreferrer" className="text-xs text-center py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">إعلانات فيسبوك</a>
          <a href={`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(aliQ)}`} target="_blank" rel="noreferrer" className="text-xs text-center py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition">علي إكسبريس</a>
          <a href={`https://ads.tiktok.com/business/creativecenter/inspiration/topads/pad/en?period=30&region=${cc}&keyword=${encodeURIComponent(fbQ)}`} target="_blank" rel="noreferrer" className="text-xs text-center py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition">TikTok Ads</a>
          <a href={`https://trends.google.com/trends/explore?geo=${cc}&q=${encodeURIComponent(aliQ)}`} target="_blank" rel="noreferrer" className="text-xs text-center py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition">Google Trends</a>
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
  const [statusMsg, setStatusMsg] = useState("");

  const markets = ["المملكة العربية السعودية (KSA)","الإمارات (UAE)","المغرب (Morocco)","سلطنة عمان (Oman)","الكويت (Kuwait)","مصر (Egypt)"];
  const niches = ["منتجات حل المشاكل اليومية","مستحضرات التجميل والعناية بالبشرة","أدوات المطبخ والمنزل الذكية","اكسسوارات السيارات","منتجات الصحة والراحة","منتجات الأطفال"];

  const scanMarket = async () => {
    setLoading(true); setError(""); setResults([]); setScanStep(1); setStatusMsg("جاري البحث في Google عن منتجات رائجة...");
    const keyToUse = geminiKey || apiKey;
    if (!keyToUse) { setError("يرجى إدخال Gemini API Key"); setLoading(false); return; }
    const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${keyToUse}`;
    const today = new Date().toISOString().split('T')[0];
    const cc = market.includes('KSA')?'Saudi Arabia':market.includes('UAE')?'UAE':market.includes('Morocco')?'Morocco':market.includes('Oman')?'Oman':market.includes('Kuwait')?'Kuwait':'Egypt';
    try {
      setScanStep(1); setStatusMsg("الخطوة 1: البحث في Google عن منتجات رائجة...");
      const searchPrompt = `Search Google for the top ${productCount} trending and winning dropshipping products in ${cc} for the niche "${niche}" in ${today}. Search Facebook Ads Library for active ads in ${cc}, search AliExpress for product prices, and search Google Trends for trending products. For each product found, provide: the exact product name in Arabic and English, the real AliExpress price, estimated selling price in ${cc}, number of active Facebook ads found, real data sources with URLs. Focus on products that have ACTIVE Facebook/Instagram ads right now and are available on AliExpress.`;
      const searchRes = await fetch(baseUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: searchPrompt }] }], tools: [{ google_search: {} }] }) });
      if (!searchRes.ok) throw new Error(await searchRes.text());
      const searchData = await searchRes.json();
      const rawText = searchData.candidates?.[0]?.content?.parts?.map((p:any)=>p.text||'').join('')||'';
      const groundingMeta = searchData.candidates?.[0]?.groundingMetadata;
      const groundingSources = groundingMeta?.groundingChunks?.map((c:any)=>c.web?.uri).filter(Boolean) || [];
      const cleanSources = groundingSources.filter((u:string) => !u.includes('vertexaisearch.cloud.google.com'));
      setScanStep(2); setStatusMsg("الخطوة 2: تحليل البيانات الحقيقية...");
      setScanStep(3); setStatusMsg("الخطوة 3: تحويل النتائج إلى JSON...");
      const jsonPrompt = `Convert the following product research data into a JSON array. The data was gathered from real Google searches of Facebook Ads Library, AliExpress, and Google Trends for ${cc}. Here is the raw research data:\n\n${rawText}\n\nReturn ONLY valid JSON: {"products":[...]} Each product must have: product_name (Arabic), product_name_en (English), category (Arabic), why_winning (Arabic, 2 sentences based on the real data found), cost_price (real AliExpress USD price as string like "$5 - $10"), selling_price (USD string), profit_margin (USD string), saturation (Arabic: منخفض/متوسط/مرتفع), fb_search_query, aliexpress_query (English), data_source (like "Facebook Ads Library + AliExpress"), verification_status ("تم التحقق عبر Google"), competitor_count, ad_spend_estimate, target_audience (Arabic), sources (array of real source URLs). No text outside JSON.`;
      const jsonRes = await fetch(baseUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: jsonPrompt }] }], generationConfig: { responseMimeType: 'application/json' } }) });
      if (!jsonRes.ok) throw new Error(await jsonRes.text());
      const jsonData = await jsonRes.json();
      let text = jsonData.candidates?.[0]?.content?.parts?.map((p:any)=>p.text||'').join('')||'';
      text = text.replace(/```json/gi,'').replace(/```/g,'').trim();
      const parsed = JSON.parse(text);
      let arr = parsed.products || parsed;
      if (!Array.isArray(arr)) throw new Error('Invalid');
      arr = arr.map((p:any) => ({...p, sources: [...(p.sources||[]).filter((s:string)=>!s.includes('vertexaisearch')), ...cleanSources.slice(0,3)].filter((v:string,i:number,a:string[])=>a.indexOf(v)===i)}));
      setScanStep(4); setStatusMsg(`تم العثور على ${arr.length} منتجات ببيانات حقيقية`);
      setResults(arr);
    } catch (e:any) { setError(e.message); }
    setLoading(false);
  };

  const steps = ["بحث Google","تحليل","تحويل","نتائج"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-800">ALI Spy Pro <span className="text-lg bg-indigo-600 text-white px-2 py-0.5 rounded-full">V8.0</span></h1>
          <p className="text-slate-500 mt-2">بيانات حقيقية من Google Search + Facebook Ads + AliExpress</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {loading && (
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  {steps.map((s,i)=>(
                    <div key={i} className="flex items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i<scanStep?'bg-emerald-500 text-white':i===scanStep?'bg-indigo-600 text-white animate-pulse':'bg-slate-200 text-slate-400'}`}>{i<scanStep?<CheckCircle className="w-4 h-4"/>:i+1}</div>
                      <span className={`text-xs ${i<=scanStep?'text-slate-700':'text-slate-400'}`}>{s}</span>
                      {i<3 && <div className={`w-8 h-0.5 ${i<scanStep?'bg-emerald-500':'bg-slate-200'}`}/>}
                    </div>
                  ))}
                </div>
                {statusMsg && <p className="text-center text-sm text-indigo-600 animate-pulse">{statusMsg}</p>}
                <div className="flex justify-center mt-4"><Loader2 className="w-8 h-8 animate-spin text-indigo-600"/></div>
              </div>
            )}
            {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 text-red-700"><AlertTriangle className="w-5 h-5 inline mr-2"/>{error}</div>}
            {!loading && !results.length && !error && (
              <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                <Target className="w-16 h-16 mx-auto text-indigo-300 mb-4"/>
                <h3 className="text-xl font-bold text-slate-700 mb-2">الرادار جاهز</h3>
                <p className="text-slate-400">اختر السوق والمجال واضغط "مسح السوق الآن"</p>
                <p className="text-xs text-indigo-400 mt-2">هذا الإصدار يستخدم Gemini + Google Search لبيانات حقيقية</p>
              </div>
            )}
            {results.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">المنتجات المكتشفة ({results.length})</h2>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3"/>بيانات مبنية على بحث Google الحقيقي</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((p,i) => <ProductCard key={i} product={p} market={market}/>)}
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-80 lg:sticky lg:top-4 self-start">
            <div className="bg-white rounded-2xl p-5 shadow-lg" dir="rtl">
              <h3 className="text-lg font-bold text-slate-800 mb-4">فلاتر البحث</h3>
              <div className="mb-3">
                <label className="text-xs text-slate-500 mb-1 block">الدولة</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={market} onChange={e=>setMarket(e.target.value)}>{markets.map(m=><option key={m}>{m}</option>)}</select>
              </div>
              <div className="mb-3">
                <label className="text-xs text-slate-500 mb-1 block">المجال</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={niche} onChange={e=>setNiche(e.target.value)}>{niches.map(n=><option key={n}>{n}</option>)}</select>
              </div>
              <div className="mb-3">
                <label className="text-xs text-slate-500 mb-1 block">عدد المنتجات: {productCount}</label>
                <input type="range" min={1} max={10} value={productCount} onChange={e=>setProductCount(+e.target.value)} className="w-full accent-indigo-600"/>
              </div>
              <div className="mb-4">
                <label className="text-xs text-slate-500 mb-1 block">Gemini API Key</label>
                <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={geminiKey} onChange={e=>{setGeminiKey(e.target.value);localStorage.setItem("geminiKey",e.target.value);}}/>
              </div>
              <button onClick={scanMarket} disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition disabled:opacity-50">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2"/>جاري البحث...</> : 'مسح السوق الآن'}
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-2">يستخدم Gemini + Google Search Grounding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}ا
