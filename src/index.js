const form = document.querySelector("#search-content");
const bookContainer = document.querySelector("#book-feed")

document.getElementById("search-button").addEventListener("click", handleSubmission)

// Handle Submit Button

function handleSubmission () {
    console.log("WOOO")

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

        // Iterate through 'works' to return book data and render

        for (let i=0; i < data.docs.length; i++) {
            fetch(`http://openlibrary.org${data.docs[i].key}.json`, {
                mode: 'cors',
                credentials: 'same-origin'
            })
            .then(res => res.json())
            .then(data => renderCard(data))
            .catch(err => console.log(err))
        }
    })
    .catch(err => console.log(err))

    

    // Render card

    function renderCard (data) {
        const card = document.createElement("div");
        const imgDiv = document.createElement("div");
        const thumbnail = document.createElement("img");
        const bookInfo = document.createElement("div");
        const title = document.createElement("h1");
        const author = document.createElement("p");
        const buttons = document.createElement("div");

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

        buttons.append(read, wishlist);

        thumbnail.src = `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`;
        title.textContent = data.title;
        title.id = "bookTitle";
        fetch(`https://openlibrary.org${data.authors[0].author.key}.json`)
        .then(res => res.json())
        .then(data => {author.textContent = `by ${data.name}`})
        author.id = "bookAuthor";

        imgDiv.append(thumbnail);

        bookInfo.append(title, author);

        function addBook (list) {
            document.querySelector(list).append(thumbnail, title, author)
            read.remove()
            wishlist.remove()
        }

        read.addEventListener("click", () => addBook("#just-read"));
        wishlist.addEventListener("click", () => addBook("#wish-list"));
    
        card.append(thumbnail, title, author, read, wishlist);
        bookContainer.append(card);
    }
}

// Things to do
// Remove thumbnail from wishlists
// See about styling for some books
// Maybe add pages?
// DARK MOOOODDDEEEE