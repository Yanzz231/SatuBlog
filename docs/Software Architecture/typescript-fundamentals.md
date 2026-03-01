---
sidebar_position: 1
title: TypeScript Fundamentals
---

# TypeScript Fundamentals

**An introduction to TypeScript and its core concepts.**

TypeScript is a superset of JavaScript that adds _static typing_. Unlike JavaScript's dynamic nature, TypeScript requires explicit type declarations — making code safer and easier to maintain.

---

## Project Setup

Install the required dependencies:

```bash npm2yarn
npm init -y
npm install typescript
npm install -D @types/node
npm install -D ts-node
```

Configure the script in `package.json`:

```json
{
  "scripts": {
    "start": "ts-node src/main.ts"
  }
}
```

### Project File Structure

| File                | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `package.json`      | Project root file, contains dependencies and scripts |
| `package-lock.json` | Locks dependency versions for consistency            |
| `node_modules/`     | Folder where dependencies are stored                 |
| `tsconfig.json`     | TypeScript compiler configuration                    |

---

## Variables

TypeScript supports three ways to declare variables, each with a different scope.

```typescript
// Syntax: let/var/const <name> : <type> = <value>

let str = "hello world"; // type inference (automatically string)
var str2: string = "hello world"; // explicit type
const PI = 3.14; // constant, cannot be reassigned
```

### let vs var vs const

| Keyword | Scope          | Mutable? |
| ------- | -------------- | -------- |
| `let`   | Block scope    | Yes      |
| `var`   | Function scope | Yes      |
| `const` | Block scope    | No       |

```typescript
// let -> only accessible inside the block {}
function exampleLet() {
  if (true) {
    let blockVar = "I am inside a block";
    console.log(blockVar); // ✅ OK
  }
  // console.log(blockVar); // ❌ Error: not accessible outside block
}

// var -> accessible throughout the entire function
function exampleVar() {
  if (true) {
    var funcVar = "Im inside a block";
    console.log(funcVar); // ✅ OK
  }
  console.log(funcVar); // ✅ OK (still accessible)
}
```

---

## Types

### Basic Types

The most commonly used types:

```typescript
let name1: string = "Devon"; // text
let age: number = 19; // number
let isStudent: boolean = true; // true/false
let hobbies: string[] = ["Gaming", "Sleeping"]; // array of strings
let address: [string, number] = ["Main Street", 123]; // tuple
```

#### Enum

A named set of constants. Useful for representing a fixed set of options:

```typescript
enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue",
}

let favoriteColor: Color = Color.Green;
console.log(favoriteColor); // "green"
```

> **Note:** By default, enum values start at index `0`. You can override them with custom values like above.

### Advanced Types

More flexible types for specific use cases:

```typescript
// Union — can be a string OR a number
const v: string | number = "could be a string or a number";

// Any — can be anything (avoid when possible)
const z: any = "could be everything";

// Unknown — similar to any, but safer because TypeScript
// forces you to check the type before using it
let u: unknown = 5;

// Void — for functions that return nothing
function print(): void {
  console.log("This function returns nothing");
}
```

| Type      | Description             | When to Use                   |
| --------- | ----------------------- | ----------------------------- |
| `string`  | Text                    | Names, addresses, messages    |
| `number`  | Integer & float         | Age, price, calculations      |
| `boolean` | true / false            | Status, flags                 |
| `array`   | Collection of values    | Lists of data                 |
| `tuple`   | Fixed-type array        | Coordinates, key-value pairs  |
| `enum`    | Named constants         | Days, statuses, categories    |
| `union`   | Multiple possible types | Flexible inputs               |
| `any`     | No type restriction     | Migrating from JS (avoid)     |
| `unknown` | Unrestricted but safe   | External data / API responses |
| `void`    | No return value         | Functions without return      |

---

## Interface

An interface defines the "shape" of an object — like a blueprint or contract.

```typescript
interface Person {
  name: string;
  age?: number; // ? means optional
  greet(): void;
}

const user: Person = {
  name: "Devon",
  age: 20,
  greet() {
    console.log(`Hello my name is ${this.name}`);
  },
};

user.greet(); // "Hello my name is Devon"
```

> **Tip:** Use interfaces to define data structures that are reused across multiple places in your code.

---

## Control Flow

### If-Else

```typescript
let score: number = 85;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else {
  console.log("C");
}
// Output: "B"
```

### Switch Case

Use `switch` when checking multiple conditions against the same value:

