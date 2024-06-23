// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = `
        <div class="card mb-3" id="task-${task.id}">
            <div class="card-body">
                <h5 class="card-title">${task.name}</h5>
                <p class="card-text">${task.description}</p>
                <p class="card-text">${task.dueDate}</p>
                <button class="btn btn-danger delete-task" data-task-id="${task.id}">Delete</button>
            </div>
        </div>`;
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#todo-cards").empty();
    $("#in-progress-cards").empty();
    $("#done-cards").empty();

    taskList.forEach((task) => {
        const card = createTaskCard(task);
        if (task.status === "todo") {
            $("#todo-cards").append(card);
        } else if (task.status === "in-progress") {
            $("#in-progress-cards").append(card);
        } else if (task.status === "done") {
            $("#done-cards").append(card);
        }
    });

    $(".card").draggable({
    // Ensures the card can only be dropped in a droppable area
    revert: "invalid",
    cursor: "move",
    helper: "clone",
    // Makes the card slightly transparent to differentiate from the original
    opacity: 0.7,
    // Ensures the card is returned to its original position if not dropped in a droppable area
    zIndex: 100
});

$(".lane").droppable({
    accept: ".card",
    drop: handleDrop,
    over: function(event, ui) {
        // highlight the lane when a card is dragged over it
        $(this).addClass('lane-highlight');
    },
    out: function(event, ui) {
        // remove the highlight when a card is dragged out
        $(this).removeClass('lane-highlight');
    }
});

    $(".delete-task").click(handleDeleteTask);
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const taskName = $("#task-name").val();
    const taskDescription = $("#task-description").val();
    const taskDueDate = $("#task-due-date").val();

    const newTask = {
        id: generateTaskId(),
        name: taskName,
        description: taskDescription,
        dueDate: taskDueDate,
        status: "todo",
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);

    renderTaskList();

    $("#formModal").modal("hide");
    $("#task-form")[0].reset();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(this).data("task-id");
    taskList = taskList.filter((task) => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr("id").replace("task-", "");
    const newStatus = $(this).attr("id");

    const taskIndex = taskList.findIndex((task) => task.id == taskId);
    if (taskIndex !== -1) {
        taskList[taskIndex].status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }

    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $("#task-form").submit(handleAddTask);

    $(".lane").droppable({
        accept: ".card",
        drop: handleDrop,
    });

    // $("#task-due-date").datepicker();
});
