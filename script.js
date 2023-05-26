const inputs = document.querySelectorAll("input");
const inputsp = document.querySelectorAll("p");
const editMainBtn = document.querySelector(".buttons").children[0];
const addBtn = document.querySelector(".buttons").children[1];
const cancelBtn = document.querySelector(".buttons").children[2];
const tBody = document.querySelector("tbody");

let id = 0;

async function getAllData() {
  let response = await fetch("https://northwind.vercel.app/api/suppliers/");
  let datas = await response.json();
  datas.forEach((data) => {
    const newTr = document.createElement("tr");
    newTr.innerHTML = `<td>${data.id}</td><td>${data.companyName}</td><td>${data.contactName}</td><td>${data.contactTitle}</td>`;
    const newTd = document.createElement("td");
    newTd.innerHTML = `<button class = "editButton">Edit</button><button class = "deleteButton">Delete</button>`;
    newTr.append(newTd);

    const deleteBtn = newTr.querySelector(".deleteButton");
    const editBtn = newTr.querySelector(".editButton");
    deleteBtn.addEventListener("click", () => {
      fetch(`https://northwind.vercel.app/api/suppliers/${data.id}`, {
        method: "DELETE",
      }).then((res) => {
        if (res.status === 200) {
          newTr.remove();
        }
      });
    });
    editBtn.addEventListener("click", () => {
      addBtn.disabled = true;
      editMainBtn.disabled = false;
      cancelBtn.disabled = false;
      inputs[0].value = data.companyName;
      inputs[1].value = data.contactName;
      inputs[2].value = data.contactTitle;
      id = data.id;
    });

    tBody.append(newTr);
  });
}
getAllData();
cancelBtn.addEventListener("click", () => {
  addBtn.disabled = false;
  editMainBtn.disabled = true;
  cancelBtn.disabled = true;
  inputs[0].value = "";
  inputs[1].value = "";
  inputs[2].value = "";
});
editMainBtn.addEventListener("click", () => {
  fetch(`https://northwind.vercel.app/api/suppliers/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      companyName: inputs[0].value,
      contactName: inputs[1].value,
      contactTitle: inputs[2].value,
    }),
  });
  addBtn.disabled = false;
  editMainBtn.disabled = true;
  cancelBtn.disabled = false;
  const allTr = document.querySelectorAll("tbody tr");
  allTr.forEach((tr) => {
    if (id == tr.children[0].textContent) {
      tr.children[1].textContent = inputs[0].value;
      tr.children[2].textContent = inputs[1].value;
      tr.children[3].textContent = inputs[2].value;
    }
  });
  inputs[0].value = "";
  inputs[1].value = "";
  inputs[2].value = "";
});
addBtn.addEventListener("click", () => {
  let count = 0;
  for (let i = 0; i < 3; i++) {
    if (inputsp[i].textContent != "") {
      count++;
    }
  }
  if (!checkInputs()) {
    return;
  }
  if (count != 0) {
    return;
  }
  addSup(
    inputs[0].value.trim(),
    inputs[1].value.trim(),
    inputs[2].value.trim()
  );
  inputs[0].value = "";
  inputs[1].value = "";
  inputs[2].value = "";
});
let events = ["keyup", "focus", "blur"];
events.forEach((event) => {
  for (let i = 0; i < 3; i++) {
    inputs[i].addEventListener(event, () => {
      cleanInputs();
      if (event == "blur") {
        for (let i = 0; i < 3; i++) {
          inputsp[i].textContent = "";
          return;
        }
      }
      for (let i = 0; i < 3; i++) {
        if (inputs[i].value.trim() == "") {
          inputsp[i].textContent = "Please fill the gap";
        }
      }
    });
  }
});

function cleanInputs() {
  for (let i = 0; i < 3; i++) {
    inputsp[i].textContent = "";
  }
}
async function addSup(companyName, contactName, contactTitle) {
  fetch("https://northwind.vercel.app/api/suppliers/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      companyName: companyName,
      contactTitle: contactTitle,
      contactName: contactName,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const newTr = document.createElement("tr");
      newTr.innerHTML = `<td>${data.id}</td><td>${data.companyName}</td><td>${data.contactName}</td><td>${data.contactTitle}</td>`;
      const newTd = document.createElement("td");
      newTd.innerHTML = `<button class = "editButton">Edit</button><button class = "deleteButton">Delete</button>`;
      newTr.append(newTd);
      tBody.append(newTr);
      const deleteBtn = newTr.querySelector(".deleteButton");
      const editBtn = newTr.querySelector(".editButton");
      deleteBtn.addEventListener("click", () => {
        fetch(`https://northwind.vercel.app/api/suppliers/${data.id}`, {
          method: "DELETE",
        }).then((res) => {
          if (res.status === 200) {
            newTr.remove();
          }
        });
      });
      editBtn.addEventListener("click", () => {
        addBtn.disabled = true;
        editMainBtn.disabled = false;
        cancelBtn.disabled = false;
        inputs[0].value = data.companyName;
        inputs[1].value = data.contactName;
        inputs[2].value = data.contactTitle;
        id = data.id;
      });
    });
}
function checkInputs() {
  for (let i = 0; i < 3; i++) {
    if (inputs[i].value == "") return false;
  }
  return true;
}