```typescript
enum DayOfTheWeek {
  Monday = 1,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

let today: number = DayOfTheWeek.Saturday;

switch (today) {
  case DayOfTheWeek.Monday:
  case DayOfTheWeek.Tuesday:
  case DayOfTheWeek.Wednesday:
  case DayOfTheWeek.Thursday:
  case DayOfTheWeek.Friday:
    console.log("Weekday");
    break;
  case DayOfTheWeek.Saturday:
  case DayOfTheWeek.Sunday:
    console.log("Weekend");
    break;
  default:
    console.log("Invalid day");
}
// Output: "Weekend"
```

### Ternary Operator

A shorthand for simple if-else expressions:

```typescript
let age: number = 18;
let canVote: string = age >= 18 ? "Yes" : "No";
console.log(`Can vote: ${canVote}`); // "Can vote: Yes"
```

---

## Loops

### For Loop

Classic loop with a counter:

```typescript
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}
```

### For...of

Iterates over the **values** of an array:

```typescript
let fruits: string[] = ["apple", "banana", "orange"];

for (let fruit of fruits) {
  console.log(fruit); // "apple", "banana", "orange"
}
```

### For...in

Iterates over the **indexes / keys** of an array or object:

```typescript
for (let fruit in fruits) {
  console.log(fruit, fruits[fruit]); // "0 apple", "1 banana", "2 orange"
}
```

> **`for...of` vs `for...in`:**
>
> - `for...of` → gives you the **value** directly
> - `for...in` → gives you the **index / key**

### While Loop

```typescript
let count: number = 0;

while (count < 5) {
  console.log(count); // 0, 1, 2, 3, 4
  count++;
}
```

### Do...While

Like `while`, but **always executes at least once** before checking the condition:

```typescript
let n = 3;

do {
  console.log(n); // 3, 2, 1
  n--;
} while (n > 0);
```

### Break

```typescript
// break -> stops the loop entirely
for (let i = 0; i < 5; i++) {
  if (i === 1) {
    break; // stops when i = 1
  }
  console.log(i); // only outputs: 0
}
```

---

## Functions

### Basic Function

```typescript
// No parameters, no return value
function greet(): void {
  console.log("Hello");
}
greet();
```

### Function with Parameters and Return Value

```typescript
function calc(length: number, width: number): number {
  return length * width;
}

calc(3, 4); // returns 12
```

### Optional Parameter

Add `?` to make a parameter optional:

```typescript
function createUser(name: string, age: number, email?: string): object {
  return {
    name,
    age,
    email: email ?? "No email provided",
  };
}

createUser("Devon", 20); // email not provided
createUser("Devon", 20, "d@x.com"); // email provided
```

### Default Parameter

The default value is used when the parameter is not passed:

```typescript
function greetUser(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}`;
}

greetUser("Devon"); // "Hello, Devon"
greetUser("Devon", "Hi"); // "Hi, Devon"
```

### Function Expression & Arrow Function

```typescript
// Function Expression
const multiply = function (x: number, y: number): number {
  return x * y;
};

// Arrow Function (more concise)
const divide = (x: number, y: number): number => {
  return x / y;
};

multiply(3, 4); // 12
divide(8, 2); // 4
```

---

## Array Methods

Built-in array functions commonly used with arrow functions:

```typescript
let numbers: number[] = [1, 2, 3, 4, 5];

// map → creates a new array by transforming each element
let doubled = numbers.map((num) => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter → creates a new array with elements that pass a condition
let evens = numbers.filter((num) => num % 2 === 0);
console.log(evens); // [2, 4]

// reduce → processes the entire array into a single value
let sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15

// forEach → runs a function for each element (no return value)
numbers.forEach((num) => console.log(num));
```

| Method      | Returns      | Purpose                      |
| ----------- | ------------ | ---------------------------- |
| `map()`     | New array    | Transform each element       |
| `filter()`  | New array    | Filter elements by condition |
| `reduce()`  | Single value | Accumulate all elements      |
| `forEach()` | `void`       | Run side effects per element |

---

## Summary

```
TypeScript Fundamentals
│
├── Variables ─────── let (block) / var (function) / const (immutable)
├── Types
│   ├── Basic ─────── string, number, boolean, array, tuple, enum
│   └── Advanced ──── union, any, unknown, void
├── Interface ─────── Blueprint / contract for object shapes
├── Control Flow ──── if-else, switch, ternary
├── Loops ─────────── for, for-of, for-in, while, do-while
└── Functions ─────── regular, optional param, default param, arrow
```
