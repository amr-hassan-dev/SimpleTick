// Main JavaScript file for the To-Do List application
const addTaskButton = document.querySelector("#add-task-button");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const dueDateInput = document.querySelector("#due-date-input");
const prioritySelect = document.querySelector("#priority-select");
const totalTasksText = document.querySelector("#total-tasks");
const completedTasksText = document.querySelector("#completed-tasks");
const searchInput = document.querySelector("#search-input");
const clearSearchBtn = document.querySelector("#clear-button");
const filterSelect = document.querySelector("#filter-select");
const sortSelect = document.querySelector("#sort-select");
let completedCount = 0;
let totalCount = 0;

let tasks = JSON.parse(window.localStorage.getItem(`tasks`)) || [];

function updateLocalStorage(){
    window.localStorage.setItem(`tasks`, JSON.stringify(tasks));
}

function updateCounts() {
    totalTasksText.textContent = totalCount;
    completedTasksText.textContent = completedCount;
}


function priority(selectedPriority){
    const priorityParagraph = document.createElement("p");
    priorityParagraph.classList.add("task-priority");
    priorityParagraph.innerHTML = `<i class="fa-solid fa-flag"></i>`;
    
    if (!selectedPriority) return;
    
    else if (selectedPriority === "High") {
        priorityParagraph.style.color = "red";
    }
    
    else if (selectedPriority === "Medium") {
        priorityParagraph.style.color = "orange";
    }
    
    else if (selectedPriority === "Low") {
        priorityParagraph.style.color = "green";
    }
    
    return priorityParagraph;
}

function addTask(taskText, dueDate, taskPriority, checked = false){
    taskText = taskText.trim();
    const priorityElement = priority(taskPriority);
    if (!taskText) return; // If the input is empty, exit the function
    if (!dueDate) dueDate = "No Due Date"; // If no due date is provided, set a default value
    if (!taskPriority) return; // If priority is not selected, exit the function
    
    // Create a new task item
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    taskItem.innerHTML = `
    <input type="checkbox" class="task-checkbox" ${checked ? "checked" : ""}>
    <span class = "task-text ${checked ? "checked" : ""}">${taskText}</span>
    ${priorityElement.outerHTML}
    <span class="task-due-date">${dueDate}</span>
    <button class="delete-button" title = "Delete"><i class="fa-solid fa-trash"></i></button>
    <button class="edit-button" title = "Edit"><i class="fa-solid fa-pen"></i></button>`;
    taskList.appendChild(taskItem);
    
    // Adding to the Local Storage
    const taskData = {
        text: taskText,
        dueDate: dueDate,
        priority: taskPriority,
        completed: checked
    };
    
    
    // Reset and clear the input fields
    taskInput.value = "";
    dueDateInput.value = "";
    prioritySelect.selectedIndex = 0; // Reset to default option
    
    // Count The Total Tasks
    totalCount++;
    updateCounts();
    
    if (checked){
        completedCount++;
        updateCounts();
    }
    
    return taskData;
}

function renderTasks(taskArray){
    taskList.innerHTML = "";
    totalCount = 0;
    completedCount = 0;
    updateCounts();
    taskArray.forEach(task => addTask(task.text, task.dueDate, task.priority, task.completed));
}

function eventListenerForTask(){
    if (prioritySelect.selectedIndex === 0){
        prioritySelect.classList.add("error");
        prioritySelect.addEventListener("change", function(){
            prioritySelect.classList.remove("error");
        });
        return;
    } else if (taskInput.value === ""){
        taskInput.classList.add("error");
        taskInput.addEventListener("input", function(){
            taskInput.classList.remove("error");
        });
        return;
    }
    taskInput.focus(); // Keep focus on the input field after adding a task
    const taskData = addTask(taskInput.value, dueDateInput.value, prioritySelect.value);
    tasks.push(taskData);
    updateLocalStorage();
}

// Load tasks from local storage on page load
if(tasks && tasks.length > 0) {
    tasks.forEach(task => {
        addTask(task.text, task.dueDate, task.priority, task.completed);
    });
}

