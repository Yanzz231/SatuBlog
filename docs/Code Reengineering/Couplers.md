---
sidebar_position: 5
title: Couplers
---

# Couplers

**All type of Couplers, explanations, examples, and how to refactor it**

All the smells in this group contribute to excessive coupling between classes or show what happens if coupling is replaced by excessive delegation.

> Source: [Refactoring Guru](https://refactoring.guru/refactoring/smells/couplers)

---

## Feature Envy

A method accesses the data of another object more than its own data.

### Problem 

Because A method access the data of another object more than its own data, it violates Encapsulation.

### Example

```java
public class Basket {
    public double getTotalItemPrice(Item item) {
        // Envy: Reaching into Item multiple times to do Item's job
        double base = item.getPrice() * item.getQuantity();
        double tax = base * item.getTaxRate();
        return base + tax;
    }
}
```

### Solution

As a basic rule, if things change at the same time, you should keep them in the same place. Usually data and functions that use this data are changed together (although exceptions are possible).

- If a method clearly should be moved to another place, use Move Method.

- If only part of a method accesses the data of another object, use Extract Method to move the part in question.

- If a method uses functions from several other classes, first determine which class contains most of the data used. Then place the method in this class along with the other data. Alternatively, use Extract Method to split the method into several parts that can be placed in different places in different classes.

### Example Solution

```java
public class Item {
    private double price;
    private int quantity;
    private double taxRate;

    public double getTotalPrice() {
        double base = price * quantity;
        return base + (base * taxRate);
    }
}

// Basket is now clean
public class Basket {
    public double getTotalItemPrice(Item item) {
        return item.getTotalPrice();
    }
}
```

### Comparasion (Before & After)

| Feature         | Feature Envy (Before)                                                                   | Refactored (After)                                                         |
| --------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Readibility** | Logic is scattered; you have to look at two classes to understand one calculation.      | The logic lives exactly where the data is, making it intuitive to find.    |
| **Testing**     | You have to set up a `Basket` just to test logic that belongs to an `Item`.             | You can unit test the `Item` logic in total isolation.                     |
| **Maintenance** | If the way an `Item` calculates tax changes, you have to find all "envious" callers.    | Change the logic once inside the `Item` class, and every caller benefits.  |
| **Reusability** | Other classes would have to copy-paste the calculation to get an item's total.          | Any part of the system can now ask an `Item` for its total price.          |

---

## Inappropriate Intimacy

One class uses the internal fields and methods of another class.

### Problem

Because they know too much about how the other is built, meaning a tiny change in one class almost always breaks the other.

### Example

```java
public class User {
    // These should be private, but they're public for License to use
    public String status;
    public List<String> permissions;
}

public class License {
    public boolean canAccess(User user) {
        // Intimacy: Reaching into User's internals directly
        if (user.status.equals("ACTIVE") && user.permissions.contains("ADMIN")) {
            return true;
        }
        return false;
    }
}
```

### Solution

- The simplest solution is to use Move Method and Move Field to move parts of one class to the class in which those parts are used. But this works only if the first class truly doesn’t need these parts.

- Another solution is to use Extract Class and Hide Delegate on the class to make the code relations “official”.

- If the classes are mutually interdependent, you should use Change Bidirectional Association to Unidirectional.

- If this “intimacy” is between a subclass and the superclass, consider Replace Delegation with Inheritance.

### Example Solution

```java
public class User {
    private String status;
    private List<String> permissions;

    // Boundary: The class manages its own state
    public boolean hasAdminAccess() {
        return "ACTIVE".equals(status) && permissions.contains("ADMIN");
    }
}

public class License {
    public boolean canAccess(User user) {
        // Respectful: Just asking the object for a boolean
        return user.hasAdminAccess();
    }
}
```

### Comparasion (Before & After)

| Feature         | Inappropriate Intimacy (Before)                                                         | Refactored (After)                                                                |
| --------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Readibility** | You have to understand the internal structure of two classes at once.                   | Each class has a clean interface; you only need to know what a method returns.    |
| **Testing**     | You must manually set up the internal state of `User` to test `License`.                | You can mock the `hasAdminAccess()` method easily.                                |
| **Maintenance** | If you rename the permissions list, the `License` class breaks immediately.             | You can change the internal logic of `User` without touching `License`.           |
| **Reusability** | The classes are "glued" together; you can't use one without the other.                  | User can be used anywhere without needing a `License` class to validate it.       |

---

## Message Chains

In code you see a series of calls resembling `a.getB().getC().getD().doSomething()`

### Problem

- Any changes in these relationships require modifying the client.

- Whenever we want to call the method, we have to remember it, or copy-paste (If the IDE doesn't suggest any option).

### Example

```java
public void printShippingZone(User user) {
    // Message Chain: Too much navigation!
    String zip = user.getProfile().getAddress().getZipCode();
    System.out.println("Shipping to: " + zip);
}
```

### Solution

- To delete a message chain, use Hide Delegate.

- Sometimes it’s better to think of why the end object is being used. Perhaps it would make sense to use Extract Method for this functionality and move it to the beginning of the chain, by using Move Method.

### Example Solution

```java
public class User {
    private Profile profile;

    // Encapsulation: Hiding the chain
    public String getZipCode() {
        return profile.getAddress().getZipCode();
    }
}

// Client is now simple and "blind" to the internals
public void printShippingZone(User user) {
    System.out.println("Shipping to: " + user.getZipCode());
}
```

### Comparasion (Before & After)

| Feature         | Message Chains (Before)                                                                 | Refactored (After)                                                                |
| --------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Readibility** | Long chains are visually noisy and hard to parse.                                       | A single method call clearly states the intent.                                   |
| **Testing**     | You must mock the` User`, the `Profile`, and the `Address` just for one test.           | You only need to mock or stub the `getZipCode()` method.                          |
| **Maintenance** | Moving the `ZipCode` from `Address` to `Profile` breaks every caller.                   | You only update the `User` class; the callers never notice the change.            |
| **Reusability** | The calling code is "glued" to a specific, deep object structure.                       | The caller only depends on the `User` interface, not its hierarchy.               |

---

## Middle Man

If a class performs only one action, delegating work to another class, why does it exist at all?. This also can be happenned because we overzealous to eliminate `Message Chains`. 

### Problem

It feels like the class that we made, really useless. Because The class remains as an empty shell that doesn’t do anything other than delegate.

### Example

```java
public class Department {
    private Manager manager;

    public Department(Manager manager) {
        this.manager = manager;
    }

    // Middle Man: This method does nothing but delegate
    public String getManagerName() {
        return manager.getName();
    }

    public String getManagerOffice() {
        return manager.getOfficeNumber();
    }
}

// Client usage
String name = department.getManagerName();
```

### Solution

If most of a method’s classes delegate to another class, Remove Middle Man is in order.

### Example Solution

```java
public class Department {
    private Manager manager;

    public Manager getManager() {
        return manager;
    }
}

// Client usage: Talk to the manager directly
String name = department.getManager().getName();
```

### Comparasion (Before & After)

| Feature         | Middle Man (Before)                                                                     | Refactored (After)                                                                |
| --------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Readibility** | You have to trace through "pass-through" methods to find the real logic.                | It is clear exactly which object is providing the data or behavior.               |
| **Testing**     | You have to mock the `Department` just to get to the `Manager` logic.                   | You can test the `Manager` class directly without the extra wrapper.              |
| **Maintenance** | If you add a field to `Manager`, you have to update the `Department` delegate too.      | Changes to `Manager` don't require updates to any "middleman" classes.            |
| **Reusability** | The delegation logic is boilerplate that adds no functional value.                      | The `Manager` object is a first-class citizen used directly where needed.         |

---

## Incomplete Library Class

Sooner or later, libraries stop meeting user needs. The only solution to the problem—changing the library—is often impossible since the library is read-only

### Problem

If we want to use the method that the library can't afford, we may look other way like make our own logic. But, since we make our own logic, so whenever we call the library, we have to re-write the logic or copy-paste.

### Example

```java
// Third-party library class (imagine we can't edit this)
import java.time.LocalDate;

public class BookingService {
    public void schedule(LocalDate startDate) {
        // Manual logic because the library is "incomplete"
        LocalDate nextDay = startDate.plusDays(1);
        if (nextDay.getDayOfWeek().getValue() > 5) { // It's a weekend!
            nextDay = nextDay.plusDays(2);
        }
        System.out.println("Scheduled for: " + nextDay);
    }
}
```

### Solution

- To introduce a few methods to a library class, use Introduce Foreign Method.

- For big changes in a class library, use Introduce Local Extension.

### Example Solution

```java
// We "complete" the functionality here
public class DateHelper {
    public static LocalDate nextBusinessDay(LocalDate date) {
        LocalDate nextDay = date.plusDays(1);
        if (nextDay.getDayOfWeek().getValue() > 5) {
            return nextDay.plusDays(2);
        }
        return nextDay;
    }
}

// Now the service is clean
public class BookingService {
    public void schedule(LocalDate startDate) {
        LocalDate nextDay = DateHelper.nextBusinessDay(startDate);
        System.out.println("Scheduled for: " + nextDay);
    }
}
```

### Comparasion (Before & After)

| Feature         | Middle Man (Before)                                                                     | Refactored (After)                                                                |
| --------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Readibility** | Business logic is buried under library-specific "math."                                 | The method name `nextBusinessDay` explains the intent clearly.                    |
| **Testing**     | You have to test the "missing" logic inside every class that uses it.                   | You test the extension/utility once in its own test file.                         |
| **Maintenance** | If the library updates or the logic changes, you have to find all hacks.                | Update the logic in one helper class; all services benefit instantly.             |
| **Reusability** | The logic is trapped inside specific service methods.                                   | Any part of the application can now use the "completed" feature.                  |
