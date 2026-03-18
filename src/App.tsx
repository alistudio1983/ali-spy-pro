import React, { useState, useEffect } from 'react';
import { Target, Camera, Loader2, AlertTriangle, Activity, CheckCircle } from 'lucide-react';
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
  const cc = market.includes('KSA') ? 'SA' : market.includes('UAE') ? 'AE' : market.includes('Morocco') ? 'MA' : market.includes('Oman') ? 'OM' : market.includes('Kuwait') ? 'KW' : market.includes('Egypt') ? 'EG' : 'SA';
  const productLabel = nameEn || aliQ || 'product';
  const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent('product photo ' + productLabel + ' white background ecommerce')}?width=600&height=400&nologo=true&seed=${productLabel.length * 7}`;
  const [imgSrc, setImgSrc] = useState(imgUrl);
  const [imgLoaded, setImgLoaded] = useState(false);
  const satColor = (s: string) =>
    s.includes('Low') || s.includes('\u0645\u0646\u062e\u0641\u0636') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
    s.includes('High') || s.includes('\u0645\u0631\u062a\u0641\u0639') ? 'bg-red-100 text-red-700 border-red-200' :
    'bg-amber-100 text-amber-700 border-amber-200';
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-52 bg-gradient-to-br from-indigo-50 to-purple-50">
        {!imgLoaded && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>}
        <img src={imgSrc} alt={name} className={`w-full h-full object-cover transition-opacity ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImgLoaded(true)} onError={() => { setImgSrc(`https://placehold.co/600x400/4f46e5/ffffff?text=${encodeURIComponent(productLabel)}`); setImgLoaded(true); }} />
        <div className="absolute top-2 right-2"><span className={`text-xs px-2 py-1 rounded-full border ${satColor(sat)}`}>{sat}</span></div>
        <div className="absolute top-2 left-2"><span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">{cat}</span></div>
        {src && <div className="absolute bottom-2 left-2"><span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{src}</span></div>}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">{name}</h3>
        {verify && <p className="text-xs text-green-600 mb-2"><CheckCircle className="w-3 h-3 inline mr-1" />{verify}</p>}
        <div className="flex gap-4 text-xs text-slate-500 mb-3"><span>\u0645\u0646\u0627\u0641\u0633\u064a\u0646: <b>{rivals}</b></span><span>\u0625\u0646\u0641\u0627\u0642 \u0625\u0639\u0644\u0627\u0646\u064a: <b>{spend}</b></span></div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-slate-50 rounded-lg"><p className="text-xs text-slate-500">\u0633\u0639\u0631 \u0627\u0644\u0645\u0648\u0631\u062f</p><p className="font-bold text-slate-700">${cost}</p></div>
          <div className="text-center p-2 bg-slate-50 rounded-lg"><p className="text-xs text-slate-500">\u0633\u0639\u0631 \u0627\u0644\u0628\u064a\u0639</p><p className="font-bold text-green-600">${sell}</p></div>
          <div className="text-center p-2 bg-slate-50 rounded-lg"><p className="text-xs text-slate-500">\u0647\u0627\u0645\u0634 \u0627\u0644\u0631\u0628\u062d</p><p className="font-bold text-indigo-600">${margin}</p></div>
        </div>
        <p className="text-sm text-slate-600 mb-2"><b>\u0644\u0645\u0627\u0630\u0627 \u064a\u0646\u062c\u062d\u061f</b> {why}</p>
        {audience && <p className="text-xs text-slate-400 mb-2"><Target className="w-3 h-3 inline mr-1" />{audience}</p>}
        {ads.length > 0 && <div className="mb-3"><p className="text-xs font-bold text-slate-500 mb-1">\u0625\u0639\u0644\u0627\u0646\u0627\u062a \u0646\u0634\u0637\u0629:</p>{ads.map((a: string, i: number) => <p key={i} className="text-xs text-slate-400 truncate">{a}</p>)}</div>}
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
  const [market, setMarket] = useState("المملكة العربية السعودية (KSA)");
  const [niche, setNiche] = useState("منتجات حل المشاكل اليومية");
  const [productCount, setProductCount] = useState(4);
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem("geminiKey") || "");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [scanStep, setScanStep] = useState(0);
  const markets = ["المملكة العربية السعودية (KSA)","الإمارات (UAE)","المغرب (Morocco)","سلطنة عمان (Oman)","الكويت (Kuwait)","مصر (Egypt)"];
  const niches = ["منتجات حل المشاكل اليومية","مستحضرات التجميل والعناية بالبشرة","أدوات المطبخ والمنزل الذكية","اكسسوارات السيارات","منتجات الصحة والراحة","منتجات الأطفال"];
  const scanMarket = async () => {
    setLoading(true); setError(""); setResults([]); setScanStep(1);
    const keyToUse = geminiKey || apiKey;
    if (!keyToUse) { setError("يرجى إدخال Gemini API Key"); setLoading(false); return; }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${keyToUse}`;
    const today = new Date().toISOString().split('T')[0];
    const prompt = `You are an expert e-commerce analyst for Arab dropshipping markets. Today is ${today}. Find ${productCount} REAL winning products in "${market}" for "${niche}". Products must exist on AliExpress and have active Facebook ads. Return ONLY valid JSON: {"products":[...]} Each product: product_name (Arabic), product_name_en (English), category (Arabic), why_winning (Arabic 2 sentences), cost_price (USD number), selling_price (USD number), profit_margin (USD number), saturation (Arabic), fb_search_query, aliexpress_query (English), data_source, verification_status (Arabic), active_ad_examples (string[]), competitor_count (number), ad_spend_estimate (number), target_audience (Arabic). No text outside JSON.`;
    setScanStep(2);
    const payload = { contents: [{ parts: [{ text: prompt }] }],  generationConfig: { responseMimeType: "application/json" } };
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      setScanStep(3);
      const data = await res.json();
      let text = data.candidates?.[0]?.content?.parts?.map((p:any) => p.text || '').join('') || '';
      text = text.replace(/```json/gi,'').replace(/```/g,'').trim();
      const parsed = JSON.parse(text);
      const arr = parsed.products || parsed;
      if (!Array.isArray(arr)) throw new Error("Invalid");
      setScanStep(4); setResults(arr);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };
  const steps = ["تهيئة","تحليل","استخراج","نتائج"];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ALI Spy Pro <span className="text-lg">V5.0</span></h1>
          <p className="text-slate-500 mt-2">صور AI للمنتجات - بحث حقيقي عبر Google</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            {loading && <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-white rounded-xl shadow">{steps.map((s,i) => <div key={i} className="flex items-center gap-1"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i<scanStep?'bg-green-500 text-white':i===scanStep?'bg-indigo-500 text-white animate-pulse':'bg-slate-200 text-slate-500'}`}>{i<scanStep?'\u2713':i+1}</div><span className="text-xs text-slate-500">{s}</span>{i<3&&<div className="w-8 h-0.5 bg-slate-200"/>}</div>)}</div>}
            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-6"><AlertTriangle className="w-5 h-5 inline mr-2"/>{error}</div>}
            {!loading && !results.length && !error && <div className="text-center py-20"><Activity className="w-16 h-16 mx-auto text-indigo-300 mb-4"/><h3 className="text-xl font-bold text-slate-600">الرادار جاهز</h3><p className="text-slate-400">اختر السوق والمجال واضغط "مسح السوق الآن"</p></div>}
            {results.length > 0 && <div><h2 className="text-2xl font-bold text-slate-800 mb-4">المنتجات المكتشفة ({results.length})</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{results.map((p,i) => <ProductCard key={i} product={p} market={market} />)}</div></div>}
          </div>
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-slate-800 mb-4">فلاتر البحث</h2>
              <div className="space-y-4">
                <div><label className="text-sm font-bold text-slate-600">الدولة</label><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={market} onChange={e=>setMarket(e.target.value)}>{markets.map(m=><option key={m}>{m}</option>)}</select></div>
                <div><label className="text-sm font-bold text-slate-600">المجال</label><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={niche} onChange={e=>setNiche(e.target.value)}>{niches.map(n=><option key={n}>{n}</option>)}</select></div>
                <div><label className="text-sm font-bold text-slate-600">عدد المنتجات: {productCount}</label><input type="range" min={1} max={10} value={productCount} onChange={e=>setProductCount(+e.target.value)} className="w-full accent-indigo-600"/></div>
                <div><label className="text-sm font-bold text-slate-600">Gemini API Key</label><input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={geminiKey} onChange={e=>{setGeminiKey(e.target.value);localStorage.setItem("geminiKey",e.target.value);}}/></div>
                <button onClick={scanMarket} disabled={loading} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50">{loading ? <><Loader2 className="w-5 h-5 animate-spin inline mr-2"/>جاري البحث...</> : 'مسح السوق الآن'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
