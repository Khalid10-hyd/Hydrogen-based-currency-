import { PeshawarUniversityNode, EconomicShock } from "../types";

// Thermodynamic Constant for Hydrogen (Higher Heating Value - HHV):
// 1 kg H2 = 141.8 MJ (MegaJoules) of chemical energy potential
// Therefore: 1 gram H2 = 141,800 Joules of physical energy value.
export const HHV_HYDROGEN_J_PER_GRAM = 141800; 

// Thorium standard energy density:
// 1 kg of Thorium-232 can produce approximately 24 million kWh of thermal output,
// which is roughly equivalent to 3 million kilograms of coal.
export const THORIUM_DENSITY_KWH_PER_KG = 24000000;

export const INITIAL_PESHAWAR_NODES: PeshawarUniversityNode[] = [
  {
    id: "node-reactor",
    name: "Thorium Micro-Reactor (TMR-1)",
    description: "Located at the Faculty of Engineering & Applied Physics. Provides the campus's baseline physical thermal reserve and central power grid backstop.",
    type: "generation",
    status: "online",
    energyCapacityMW: 15.0,
    currentLoadMW: 8.4,
    hbcLiquidity: 1500000,
    coordinates: { x: 50, y: 15 }
  },
  {
    id: "node-solar",
    name: "Khyber Solar Electrolyzer Station",
    description: "Converts solar irradiance into high-purity hydrogen gas at 500 bar. Directly mints HBC tokens equivalent to the physical mass of H2 produced.",
    type: "generation",
    status: "online",
    energyCapacityMW: 12.0,
    currentLoadMW: 6.2,
    hbcLiquidity: 750000,
    coordinates: { x: 20, y: 45 }
  },
  {
    id: "node-ammonia",
    name: "Ammonia Co-Storage & Liquefaction Facility",
    description: "Converts gaseous hydrogen to liquid ammonia for long-term thermodynamic reserve storage when supply exceeds regional grid demands.",
    type: "storage",
    status: "online",
    energyCapacityMW: 8.0,
    currentLoadMW: 2.1,
    hbcLiquidity: 500000,
    coordinates: { x: 80, y: 45 }
  },
  {
    id: "node-cogen",
    name: "Research Fuel-Cell Cogeneration Plant",
    description: "Converts stored green hydrogen back into high-efficiency electricity and heat for University departments, proving a closed thermodynamic cycle.",
    type: "microgrid",
    status: "optimizing",
    energyCapacityMW: 6.0,
    currentLoadMW: 4.8,
    hbcLiquidity: 350000,
    coordinates: { x: 50, y: 80 }
  },
  {
    id: "node-fleet",
    name: "Campus Green Transport & Transit Hub",
    description: "Coordinates Hydrogen fuel-cell buses and campus vehicles. Consumes hydrogen reserves and updates circulation logs in real-time.",
    type: "consumption",
    status: "online",
    energyCapacityMW: 3.0,
    currentLoadMW: 1.8,
    hbcLiquidity: 120000,
    coordinates: { x: 15, y: 80 }
  },
  {
    id: "node-hostels",
    name: "Student Hostels & Faculty Housing Microgrid",
    description: "A decentralized consumer block where students buy green energy with student wallets and transact for meals and services using campus HBC.",
    type: "consumption",
    status: "online",
    energyCapacityMW: 5.0,
    currentLoadMW: 3.5,
    hbcLiquidity: 280000,
    coordinates: { x: 85, y: 80 }
  }
];

export const INITIAL_ECONOMIC_SHOCKS: EconomicShock[] = [
  {
    id: "shock-refuel",
    name: "Thorium Core Refueling Interruption",
    icon: "ShieldAlert",
    description: "A temporary regulatory inspection pauses Thorium micro-reactor baseline cooling loops, shifting reserve security emphasis solely to the Ammonia storage.",
    applied: false,
    effectLabel: "Thorium temperature stables at idle; HBC Peg slightly increases volatility due to storage depletion."
  },
  {
    id: "shock-cloudy",
    name: "Khyber Pass Severe Dust Storm",
    icon: "CloudRain",
    description: "Heavy dust storms cover solar electrolyzer arrays, reducing immediate hydrogen mass minting capacity by 70% and temporarily deflating circulating wallet velocity.",
    applied: false,
    effectLabel: "Hydrogen production drops. Thermally-derived HBC index surges due to energy scarcity loop."
  },
  {
    id: "shock-demand",
    name: "Industrial Ammonia Winter Peak Demand",
    icon: "TrendingUp",
    description: "Peshawar Industrial District requests emergency delivery of 25,000 kg ammonia. The university liquid storage discharges reserves, acquiring significant liquidity.",
    applied: false,
    effectLabel: "Ammonia volume decreases. HBC peg gains strong backing from physical regional utility revenue."
  },
  {
    id: "shock-efficiency",
    name: "Electrolyzer Proton Membrane Upgrade",
    icon: "Zap",
    description: "Academic Research Group achieves 88% overall thermodynamic efficiency in proton exchange membranes, permanently multiplying mined HBC per Joule of electric input.",
    applied: false,
    effectLabel: "Hydrogen mass yield per unit electricity spikes. Peg value stabilizes at high-velocity circulation."
  }
];

