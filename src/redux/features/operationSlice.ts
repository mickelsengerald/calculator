import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isValidCharacter, isValidOperator } from '@/helpers/validators';
import Swal from 'sweetalert2';
import { evaluateExpression } from '@/helpers/utils';

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

            if (state.input.length >= 14) {
                Swal.fire({
                    text: "Input limit is 14 characters including symbols and numbers",
                    icon: 'info',
                    confirmButtonText: '（︶^︶）'
                });
                return;
            }

            if (state.input === "SYNTAX ERROR") {
                state.input = "";
            }

            if (!isNaN(Number(action.payload))) {  
                if (state.historyResult.includes(state.input)) {  
                    state.input = "";  
                }
            }

            if (action.payload === "%" && isValidOperator(lastChar)) {
                state.input = "SYNTAX ERROR";
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

            if (action.payload === "." && state.historyResult.includes(state.input)) {
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

            if (action.payload === ")") {
                const openBracketsCount = state.input.split("(").length - 1;
                const closeBracketsCount = state.input.split(")").length - 1;
            
                if (closeBracketsCount >= openBracketsCount) {
                    return;
                }
            }

            if (action.payload === "%") {
                const percentageOperation = state.input + "%";
                const portion = parseFloat(state.input) / 100;
                const result = parseFloat(portion.toFixed(3))
                state.historyOp.push(percentageOperation);
                state.historyResult.push(result.toString());

                state.input = result.toString();
            } else if (isValidCharacter(action.payload)) {

                const lastOperatorIndex = Math.max(
                    state.input.lastIndexOf("+"),
                    state.input.lastIndexOf("-"),
                    state.input.lastIndexOf("*"),
                    state.input.lastIndexOf("/")
                );
                const fragmentAfterLastOperator = state.input.slice(lastOperatorIndex + 1);

                if (fragmentAfterLastOperator === "0" && !isNaN(Number(action.payload)) && action.payload !== "0" && action.payload !== "." && !fragmentAfterLastOperator.includes('.')) {
                    state.input = state.input.slice(0, lastOperatorIndex + 1) + action.payload;
                    return;
                }
                state.input += action.payload;
            }
        },
        evaluate: (state) => {
            const lastChar = state.input[state.input.length - 1];

            if (state.input === "SYNTAX ERROR") {
                state.input = "";
                return;
            }

            if (isValidOperator(lastChar)) {
                state.input = "SYNTAX ERROR";
                return;
            }

            const currentOperation = state.input;
            const result = evaluateExpression(currentOperation);

            if (result === "SYNTAX ERROR") {
                state.input = "SYNTAX ERROR";
                return;
            }

            state.historyResult.push(result);
            state.historyOp.push(currentOperation);
            state.input = result
        },
        clear: (state) => {
            state.input = "";
        },
        deleteLastCharacter: (state) => {
            state.input = state.input.slice(0, -1);
        },
        deleteOperationAndResult: (state, action: PayloadAction<number>) => {
            const indexToDelete = action.payload;
            state.historyOp.splice(indexToDelete, 1);
            state.historyResult.splice(indexToDelete, 1);
        },
        clearHistory: (state) => {
            state.historyOp = [];
            state.historyResult = [];
        }
    }
});

export const { appendInput, evaluate, clear, deleteLastCharacter, deleteOperationAndResult, clearHistory } = operationSlice.actions;
export default operationSlice.reducer;
