const backendUrl = 'http://localhost:5000';

// Mock data for demonstration
const mockData = [
    {
        name: 'John',
        birthdate: '2015-04-12',
        parents: 'John Sr. and Jane',
        gender: 'M',
        posts: [
            { description: 'First day at school', tags: ['school day', 'development'] },
            { description: 'Learned to ride a bike', tags: ['development', 'responsibilities'] }
        ],
        tags: ['school day', 'development', 'responsibilities']
    },
    {
        name: 'Emma',
        birthdate: '2016-08-19',
        parents: 'Mike and Anna',
        gender: 'F',
        posts: [
            { description: 'Went to the zoo', tags: ['day fun', 'animals'] },
            { description: 'Started ballet classes', tags: ['development', 'hobbies'] }
        ],
        tags: ['day fun', 'development', 'hobbies', 'animals']
    }
];

// Function to load mock data
function loadMockData() {
    mockData.forEach(child => {
        addChildToDOM(child);
    });
}

// Function to add child to DOM
function addChildToDOM(child) {
    const childContainer = document.createElement('div');
    childContainer.className = `child ${child.gender === 'M' ? 'male' : 'female'}`;

    let postsHtml = '';
    child.posts.forEach(post => {
        postsHtml += `
            <div class="post">
                <div>${post.description}</div>
                <div class="tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    });

    let tagsHtml = '';
    child.tags.forEach(tag => {
        tagsHtml += `<span class="tag">${tag}</span> `;
    });

    childContainer.innerHTML = `
        <h2>${child.name}</h2>
        <p>Birthdate: ${child.birthdate}</p>
        <p>Parents: ${child.parents}</p>
        <div class="posts-container">
            ${postsHtml}
        </div>
        <textarea placeholder="Write a post..."></textarea>
        <div class="tags-form">
            <button onclick="addPost(this)">Add Post</button>
            <div>
                <input type="text" placeholder="New tag">
                <button onclick="addTag(this)">Add Tag</button>
            </div>
        </div>
        <div class="tags-container">
            ${tagsHtml}
        </div>
    `;

    document.getElementById('children-container').appendChild(childContainer);
}

// Function to add new child
function addChild() {
    const name = document.getElementById('child-name').value;
    const birthdate = document.getElementById('child-birthdate').value;
    const parents = document.getElementById('child-parents').value;
    const gender = document.getElementById('child-gender').value;

    if (!name || !birthdate || !parents) {
        alert('Please fill in all fields.');
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
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Add child to DOM if successful
            addChildToDOM(child);
            // Clear form fields
            document.getElementById('child-name').value = '';
            document.getElementById('child-birthdate').value = '';
            document.getElementById('child-parents').value = '';
        } else {
            alert('Error adding child: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Load mock data on page load
window.onload = loadMockData;