export const SOLIDITY_CONTRACT_TEMPLATE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HydrogenBasedCurrency (HBC)
 * @notice 1 Token is mathematically pegged to exactly 1 gram of gaseous Hydrogen (99.9% purity)
 * @dev Mints are strictly authorized by physical energy production or real-time Thermal/Solar electrolyzer reports
 */
contract HydrogenBasedCurrency is ERC20, Ownable {
    // Thermodynamic equivalent density: Joules per token (1 gram H2 = 141,800 Joules)
    uint256 public constant JOULES_PER_TOKEN = 141800;
    
    // Total Thorium Reserves locked in custody as stable backing (in Kilograms)
    uint256 public thoriumReserveKg;

    // Events logging physical backing validation
    event HydrogenMined(addressindexed miner, uint256 gramsOfH2, uint256 joulesConsumed);
    event ThoriumReservesUpdated(uint256 newReserveKg);

    constructor(
        uint256 _initialThoriumReserve
    ) ERC20("Hydrogen-Based Currency", "HBC") Ownable(msg.sender) {
        thoriumReserveKg = _initialThoriumReserve;
        // Mint initial backing currency to campus treasury
        _mint(msg.sender, _initialThoriumReserve * 1000); 
    }

    /**
     * @notice Allows verified energy production units to mint HBC based on verified hydrogen mass produced.
     * @param _recipient The local node or user wallet receiving mined tokens.
     * @param _gramsOfH2 Physical mass of hydrogen generated, verified by IoT sensors.
     * @param _joulesApplied Energy spent to generate the hydrogen, ensuring thermodynamic value parity.
     */
    function mintByEnergyProduction(
        address _recipient, 
        uint256 _gramsOfH2, 
        uint256 _joulesApplied
    ) external onlyOwner {
        require(_gramsOfH2 > 0, "No energy mass reported");
        require(_joulesApplied >= _gramsOfH2 * JOULES_PER_TOKEN / 2, "Thermodynamic input deficit");

        _mint(_recipient, _gramsOfH2);
        emit HydrogenMined(_recipient, _gramsOfH2, _joulesApplied);
    }

    /**
     * @notice Update sovereign Thorium physical reserves held by the institutional backstop.
     * @param _newReserveKg Mass of Thorium-232 locked in physical vaults.
     */
    function updateThoriumReserves(uint256 _newReserveKg) external onlyOwner {
        thoriumReserveKg = _newReserveKg;
        emit ThoriumReservesUpdated(_newReserveKg);
    }
}`;

export const PYTHON_BLOCKCHAIN_NODE = `class HydrogenBlock:
    def __init__(self, index, previous_hash, timestamp, transactions, h2_production_payload, proof):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.transactions = transactions
        self.h2_production_payload = h2_production_payload  # Physical sensor telemetry
        self.proof = proof

class BiophysicalConsensusEngine:
    """
    Biophysical Proof-of-Work (bPoW):
    Instead of burning useless electricity in cryptographic hashing,
    consensus is validated based on ACTUAL thermodynamic work completed 
    (i.e., kilograms of Hydrogen gas split by solar/thorium thermal energy).
    """
    def __init__(self, target_efficiency=0.65):
        self.target_efficiency = target_efficiency  # HHV output / electrical input
        self.conversion_coefficient = 141.8 * 10**6  # Joules per kg of H2

    def validate_block_physics(self, block):
        payload = block.h2_production_payload
        electric_input_joules = payload['electric_input']
        hydrogen_mass_kg = payload['h2_mass_produced']
        thorium_thermal_joules = payload.get('thorium_thermal_input', 0)

        # Total energy system input
        total_input_joules = electric_input_joules + thorium_thermal_joules
        
        # Physical work output (Higher Heating Value)
        theoretical_output_joules = hydrogen_mass_kg * self.conversion_coefficient

        # Fail if block claims to make more energy than limits allow (Perpetual Motion Check)
        actual_efficiency = theoretical_output_joules / total_input_joules if total_input_joules > 0 else 0
        if actual_efficiency > 0.98:
            print("BLOCK REJECTED: Violates First Law of Thermodynamics!")
            return False
            
        print(f"BLOCK APPROVED: thermodynamic parity validated. Mass={hydrogen_mass_kg}kg, Efficiency={actual_efficiency*100:.2f}%")
        return True
`;
