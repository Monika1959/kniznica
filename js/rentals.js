const jsonLibrary = './library.json';

// Fetch pre získanie JSON dát
fetch(jsonLibrary)
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('library', JSON.stringify(data));
    console.log('Zoznam bol uložený do localStorage.');
  })
  .catch(error => {
    console.error('Chyba pri získavaní alebo ukladaní dát:', error);
  });

/******************************** Získajte odkaz na pop-up menu pre užívateľa a knihu **************************************/

const userSelect = document.getElementById("userSelect");
const bookSelect = document.getElementById("bookSelect");

// Načítajte dostupných užívateľov a knihy do pop-up menu
function loadSelectOptions() {
    const library = JSON.parse(localStorage.getItem("library")) || { knihy: [], uzivatelia: [] };
    
    // Naplnenie pop-up menu pre užívateľa
    userSelect.innerHTML = "";
    for (const user of library.uzivatelia) {
        const option = document.createElement("option");
        option.value = user.personalId;
        option.textContent = `${user.lastName}, ${user.firstName} (OP: ${user.personalId})`;
        userSelect.appendChild(option);
    }
    
    // Naplnenie pop-up menu pre knihy
    bookSelect.innerHTML = "";
    for (const book of library.knihy) {
        const option = document.createElement("option");
        option.value = book.id;
        option.textContent = book.name;
        bookSelect.appendChild(option);
    }
}

/********************************************************************************/
/***************************** Funkcia na požičanie knihy ***************************************/

function borrowBook() {
  const userId = parseInt(userSelect.value);
  const bookId = parseInt(bookSelect.value);

  if (isNaN(userId) || isNaN(bookId)) {
      alert("Zadajte platné hodnoty!");
      return;
  }

  const library = JSON.parse(localStorage.getItem("library")) || { knihy: [], uzivatelia: [] };
  const book = library.knihy.find(book => book.id === bookId);
  const user = library.uzivatelia.find(user => user.personalId === userId);

  if (!book || !user) {
      alert("Kniha alebo užívateľ neexistuje.");
      return;
  }

  if (book.bookBorrowed) {
      alert("Kniha je už požičaná.");
      return;
  }

  const currentDate = new Date();
  book.bookBorrowed = true;
  book.userBorrowed = userId;
  book.dateBorrow = currentDate.toLocaleString(); // Uložíme dátum požičania

  updateTable(library);
  localStorage.setItem("library", JSON.stringify(library));
}
/***************************** Funkcia na vrátenie knihy ***************************************/

function returnBook() {
  const bookId = parseInt(bookSelect.value);

  if (isNaN(bookId)) {
      alert("Zadajte platné číslo knihy.");
      return;
  }

  const library = JSON.parse(localStorage.getItem("library")) || { knihy: [], uzivatelia: [] };
  const book = library.knihy.find(book => book.id === bookId);

  if (!book) {
      alert("Kniha neexistuje.");
      return;
  }

  if (!book.bookBorrowed) {
      alert("Kniha nie je už požičaná.");
      return;
  }

  const currentDate = new Date();
  book.bookBorrowed = false;
  book.userBorrowed = null;
  book.dateReturn = currentDate.toLocaleString(); // Uložíme dátum vrátenia

  updateTable(library);
  localStorage.setItem("library", JSON.stringify(library));
}

/***************************** Funkcia na aktualizáciu tabuľky ***************************************/

function updateTable(library) {
  const tableBody = document.getElementById("bookTableBody");
  tableBody.innerHTML = "";

  for (const book of library.knihy) {
      const row = document.createElement("tr");
      const user = library.uzivatelia.find(user => user.personalId === book.userBorrowed);

      row.innerHTML = `
          <td>${book.id}</td>
          <td>${book.name}</td>
          <td>${book.bookBorrowed ? "Požičaná" : "Dostupná"}</td>
          <td>${user ? `${user.lastName}, ${user.firstName} (č. OP: ${user.personalId})` : "Voľná"}</td>
          <td>${book.dateBorrow}</td>
          <td>${book.dateReturn}</td>
      `;
      tableBody.appendChild(row);
  }
}

// Načítanie tabuľky pri načítaní stránky
window.onload = function () {
  const library = JSON.parse(localStorage.getItem("library")) || { knihy: [], uzivatelia: [] };
  updateTable(library);
  loadSelectOptions();
};



