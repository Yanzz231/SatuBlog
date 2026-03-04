---
sidebar_position: 1
title: The Bloaters
---

# The Bloaters

**All type of The Bloaters, explanations, examples, and how to refactor it**

Bloaters are code, methods and classes that have increased to such gargantuan proportions that they’re hard to work with. Usually these smells don’t crop up right away, rather they accumulate over time as the program evolves (and especially when nobody makes an effort to eradicate them).

> Source: [Refactoring Guru](https://refactoring.guru/refactoring/smells/bloaters)

---

## Large Class

A class contains many fields/methods/lines of code. It usually happens when one class has more than one responsibility

### Problem

Large class can make you are really frustrated when you must deal with one single error but you cannot find where it is, it feels like you are looking for nails in a haystack.

### Example

```java
public class UserAccount {
    // Fields (Data)
    private String username;
    private String email;
    private String password;

    // 1. Logic: Data Validation
    public boolean isValidEmail() {
        return email.contains("@") && email.endsWith(".com");
    }

    // 2. Logic: Database Operations (Persistence)
    public void saveToDatabase() {
        System.out.println("Connecting to DB...");
        System.out.println("Saving " + username + " to the USER table.");
    }

    // 3. Logic: Notification Services
    public void sendWelcomeEmail() {
        System.out.println("Sending email to " + email);
        System.out.println("Subject: Welcome to our platform!");
    }

    // 4. Logic: Security/Encryption
    public String encryptPassword() {
        return "encrypted_" + password;
    }

    // Getters and Setters...
}
```

### Solution

Rather than you use only one single class to do anything. It's better to you refactor it, and divided it into multiple classes.

### Example solution

**User**

```java
public class User {
    private String username;
    private String email;
    private String password;

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Getters and Setters only
    public String getEmail() { return email; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
}
```

**UserRepository**

```java
public class UserRepository {
    public void save(User user) {
        System.out.println("Saving " + user.getUsername() + " to the database.");
    }
}
```
**EmailService**

```java
public class EmailService {
    public void sendWelcomeEmail(User user) {
        System.out.println("Sending welcome email to: " + user.getEmail());
    }
}
```

**RegistrationManager**

```java
public class RegistrationManager {
    private UserRepository repo = new UserRepository();
    private EmailService emailService = new EmailService();

    public void registerNewUser(String name, String email, String pass) {
        // 1. Create the object
        User newUser = new User(name, email, pass);

        // 2. Perform actions using specialized services
        repo.save(newUser);
        emailService.sendWelcomeEmail(newUser);
        
        System.out.println("Registration complete!");
    }
}
```

### Comparasion (Before & After)

| Feature         | Large Class (Before)                         | Refactored (After)                          |
| --------------- | -------------------------------------------- | ------------------------------------------- |
| **Readibility** | Hard to find specific logic.                 | Very clear; logic is named by class.        |
| **Testing**     | Must test DB and Email together.             | Can test Email logic without a DB.          |
| **Maintenance** | Changing one thing might break another.      | Changes are isolated to one small class.    |
| **Reusability** | `User` logic is trapped.                     | `EmailService` can be used by other classes.|

---

## Long Method

A method contains too many lines of code. Generally, any method longer than ten lines should make you start asking questions. Usually because one method has more than one responsibility

### Problem

Long method can make you are really frustrated when you have to deal with one single error, but you don't even know where it is

### Example

```java
public void registerUser(String username, String password, String email) {
    // 1. Validation Logic
    if (username == null || username.length() < 3) {
        throw new IllegalArgumentException("Username too short");
    }
    if (!email.contains("@")) {
        throw new IllegalArgumentException("Invalid email");
    }

    // 2. Encryption Logic
    String hashedEntity = "SHA256:" + password.hashCode(); // Overly simplified for example
    System.out.println("Password hashed successfully.");

    // 3. Database Logic
    try {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "user", "pass");
        String sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setString(1, username);
        stmt.setString(2, hashedEntity);
        stmt.setString(3, email);
        stmt.executeUpdate();
        System.out.println("User saved to database.");
    } catch (SQLException e) {
        e.printStackTrace();
    }

    // 4. Notification Logic
    System.out.println("Sending welcome email to " + email);
    // Imagine 10 more lines of SMTP configuration here...
}
```

### Solution 

Rather than you use only one single method to do anything. It's better to you refactor it, and divided it into multiple methods.

### Example Solution 

**registerUser**

```java
public void registerUser(String username, String password, String email) {
    validateInput(username, email);
    
    String securePassword = hashPassword(password);
    saveUserToDatabase(username, securePassword, email);
    sendWelcomeEmail(email);
}
```

**validateInput**

```java
private void validateInput(String username, String email) {
    if (username == null || username.length() < 3) throw new IllegalArgumentException("Invalid username");
    if (email == null || !email.contains("@")) throw new IllegalArgumentException("Invalid email");
}
```

**hashPassword**

```java
private String hashPassword(String password) {
    // In a real app, use BCrypt or Argon2
    return "SECURE_HASH_" + password.hashCode();
}
```

**saveUserToDatabase**

```java
private void saveUserToDatabase(String username, String password, String email) {
    // Database logic moved here, or ideally into a UserDAO class
    System.out.println("Persisting user: " + username);
}
```

**sendWelcomeEmail**

```java
private void sendWelcomeEmail(String email) {
    // Email logic moved here
    System.out.println("Email sent to: " + email);
}
```

### Comparasion (Before & After)

| Feature         | Long Method (Before)                                            | Refactored (After)                                                |
| --------------- | --------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Readibility** | You have to read line-by-line to understand "Why".              | The method names tell you "What" is happening immediately.        |
| **Testing**     | You must test the whole "beast" just to verify one small part.  | Small methods can be reused across the entire class.              |
| **Maintenance** | Changing one thing might break another.                         | Logic is isolated so changes only affect one small area.          |
| **Reusability** | You must test the whole "beast" just to verify one small part.  | You can write precise unit tests for each individual task.        |

---

## Primitive Obsession

By the name, we know that primitive obsession is happened when we use primitive data type rather than object. Because we think it can be interpreted just by primitive data type

### Problem 

When we do have primitive data type, we only can assign value to it. But, we cannot makesure or validate. for example, novice programmer usually make list of days by using String, but how if someone assign the value to list of days incorrectly, like day1 = "Saturnus" ?, we cannot directly validate it. 

### Example

```java
public void createContact(String name, String phoneNumber) {
    // Validation logic is trapped inside this method
    if (phoneNumber.length() != 10 || !phoneNumber.startsWith("0")) {
        throw new IllegalArgumentException("Invalid phone number");
    }
    System.out.println("Saving contact: " + name);
}
```

### Solution 

Because the problem of primitive obsession is because we are really obsessed with primitive data type. the solution is we just need to replace what's need to be an object.

### Example Solution

```java
public class PhoneNumber {
    private final String value;

    public PhoneNumber(String value) {
        if (value == null || value.length() != 10) {
            throw new IllegalArgumentException("Must be 10 digits");
        }
        this.value = value;
    }

    public String getAreaCode() {
        return value.substring(0, 3);
    }
}

// Usage
public void createContact(String name, PhoneNumber phone) {
    System.out.println("Saving contact with area code: " + phone.getAreaCode());
}
```

### Comparasion (Before & After)


| Feature         | Primitive Obsession (Before)                                    | Refactored (After)                                                |
| --------------- | --------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Readibility** | A `String` doesn't explain what it represents.                  | The class name `PhoneNumber` is explicit.                         |
| **Testing**     | You must test the logic inside every method.                    | You test the `PhoneNumber` class once.                            |
| **Maintenance** | Validation logic is duplicated across the app.                  | Validation rules exist in exactly one place.                      |
| **Reusability** | You must copy-paste logic to handle the data.                   | The object can be reused in any method.                           |

---

## Long Parameter List

A long list of parameters might happen after several types of algorithms are merged in a single method. A long list may have been created to control which algorithm will be run and how.

### Problem 

When we have a method with long parameter, it's high potentially we wrong when we use the method and input the parameter. Even some of text editor provides sequence of parameter, but it still not good approach.

### Example 

```java
public void createUser(String firstName, String lastName, String email, 
                       String street, String city, String zipCode, String phone) {
    // Logic to save user and address...
    System.out.println("User " + firstName + " created in " + city);
}

// Calling it is a nightmare:
service.createUser("John", "Doe", "john@email.com", "123 Main St", "NY", "10001", "555-0199");
```

### Solution

Rather than we use primitive data type, that can make our method has long parameter, it is better that we refactor it as an object.

### Example Solution

```java
public class Address {
    String street, city, zipCode;
    // Constructor and getters...
}

public void createUser(String firstName, String lastName, String email, Address address, String phone) {
    System.out.println("User " + firstName + " created in " + address.getCity());
}

// Calling it is now structured:
Address userAddress = new Address("123 Main St", "NY", "10001");
service.createUser("John", "Doe", "john@email.com", userAddress, "555-0199");
```

### Comparasion (Before & After)

| Feature         | Primitive Obsession (Before)                                    | Refactored (After)                                                |
| --------------- | --------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Readibility** | A long row of values is hard to decipher.                       | Objects give meaning to groups of data.                           |
| **Testing**     | Setting up tests requires many dummy values.                    | You pass one well-defined object to the test.                     |
| **Maintenance** | Adding one new field breaks every method call.                  | Just add a field to the object without changing the signature.    |
| **Reusability** | You cannot easily pass the "address" as a unit.                 | The Address object can be passed to any method.                   |

---