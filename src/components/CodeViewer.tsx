import React, { useState } from "react";
import { SOLIDITY_CONTRACT_TEMPLATE, PYTHON_BLOCKCHAIN_NODE } from "../data/simulation";
import { Terminal, ShieldCheck, Check, Copy } from "lucide-react";

export default function CodeViewer() {
  const [activeTab, setActiveTab] = useState<'solidity' | 'python'>('solidity');
  const [copied, setCopied] = useState<boolean>(false);

  const activeCode = activeTab === 'solidity' ? SOLIDITY_CONTRACT_TEMPLATE : PYTHON_BLOCKCHAIN_NODE;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="code-viewer-portal">
      <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
            <span className="w-1 h-3 bg-violet-500 block"></span>
            بلاک چین اور اسمارٹ کانٹریکٹ ڈھانچہ (HBC Smart Architectures)
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed font-sans">
            ہائیڈروجن اور تھوریم معیشت کو محفوظ ڈیجیٹل سسٹم سے جوڑنے کے لیے سمارٹ کانٹریکٹ کے کوڈ کا ماڈل۔ یہ کوڈ سنسر کی مدد سے جسمانی ہائیڈروجن کی پیداوار اور مائننگ کا معاشی الحاق کرتا ہے۔
          </p>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
          <button
            onClick={() => setActiveTab('solidity')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wide uppercase transition-colors cursor-pointer ${
              activeTab === 'solidity' ? "bg-violet-600 text-slate-950" : "text-slate-500 hover:text-slate-400"
            }`}
          >
            ERC-20 Solidity
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wide uppercase transition-colors cursor-pointer ${
              activeTab === 'python' ? "bg-violet-600 text-slate-950" : "text-slate-500 hover:text-slate-400"
            }`}
          >
            Python Node (bPoW)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Code Block display */}
        <div className="lg:col-span-2 bg-slate-950 rounded-lg border border-slate-800/80 overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="flex justify-between items-center bg-slate-900/35 px-5 py-3 border-b border-slate-800/80">
            <span className="text-xs font-mono text-slate-400">
              {activeTab === 'solidity' ? "HydrogenBasedCurrency.sol (Remix Compatible)" : "biophysical_consensus.py"}
            </span>
            <button
              onClick={handleCopyCode}
              className="text-slate-400 hover:text-slate-205 transition-colors p-1.5 bg-slate-950 rounded border border-slate-850 hover:border-slate-750 flex items-center gap-1 text-[10px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy Code"}
            </button>
          </div>

          <pre className="p-4 overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-300 max-h-[460px] bg-slate-950">
            <code>{activeCode}</code>
          </pre>

          <div className="bg-slate-900 border-t border-slate-850 p-3 text-right">
            <span className="text-[10px] text-slate-500 font-mono flex items-center justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Fully compatible on Solidity compiler version 0.8.20 / Standard EVM
            </span>
          </div>
        </div>

        {/* Urdu technical writeup of Code */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic text-left">
              <span className="w-1 h-3 bg-slate-500 block"></span>
              Technical Rationale
            </h3>

            {activeTab === 'solidity' ? (
              <div className="space-y-4 font-sans text-left">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/85 text-xs">
                  <p className="font-bold text-violet-400 mb-1 font-mono uppercase tracking-wide">Thermodynamic Parity:</p>
                  <p className="text-slate-450 leading-relaxed text-[11px] font-light">
                    سولیڈیٹی کوڈ میں <code>JOULES_PER_TOKEN</code> کو مستقل پیرامیٹر کے طور پر رکھا گیا ہے (141,800 Joules)۔ یہ اس بات کو یقینی بناتا ہے کہ کوئی بھی اوتھرائزڈ رول فزیکل کام کے ثبوت کے بنا نئی کرنسی سپلائی نہیں کر سکتا۔
                  </p>
                </div>
                
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/85 text-xs">
                  <p className="font-bold text-violet-400 mb-1 font-mono uppercase tracking-wide">Sovereign Depository:</p>
                  <p className="text-slate-450 leading-relaxed text-[11px] font-light">
                    <code>updateThoriumReserves</code> فنکشن وفاقی یا تنظیمی سطح پر محفوظ کردہ تھوریم-232 گیس ریزرو کا موجودہ حجم (کلوگرام میں) لیجر پر ڈسپلے کرتا ہے، جس سے نیٹ ورک کا اعتماد قائم رہتا ہے۔
                  </p>
                </div>

                <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800/85 leading-relaxed font-sans font-light">
                  <strong className="text-emerald-400 font-mono uppercase tracking-wide">Remix Setup:</strong> Remix IDE میں جا کر ایک نئی فائل بنائیں اور اس سورس کوڈ کو پیسٹ کریں۔ OpenZeppelin کے معیاری ERC20 کانٹریکٹ کے ذریعے سمارٹ اکاؤنٹ بن جائے گا۔
                </div>
              </div>
            ) : (
              <div className="space-y-4 font-sans text-left">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/85 text-xs">
                  <p className="font-bold text-violet-400 mb-1 font-mono uppercase tracking-wide">Biophysical Proof of Work (bPoW):</p>
                  <p className="text-slate-450 leading-relaxed text-[11px] font-light">
                    روایتی بٹ کوائن مائننگ کے برعکس (جہاں کمپیوٹرز لایعنی حساب کر کے بجلی ضائع کرتے ہیں)، یہاں <strong>bPoW</strong> کے تحت بلاک کا ثبوت پانی سے ہائیڈروجن گیس کی علیحدگی (Electrode-splitting work) اور خلا میں خارج ہونے والی انرجی کے تناسب سے برآمد ہوتا ہے۔
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/85 text-xs">
                  <p className="font-bold text-violet-400 mb-1 font-mono uppercase tracking-wide">First Law Verification:</p>
                  <p className="text-slate-450 leading-relaxed text-[11px] font-light">
                    پائتھن کوڈ میں ایک ریاضیاتی فلٹر (Perpetual Motion Check) لگایا گیا ہے۔ اگر کوئی بلاک مائننگ کے لیے جتنا پانی استعمال ہوا اس سے زیادہ ہائیڈروجن کلیم کرتا ہے جو 98٪ کی کارکردگی کے خلاف ہو، تو نیٹ ورک بلاک مسترد کر دے گا۔
                  </p>
                </div>

                <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800/85 leading-relaxed font-sans font-light">
                  <strong className="text-emerald-400 font-mono uppercase tracking-wide">Physical Integration:</strong> یہ اسکرپٹ IoT مائیکرو کنٹرولرز (جیسے Raspberry Pi) سے منسلک ہو سکتا ہے جو سولر پلانٹس کے والوز اور کرنٹ میٹرز کا ڈیٹا سیکیور کر کے مائننگ کنٹرول کرتے ہیں۔
                </div>
              </div>
            )}
          </div>

          <div className="text-[9px] text-slate-500 font-mono mt-4 pt-4 border-t border-slate-800 text-center uppercase tracking-[0.08em]">
            Sovereign Ledger structures signed &bull; Peshawar academic standard compliance
          </div>
        </div>
      </div>
    </div>
  );
}
