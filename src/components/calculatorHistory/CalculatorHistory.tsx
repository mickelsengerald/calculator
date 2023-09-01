"use client"

import { ToggleProps } from "@/app/page";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { operationSlice } from "@/redux/features/operationSlice";
import styles from "./calculatorHistory.module.scss";
import {TbTrashX} from 'react-icons/tb'

function CalculatorHistory({ onToggle }: ToggleProps) {

    const historyOp = useAppSelector(state => state.operation.historyOp);
    const historyResult = useAppSelector(state => state.operation.historyResult);

    const dispatch = useAppDispatch();

    const handleDelete = (indexToDelete: number) => {
        const correctIndex = historyOp.length - 1 - indexToDelete;
        dispatch(operationSlice.actions.deleteOperationAndResult(correctIndex));
    }
    

    function handleClear() {
        dispatch(operationSlice.actions.clearHistory());
    }

    return (
        <div className={styles.container}>
            <button onClick={onToggle} className={styles.buttonSwitch}>X</button>
            <h3 className={styles.littleHistory}>History</h3>
            <div className={styles.historyScrollContainer}>
                {[...historyOp].reverse().map((operation, index) => (
                    <div key={index}>
                        <div className={styles.operationContainer}>
                            <h3>{operation}</h3>
                            <button onClick={() => handleDelete(index)}><TbTrashX/></button>
                        </div>
                        <h2 className={styles.bigText}>{historyResult[historyOp.length - 1 - index]}</h2>
                        <div className={styles.divider}></div>
                    </div>
                ))}
            </div>
            <button onClick={handleClear} className={styles.clearButton}>Clear</button>
        </div>
    )
}

export default CalculatorHistory