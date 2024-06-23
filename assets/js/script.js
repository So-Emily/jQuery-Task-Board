// Retrieve tasks and nextId from localStorage
// If tasks or nextId do not exist in localStorage, initialize them
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

if (!taskList) {
    taskList = [];
    localStorage.setItem("tasks", JSON.stringify(taskList));
}

if (!nextId) {
    nextId = 1;
    localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const id = nextId;
    nextId++;
    localStorage.setItem("nextId", nextId);
    return id;
}

// Example: Saving tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Example: Loading tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        tasks.forEach(task => {
        // Add each task to the DOM
        addTaskToDOM(task);
        });
    }
}

// Call loadTasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

  // Example function to add a task to the DOM
function addTaskToDOM(task) {
    // Implementation depends on your HTML structure
    const taskContainer = document.querySelector('#todo-cards'); // Example container
    const taskElement = document.createElement('div');
    taskElement.textContent = task.task; // Assuming task has a content property
    taskContainer.appendChild(taskElement);
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskId = generateTaskId();
    const taskCard = `
        <div class="task-card" id="task-${taskId}">
            <div class="task-content">${task}</div>
            <button class="delete-button" onclick="handleDeleteTask(event)">Delete</button>
        </div>`;

    // Append the task card to the corresponding container based on the task status
    if (task.status === "todo") {
        document.getElementById("todo-cards").innerHTML += taskCard;
    } else if (task.status === "in-progress") {
        document.getElementById("in-progress-cards").innerHTML += taskCard;
    } else if (task.status === "done") {
        document.getElementById("done-cards").innerHTML += taskCard;
    }
    return taskCard;
    return `<div class="task-card" id="task-${task.id}">${task.task}</div>`;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    const taskListContainer = document.getElementById("task-list-container");

    if (!taskListContainer) {
        console.error("Task list container not found");
        return; // Exit the function if taskListContainer is null
    }

    let allTasksHTML = ""; // Initialize an empty string to hold all tasks' HTML
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        addTaskToDOM(task);
        allTasksHTML += taskCard; // Concatenate the taskCard HTML string
    });

    taskListContainer.innerHTML = allTasksHTML; // Update the innerHTML once after building the string

    // Make task cards draggable using jQuery UI
    $(".task-card").draggable();
    
}

// Call renderTaskList or other initialization functions here
document.addEventListener('DOMContentLoaded', (event) => {
    renderTaskList();
});

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    // Get the task input element
    const taskInput = $("#task-name");
    // Check if taskInput is not null or undefined
    if (!taskInput) {
        console.error("Task input element not found");
        return; // Exit the function if taskInput is null or undefined
    }
    const newTask = taskInput.val().trim();
    // Ensure newTask is a string and not empty
    if (typeof newTask === "string" && newTask !== "") {
        // Initialize taskList from localStorage or as an empty array if not found
        let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
        const task = {
            id: Date.now(), // Use the current timestamp as the task id
            status: "todo",
            task: newTask
        };
        taskList.push(task);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        // Optionally, call a function to update the UI with the new task
    } else {
        console.error("Invalid task input");
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    // Get the task id from the parent element of the delete button
    const taskId = $(event.target).parent().attr("id").split('-')[1];
    // Find the index of the task with the taskId in taskList
    const taskIndex = taskList.findIndex(task => task.id.toString() === taskId);
    // Remove the task from taskList if found
    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr("id").split('-')[1];
    const newStatus = $(event.target).attr("id");
    // Update the status of the task in taskList and localStorage
    taskList.forEach(task => {
        if (task.id === taskId) {
            task.status = newStatus;
        }
    });

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();


}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    const addTaskForm = document.getElementById("task-form");
    addTaskForm.addEventListener("submit", handleAddTask);

    $(".status-lane").droppable({
        drop: handleDrop
    });

    $("#task-due-date").datepicker();
});
