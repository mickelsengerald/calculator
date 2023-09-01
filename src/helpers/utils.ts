export function evaluateExpression(expr: string): string {
    try {
        const result = eval(expr);
        const roundedResult = parseFloat(result.toFixed(3));
        if (/\/0(?![.0-9])/.test(expr) && !Number.isFinite(result)) {
            return "SYNTAX ERROR";
        }        
        return roundedResult.toString();
    } catch (error) {
        console.error("Expression Error:", error);
        
        return "SYNTAX ERROR";
    }
}

