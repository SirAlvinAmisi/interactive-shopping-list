// DOM Elements
const addItemButton = document.getElementById('addItemButton'); // Button to add new items
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
 * Toggle the purchased status or enable editing.
 * - Single click toggles the purchased state.
 * - Double click enables editing of the item.
 */
function togglePurchased(event) {
    if (event.detail === 2) { // Detect double-click for editing
        editItem(event.target);
    } else { // Single-click toggles purchased state
        event.target.classList.toggle('purchased');
        saveToLocalStorage();
    }
}

/**
 * Edit an existing list item.
 * - Replaces the item's text with an input field.
 * - Saves changes on blur (when input loses focus).
 */
function editItem(item) {
    const currentText = item.textContent; // Get current item text
    const input = document.createElement('input'); // Create an input field
    input.type = 'text';
    input.value = currentText; // Populate input with current text
    item.textContent = ''; // Clear current item text
    item.appendChild(input); // Add input to the item

    // Save changes when input loses focus
    input.addEventListener('blur', () => {
        const newText = input.value.trim(); // Get the new text
        item.textContent = newText || currentText; // Update text (revert if empty)
        item.addEventListener('click', togglePurchased); // Reattach the toggle listener
        saveToLocalStorage(); // Update local storage
    });

    input.focus(); // Focus the input for editing
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
 * Create a new list item element.
 * - Adds event listeners for toggling and editing.
 * @param {string} text - The text for the new list item.
 * @returns {HTMLElement} - The new list item element.
 */
function createListItem(text) {
    const listItem = document.createElement('li'); // Create a list item
    listItem.textContent = text; // Set the item's text
    listItem.addEventListener('click', togglePurchased); // Attach toggle listener
    return listItem;
}

/**
 * Save the current shopping list to local storage.
 * - Serializes the list as an array of objects (text and purchased state).
 */
function saveToLocalStorage() {
    const items = []; // Initialize an array to hold items
    shoppingList.querySelectorAll('li').forEach((item) => {
        items.push({
            text: item.textContent, // Item text
            purchased: item.classList.contains('purchased'), // Purchased status
        });
    });
    localStorage.setItem('shoppingList', JSON.stringify(items)); // Save to local storage
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
