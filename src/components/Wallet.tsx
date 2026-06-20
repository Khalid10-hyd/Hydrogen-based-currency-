import React, { useState, useEffect, useRef } from "react";
import { Transaction, WalletStatus } from "../types";
import { Wallet, Settings, Zap, ArrowDownLeft, ArrowUpRight, Plus, Droplets, RotateCw, CheckCircle2 } from "lucide-react";
import { HHV_HYDROGEN_J_PER_GRAM } from "../data/simulation";

interface WalletProps {
  wallet: WalletStatus;
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
  onUpdateBalance: (amountHBC: number) => void;
}

export default function WalletComponent({ wallet, transactions, onAddTransaction, onUpdateBalance }: WalletProps) {
  // Mining state variables
  const [isMining, setIsMining] = useState<boolean>(false);
  const [miningEnergyInput, setMiningEnergyInput] = useState<number>(0); // electric input (Joules)
  const [minedHydrogenGrams, setMinedHydrogenGrams] = useState<number>(0); // generated grams
  const [miningEfficiency, setMiningEfficiency] = useState<number>(65); // percentage (solar/thorium HHV efficiency)
  const [waterLevelProgress, setWaterLevelProgress] = useState<number>(100); // splitting visual bar
  const [oxygenReleasedGrams, setOxygenReleasedGrams] = useState<number>(0); // by-product oxygen

  // Send tokens modal/state
  const [sendAmount, setSendAmount] = useState<string>("");
  const [sendRecipient, setSendRecipient] = useState<string>("");
  const [sendTopic, setSendTopic] = useState<string>("baseload_purchase");
  const [sendError, setSendError] = useState<string>("");
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  const miningIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (miningIntervalRef.current) clearInterval(miningIntervalRef.current);
    };
  }, []);

  const handleStartMining = () => {
    if (isMining) {
      // Stop mining
      setIsMining(false);
      if (miningIntervalRef.current) {
        clearInterval(miningIntervalRef.current);
        miningIntervalRef.current = null;
      }

      // Mint accumulated hydrogen to wallet
      const newlyMinedHBC = Math.floor(minedHydrogenGrams * 100) / 100;
      if (newlyMinedHBC > 0) {
        onUpdateBalance(newlyMinedHBC);
        
        const newTx: Transaction = {
          id: `tx-mine-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: "mine",
          amountHBC: newlyMinedHBC,
          hydrogenGrams: minedHydrogenGrams,
          energyJoules: miningEnergyInput,
          target: "Khyber Solar splitting array",
          status: "success"
        };
        onAddTransaction(newTx);
      }
      
      // Reset simulator values slightly but keep visual metric zeroed
      setMinedHydrogenGrams(0);
      setMiningEnergyInput(0);
      setOxygenReleasedGrams(0);
      setWaterLevelProgress(100);
    } else {
      // Start mining
      setIsMining(true);
      setMinedHydrogenGrams(0);
      setMiningEnergyInput(0);
      setOxygenReleasedGrams(0);
      setWaterLevelProgress(100);

      const updateRateMs = 150;
      miningIntervalRef.current = setInterval(() => {
        setMiningEnergyInput((prev) => prev + 250000); // Consuming Joules of heat/solar heat
        
        // Hydrogen produced mathematically based on HHV and efficiency:
        // Joule Input * Efficiency = Chemical Joule Yield -> grams = Chemical / HHV
        const addedGrams = (250000 * (miningEfficiency / 100)) / HHV_HYDROGEN_J_PER_GRAM;
        setMinedHydrogenGrams((prev) => prev + addedGrams);
        
        // Chemical by-product weight: H2 is split from H2O: 1g H2 yields ~8g Oxygen
        setOxygenReleasedGrams((prev) => prev + addedGrams * 7.94);

        setWaterLevelProgress((prev) => {
          if (prev <= 12) return 100; // Refill water tank automatically
          return prev - 0.8;
        });
      }, updateRateMs);
    }
  };

  const handleSendHBC = (e: React.FormEvent) => {
    e.preventDefault();
    setSendError("");
    setSendSuccess(false);

    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      setSendError("برائے مہربانی درست رقم درج کریں۔");
      return;
    }

    if (amount > wallet.balanceHBC) {
      setSendError("آپ کے والٹ میں مطلوبہ ٹوکنز موجود نہیں ہیں۔");
      return;
    }

    if (!sendRecipient.trim()) {
      setSendError("رسیور کا پتہ یا نوڈ نام دینا لازمی ہے۔");
      return;
    }

    // Process Send Transaction
    onUpdateBalance(-amount);

    const physicalGrams = amount; // 1 Token = 1 gram H2
    const physicalJoules = amount * HHV_HYDROGEN_J_PER_GRAM;

    const newTx: Transaction = {
      id: `tx-send-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: "send",
      amountHBC: amount,
      hydrogenGrams: physicalGrams,
      energyJoules: physicalJoules,
      target: sendRecipient,
      status: "success"
    };

    onAddTransaction(newTx);
    setSendSuccess(true);
    setSendAmount("");
    setSendRecipient("");
    
    setTimeout(() => {
      setSendSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6" id="h-economy-wallet">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Obsidian Wallet Overview Card */}
        <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-lg p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs bg-slate-950 px-3 py-1 font-mono text-emerald-400 border border-slate-800 rounded-full flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5" />
                پرس ہسٹری (HBC Wallet)
              </span>
              <Settings className="w-4 h-4 text-slate-500 hover:text-slate-300 cursor-pointer" />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400">کل توانائی والٹ بیلنس</span>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-bold font-mono tracking-tight text-white italic">
                  {wallet.balanceHBC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <span className="text-sm font-bold text-emerald-400 font-mono tracking-wider uppercase ml-1">HBC</span>
              </div>
            </div>

            {/* Scientific physical equivalents breakdown */}
            <div className="mt-8 space-y-3 pt-6 border-t border-slate-800 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">ہائیڈروجن فزیکل ماس مساوی:</span>
                <span className="font-medium text-slate-200">
                  {wallet.balanceHBC.toFixed(2)}g (H₂)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">تھرمو ڈائنامک کام کی گنجائش:</span>
                <span className="text-emerald-400 font-medium">
                  {((wallet.balanceHBC * HHV_HYDROGEN_J_PER_GRAM) / 1e6).toFixed(3)} MJ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">تھوریم ایندھن برابر بفر:</span>
                <span className="text-cyan-400 font-medium cursor-help" title="Equates to estimated fraction of Thorium required to generate this much hydrogen thermally">
                  {(wallet.balanceHBC * 0.0003).toFixed(5)} mg (Th)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-slate-950 rounded-lg p-3 border border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-950/40 border border-emerald-900 rounded-lg shrink-0">
                <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <div className="text-[11px] leading-snug">
                <p className="font-semibold text-slate-300">مائننگ بائیوفزیکل کام سے مربوط ہے</p>
                <p className="text-slate-500 mt-0.5">ہر 1 ٹوکن مادی ہائیڈروجن کلوگرام ہائیڈروجن اسپیلیٹنگ کے کام کا ثبوت ہے۔</p>
              </div>
            </div>
          </div>
        </div>

        {/* Electrolyzer Splitting & bPoW Mining Simulation */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-lg p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                  <span className="w-1 h-3 bg-emerald-500 block"></span>
                  بائیو فزیکل مائننگ سیمولیٹر (bPoW Electrolyzer SPLIT)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulate verified thermodynamic conversion output. Spend virtual solar-thermal Joules to split water molecules and mint HBC.
                </p>
              </div>

              {/* Adjust efficiency knobs */}
              <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850 text-xs shrink-0 self-end md:self-auto">
                <span className="text-slate-500 font-mono uppercase text-[10px]">Efficiency Mode:</span>
                <select 
                  value={miningEfficiency} 
                  onChange={(e) => setMiningEfficiency(parseInt(e.target.value))}
                  disabled={isMining}
                  className="bg-transparent border-0 text-emerald-400 font-mono font-bold focus:ring-0 cursor-pointer text-xs"
                >
                  <option value={55}>55% LHV Air Cooling</option>
                  <option value={65}>65% Solar PEM Mode</option>
                  <option value={80}>80% Thorium Steam</option>
                  <option value={88}>88% PEM Nanocatalyst</option>
                </select>
              </div>
            </div>

            {/* Visual interactive representation of splitting water */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/40 rounded-lg p-4 border border-slate-800/60">
              
              {/* Splitting reaction chamber visual SVG */}
              <div className="md:col-span-1 bg-slate-950 rounded-lg p-4 border border-slate-850/80 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`absolute rounded-full bg-emerald-400 ${isMining ? "animate-bounce" : ""}`}
                      style={{
                        width: '8px',
                        height: '8px',
                        left: `${15 + i * 15}%`,
                        bottom: `${10 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.25}s`,
                        animationDuration: `${1.5 + Math.random() * 1.5}s`
                      }}
                    ></div>
                  ))}
                </div>
                
                {/* Visual Water Chamber */}
                <div className="w-16 h-28 border-2 border-slate-700 rounded-t-lg rounded-b-2xl flex flex-col justify-end bg-slate-900 overflow-hidden relative">
                  {/* Visual liquid container */}
                  <div 
                    className="w-full bg-cyan-950/80 border-t-2 border-cyan-400 flex items-center justify-center transition-all duration-300 relative"
                    style={{ height: `${waterLevelProgress}%` }}
                  >
                    <span className="text-[10px] font-mono font-bold text-cyan-300 absolute">H₂O</span>
                    
                    {/* Bubbles */}
                    {isMining && (
                      <div className="absolute inset-0 flex justify-around items-end pb-2">
                        <span className="w-1 h-1 bg-white rounded-full animate-ping"></span>
                        <span className="w-1.5 h-1.5 bg-cyan-200 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-white rounded-full animate-ping delay-100"></span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-slate-500 font-mono uppercase tracking-wider text-center">
                  Electrolyzer Chamber
                </div>
              </div>

              {/* Real-time telemetry feed of the current reaction */}
              <div className="md:col-span-2 space-y-4 flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                    <span className="text-slate-500 block font-mono">THERMODYNAMIC INPUT:</span>
                    <span className="text-sm font-semibold font-mono text-cyan-400">
                      {(miningEnergyInput / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} kJ
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                    <span className="text-slate-500 block font-mono">H₂ MASS SPLIT:</span>
                    <span className="text-sm font-semibold font-mono text-emerald-400">
                      {minedHydrogenGrams.toFixed(4)} grams
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                    <span className="text-slate-500 block font-mono">OXYGEN RELEASED:</span>
                    <span className="text-sm font-semibold font-mono text-slate-300">
                      {oxygenReleasedGrams.toFixed(3)}g (O₂)
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                    <span className="text-slate-500 block font-mono">VERIFIED MINT VALUE:</span>
                    <span className="text-sm font-bold font-mono text-yellow-500">
                      {Math.floor(minedHydrogenGrams * 100) / 100} HBC
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 italic text-center md:text-left leading-relaxed">
                  {isMining 
                    ? "بجلی اور تھوریم تھرمل پانی کو توڑ رہے ہیں۔ جیسے ہائیڈروجن بنے گی، ٹوکرز آپ کے ہینڈل میں شامل ہوں گے..."
                    : "مائننگ فیڈ شروع کرنے کے لیے نیچے بٹن دبائیں۔ یہ ہائیڈروجن کی طبعی مقدار بنانے کے مترادف ہے۔"
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-4">
            {isMining && (
              <span className="text-[10px] text-yellow-500 font-mono flex items-center gap-1.5 animate-pulse">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                WATER SPLITTING IN PROGRESS (JOULES DECAY)...
              </span>
            )}
            <button
              onClick={handleStartMining}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-xs font-mono uppercase tracking-widest transition-all focus:ring-2 focus:ring-emerald-500/50 ${
                isMining 
                  ? "bg-red-950 hover:bg-red-900 text-red-100 border border-red-800"
                  : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/10 cursor-pointer"
              }`}
            >
              {isMining ? "مائننگ بند کر کے ٹوکنز کلیم کریں (Claim Backing)" : "مائننگ شروع کریں (Start Mining)"}
            </button>
          </div>
        </div>

      </div>

      {/* Grid: Send and history */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Send coins form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 shadow-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic mb-4">
            <span className="w-1 h-3 bg-cyan-500 block"></span>
            HBC ٹوکن ٹرانسفر (Sovereign Transfer Portal)
          </h3>

          <form onSubmit={handleSendHBC} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 font-mono mb-1.5 uppercase text-[10px]">رسیور نوڈ ایڈریس (Recipient Node Address)</label>
              <input
                type="text"
                placeholder="مثال: Khyber-Solar-Base OR 0x71C...8971"
                value={sendRecipient}
                onChange={(e) => setSendRecipient(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1.5 uppercase text-[10px]">منتقل رقم (HBC Amount)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="25.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-12 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-400 font-mono">
                    HBC
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-mono mb-1.5 uppercase text-[10px]">مقصد (Transfer Purpose)</label>
                <select
                  value={sendTopic}
                  onChange={(e) => setSendTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer font-sans"
                >
                  <option value="research_allocation">Scientific Grant (تحقیق)</option>
                  <option value="baseload_purchase">Baseload Electric Purchase</option>
                  <option value="tuition_payment">University Tuition Fee</option>
                  <option value="transit_refuel">Transit Fleet Fueling (ٹرانسپورٹ)</option>
                  <option value="student_stipend">Academic Incentive (وظیفہ)</option>
                </select>
              </div>
            </div>

            {sendError && (
              <p className="text-xs text-red-400 font-medium bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg font-mono">
                {sendError}
              </p>
            )}

            {sendSuccess && (
              <p className="text-xs text-emerald-400 font-medium bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg flex items-center gap-1.5 font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ٹرانزیکشن کامیابی سے مکمل ہو گئی۔ آپ کا بیلنس اپ ڈیٹ ہو گیا ہے!
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-slate-950 hover:text-white font-bold py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
            >
              HBC ٹوکن منتقل کریں
            </button>
          </form>
        </div>

        {/* Local transaction ledger */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic mb-4">
              <span className="w-1 h-3 bg-sky-500 block"></span>
              ذاتی ٹرانزیکشن لیجر (Local Monetary Register)
            </h3>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-2.5 bg-slate-950 rounded border border-slate-800/80 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      tx.type === "mine" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900" :
                      tx.type === "send" ? "bg-red-950/50 text-red-400 border border-red-900" : 
                      "bg-cyan-950/50 text-cyan-400 border border-cyan-900"
                    }`}>
                      {tx.type === "mine" ? <Plus className="w-3.5 h-3.5" /> : 
                       tx.type === "send" ? <ArrowUpRight className="w-3.5 h-3.5" /> : 
                       <ArrowDownLeft className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200 font-sans">
                        {tx.type === "mine" ? "ہائیڈروجن مائننگ (bPoW MINT)" : 
                         tx.type === "send" ? `ٹرانسفر برائے: ${tx.target}` : 
                         `حصول ٹوکنز: ${tx.target}`}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">{tx.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="text-right font-mono">
                    <p className={`font-bold ${tx.type === "mine" ? "text-emerald-400" : "text-red-400"}`}>
                      {tx.type === "mine" ? "+" : "-"}{tx.amountHBC.toFixed(2)} HBC
                    </p>
                    <p className="text-[10px] text-slate-500">
                      &asymp; {tx.hydrogenGrams.toFixed(2)}g H₂
                    </p>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-6 text-slate-500 italic text-xs font-sans">
                  سیمولیشن میں اب تک کوئی ٹرانزیکشن رجسٹرڈ نہیں ہوئی۔
                </div>
              )}
            </div>
          </div>

          <div className="text-[9px] text-slate-500 font-mono mt-4 pt-4 border-t border-slate-800 uppercase tracking-widest leading-relaxed">
            Sovereign Ledger signed under thermodynamic work parity &bull; Verified by Peshawar Local bPoW Node
          </div>
        </div>

      </div>
    </div>
  );
}
