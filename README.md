# book.it

## Foreward
Welcome to Book.it! This is an introductory project made by Eric Jubera, Casey Ramirez, and Chris Witte with the goal of exploring concepts of APIs and DOM manipulation. 

## PURPOSE
This project was created with the goal of allowing a user to catalogue his/her book history and wants. A user has the capability to search for books based on title, author, subject, and various other search parameters. Each book returned will include the title of the book, the author of the book, and a description. A user can then put books they've read into a "Just Read" section or put books they want to read into a "Wishlist" section. A user will not be able to duplicate books on either list. Users also have the option of selecting how many books they'd like to appear when they search by changing the book count in the bottom left corner. New pages can be changed using the "Back" and "Next" buttons. Lastly, a user can switch the application to dark mode using the toggle in the upper right corner.

## HOW IT WORKS
Book.it makes use of Open Library's API. Fetch calls are used to get info from the API based on input parameters. An array of book objects is returned which is iterated over to render them to the DOM.