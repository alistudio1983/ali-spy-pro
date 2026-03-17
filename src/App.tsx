import { useState } from 'react';
import { Search, TrendingUp, Globe, Calculator, BarChart3, Eye, Filter, Download } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface AdResult {
  id: string;
  advertiser: string;
  product: string;
  country: string;
  platform: string;
  impressions: string;
  startDate: string;
  keywords: string[];
  adUrl: string;
  status: 'active' | 'inactive';
}

interface BreakEvenData {
  sellingPrice: number;
  productCost: number;
  shippingCost: number;
  deliveryCost: number;
  codFee: number;
  processingFeeConfirmed: number;
  processingFeeDelivered: number;
  cpl: number;
  confirmationRate: number;
  deliveryRate: number;
}

const MARKETS = [
  { code: 'SA', name: 'السعودية', flag: '🇸🇦' },
  { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
  { code: 'AE', name: 'الإمارات', flag: '🇦🇪' },
  { code: 'MA', name: 'المغرب', flag: '🇲🇦' },
  { code: 'IQ', name: 'العراق', flag: '🇮🇶' },
  { code: 'OM', name: 'عمان', flag: '🇴🇲' },
];

const COD_KEYWORDS = [
  'الدفع عند الاستلام',
  'توصيل مجاني',
  'شحن مجاني',
  'اطلبي الآن',
  'اطلب الآن',
  'عرض محدود',
  'خصم',
  'COD',
  'كاش عند التوصيل',
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'spy' | 'tiktok' | 'calculator' | 'analysis'>('spy');
  const [selectedMarket, setSelectedMarket] = useState('SA');
  const [searchKeyword, setSearchKeyword] = useState('الدفع عند الاستلام');
  const [dateFrom, setDateFrom] = useState('2026-03-13');
  const [sortBy, setSortBy] = useState('total_impressions');
  const [apiKey, setApiKey] = useState('');
  const [geminiResult, setGeminiResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [beData, setBeData] = useState<BreakEvenData>({
    sellingPrice: 199,
    productCost: 25,
    shippingCost: 2.99,
    deliveryCost: 2.0,
    codFee: 5,
    processingFeeConfirmed: 1.0,
    processingFeeDelivered: 2.0,
    cpl: 1.5,
    confirmationRate: 60,
    deliveryRate: 75,
  });

  const getFbAdLibraryUrl = () => {
    return `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${selectedMarket}&is_targeted_country=false&media_type=all&q=${encodeURIComponent(searchKeyword)}&search_type=keyword_unordered&sort_data[mode]=${sortBy}&sort_data[direction]=desc&start_date[min]=${dateFrom}`;
  };

  const getTikTokTopAdsUrl = () => {
    return `https://ads.tiktok.com/business/creativecenter/inspiration/topads/pad/en?period=30&region=${selectedMarket}`;
  };

  const calculateBreakEven = () => {
    const { sellingPrice, productCost, shippingCost, deliveryCost, codFee, processingFeeConfirmed, processingFeeDelivered, cpl, confirmationRate, deliveryRate } = beData;
    const cr = confirmationRate / 100;
    const dr = deliveryRate / 100;
    const codFeeAmount = (sellingPrice * codFee) / 100;
    const revenuePerAd = sellingPrice * dr * cr;
    const costPerConfirmed = cpl / cr;
    const totalCostPerDelivered = productCost + shippingCost + deliveryCost + codFeeAmount + processingFeeConfirmed + processingFeeDelivered;
    const profitPerDelivered = sellingPrice - totalCostPerDelivered;
    const profitPerLead = profitPerDelivered * cr * dr - cpl;
    const breakEvenDR = (cpl + (productCost + shippingCost + processingFeeConfirmed) * cr) / (cr * (sellingPrice - deliveryCost - codFeeAmount - processingFeeDelivered));
    return {
      profitPerDelivered: profitPerDelivered.toFixed(2),
      profitPerLead: profitPerLead.toFixed(2),
      breakEvenDR: (breakEvenDR * 100).toFixed(1),
      costPerConfirmed: costPerConfirmed.toFixed(2),
      totalCostPerDelivered: totalCostPerDelivered.toFixed(2),
      revenuePerAd: revenuePerAd.toFixed(2),
    };
  };

  const analyzeWithGemini = async () => {
    if (!apiKey) { alert('ضع Gemini API Key أولاً'); return; }
    setIsAnalyzing(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const calc = calculateBreakEven();
      const prompt = `أنت خبير تجارة إلكترونية متخصص في الأسواق العربية ونظام الدفع عند الاستلام (COD).

بيانات المنتج:
- سعر البيع: ${beData.sellingPrice} ريال
- تكلفة المنتج: ${beData.productCost} ريال
- رسوم الشحن: ${beData.shippingCost} ريال
- رسوم التوصيل: ${beData.deliveryCost} ريال
- رسوم COD: ${beData.codFee}%
- CPL (تكلفة اللود): ${beData.cpl} ريال
- معدل التأكيد: ${beData.confirmationRate}%
- معدل التوصيل (DR): ${beData.deliveryRate}%

النتائج المحسوبة:
- ربح لكل طلب مسلم: ${calc.profitPerDelivered} ريال
- ربح لكل لود: ${calc.profitPerLead} ريال
- Break-Even DR: ${calc.breakEvenDR}%
- تكلفة اللود المؤكد: ${calc.costPerConfirmed} ريال

اعطني تحليلاً شاملاً يشمل:
1. هل المنتج مربح؟ ولماذا؟
2. نقطة التعادل بالتفصيل
3. 3 سيناريوهات (متفائل، واقعي، متشائم)
4. توصيات لتحسين الربحية
5. مؤشرات الخطر والفرص

الرد باللغة العربية وبصيغة جدول وفقرات واضحة.`;
      const result = await model.generateContent(prompt);
      setGeminiResult(result.response.text());
    } catch (e) {
      setGeminiResult('خطأ في الاتصال بـ Gemini. تأكد من صحة الـ API Key.');
    }
    setIsAnalyzing(false);
  };

  const be = calculateBreakEven();

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 border-b border-purple-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ALi Spy Pro V2.5</h1>
              <p className="text-purple-300 text-xs">E-commerce Spy Tool for Arab Markets (COD)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm w-48 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 pt-2">
          {[
            { id: 'spy', label: '
