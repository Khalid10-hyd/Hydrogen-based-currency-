import React, { useState } from "react";
import { PeshawarUniversityNode, UniversityTransaction } from "../types";
import { INITIAL_PESHAWAR_NODES, HHV_HYDROGEN_J_PER_GRAM } from "../data/simulation";
import { GraduationCap, ShieldAlert, Zap, Cpu, Compass, Landmark, RefreshCw } from "lucide-react";

interface UniversityModelProps {
  onAddTransactionToWallet: (amountHBC: number, type: 'mine' | 'send' | 'receive', target: string) => void;
}

export default function UniversityModel({ onAddTransactionToWallet }: UniversityModelProps) {
  const [nodes, setNodes] = useState<PeshawarUniversityNode[]>(INITIAL_PESHAWAR_NODES);
  const [selectedNode, setSelectedNode] = useState<PeshawarUniversityNode>(INITIAL_PESHAWAR_NODES[0]);
  const [logs, setLogs] = useState<UniversityTransaction[]>([
    {
      id: "utx-1",
      fromNode: "Student Hostels Block",
      toNode: "Thorium Micro-Reactor (TMR-1)",
      amountHBC: 1250,
      purpose: "Campus Electricity Baseload payment",
      timestamp: "10:42 AM"
    },
    {
      id: "utx-2",
      fromNode: "Khyber Solar Electrolyzer Station",
      toNode: "Campus Green Transport & Transit Hub",
      amountHBC: 600,
      purpose: "H2 fuel dispensing log for Student Bus fleet",
      timestamp: "11:15 AM"
    },
    {
      id: "utx-3",
      fromNode: "Thorium Micro-Reactor (TMR-1)",
      toNode: "Research Fuel-Cell Cogeneration Plant",
      amountHBC: 5000,
      purpose: "Thermodynamic research funding allocation",
      timestamp: "11:30 AM"
    }
  ]);

  // Simulate a student transaction
  const [payoutAmount, setPayoutAmount] = useState<string>("150");
  const [isSimulatingTrade, setIsSimulatingTrade] = useState<boolean>(false);

  const handleSimulateCampusAction = (purpose: 'tuition' | 'transit' | 'stipend') => {
    setIsSimulatingTrade(true);
    let amount = 150;
    let from = "Student Wallets";
    let to = "University Treasury";
    let purposeText = "";

    if (purpose === 'tuition') {
      amount = 850;
      from = "Physics Department Student Block";
      to = "University Institutional Ledger";
      purposeText = "Semester enrollment backed by real-time H2 thermal units";
    } else if (purpose === 'transit') {
      amount = 45;
      from = "Engineering Transit Card";
      to = "Campus Green Transport & Transit Hub";
      purposeText = "Daily fuel cell transit deduction (0.045 kg H2 consumption)";
    } else {
      amount = 400;
      from = "Khyber Solar Electrolyzer Station";
      to = "Brilliant Research Stipend Wallet";
      purposeText = "Biophysical thesis incentive payout (400g Hydrogen backing claim)";
      
      // Since research stipend is a payout to student wallet, let's credit the user's main wallet as well!
      onAddTransactionToWallet(400, "receive", "Khyber Solar Electrolyzer Station");
    }

    setTimeout(() => {
      const newTransactionLog: UniversityTransaction = {
        id: `utx-${Date.now()}`,
        fromNode: from,
        toNode: to,
        amountHBC: amount,
        purpose: purposeText,
        timestamp: new Date().toLocaleTimeString()
      };

      setLogs((prev) => [newTransactionLog, ...prev].slice(0, 8));
      
      // Dynamically update liquidity of connected nodes
      setNodes((prevNodes) => 
        prevNodes.map((n) => {
          if (n.name === from) return { ...n, hbcLiquidity: Math.max(0, n.hbcLiquidity - amount) };
          if (n.name === to) return { ...n, hbcLiquidity: n.hbcLiquidity + amount };
          return n;
        })
      );
      
      setIsSimulatingTrade(false);
    }, 800);
  };

  return (
    <div className="space-y-6" id="autonomous-university-model">
      {/* Intro and theoretical rationale */}
      <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-base font-medium text-slate-100 flex items-center gap-2 font-sans">
            <GraduationCap className="text-cyan-405 w-5 h-5 text-cyan-400" />
            پشاور یونیورسٹی خود مختار مانیٹری ایکو سسٹم (Macro-Campus Model)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed font-light">
            ایک مادی خودمختار توانائی یونیورسٹی (Autonomous H2-Campus) کا نقشہ۔ پشاور یونیورسٹی کا اپنا **تھوریم مائیکرو ری ایکٹر** اور **سولر الیکٹرولائزر** اسٹیشن مل کر یونیورسٹی کے ہاسٹلز، کمپیوٹر سینٹرز، اور پبلک ٹرانسپورٹ کو چلاتے ہیں اور HBC ٹوکنز کے ذریعے معیشت گردش کرتی ہے۔
          </p>
        </div>
        <div className="p-3 bg-cyan-950/20 border border-cyan-900/30 rounded-lg max-w-xs text-right font-mono">
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">CAMPUS TARGET</p>
          <p className="text-xs text-slate-200 mt-1 font-sans">100% Fossil-Fuel Free Isolation Grid</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive SVG microgrid blueprint map of Peshawar Univ */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-5 rounded-lg flex flex-col justify-between shadow-xl relative min-h-[440px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                  <span className="w-1 h-3 bg-cyan-500 block"></span>
                  Campus Blueprint Mesh (TMR-PEM Configuration)
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Click on nodes to analyze local grid load and dynamic HBC token reserves.</p>
              </div>
              <Compass className="w-5 h-5 text-slate-600" />
            </div>

            {/* Map Chamber Viewport */}
            <div className="relative border border-slate-800 rounded-lg bg-slate-950/40 h-[280px] w-full flex items-center justify-center overflow-hidden">
              {/* Overlay Grid lines */}
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-5 pointer-events-none">
                {[...Array(72)].map((_, i) => (
                  <div key={i} className="border-t border-l border-white h-full w-full"></div>
                ))}
              </div>

              {/* Glowing energy routing channels */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Reactor to Eginerring fuel cogen (50,15 to 50,80) */}
                <line 
                  x1="50%" y1="15%" x2="50%" y2="80%" 
                  stroke={selectedNode.id === "node-reactor" ? "#10b981" : "#1e293b"} 
                  strokeWidth="1.5" strokeDasharray="5,5" 
                  className="animate-[dash_10s_linear_infinite]"
                />
                {/* Solar Electrolyzer to Cogen (20,45 to 50,80) */}
                <line 
                  x1="20%" y1="45%" x2="50%" y2="80%" 
                  stroke={selectedNode.id === "node-solar" ? "#10b981" : "#1e293b"} 
                  strokeWidth="1.5" strokeDasharray="5,5" 
                />
                {/* Solar side to Transport fleet (20,45 to 15,80) */}
                <line 
                  x1="20%" y1="45%" x2="15%" y2="80%" 
                  stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" 
                />
                {/* Storage ammonia to Cogen (80,45 to 50,80) */}
                <line 
                  x1="80%" y1="45%" x2="50%" y2="80%" 
                  stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" 
                />
                {/* Reactor to Storage ammonia (50,15 to 80,45) */}
                <line 
                  x1="50%" y1="15%" x2="80%" y2="45%" 
                  stroke="#22d3ee" strokeWidth="1" strokeDasharray="6,4" 
                />
              </svg>

              {/* Graphical Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg transition-all flex flex-col items-center group cursor-pointer"
                    style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                  >
                    {/* Node Circle Visual */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transition-all ${
                      isSelected 
                        ? "bg-slate-950 scale-125 border-cyan-400 text-cyan-400 z-10" 
                        : node.type === "generation" ? "bg-emerald-950/90 border-emerald-500 text-emerald-400" :
                          node.type === "storage" ? "bg-amber-950/90 border-amber-500 text-amber-500" :
                          node.type === "consumption" ? "bg-red-950/90 border-red-500 text-red-400" :
                          "bg-violet-950/90 border-violet-500 text-violet-400"
                    }`}>
                      {node.type === "generation" ? <Zap className="w-4 h-4" /> :
                       node.type === "storage" ? <Landmark className="w-4 h-4" /> :
                       node.type === "consumption" ? <GraduationCap className="w-4 h-4" /> :
                       <Cpu className="w-4 h-4" />}
                    </div>

                    {/* Simple Tooltip on Map */}
                    <div className="absolute top-10 whitespace-nowrap bg-slate-950/95 border border-slate-800 text-[10px] text-slate-300 font-mono px-1.5 py-0.5 rounded opacity-80 group-hover:opacity-100 transition-opacity">
                      {node.name.split(" ")[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex justify-between text-[11px] text-slate-500 font-mono">
            <span>GRID CAPACITY: {nodes.reduce((acc, n) => acc + n.energyCapacityMW, 0).toFixed(0)} MW (Simulated)</span>
            <span>TOTAL LIQUIDITY LOCKED: {nodes.reduce((acc, n) => acc + n.hbcLiquidity, 0).toLocaleString()} HBC</span>
          </div>
        </div>

        {/* Selected Node Analysis and Campus action station */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                  selectedNode.type === "generation" ? "bg-emerald-950 text-emerald-400 border border-emerald-900" :
                  selectedNode.type === "storage" ? "bg-amber-950 text-amber-500 border border-amber-900" :
                  selectedNode.type === "consumption" ? "bg-red-950 text-red-400 border border-red-900" :
                  "bg-violet-950 text-violet-400 border border-violet-900"
                }`}>
                  {selectedNode.type} NODE
                </span>
                <h3 className="text-sm font-semibold text-white mt-2 font-sans">
                  {selectedNode.name}
                </h3>
              </div>
              <span className={`text-[10px] font-mono font-bold rounded-full px-2 py-0.5 border ${
                selectedNode.status === "online" 
                  ? "bg-emerald-950 text-emerald-400 border-emerald-900" 
                  : "bg-amber-950 text-amber-500 border-amber-900"
              }`}>
                {selectedNode.status}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans font-light">
              {selectedNode.description}
            </p>

            <div className="space-y-2 pt-3 border-t border-slate-800 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Node Capacity:</span>
                <span className="text-slate-200">{selectedNode.energyCapacityMW.toFixed(1)} MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Grid Load:</span>
                <span className="text-slate-200">{selectedNode.currentLoadMW.toFixed(1)} MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Node HBC Liquidity:</span>
                <span className="text-emerald-400 font-bold">{selectedNode.hbcLiquidity.toLocaleString()} HBC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Energy Equivalence:</span>
                <span className="text-cyan-400 font-medium">
                  {((selectedNode.hbcLiquidity * HHV_HYDROGEN_J_PER_GRAM) / 1e9).toFixed(1)} GJ
                </span>
              </div>
            </div>
          </div>

          {/* Practical Simulation Trigger Sandbox */}
          <div className="mt-6 pt-4 border-t border-slate-800 space-y-3 font-mono">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              کیمپس مانیٹری سرگرمی سیمولیٹ کریں (Simulate Action)
            </h4>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                disabled={isSimulatingTrade}
                onClick={() => handleSimulateCampusAction('tuition')}
                className="p-1 px-2 bg-slate-950 hover:bg-slate-800 rounded-lg text-slate-300 border border-slate-800 hover:border-slate-700 text-[10px] cursor-pointer"
              >
                سمسٹر فیس (Fee)
              </button>
              
              <button
                disabled={isSimulatingTrade}
                onClick={() => handleSimulateCampusAction('transit')}
                className="p-1 px-2 bg-slate-950 hover:bg-slate-800 rounded-lg text-slate-300 border border-slate-800 hover:border-slate-700 text-[10px] cursor-pointer"
              >
                بس ریفیول (Transit)
              </button>

              <button
                disabled={isSimulatingTrade}
                onClick={() => handleSimulateCampusAction('stipend')}
                className="p-1 px-2 bg-cyan-950/40 hover:bg-cyan-900/40 rounded-lg text-cyan-400 border border-cyan-800/80 hover:border-cyan-700 text-[10px] whitespace-nowrap cursor-pointer font-bold"
                title="Simulates earning an energy stipend from the Khyber solar fields directly into your app wallet"
              >
                وظیفہ (Stipend)
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Campus Ledger log stream */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
            <span className="w-1 h-3 bg-sky-500 block"></span>
            Active Campus Ledger Streams (Sovereign HUN Log)
          </h3>
          {isSimulatingTrade && (
            <span className="text-[10px] text-cyan-400 font-mono animate-pulse flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" /> Mining consensus verification...
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {logs.slice(0, 3).map((log) => (
            <div key={log.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500">{log.timestamp}</span>
                <span className="text-emerald-400 font-bold">{log.amountHBC.toLocaleString()} HBC</span>
              </div>
              <p className="font-semibold text-slate-200 truncate font-sans">{log.purpose}</p>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1.5 border-t border-slate-850">
                <span className="truncate max-w-[100px] text-red-300">{log.fromNode}</span>
                <span className="text-slate-750">&rarr;</span>
                <span className="truncate max-w-[100px] text-cyan-300">{log.toNode}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
