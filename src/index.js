let dark = false
const form = document.querySelector("#search-content");
const bookContainer = document.querySelector("#book-feed")
document.getElementById("search-button").addEventListener("click", handleSubmission)
document.getElementById("slider").addEventListener('click', handleSwitch)

// Handle Submit Button

function handleSubmission () {
    console.log("WOOO")

    bookContainer.innerHTML = "";
    const searchTerm = document.querySelector("#search-bar").value.split(" ").join("+");
    const searchParam = document.querySelector("#search-type").value;

    // Fetch Search Term in Open Library API
    fetch(`http://openlibrary.org/search.json?${searchParam}=${searchTerm}`, {
        mode: 'cors',
        credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(data => data.docs.forEach(book => {

        // Iterate through 'works' to return book data and render

        fetch(`http://openlibrary.org${book.key}.json`)
        .then(res => res.json())
        .then(data => renderCard(data))
        .catch(err => console.log(err))
    })
    )
    .catch(err => console.log(err))
}

function renderCard (data) {
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
    
    if(data.title.length < 39) title.textContent = data.title;
    else title.textContent = `${data.title.substr(0, 36)}...`
    
    if(data.covers) thumbnail.src = `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
    else thumbnail.src = 'https://ualr.edu/elearning/files/2020/10/No-Photo-Available.jpg'

    fetch(`https://openlibrary.org${data.authors[0].author.key}.json`)
    .then(res => res.json())
    .then(data => {author.textContent = `by ${data.name}`})
    
    imgDiv.append(thumbnail);
    bookInfo.append(title, author);
    buttons.append(read, wishlist);

    read.addEventListener("click", () => addBook("#just-read", data.title));
    wishlist.addEventListener("click", () => addBook("#wish-list", data.title));
    card.addEventListener('click', () => showBookDetails(data))

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

function showBookDetails(data) {
    console.log('ert');
}


// Things to do
// Remove thumbnail from wishlists
// See about styling for some books
// Maybe add pages?
// DARK MOOOODDDEEEE