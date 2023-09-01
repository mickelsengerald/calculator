export function evaluateExpression(expr: string): string {
    try {
        const result = eval(expr);
        if (/\/0(?![.0-9])/.test(expr) && !Number.isFinite(result)) {
            return "SYNTAX ERROR";
        }        
        return result.toString();
    } catch (error) {
        console.error("Expression Error:", error);
        
        return "SYNTAX ERROR";
    }
}

