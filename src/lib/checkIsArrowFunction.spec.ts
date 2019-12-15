// @ts-nocheck
// note: ⬆ disable TypeScript types for these tests because it needlessly complicates and clutters them hurting readability, dynamic test name matching, etc

import { checkIsArrowFunction } from './checkIsArrowFunction';

/* tslint:disable */

function sum (a, b) {
    return a + b;
}

function sumWithEnclosedArrow (a, b) {
    return () => a + b;
}

const diffExpression = function (a, b) {
    return a - b;
};

const diffExpressionWithEnclosedArrow = function (a, b) {
    return () => a - b;
};

const shorthandFn = {
    f() { return 'x'; }
};

const tests: Array<[any, boolean]> = [
    // --- arrow function tests
    [ () => {}, true ],
    [ ()=>{}, true ],
    [ () => 1, true ],
    [ (x) => x, true ],
    [ (x) => {return x}, true ],
    [ (x) => (y) => x + y, true ],
    [ (x) => (y) => (z) => z(x)(y), true ],
    [ (callback = () => 4) => callback, true],
    [ (callback=()=>4)=>callback, true],
    [ ({prop}) => prop, true ], // destructuring function arg
    [ ({prop}: {prop: (hello: () => {}) => {}}) => prop, true ], // destructuring function arg with typings
    [ (callback = () => "(yo") => callback, true ], // nested arrow with " double-quote char and enclosed open-parentheses
    [ (callback = () => "\"(yo") => callback, true ], // nested arrow with escaped " double-quote char and enclosed open-parentheses
    [ (callback=()=>"\"(yo")=>callback, true ], // nested arrow with escaped " double-quote char (no spaces) and enclosed open-parentheses
    [ (callback = () => '(yo') => callback, true ], // nested arrow with ' single-quote char and enclosed open-parentheses
    [ (callback = () => '\'(yo') => callback, true ], // nested arrow with escaped ' single-quote char and enclosed open-parentheses
    [ (callback = () => `(yo`) => callback, true ], // nested arrow with ` back-tick char and enclosed open-parentheses
    [ (callback = () =>`\`(yo`) => callback, true ], // nested arrow with escaped ` back-tick char and enclosed open-parentheses
    [ (() => {}), true ], // closure wrapping arrow function
    [ ((() => {})), true ], // closure x2 wrapping arrow function
    [ r => r, true ], // unary function with no parenthesis
    [
        (a = function() {
            if (Math.random() < 0.5) {
                return 42;
            }
            return "something else";
        }) => a(),
        true,
    ], // complex example with a lot going on including linebreaks, closures, etc
    // --- regular function tests
    [ function a () {}, false ], // function declaration
    [ function a () { return () => 0 }, false ], // function declaration with enclosed arrow function
    [ function f() { return "=>" }, false ], // function declaration with arrow-like characters
    [ function (callback = () => null) { return 'foo' }, false ], // function declaration
    [ sum, false ], // function declaration
    [ sumWithEnclosedArrow, false ], // function expression with enclosed arrow function
    [ diffExpression, false], // function expression
    [ diffExpressionWithEnclosedArrow, false ], // function expression with enclosed arrow function
    [ ((function() {})), false], // closure wrapping function declaration
    [ (((function() {}))), false], // closure x2 wrapping function declaration
    [ new Function('return this'), false ],
    [ shorthandFn, false ],
    // --- built-in functions
    [ setTimeout, false ],
    [ Math.min, false ],
    // --- non-function/invalid types
    [ (() => {})(), false ], // accidental call for anonymous arrow function
    [ undefined, false ], // undefined
    [ null, false ], // null
    [ {}, false ], // object
    [ [], false ], // array
    [ 1, false ], // number
    [ "() => {}", false ], // string mimicking arrow function
    [ '() => {}', false ], // string mimicking arrow function
    [ `() => {}`, false ], // string mimicking arrow function
    [ Symbol(() => {}), false ], // symbol
    [ Symbol(function () {}), false ], // symbol
];

/* tslint:enable */

tests.forEach((value, index: number) => {
    test(`checkIsArrowFunction index_${index} - ${value[0] && value[0].toString()}`, () => {
        expect(checkIsArrowFunction(value[0])).toBe(value[1]);
    });
});
