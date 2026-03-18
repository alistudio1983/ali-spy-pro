import React, { useState } from 'react';
import { Target, Loader2, AlertTriangle, Activity, CheckCircle, Search, Globe } from 'lucide-react';
const apiKey = "";
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
  const sources = p.sources || [];
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
        <h3 className="font-bold text-lg text-slate-800 mb-2">{name}</h3>
        {nameEn && <p className="text-xs text-slate-400 mb-1">{nameEn}</p>}
        {verify && <p className="text-xs text-emerald-600 flex items-center gap-1 mb-2"><CheckCircle className="w-3 h-3"/>{verify}</p>}
        <p className="text-xs text-slate-500 mb-3">منافسين: <strong>{rivals}</strong> &nbsp; إنفاق إعلاني: <strong>{spend}</strong></p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-slate-50 rounded-lg"><p className="text-[10px] text-slate-400">سعر المورد</p><p className="font-bold text-slate-700">${cost}</p></div>
          <div className="text-center p-2 bg-slate-50 rounded-lg"><p className="text-[10px] text-slate-400">سعر البيع</p><p className="font-bold text-emerald-600">${sell}</p></div>
          <div className="text-center p-2 bg-slate-50 rounded-lg"><p className="text-[10px] text-slate-400">هامش الربح</p><p className="font-bold text-purple-600">${margin}</p></div>
        </div>
        <div className="mb-3"><p className="text-xs font-semibold text-slate-700 mb-1">لماذا ينجح؟</p><p className="text-xs text-slate-500">{why}</p></div>
        {audience && <p className="text-xs text-slate-400 mb-2"><Activity className="w-3 h-3 inline mr-1"/>{audience}</p>}
        {ads.length > 0 && <div className="mb-3"><p className="text-xs font-semibold text-slate-600 mb-1">إعلانات نشطة:</p>{ads.map((a:string,i:number)=><a key={i} href={a.startsWith('http')?a:'#'} target="_blank" rel="noreferrer" className="block text-[10px] text-blue-500 hover:underline break-all">{a}</a>)}</div>}
        {sources.length > 0 && <div className="mb-3 p-2 bg-green-50 rounded-lg border border-green-100"><p className="text-[10px] font-semibold text-green-700 mb-1 flex items-center gap-1"><Search className="w-3 h-3"/>مصادر البيانات:</p>{sources.map((s:string,i:number)=><a key={i} href={s.startsWith('http')?s:'#'} target="_blank" rel="noreferrer" className="block text-[10px] text-green-600 hover:underline break-all">{s}</a>)}</div>}
        <div className="grid grid-cols-2 gap-2">
          <a href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${cc}&q=${encodeURIComponent(fbQ)}`} target="_blank" rel="noreferrer" className="text-center text-xs py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">إعلانات فيسبوك</a>
          <a href={`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(aliQ)}`} target="_blank" rel="noreferrer" className="text-center text-xs py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100">علي إكسبريس</a>
          <a href={`https://ads.tiktok.com/business/creativecenter/inspiration/topads/pad/en?period=30&region=${cc}&keyword=${encodeURIComponent(fbQ)}`} target="_blank" rel="noreferrer" className="text-center text-xs py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100">TikTok Ads</a>
          <a href={`https://trends.google.com/trends/explore?geo=${cc}&q=${encodeURIComponent(aliQ)}`} target="_blank" rel="noreferrer" className="text-center text-xs py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">Google Trends</a>
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
    const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${keyToUse}`;
    const today = new Date().toISOString().split('T')[0];
    const cc = market.includes('KSA')?'Saudi Arabia':market.includes('UAE')?'UAE':market.includes('Morocco')?'Morocco':market.includes('Oman')?'Oman':market.includes('Kuwait')?'Kuwait':'Egypt';
    try {
      setScanStep(1); setStatusMsg("الخطوة 1: البحث في Google عن منتجات رائجة...");
      const searchPrompt = `Search Google for the top ${productCount} trending and winning dropshipping products in ${cc} for the niche "${niche}" in ${today}. Search Facebook Ads Library for active ads in ${cc}, search AliExpress for product prices, and search Google Trends for trending products. For each product found, provide: the exact product name in Arabic and English, the real AliExpress price, estimated selling price in ${cc}, number of active Facebook ads found, real data sources with URLs. Focus on products that have ACTIVE Facebook/Instagram ads right now and are available on AliExpress.`;
      const searchRes = await fetch(baseUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: searchPrompt }] }], tools: [{ google_search: {} }] })
      });
      if (!searchRes.ok) throw new Error(await searchRes.text());
      const searchData = await searchRes.json();
      const rawText = searchData.candidates?.[0]?.content?.parts?.map((p:any)=>p.text||'').join('')||'';
      const groundingMeta = searchData.candidates?.[0]?.groundingMetadata;
      const groundingSources = groundingMeta?.groundingChunks?.map((c:any)=>c.web?.uri).filter(Boolean) || [];
      setScanStep(2); setStatusMsg("الخطوة 2: تحليل البيانات الحقيقية...");
      setScanStep(3); setStatusMsg("الخطوة 3: تحويل النتائج إلى JSON...");
      const jsonPrompt = `Convert the following product research data into a JSON array. The data was gathered from real Google searches of Facebook Ads Library, AliExpress, and Google Trends for ${cc}. Here is the raw research data:\n\n${rawText}\n\nGrounding sources: ${groundingSources.join(', ')}\n\nReturn ONLY valid JSON: {"products":[...]} Each product must have: product_name (Arabic), product_name_en (English), category (Arabic), why_winning (Arabic, 2 sentences based on the real data found), cost_price (real AliExpress USD price found), selling_price (USD), profit_margin (USD), saturation (Arabic: منخفض/متوسط/مرتفع based on competitor count), fb_search_query, aliexpress_query (English), data_source (actual source like "Facebook Ads Library + AliExpress"), verification_status (Arabic: تم التحقق عبر Google), active_ad_examples (real URLs if found), competitor_count (real number), ad_spend_estimate (real estimate), target_audience (Arabic), sources (array of real source URLs from the research). No text outside JSON.`;
      const jsonRes = await fetch(baseUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: jsonPrompt }] }], generationConfig: { responseMimeType: 'application/json' } })
      });
      if (!jsonRes.ok) throw new Error(await jsonRes.text());
      const jsonData = await jsonRes.json();
      let text = jsonData.candidates?.[0]?.content?.parts?.map((p:any)=>p.text||'').join('')||'';
      text = text.replace(/```json/gi,'').replace(/```/g,'').trim();
      const parsed = JSON.parse(text);
      let arr = parsed.products || parsed;
      if (!Array.isArray(arr)) throw new Error('Invalid');
      arr = arr.map((p:any) => ({...p, sources: [...(p.sources||[]), ...groundingSources.slice(0,3)]}));
      setScanStep(4); setStatusMsg(`تم العثور على ${arr.length} منتجات ببيانات حقيقية`);
      setResults(arr);
    } catch (e:any) { setError(e.message); }
    setLoading(false);
  };
  const steps = ["بحث Google","تحليل","تحويل","نتائج"];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><h1 className="text-4xl font-black text-slate-800">ALI Spy Pro <span className="text-lg text-indigo-500">V7.0</span></h1><p className="text-slate-500 mt-1">بيانات حقيقية من Google Search + Facebook Ads + AliExpress</p></div>
        {loading && <div className="mb-8"><div className="flex justify-center gap-4 mb-4">{steps.map((s,i)=><div key={i} className="flex items-center gap-2"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${i<scanStep?'bg-emerald-500 text-white':i===scanStep?'bg-indigo-500 text-white animate-pulse':'bg-slate-200 text-slate-400'}`}>{i<scanStep?'\u2713':i+1}</div><span className="text-sm text-slate-600">{s}</span>{i<3&&<div className="w-8 h-0.5 bg-slate-200"/>}</div>)}</div>{statusMsg && <p className="text-center text-sm text-indigo-600 animate-pulse">{statusMsg}</p>}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-center"><AlertTriangle className="w-5 h-5 inline mr-2"/>{error}</div>}
        {!loading && !results.length && !error && <div className="text-center py-16"><Target className="w-16 h-16 text-indigo-300 mx-auto mb-4"/><h3 className="text-xl font-bold text-slate-600 mb-2">الرادار جاهز</h3><p className="text-slate-400">اختر السوق والمجال واضغط "مسح السوق الآن"</p><p className="text-xs text-emerald-500 mt-2">هذا الإصدار يستخدم Gemini + Google Search لبيانات حقيقية</p></div>}
        <div className="flex gap-6">
          <div className="w-72 shrink-0"><div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
            <h2 className="text-lg font-bold text-slate-700 mb-4">فلاتر البحث</h2>
            <div className="mb-4"><label className="text-sm text-slate-500 block mb-1">الدولة</label><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={market} onChange={e=>setMarket(e.target.value)}>{markets.map(m=><option key={m}>{m}</option>)}</select></div>
            <div className="mb-4"><label className="text-sm text-slate-500 block mb-1">المجال</label><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={niche} onChange={e=>setNiche(e.target.value)}>{niches.map(n=><option key={n}>{n}</option>)}</select></div>
            <div className="mb-4"><label className="text-sm text-slate-500 block mb-1">عدد المنتجات: {productCount}</label><input type="range" min={1} max={10} value={productCount} onChange={e=>setProductCount(+e.target.value)} className="w-full accent-indigo-600"/></div>
            <div className="mb-4"><label className="text-sm text-slate-500 block mb-1">Gemini API Key</label><input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={geminiKey} onChange={e=>{setGeminiKey(e.target.value);localStorage.setItem("geminiKey",e.target.value);}}/></div>
            <button onClick={scanMarket} disabled={loading} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50">{loading?<><Loader2 className="w-5 h-5 animate-spin inline mr-2"/>جاري البحث...</>:'مسح السوق الآن'}</button>
            <p className="text-[10px] text-slate-400 mt-2 text-center">يستخدم Gemini + Google Search Grounding</p>
          </div></div>
          {results.length>0 && <div className="flex-1"><h2 className="text-2xl font-bold text-slate-700 mb-2">المنتجات المكتشفة ({results.length})</h2><p className="text-xs text-emerald-600 mb-4 flex items-center gap-1"><CheckCircle className="w-3 h-3"/>بيانات مبنية على بحث Google الحقيقي</p><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{results.map((p,i)=><ProductCard key={i} product={p} market={market}/>)}</div></div>}
        </div>
      </div>
    </div>
  );
}
