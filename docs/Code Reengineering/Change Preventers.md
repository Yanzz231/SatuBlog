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

---

## Parallel Inheritance Hierarchies

Whenever you create a subclass for a class, you find yourself needing to create a subclass for another class.

### Problem

Because whenever we create a subclass for a class, we always need to create a subclass for another class. if this scenario in bigger hierarchy, it will make harder and harder. 

### Example

```java
// Hierarchy 1: Employees
abstract class Employee {}
class Engineer extends Employee {}
class Manager extends Employee {}

// Hierarchy 2: Payroll (Mirrors Hierarchy 1)
abstract class Payroll {}
class EngineerPayroll extends Payroll {}
class ManagerPayroll extends Payroll {}
```

### Solution 

You may de-duplicate parallel class hierarchies in two steps. First, make instances of one hierarchy refer to instances of another hierarchy. Then, remove the hierarchy in the referred class, by using **Move Method** and **Move Field**.

### Example Solution

```java
interface PayStrategy {
    double calculate();
}

class EngineerPay implements PayStrategy {
    public double calculate() { return 5000; }
}

class Employee {
    private PayStrategy payStrategy;
    
    public Employee(PayStrategy strategy) {
        this.payStrategy = strategy;
    }
    
    public double getPay() {
        return payStrategy.calculate();
    }
}

// Now you can add a "Salesman" PayStrategy without needing a "Salesman" Employee class.
```

### Comparasion (Before & After)

| Feature         | Parallel Inheritance Hierarchies (Before)                                               | Refactored (After)                                                         |
| --------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Readibility** | You have to jump between two different class trees to see how one "type" works.         | The relationship is clear; one class uses an interface for its behavior.   |
| **Testing**     | You must write duplicate tests for both the `Employee` and its matching `Payroll` class.| You test the `PayStrategy` logic independently from the `Employee` object. |
| **Maintenance** | If you add a new role, you must remember to create two classes in two different places. | You only add the specific behavior (the Strategy) where it's needed.       |
| **Reusability** | The `EngineerPayroll` logic is strictly tied to the Engineer class.                     | A `PayStrategy` can be shared across different types of employees or roles.|

---

## Shotgun Surgery

Shotgun Surgery resembles Divergent Change but is actually the opposite smell. Divergent Change is when many changes are made to a single class. Shotgun Surgery refers to when a single change is made to multiple classes simultaneously.

### Problem

Making any modifications requires that you make many small changes to many different classes.

### Example

```java
class Product {
    public double getPriceWithTax(double price) {
        return price * 1.15; // Hardcoded 15%
    }
}

class Service {
    public double getTotal(double hourlyRate, int hours) {
        return (hourlyRate * hours) * 1.15; // Hardcoded 15%
    }
}

class Invoice {
    public void printTax(double total) {
        System.out.println("Tax: " + (total * 0.15)); // Hardcoded 15%
    }
}
```

### Solution

Use **Move Method** and **Move Field** to move existing class behaviors into a single class. If there’s no class appropriate for this, create a new one.

If moving code to the same class leaves the original classes almost empty, try to get rid of these now-redundant classes via **Inline Class**.

### Example Solution

```java
public class TaxCalculator {
    private static final double TAX_RATE = 0.15;

    public static double applyTax(double amount) {
        return amount * (1 + TAX_RATE);
    }
    
    public static double getTaxOnly(double amount) {
        return amount * TAX_RATE;
    }
}

// Now all classes just call: TaxCalculator.applyTax(price);
```

### Comparasion (Before & After)

| Feature         | Shotgun Surgery (Before)                                                                | Refactored (After)                                                         |
| --------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Readibility** | It is hard to see where the "source of truth" for a rule is.                            | The logic has a clear, named home (e.g., `TaxCalculator`).                 |
| **Testing**     | You must test every class to ensure they all handle the rule correctly.                 | You test the logic once in its own dedicated test class.                   |
| **Maintenance** | Changing one rule requires hunting through dozens of files.                             | Change the value in one place, and it propagates everywhere.               |
| **Reusability** | The logic is trapped and repeated inside unrelated classes.                             | Any new class can simply call the centralized method.                      |
