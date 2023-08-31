"use client"

import CalculatorLogic from "@/components/CalculatorLogic";
import CalculatorHistory from "@/components/CalculatorHistory";
import {useState} from 'react'

export type ToggleProps = {
  onToggle: () => void;
}

export default function Home() {
  
  const [showCalculator, setShowCalculator] = useState(true);

  const toggleShowCalculator = () => {
    setShowCalculator(prevState => !prevState);
  };
  
  return (
    <main>
      <div>
      {showCalculator ? 
          <CalculatorLogic onToggle={toggleShowCalculator} /> :
          <CalculatorHistory onToggle={toggleShowCalculator} />
        }
      </div>
    </main>
  );
}



