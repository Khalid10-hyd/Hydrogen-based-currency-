import React, { useState, useEffect } from "react";
import { Transaction, WalletStatus, EnergyMetric } from "./types";
import { HHV_HYDROGEN_J_PER_GRAM } from "./data/simulation";
import MetricsOverview from "./components/MetricsOverview";
import WalletComponent from "./components/Wallet";
import UniversityModel from "./components/UniversityModel";
import TradingDashboard from "./components/TradingDashboard";
import CodeViewer from "./components/CodeViewer";
import AIConsultant from "./components/AIConsultant";
import { Activity, Wallet, Shield, BarChart3, Terminal, Bot, Zap, Landmark } from "lucide-react";

// Generate initial historical metrics
function generateInitialHistoricalMetrics(): EnergyMetric[] {
  const metrics: EnergyMetric[] = [];
  const baseTime = Date.now() - 100 * 1000;
  for (let i = 0; i < 11; i++) {
    metrics.push({
      id: `metric-${i}`,
      timestamp: new Date(baseTime + i * 10000).toLocaleTimeString(),
      thoriumEnergyOutputMW: 8.3 + Math.sin(i / 2) * 0.4,
      thoriumTemperatureC: 380 + Math.sin(i / 2) * 2.5,
      hydrogenProductionG2s: 4.5 + Math.cos(i / 3) * 0.6,
      ammoniaStorageKg: 14000 + i * 20,
      pegIndex: 1.01 + Math.sin(i / 4) * 0.01,
      marketPriceUSD: 3.10 + Math.sin(i / 4) * 0.03
    });
  }
  return metrics;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wallet' | 'university' | 'trading' | 'code' | 'ai'>('dashboard');
  
  // Wallet state
  const [wallet, setWallet] = useState<WalletStatus>({
    balanceHBC: 820.00,
    hydrogenEquivalentGrams: 820.00,
    energyEquivalentJoules: 820.00 * HHV_HYDROGEN_J_PER_GRAM,
    totalMinedHBC: 140.00
  });

  // Transactions lists (Init ledger)
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-init-1",
      timestamp: "10:30 AM",
      type: "receive",
      amountHBC: 500,
      hydrogenGrams: 500,
      energyJoules: 500 * HHV_HYDROGEN_J_PER_GRAM,
      target: "Grand Peshawar Solar Grid allocation",
      status: "success"
    },
    {
      id: "tx-init-2",
      timestamp: "11:05 AM",
      type: "convert",
      amountHBC: 180,
      hydrogenGrams: 180,
      energyJoules: 180 * HHV_HYDROGEN_J_PER_GRAM,
      target: "Peshawar Liquid Storage Conversion",
      status: "success"
    }
  ]);

  // Real-time telemetry metrics history
  const [metrics, setMetrics] = useState<EnergyMetric[]>(generateInitialHistoricalMetrics());
  
  // Shocks list active states
  const [activeShocks, setActiveShocks] = useState<{ [key: string]: boolean }>({});

  const latestMetric = metrics[metrics.length - 1];

  // Tick simulation interval
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) => {
        const nextIdx = prev.length;
        const last = prev[prev.length - 1];

        // Core modifier states based on active shocks
        let thoriumDisrupted = activeShocks["shock-refuel"];
        let solarDisrupted = activeShocks["shock-cloudy"];
        let storageDisrupted = activeShocks["shock-demand"];
        let efficiencyUpgraded = activeShocks["shock-efficiency"];

        // Calculations
        let nextThoriumOutput = thoriumDisrupted ? 3.8 + Math.random() * 0.4 : 8.4 + Math.random() * 0.2;
        let nextTemp = thoriumDisrupted ? 290.0 + Math.random() * 5.0 : 382.0 + Math.random() * 2.0;
        
        let targetH2Gen = solarDisrupted ? 1.2 : 4.8;
        if (efficiencyUpgraded) targetH2Gen *= 1.35;
        let nextH2Gen = targetH2Gen + (Math.random() * 0.3 - 0.15);

        let nextAmmonia = last.ammoniaStorageKg;
        if (storageDisrupted) {
          nextAmmonia = Math.max(8000, nextAmmonia - 150);
        } else {
          nextAmmonia += Math.floor(nextH2Gen * 3.5); // hydrogen conversion
        }

        // Biophysical Peg dynamics based on output variables
        // Scarcity or excess of energy drives standard value
        let basePeg = 1.0;
        if (solarDisrupted) basePeg += 0.08; // Scarcity surges index value
        if (thoriumDisrupted) basePeg += 0.05; // Reserve volatility
        if (efficiencyUpgraded) basePeg -= 0.03; // Mass abundance eases peg slighty
        if (storageDisrupted) basePeg += 0.04; // External usage backstops value

        let nextPeg = basePeg + (Math.random() * 0.015 - 0.0075);

        const newMetric: EnergyMetric = {
          id: `metric-${nextIdx}`,
          timestamp: new Date().toLocaleTimeString(),
          thoriumEnergyOutputMW: nextThoriumOutput,
          thoriumTemperatureC: nextTemp,
          hydrogenProductionG2s: Math.max(0.1, nextH2Gen),
          ammoniaStorageKg: nextAmmonia,
          pegIndex: nextPeg,
          marketPriceUSD: 3.12 * nextPeg
        };

        // Maintain slice size of last 12 points
        return [...prev.slice(1), newMetric];
      });
    }, 10000); // 10s intervals for live tracking Simulation

    return () => clearInterval(timer);
  }, [activeShocks]);

  const handleAddTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const handleUpdateBalance = (amountHBC: number) => {
    setWallet((prev) => {
      const nextBalance = Math.max(0, prev.balanceHBC + amountHBC);
      return {
        balanceHBC: nextBalance,
        hydrogenEquivalentGrams: nextBalance,
        energyEquivalentJoules: nextBalance * HHV_HYDROGEN_J_PER_GRAM,
        totalMinedHBC: amountHBC > 0 ? prev.totalMinedHBC + amountHBC : prev.totalMinedHBC
      };
    });
  };

  const handleTriggerShockEffect = (shockId: string, apply: boolean) => {
    setActiveShocks((prev) => ({ ...prev, [shockId]: apply }));
  };

  const handleTradeSimulate = (type: 'buy' | 'sell', amount: number) => {
    if (type === 'buy') {
      handleUpdateBalance(amount);
    } else {
      handleUpdateBalance(-amount);
    }
  };

  const handleReceiveStipendFromUniversity = (amount: number, type: 'mine' | 'send' | 'receive', target: string) => {
    handleUpdateBalance(amount);
    const newTx: Transaction = {
      id: `tx-univ-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: type,
      amountHBC: amount,
      hydrogenGrams: amount,
      energyJoules: amount * HHV_HYDROGEN_J_PER_GRAM,
      target: target,
      status: "success"
    };
    handleAddTransaction(newTx);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-350 font-sans select-none selection:bg-sky-500 selection:text-slate-950">
      
      {/* High Density Top Status Ring Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-45">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Logo, Title & Vision Tag */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-md flex items-center justify-center">
              <Activity className="w-5 h-5 text-sky-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white uppercase font-sans">
                  THORIUM-H₂ NEXUS <span className="text-sky-400 font-normal">v1.1.0</span>
                </h1>
                <span className="text-[9px] bg-sky-950 text-sky-400 font-mono tracking-wider font-extrabold px-1.5 py-0.5 rounded border border-sky-800 uppercase">
                  Terrestrial Protocol
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono tracking-wider uppercase">
                MASTER PROMPT ARCHITECTURE // SOVEREIGN TECHNICAL MONETARY STANDARD
              </p>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono bg-slate-950 p-2 rounded-lg border border-slate-800 self-stretch md:self-auto justify-between md:justify-start">
            <div className="flex items-center gap-1.5 px-1.5">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-500 uppercase">TMR CORE:</span>
              <span className="text-white font-bold">{(latestMetric?.thoriumEnergyOutputMW || 8.4).toFixed(1)} MW</span>
            </div>
            <div className="w-px h-3 bg-slate-800"></div>
            <div className="flex items-center gap-1.5 px-1.5">
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-500 uppercase">1 HBC RATIO:</span>
              <span className="text-emerald-400 font-bold">1.000g H₂</span>
            </div>
            <div className="w-px h-3 bg-slate-800"></div>
            <div className="flex items-center gap-1.5 px-1.5">
              <Wallet className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-slate-500 uppercase">BALANCE:</span>
              <span className="text-white font-bold">{wallet.balanceHBC.toFixed(2)} HBC</span>
            </div>
            <div className="w-px h-3 bg-slate-800 hidden sm:block"></div>
            <div className="bg-slate-900 px-2.5 py-1 rounded border border-slate-705 items-center gap-1.5 hidden sm:flex border-slate-700">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-bold text-white tracking-widest uppercase">SYSTEM SYNCED</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Workspace Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-900 pb-2 scrollbar-none font-sans">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase cursor-pointer transition-all whitespace-nowrap border ${
              activeTab === 'dashboard' 
                ? "bg-slate-900 text-white border-slate-700 shadow-sm" 
                : "text-slate-500 hover:text-slate-200 border-transparent hover:bg-slate-900/40"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-sky-450 text-sky-400" />
            تھرمو ڈیش بورڈ (Telemetry)
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase cursor-pointer transition-all whitespace-nowrap border ${
              activeTab === 'wallet' 
                ? "bg-slate-900 text-white border-slate-700 shadow-sm" 
                : "text-slate-500 hover:text-slate-200 border-transparent hover:bg-slate-900/40"
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-450 text-emerald-400" />
            انرجی والٹ سیمولیٹر (Wallet &amp; Mine)
          </button>

          <button
            onClick={() => setActiveTab('university')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase cursor-pointer transition-all whitespace-nowrap border ${
              activeTab === 'university' 
                ? "bg-slate-900 text-white border-slate-700 shadow-sm" 
                : "text-slate-500 hover:text-slate-200 border-transparent hover:bg-slate-900/40"
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-amber-500" />
            پشاور یونیورسٹی خود مختار گرڈ (HUN Campus)
          </button>

          <button
            onClick={() => setActiveTab('trading')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase cursor-pointer transition-all whitespace-nowrap border ${
              activeTab === 'trading' 
                ? "bg-slate-900 text-white border-slate-700 shadow-sm" 
                : "text-slate-500 hover:text-slate-200 border-transparent hover:bg-slate-900/40"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-500" />
            شاکس اور متبادل منڈی (Shocks &amp; Trade)
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase cursor-pointer transition-all whitespace-nowrap border ${
              activeTab === 'code' 
                ? "bg-slate-900 text-white border-slate-700 shadow-sm" 
                : "text-slate-500 hover:text-slate-200 border-transparent hover:bg-slate-900/40"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-sky-450 text-sky-400" />
            اسمارٹ کانٹریکٹ ڈھانچہ (Code Blueprint)
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase cursor-pointer transition-all whitespace-nowrap border ${
              activeTab === 'ai' 
                ? "bg-slate-900 text-white border-slate-700 shadow-sm" 
                : "text-slate-500 hover:text-slate-200 border-transparent hover:bg-slate-900/40"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            تھرمو ڈائنامک AI ماڈلر (Sovereign GPT)
          </button>

        </div>

        {/* Tab Workspaces components */}
        <div className="min-h-[460px] transition-all duration-300">
          
          {activeTab === 'dashboard' && (
            <MetricsOverview 
              metrics={metrics} 
              walletBalance={wallet.balanceHBC} 
              totalHBCSupply={1120000 + wallet.balanceHBC} 
            />
          )}

          {activeTab === 'wallet' && (
            <WalletComponent 
              wallet={wallet} 
              transactions={transactions} 
              onAddTransaction={handleAddTransaction} 
              onUpdateBalance={handleUpdateBalance} 
            />
          )}

          {activeTab === 'university' && (
            <UniversityModel 
              onAddTransactionToWallet={handleReceiveStipendFromUniversity} 
            />
          )}

          {activeTab === 'trading' && (
            <TradingDashboard 
              metrics={metrics} 
              onTriggerShockEffect={handleTriggerShockEffect} 
              onTradeSimulate={handleTradeSimulate} 
            />
          )}

          {activeTab === 'code' && (
            <CodeViewer />
          )}

          {activeTab === 'ai' && (
            <AIConsultant />
          )}

        </div>

      </main>

      {/* Sovereign Footing page border */}
      <footer className="border-t border-slate-900 py-6 mt-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] font-mono text-slate-500">
          <p>
            &copy; 2026 Sovereign H2-Monetary District &bull; Unified Thermodynamics Whitepaper Core
          </p>
          <div className="flex gap-4">
            <span>TERRESTRIAL ENFORCED</span>
            <span>TH-232 BACKSTOPPED</span>
            <span>1 TOKEN = 1 GRAM HYDROGEN</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
