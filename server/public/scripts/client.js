console.log(`in js`);

// DOM is loaded, start jQuery
$(onReady);

function onReady() {
  console.log(`in jq`);
  getTasks();
  // set up event listeners
  attachEventListeners();
}

function attachEventListeners() {
  $(`#submitTaskBtn`).on(`click`, addTask);
  $(`#tasksDisplayTableBody`).on(`click`, `.deleteBtn`, deleteTask);
  $(`#tasksDisplayTableBody`).on(`click`, `.completeBtn`, completeTask);
}

// retrieve all tasks (and render() )
function getTasks() {
  $.ajax({
    method: `GET`,
    url: `/tasks`,
  })
    .then(function (response) {
      render(response);
    })
    .catch(function (err) {
      console.log(
        `There was an error fetching the tasks from the server:`,
        err
      );
    });
}

function render(tasks) {
  // empty the table for new data
  $(`#tasksDisplayTableBody`).empty();

  // build each row and append
  for (let task of tasks) {
    // build row as a jQuery object, depending on complete / incomplete
    let row;
    if (task.complete) {
      row = `
        <tr data-id="${task.id}" class="taskComplete">
            <td class="col-8">
              <span class="task line-through">${task.task}</span>
              <span class="dateCompleted">Completed: ${new Date(
                task.time_completed
              ).toLocaleDateString()}</span>
            </td>
          <td class="tableButtons d-flex justify-content-end align-items-center flex-wrap"> 
            <button class="deleteBtn btn btn-danger">Delete</button>
          </td>
        </tr>`;
    } else {
      row = `
        <tr data-id="${task.id}" class="taskIncomplete">
            <td class="col-8">
              <span class="task">${task.task}</span>
            </td>
          <td class="tableButtons d-flex justify-content-end align-items-center flex-wrap"> 
            <button class="completeBtn btn btn-success">Complete</button>
            <button class="deleteBtn btn btn-danger">Delete</button>
          </td>
        </tr>`;
    }
    $(`#tasksDisplayTableBody`).append(row);
  } // end for
}

function addTask() {
  console.log(`in addTask`);
  $.ajax({
    method: `POST`,
    url: `/tasks`,
    data: {
      task: $(`#taskInput`).val(),
    },
  })
    .then(function (response) {
      $(`#taskInput`).val(``).focus();
      getTasks();
    })
    .catch(function (err) {
      console.log(`There was an error posting the task to the server:`, err);
    });
}

function deleteTask() {
  console.log(`in deleteTask`);
  console.log(`id:`, $(this).closest(`tr`).data(`id`));
  $.ajax({
    method: `DELETE`,
    url: `/tasks/${$(this).closest(`tr`).data(`id`)}`,
  })
    .then(function (response) {
      getTasks();
    })
    .catch(function (err) {
      console.log(`There was an error deleting the task on the server:`, err);
    });
}

function completeTask() {
  console.log(`in completeTask`);
  $.ajax({
    method: `PUT`,
    url: `/tasks/${$(this).closest(`tr`).data(`id`)}`,
    data: {
      complete: true,
      date: new Date(Date.now()),
    },
  })
    .then(function (response) {
      getTasks();
    })
    .catch(function (err) {
      console.log(`There was an error updating the task on the server:`, err);
    });
}
