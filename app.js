class Voca {
  constructor(word, definition) {
    this.word = word;
    this.definition = definition;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayVocas() {
    const vocas = Store.getVocas();

    vocas.forEach(voca => UI.addVocaToList(voca));
  }
  static addVocaToList(voca) {
    const list = document.querySelector(".app__voca-list");
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${voca.word}</td>
    <td>${voca.definition}</td>
    <td><a href="#" class="delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteVoca(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const app = document.querySelector(".app");
    const form = document.querySelector(".app__form");
    app.insertBefore(div, form);
    //Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector(".app__word").value = "";
    document.querySelector(".app__def").value = "";
  }
}

//Store Class: Handles Storage
class Store {
  static getVocas() {
    let vocas;
    if (localStorage.getItem("vocas") === null) {
      vocas = [];
    } else {
      vocas = JSON.parse(localStorage.getItem("vocas"));
    }

    return vocas;
  }

  static addVoca(voca) {
    const vocas = Store.getVocas();

    vocas.push(voca);

    localStorage.setItem("vocas", JSON.stringify(vocas));
  }

  static removeVoca(word) {
    const vocas = Store.getVocas();

    vocas.forEach((voca, index) => {
      if (voca.word === word) {
        vocas.splice(index, 1);
      }
    });

    localStorage.setItem("vocas", JSON.stringify(vocas));
  }
}

// Event: Display
document.addEventListener("DOMContentLoaded", UI.displayVocas);

//Event: Add
document.querySelector(".app__form").addEventListener("submit", e => {
  //Prevent actual submit
  e.preventDefault();

  //Get form values
  const word = document.querySelector(".app__word").value;
  const definition = document.querySelector(".app__def").value;

  //Validate
  if (word === "" || definition === "") {
    UI.showAlert("Please fill in all the fields");
  } else {
    //Instatiate
    const voca = new Voca(word, definition);
    console.log(voca);

    //Add to ui
    UI.addVocaToList(voca);

    //Add to store
    Store.addVoca(voca);

    //Show success message
    UI.showAlert("Book Added", "success");

    //Clear fields
    UI.clearFields();
  }
});

//Event: Remove
document.querySelector(".app__voca-list").addEventListener("click", e => {
  //Remove from UI
  UI.deleteVoca(e.target);

  //Remove from store
  Store.removeVoca(
    e.target.parentElement.previousElementSibling.previousElementSibling
      .textContent
  );

  //Show success message
  UI.showAlert("Book Removed", "success");
});
