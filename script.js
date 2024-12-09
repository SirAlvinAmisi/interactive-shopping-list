// DOM Elements
const addItemButton = document.getElementById('addItemButton');
// Button to add new items
const clearListButton = document.getElementById('clearListButton'); // Button to clear the list
const itemInput = document.getElementById('itemInput'); // Input field for new items
const shoppingList = document.getElementById('shoppingList'); // Container for the shopping list items

// Load the shopping list from local storage when the page loads
document.addEventListener('DOMContentLoaded', loadFromLocalStorage);

// Event Listeners
addItemButton.addEventListener('click', addItem); // Listener for adding new items
clearListButton.addEventListener('click', clearList); // Listener for clearing the entire list

// Functions

/**
 * Add an item to the shopping list.
 * - Creates a new list item.
 * - Appends the item to the DOM.
 * - Saves the updated list to local storage.
 */
function addItem() {
    const itemText = itemInput.value.trim(); // Get and trim input value

    if (itemText !== '') { // Only add non-empty items
        const listItem = createListItem(itemText); // Create a new list item
        shoppingList.appendChild(listItem); // Add to the shopping list
        itemInput.value = ''; // Clear the input field
        saveToLocalStorage(); // Update local storage
    }
}

/**
 * Create a new list item element.
 * - Adds buttons for editing and purchasing
 * @param {string} text - The text for the new list item.
 * @returns {HTMLElement} - The new list item element.
 */
function createListItem(text) {
    // Clone the template
    const template = document.getElementById('listItemTemplate');
    const listItem = template.content.cloneNode(true).querySelector('.list-item');
    
    // Set the item text
    const textSpan = listItem.querySelector('.item-text');
    textSpan.textContent = text;
    
    // Add event listeners to buttons
    const editBtn = listItem.querySelector('.edit-btn');
    const purchaseBtn = listItem.querySelector('.purchase-btn');
    
    editBtn.addEventListener('click', () => editItem(textSpan));
    purchaseBtn.addEventListener('click', () => {
        listItem.classList.toggle('purchased');
        saveToLocalStorage();
    });
    
    return listItem;
}

/**
 * Edit an existing list item.
 * - Replaces the item's text with an input field.
 * - Saves changes on blur (when input loses focus).
 */
function editItem(textSpan) {
    const currentText = textSpan.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    textSpan.textContent = '';
    textSpan.appendChild(input);

    input.addEventListener('blur', () => {
        const newText = input.value.trim();
        textSpan.textContent = newText || currentText;
        saveToLocalStorage();
    });

    input.focus();
}

/**
 * Clear the entire shopping list.
 * - Removes all items from the DOM.
 * - Updates local storage to reflect the empty list.
 */
function clearList() {
    shoppingList.innerHTML = ''; // Clear the list container
    saveToLocalStorage(); // Update local storage
}

/**
 * Save the current shopping list to local storage.
 * - Serializes the list as an array of objects (text and purchased state).
 */
function saveToLocalStorage() {
    const items = [];
    shoppingList.querySelectorAll('.list-item').forEach((item) => {
        items.push({
            text: item.querySelector('.item-text').textContent,
            purchased: item.classList.contains('purchased'),
        });
    });
    localStorage.setItem('shoppingList', JSON.stringify(items));
}

/**
 * Load the shopping list from local storage.
 * - Recreates the DOM list from the stored data.
 */
function loadFromLocalStorage() {
    const items = JSON.parse(localStorage.getItem('shoppingList')) || []; // Retrieve items or use an empty array
    items.forEach((item) => {
        const listItem = createListItem(item.text); // Create a new list item
        if (item.purchased) {
            listItem.classList.add('purchased'); // Mark as purchased if applicable
        }
        shoppingList.appendChild(listItem); // Add item to the list container
    });
}
