import Todo from "./todoItem.js";
import Project from "./project.js"
import "./style.css";
import todoImage from "./assets/todo.svg";
import editImage from "./assets/edit.svg"

const addProjectButton = document.querySelector(".add-project-button");
const addProjectDialog = document.querySelector("dialog#add-project-dialog");
const addTodoDialog = document.querySelector("dialog#add-todo-dialog");
const addTodoForm = addTodoDialog.querySelector("form");

const addProjectDialogInput = addProjectDialog.querySelector("input");
const submitProjectButton = document.querySelector(".submit-project-button");
const submitTodoButton = document.querySelector(".submit-todo-button");
const saveTodoButton = document.querySelector(".save-todo-button");
const addTodoDialogTitle = document.querySelector("#title-input");
const addTodoDialogDesc = document.querySelector("#description-input");
const addTodoDialogPriority = document.querySelector("#priority-input");
const addTodoDialogDueDate = document.querySelector("#date-input");
const editTodoDialog = document.querySelector("#edit-todo-dialog");
const editTodoForm = editTodoDialog.querySelector("form");
const editTodoDialogTitle = editTodoDialog.querySelector("#title-input");
const editTodoDialogDesc = editTodoDialog.querySelector("#description-input");
const editTodoDialogPriority = editTodoDialog.querySelector("#priority-input");
const editTodoDialogDueDate = editTodoDialog.querySelector("#date-input");
const sidebarProjects = document.querySelector(".projects");
const mainContentDiv = document.querySelector("div#content"); 

function saveProjectToMemory(project){
    if(!localStorage.getItem("projects")){
        localStorage.setItem("projects", JSON.stringify([project]));
    }
    else{
        const projects = JSON.parse(localStorage.getItem("projects"));
        console.log(projects);
        projects.unshift(project);
        saveProjectsToMemory(projects);
    }
};

function saveProjectsToMemory(projects){
    for (const project of projects) {
            console.log(project.todos);
            project.todos.sort(function (todo1, todo2) {
                if(todo1.completed && !todo2.completed) return 1;
                else if(!todo1.completed && todo2.completed) return -1;
                else{
                    if(todo1.priority === todo2.priority) return 0;
                    else if(todo1.priority === "high") return -1;
                    else if(todo2.priority === "high") return 1;
                    else if(todo1.priority === "mid" && todo2.priority === "low") return -1;
                    else if(todo2.priority === "mid" && todo1.priority === "low") return 1;
                }
            })
            console.log(project.todos);
    }
    localStorage.setItem("projects", JSON.stringify(projects));
}

function getProjectsFromMemory(){
    return JSON.parse(localStorage.getItem("projects")) || [];
}

function updateSidebar(){
    sidebarProjects.innerHTML = "";
    const projects = getProjectsFromMemory();
    for (const project of projects) {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project");
        projectDiv.id = project.id; 
        const projectHeader = document.createElement("h1");
        console.log(project.name);
        projectHeader.textContent = project.name;
        projectDiv.append(projectHeader);
        for (const todo of project.todos) {
            const todoHeader = document.createElement("h2");
            todoHeader.classList.add("todo");
            todoHeader.innerText = todo.title;
            projectDiv.append(todoHeader);
        }
        sidebarProjects.append(projectDiv);
    }
}

function updateMain(projectId){
    mainContentDiv.innerHTML = "";
    const projectComponent = buildProject(getProjectsFromMemory().find((item) => item.id === projectId));
    mainContentDiv.append(projectComponent);
}

function buildProject(project){
    const projectHeader = document.createElement("div");
    const projectName = document.createElement("h1");
    projectName.innerText = project.name;
    const addTodoButton = document.createElement("button");
    addTodoButton.innerText = "Add todo";
    addTodoButton.setAttribute("data-project-id", project.id);
    addTodoButton.classList.add("addTodoButton");
    projectHeader.append(projectName, addTodoButton);
    const projectTodosDiv = document.createElement("div");
    for (const todo of project.todos) {
        const todoDiv = document.createElement("div");
        if(todo.completed)todoDiv.classList.add("completed-todo")
        const todoDivLeft = document.createElement("div");
        todoDivLeft.classList.add("left");
        const todoDivRight = document.createElement("div");
        todoDivLeft.classList.add("right");
        todoDiv.id = todo.id;
        const todoTitle = document.createElement("h2");
        todoTitle.innerText = todo.title;
        todoTitle.classList.add(`${todo.priority}-priority`);
        const todoCheck = document.createElement("input");
        todoCheck.setAttribute("type", "checkbox");
        todoCheck.setAttribute("data-todo-id", todo.id)
        todoCheck.setAttribute("data-project-id", project.id)
        todoCheck.checked = todo.completed;
        const deleteTodoButton = document.createElement("button");
        deleteTodoButton.classList.add("delete-todo-button");
        deleteTodoButton.setAttribute("data-project-id", project.id);
        deleteTodoButton.setAttribute("data-todo-id", todo.id);
        deleteTodoButton.innerText = "Delete"
        const editImageButton = document.createElement("img");
        editImageButton.src = editImage;
        editImageButton.setAttribute("data-todo-id", todo.id);
        editImageButton.setAttribute("data-project-id", project.id);
        editImageButton.classList.add("edit-todo-button");
        todoDivLeft.append(todoCheck,todoTitle);
        todoDivRight.append(deleteTodoButton, editImageButton);
        todoDiv.append(todoDivLeft, todoDivRight);
        projectTodosDiv.append(todoDiv);
    }
    const div = document.createElement("div");
    div.append(projectHeader, projectTodosDiv);
    return div;
}

