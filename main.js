const addTaskButton = document.querySelector("#add-task-button");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const dueDateInput = document.querySelector("#due-date-input");
const prioritySelect = document.querySelector("#priority-select");
const tasksArray = [];

function priority(){
    const selectedPriority = prioritySelect.value;
    const priorityParagraph = document.createElement("p");
    priorityParagraph.classList.add("task-priority");
    priorityParagraph.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    if (prioritySelect.selectedIndex === 0) {
        alert("Please select a priority.");
        return;
    }
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

function enterTask(){
    const taskText = taskInput.value.trim();
    if (taskText === "") return; // If the input is empty, exit the function

    const priorityElement = priority();
    if (!priorityElement) return; // If priority is not selected, exit the function

    // Create a new task item
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    taskItem.innerHTML = `
                        <input type="checkbox" class="task-checkbox">
                        <span class = "task-text">${taskText}</span>
                        ${priorityElement.outerHTML}
                        <span class="task-due-date">${dueDateInput.value}</span>
                        <button class="delete-button" title = "Delete"><i class="fa-solid fa-trash"></i></button>
                        <button class="edit-button" title = "Edit"><i class="fa-solid fa-pen"></i></button>`;
    taskList.appendChild(taskItem);
    
    // Reset and clear the input fields
    taskInput.value = "";
    prioritySelect.selectedIndex = 0;
    dueDateInput.value = ""; 
}

// Check The Task If Ended
taskList.addEventListener("click", function (event) {
    const clicked = event.target.closest("input[type='checkbox'], button");
    if (clicked.matches(".task-checkbox")){
        const checkedTask = clicked.parentElement.querySelector(".task-text");
        checkedTask.classList.toggle("checked");
    }
    else if (clicked.matches(".delete-button")){
        const taskItem = clicked.parentElement;
        taskList.removeChild(taskItem);
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
        editedTaskItem.removeChild(taskText);
        editedTaskItem.removeChild(clicked);
        editedTaskItem.removeChild(checkBox);
        // Adding A New Button For Saving Changes
        const saveButton = document.createElement("button");
        saveButton.classList.add("save-button")
        saveButton.innerHTML = "<i class=\"fa-solid fa-floppy-disk\"></i>";
        editedTaskItem.appendChild(saveButton);
    }
    else if (clicked.matches(".save-button")){
        const editedTaskItem = clicked.parentElement;
        const newTaskInput = editedTaskItem.querySelector("input[type='text']");
        const editedTaskText = newTaskInput.value.trim();
        if (editedTaskText === "") {
            alert("Please enter a task.");
            return;
        }
        else{
            const checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.classList.add("task-checkbox");
            editedTaskItem.insertAdjacentElement("afterbegin", checkBox);
            const taskText = document.createElement("span");
            newTaskInput.value = ""; // Clear the input field
            taskText.classList.add("task-text");
            taskText.textContent = editedTaskText;
            checkBox.insertAdjacentElement("afterend",taskText);
            const editButton = document.createElement("button");
            editButton.classList.add("edit-button");
            editButton.title = "Edit";
            editButton.innerHTML = "<i class=\"fa-solid fa-pen\"></i>";
            editedTaskItem.appendChild(editButton);
            editedTaskItem.removeChild(newTaskInput);
            editedTaskItem.removeChild(clicked);
        }
    }
});


// Adding Task Event Listeners
addTaskButton.addEventListener("click", function(event){
    event.preventDefault(); // Prevent form submission
    enterTask();
});

taskInput.addEventListener("keyup", function(event){
    if (event.keyCode == 13){
        enterTask();
    }
});