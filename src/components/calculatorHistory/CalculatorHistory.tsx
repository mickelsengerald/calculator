"use client"

import { ToggleProps } from "@/app/page";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { operationSlice } from "@/redux/features/operationSlice";

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
        <div >
            <p>History</p>
            {[...historyOp].reverse().map((operation, index) => (
            <div key={index}>
                <span>{operation} = {historyResult[historyOp.length - 1 - index]}</span>
                <button onClick={() => handleDelete(index)}>Delete</button>
            </div>
            ))}
            <button onClick={handleClear}>Clear</button>
            <button onClick={onToggle}>Calculator</button>
        </div>
    )
}

export default CalculatorHistory