# ➡ check-is-arrow-function

Checks whether a function is an arrow function using a very targeted and streamlined, yet simple, parser. Written with TypeScript.

## Install

```shell script
yarn add check-is-arrow-function
```

```shell script
npm i check-is-arrow-function
```

## Why?

Some libraries need the ability to test a traditional function declaration/expression vs an arrow function (as first introduced in ES2015).

## How is this library different than the rest?

Most solutions use regex to test for an arrow function 😬
This is extremely limiting. 
A parser is necessary to reliably catch all the weird syntax and cases that exist.

This library throws **40+** tests at `checkIsArrowFunction` to catch everything from super simple to real odd cases.

## Case examples

Here are some cases that check-is-arrow tests against:

```js
checkIsArrowFunction(() => {}); // true
checkIsArrowFunction(()=>{}); // true
checkIsArrowFunction(() => 1); // true
checkIsArrowFunction((x) => x); // true
checkIsArrowFunction((x) => (y) => x + y); // true
checkIsArrowFunction((callback = () => 4) => callback); // true
checkIsArrowFunction((callback=()=>4)=>callback); // true
checkIsArrowFunction(({prop}) => prop); // true
checkIsArrowFunction((callback = () => "(yo") => callback); // true
checkIsArrowFunction((callback = () => "\"(yo") => callback); // true
checkIsArrowFunction((() => {})); // true
checkIsArrowFunction(r => r); // true
checkIsArrowFunction(function a () {}); // false
checkIsArrowFunction(function a () { return () => 0 }); // false
checkIsArrowFunction(function f() { return "=>" }); // false
checkIsArrowFunction(function (callback = () => null) { return 'foo' }); // false
```
