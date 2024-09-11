document.addEventListener("DOMContentLoaded", function () {
  const studentForm = document.getElementById("student-form");
  const studentTBody = document.querySelector("#student-table tbody");
  const messageDisplay = document.getElementById("message");

  const validateID = (studentId) => {
    return /^[0-9]+$/.test(studentId);
  };
  const validateName = (name) => {
    return /^[A-Za-z\s]+$/.test(name);
  };

  

  // Email validation function
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // Contact number validation function (10 digits)
  const validateContact = (contact) => {
    return contact.length === 10 && /^\d+$/.test(contact);
  };

  // Load existing students from local storage
  let students = JSON.parse(localStorage.getItem("students")) || [];

  function saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
  }

  function displayStudents() {
    studentTBody.innerHTML = "";
    students.forEach((student, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${student.studentId}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>${student.studentClass}</td>
                <td>${student.address}</td>
                <td class="actions">
                    <button class="edit" onclick="editStudent(${index})">Edit</button>
                    <button class="delete" onclick="deleteStudent(${index})">Delete</button>
                </td>
            `;
      studentTBody.appendChild(row);
    });
  }

  function showMessage(type, text) {
    messageDisplay.className = type;
    messageDisplay.textContent = text;
    messageDisplay.style.display = "block";
    setTimeout(() => {
      messageDisplay.style.display = "none";
    }, 3000);
  }

  window.editStudent = function (index) {
    const student = students[index];
    document.getElementById("student-id").value = student.studentId;
    document.getElementById("name").value = student.name;
    document.getElementById("email").value = student.email;
    document.getElementById("contact").value = student.contact;
    document.getElementById("student-class").value = student.studentClass;
    document.getElementById("address").value = student.address;

    students.splice(index, 1);
    saveToLocalStorage();
    displayStudents();
    showMessage("success", `Student ${student.name} is ready for update.`);
  };

  window.deleteStudent = function (index) {
    const student = students[index];
    students.splice(index, 1);
    saveToLocalStorage();
    displayStudents();
    showMessage("error", `Student ${student.name} has been deleted.`);
  };

  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const studentId = document.getElementById("student-id").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const studentClass = document.getElementById("student-class").value;
    const address = document.getElementById("address").value.trim();

    if (
      studentId === "" ||
      name === "" ||
      email === "" ||
      contact === "" ||
      studentClass === "" ||
      address === ""
    ) {
      showMessage("error", "Please fill in all fields");
      return;
    }

    if (!validateID(studentId)) {
      showMessage("error", "Invalid student ID. Only numbers are allowed.");
      return;
    }

    if (!validateName(name)) {
      showMessage("error", "Invalid student name. Only letters are allowed.");
      return;
    }

    if (!validateEmail(email)) {
      showMessage("error", "Please enter a valid email address");
      return;
    }

    if (!validateContact(contact)) {
      showMessage("error", "Please enter a valid 10-digit contact number");
      return;
    }

    students.push({ studentId, name, email, contact, studentClass, address });
    saveToLocalStorage();
    displayStudents();

    studentForm.reset();
    showMessage("success", `Student ${name} has been registered successfully.`);
  });

  displayStudents();
});