// Check The Task If Ended
taskList.addEventListener("click", function (event) {
    const clicked = event.target.closest(`input[type='checkbox'], button, span`);
    if (!clicked) return; // If the clicked element is not a checkbox or button or a span, exit the function
    if (clicked.matches(".task-checkbox")){
        const checkedTask = clicked.parentElement.querySelector(".task-text");
        checkedTask.classList.toggle("checked");
        if (clicked.checked){
            completedCount++;
            completedTasksText.textContent = completedCount
            // Update the task in local storage
            tasks.forEach((task) =>{
                if (task.text === checkedTask.textContent) {
                    task.completed = true;
                    updateLocalStorage();
                    return;
                }
            });
        } 
        else {
            tasks.forEach((task) =>{
                if (task.text === checkedTask.textContent) {
                    task.completed = false;
                    updateLocalStorage();
                    return;
                }
            });
            completedCount--;
            updateCounts();
        }
    }
    else if (clicked.matches(".delete-button")){
        const taskItem = clicked.parentElement;
        taskList.removeChild(taskItem);
        // Remove the task from Local Storage
        for (let i = 0; i < tasks.length; i++) {
            if(tasks[i].text === taskItem.querySelector(".task-text").textContent) {
                tasks.splice(i, 1);
                updateLocalStorage();
            }
        } 
        // Update the total tasks count
        totalCount--;
        updateCounts();
        // Update the completed tasks count if the task was completed
        if (taskItem.querySelector(".task-checkbox").checked) {
            completedCount--;
            updateCounts();
        }
    }
    else if (clicked.matches(".edit-button")){
        const editedTaskItem = clicked.parentElement;
        const checkBox = editedTaskItem.children[0];
        const taskText = editedTaskItem.children[1];
        // Adding A New Text Input For Editing & Removing Unnecessary Buttons
        const newTaskInput = document.createElement("input");
        newTaskInput.type = "text";
        newTaskInput.placeholder = "Edit task...";
        newTaskInput.value = taskText.textContent;
        editedTaskItem.insertAdjacentElement("afterbegin", newTaskInput);
        taskText.style.display ="none";
        clicked.style.display = "none";
        checkBox.style.display = "none";
        // Adding A New Button For Saving Changes
        const saveButton = document.createElement("button");
        saveButton.classList.add("save-button")
        saveButton.innerHTML = `<i class="fa-solid fa-floppy-disk"></i>`;
        editedTaskItem.appendChild(saveButton);
    }
    else if (clicked.matches(".save-button")){
        const editedTaskItem = clicked.parentElement;
        const newTaskInput = editedTaskItem.querySelector(`input[type="text"]`);
        const editedTaskText = newTaskInput.value.trim();
        const taskText = editedTaskItem.querySelector(".task-text");
        if (editedTaskText === "") return; // If the input is empty, exit the function
        // If the input is not empty, update the task text
        editedTaskItem.querySelector(`input[type='checkbox']`).style.display = "inline-block";
        newTaskInput.value = ""; // Clear the input field
        taskText.style.display = "inline-block";
        // Update the task in local storage
        tasks.forEach((task) => {
            if (task.text === taskText.textContent) {
                task.text = editedTaskText;
                updateLocalStorage();
            }
        });
        taskText.textContent = editedTaskText;
        editedTaskItem.querySelector(".edit-button").style.display = "block";
        editedTaskItem.removeChild(newTaskInput);
        editedTaskItem.removeChild(clicked);
    }
    else if (clicked.matches(".task-text")) {
        // If the task text is clicked, view more details
        clicked.classList.toggle("expanded");
    }
});

searchInput.addEventListener("input", function(){
    const taskTexts = document.querySelectorAll(".task-text");
    clearSearchBtn.classList.add('visible');
    const searchValue = searchInput.value.trim().toLowerCase();
    if (searchValue === ""){
        clearSearchBtn.classList.remove('visible');
    }
    taskTexts.forEach(taskText => {
        if (taskText.textContent.toLowerCase().includes(searchValue)){
            taskText.parentElement.style.display = "flex";
        } else {
            taskText.parentElement.style.display = "none";
        }
    });
});

clearSearchBtn.addEventListener("click", function(event){
    const taskTexts = document.querySelectorAll(".task-text");
    event.preventDefault();
    searchInput.value = "";
    clearSearchBtn.classList.remove("visible");
    taskTexts.forEach(taskText => {
        taskText.parentElement.style.display = "flex";
    })
});

// Adding Task Event Listeners
addTaskButton.addEventListener("click", function(event){
    event.preventDefault(); // Prevent form submission
    eventListenerForTask();
});

// Adding Task On Enter Key Press
taskInput.addEventListener("keyup", function(event){
    if (event.keyCode === "Enter"){
        eventListenerForTask();
    }
});

// Adding Filtering To The Tasks
filterSelect.addEventListener("input", function() {
    const filterValue = filterSelect.value;
    const taskItems = taskList.querySelectorAll(".task-item");
    taskItems.forEach(taskItem =>{
        const checkBoxValue = taskItem.querySelector(`input[type ="checkbox"]`).checked;
        if (filterValue === "all"){
            taskItem.style.display = "flex";
        }else if (filterValue === "checked" && checkBoxValue){
            taskItem.style.display = "flex";
        }else if (filterValue === "unchecked" && checkBoxValue === false){
            taskItem.style.display = "flex";
        }else if (filterValue === "low-priority" && taskItem.querySelector("p").style.color === "green"){
            taskItem.style.display = "flex";
        }else if (filterValue === "medium-priority" && taskItem.querySelector("p").style.color === "orange"){
            taskItem.style.display = "flex";
        }else if (filterValue === "high-priority" && taskItem.querySelector("p").style.color === "red"){
            taskItem.style.display = "flex";
        }else{
            taskItem.style.display = "none";
        }
    });
});


sortSelect.addEventListener("input", function(){
    updateCounts();
    if (sortSelect.value === "completion"){
        tasks.sort((a,b) => b.completed - a.completed);
        renderTasks(tasks);
    } else if (sortSelect.value === "alphabetical"){
        tasks.sort((a,b) => a.text.localeCompare(b.text));
        renderTasks(tasks);
    } else if (sortSelect.value === "due-date"){
        tasks.sort((a,b) => a.dueDate - b.dueDate);
        renderTasks(tasks);
    } else if (sortSelect.value === "uncompleted") {
        tasks.sort((a,b) => a.completed - b.completed);
        renderTasks(tasks);
    } else{
        renderTasks(tasks);
    }
});