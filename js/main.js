"use strict";
const btnCustomers = document.querySelector("#customers");
const btnAddACustomer = document.querySelector("#addACustomer");
const btnClearCustomers = document.querySelector("#clearCustomer");

// IndexedDB functionality
// Checks if the indexedDB is supported in the current browser
if ("indexedDB" in window) {
  // Creates a new database
  const customerData = window.indexedDB.open("myDatabase", 1);

  customerData.onupgradeneeded = function(e) {
    console.log("upgradeneede is running...");
    let db = e.target.result;
    // Creates object store named customers
    let myObjectStore = db.createObjectStore("customers", {keyPath: "name"});
  }

  // On success event
  customerData.onsuccess = function(e) {
    let db = e.target.result;
    // Starts the new transaction
    let myTransaction = db.transaction(["customers"], "readwrite");
    // Reference to the object store we want to use
    let store = myTransaction.objectStore("customers");
    // Customers object
    const myCustomers = [
      { email: 'bob@bob.com', name: 'Bob' }, 
      { email: 'dan@dan.com', name: 'Dan' },
      { email: 'rich@rich.com', name: 'Rich' },
      { email: 'pete@pete.com', name: 'Pete' }
    ];
    // Uses put method to add each customer to the object store
    myCustomers.forEach((customer) => store.put(customer));

    db.onerror = function(e) {
      let errorcode = e.target.errorCode;
      console.log(`Error: ${errorcode}`);
    };

    // Query the data
    let getDan = store.getAll();

    getDan.onsuccess = function() {
      console.log(getDan.result);
    };

    // Closes the db when the transaction is done
    myTransaction.oncomplete = function() {
      db.close();
    };
  }

  // On error and prints the error to the console
  customerData.onerror = function(e) {
    let errorcode = e.target.errorCode;
    console.log(`There is an error: ${errorcode}`);
  }
} else {
  // Logs an error if indexedDB is not supported
  console.log("IndexedDB is not supported in this browser");
}

