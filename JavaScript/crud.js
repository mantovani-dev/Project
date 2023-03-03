/* Developed by: MantoDev*/

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_student')) ?? []
const setLocalStorage = (dbStudent) => localStorage.setItem("db_student", JSON.stringify(dbStudent))

/* CRUD */

// Create
const createStudent = (student) => {
    const dbStudent = getLocalStorage()
    dbStudent.push(student)
    setLocalStorage(dbStudent)
}

// Read
const readStudent = () => getLocalStorage()

// Update
const updateStudent = (index, student) => {
    const dbStudent = readStudent()
    dbStudent[index] = student
    setLocalStorage(dbStudent)
}

// Delete
const deleteStudent = (index) => {
    const dbStudent = readStudent()
    dbStudent.splice(index, 1)
    setLocalStorage(dbStudent)
}


/* Interação com o layout */

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent = 'Novo Aluno'
}

const saveStudent = () => {
    if (isValidFields()) {
        const student = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            matricula: document.getElementById('matricula').value,
            escola: document.getElementById('escola').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createStudent(student)
            updateTable()
            closeModal()
        } else {
            updateStudent(index, student)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (student, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${student.nome}</td>
        <td>${student.email}</td>
        <td>${student.matricula}</td>
        <td>${student.escola}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableStudent>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableStudent>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbStudent = readStudent()
    clearTable()
    dbStudent.forEach(createRow)
}

const fillFields = (student) => {
    document.getElementById('nome').value = student.nome
    document.getElementById('email').value = student.email
    document.getElementById('matricula').value = student.matricula
    document.getElementById('escola').value = student.escola
    document.getElementById('nome').dataset.index = student.index
}

const editStudent = (index) => {
    const student = readStudent()[index]
    student.index = index
    fillFields(student)
    document.querySelector(".modal-header>h2").textContent = `Editando ${student.nome}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editStudent(index)
        } else {
            const student = readStudent()[index]
            const response = confirm(`Deseja realmente excluir o aluno ${student.nome}?`)
            if (response) {
                deleteStudent(index)
                updateTable()
            }
        }
    }
}

updateTable()

/* Events */
document.getElementById('cadastrarAluno')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveStudent)

document.querySelector('#tableStudent>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)
