---
sidebar_position: 2
title: Object-Oriented Abusers
---

# Object-Oriented Abuser

**All type of Object-Oriented Abusers, explanations, examples, and how to refactor it**

All these smells are incomplete or incorrect application of object-oriented programming principles.

> Source: [Refactoring Guru](https://refactoring.guru/refactoring/smells/oo-abusers)

---

## Switch Statements

You have a complex `switch` operator or sequence of `if` statements.

### Problem 

Think about in future you will have other part that must be filtered with if. therefore, you must have other else or case statement. This approach is bad, and also violates one of the SOLID Principle, Open Closed Principle. 

### Example 

```java
public double calculateDiscount(String customerType, double price) {
    switch (customerType) {
        case "REGULAR":
            return price * 0.05;
        case "VIP":
            return price * 0.20;
        default:
            return 0;
    }
}
```

### Solution 

Rather than declare `customerType` as `String`, we can make it as an abstract class. `REGULAR` and `VIP` are changed to be classes, that inherit `customerType`.

### Example Solution

```java
interface DiscountStrategy {
    double apply(double price);
}

class VipDiscount implements DiscountStrategy {
    public double apply(double price) { return price * 0.20; }
}

class RegularDiscount implements DiscountStrategy {
    public double apply(double price) { return price * 0.05; }
}

// Usage: No switch needed!
public double calculate(DiscountStrategy strategy, double price) {
    return strategy.apply(price);
}
```

### Comparasion (Before & After)

| Feature         | Switch Statements (Before)                                      | Refactored (After)                                                |
| --------------- | --------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Readibility** | Giant blocks of `case` logic hide the real goal.                | Each class does exactly one thing clearly.                        |
| **Testing**     | You must test every branch in one giant method.                 | You test each discount class in its own file.                     |
| **Maintenance** | Adding a new type requires editing multiple files.              | Just create a new class without touching old code.                |
| **Reusability** | The logic is trapped inside a specific method.                  | Discount objects can be passed and used anywhere.                 |
