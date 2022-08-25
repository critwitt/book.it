const form = document.querySelector("#search-content");
const bookContainer = document.querySelector("#book-feed");
const bookLimit = document.querySelector("#search-limit");
let page = 1;

const prevPage = document.querySelector("#prev-page");
const nextPage = document.querySelector("#next-page");

prevPage.addEventListener("click", () => {
    if (page > 1) {
        page = page - 1;
        handleSubmission();
    } else {
        page = 1;
    }
})

nextPage.addEventListener("click", () => {
    if (page < 50) {
        page = page + 1;
        handleSubmission();
    } else {
        page = 1;
    }
})

document.getElementById("search-button").addEventListener("click", handleSubmission)

// Handle Submit Button

function handleSubmission () {

    bookContainer.innerHTML = "";
    const searchTerm = document.querySelector("#search-bar").value.split(" ").join("+");
    const searchParam = document.querySelector("#search-type").value;

    // Fetch Search Term in Open Library API

    fetch(`http://openlibrary.org/search.json?q=${searchTerm}`, {
        mode: 'cors',
        credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(data => { 
        data.docs.slice(`${bookLimit.value*page - bookLimit.value}`,`${bookLimit.value*page - 1}`).forEach(book => {
        // console.log(book.type)
        renderCard(book)
        })}
    //     data.docs.forEach(book => {

    //     // Iterate through 'works' to return book data and render

    //     fetch(`http://openlibrary.org${book.key}.json?limit=10`)
    //     .then(res => res.json())
    //     .then(data => renderCard(data))
    //     .catch(err => console.log(err))
    // })
    )
    .catch(err => console.log(err))
}

function renderCard (data) {
    console.log(data)
    const card = document.createElement("div");
    
    const imgDiv = document.createElement("div");
    const bookInfo = document.createElement("div");
    const buttons = document.createElement("div");
    
    const thumbnail = document.createElement("img");
    const title = document.createElement("h1");
    const author = document.createElement("p");

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
        author.textContent = data.author_name[0];
    } else {
        author.textContent = "No Author"
    }
    
    imgDiv.append(thumbnail);
    bookInfo.append(title, author);
    buttons.append(read, wishlist);

    read.addEventListener("click", () => addBook("#just-read", data.title));
    wishlist.addEventListener("click", () => addBook("#wish-list", data.title));

    card.append(imgDiv, bookInfo, buttons);

    bookContainer.append(card);
}

function addBook (list, title) {
    const newListItem = document.createElement("li");
    newListItem.textContent = title;
    if(checkList(title)) {
        console.log("Can't do that!")
    } else {
        document.querySelector(list).append(newListItem)
    }
}

function checkList (title) {
    const myBooks = document.getElementsByTagName("li");
    for (let book in myBooks) {
        if (myBooks[book].textContent === title) {
            return true
        }
    }
}

// Things to do
// Remove thumbnail from wishlists
// See about styling for some books
// Maybe add pages?
// DARK MOOOODDDEEEE