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

---

## Temporary Fields 

Temporary fields get their values (and thus are needed by objects) only under certain circumstances. Outside of these circumstances, they’re empty.

### Problem

Oftentimes, temporary fields are created for use in an algorithm that requires a large amount of inputs. So instead of creating a large number of parameters in the method, the programmer decides to create fields for this data in the class. These fields are used only in the algorithm and go unused the rest of the time.

### Example 

```java
public class DataProcessor {
    private String data;
    private double tempResult; // Only used during calculation
    private List<String> intermediaryBuffer; // Only used during calculation

    public void process() {
        intermediaryBuffer = new ArrayList<>();
        // ... complex logic filling buffer ...
        tempResult = calculateFromBuffer(intermediaryBuffer);
        System.out.println("Result: " + tempResult);
        
        // After this, those fields just sit there taking up "mental space"
    }
}
```

### Solution

We can create new class that focus on the method. So, we extract it from our class.

### Example Solution 

```java
public class DataProcessor {
    public void process(String data) {
        // Delegate to a specific object that handles the "temp" state
        new CalculationTask(data).run();
    }
}

class CalculationTask {
    private final String data;
    private double result; // Now a meaningful part of this specific task
    private List<String> buffer;

    public CalculationTask(String data) { this.data = data; }

    public void run() {
        buffer = new ArrayList<>();
        // ... logic ...
    }
}
```

### Comparasion (Before & After)

| Feature         | Temporary Fields (Before)                                           | Refactored (After)                                                |
| --------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Readibility** | Fields clutter the class and hide the object's true purpose.        | The class only contains essential, permanent data.                |
| **Testing**     | You must track side effects on fields between tests.                | You can test the calculation object in total isolation.           |
| **Maintenance** | You never know if a field is safe to modify or currently "in use."  | The temporary state is isolated and disappears after use.         |
| **Reusability** | The main class is tied to a specific "one-off" logic flow.          | The main class stays generic; the task object can be reused.      |

---

## Refused Bad Request

If a subclass uses only some of the methods and properties inherited from its parents, the hierarchy is off-kilter. The unneeded methods may simply go unused or be redefined and give off exceptions.

### Problem 

Someone was motivated to create inheritance between classes only by the desire to reuse the code in a superclass. But the superclass and subclass are completely different.

![Bad Request](https://refactoring.guru/images/refactoring/content/smells/refused-bequest-02-1.5x.png)

### Example 

```java
public void processUpdate(Map<String, Object> rawData) {
    // 1. Manual parsing and type checking
    if (!rawData.containsKey("userId")) {
        throw new IllegalArgumentException("Missing userId");
    }
    String userId = (String) rawData.get("userId");
    
    // 2. Business logic mixed with extraction
    System.out.println("Updating user: " + userId);
}
```

### Solution 

- If inheritance makes no sense and the subclass really does have nothing in common with the superclass, eliminate inheritance in favor of `Replace Inheritance with Delegation`.

- If inheritance is appropriate, get rid of unneeded fields and methods in the subclass. Extract all fields and methods needed by the subclass from the parent class, put them in a new superclass, and set both classes to inherit from it `Extract Superclass`.

### Example Solution

```java
public class UpdateUserRequest {
    private final String userId;
    private final String email;

    public UpdateUserRequest(String userId, String email) {
        this.userId = Objects.requireNonNull(userId, "Id required");
        this.email = email;
    }
    // Getters...
}

// Usage: The method signature is now clear
public void processUpdate(UpdateUserRequest request) {
    System.out.println("Updating user: " + request.getUserId());
}
```

### Comparasion (Before & After)

| Feature         | Bad Request (Before)                                                 | Refactored (After)                                                     |
| --------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Readibility** | You can't tell what data the method needs without reading the body.  | The method signature clearly defines the required data.                |
| **Testing**     | You must build complex maps or mock raw inputs for every test.       | You just instantiate a single Request object with the test data.       |
| **Maintenance** | Changing a field name requires searching through strings in the code.| Use your IDE to rename a field once; it updates everywhere.            |
| **Reusability** | The parsing logic is trapped inside the method.                      | The Request object can be reused by controllers, services, and clients.|

---