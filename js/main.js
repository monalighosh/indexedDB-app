"use strict";
const btnCustomers = document.querySelector("#customers");
const btnAddACustomer = document.querySelector("#addACustomer");
const btnClearCustomers = document.querySelector("#clearCustomer");

// IndexedDB functionality
// Checks if the indexedDB is supported in the current browser
if ("indexedDB" in window) {
  // Creates a new database
  const customerData = window.indexedDB.open("customer", 1);

  customerData.onupgradeneeded = function(e) {
    console.log("upgradeneede is running...");
    let db = e.target.result;
    if(!db.objectStoreNames.contains("firstOS")) {
      db.createObjectStore("firstOS");
    }
  }

  // On success prints the success message to the console
  customerData.onsuccess = function(e) {
    let db = e.target.result;
    console.log("Success!");
  }

  // On error and prints the error to the console
  customerData.onerror = function(e) {
    let errorcode = e.target.errorCode;
    console.log(`Failed: ${errorcode}`);
  }
} else {
  // Logs an error if indexedDB is not supported
  console.log("IndexedDB is not supported in this browser");
}

