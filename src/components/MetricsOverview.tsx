import React, { useState, useEffect } from "react";
import { EnergyMetric, EconomicShock } from "../types";
import { Zap, ShieldCheck, Thermometer, Database, Coins, FileText, ArrowUpRight } from "lucide-react";
import { HHV_HYDROGEN_J_PER_GRAM } from "../data/simulation";

interface MetricsOverviewProps {
  metrics: EnergyMetric[];
  walletBalance: number;
  totalHBCSupply: number;
}

export default function MetricsOverview({ metrics, walletBalance, totalHBCSupply }: MetricsOverviewProps) {
  const currentMetric = metrics[metrics.length - 1] || {
    thoriumEnergyOutputMW: 8.4,
    thoriumTemperatureC: 382.4,
    hydrogenProductionG2s: 4.8,
    ammoniaStorageKg: 14220,
    pegIndex: 1.02,
    marketPriceUSD: 3.12,
  };

  // State to simulate system analysis
  const [activeAnalysisField, setActiveAnalysisField] = useState<string>("thorium");

  // Calculate thermodynamic values
  const currentHydrogenGramsInSystem = currentMetric.ammoniaStorageKg * 176; // Approximation for hydrogen equivalent
  const totalJoulesOfSystem = currentHydrogenGramsInSystem * HHV_HYDROGEN_J_PER_GRAM;

  return (
    <div className="space-y-6" id="metrics-dashboard">
      {/* Real-time Telemetry Headline */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-800 p-4 rounded-lg">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 italic">
            <span className="w-1 h-3 bg-sky-500 block"></span>
            ریئل ٹائم تھرمو ڈائنامک ٹریکنگ (Terrestrial Telemetry)
          </h2>
          <p className="text-[11px] text-slate-500 mt-1 font-mono uppercase">
            Thermodynamic live outputs registered from closed-loop Thorium thermal units and Solar electrolyzers.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 rounded">
            SYSTEM STATUS: SAFE
          </span>
          <span className="text-[10px] font-mono px-2.5 py-1 bg-slate-900 text-slate-400 border border-slate-800 rounded">
            PEG STATUS: ±{((currentMetric.pegIndex - 1.0) * 100).toFixed(2)}% STABLE
          </span>
        </div>
      </div>

      {/* Grid of Key Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Thorium Baseload */}
        <div 
          onClick={() => setActiveAnalysisField("thorium")}
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            activeAnalysisField === "thorium" 
              ? "bg-slate-900 border-sky-500 shadow-md shadow-sky-950/20" 
              : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex justify-between items-start text-[10px] text-slate-500 font-mono tracking-wider">
            <span>THORIUM OUTPUT</span>
            <Thermometer className="w-4 h-4 text-sky-405 text-sky-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-white leading-none tracking-tight mt-2.5">
            {currentMetric.thoriumEnergyOutputMW.toFixed(1)}<span className="text-xs text-slate-500 font-normal ml-1">MW</span>
          </p>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2.5 font-mono">
            <span>Core Temp: {currentMetric.thoriumTemperatureC.toFixed(1)}°C</span>
            <span className="text-sky-400 font-bold uppercase text-[9px]">BASELOAD</span>
          </div>
        </div>

        {/* Card 2: Green H2 Rate */}
        <div 
          onClick={() => setActiveAnalysisField("hydrogen")}
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            activeAnalysisField === "hydrogen" 
              ? "bg-slate-900 border-emerald-555 border-emerald-500 shadow-md shadow-emerald-950/20" 
              : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex justify-between items-start text-[10px] text-slate-500 font-mono tracking-wider">
            <span>H2 SPLITTING RATE</span>
            <Zap className="w-4 h-4 text-emerald-450 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-white leading-none tracking-tight mt-2.5">
            {currentMetric.hydrogenProductionG2s.toFixed(2)}<span className="text-xs text-slate-500 font-normal ml-1">g/s</span>
          </p>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2.5 font-mono">
            <span>Mint Rate: {(currentMetric.hydrogenProductionG2s * 60).toFixed(0)} HBC/min</span>
            <span className="text-emerald-400 font-bold uppercase text-[9px]">ACTIVE</span>
          </div>
        </div>

        {/* Card 3: Storage (Ammonia) */}
        <div 
          onClick={() => setActiveAnalysisField("storage")}
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            activeAnalysisField === "storage" 
              ? "bg-slate-900 border-amber-500 shadow-md shadow-amber-950/20" 
              : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex justify-between items-start text-[10px] text-slate-500 font-mono tracking-wider">
            <span>THERMAL STORAGE</span>
            <Database className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-bold font-mono text-white leading-none tracking-tight mt-2.5">
            {currentMetric.ammoniaStorageKg.toLocaleString()}<span className="text-xs text-slate-500 font-normal ml-1">kg</span>
          </p>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2.5 font-mono">
            <span>Potential: {(totalJoulesOfSystem / 1e9).toFixed(1)} GJ</span>
            <span className="text-amber-500 font-bold uppercase text-[9px]">NH3 STOCK</span>
          </div>
        </div>

        {/* Card 4: Thermodynamic Peg */}
        <div 
          onClick={() => setActiveAnalysisField("peg")}
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            activeAnalysisField === "peg" 
              ? "bg-slate-900 border-indigo-500 shadow-md shadow-indigo-950/20" 
              : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex justify-between items-start text-[10px] text-slate-500 font-mono tracking-wider">
            <span>THERMODYNAMIC PEG</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-white leading-none tracking-tight mt-2.5">
            {currentMetric.pegIndex.toFixed(3)}<span className="text-xs text-slate-500 font-normal ml-1">idx</span>
          </p>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2.5 font-mono">
            <span>Target: 1.000 (1g H2 / token)</span>
            <span className="text-indigo-400 font-bold uppercase text-[9px]">BACKSTOPPED</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic SVG Visualizer Chart */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                <span className="w-1 h-3 bg-sky-500 block"></span>
                Thermodynamic Stabilization Curve
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 font-mono uppercase">
                HBC supply matching system thermodynamic capacity.
              </p>
            </div>
            <div className="flex gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 inline-block rounded-full"></span>H2 Production Rate</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-cyan-400 inline-block rounded-full"></span>Thorium Load</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-400 inline-block rounded-full"></span>Peg Backstop Index</span>
            </div>
          </div>

          {/* SVG Chart Drawing */}
          <div className="h-60 w-full relative bg-slate-950/50 rounded-lg p-2 border border-slate-800/80">
            <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4,4" />
              {/* Vertical grids */}
              {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4,4" />
              ))}

              {/* Data Lines */}
              {/* Path 1: H2 Production Rate (Emerald) */}
              <path
                d={metrics.reduce((acc, m, idx) => {
                  const x = (idx / (metrics.length - 1 || 1)) * 500;
                  // Map hydrogen rate (0 to 10 g/s) to vertical (200 down to 20)
                  const val = m.hydrogenProductionG2s;
                  const y = 180 - (val / 10) * 150;
                  return acc + `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                }, "")}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                className="transition-all duration-500 ease-in-out"
              />

              {/* Path 2: Thorium Energy baseload (Cyan) */}
              <path
                d={metrics.reduce((acc, m, idx) => {
                  const x = (idx / (metrics.length - 1 || 1)) * 500;
                  // Map thorium output (0 to 20 MW) to vertical (200 down to 20)
                  const val = m.thoriumEnergyOutputMW;
                  const y = 180 - (val / 20) * 150;
                  return acc + `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                }, "")}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeDasharray="3,2"
                className="transition-all duration-500 ease-in-out"
              />

              {/* Path 3: Peg ratio (Violet) */}
              <path
                d={metrics.reduce((acc, m, idx) => {
                  const x = (idx / (metrics.length - 1 || 1)) * 500;
                  // Map peg index (0.8 to 1.2) to vertical (200 down to 20)
                  const val = m.pegIndex;
                  const y = 180 - ((val - 0.8) / 0.4) * 150;
                  return acc + `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                }, "")}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                className="transition-all duration-500 ease-in-out"
              />

              {/* Data points for current index */}
              {metrics.length > 0 && (() => {
                const lastIdx = metrics.length - 1;
                const lx = 500;
                const lyH2 = 180 - (currentMetric.hydrogenProductionG2s / 10) * 150;
                const lyTh = 180 - (currentMetric.thoriumEnergyOutputMW / 20) * 150;
                const lyPeg = 180 - ((currentMetric.pegIndex - 0.8) / 0.4) * 150;
                return (
                  <>
                    <circle cx={lx - 10} cy={lyH2} r="4" fill="#10b981" />
                    <circle cx={lx - 10} cy={lyTh} r="4" fill="#22d3ee" />
                    <circle cx={lx - 10} cy={lyPeg} r="4" fill="#6366f1" />
                  </>
                );
              })()}
            </svg>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[8px] text-slate-500 font-mono">
              <span>SIMULATION ORIGIN</span>
              <span>LIVE INTERVAL (UPDATE EVERY 10s)</span>
              <span>STABILIZED REAL-TIME STATUS</span>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center text-xs text-slate-400">
            <span>تھرمو ڈائنامک ویلیو ایشن اصول:</span>
            <span className="font-mono text-emerald-400 text-[11px]">
              1 HBC = 1g Hydrogen SPLIT = {HHV_HYDROGEN_J_PER_GRAM.toLocaleString()} Joules thermal baseline
            </span>
          </div>
        </div>

        {/* Economics Interpretation Box */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic mb-3">
              <span className="w-1 h-3 bg-emerald-500 block"></span>
              بائیوفزیکل اکنامکس گائیڈ
            </h3>

            {/* Simulated analytics based on selected state */}
            {activeAnalysisField === "thorium" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 font-semibold bg-sky-950/20 p-2 rounded border border-sky-900/40">
                  تھوریم اسٹینڈرڈ (The Thorium Reserve standard):
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  یہ فیاٹ کرنسی (کاغذی نوٹ جن کی پشت پر کچھ نہیں ہوتا) اور روایتی سونا (Gold) دونوں سے برتر ہے۔ سونا معیشت میں براہ راست کوئی مادی یا حرکی کام انجام نہیں دیتا، جبکہ تھوریم ایک فزیکل توانائی کا منبع ہے جو براہ راست تھرمو ڈائنامک کام کر کے ہائیڈروجن تیار کر سکتا ہے۔
                </p>
                <div className="p-2 bg-slate-950 rounded font-mono text-[10px] space-y-1 text-slate-400 border border-slate-850">
                  <span className="text-sky-400">Thorium Density Rating:</span>
                  <br />
                  1 kg Th-232 &asymp; 24,000,000 thermal kWh.
                  <br />
                  This physical density secures national currency pegging against sudden supply line breaks or geopolitical sanctions.
                </div>
              </div>
            )}

            {activeAnalysisField === "hydrogen" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 font-semibold bg-emerald-950/20 p-2 rounded border border-emerald-950">
                  ہائیڈروجن مانیٹری اینکر (H2 Mass Peg):
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  ہماری کرنسی کا اکلوتا فکسڈ فارمولا ہے: **1 HBC ٹوکن = 1 گرام ہائیڈروجن**۔ ہائیڈروجن کائنات کا سب سے متبادل فزیکل مادہ ہے۔ اس کی مائننگ صرف پانی کو اسپلٹ (Solvolysis) کرنے سے ہی ممکن ہے، جس کے لیے حقیقی انرجی (جولز) درکار ہوتی ہے۔
                </p>
                <div className="p-2 bg-slate-950 rounded font-mono text-[10px] space-y-1 text-slate-400 border border-slate-850">
                  <span className="text-emerald-400">Valuation Equation:</span>
                  <br />
                  &Delta;Supply_HBC = Splitting(Solar_Joules + Thorium_Joules) &times; Efficiency_PEM
                  <br />
                  This forces capital availability to perfectly track real-world physical thermodynamic development output.
                </div>
              </div>
            )}

            {activeAnalysisField === "storage" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 font-semibold bg-amber-950/20 p-2 rounded border border-amber-900/30">
                  امونیا اسٹوریج بفر (Buffer Reserve):
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  گیس ہائیڈروجن کو طویل عرصے تک ذخیرہ رکھنا مشکل ہوتا ہے۔ اسی لیے اس مانیٹری سسٹم میں اضافی ہائیڈروجن کو نائٹروجن کے ساتھ ملا کر **مائع امونیا (Liquid Ammonia)** کی حالت میں تبدیل کیا جاتا ہے۔ یہ امونیا مانیٹری سسٹم کا ایک غیر متزلزل فزیکل انرجی بفر (Buffer) بن جاتا ہے۔
                </p>
                <div className="p-2 bg-slate-950 rounded font-mono text-[10px] space-y-1 text-slate-400 border border-slate-850">
                  <span className="text-amber-400">Ammonia Energy Density:</span>
                  <br />
                  Energy Equivalent of stored NH3 behaves as an physical savings vault, preventing sudden inflation.
                </div>
              </div>
            )}

            {activeAnalysisField === "peg" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 font-semibold bg-indigo-950/20 p-2 rounded border border-indigo-900/30">
                  تھرمو ڈائنامک سٹیبلائزیشن اشاریہ:
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  اگر معیشت میں ٹوکنز کی تعداد فزیکل گرام آف ہائیڈروجن اور تھوریم انرجی پٹنشل سے زائد ہونے لگے، تو پیگ انڈیکس گرنے لگتا ہے، جس سے مائننگ کی فیس (Splitting difficulty) بڑھ جاتی ہے۔ یہ فیڈ بیک لوپ مہنگائی (Inflation) کو ناممکن بنا دیتا ہے۔
                </p>
                <div className="p-2 bg-slate-950 rounded font-mono text-[10px] space-y-1 text-slate-400 border border-slate-850">
                  <span className="text-indigo-400">Sovereign Peg Range:</span>
                  <br />
                  Feedback Loop prevents currency devaluation, restricting central banks from printing credits without real Joule-producing assets in core reserves.
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>تصدیق شدہ مانیٹری ریزرو:</span>
              <span className="font-mono text-slate-200">1,500,000 kg Th-232</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>سسٹم میں گردش پذیر HBC:</span>
              <span className="font-mono text-slate-205 text-emerald-400 font-bold">
                {totalHBCSupply.toLocaleString()} HBC
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>آپ کا ذاتی پرس بفر:</span>
              <span className="font-mono text-slate-200">{walletBalance.toFixed(2)} HBC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Physics-Backed Stability Simulator Stats */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 space-y-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 animate-pulse">
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          معیشت کا تھرمو ڈائنامک پائیداری کا موازنہ (System Comparative Analysis)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded border border-slate-800/80">
            <p className="font-semibold text-white mb-1 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Fiat System
            </p>
            <p className="text-slate-500 leading-relaxed text-[11px] font-sans font-light">
              غیر محدود تخلیق (Unlimited printing)، صفر طبعی ریزرو، مسلسل افراطِ زر (Devaluation)، اور سیاسی قرضوں پر معیشت کا سارا انحصار۔
            </p>
            <div className="mt-2 text-[10px] text-rose-500 font-semibold uppercase">CAPITAL INFLATION RISK: CRITICAL</div>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800/80">
            <p className="font-semibold text-white mb-1 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Gold Standard
            </p>
            <p className="text-slate-500 leading-relaxed text-[11px] font-sans font-light">
              محدود لیکن معاشی کام (Thermodynamic Work) سے عاری۔ محض سادگی پر مبنی اینکر جو جدید صنعتی توانائی اور نیٹ ورک کی مادی ترقی کے مطابق ایڈجسٹ نہیں ہو سکتا۔
            </p>
            <div className="mt-2 text-[10px] text-amber-505 text-amber-500 font-semibold uppercase">SUPPLY LAYER: STAGNANT</div>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-emerald-950/80">
            <p className="font-semibold text-emerald-400 mb-1 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Thorium H2 Standard
            </p>
            <p className="text-slate-500 leading-relaxed text-[11px] font-sans font-light">
              مکمل ثبوت (bPoW)۔ کرنسی کی رسد، حقیقی ہائیڈروجن پیداوار اور جوہری baseline صلاحیت کے بالکل متناسب رہتی ہے۔ افراطِ زر ناممکن ہے۔
            </p>
            <div className="mt-2 text-[10px] text-emerald-400 font-semibold uppercase">THERMAL PARITY: IMMUTABLE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
