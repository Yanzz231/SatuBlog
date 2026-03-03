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

**A class contains many fields/methods/lines of code. It usually happens when one class has more than one responsibility**

### Problem

Large class can make you are really frustrated when you must deal with one single error but you cannot find where it is, it feels like you are looking for nails in a haystack.


### Example of Large Class

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

| Feature         | Large Class (Before)                         | Refactored (After)                        |
| --------------- | -------------------------------------------- | ----------------------------------------- |
| **Readibility** | Hard to find specific logic.                 | Very clear; logic is named by class.      |
| **Testing**     | Must test DB and Email together.             | Can test Email logic without a DB.        |
| **Maintenance** | Changing one thing might break another.      | Changes are isolated to one small class.  |
| **Reusability** | `User` logic is trapped.                     | EmailService can be used by other classes.|
