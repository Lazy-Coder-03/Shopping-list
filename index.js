import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase,ref,push,get,onValue,remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"
  const firebaseConfig = {
    apiKey: "AIzaSyAy19xW_Fh2dsRL0PlpWPforrbH7vjB7K4",
    authDomain: "shopping-cart-d5d80.firebaseapp.com",
    databaseURL: "https://shopping-cart-d5d80-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "shopping-cart-d5d80",
    storageBucket: "shopping-cart-d5d80.appspot.com",
    messagingSenderId: "1059577495890",
    appId: "1:1059577495890:web:92deed09c91d16d5f47a8b"
  };

const app = initializeApp(firebaseConfig);//initialise app
const database = getDatabase(app); // make a databse
const itemsInDB = ref(database,"items") // reference to database as items
//console.log(app);

//global array;






const popupMessage = document.getElementById("popup-message");
const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const itemlist = document.getElementById("item-list");



// Function to check if an item already exists in the database
function isItemInDatabase(item) {
  const itemsQuery = ref(database, "items");
  return get(itemsQuery).then((snapshot) => {
    if (snapshot.exists()) {
      const items = snapshot.val();
      return Object.values(items).includes(item);
    } else {
      return false;
    }
  });
}

addButton.addEventListener("click", function () {
  const item = inputField.value.trim();
  const words = item.split(/\s+/);
  const capitalizedItem = words.map(capitalizeFirstLetter).join(" ");
  clearInput();
  isItemInDatabase(capitalizedItem).then((exists) => {
    if (exists) {
        console.log("Item already in list: " + capitalizedItem);
        showPopupMessage("Item already in cart: " + capitalizedItem);
      // You can show a message to the user here
    } else {
        addToDB(capitalizedItem);
        console.log("Item added to cart: " + capitalizedItem);
    }
    updateButtonState();
  });
});

function clearInput(){
    inputField.value="";
    //updateButtonState();
}

//function updateList() {
onValue(itemsInDB, function(snapshot) {
    var itemsArr=[]
    itemlist.innerHTML = ""; // Clear the existing items
    if (!snapshot.exists()) {
        itemsArr = [];
    } else {
        itemsArr = Object.entries(snapshot.val());
        
        for (let i in itemsArr) {
            let curritem=itemsArr[i]
            let itemInd=curritem[0]
            let item=curritem[1]
            // Use a div container for each item with a class for styling
            appendToListEl(curritem);
        }
    }
});
//}
function appendToListEl(item){
    //itemlist.innerHTML += `<div class="item-box"><li>${item}</li></div>`;
    let itemId=item[0]
    let itemVal=item[1]
    let newEl=document.createElement("li")
    newEl.textContent=itemVal
    itemlist.append(newEl);
    newEl.addEventListener("click",()=>{
        let locOfitem=ref(database, `items/${itemId}`)//remove item
        remove(locOfitem);
        //console.log(itemId);
    })
}


function addToDB(item){
    if(item!="")
        push(itemsInDB, item);
    else 
        console.log("empty")
    //updateList()
    //var itemsArr=Object.values(snapshot.val());

}

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function showPopupMessage(message) {
  popupMessage.textContent = message;
  popupMessage.style.display = "block";

  // Hide the popup after a short delay (e.g., 3 seconds)
  setTimeout(function () {
    popupMessage.style.display = "none";
  }, 3000); // Adjust the delay as needed
}

// Function to enable or disable the button based on input field value
function updateButtonState() {
    var item = inputField.value.trim();
    addButton.disabled = item === ""; // Disable if the item is empty
}

// Add input event listener to dynamically check and update button state
inputField.addEventListener("input", updateButtonState);

// Initial check to disable the button if the input is initially empty
updateButtonState();
//updateList()