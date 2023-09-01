"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { operationSlice } from "@/redux/features/operationSlice";
import { isValidCharacter } from "../../helpers/validators";
import { useRef } from "react";
import { ToggleProps } from "@/app/page";
import styles from "./calculatorLogic.module.scss";

function CalculatorLogic({ onToggle }: ToggleProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const op = useAppSelector((state) => state.operation.input);
    const dispatch = useAppDispatch();

    const history = useAppSelector((state) => state.operation.historyOp);
    const lastOperation = history[history.length - 1] || "";

    const row1 = ["AC", "◁", "/", "*"];
    const row2 = ["7", "8", "9", "-"];
    const row3 = ["4", "5", "6", "+"];
    const row4 = ["1", "2", "3", "("];
    const row5 = ["%", "0", ".", ")"];

    function handleKeyDown(event: React.KeyboardEvent) {
        if (isValidCharacter(event.key)) {
        dispatch(operationSlice.actions.appendInput(event.key));
        } else if (event.key === "Enter") {
        dispatch(operationSlice.actions.evaluate());
        } else if (event.key === "Escape") {
        dispatch(operationSlice.actions.clear());
        if (inputRef.current) {
            inputRef.current.focus();
        }
        } else if (event.key === "Backspace") {
        dispatch(operationSlice.actions.deleteLastCharacter());
        }
    }

    return (
        <div className={styles.container}>
        <button onClick={onToggle} className={styles.buttonSwitch}>◷</button>
        <h4 className={styles.littleText}>{lastOperation}</h4>
        <input className={styles.bigText} value={op} readOnly onKeyDown={handleKeyDown} />

        <div className={styles.divider}></div>
        
        {[row1, row2, row3, row4, row5].map((row, index) => (
            <div key={index} className={styles.row}>
            {row.map((btn) => (
                <button
                className={styles.button}
                key={btn}
                onClick={() => {
                    if (btn === "AC") {
                    dispatch(operationSlice.actions.clear());
                    } else if (btn === "◁") {
                    dispatch(operationSlice.actions.deleteLastCharacter());
                    } else {
                    dispatch(operationSlice.actions.appendInput(btn));
                    }
                }}
                >
                {btn}
                </button>
            ))}
            </div>
        ))}

        <button className={styles.button} onClick={() => dispatch(operationSlice.actions.evaluate())}>
            =
        </button>
        </div>
    );
}

export default CalculatorLogic;

