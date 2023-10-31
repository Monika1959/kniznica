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

/********************************************************************************/

const tabulkaClenov = document.getElementById("tabulkaClenov");
const formularClenov = document.getElementById("formularClenov");
const memberIndexInput = document.getElementById("memberIndex");

const library = JSON.parse(localStorage.getItem("library")) || [];
// Manipulácia iba so sekciou "užívatelia"
const membersList = library.uzivatelia;

/***************************** Funkcia na uloženie užívateľov ***************************************/

function saveMembers() {
    localStorage.setItem("membersList", JSON.stringify(membersList));
}

/***************************** Funkcia na vykreslenie tabuľky s užívateľmi ***************************************/

function renderMembers() {
    tabulkaClenov.innerHTML = `
        <tr>
            <th>Meno:</th>
            <th>Priezvisko:</th>
            <th>Číslo OP:</th>
            <th>Dátum narodenia:</th>
            <th>Upraviť / Vymazať</th>
        </tr>
        ${membersList.map((member, index) => `
            <tr>
                <td>${member.firstName}</td>
                <td>${member.lastName}</td>
                <td>${member.personalId}</td>
                <td>${member.dateOfBirth}</td>
                <td><button onclick="editMember(${index})">Upraviť</button></td>
                <td><button onclick="deleteMember(${index})">Zmazať</button></td>
            </tr>
        `).join("")}
    `;
}

/***************************** Funkcia na pridanie užívateľa ***************************************/

function addMember() {
    const personalId = document.getElementById("documentNumberInput").value;
    const firstName = document.getElementById("firstNameInput").value;
    const lastName = document.getElementById("lastNameInput").value;
    const dateOfBirth = document.getElementById("birthDateInput").value;

    const member = { personalId, firstName, lastName, dateOfBirth };

    const memberIndex = memberIndexInput.value;
    if (memberIndex !== "") {
        // editovanie existujúceho užívateľa
        membersList[memberIndex].firstName = firstName;
        membersList[memberIndex].lastName = lastName;
        membersList[memberIndex].personalId = personalId;
        membersList[memberIndex].dateOfBirth = dateOfBirth;
    } else {
        // pridanie nového užívateľa
        membersList.push({ firstName, lastName, personalId, dateOfBirth });
    }

    saveMembers();
    renderMembers();
    memberIndexInput.value = "";
}

/***************************** Funkcia na úpravu užívateľa ***************************************/

function editMember(index) {
    const member = membersList[index];
    document.getElementById("firstNameInput").value = member.firstName;
    document.getElementById("lastNameInput").value = member.lastName;
    document.getElementById("documentNumberInput").value = member.personalId;
    document.getElementById("birthDateInput").value = member.dateOfBirth;
    memberIndexInput.value = index;
}

/***************************** Funkcia na mazanie užívateľa ***************************************/

function deleteMember(index) {
    membersList.splice(index, 1);

    saveMembers();
    renderMembers();
}

// Načítanie existujúcich užívateľov pri načítaní stránky
renderMembers();




