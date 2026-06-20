export interface Transaction {
  id: string;
  timestamp: string;
  type: 'mine' | 'send' | 'receive' | 'trade' | 'convert';
  amountHBC: number;
  hydrogenGrams: number;
  energyJoules: number;
  target?: string;
  status: 'pending' | 'success' | 'failed';
}

export interface WalletStatus {
  balanceHBC: number;
  hydrogenEquivalentGrams: number;
  energyEquivalentJoules: number;
  totalMinedHBC: number;
}

export interface EnergyMetric {
  id: string;
  timestamp: string;
  thoriumEnergyOutputMW: number;
  thoriumTemperatureC: number;
  hydrogenProductionG2s: number;
  ammoniaStorageKg: number;
  pegIndex: number;
  marketPriceUSD: number;
}

export interface PeshawarUniversityNode {
  id: string;
  name: string;
  description: string;
  type: 'generation' | 'consumption' | 'storage' | 'microgrid';
  status: 'online' | 'optimizing' | 'offline';
  energyCapacityMW: number;
  currentLoadMW: number;
  hbcLiquidity: number;
  coordinates: { x: number; y: number };
}

export interface UniversityTransaction {
  id: string;
  fromNode: string;
  toNode: string;
  amountHBC: number;
  purpose: string;
  timestamp: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface EconomicShock {
  id: string;
  name: string;
  icon: string;
  description: string;
  applied: boolean;
  effectLabel: string;
}
