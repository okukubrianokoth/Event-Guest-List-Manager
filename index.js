let count = 1;
let editRow = null;

const form = document.getElementById('userForm');
const table = document.querySelector('#userTable tbody');

function saveToLocalStorage() {
    const rows = [...table.querySelectorAll('tr')].map(row => {
        const cells = row.querySelectorAll('td');
        return {
            name: cells[1].textContent,
            email: cells[2].textContent,
            phone: cells[3].textContent,
            place: cells[4].textContent,
            category: cells[5].textContent,
            rsvp: cells[6].textContent === 'Confirmed',
            time: cells[7].textContent
        };
    });
    localStorage.setItem('guestList', JSON.stringify(rows));
}

function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('guestList')) || [];
    data.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${count}</td>
            <td>${entry.name}</td>
            <td>${entry.email}</td>
            <td>${entry.phone}</td>
            <td>${entry.place}</td>
            <td>${entry.category}</td>
            <td><button class="rsvp-btn"${entry.rsvp ? ' disabled style="background-color:green;color:white;"' : ''}>${entry.rsvp ? 'Confirmed' : 'RSVP'}</button></td>
            <td>${entry.time}</td>
            <td>
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
            </td>
        `;
        table.appendChild(row);
        count++;
        form.reset();
    });
}

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const rows = document.querySelectorAll('#userTable tbody tr');
    if (rows.length >= 10) {
        alert("User list cannot exceed 10 entries.");
        return;
    }


    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const place = document.getElementById('place').value;
    const category = document.getElementById('user-category').value;
    const timestamp = new Date().toLocaleString();

    if (editRow) {
        editRow.cells[1].textContent = name;
        editRow.cells[2].textContent = email;
        editRow.cells[3].textContent = phone;
        editRow.cells[4].textContent = place;
        editRow.cells[5].textContent = category;
        editRow = null;
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${count}</td>
            <td>${name}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${place}</td>
            <td>${category}</td>
            <td><button class="rsvp-btn">RSVP</button></td>
            <td>${timestamp}</td>
            <td>
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
            </td>
        `;
        table.appendChild(row);
        count++;
    }

    saveToLocalStorage();
    form.reset();
});

table.addEventListener('click', function (e) {
    const target = e.target;
    const row = target.closest('tr');

    if (target.classList.contains('delete-button')) {
        row.remove();
        saveToLocalStorage();
    }

    if (target.classList.contains('edit-button')) {
        document.getElementById('name').value = row.cells[1].textContent;
        document.getElementById('email').value = row.cells[2].textContent;
        document.getElementById('phone').value = row.cells[3].textContent;
        document.getElementById('place').value = row.cells[4].textContent;
        document.getElementById('user-category').value = row.cells[5].textContent;
        editRow = row;
    }

    if (target.classList.contains('rsvp-btn')) {
        target.textContent = 'Confirmed';
        target.disabled = true;
        target.style.backgroundColor = 'green';
        target.style.color = 'white';
        saveToLocalStorage();
    }
});

window.addEventListener('DOMContentLoaded', loadFromLocalStorage);
