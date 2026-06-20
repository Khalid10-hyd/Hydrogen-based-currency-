import React, { useState } from "react";
import { EconomicShock, EnergyMetric } from "../types";
import { INITIAL_ECONOMIC_SHOCKS } from "../data/simulation";
import { ShieldAlert, TrendingUp, TrendingDown, RefreshCw, BarChart2, Check, AlertOctagon } from "lucide-react";

interface TradingDashboardProps {
  metrics: EnergyMetric[];
  onTriggerShockEffect: (shockId: string, apply: boolean) => void;
  onTradeSimulate: (type: 'buy' | 'sell', amount: number) => void;
}

export default function TradingDashboard({ metrics, onTriggerShockEffect, onTradeSimulate }: TradingDashboardProps) {
  const [shocks, setShocks] = useState<EconomicShock[]>(INITIAL_ECONOMIC_SHOCKS);
  const [tradeAmount, setTradeAmount] = useState<string>("10");
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeStatus, setTradeStatus] = useState<string>("");

  const currentMetric = metrics[metrics.length - 1];
  const h2CommodityPriceUSD = 4.25; // Base commodity price per kg for green hydrogen

  const handleApplyShock = (shockId: string) => {
    const updatedShocks = shocks.map((s) => {
      if (s.id === shockId) {
        const nextState = !s.applied;
        onTriggerShockEffect(shockId, nextState);
        return { ...s, applied: nextState };
      }
      return s;
    });
    setShocks(updatedShocks);
  };

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setTradeStatus("");

    const val = parseFloat(tradeAmount);
    if (isNaN(val) || val <= 0) {
      setTradeStatus("برائے مہربانی درست رقم درج کریں۔");
      return;
    }

    onTradeSimulate(tradeType, val);
    setTradeStatus(`کامیابی: آپ نے ${val} HBC ٹوکنز کے برابر ${tradeType === 'buy' ? 'ہائیڈروجن خرید لی' : 'ہائیڈروجن بیچی'}۔ تھرمو پیگ فوری طور پر سنبھل گیا!`);
    setTimeout(() => setTradeStatus(""), 5000);
  };

  return (
    <div className="space-y-6" id="trading-shocks-dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Economic Shocks Simulator Workspace */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-lg p-6 shadow-xl">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
              <span className="w-1 h-3 bg-amber-500 block"></span>
              میکرو اکنامک شاکس سینڈ باکس (Sovereign Economic Shock Center)
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Test the thermodynamic monetary standard. Inject physical supply disruption and observe real-time stabilization loops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {shocks.map((shock) => (
              <div 
                key={shock.id} 
                className={`p-4 rounded-lg border transition-all ${
                  shock.applied 
                    ? "bg-red-950/20 border-red-800/80 shadow-md shadow-red-950/10" 
                    : "bg-slate-950/40 border-slate-850/80 hover:border-slate-800"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 font-sans">
                      {shock.applied && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>}
                      {shock.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-light font-sans">
                      {shock.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleApplyShock(shock.id)}
                    className={`py-1 px-2.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
                      shock.applied 
                        ? "bg-red-500 hover:bg-red-600 text-slate-950" 
                        : "bg-slate-800 hover:bg-slate-705 text-slate-205"
                    }`}
                  >
                    {shock.applied ? "Shock Active" : "Apply Shock"}
                  </button>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] flex gap-1.5 items-start font-mono">
                  <span className="font-bold text-cyan-400 shrink-0">THERMAL RESOLUTION:</span>
                  <span className="text-slate-400 italic">
                    {shock.applied ? shock.effectLabel : "Waiting for activation trigger..."}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Hydrogen Commodity Exchange (Global trading mock) */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic mb-4">
              <span className="w-1 h-3 bg-emerald-500 block"></span>
              عالمی انرجی کموڈٹی ایکسچینج (Commodity Counter)
            </h3>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">GREEN H₂ SPOT PRICE:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  ${(h2CommodityPriceUSD * (currentMetric?.pegIndex || 1.0)).toFixed(2)} / kg
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">EQUIVALENT HBC INDEX QUOTE:</span>
                <span className="font-mono text-cyan-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {(1 / (currentMetric?.pegIndex || 1.0)).toFixed(4)} HBC / g
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">BACKSTOP YIELD:</span>
                <span className="font-mono text-violet-400 text-right">
                  {((currentMetric?.pegIndex || 1.0) * 141.8).toFixed(1)} MJ (HHV)
                </span>
              </div>
            </div>

            {/* Trading Submission Portal */}
            <form onSubmit={handleExecuteTrade} className="mt-6 space-y-4">
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
                <button
                  type="button"
                  onClick={() => setTradeType('buy')}
                  className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer font-mono uppercase tracking-wide ${
                    tradeType === 'buy' 
                      ? "bg-emerald-500 text-slate-950" 
                      : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  Buy Hydrogen
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('sell')}
                  className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer font-mono uppercase tracking-wide ${
                    tradeType === 'sell' 
                      ? "bg-red-500 text-slate-950" 
                      : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  Sell Hydrogen
                </button>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-mono mb-1.5 uppercase tracking-wider">Amount of Hydrogen (Grams)</label>
                <div className="relative font-mono">
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">grams</span>
                </div>
              </div>

              {tradeStatus && (
                <p className="text-[11px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg leading-relaxed font-sans">
                  {tradeStatus}
                </p>
              )}

              <button
                type="submit"
                className={`w-full py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  tradeType === 'buy' 
                    ? "bg-emerald-500 hover:bg-emerald-600 text-slate-900" 
                    : "bg-red-500 hover:bg-red-600 text-slate-900"
                }`}
              >
                {tradeType === 'buy' ? "خریدیں (Lock Backing)" : "فروخت کریں (Liquidate Reserve)"}
              </button>
            </form>
          </div>

          <div className="text-[9px] text-slate-500 font-mono mt-4 pt-4 border-t border-slate-800 text-center uppercase tracking-wider">
            Sovereign Market feeds synchronized via Peshawar Commodity Desk &bull; Terrestrial Lock
          </div>
        </div>

      </div>

      {/* Stability proof explain box */}
      <div className="p-4 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center gap-3">
        <AlertOctagon className="w-5 h-5 text-cyan-400 shrink-0" />
        <div className="text-[11px] leading-relaxed text-slate-400 font-sans">
          <span className="font-semibold text-slate-300">تھرمل توازن کا قاعدہ (The Feedback Loop Mechanism):</span> جب اوپر سے کوئی شاک (مثال کے طور پر شدید مٹی کا طوفان) سولر پینل کو متاثر کرتا ہے، تو ہائیڈروجن کی سپلائی سست ہو جاتی ہے، جس کے برعکس تھوریم تھرمل سے پیدا ہونے والی بیس لوڈ انرجی مانیٹری پیگ کی حفاظت کرتی ہے۔ یہ کثیر الجہتی فزیکل ریزرو تحفظ فیاٹ ڈیویلیوایشن کے خلاف ایک سپر بفر ثابت ہوتا ہے۔
        </div>
      </div>
    </div>
  );
}
