const backendUrl = 'http://127.0.0.1:5000';

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
        // Assuming data is the response object with child details
        // Display success message to the user
        showSuccess('Child added successfully!');

        // Example: Adding the created child to the DOM (you can define this function)
        addChildToDOM(data);

        // Clear form fields after successful addition
        document.getElementById('child-name').value = '';
        document.getElementById('child-birthdate').value = '';
        document.getElementById('child-parents').value = '';
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Failed to add child. Please try again later.');
    });
}

function showError(message) {
    // Display error message to the user
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
        errorMessageElement.style.display = 'block';
    } else {
        alert(message); // Fallback for basic error handling
    }
}

function showSuccess(message) {
    // Display success message to the user
    const successMessageElement = document.getElementById('success-message');
    if (successMessageElement) {
        successMessageElement.textContent = message;
        successMessageElement.style.display = 'block';
    } else {
        alert(message); // Fallback for basic success handling
    }
}

function addChildToDOM(child) {
    // Example: Adding the created child to the DOM (customize based on your UI structure)
    const childrenContainer = document.getElementById('children-container');
    if (childrenContainer) {
        const childElement = document.createElement('div');
        childElement.textContent = `Name: ${child.name}, Birthdate: ${child.birthdate}, Parents: ${child.parents}, Gender: ${child.sex}`;
        childrenContainer.appendChild(childElement);
    }
}


// Function to add a child to the DOM
function addChildToDOM(child) {
    const childrenContainer = document.getElementById('children-container');
    if (childrenContainer) {
        const childContainer = document.createElement('div');
        childContainer.classList.add('child-container');

        // Determine background color based on gender
        const backgroundColor = child.sex === 'F' ? 'pink' : 'blue';
        childContainer.style.backgroundColor = backgroundColor;

        childContainer.innerHTML = `
            <div class="child-item">
                <h3>${child.name}</h3>
                <p><strong>Birthdate:</strong> ${child.birthdate}</p>
                <p><strong>Parents:</strong> ${child.parents}</p>
                <p><strong>Gender:</strong> ${child.sex}</p>
                <button onclick="deleteChild(${child.id})">Delete</button>
            </div>
        `;
        childrenContainer.appendChild(childContainer);
    }
}

// Function to fetch all children from the backend and display them
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
        if (childrenContainer) {
            childrenContainer.innerHTML = ''; // Clear existing children before adding new ones
            children.forEach(child => {
                addChildToDOM(child);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Failed to fetch children. Please try again later.');
    });
}

// Function to delete a child (example)
function deleteChild(childId) {
    fetch(`${backendUrl}/kid/${childId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete child.');
        }
        // Assuming you want to re-fetch and display children after deletion
        fetchAndDisplayChildren();
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Failed to delete child. Please try again later.');
    });
}

// Initial function call to fetch and display children when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayChildren);
