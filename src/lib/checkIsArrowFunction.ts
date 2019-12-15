/**
 * Checks whether the given function is an arrow function or not.
 * Uses custom parser since regex has its limitations when evaluating source code.
 * @param fn - The function to be tested.
 * @returns True or False result.
 */
// tslint:disable-next-line:ban-types
export function checkIsArrowFunction<F extends Function>(fn: F): boolean {
    if (!fn || typeof fn !== 'function') {
        return false;
    }

    // the string representation of the string to be parsed through
    const fnStr = fn.toString();
    // the index of the string representation being evaluation
    let currentIndex: number = 0;
    let openParenCount: number = 0;
    // tracks where we're within a bracket
    // note: this is necessary to later check if arrow function is enclosed within another function and should therefore be ignored
    let openBracketCount: number = 0;
    let char: string;
    let charLast: string | undefined;
    let openStringChar: string | undefined;

    while (currentIndex < fnStr.length) {
        char = fnStr[currentIndex];

        // if arrow function's "=>" sequence found AND there are no open parenthesis (either because they're closed or this is a unary function with no parens) AND no open brackets (cause that would mean we're enclosed within outer function)
        if (char === '=' && openParenCount === 0 && openBracketCount === 0 && currentIndex + 1 < fnStr.length && fnStr[currentIndex + 1] === '>') {
            return true;
        }
        // if opening parentheses and not currently within in string
        else if (char === '(' && !openStringChar) {
            openParenCount++;
        }
        // if closing parentheses and not currently within in string
        else if (char === ')' && !openStringChar) {
            openParenCount--;
        }
        // if opening bracket and not currently within in string
        else if (char === '{' && !openStringChar) {
            openBracketCount++;
        }
        // if closing bracket and not currently within in string
        else if (char === '}' && !openStringChar) {
            openBracketCount--;
        }
        // if string literal or template literal
        else if (char === '"' || char === '\'' || char === '`') {
            // if within string/template literal AND is enclosed with the same char as the opening AND the current char is NOT escaped by last char
            if (openStringChar && char === openStringChar && charLast !== '\\') {
                // close string by clearing the opening value
                openStringChar = undefined;
            }
            // if NOT within string/template literal
            else if (!openStringChar) {
                // close string by storing the opening value
                openStringChar = char;
            }
        }

        charLast = char;
        currentIndex++;
    }

    return false;
}
