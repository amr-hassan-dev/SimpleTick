// TODO: Fix the local storage issue where tasks are not being saved correctly (Logical Error)
// Main JavaScript file for the To-Do List application
const addTaskButton = document.querySelector("#add-task-button");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const dueDateInput = document.querySelector("#due-date-input");
const prioritySelect = document.querySelector("#priority-select");
const totalTasksText = document.querySelector("#total-tasks");
const completedTasksText = document.querySelector("#completed-tasks");
let completedCount = 0;
let totalCount = 0;

let retTasks= JSON.parse(window.localStorage.getItem(`tasks`));
let tasks = [];

function priority(selectedPriority){
    const priorityParagraph = document.createElement("p");
    priorityParagraph.classList.add("task-priority");
    priorityParagraph.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;

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

function addTask(taskText,dueDate, taskPriority, checked = false){
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
    tasks.push(taskData);
    window.localStorage.setItem(`tasks`, JSON.stringify(tasks));


    // Reset and clear the input fields
    taskInput.value = "";
    dueDateInput.value = "";
    prioritySelect.selectedIndex = 0; // Reset to default option

    // Count The Total Tasks
    totalCount++;
    totalTasksText.textContent = totalCount;

    if (checked){
        completedCount++;
        completedTasksText.textContent = completedCount;
    }
}

// Load tasks from local storage on page load
if(retTasks && retTasks.length > 0) {
    retTasks.forEach(task => {
        addTask(task.text, task.dueDate, task.priority, task.completed);
    });
}

// Check The Task If Ended
taskList.addEventListener("click", function (event) {
    const clicked = event.target.closest(`input[type='checkbox'], button, span`);
    if (!clicked) return; // If the clicked element is not a checkbox or button, exit the function
    if (clicked.matches(".task-checkbox")){
        const checkedTask = clicked.parentElement.querySelector(".task-text");
        checkedTask.classList.toggle("checked");
        if (clicked.checked){
            completedCount++;
            completedTasksText.textContent = completedCount
            // Update the task in local storage
            retTasks.forEach((task) =>{
                if (task.text === checkedTask.textContent) {
                    task.completed = true;
                    window.localStorage.clear();
                    window.localStorage.setItem(`tasks`, JSON.stringify(retTasks));
                } else if (tasks.length > 0){ // If exists in tasks and doesn't exist in retTasks, update the completed status
                    tasks.forEach((task) => {
                        if (task.text === checkedTask.textContent) {
                            task.completed = true;
                            window.localStorage.clear();
                            window.localStorage.setItem(`tasks`, JSON.stringify(tasks));
                        }
                    });
                }
            });
        } 
        else {
            retTasks.forEach((task) =>{
                if (task.text === checkedTask.textContent) {
                    task.completed = false;
                    window.localStorage.clear();
                    window.localStorage.setItem(`tasks`, JSON.stringify(retTasks));
                    return;
                }
            });
            completedCount--;
            completedTasksText.textContent = completedCount;
        }
    }
    else if (clicked.matches(".delete-button")){
        const taskItem = clicked.parentElement;
        taskList.removeChild(taskItem);
        // Remove the task from Local Storage
        for (let i = 0; i < retTasks.length; i++) {
            if(retTasks[i].text === taskItem.querySelector(".task-text").textContent) {
                retTasks.splice(i, 1);
                window.localStorage.clear();
                window.localStorage.setItem(`tasks`, JSON.stringify(retTasks));
            }
        } 
        // Update the total tasks count
        totalCount--;
        totalTasksText.textContent = totalCount;
        // Update the completed tasks count if the task was completed
        if (taskItem.querySelector(".task-checkbox").checked) {
            completedCount--;
            completedTasksText.textContent = completedCount;
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
        retTasks.forEach((task) => {
            if (task.text === taskText.textContent) {
                task.text = editedTaskText;
                window.localStorage.clear();
                window.localStorage.setItem(`tasks`, JSON.stringify(retTasks));
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

// Adding Task Event Listeners
addTaskButton.addEventListener("click", function(event){
    event.preventDefault(); // Prevent form submission
    if (prioritySelect.selectedIndex === 0) return; // If no priority is selected, exit the function
    addTask(taskInput.value, dueDateInput.value, prioritySelect.value);
});

// Adding Task On Enter Key Press
taskInput.addEventListener("keyup", function(event){
    if (event.keyCode == 13){
        if (prioritySelect.selectedIndex === 0) return; // If no priority is selected, exit the function
        addTask(taskInput.value, dueDateInput.value, prioritySelect.value);
    }
});