"use strict";
let database;
let index;
let clearAllBtn = document.querySelector("#clearCustomer");
clearAllBtn.addEventListener("click", clearAllCustomers);
// Check indexedDB is supported
if("indexedDB" in window) {
  // Create indexedDB database
  let requestCustomer = window.indexedDB.open("customerDataNew", 1);
  // Handle upgrade event
  requestCustomer.onupgradeneeded = function(e) {
    let database = requestCustomer.result;
    // Create object store
    let customerObjStore = database.createObjectStore("customersD1", { autoIncrement: true, keyPath: "id" });
    let index = customerObjStore.createIndex("email", "email", { unique: true });
    console.log(`upgrading.... ${customerObjStore}`);
  };

  // Handle success event
  requestCustomer.onsuccess = function(e) {
    database = requestCustomer.result;
    console.log("success....");
    showCustomers();

    database.onerror = function(e) {
      let errorCode = e.target.errorCode;
      console.log(`Error within success handler: ${errorCode}`);
    };
  };

  // Handle error event
  requestCustomer.onerror = function(e) {
    let errorCode = e.target.errorCode;
    console.log(`Error: ${errorCode}`);
  };

} else {
  // Throw an alert message if indexedDB is not supported
  alert("Sorry, IndexedDB is not supported in your browser!");
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
    dateCreated: new Date().toDateString()
  };
  // Start transaction to add data
  let requestTransaction = database.transaction(["customersD1"], "readwrite");
  let objStore = requestTransaction.objectStore("customersD1");
  let addRequest = objStore.put(newCustomer);

  addRequest.onsuccess = function(e) {
    console.log("Data is added");
    window.location.assign("index.html");
  };
  
  addRequest.onerror = function(e) {
    let errorCode = e.target.errorCode;
    console.log(`Sorry, data is not added. Error: ${errorCode}`);
  };
}

// Function to delete customers
function deleteCustomer(e) {
  // Prevent form submission
  e.preventDefault();
  let customerEmail = document.querySelector("#emailToDelete").value;

  // Start a transaction to delete a customer
  let deleteTransaction = database.transaction(["customersD1"], "readwrite");
  let deleteStore = deleteTransaction.objectStore("customersD1");
  let index = deleteStore.index("email");
  let deleteRequest = index.get(customerEmail);

  deleteRequest.onsuccess = function(e) {
    console.log(e.target.result);
  };

  deleteRequest.onerror = function(e) {
    let errorCode = e.target.errorCode;
    console.log(`Sorry, data is not deleted. Error: ${errorCode}`);
  };
}

// Function to show customers
function showCustomers(e){
//   // Start a transaction to get the data
  let getTransaction = database.transaction(["customersD1"], "readonly");
  let getStore = getTransaction.objectStore("customersD1");
  let cursor = getStore.openCursor();

  cursor.onsuccess = function(e) {
    let requestResult = e.target.result;
    let tbody = document.querySelector("#data tbody");
    let row = document.createElement("tr");

    if(requestResult) {
      for(let i in requestResult.value) {
        let td = document.createElement("td");
        let tx = document.createTextNode(requestResult.value[i]);
        td.appendChild(tx);
        row.appendChild(td);
        console.log(i);
      }
      requestResult.continue();
    }
    tbody.appendChild(row);
    console.log("Got the data");
  };

  cursor.onerror = function(e) {
    let errorCode = e.target.errorCode;
    console.log(`Error: ${errorCode}`);
  };
}

// Function to delete all customers
function clearAllCustomers(e) {
  e.preventDefault();
  // Delete entire database
  let deleteDatabaseRequest = window.indexedDB.deleteDatabase("customerDataNew");

  deleteDatabaseRequest.onsuccess = function(e) {
    console.log("Database deleted successfully!")
    window.location.assign("index.html");
  };

  deleteDatabaseRequest.onerror = function(e) {
    console.log("Error deleting datbase!");
  };

  // Start a transaction to delete all customers records (not entire database)
  // let deleteAllTransaction = database.transaction(["customersD1"], "readwrite");
  // let deleteAllStore = deleteAllTransaction.objectStore("customersD1");
  // let deleteAllRequest = deleteAllStore.clear();

  // deleteAllRequest.onsuccess = function(e){
  //   let tbody = document.querySelector("#data tbody");
  //   tbody.innerHTML = "";
  //   window.location.assign("index.html");
  //   console.log("Data has been deleted");
  // };

  // deleteAllRequest.onerror = function(e){
  //   let errorCode = e.target.errorCode;
  //   console.log(`Error: ${errorCode}`);
  // };

}