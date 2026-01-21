const EventEmitter = require("events");

const emitter = new EventEmitter();

// object to store event counts
const eventCount = {
  login: 0,
  logout: 0,
  purchase: 0,
  profileUpdate: 0
};

// event listeners
emitter.on("user-login", (username) => {
  eventCount.login++;
  console.log(`${username} logged in`);
});

emitter.on("user-logout", (username) => {
  eventCount.logout++;
  console.log(`${username} logged out`);
});

emitter.on("user-purchase", (username, item) => {
  eventCount.purchase++;
  console.log(`${username} purchased ${item}`);
});

emitter.on("profile-update", (username) => {
  eventCount.profileUpdate++;
  console.log(`${username} updated profile`);
});

// summary event
emitter.on("summary", () => {
  console.log("\n--- Event Summary ---");
  console.log("Logins:", eventCount.login);
  console.log("Logouts:", eventCount.logout);
  console.log("Purchases:", eventCount.purchase);
  console.log("Profile Updates:", eventCount.profileUpdate);
});

// emitting events multiple times
emitter.emit("user-login", "Darsh");
emitter.emit("user-login", "Amit");

emitter.emit("user-purchase", "Darsh", "Laptop");
emitter.emit("user-purchase", "Amit", "Phone");

emitter.emit("profile-update", "Darsh");

emitter.emit("user-logout", "Amit");

// trigger summary
emitter.emit("summary");
