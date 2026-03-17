import React, { useState, useEffect } from 'react';
import { Search, Globe, Target, Camera, TrendingUp, Loader2, AlertTriangle, Heart, MessageCircle, Activity, ShoppingBag, Video, Play } from 'lucide-react';

// يتم توفير مفتاح Gemini تلقائياً من بيئة التشغيل
const apiKey = "";

// دالة جلب الصور (Pexels أو Google أو الذكاء الاصطناعي)
const fetchImage = async (keyword, pexelsKey) => {
  const safeKeyword = keyword || "ecommerce product";
  // محاولة 1: Pexels API
  if (pexelsKey && pexelsKey.trim() !== "") {
    try {
      const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(safeKeyword)}&per_page=1&orientation=landscape`, {
        headers: { Authorization: pexelsKey }
      });
      const data = await res.json();
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.large;
      }
    } catch (e) {
      console.error("فشل جلب الصورة من Pexels، سيتم استخدام البديل", e);
    }
  }
    // البديل: صور حقيقية من Unsplash
    return `https://loremflickr.com/600/400/${encodeURIComponent(safeKeyword)},product`;

  };

// مكون بطاقة المنتج
const ProductCard = ({ product, pexelsKey }) => {
  const [imgUrl, setImgUrl] = useState("");

  // حماية البيانات من التسبب في توقف التطبيق
  const productName = product.product_name || "منتج غير معروف";
  const category = product.category || "عام";
  const imageKeyword = product.image_keyword || productName;
  const saturation = product.saturation || "متوسط";
  const audience = product.target_audience || "الجميع";
  const whyWinning = product.why_winning || "منتج مطلوب بشدة في السوق الحالي";
  const costPrice = product.cost_price || 0;
  const sellingPrice = product.selling_price || 0;
  const profitMargin = product.profit_margin || 0;
  const likes = product.engagement_likes || "10K";
  const comments = product.engagement_comments || "500";
  const fbQuery = product.fb_search_query || productName;
  const aliQuery = product.aliexpress_query || productName;

  useEffect(() => {
    const getImg = async () => {
      const url = await fetchImage(imageKeyword, pexelsKey);
      setImgUrl(url);
    };
    getImg();
  }, [imageKeyword, pexelsKey]);

  const getSaturationColor = (level) => {
    const safeLevel = level || "";
    if (safeLevel.includes("منخفض") || safeLevel.includes("Low")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (safeLevel.includes("متوسط") || safeLevel.includes("Medium")) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {imgUrl ? (
          <img src={imgUrl} alt={productName} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow">{category}</div>
        <div className={`absolute top-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full border ${getSaturationColor(saturation)}`}>التشبع: {saturation}</div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-3 leading-relaxed">{productName}</h3>
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span className="flex items-center gap-1 text-rose-500"><Heart className="w-4 h-4" fill="currentColor" /> +{likes}</span>
          <span className="flex items-center gap-1 text-blue-500"><MessageCircle className="w-4 h-4" /> +{comments}</span>
          <span className="flex items-center gap-1 text-emerald-500"><TrendingUp className="w-4 h-4" /> Trend</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-50 rounded-xl p-3 text-center"><div className="text-xs text-slate-500 mb-1">سعر المورد</div><div className="text-lg font-bold text-slate-700">${costPrice}</div></div>
          <div className="bg-blue-50 rounded-xl p-3 text-center"><div className="text-xs text-blue-500 mb-1">سعر البيع</div><div className="text-lg font-bold text-blue-600">${sellingPrice}</div></div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center"><div className="text-xs text-emerald-500 mb-1">هامش الربح</div><div className="text-lg font-bold text-emerald-600">${profitMargin}</div></div>
        </div>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed"><strong>💡 لماذا ينجح؟</strong> {whyWinning}</p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <a href={`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${encodeURIComponent(fbQuery)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-3 rounded-xl transition-colors"><Search className="w-4 h-4" /> إعلانات فيسبوك</a>
          <a href={`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(aliQuery)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2.5 px-3 rounded-xl transition-colors"><ShoppingBag className="w-4 h-4" /> علي إكسبريس</a>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a href={`https://ads.tiktok.com/business/creativecenter/inspiration/topads/pad/en?period=30&region=SA&keyword=${encodeURIComponent(fbQuery)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-bold py-2.5 px-3 rounded-xl transition-colors"><Play className="w-4 h-4" /> TikTok Ads</a>
          <a href={`https://forbusiness.snapchat.com/advertising?q=${encodeURIComponent(fbQuery)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold py-2.5 px-3 rounded-xl transition-colors"><Video className="w-4 h-4" /> Snapchat Ads</a>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [market, setMarket] = useState("المملكة العربية السعودية (KSA)");
  const [niche, setNiche] = useState("منتجات حل المشاكل اليومية");
  const [productCount, setProductCount] = useState(4);
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem("geminiKey") || "");   const [pexelsKey, setPexelsKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const markets = ["المملكة العربية السعودية (KSA)", "الإمارات العربية المتحدة (UAE)", "المغرب (Morocco)", "سلطنة عمان (Oman)", "الكويت (Kuwait)", "مصر (Egypt)", "الخليج العربي عموماً"];
  const niches = ["منتجات حل المشاكل اليومية", "مستحضرات التجميل والعناية بالبشرة", "أدوات المطبخ والمنزل الذكية", "اكسسوارات وعناية السيارات", "منتجات الصحة والراحة", "منتجات الأطفال والألعاب الذكية"];

  const scanMarket = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    const keyToUse = geminiKey || apiKey || "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${keyToUse}`;
    const promptText = `أنت خوارزمية ذكية متخصصة في تحليل التجارة الإلكترونية وتعمل كأداة تجسس (Spy Tool) مشابهة لـ SellTheTrend. قم بتحليل السوق في "${market}" وتحديداً في نيتش "${niche}". استخرج ${productCount} منتجات فعلية، محددة جداً، ورابحة (Winning Products) حالياً في هذا السوق بنظام الدفع عند الاستلام (COD). يجب أن تقوم بمحاكاة وتقدير الأرقام بذكاء كما تفعل أدوات التجسس الكبرى. رد فقط بكائن JSON بالشكل {"products": [...]} حيث كل منتج يحتوي على: product_name, category, image_keyword, why_winning, target_audience, cost_price (NUMBER), selling_price (NUMBER), profit_margin (NUMBER), saturation, engagement_likes, engagement_comments, fb_search_query, aliexpress_query. لا تكتب اي نصوص خارج JSON.`;
    const payload = {
      contents: [{ parts: [{ text: promptText }] }]
    };
    let attempt = 0;
    const delays = [1000, 2000, 4000, 8000, 16000];
    let success = false;
    while (attempt < 5 && !success) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`خطأ في الاتصال بالخادم: ${res.status}`);
        const data = await res.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error(data.error?.message || "لم يتم استلام بيانات من الذكاء الاصطناعي");
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(text);
        const productsArray = parsedData.products || parsedData;
        if (!Array.isArray(productsArray)) {
          throw new Error("فشل في تحليل هيكل البيانات المستلمة");
        }
        setResults(productsArray);
        success = true;
      } catch (err) {
        console.error(`محاولة ${attempt + 1} فشلت:`, err);
        if (attempt === 4) {
          setError(err.message || "عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
        } else {
          await new Promise(resolve => setTimeout(resolve, delays[attempt]));
        }
        attempt++;
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white py-6 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black flex items-center gap-3">
                <Target className="w-8 h-8 text-cyan-400" />
                ALI Spy Pro <span className="text-sm bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">V3.0</span>
              </h1>
              <p className="text-blue-200 mt-1 text-sm">لوحة تحكم استخباراتية متقدمة بديلة لـ SellTheTrend. حلل السوق، اكتشف المنتجات، وتجسس على المنافسين.</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full"><Globe className="w-4 h-4" /> الأسواق المدعومة<span className="font-bold text-cyan-300">الوطن العربي</span></div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full"><Activity className="w-4 h-4 text-emerald-400" /> حالة السيرفر<span className="font-bold text-emerald-400">مستقر</span></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 flex gap-6">
        {/* Sidebar / Settings */}
        <aside className="w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2"><Search className="w-5 h-5 text-indigo-600" /> فلاتر البحث المعمق</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">الدولة المستهدفة</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" value={market} onChange={(e) => setMarket(e.target.value)}>
                  {markets.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">المجال (Niche)</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" value={niche} onChange={(e) => setNiche(e.target.value)}>
                  {niches.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">عدد المنتجات المطلوبة &nbsp; <span className="text-indigo-600">{productCount} منتجات</span></label>
                <input type="range" min={1} max={10} value={productCount} onChange={(e) => setProductCount(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1</span><span>10</span></div>
              </div>
                            <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Gemini API Key (مطلوب)</label>
                <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="أدخل مفتاح Gemini هنا..." value={geminiKey} onChange={(e) => { setGeminiKey(e.target.value); localStorage.setItem("geminiKey", e.target.value); }} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Pexels API (للصور الحقيقية)</label>
                <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="أدخل المفتاح هنا..." value={pexelsKey} onChange={(e) => setPexelsKey(e.target.value)} />
              </div>
              <button onClick={scanMarket} disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg">
                {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> جاري استخراج {productCount} منتجات...</>) : (<><Search className="w-5 h-5" /> مسح السوق الآن</>)}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}
          {!loading && results.length === 0 && !error && (
            <div className="text-center py-20">
              <Camera className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400">الرادار جاهز للعمل</h3>
              <p className="text-slate-400 mt-2">اختر السوق والمجال وعدد المنتجات من القائمة الجانبية واضغط على "مسح السوق الآن" لتبدأ الأداة بتحليل السوق.</p>
            </div>
          )}
          {results.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">المنتجات المكتشفة ({results.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((product, idx) => (<ProductCard key={idx} product={product} pexelsKey={pexelsKey} />))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
