import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isValidCharacter, isValidOperator } from '@/helpers/validators';

interface OperationState {
    input: string;
    historyResult: string[];
    historyOp: string[];
}

const initialState: OperationState = {
    input: "",
    historyResult: [],
    historyOp: [],
}

export const operationSlice = createSlice({
    name: "operation",
    initialState,
    reducers: {
        appendInput: (state, action: PayloadAction<string>) => {
            const lastChar = state.input[state.input.length - 1];
            const secondLastChar = state.input[state.input.length - 2];

            if (state.input === "ERROR") {
                state.input = "";
            }

            if (!isNaN(Number(action.payload))) {  
                if (state.historyResult.includes(state.input)) {  
                    state.input = "";  
                }
            }

            if (action.payload === "%" && isValidOperator(lastChar)) {
                state.input = "ERROR";
                return;
            }

            if (!state.input && ["+", "*", "/", ".", "%"].includes(action.payload)) {
                return;
            }

            if (isValidOperator(lastChar) && isValidOperator(action.payload)) {
                state.input = state.input.slice(0, -1);  
            }

            if (action.payload === "0" && lastChar === "0" && (!secondLastChar || isValidOperator(secondLastChar))) {
                return;
            }

            if (action.payload === "." && state.input.includes(".")) {
                const lastOperatorIndex = Math.max(
                    state.input.lastIndexOf("+"),
                    state.input.lastIndexOf("-"),
                    state.input.lastIndexOf("*"),
                    state.input.lastIndexOf("/")
                );
                const fragmentAfterLastOperator = state.input.slice(lastOperatorIndex + 1);
                if (fragmentAfterLastOperator.includes(".")) {
                    return;
                }
            }

            if (action.payload === "%") {
                const percentageOperation = state.input + "%";
                const result = parseFloat(state.input) / 100;

                state.historyOp.push(percentageOperation);
                state.historyResult.push(result.toString());

                state.input = result.toString();
            } else if (isValidCharacter(action.payload)) {
                state.input += action.payload;
            }
        },
        evaluate: (state) => {
            const lastChar = state.input[state.input.length - 1];

            if (state.input === "ERROR") {
                state.input = "";
                return;
            }

            if (isValidOperator(lastChar)) {
                state.input = "ERROR";
                return;
            }

            const currentOperation = state.input;
            const result = evaluateExpression(currentOperation);

            if (result === "ERROR") {
                state.input = "ERROR";
                return;
            }

            state.historyResult.push(result);
            state.historyOp.push(currentOperation);
            state.input = result.toString();
        },
        clear: (state) => {
            state.input = "";
        },
        deleteLastCharacter: (state) => {
            state.input = state.input.slice(0, -1);
        }
    }
});

function evaluateExpression(expr: string): string {
    try {
        console.log("Evaluating:", expr);
        const result = eval(expr);
        console.log("Result:", result);
        if (/\/0(?![.0-9])/.test(expr) && !Number.isFinite(result)) {
            return "ERROR";
        }        
        return result.toString();
    } catch (error) {
        console.error("Expression Error:", error);
        
        return "ERROR";
    }
}

export const { appendInput, evaluate, clear, deleteLastCharacter } = operationSlice.actions;
export default operationSlice.reducer;
