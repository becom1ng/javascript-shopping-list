const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formButton = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
	const itemsFromStorage = getItemsFromStorage();
	itemsFromStorage.forEach((item) => addItemToDom(item));
	resetUI();
}

function onAddItemSubmit(e) {
	e.preventDefault();

	// Format input
	const stringInput = itemInput.value.toLowerCase().trim();
	const newItem = stringInput.charAt(0).toUpperCase() + stringInput.slice(1);

	const itemToEdit = itemList.querySelector('.edit-mode');

	// Validate Input
	if (newItem === '') {
		alert('Please add an item.');
		return;
	}

	if (checkIfItemExists(newItem)) {
		alert('That item already exists!');
		itemToEdit.classList.remove('edit-mode');
		resetUI();
		return;
	}

	// Check for edit mode
	if (isEditMode) {
		removeItemFromStorage(itemToEdit.textContent);
		itemToEdit.classList.remove('edit-mode');
		itemToEdit.remove();
		isEditMode = false;
	}

	addItemToDom(newItem);
	addItemToStorage(newItem);

	resetUI();
}

function createButton(classes) {
	const button = document.createElement('button');
	button.className = classes;
	const icon = createIcon('fa-solid fa-xmark');
	button.appendChild(icon);
	return button;
}

function createIcon(classes) {
	const icon = document.createElement('i');
	icon.className = classes;
	return icon;
}

function addItemToDom(item) {
	// Create List Item
	const li = document.createElement('li');
	li.appendChild(document.createTextNode(item));
	const button = createButton('remove-item btn-link text-red');

	// Attach Pieces
	li.appendChild(button);

	// Add li to the DOM
	itemList.appendChild(li);
}

function addItemToStorage(item) {
	const itemsFromStorage = getItemsFromStorage();

	// Add new item to array
	itemsFromStorage.push(item);

	// Convert to JSON string and set to local storage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
	let itemsFromStorage;

	if (localStorage.getItem('items') === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem('items'));
	}

	return itemsFromStorage;
}

function onClickItem(e) {
	if (e.target.id === 'item-list') {
		return;
	}
	if (e.target.parentElement.classList.contains('remove-item')) {
		removeItem(e.target.parentElement.parentElement);
	} else {
		setItemToEdit(e.target);
	}
}

function checkIfItemExists(item) {
	const itemsFromStorage = getItemsFromStorage();
	const itemsLowerCase = itemsFromStorage.map((str) => str.toLowerCase());
	return itemsLowerCase.includes(item.toLowerCase());
}

function setItemToEdit(item) {
	isEditMode = true;

	itemList
		.querySelectorAll('li')
		.forEach((i) => i.classList.remove('edit-mode'));

	item.classList.add('edit-mode');
	formButton.innerHTML = '<i class ="fa-solid fa-pen"></i> Update Item';
	formButton.style.backgroundColor = 'green';
	itemInput.value = item.textContent;
}

function removeItem(item) {
	if (confirm('Are you sure?')) {
		item.remove();
		removeItemFromStorage(item.textContent);
		resetUI();
	}
}

function removeItemFromStorage(item) {
	let itemsFromStorage = getItemsFromStorage();

	// Filter out item to be removed
	itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

	// Re-set local storage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(e) {
	// itemList.innerHTML = '';
	if (!confirm('Are you sure?')) {
		return;
	}
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
	}
	// Clear from local storage
	localStorage.removeItem('items');
	resetUI();
}

function filterItems(e) {
	const text = e.target.value.toLowerCase();
	const items = itemList.querySelectorAll('li');

	items.forEach((item) => {
		const itemName = item.firstChild.textContent.toLowerCase();
		if (itemName.includes(text)) {
			item.style.display = 'flex';
		} else {
			item.style.display = 'none';
		}
	});
}

function resetUI() {
	itemInput.value = '';
	const items = itemList.querySelectorAll('li');
	if (items.length === 0) {
		clearButton.style.display = 'none';
		itemFilter.style.display = 'none';
	} else {
		clearButton.style.display = 'block';
		itemFilter.style.display = 'block';
	}

	formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
	formButton.style.backgroundColor = '#333';

	isEditMode = false;
}

// Initialize app
function init() {
	// Event Listeners
	itemForm.addEventListener('submit', onAddItemSubmit);
	itemList.addEventListener('click', onClickItem);
	clearButton.addEventListener('click', clearItems);
	itemFilter.addEventListener('input', filterItems);
	document.addEventListener('DOMContentLoaded', displayItems);

	resetUI();
}

init();
