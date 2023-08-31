"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { operationSlice } from "@/redux/features/operationSlice";
import { isValidCharacter } from "./../helpers/validators";
import {useRef} from "react"

function CalculatorLogic() {
    const inputRef = useRef<HTMLInputElement>(null);

    const op = useAppSelector(state => state.operation.input);
    const dispatch = useAppDispatch();

    const history = useAppSelector(state => state.operation.historyOp);
    const lastOperation = history[history.length - 1] || "";

    const buttons = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", "%", ".", "(", ")"];

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
        <div>
            <p>{lastOperation}</p>
            <input value={op} readOnly onKeyDown={handleKeyDown} />
            {buttons.map((btn) => (
                <button
                    key={btn}
                    onClick={() => dispatch(operationSlice.actions.appendInput(btn))}
                    >
                    {btn}
                </button>
            ))}
            <button onClick={() => dispatch(operationSlice.actions.evaluate())}>=</button>
            <button onClick={() => dispatch(operationSlice.actions.clear())}>AC</button>
            <button onClick={() => dispatch(operationSlice.actions.deleteLastCharacter())}>Back</button>
        </div>
    )
}

export default CalculatorLogic