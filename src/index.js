let dark = false
const form = document.querySelector("#search-content");
const bookContainer = document.querySelector("#book-feed");
const bookLimit = document.querySelector("#search-limit");
let page = 1;

const prevPage = document.querySelector("#prev-page");
const nextPage = document.querySelector("#next-page");

// Add Pagination Functions/Event Listeners

prevPage.addEventListener("click", () => {
    if (page > 1) {
        page = page - 1;
        handleSubmission();
    } else {
        page = 1;
    }
})

nextPage.addEventListener("click", () => {
    if (page === (100/bookLimit.value)) {
        console.log("Last Page")
    } else {
        page = page + 1;
        handleSubmission();
    }
})


document.getElementById("search-button").addEventListener("click", () => {
    page = 1;
    handleSubmission()
})
document.getElementById("slider").addEventListener('click', handleSwitch)

// Handle Submit Button

function handleSubmission () {

    bookContainer.innerHTML = "";
    const searchTerm = document.querySelector("#search-bar").value.split(" ").join("+");
    const searchParam = document.querySelector("#search-type").value;

    // Fetch Search Term in Open Library API
    fetch(`http://openlibrary.org/search.json?${searchParam}=${searchTerm}`, {
        mode: 'cors',
        credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(data => {
        data.docs.slice(`${bookLimit.value*page - bookLimit.value}`,`${bookLimit.value*page}`).forEach(book => renderCard(book))
    })
    .catch(err => console.log(err))
}

// Render Book Lists


function appendBooks (url, list) {
    fetch(`http://localhost:3000/${url}`)
    .then(res => res.json())
    .then(data => data.forEach(book => {
        const newListItem = document.createElement("li");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Remove Book"
        deleteBtn.addEventListener("click", () => {
            newListItem.remove()
            deleteBtn.remove()
            fetch(`http://localhost:3000/${url}/${book.id}`, {
                method: 'DELETE'
            })
        })
        newListItem.textContent = book.book;
        document.querySelector(list).append(newListItem, deleteBtn)
    }))
}

appendBooks("haveRead", "#just-read");
appendBooks("wishlist", "#wish-list")

// Control Card Rendering

function renderCard (data) {
    const card = document.createElement("div");
    
    const imgDiv = document.createElement("div");
    const bookInfo = document.createElement("div");
    const buttons = document.createElement("div");
    
    const thumbnail = document.createElement("img");
    const title = document.createElement("h1");
    const author = document.createElement("h2");
    const description = document.createElement("p");

    const read = document.createElement("button");
    const wishlist = document.createElement("button");

    card.className = "book-card";
    imgDiv.className = "book-image";
    buttons.className = "book-actions";
    read.className = "mx-10 btn-long btn-outline";
    wishlist.className = "mx-10 btn-long btn-outline btn-brown";
    bookInfo.className = "book-info";

    read.textContent = "Have Read!";
    wishlist.textContent = "Want to Read!";
    
    fetch(`https://openlibrary.org${data.key}.json`)
    .then(res => res.json())
    .then(newData => {
        if (typeof newData.description === 'string') {
            if (newData.description.indexOf("(") === -1) {
                description.textContent = newData.description.slice(0, newData.description.indexOf("["));
            } else {
                description.textContent = newData.description.slice(0, newData.description.indexOf("("));
            }
        } else {
            description.textContent = newData.description.value;
        }
    })
    .catch(err => console.log(err))

    if(data.title) {
        title.textContent = data.title;
    } else {
        title.textContent = "No Title"
    }

    if(data.title.length < 39) title.textContent = data.title;
    else title.textContent = `${data.title.substr(0, 36)}...`
    
    if(data.cover_i) thumbnail.src = `https://covers.openlibrary.org/b/id/${data.cover_i}-L.jpg`
    else thumbnail.src = 'https://ualr.edu/elearning/files/2020/10/No-Photo-Available.jpg'

    if(data.author_name) {
        author.textContent = `by ${data.author_name[0]}`;
    } else {
        author.textContent = "No Author"
    }
    
    imgDiv.append(thumbnail);
    bookInfo.append(title, author, description);
    buttons.append(read, wishlist);

    read.addEventListener("click", () => addBook("#just-read", data.title, author.textContent));
    wishlist.addEventListener("click", () => addBook("#wish-list", data.title, author.textContent));

    card.append(imgDiv, bookInfo, buttons);

    bookContainer.append(card);
}

function addBook (list, title, author) {
    const newListItem = document.createElement("li");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Remove Book"
    newListItem.textContent = `${title} by ${author}`;
    let urlPath = "";
    let url = "";
    if (list === "#just-read") {
        url = "haveRead"
    } else {
        url = "wishlist"
    }
    const data = {
        book: `${title} by ${author}`
    }
    if(checkList(title, author)) {
        console.log("Can't do that!")
    } else {
        let urlPath = 0;
        fetch(`http://localhost:3000/${url}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(newData => urlPath = newData.id)
        deleteBtn.addEventListener("click", () => {
            newListItem.remove()
            deleteBtn.remove()
            fetch(`http://localhost:3000/${url}/${urlPath}`, {
                method: 'DELETE'
            })
        })
        document.querySelector(list).append(newListItem, deleteBtn)
    }
}

function createResource (data, url) {
    fetch(`http://localhost:3000/${url}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(newData => console.log(newData))
}

function checkList (title, author) {
    const myBooks = document.getElementsByTagName("li");
    for (let book in myBooks) {
        if (myBooks[book].textContent === `${title} by ${author}`) {
            return true
        }
    }
}

function handleSwitch() {
    dark = !dark
    const body = document.getElementsByTagName('body')[0]
    if(dark) {
        body.classList.remove('light') 
        body.classList.add('dark') 
    }
    else {
        body.classList.remove('dark')
        body.classList.add('light') 
    }
}


// Things to do