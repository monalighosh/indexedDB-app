"use strict";
let database;
// Check indexedDB is supported
if("indexedDB" in window) {
  // Create indexedDB database
  let requestCustomer = window.indexedDB.open("customerDataNew", 1);
  // Handle upgrade event
  requestCustomer.onupgradeneeded = function(e) {
    let database = requestCustomer.result;
    // Create object store
    let customerObjStore = database.createObjectStore("customersD1", { autoIncrement: true, keyPath: "id" });
    console.log(`upgrading.... ${customerObjStore}`);
  }

  // Handle success event
  requestCustomer.onsuccess = function(e) {
    database = requestCustomer.result;

    database.onerror = function(e) {
      let errorCode = e.target.errorCode;
      console.log(`Error within success handler: ${errorCode}`);
    };
    console.log("success....");
  } 

  // Handle error event
  requestCustomer.onerror = function(e) {
    let errorCode = e.target.errorCode;
    console.log(`Error: ${errorCode}`);
  }

} else {
  // Throw an alert message if indexedDB is not supported
  alert ("Sorry, IndexedDB is not supported in your browser!");
}

// Function to add customers
function addNewCustomer(e) {
  // Prevent form submission
  e.preventDefault();
  // Store form input values
  const name = document.querySelector("#fullName").value;
  const email = document.querySelector("#email").value;
  // Object to store new customer's details
  const newCustomer = {
    name,
    email,
    dateCreated: new Date()
  }
  // Start transaction to add data
  let requestTransaction = database.transaction(["customersD1"], "readwrite");
  let objStore = requestTransaction.objectStore("customersD1");
  let addRequest = objStore.put(newCustomer);

  addRequest.onsuccess = function(e) {
    console.log("Data is added");
    window.location.assign("index.html");
    
  }
  
  addRequest.onerror = function(e) {
    console.log("Sorry, data is not added");
  }
  console.log(database);
}

// Function to delete customers
function deleteCustomer(e) {
  let customerEmail = document.querySelector("#emailToDelete").value;
}

