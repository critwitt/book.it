const form = document.querySelector("#form");
const bookContainer = document.querySelector("#bookContainer")

form.addEventListener("submit", handleSubmission)

// Handle Submit Button

function handleSubmission (e) {
    e.preventDefault()

    bookContainer.innerHTML = "";
    const searchTerm = e.target.searchBar.value.split(" ").join("+");
    const searchParam = e.target.selectBook.value;
    console.log(searchTerm);
    console.log(searchParam);

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
        const thumbnail = document.createElement("img");
        const title = document.createElement("div");
        const author = document.createElement("div");
        const read = document.createElement("button");
        const wishlist = document.createElement("button");

        card.className = "bookInfo";
        thumbnail.src = `https://covers.openlibrary.org/b/id/${data.covers[0]}-S.jpg`;
        title.textContent = data.title;
        title.id = "bookTitle";
        fetch(`https://openlibrary.org${data.authors[0].author.key}.json`)
        .then(res => res.json())
        .then(data => {author.textContent = `by ${data.name}`})
        author.id = "bookAuthor";

        read.textContent = "Have read!";
        wishlist.textContent = "Wishlist!";

        function addBook (list) {
            document.querySelector(list).append(thumbnail, title, author)
            read.remove()
            wishlist.remove()
        }

        read.addEventListener("click", () => addBook("#haveRead"));
        wishlist.addEventListener("click", () => addBook("#wishlist"));
    
        card.append(thumbnail, title, author, read, wishlist);
        bookContainer.append(card);
    }
}