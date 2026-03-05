---
sidebar_position: 3
title: Change Preventers
---

# Change Preventers

**All type of Change Preventers, explanations, examples, and how to refactor it**

These smells mean that if you need to change something in one place in your code, you have to make many changes in other places too. Program development becomes much more complicated and expensive as a result.

> Source: [Refactoring Guru](https://refactoring.guru/refactoring/smells/change-preventers)

---

## Divergent Change

Divergent Change resembles Shotgun Surgery but is actually the opposite smell. Divergent Change is when many changes are made to a single class. Shotgun Surgery refers to when a single change is made to multiple classes simultaneously.

### Problem

Because you have to change same class for many different reasons, it will violate SRP (Single Responsibility Principle)

### Example

```java
public class Product {
    private String name;
    private double price;

    // Reason 1: Change how we save to DB
    public void saveToDatabase() { 
        System.out.println("JDBC logic here..."); 
    }

    // Reason 2: Change how we show it on the UI
    public String formatForDisplay() { 
        return "Item: " + name + " Cost: $" + price; 
    }

    // Reason 3: Change the PDF export format
    public void exportToPdf() { 
        System.out.println("PDF generation logic here..."); 
    }
}
```

### Solution

Because the need of changing the same class for many different reasons, therefore rather than we change the same class over and over again, we can split the responsibilities.

### Example Solution

```java
public class Product {
    private String name;
    private double price;
    // Only core product data and logic here
}

class ProductRepository {
    public void save(Product p) { /* DB logic only */ }
}

class ProductPresenter {
    public String format(Product p) { /* UI logic only */ }
}

class ProductExporter {
    public void toPdf(Product p) { /* PDF logic only */ }
}
```

### Comparasion (Before & After)

| Feature         | Divergent Change (Before)                                            | Refactored (After)                                                     |
| --------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Readibility** | The class is a "junk drawer" of unrelated code.                      | Each class has a clear, singular purpose.                              |
| **Testing**     | Testing the price logic requires loading DB and PDF libraries.       | You can test the `Product` logic without touching the Database.        |
| **Maintenance** | Changing the PDF library might accidentally break the DB save logic. | Changes to the Database only affect the `Repository` class.            |
| **Reusability** | You can't use the Product data without dragging along the PDF logic. | You can reuse the` Product` class in any part of the system easily.    |

## Parallel Inheritance Hierarchies

Whenever you create a subclass for a class, you find yourself needing to create a subclass for another class.

