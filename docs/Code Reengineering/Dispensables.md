---
sidebar_position: 4
title: Dispensables
---

# Dispensables

**All type of Dispensables, explanations, examples, and how to refactor it**

A dispensable is something pointless and unneeded whose absence would make the code cleaner, more efficient and easier to understand.

> Source: [Refactoring Guru](https://refactoring.guru/refactoring/smells/dispensables)

---

## Comments

A method is filled with explanatory comments.

### Problem

Because we attach explanatory comments for a method. therefore anyone except you, have to read explanatory comments that you make before use it. It may make them feel exhausted.

### Example 

```java
// Check if eligible for gold status
if (user.getPoints() > 1000 && user.getAge() > 18 && user.isActive()) {
    // apply 20% discount
    price = price * 0.8;
}
```

### Solution
The best comment is a good name for a method or class.

### Example Solution

```java
if (user.isEligibleForGoldStatus()) {
    price = applyGoldDiscount(price);
}

// The logic is moved to descriptive methods
private boolean isEligibleForGoldStatus() {
    return user.getPoints() > 1000 && user.getAge() > 18 && user.isActive();
}
```

### Comparasion (Before & After)

| Feature         | Comments (Before)                                                          | Refactored (After)                                                               |
| --------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Readibility** | You must read Comment and Code to understand the intent.                   | The code reads like a natural sentence.                                          |
| **Testing**     | You cannot "test" a comment; it might be lying or outdated.                | You can write a unit test for `isEligibleForGoldStatus()`.                       |
| **Maintenance** | Comments often become "lies" when code is updated but the comment isn't.   | When logic changes, the method name or body is updated, keeping it accurate.     |
| **Reusability** | The explanation is stuck in one spot; the logic isn't accessible elsewhere.| The named methods can be reused by other parts of the class.                     |

---

## Duplicate Code

Two code fragments look almost identical.

### Problem

Because they perform the same operator, it will be redudant.

### Example

```java
public void printProfile(User user) {
    // Logic to format name
    String fullName = user.getFirstName().toUpperCase() + " " + user.getLastName().toUpperCase();
    System.out.println("Profile: " + fullName);
}

public void sendEmail(User user) {
    // Exact same logic copied here
    String fullName = user.getFirstName().toUpperCase() + " " + user.getLastName().toUpperCase();
    System.out.println("Sending email to " + fullName);
}
```

### Solution

1. If the same code is found in two subclasses of the same level:

    - Use Extract Method for both classes, followed by Pull Up Field for the fields used in the method that you’re pulling up. 

    - If the duplicate code is inside a constructor, use Pull Up Constructor Body.

    - If the duplicate code is similar but not completely identical, use Form Template Method.

    - If two methods do the same thing but use different algorithms, select the best algorithm and apply Substitute Algorithm.

2. If duplicate code is found in two different classes:

    - If the classes aren’t part of a hierarchy, use Extract Superclass in order to create a single superclass for these classes that maintains all the previous functionality.

    - If it’s difficult or impossible to create a superclass, use Extract Class in one class and use the new component in the other.

3. If a large number of conditional expressions are present and perform the same code (differing only in their conditions), merge these operators into a single condition using Consolidate Conditional Expression and use Extract Method to place the condition in a separate method with an easy-to-understand name.

4. If the same code is performed in all branches of a conditional expression: place the identical code outside of the condition tree by using Consolidate Duplicate Conditional Fragments.

### Example Solution

```java
public void printProfile(User user) {
    System.out.println("Profile: " + getFormattedName(user));
}

public void sendEmail(User user) {
    System.out.println("Sending email to " + getFormattedName(user));
}

private String getFormattedName(User user) {
    return user.getFirstName().toUpperCase() + " " + user.getLastName().toUpperCase();
}
```

### Comparasion (Before & After)

| Feature         | Duplicate Code (Before)                                                    | Refactored (After)                                                               |
| --------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Readibility** | You have to read the same logic multiple times, cluttering the class.      | The method name `getFormattedName` tells you exactly what is happening.          |
| **Testing**     | You must write separate tests for every copy to ensure they all work.      | You write one test for the shared method and trust it everywhere.                |
| **Maintenance** | If you want to change to "LastName, FirstName," you must find every copy.  | Change the logic in one method, and the entire app updates instantly.            |
| **Reusability** | The logic is "trapped" inside specific methods as raw code.                | Any new feature can simply call the existing helper method.                      |

---

## Lazy Class

Understanding and maintaining classes always costs time and money. So if a class doesn’t do enough to earn your attention, it should be deleted. This also can be happenned because we are too care about SRP (Single Responsibility Principle).

### Problem

Because the class is actually really small, and little activities that it can don. It will seem useless. 

### Example

```java
// This class is "Lazy" - it barely does anything
public class PriceCalculator {
    public double multiply(double price, int quantity) {
        return price * quantity;
    }
}

// Usage in the main class
public class Order {
    private PriceCalculator calc = new PriceCalculator();
    
    public double getTotal(double price, int qty) {
        return calc.multiply(price, qty);
    }
}
```

### Solution

- Components that are near-useless should be given the Inline Class treatment.

- For subclasses with few functions, try Collapse Hierarchy.

### Example Solution

```java
public class Order {
    public double getTotal(double price, int qty) {
        // The logic is so simple it belongs here
        return price * qty;
    }
}
```

### Comparasion (Before & After)

| Feature         | Lazy Class (Before)                                                        | Refactored (After)                                                               |
| --------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Readibility** | You have to jump to a different file just to see a simple math operation.  | The logic is right where you expect it to be.                                    |
| **Testing**     | You have to set up and mock an extra object for no real gain.              | You test the main class logic directly.                                          |
| **Maintenance** | You have more files to track, more constructors, and more boilerplate.     | There are fewer files and fewer "moving parts" in the system.                    |
| **Reusability** | The class is so small that it’s easier to rewrite it than to import it.    | The logic is part of the core object, which is already being used.               |

---

## Data Class

A data class refers to a class that contains only fields and crude methods for accessing them (getters and setters). These are simply containers for data used by other classes. These classes don’t contain any additional functionality and can’t independently operate on the data that they own.

### Problem

Because it only has getter and setter method, and other operation need to depend from other classes. This class will seem very useless. 

### Example

```java
// Data Class: No behavior, just data
public class Rectangle {
    public double width;
    public double height;
}

// Another class forced to do the logic
public class AreaCalculator {
    public double calculateArea(Rectangle rect) {
        return rect.width * rect.height;
    }
}
```

### Solution

- If a class contains public fields, use Encapsulate Field to hide them from direct access and require that access be performed via getters and setters only.

- Use Encapsulate Collection for data stored in collections (such as arrays).

- Review the client code that uses the class. In it, you may find functionality that would be better located in the data class itself. If this is the case, use Move Method and Extract Method to migrate this functionality to the data class.

- After the class has been filled with well thought-out methods, you may want to get rid of old methods for data access that give overly broad access to the class data. For this, Remove Setting Method and Hide Method may be helpful.

### Example Solution

```java
public class Rectangle {
    private final double width;
    private final double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    // The logic lives with the data
    public double getArea() {
        return width * height;
    }
}
```

### Comparasion (Before & After)

| Feature         | Data Class (Before)                                                        | Refactored (After)                                                               |
| --------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Readibility** | You must find a different class to see how the data is used.               | The object’s capabilities are obvious from its own methods.                      |
| **Testing**     | You must test "Client" classes to verify simple data logic.                | You test the logic directly on the object itself.                                |
| **Maintenance** | If the data structure changes, every "Client" class breaks.                | Internal changes are hidden; the public method stays the same.                   |
| **Reusability** | Other parts of the app must rewrite the logic to use the data.             | Any part of the app can simply call `getArea()`.                                 |

---

## Dead Code

A variable, parameter, field, method or class is no longer used (usually because it’s obsolete).

### Problem

Because actually it is not used anymore, it is risky to keep it, because it will vurnable to error.

### Example

```java
public class OrderService {
    private String oldDiscountCode = "SUMMER20"; // UNUSED

    public double calculateTotal(double price) {
        return price * 1.10;
    }

    // DEAD CODE: This method is never called by any part of the app
    private double legacyTaxCalc(double price) {
        System.out.println("Using old tax logic...");
        return price * 1.05;
    }
}
```

### Solution

The quickest way to find dead code is to use a good IDE.

- Delete unused code and unneeded files.

- In the case of an unnecessary class, Inline Class or Collapse Hierarchy can be applied if a subclass or superclass is used.

- To remove unneeded parameters, use Remove Parameter.

### Example Solution

```java
public class OrderService {
    public double calculateTotal(double price) {
        return price * 1.10;
    }
}
```

### Comparasion (Before & After)


| Feature         | Dead Code (Before)                                                         | Refactored (After)                                                               |
| --------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Readibility** | Developers waste time trying to understand code that does nothing.         | Every line of code serves a clear, active purpose.                               |
| **Testing**     | You might accidentally waste time writing tests for "ghost" features.      | Test coverage is 100% focused on code that actually runs.                        |
| **Maintenance** | You must refactor and update dead code during migrations for no reason.    | There is less code to manage, migrate, and worry about.                          |
| **Reusability** | Dead code provides no value and shouldn't be reused anyway.                | Only high-quality, functional logic is available for reuse.                      |

---

## Speculative Generality

There’s an unused class, method, field or parameter.

### Problem

Sometimes code is created “just in case” to support anticipated future features that never get implemented. As a result, code becomes hard to understand and support.

### Example 

```java
// Over-engineered interface for a simple app
public interface BaseEntityProcessor<T> {
    void process(T entity);
}

public class UserProcessor implements BaseEntityProcessor<User> {
    @Override
    public void process(User user) {
        System.out.println("Saving user: " + user.getName());
    }
}
```

### Solution

- For removing unused abstract classes, try Collapse Hierarchy.

- Unnecessary delegation of functionality to another class can be eliminated via Inline Class.

- Unused methods? Use Inline Method to get rid of them.

- Methods with unused parameters should be given a look with the help of Remove Parameter.

- Unused fields can be simply deleted.

### Example Solution

```java
public class UserProcessor {
    public void save(User user) {
        System.out.println("Saving user: " + user.getName());
    }
}
```

### Comparasion (Before & After)

| Feature         | Speculative Generality (Before)                                              | Refactored (After)                                                               |
| --------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Readibility** | You have to navigate through layers of interfaces just to find the real code.| The code is direct and shows exactly what it is doing right now.                 |
| **Testing**     | You have to mock complex generic interfaces for simple tests.                | You test the concrete class directly without extra boilerplate.                  |
| **Maintenance** | You are forced to maintain code that serves no current purpose.              | There is less code to update, and the design is easier to change.                |
| **Reusability** | he "generic" logic is often too vague to be useful for real new features.    | Specific, clean code is easier to extract into a real abstraction later.         |
