import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class ATM {
  private balance: number;
  private authenticated: boolean;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
    this.authenticated = false;
  }

  async authenticate(): Promise<void> {
    const userId = await this.questionAsync("Enter your user ID: ");
    const userPin = await this.questionAsync("Enter your PIN: ", true);

    // Example: Check against hardcoded user id and pin
    if (userId === "123456" && userPin === "7890") {
      this.authenticated = true;
      console.log("Authentication successful. Welcome!");
    } else {
      console.log("Authentication failed. Please try again.");
    }
  }

  async checkBalance(): Promise<void> {
    if (this.isAuthenticated()) {
      console.log(`Your balance is: $${this.balance}`);
    } else {
      console.log("Please authenticate to access account.");
    }
  }

  async deposit(amount: number): Promise<void> {
    if (this.isAuthenticated()) {
      if (amount > 0) {
        this.balance += amount;
        console.log(`Deposited $${amount}. Your new balance is: $${this.balance}`);
      } else {
        console.log("Invalid deposit amount.");
      }
    } else {
      console.log("Please authenticate to access account.");
    }
  }

  async withdraw(amount: number): Promise<void> {
    if (this.isAuthenticated()) {
      if (amount > 0 && amount <= this.balance) {
        this.balance -= amount;
        console.log(`Withdrawn $${amount}. Your new balance is: $${this.balance}`);
      } else {
        console.log("Insufficient funds or invalid withdrawal amount.");
      }
    } else {
      console.log("Please authenticate to access account.");
    }
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  // Make questionAsync public
  async questionAsync(prompt: string, hideInput = false): Promise<string> {
    return new Promise<string>((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer);
      });
      if (hideInput) {
        // Hide input by setting terminal to raw mode
        readline.emitKeypressEvents(process.stdin);
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(true);
        }
      }
    });
  }
}

// Example usage:
(async () => {
  const atm = new ATM(1000); // Starting balance: $1000
  await atm.authenticate(); // Authenticate user

  if (atm.isAuthenticated()) {
    const action = await atm.questionAsync("Enter 'deposit' or 'withdraw' to proceed: ");

    if (action === 'deposit') {
      const amount = parseFloat(await atm.questionAsync("Enter deposit amount: "));
      await atm.deposit(amount);
    } else if (action === 'withdraw') {
      const amount = parseFloat(await atm.questionAsync("Enter withdrawal amount: "));
      await atm.withdraw(amount);
    } else {
      console.log("Invalid action.");
    }

    await atm.checkBalance(); // Check remaining balance
  }

  rl.close(); // Close the readline interface
})();
