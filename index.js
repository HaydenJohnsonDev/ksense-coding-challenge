// Loads users.
async function loadUsers () {
    const url = `https://jsonplaceholder.typicode.com/users`

    const response = await fetch(url);
    const users = await response.json();

    return users;
}

// Loads posts when called with a userId.
async function loadPosts (userId) {
    const abortController = new AbortController();
    const signal = { signal: abortController.signal };

    const url = `https://jsonplaceholder.typicode.com/users/${userId}/posts`;

    try {
        const response = await fetch(url, signal);
        posts = await response.json();
    } catch (err) {
        if (err.name === "AbortError") {
            console.log("Aborted", userId);
        } else { throw err };
    }

    return () => {
        abortController.abort();
    };
}

// Builds the design of an individual user for the table.
const renderOneUser = (user) => {
    const { id, name, username, email, phone } = user;
  
    const content = `
        <tr onClick="userClickHandler(${id})">
          <td>${name}</td>
          <td>${username}</td>
          <td>${email}</td>
          <td>${phone}</td>
        </tr>
    `;    
    return content;
};

// Builds the design of an individual post for the container.
const renderOnePost = (post) => {
    const { title, body } = post;
  
    const postContent = `
        <div class="card text-white bg-dark mb-3 m-3" style="max-width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${body}</p>
            </div>
        </div>
    `;
    return postContent;
};

const tableHeaders = `
    <tr>
        <th><h3>Name</h3></th>
        <th><h3>Username</h3></th>
        <th><h3>Email</h3></th>
        <th><h3>Phone</h3></th>
    </tr>
`
// Click handler for when user clicks on a 'USER'.
function userClickHandler(userId) {
    posts = "";
    loadPosts(userId).then(() => render());
}


// renders the DOM
async function render () {
    const users = await loadUsers();

    const tableContent = document.querySelector("table");
    tableContent.innerHTML = "";
    const content = users.map(renderOneUser).join("");
    tableContent.innerHTML = tableHeaders + content;

    const postsDiv = document.querySelector("div.posts-div")
    postsDiv.innerHTML = ``;

    if (posts) {
        const postsContent = posts.map(renderOnePost).join("");
        postsDiv.innerHTML = postsContent;
    } else {
        postsDiv.innerHTML = "<p class='m-1'>Please select a post.</p>";
    }
};

// the point where all the code starts
const main = () => {
    render();
};

// Event listener for DOMContentLoaded
window.addEventListener("DOMContentLoaded", main);