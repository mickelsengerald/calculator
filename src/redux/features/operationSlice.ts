import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

            // Si hay un error, limpiamos el input antes de agregar cualquier otro caracter
            if (state.input === "ERROR") {
                state.input = "";
            }

            if (action.payload === "%" && isValidOperator(lastChar)) {
                state.input = "ERROR";
                return;
            }

            // Rule 1: Start with number or "-"
            if (!state.input && ["+", "*", "/", ".", "%"].includes(action.payload)) {
                return;
            }

            // Rule 2: Prevent two symbols in sequence
            if (isValidOperator(lastChar) && isValidOperator(action.payload)) {
                return;
            }

            // Rule 3: Prevent "00" before a dot ONLY if it's the start or after an operator
            if (action.payload === "0" && lastChar === "0" && (!secondLastChar || isValidOperator(secondLastChar))) {
                return;
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

            // Si hay un error, limpiamos el input y salimos
            if (state.input === "ERROR") {
                state.input = "";
                return;
            }

            // Rule 4: Error if expression ends with an operator
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
    if (containsInvalidOctal(expr)) {
        return "ERROR";
    }
    try {
        const result = eval(expr);
        if (expr.includes("/0") && !Number.isFinite(result)) {
            return "ERROR";
        }
        return result.toString();
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error("Expression Error:", error);
        }
        return "ERROR";
    }
}

export function isValidCharacter(character: string): boolean {
    const validChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", "%", ".", "(", ")"];
    return validChars.includes(character);
}  

export function isValidOperator(character: string): boolean {
    return ["+", "-", "*", "/"].includes(character);
}

function containsInvalidOctal(expr: string): boolean {
    const regex = /\b0[0-9]+\b/;
    return regex.test(expr);
}

export const { appendInput, evaluate, clear, deleteLastCharacter } = operationSlice.actions;
export default operationSlice.reducer;
