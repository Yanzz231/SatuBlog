---
sidebar_position: 3
title: Creational Design Patterns
---

# Creational Design Patterns

**Design patterns are effective solutions to recurring problems found in software development.**

A pattern is not code you copy-paste — it's a blueprint that needs to be adapted to your specific context. One pattern can solve multiple problems, but not every problem needs a pattern.

> Source: [Refactoring Guru](https://refactoring.guru/design-patterns)

---

## Singleton

**Ensure a class has only one instance, and provide a global point of access to it.**

### The Problem

When multiple repositories need a database connection, each creates its own instance — leading to redundant connections and wasted resources.

```typescript
// problem1-singleton/databaseConnection.before.ts
class DatabaseConnection {
  constructor() {
    if (this.isConnectionFull()) throw Error("Connection pool is full");
    this.init(); // expensive setup, repeated every time
  }
}

// ❌ Each repository spins up its own connection
const userRepo = new UserRepository(); // new connection
const productRepo = new ProductRepository(); // another new connection
const txRepo = new TransactionRepository(); // yet another
```

### The Solution

Make the constructor private and expose a static `getInstance()` method. The instance is created once and reused every time.

```typescript
// problem1-singleton/databaseConnection.ts
export class DatabaseConnection {
  private static _instance: DatabaseConnection | null = null;
  private static maxConnectionPool: number = 2;
  private static currentConnectionPool: number = 0;

  private constructor() {
    if (this.isConnectionFull()) throw Error("Connection pool is full");
    this.init();
  }

  public static getInstance(): DatabaseConnection {
    if (this._instance === null) {
      this._instance = new DatabaseConnection();
    }
    return this._instance; // always returns the same instance
  }
}
```

Usage:

```typescript
// problem1-singleton/demo.ts
const userRepo = new UserRepository(); // ✅ shares same connection
// inside UserRepository → DatabaseConnection.getInstance()

const productRepo = new ProductRepository();
// inside ProductRepository → DatabaseConnection.getInstance() (same instance)
```

### When to Use

- You need exactly one instance shared across the entire app (e.g., DB connection, config, logger)
- Creating the object is expensive and should only happen once

---

## Builder

**Construct complex objects step by step, separating the construction process from the final object.**

### The Problem

Building a query with many optional parameters leads to messy constructors or scattered configuration logic.

```typescript
// ❌ Before: hard to read, hard to extend
const query = new Query("users", ["id", "username"], ["age > 18"]);
```

### The Solution

Use a Builder class with chainable methods. Each method sets one part of the object and returns `this`, allowing method chaining.

```typescript
// problem2-builder/QueryBuilder.ts
export class QueryBuilder implements IQueryBuilder {
  private _table: string;
  private _selectFields: string[];
  private _whereClauses: string[];

  constructor(table: string, selectFields: string[] = ["*"]) {
    this._table = table;
    this._selectFields = selectFields;
    this._whereClauses = [];
  }

  setTable(table: string): IQueryBuilder {
    this._table = table;
    return this; // enables chaining
  }

  setSelectFields(fields: string[]): IQueryBuilder {
    this._selectFields = fields;
    return this;
  }

  setWhereClauses(clauses: string[]): IQueryBuilder {
    this._whereClauses = clauses;
    return this;
  }

  get(): Query {
    return new Query(this._table, this._selectFields, this._whereClauses);
  }
}
```

Usage:

```typescript
// problem2-builder/demo.ts
const query = new QueryBuilder("users", ["id", "username", "email"])
  .setWhereClauses(["age > 18"])
  .get();

query.print();
```

### When to Use

- Constructing objects with many optional configurations
- You want a readable, step-by-step construction process
- The same construction process should produce different representations

---

## Prototype

**Create new objects by cloning an existing one, instead of building from scratch.**

### The Problem

Some objects are expensive to initialize. Creating multiple similar objects means repeating that costly setup every time.

```typescript
// ❌ Before: every invoice re-runs the heavy setup
const invoice1 = new Invoice("ABC Corp", logo, footer, date, "Client A", [...], 1200);
// "Initializing new invoice..."
// "Loading invoice layout template..."
// "Loading company logo and footer..."
// "Setting up styles and fonts..."

const invoice2 = new Invoice("ABC Corp", logo, footer, date, "Client B", [...], 800);
// same heavy setup again...
```

### The Solution

Implement a `clone()` method on the class. Create one base object, then clone it and only change what's different.

```typescript
// problem3-prototype/invoice.ts
export class Invoice implements IClonable {
  // ... properties

  clone(): Invoice {
    return new Invoice(
      this._companyName,
      this._logo,
      this._footer,
      this._date,
      this._clientName,
      this._items,
      this._totalAmount,
    );
  }
}
```

Usage:

```typescript
// problem3-prototype/demo.ts
const invoice1 = new Invoice(
  "ABC Corp",
  logo,
  footer,
  new Date(),
  "Client A",
  ["Laptop", "Mouse"],
  1200,
);

const invoice2 = invoice1.clone();
invoice2.clientName = "Client B";
invoice2.items = ["Monitor", "Keyboard"];
invoice2.totalAmount = 800;

const invoice3 = invoice1.clone();
invoice3.clientName = "Client C";
invoice3.items = ["Desk Chair"];
invoice3.totalAmount = 300;

invoice1.print();
invoice2.print();
invoice3.print();
```

### When to Use

- Object creation is expensive (heavy setup, DB calls, file loading)
- You need many similar objects that differ only in a few properties
- You want to avoid subclassing just to get a different initial state

---

## Summary

| Pattern       | Intent                                       | Key Mechanism                         |
| ------------- | -------------------------------------------- | ------------------------------------- |
| **Singleton** | One instance only, shared globally           | Private constructor + `getInstance()` |
| **Builder**   | Build complex objects step by step           | Chainable methods + `get()`           |
| **Prototype** | Clone existing objects instead of recreating | `clone()` method                      |

```
Creational Patterns
│
├── Singleton ── One instance, shared everywhere
├── Builder ──── Step-by-step construction via chaining
└── Prototype ── Clone instead of rebuild from scratch
```
