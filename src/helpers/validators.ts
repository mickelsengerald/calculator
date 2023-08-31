export function isValidCharacter(character: string): boolean {
    const validChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", "%", ".", "(", ")"];
    return validChars.includes(character);
}  

export function isValidOperator(character: string): boolean {
    return ["+", "-", "*", "/"].includes(character);
}


