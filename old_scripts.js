const backendUrl = 'http://127.0.0.1:5000';

// Show the form when "Add Child" button is clicked
document.getElementById("show-form-button").addEventListener("click", function() {
    document.getElementById("child-form").style.display = "block";
    document.getElementById("show-form-button").style.display = "none";
});

// Confirm button to add child and hide form
document.getElementById("confirm-button").addEventListener("click", function() {
    addChild();
    document.getElementById("child-form").style.display = "none";
    document.getElementById("show-form-button").style.display = "block";
});

function addChild() {
    const name = document.getElementById('child-name').value;
    const birthdate = document.getElementById('child-birthdate').value;
    const parents = document.getElementById('child-parents').value;
    const gender = document.getElementById('child-gender').value;

    if (!name || !birthdate || !parents) {
        showError('Please fill in all fields.');
        return;
    }

    const child = {
        name,
        birthdate,
        parents,
        sex: gender
    };

    // Send POST request to backend
    fetch(`${backendUrl}/kid`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(child)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        showSuccess('Child added successfully!');
        addChildToDOM(data);
        document.getElementById('child-name').value = '';
        document.getElementById('child-birthdate').value = '';
        document.getElementById('child-parents').value = '';
        document.getElementById('child-gender').value = 'M';
        fetchItems(); // Fetch items after adding a new child
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Failed to add child. Please try again later.');
    });
}

function showError(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
}

function showSuccess(message) {
    const successMessageElement = document.getElementById('success-message');
    successMessageElement.textContent = message;
    successMessageElement.style.display = 'block';
}

function addChildToDOM(child) {
    const childrenContainer = document.getElementById('children-container');
    const childElement = document.createElement('div');
    childElement.classList.add('child');
    childElement.classList.add(child.sex === 'M' ? 'male' : 'female');
    childElement.id = `child-${child.id}`;
    childElement.innerHTML = `
        <h3>${child.name}</h3>
        <p><strong>Birthdate:</strong> ${child.birthdate}</p>
        <p><strong>Parents:</strong> ${child.parents}</p>
        <p><strong>Gender:</strong> ${child.sex}</p>
        <div class="items-container" id="items-${child.id}"></div>
        <textarea placeholder="New post" id="new-item-name-${child.id}"></textarea>
        <button onclick="addItem(${child.id})">Add Post</button>
        <button onclick="deleteChild(${child.id})">Delete whole block</button>
    `;
    childrenContainer.appendChild(childElement);
}

function fetchAndDisplayChildren() {
    fetch(`${backendUrl}/kid`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch children.');
        }
        return response.json();
    })
    .then(children => {
        const childrenContainer = document.getElementById('children-container');
        childrenContainer.innerHTML = '';
        children.forEach(child => {
            addChildToDOM(child);
        });
        fetchItems(); // Fetch items after displaying children
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Failed to fetch children. Please try again later.');
    });
}

function fetchItems() {
    fetch(`${backendUrl}/item`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch items.');
        }
        return response.json();
    })
    .then(items => {
        items.forEach(item => {
            const childItemsContainer = document.getElementById(`items-${item.kid.id}`);
            if (childItemsContainer) {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');
                itemElement.innerHTML = `
                    <p>${item.name}</p>
                    <div class="tags">
                        ${item.tags.map(tag => `<span class="tag">${tag.name}</span>`).join('')}
                    </div>
                `;
                childItemsContainer.appendChild(itemElement);
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Failed to fetch items. Please try again later.');
    });
}

function addItem(childId) {
    const itemName = document.getElementById(`new-item-name-${childId}`).value;

    if (!itemName) {
        showError('Please enter an item name.');
        return;
    }

    const item = {
        name: itemName,
        kid_id: childId
    };

    // Send POST request to backend
    fetch(`${backendUrl}/item`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add item.');
        }
        return response.json();
    })
    .then(newItem => {
        const childItemsContainer = document.getElementById(`items-${childId}`);
        if (childItemsContainer) {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            itemElement.innerHTML = `
                <p>${newItem.name}</p>
                <div class="tags">
                    ${newItem.tags.map(tag => `<span class="tag">${tag.name}</span>`).join('')}
                </div>
            `;
            childItemsContainer.appendChild(itemElement);
        }
        document.getElementById(`new-item-name-${childId}`).value = ''; 
        showSuccess('Item added successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Failed to add item. Please try again later.');
    });
}

function deleteChild(childId) {
    fetch(`${backendUrl}/kid/${childId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete child.');
        }
        fetchAndDisplayChildren();
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Failed to delete child. Please try again later.');
    });
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayChildren);
