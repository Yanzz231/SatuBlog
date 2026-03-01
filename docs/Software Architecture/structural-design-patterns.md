---
sidebar_position: 4
title: Structural Design Patterns
---

# Structural Design Patterns

**Patterns that deal with how classes and objects are composed to form larger structures.**

---

## Adapter

**Makes incompatible interfaces work together — without changing either side.**

### The 4 Roles

| Role                 | Description                                         | Example                 |
| -------------------- | --------------------------------------------------- | ----------------------- |
| **Client**           | The project that demands a specific type            | `PaymentService`        |
| **Target Interface** | The interface the client expects                    | `Payment`               |
| **Adaptee**          | The existing class that doesn't match the interface | `Gopay`                 |
| **Adapter**          | The bridge that connects Adaptee to the Client      | `GopayToPaymentAdapter` |

### The Problem

`PaymentService` only accepts objects that implement `Payment` (with a `pay()` method). PayPal and Stripe work fine because they implement that interface — but Gopay uses a completely different method: `payWithBalance()`.

```typescript
// model/payment.ts — Target Interface
export interface Payment {
  pay(amount: number): void;
}

// model/paypal.ts — ✅ Compatible, implements Payment
export class PayPal implements Payment {
  public pay(amount: number): void {
    console.log(`Paid ${amount} using PayPal.`);
  }
}

// model/gopay.ts — ❌ Incompatible, uses a different method name
export class Gopay {
  public payWithBalance(amount: number) {
    console.log(`Balance withdraw ${amount} from gopay`);
  }
}
```

```typescript
// service/paymentService.ts — Client
export class PaymentService {
  public processPayment(payment: Payment, amount: number) {
    payment.pay(amount); // expects .pay(), not .payWithBalance()
  }
}
```

### The Solution

Create an Adapter class that:

1. Stores the Adaptee as a private attribute
2. Implements the Target Interface
3. Translates the call internally

```typescript
// adapter/GopayToPayment.new.ts — Adapter
export class GopayToPaymentAdapter implements Payment {
  private _gopayPaymentService: Gopay;

  constructor(gopayPaymentService: Gopay) {
    this._gopayPaymentService = gopayPaymentService;
  }

  // Translates pay() → payWithBalance()
  pay(amount: number): void {
    this._gopayPaymentService.payWithBalance(amount);
  }
}
```

Usage:

```typescript
// demo.ts
const paymentService = new PaymentService();

paymentService.processPayment(new PayPal(), 1000000); // ✅ native
paymentService.processPayment(new Stripe(), 1000000); // ✅ native
paymentService.processPayment(
  new GopayToPaymentAdapter(new Gopay()),
  1000000, // ✅ via adapter
);
```

> **Key rule:** Neither the Client (`PaymentService`) nor the Adaptee (`Gopay`) needs to be changed. The Adapter handles everything in between.

### When to Use

- You want to use an existing class or library but its interface doesn't match your project
- You can't modify the original class (e.g., third-party library)
- You need to make multiple incompatible classes work with the same interface

---

## Facade

**Provides a simplified interface to a complex subsystem.**

### The Problem

A home theater system has multiple components — each with its own methods. The client has to manually set up and tear down every single one in the right order.

```typescript
// ❌ Before: client manages everything directly
const dvd = new DvdPlayer();
const projector = new Projector();
const sound = new SoundSystem();
const lights = new Lights();

// Just to start a movie...
lights.dim(30);
projector.on();
projector.wideScreenMode();
sound.on();
sound.setVolume(70);
dvd.on();
dvd.play("Inception");

// And to stop...
dvd.stop();
dvd.off();
sound.off();
projector.off();
lights.on();
```

### The Solution

Create a Facade class that:

1. Owns all the subsystem objects as attributes
2. Exposes simple, high-level methods that handle the sequence internally

```typescript
// facade/MovieFacade.new.ts — Facade
export class MovieFacade {
  private _dvd: DvdPlayer;
  private _projector: Projector;
  private _sound: SoundSystem;
  private _lights: Lights;

  constructor() {
    this._dvd = new DvdPlayer();
    this._projector = new Projector();
    this._sound = new SoundSystem();
    this._lights = new Lights();
  }

  public movieStart() {
    this._lights.dim(30);
    this._projector.on();
    this._projector.wideScreenMode();
    this._sound.on();
    this._sound.setVolume(70);
    this._dvd.on();
    this._dvd.play("Inception");
  }

  public movieStop() {
    this._dvd.stop();
    this._dvd.off();
    this._sound.off();
    this._projector.off();
    this._lights.on();
  }
}
```

Usage:

```typescript
// demo.ts
const movieFacade = new MovieFacade();

movieFacade.movieStart(); // handles all setup internally
console.log("🎥 Watching movie...");

movieFacade.movieStop(); // handles all teardown internally
```

> **Key rule:** The client should never need to know what's happening under the hood. The Facade takes care of the sequence.

### When to Use

- A subsystem has many classes and the client has to interact with all of them
- You want to provide a clean, simple entry point to a complex system
- You want to reduce dependencies between the client and subsystem internals

---

## Summary

| Pattern     | Problem Solved                           | Key Mechanism                                           |
| ----------- | ---------------------------------------- | ------------------------------------------------------- |
| **Adapter** | Incompatible interfaces between classes  | Wrapper class that translates one interface to another  |
| **Facade**  | Complex subsystem with many moving parts | Single class that exposes simplified high-level methods |

```
Structural Patterns
│
├── Adapter ── Bridge between incompatible interfaces
│              Client → Adapter → Adaptee
│
└── Facade ─── Simplified interface over a complex subsystem
               Client → Facade → (Subsystem A, B, C, D...)
```
