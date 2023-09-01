"use client"

import CalculatorLogic from "@/components/calculatorLogic/CalculatorLogic";
import CalculatorHistory from "@/components/calculatorHistory/CalculatorHistory";
import {useState} from 'react'
import styles from './page.module.scss';

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
      <div className={styles.mainContainer}>
        {showCalculator ? 
          <CalculatorLogic onToggle={toggleShowCalculator} /> :
          <CalculatorHistory onToggle={toggleShowCalculator} />
        }
      </div>
    </main>
  );
}



