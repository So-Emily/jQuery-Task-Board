// Retrieve tasks and nextId from localStorage
// If tasks or nextId do not exist in localStorage, initialize them
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const id = nextId;
    nextId++;
    localStorage.setItem("nextId", nextId);
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskId = generateTaskId();
    const taskCard = `
        <div class="task-card" id="task-${taskId}">
            <div class="task-content">${task}</div>
            <button class="delete-button" onclick="handleDeleteTask(event)">Delete</button>
        </div>
    `;

    // Append the task card to the corresponding container based on the task status
    if (task.status === "todo") {
        document.getElementById("todo-cards").innerHTML += taskCard;
    } else if (task.status === "in-progress") {
        document.getElementById("in-progress-cards").innerHTML += taskCard;
    } else if (task.status === "done") {
        document.getElementById("done-cards").innerHTML += taskCard;
    }
    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const taskListContainer = document.getElementById("task-list");
    taskListContainer.innerHTML = "";
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        taskListContainer.innerHTML += taskCard;
    });

    // Make task cards draggable using jQuery UI
    $(".task-card").draggable();
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const taskInput = document.getElementById("task-input");
    const newTask = taskInput.value.trim();
    if (newTask !== "") {
        const task = {
            status: "todo",
            task: newTask
        };
        taskList.push(task);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
        taskInput.value = "";
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = event.target.parentNode.id;
    const taskIndex = taskList.findIndex(task => task === taskId);
    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr("id");
    const newStatus = event.target.id;
    // Update the status of the task in taskList and localStorage
    // ...
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    const addTaskForm = document.getElementById("add-task-form");
    addTaskForm.addEventListener("submit", handleAddTask);

    $(".status-lane").droppable({
        drop: handleDrop
    });

    $("#due-date").datepicker();
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}
