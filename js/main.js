"use strict";

// IndexedDB functionality
let db;
// Checks if the indexedDB is supported in the current browser
if ("indexedDB" in window) {
  // Creates a new database 
  const requestCustomer = window.indexedDB.open("myCustomers", 1);

  // Handles upgrade event
  requestCustomer.onupgradeneeded = function(e) {
    // Creates an object store with auto key generator
    let thisDB = requestCustomer.result;
    let customerObjectStore = thisDB.createObjectStore("customers1", { keyPath: "email" });
  }

  requestCustomer.onsuccess = function(e) {
    db = requestCustomer.result;
    console.log("success");



    // Handles error event
    db.onerror = function(e) {
      let errorcode = e.target.errorCode;
      console.log(`Error after success: ${errorcode}`);
    }
  }
  
  // Handles error event
  requestCustomer.onerror = function(e) {
    let errorcode = e.target.errorCode;
    console.log(`Error: ${errorcode}`);
  }
} else {
  // Logs an error message if indexedDB is not supported
  console.log("IndexedDB is not supported in this browser");
}

// Function to add a customer
  function addCustomer(e) {
    // Empty object to store new customer name and email values
    let newCustomer = {};
    const customerName = document.querySelector("#fullName").value;
    const customerEmail = document.querySelector("#email").value;

    // Adds new customer's name and email to the object
    newCustomer.name = customerName;
    newCustomer.email = customerEmail;
console.log(db);
    // Starts a new transaction
    let customerTransaction = db.transaction(["customers1"], "readwrite");
    // Reference to the object store we want to use
    let customerStore = customerTransaction.objectStore("customers1");
    let request = customerStore.add(newCustomer);

    request.onsuccess = function(e) {
      winodw.location.href = "index.html";
      console.log(yes);
    }

    request.onerror = function(e) {
      let errorcode = e.target.errorCode;
      console.log(`Error: ${errorcode}`);
    }
  }

  // Function to delete a customer
  function deleteCustomer() {
    const customerDeleteEmail = document.querySelector("#emailDelete").value;
    console.log(customerDeleteEmail);
  }