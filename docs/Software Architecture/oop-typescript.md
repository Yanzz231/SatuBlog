---
sidebar_position: 2
title: OOP in TypeScript
---

# OOP in TypeScript

**Object-Oriented Programming in TypeScript.**

---

## Class

A class is a blueprint for creating objects. It defines attributes (properties) and behaviors (methods).

```typescript
// model/Animal.ts
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  makeSound(): void {
    console.log(`${this.name} makes a sound`);
  }
}
```

### Project Structure

Organizing classes into separate files keeps the codebase clean:

```
src/
├── index.ts
└── model/
    ├── Animal.ts
    ├── Cat.ts
    └── Running.ts
```

---

## Access Modifiers

Access modifiers control where a class member (attribute or method) can be accessed.

| Modifier    | Accessible From                     |
| ----------- | ----------------------------------- |
| `public`    | Anywhere (default)                  |
| `protected` | Inside the class and its subclasses |
| `private`   | Only inside the class itself        |
| `readonly`  | Anywhere, but cannot be reassigned  |

```typescript
// model/Animal.ts
abstract class Animal {
  protected _name: string; // accessible in class + subclasses
  protected _age: number;
  protected _species: string = "unknown";

  constructor(name: string, age: number = 10, species?: string) {
    this._name = name;
    this._age = age;
    if (species) this._species = species;
  }
}
```

---

## Getter & Setter

Getters and setters provide controlled access to private/protected properties.

```typescript
// model/Animal.ts
// Getter — read a property
get name(): string {
    return this._name;
}

get age(): number {
    return this._age;
}

// Setter — update a property
set name(newName: string) {
    this._name = newName;
}

set age(newAge: number) {
    this._age = newAge;
}
```

Usage:

```typescript
const animal = new Animal("Devon");
console.log(animal.name); // uses getter
animal.name = "Riccy"; // uses setter
```

---

## Abstract Class

An abstract class cannot be instantiated directly — it serves as a base for other classes. Abstract methods must be implemented by subclasses.

```typescript
// model/Animal.ts
abstract class Animal {
  protected _name: string;

  constructor(name: string) {
    this._name = name;
  }

  // Must be implemented by every subclass
  public abstract makeSound(): void;
}

// ❌ Cannot do this:
// const animal = new Animal("Devon");
```

> **When to use:** When you want to enforce a common structure across multiple related classes, but each class has its own implementation.

---

## Inheritance

A class can extend another class to inherit its properties and methods using `extends`. Use `super()` to call the parent constructor.

```typescript
// model/Cat.ts
class Cat extends Animal {
  constructor(lives: number, name: string, age: number = 10, species?: string) {
    super(name, age, species); // calls Animal's constructor
    Cat._lives += 1;
  }
}
```

---

## Static Members

Static members belong to the **class itself**, not to individual instances/objects.

```typescript
// model/Cat.ts
class Cat extends Animal {
  static _lives: number = 9; // shared across all Cat instances
}

// Before creating any Cat objects
console.log(`Total lives: ${Cat._lives}`); // 9

const cat1 = new Cat(9, "Ginger");
const cat2 = new Cat(11, "Jumbo");

// After creating 2 Cat objects
console.log(`Total lives: ${Cat._lives}`); // 11
```

> **Note:** Access static members via the class name (`Cat._lives`), not via an instance.

---

## Interface

An interface defines a contract — any class that `implements` it must provide the specified methods.

```typescript
// model/Running.ts
interface Running {
  run(): void;
}
```

```typescript
// model/Cat.ts
class Cat extends Animal implements Running {
  // Must implement run() because of the Running interface
  public run(): void {
    console.log(`${this.name} is running`);
  }
}
```

> **Interface vs Abstract Class:**
>
> - Interface → defines _what_ a class must do (contract)
> - Abstract class → defines _what_ and can provide _partial implementation_ (base)

---

## Method Overloading

Overloading allows a method to accept different parameter types or counts — with different behavior for each.

```typescript
// model/Cat.ts
class Cat extends Animal implements Running {
  // Overload signatures
  public run(): void;
  public run(destination: string): void;
  public run(speed: number): void;

  // Single implementation that handles all cases
  public run(input?: number | string): void {
    if (!input) {
      console.log(`${this.name} is running`);
    } else if (typeof input === "string") {
      console.log(`${this.name} is running towards ${input}`);
    } else if (typeof input === "number") {
      console.log(`${this.name} is running at ${input}`);
    }
  }
}
```

Usage:

```typescript
cat1.run(); // "Ginger is running"
cat1.run("Sofa"); // "Ginger is running towards Sofa"
cat1.run(10); // "Ginger is running at 10"
```

---

## Method Overriding

Overriding means a subclass provides its own implementation of a method defined in the parent (abstract) class.

```typescript
// model/Animal.ts
public abstract makeSound(): void;

// model/Cat.ts — override:

// In Cat (override):
public makeSound(): void {
    console.log(`${this.name} is meowing`);
}
```

> **Overloading vs Overriding:**
>
> - **Overloading** — same method name, different parameters
> - **Overriding** — same method name, different implementation (from parent)

---

## Putting It All Together

```typescript
// index.ts
import { Cat } from "./model/Cat";

// Static member — before any object is created
console.log(`Total lives: ${Cat._lives}`); // 9

const cat1 = new Cat(9, "Ginger");
cat1.makeSound(); // "Ginger is meowing"
cat1.run(); // "Ginger is running"
cat1.run("Sofa"); // "Ginger is running towards Sofa"
cat1.run(10); // "Ginger is running at 10"

const cat2 = new Cat(11, "Jumbo");

// Static member — after 2 objects created
console.log(`Total lives: ${Cat._lives}`); // 11
```

---

## Summary

```
OOP in TypeScript
│
├── Class ──────────── Blueprint for creating objects
├── Access Modifiers ── public / protected / private / readonly
├── Getter & Setter ─── Controlled access to properties
├── Abstract Class ──── Base class, cannot be instantiated
├── Inheritance ─────── extends + super()
├── Static Members ──── Belong to the class, not instances
├── Interface ───────── Contract a class must fulfill (implements)
├── Overloading ─────── Same method, different parameters
└── Overriding ──────── Same method, different implementation
```
