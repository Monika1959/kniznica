const jsonLibrary = './library.json';

// Fetch pre získanie JSON dát
fetch(jsonLibrary)
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('library', JSON.stringify(data));
    console.log('Zoznam bol uložený do localStorage.');
  })
  .catch(error => {
    console.error('Chyba pri získavaní alebo ukladaní dát.', error);
  });

/********************************************************************************/
const bookIndexInput = document.getElementById("bookIndex");
const bookTab = document.getElementById("bookTab");
const bookForm = document.getElementById("bookForm");

const library = JSON.parse(localStorage.getItem("library")) || [];
// Manipulácia iba so sekciou "knihy" a sekciou "uzivatelia"
const booksList = library.knihy;
const membersList = library.uzivatelia;

/***************************** Funkcia na uloženie užívateľov ***************************************/

function saveBooks() {
    localStorage.setItem("booksList", JSON.stringify(booksList));
}

/***************************** Funkcia na vykreslenie tabuľky s knihami ***************************************/

function renderBooks() {
    bookTab.innerHTML = `
        <tr>
          <th>Kniha</th>
          <th>Autor</th>
          <th>Status</th>
          <th>Akcia</th>
        </tr>
        ${booksList.map((book, index) => {
            const borrowedUser = book.userBorrowed !== false ? membersList.find(user => user.personalId === book.userBorrowed) : null;
            const borrowedUserName = borrowedUser ? `${borrowedUser.lastName}, ${borrowedUser.firstName} (č. OP: ${borrowedUser.personalId})` : "Voľná";

            return `
            <tr>
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${borrowedUserName}</td>
                <td><button onclick="editBook(${index})">Upraviť</button></td>
                <td><button onclick="deleteBook(${index})">Zmazať</button></td>
            </tr>
        `;}).join("")}
    `;
}

/***************************** Funkcia na pridanie knihy ***************************************/

function addBook() {
    
    const name = document.getElementById("nameInput").value;
    const author = document.getElementById("authorInput").value;

    const book = {name, author};

    const bookIndex = bookIndexInput.value;
    if (bookIndex !== "") {
        // editovanie existujúcej knihy
        booksList[bookIndex].name = name;
        booksList[bookIndex].author = author;
    } else {
        // pridanie novej knihy
        booksList.push({ name, author, borrowed: false  });
        localStorage.setItem('booksList', JSON.stringify(book));
    }

    saveBooks();
    renderBooks();
    bookIndexInput.value = "";
}

/***************************** Funkcia na úpravu knihy ***************************************/

function editBook(index) {
    const book = booksList[index];
    document.getElementById("nameInput").value = book.name;
    document.getElementById("authorInput").value = book.author;
    bookIndexInput.value = index;
}

/***************************** Funkcia na mazanie knihy ***************************************/

function deleteBook(index) {
    booksList.splice(index, 1);

    saveBooks();
    renderBooks();
}

// Načítanie existujúcich kníh pri načítaní stránky
renderBooks();