function openAddProjectDialog(e){
    addProjectDialog.showModal();
}

function appendProject(e){
    const projectName = addProjectDialogInput.value;
    if(projectName.trim() !== ""){
        const project = new Project(projectName);
        saveProjectToMemory(project);
        updateSidebar();

        addProjectDialogInput.value = "";
        addProjectDialog.close()
    }
    e.preventDefault();
}

function addTodoToProject(projectId, todoTitle, todoDesc, todoPriority, todoDueDate){
    const projects = getProjectsFromMemory();
    const project = projects.find((item) => item.id === projectId);
    Object.setPrototypeOf(project, Project.prototype);
    project.addTodo(new Todo(todoTitle, todoDesc, todoPriority, todoDueDate));
    saveProjectsToMemory(projects);
}

function deleteTodoFromProject(e){
    const projects = getProjectsFromMemory();
    const project = projects.find((item) => item.id === e.target.getAttribute("data-project-id"));
    project.todos = project.todos.filter((item) => item.id !== e.target.getAttribute("data-todo-id"));
    saveProjectsToMemory(projects);
    updateSidebar();
    updateMain(e.target.getAttribute("data-project-id"));
}  

function openEditTodoDialog(e){
    const project = getProjectsFromMemory().find((item) => item.id === e.target.getAttribute("data-project-id"));
    const todo = project.todos.find((item) => item.id === e.target.getAttribute("data-todo-id"));
    editTodoDialog.showModal();
    editTodoDialogTitle.value = todo.title;
    editTodoDialogDesc.value = todo.description;
    editTodoDialogPriority.value = todo.priority;
    console.log(todo.value)
    editTodoDialogDueDate.value = todo.dueDate;
    saveTodoButton.setAttribute("data-todo-id", e.target.getAttribute("data-todo-id"));
    saveTodoButton.setAttribute("data-project-id", e.target.getAttribute("data-project-id"));
}

function editTodo(e){
    e.preventDefault();
    const projects = JSON.parse(localStorage.getItem("projects"));
    const project = projects.find((item) => item.id === e.target.getAttribute("data-project-id"));
    const todo = project.todos.find((item) => item.id === e.target.getAttribute("data-todo-id"));
    if(editTodoForm.checkValidity()){
        todo.title = editTodoDialogTitle.value;
        todo.description = editTodoDialogDesc.value;
        todo.priority = editTodoDialogPriority.value;
        todo.dueDate = editTodoDialogDueDate.value;
        saveProjectsToMemory(projects);
        editTodoDialogTitle.value = "";
        editTodoDialogDesc.value = "";
        editTodoDialogPriority.value = "";
        editTodoDialogDueDate.value = "";
        editTodoDialog.close();
        updateMain(e.target.getAttribute("data-project-id"));
        updateSidebar();
    }
    addTodoForm.reportValidity();
}

function handleCheckBox(e){
    const projects = JSON.parse(localStorage.getItem("projects"));
    let todo = undefined;
    console.log();
    for (const project of projects) {
        todo = project.todos.find((item) => item.id === e.target.getAttribute("data-todo-id"));
        
        if(todo !== undefined) break;
    }
    todo.completed = e.target.checked;
    saveProjectsToMemory(projects);
    updateMain(e.target.getAttribute("data-project-id"));
}

addProjectButton.addEventListener("click", openAddProjectDialog);
submitProjectButton.addEventListener("click", appendProject);
submitTodoButton.addEventListener("click", (e) => {
        e.preventDefault(); 
        if(addTodoForm.checkValidity()){
            addTodoToProject(submitTodoButton.getAttribute("data-project-id"), addTodoDialogTitle.value, addTodoDialogDesc.value, addTodoDialogPriority.value, addTodoDialogDueDate.value);
            addTodoDialogTitle.value = "";
            addTodoDialogDesc.value = "";
            addTodoDialogDueDate.value = "";
            addTodoDialog.close();
            updateMain(submitTodoButton.getAttribute("data-project-id"));
            updateSidebar();
        }
        addTodoForm.reportValidity();
});

saveTodoButton.addEventListener("click", editTodo);

sidebarProjects.addEventListener("click", (e) => {
    if(e.target.parentElement.classList.contains("project")){
        updateMain(e.target.parentElement.id);
    }
});
mainContentDiv.addEventListener("click", (e) => {
    if(e.target.classList.contains("addTodoButton")){
        submitTodoButton.setAttribute("data-project-id", e.target.getAttribute("data-project-id"));
        addTodoDialog.showModal();
    }
    if(e.target.classList.contains("delete-todo-button")) deleteTodoFromProject(e);
    if(e.target.classList.contains("edit-todo-button")) openEditTodoDialog(e);
    if(e.target.type === "checkbox") handleCheckBox(e);
});
document.addEventListener("DOMContentLoaded", updateSidebar);