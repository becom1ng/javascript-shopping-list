const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');

function onAddItemSubmit(e) {
	e.preventDefault();

	const newItem = itemInput.value;

	// Validate Input
	if (newItem === '') {
		alert('Please add an item.');
		return;
	}

	addItemToDom(newItem);
	addItemToStorage(newItem);

	checkUI();

	itemInput.value = '';
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
	let itemsFromStorage;

	if (localStorage.getItem('items') === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem('items'));
	}

	// Add new item to array
	itemsFromStorage.push(item);

	// Convert to JSON string and set to local storage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
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

function removeItem(e) {
	if (e.target.parentElement.classList.contains('remove-item')) {
		if (confirm('Are you sure?')) {
			e.target.parentElement.parentElement.remove();
			checkUI();
		}
	}
}

function clearItems(e) {
	// itemList.innerHTML = '';
	if (!confirm('Are you sure?')) {
		return;
	}
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
	}
	checkUI();
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

function checkUI() {
	const items = itemList.querySelectorAll('li');
	if (items.length === 0) {
		clearButton.style.display = 'none';
		itemFilter.style.display = 'none';
	} else {
		clearButton.style.display = 'block';
		itemFilter.style.display = 'block';
	}
}

// Event Listeners
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', removeItem);
clearButton.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);

checkUI();
