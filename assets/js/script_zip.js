// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Initialization check for taskList and nextId
if (!taskList) {
    taskList = [];
}

if (!nextId) {
    nextId = 1;
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    if (!localStorage.getItem("tasks")) {
        localStorage.setItem("tasks", JSON.stringify([]));
    }
    if (!localStorage.getItem("nextId")) {
        localStorage.setItem("nextId", JSON.stringify(1));
    }
    taskList = JSON.parse(localStorage.getItem("tasks"));
    nextId = JSON.parse(localStorage.getItem("nextId"));
    // Render the task list
    renderTaskList();
    
    // Add a submit event listener to the form
    $("#task-form").submit(handleAddTask);

    // Make the lanes droppable
    $(".lane").droppable({
        // Accept only cards with the class card
        accept: ".card",
        // Add a drop event listener
        drop: handleDrop
    });

    // Make the due date field a date picker
    $("#due-date").datepicker();

    // Set the focus to the title input
    $("#title").focus();
});

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const id = nextId;
    // Increment nextId
    nextId++;
    // Save nextId to localStorage
    localStorage.setItem("nextId", JSON.stringify(nextId));
    // Return the unique id
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    // Create each card element
    const card = $("<div>").addClass("card").attr("id", task.id);
    const cardHeader = $("<div>").addClass("card-header").text(task.title);
    const cardBody = $("<div>").addClass("card-body");
    const cardFooter = $("<div>").addClass("card-footer");
    const deleteButton = $("<button>").addClass("btn btn-danger delete").text("Delete");
    const dueDate = $("<p>").text("Due Date: " + task.dueDate);

    // Append the card elements
    cardFooter.append(deleteButton, dueDate);
    card.append(cardHeader, cardBody, cardFooter);
    return card;
}

// Todo: create a function to render the task list and make cards draggable
// This function will be called when the page loads and when a task is added or deleted
function renderTaskList() {
    // Clear the task list
    // $("#todo").empty();
    // $("#in-progress").empty();
    // $("#done").empty();

    // Loop through the task list
    for (const task of taskList) {
        // Create a card for each task
        const card = createTaskCard(task);

        // Append the card to the correct lane
        if (task.status === "todo") {
            $("#todo").append(card);
        } else if (task.status === "in-progress") {
            $("#in-progress").append(card);
        }  else {
            $("#done").append(card);
        }

        // Make the card draggable
        card.draggable({
            // Set the helper to clone the card
            helper: "clone",

            // start and stop functions to add and remove the dragging class
            // This class will be used to style the card while dragging
            start: function(event, ui) {
                ui.helper.addClass("dragging");
            },
            stop: function(event, ui) {
                ui.helper.removeClass("dragging");
            }
        })
    
        // Add a click event listener to the delete button
        card.find(".delete").click(function() {
            // Call the handleDeleteTask function
            handleDeleteTask(task.id);
        });
    }
}

// Function to add a task
function addTask(taskDetails) {
    // Generate a unique ID for the new task
    const taskId = generateTaskId();
    // Create a new task object
    const newTask = {
        id: taskId,
        title: taskDetails.title,
        dueDate: taskDetails.dueDate,
        // Add other task details as needed
    };
    // Add the new task to the tasks array
    tasks.push(newTask);
    // Optionally, update the UI here to reflect the new task
    createTaskCard(newTask);
    // Persist tasks array if needed (e.g., save to localStorage)
}

// Example usage (this should be triggered by an event like form submission)
// addTask({ title: "New Task", dueDate: "2023-04-30" });

// Todo: create a function to handle adding a new task
// This function will be called when the form is submitted
function handleAddTask(event){
    // Prevent the default behavior
    event.preventDefault();

    // Get the task title, due date, and status from the form
    const title = $("#title").val().trim() || "";
    const dueDate = $("#due-date").val().trim() || "";
    const status = $("#status").val().trim() || "";

    console.log("Title:", $("#title").val());
    console.log("Due Date:", $("#due-date").val());
    console.log("Status:", $("#status").val());

    // If the title, due date, or status is empty, return early
    if (!title || !dueDate || !status) {
        return;
    }

    // Create a new task object with the title, due date, status, and a unique id
    const task = {
        id: generateTaskId(),
        title: title,
        dueDate: dueDate,
        status: status
    };
    
    console.log(task);
    
    // Add the task to the task list
    taskList.push(task);

    // Save the updated task list to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Render the updated task list
    renderTaskList();

    // Reset the form
    $("#title").val("");

    // Set the focus to the title input
    $("#title").focus();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId){
    // Correctly filter out the task
    taskList = taskList.filter(task => task.id != taskId);
    // Proceed with the rest of the function...

    // Save the updated task list to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    console.log(taskList);

    // Render the updated task list
    renderTaskList();

    // Set the focus to the title input
    $("#title").focus();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // Get the task id from the ui object
    const taskId = ui.helper.attr("id");

    // Get the status from the event target
    const status = event.target.id;

    // Find the task in the task list by the id
    const task = taskList.find(task => task.id === taskId);

    // Update the task status
    task.status = status;

    // Save the updated task list to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Render the updated task list
    renderTaskList();

    // Set the focus to the title input
    $("#title").focus();
}
