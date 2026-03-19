import React, { useState } from 'react';
import { Target, Loader2, AlertTriangle, CheckCircle, Search, Globe, ExternalLink, Users } from 'lucide-react';
const apiKey = "";
const getDomain = (url) => { try { return new URL(url).hostname.replace('www.',''); } catch { return ''; } };
const ProductCard = ({ product, market }) => {
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
  const rawSources = p.sources || [];
  const sources = rawSources.filter((s) => s && !s.includes('vertexaisearch'));
  const cc = market.includes('KSA') ? 'SA' : market.includes('UAE') ? 'AE' : market.includes('Morocco') ? 'MA' : market.includes('Oman') ? 'OM' : market.includes('Kuwait') ? 'KW' : 'EG';
  const productLabel = nameEn || aliQ || 'product';
  const bingImg = 'https://tse2.mm.bing.net/th?q=' + encodeURIComponent(productLabel + ' product') + '&w=600&h=400&c=7';
  const fallback = 'https://placehold.co/600x400/4f46e5/ffffff?text=' + encodeURIComponent(productLabel);
  const [imgSrc, setImgSrc] = useState(bingImg);
  const [imgOk, setImgOk] = useState(false);
  const satBg = sat.includes('Low') || sat.includes('منخفض') ? 'bg-emerald-100 text-emerald-700' : sat.includes('High') || sat.includes('مرتفع') ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700';
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all">
      <div className="relative h-48 bg-indigo-50">
        {!imgOk && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400"/></div>}
        <img src={imgSrc} alt={name} className={'w-full h-full object-cover ' + (imgOk ? 'opacity-100' : 'opacity-0')}
          onLoad={() => setImgOk(true)}
          onError={() => { setImgSrc(fallback); setImgOk(true); }}/>
        <div className="absolute top-2 right-2"><span className={'text-xs px-2 py-0.5 rounded-full font-medium ' + satBg}>{sat}</span></div>
        <div className="absolute top-2 left-2"><span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{cat}</span></div>
        {src && <div className="absolute bottom-2 left-2"><span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white flex items-center gap-1"><Globe className="w-3 h-3"/>{src}</span></div>}
      </div>
      <div className="p-4" dir="rtl">
        <h3 className="text-base font-bold text-slate-800 mb-0.5">{name}</h3>
        {nameEn && <p className="text-xs text-slate-400 mb-2" dir="ltr">{nameEn}</p>}
        {verify && <div className="flex items-center gap-1 text-emerald-600 text-xs mb-2"><CheckCircle className="w-3 h-3"/><span>{verify}</span></div>}
        <div className="text-xs text-slate-500 mb-3">منافسين: <strong>{rivals}</strong> &nbsp; إنفاق إعلاني: <strong>{spend}</strong></div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-400">سعر المورد</div>
            <div className="text-sm font-bold text-slate-700">{cost}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-400">سعر البيع</div>
            <div className="text-sm font-bold text-blue-600">{sell}</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-400">هامش الربح</div>
            <div className="text-sm font-bold text-emerald-600">{margin}</div>
          </div>
        </div>
        <div className="mb-3"><p className="text-xs font-semibold text-slate-600">لماذا ينجح؟</p><p className="text-xs text-slate-500 mt-0.5">{why}</p></div>
        {audience && <div className="text-xs text-purple-600 bg-purple-50 rounded-lg p-2 mb-3"><Users className="w-3 h-3 inline mr-1"/>{audience}</div>}
        {sources.length > 0 && (
          <div className="mb-3 border-t border-slate-100 pt-2">
            <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><Search className="w-3 h-3"/>مصادر:</p>
            <div className="flex flex-wrap gap-1">
              {sources.slice(0, 4).map((s, i) => (
                <a key={i} href={s} target="_blank" rel="noreferrer"
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full hover:bg-blue-100 flex items-center gap-1">
                  <ExternalLink className="w-2.5 h-2.5"/>{getDomain(s)}
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-1.5">
          <a href={'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=' + cc + '&q=' + encodeURIComponent(fbQ)} target="_blank" rel="noreferrer" className="text-xs text-center py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">إعلانات فيسبوك</a>
          <a href={'https://www.aliexpress.com/wholesale?SearchText=' + encodeURIComponent(aliQ)} target="_blank" rel="noreferrer" className="text-xs text-center py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100">علي إكسبريس</a>
          <a href={'https://ads.tiktok.com/business/creativecenter/inspiration/topads/pad/en?period=30&region=' + cc + '&keyword=' + encodeURIComponent(fbQ)} target="_blank" rel="noreferrer" className="text-xs text-center py-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100">TikTok Ads</a>
          <a href={'https://trends.google.com/trends/explore?geo=' + cc + '&q=' + encodeURIComponent(aliQ)} target="_blank" rel="noreferrer" className="text-xs text-center py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">Google Trends</a>
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
  const markets = ['المملكة العربية السعودية (KSA)','الإمارات (UAE)','المغرب (Morocco)','سلطنة عمان (Oman)','الكويت (Kuwait)','مصر (Egypt)'];
  const niches = ['منتجات حل المشاكل اليومية','مستحضرات التجميل والعناية بالبشرة','أدوات المطبخ والمنزل الذكية','اكسسوارات السيارات','منتجات الصحة والراحة','منتجات الأطفال'];
  const scanMarket = async () => {
    setLoading(true); setError(''); setResults([]); setScanStep(1);
    const keyToUse = geminiKey || apiKey;
    if (!keyToUse) { setError('يرجى إدخال Gemini API Key'); setLoading(false); return; }
    const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + keyToUse;
    const today = new Date().toISOString().split('T')[0];
    const cc = market.includes('KSA') ? 'Saudi Arabia' : market.includes('UAE') ? 'UAE' : market.includes('Morocco') ? 'Morocco' : market.includes('Oman') ? 'Oman' : market.includes('Kuwait') ? 'Kuwait' : 'Egypt';
    try {
      setScanStep(1); setStatusMsg('الخطوة 1: بحث Google عن منتجات رائجة...');
      const p1 = 'Search Google for the top ' + productCount + ' trending winning dropshipping products in ' + cc + ' for niche "' + niche + '" on ' + today + '. Find products with ACTIVE Facebook ads and available on AliExpress. Include real AliExpress prices, ad counts, competitor data.';
      const r1 = await fetch(baseUrl, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ contents: [{parts: [{text: p1}]}], tools: [{google_search: {}}] }) });
      if (!r1.ok) throw new Error(await r1.text());
      const d1 = await r1.json();
      const rawText = (d1.candidates && d1.candidates[0] && d1.candidates[0].content && d1.candidates[0].content.parts) ? d1.candidates[0].content.parts.map((x) => x.text || '').join('') : '';
      const gMeta = d1.candidates && d1.candidates[0] && d1.candidates[0].groundingMetadata;
      const gChunks = (gMeta && gMeta.groundingChunks) ? gMeta.groundingChunks : [];
      const cleanSources = gChunks.map((c) => c.web && c.web.uri ? c.web.uri : '').filter((u) => u && !u.includes('vertexaisearch'));
      setScanStep(2); setStatusMsg('الخطوة 2: تحليل وتحويل البيانات...');
      const p2 = 'Convert this research into JSON. Data: ' + rawText.slice(0, 8000) + ' \nReturn ONLY valid JSON: {"products":[...]} with ' + productCount + ' products each having: product_name (Arabic), product_name_en (English), category (Arabic), why_winning (Arabic 2 sentences), cost_price (string like "$5-10"), selling_price (string), profit_margin (string), saturation (Arabic: \u0645\u0646\u062e\u0641\u0636/\u0645\u062a\u0648\u0633\u0637/\u0645\u0631\u062a\u0641\u0639), fb_search_query, aliexpress_query, data_source, verification_status ("\u062a\u0645 \u0627\u0644\u062a\u062d\u0642\u0642 \u0639\u0628\u0631 Google"), competitor_count, ad_spend_estimate, target_audience (Arabic), sources (array of URLs). No text outside JSON.';
      const r2 = await fetch(baseUrl, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ contents: [{parts: [{text: p2}]}], generationConfig: {responseMimeType: 'application/json'} }) });
      if (!r2.ok) throw new Error(await r2.text());
      const d2 = await r2.json();
      let txt = (d2.candidates && d2.candidates[0] && d2.candidates[0].content && d2.candidates[0].content.parts) ? d2.candidates[0].content.parts.map((x) => x.text || '').join('') : '';
      txt = txt.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(txt);
      let arr = parsed.products || parsed;
      if (!Array.isArray(arr)) throw new Error('Invalid JSON');
      arr = arr.map((item) => { const itemSources = (item.sources || []).filter((s) => !s.includes('vertexaisearch')); return Object.assign({}, item, { sources: itemSources.concat(cleanSources.slice(0, 2)).filter((v, i, a) => a.indexOf(v) === i) }); });
      setScanStep(3); setStatusMsg('تم العثور على ' + arr.length + ' منتجات');
      setResults(arr);
    } catch(e) { setError(e.message || 'خطأ غير متوقع'); }
    setLoading(false);
  };
  const steps = ['بحث Google','تحليل','نتائج'];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-slate-800">ALI Spy Pro <span className="text-sm bg-indigo-600 text-white px-2 py-0.5 rounded-full">V8.0</span></h1>
          <p className="text-slate-500 text-sm mt-1">بيانات حقيقية من Google Search + Facebook Ads + AliExpress</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {loading && (
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-6 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  {steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ' + (i < scanStep ? 'bg-emerald-500 text-white' : i === scanStep ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-200 text-slate-400')}>{i < scanStep ? <CheckCircle className="w-4 h-4"/> : i + 1}</div>
                      <span className={'text-xs ' + (i <= scanStep ? 'text-slate-700' : 'text-slate-400')}>{s}</span>
                      {i < steps.length - 1 && <div className={'w-6 h-0.5 ' + (i < scanStep ? 'bg-emerald-500' : 'bg-slate-200')}/>}
                    </div>
                  ))}
                </div>
                {statusMsg && <p className="text-sm text-indigo-600 animate-pulse mb-4">{statusMsg}</p>}
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto"/>
              </div>
            )}
            {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 text-red-700 flex items-center gap-2"><AlertTriangle className="w-5 h-5 shrink-0"/><span>{error}</span></div>}
            {!loading && !results.length && !error && (
              <div className="bg-white rounded-2xl p-16 shadow-lg text-center">
                <Target className="w-16 h-16 mx-auto text-indigo-200 mb-4"/>
                <h3 className="text-xl font-bold text-slate-700 mb-2">الرادار جاهز</h3>
                <p className="text-slate-400">اختر السوق والمجال واضغط مسح السوق الآن</p>
                <p className="text-xs text-indigo-400 mt-2">يستخدم Gemini 2.0 Flash + Google Search لبيانات حقيقية</p>
              </div>
            )}
            {results.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4" dir="rtl">
                  <h2 className="text-xl font-bold text-slate-800">المنتجات المكتشفة ({results.length})</h2>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3"/>بيانات Google حقيقية</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((p, i) => <ProductCard key={i} product={p} market={market}/>)}
                </div>
              </div>
            )}
          </div>
          <div className="lg:w-72 lg:sticky lg:top-4 self-start">
            <div className="bg-white rounded-2xl p-5 shadow-lg" dir="rtl">
              <h3 className="text-base font-bold text-slate-800 mb-4">فلاتر البحث</h3>
              <div className="mb-3">
                <label className="text-xs text-slate-500 block mb-1">الدولة</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={market} onChange={(e) => setMarket(e.target.value)}>{markets.map((m) => <option key={m}>{m}</option>)}</select>
              </div>
              <div className="mb-3">
                <label className="text-xs text-slate-500 block mb-1">المجال</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={niche} onChange={(e) => setNiche(e.target.value)}>{niches.map((n) => <option key={n}>{n}</option>)}</select>
              </div>
              <div className="mb-3">
                <label className="text-xs text-slate-500 block mb-1">عدد المنتجات: {productCount}</label>
                <input type="range" min={1} max={8} value={productCount} onChange={(e) => setProductCount(Number(e.target.value))} className="w-full accent-indigo-600"/>
              </div>
              <div className="mb-4">
                <label className="text-xs text-slate-500 block mb-1">Gemini API Key</label>
                <input type="password" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={geminiKey} onChange={(e) => { setGeminiKey(e.target.value); localStorage.setItem('geminiKey', e.target.value); }} placeholder="AIza..."/>
              </div>
              <button onClick={scanMarket} disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin"/>جاري البحث...</> : <>مسح السوق الآن</>}
              </button>
              <p className="text-xs text-slate-400 text-center mt-2">Gemini 2.0 Flash + Google Search</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
