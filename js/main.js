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
    console.log("upgrading....");
  };

  // Handle success event
  requestCustomer.onsuccess = function(e) {
    database = requestCustomer.result;
    console.log("success....");
    showCustomers();

    database.onerror = function(e) {
      let errorName = e.target.error.name;
      console.log(`Error within success handler: ${errorName}`);
    };
  };

  // Handle error event
  requestCustomer.onerror = function(e) {
    let errorName = e.target.error.name;
    console.log(`Error: ${errorName}`);
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
    dateCreated: new Date().toLocaleString()
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
    let errorName = e.target.error.name;
    console.log(`Sorry, data is not added. Error: ${errorName}`);
  };
}

// Function to delete customers
function deleteCustomer(btn) {
  // Get an id of current element
  const parentTr = btn.parentNode.parentNode;
  const id = parseInt(parentTr.firstElementChild.textContent);
  const parentTbody = parentTr.parentNode;
  // Start transaction to delete a customer
  let deleteTransaction = database.transaction(["customersD1"], "readwrite");
  let deleteStore = deleteTransaction.objectStore("customersD1");
  let deleteRequest = deleteStore.delete(id);

  deleteRequest.onsuccess = function(e) {
    // Removes tr from parent tbody
    parentTbody.removeChild(parentTr);
    console.log("Removed customer");
  };

  deleteRequest.onerror = function(e) {
    let errorName = e.target.error.name;
    console.log(`Sorry, data is not added. Error: ${errorName}`);
  };
}

// Function to show customers
function showCustomers(e){
//   // Start a transaction to get the data
  let getTransaction = database.transaction(["customersD1"], "readonly");
  let getStore = getTransaction.objectStore("customersD1");
  // Opens cursor on object store to iteratate over customer objects
  let cursor = getStore.openCursor();
  let output = "";

  cursor.onsuccess = function(e) {
    let requestResult = e.target.result;
    let tbody = document.querySelector("#data tbody");
    // Add new row with customer's details into table body
    if(requestResult) {
      output += `<tr>
      <td>${requestResult.value.id}</td>
      <td>${requestResult.value.name}</td>
      <td>${requestResult.value.email}</td>
      <td>${requestResult.value.dateCreated}</td>
      <td><a href="#" class="deleteBtn" title="Remove Customer" onclick="deleteCustomer(this)">&#10005;</a></td>
      </tr>`;
      requestResult.continue();
    }
    tbody.innerHTML = output;
  };

  cursor.onerror = function(e) {
    let errorName = e.target.error.name;
    console.log(`Error: ${errorName}`);
  };
}

// Function to delete all customers
function clearAllCustomers(e) {
  e.preventDefault();
  // Delete entire database
  let deleteDatabaseRequest = window.indexedDB.deleteDatabase("customerDataNew");
  window.location.assign("index.html");

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
  //   let errorName = e.target.error.name;
  //   console.log(`Error: ${errorName}`);
  // };
}