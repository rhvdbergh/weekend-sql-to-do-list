console.log(`in js`);

let orderBy;

// DOM is loaded, start jQuery
$(onReady);

function onReady() {
  console.log(`in jq`);
  getTasks(orderBy);
  // set up event listeners
  attachEventListeners();
}

function attachEventListeners() {
  $(`#submitTaskBtn`).on(`click`, addTask);
  $(`#tasksDisplayTableBody`).on(`click`, `.deleteBtn`, deleteTask);
  $(`#tasksDisplayTableBody`).on(`click`, `.completeBtn`, completeTask);
  $(`.sortBtn`).on(`click`, sort);
}

function sort() {
  console.log(`in sort`);
  let id = $(this).attr(`id`); // this id refers to the id of the btn
  switch (id) {
    case `sortAtoZ`:
      orderBy = `az`;
      break;
    case `sortZtoA`:
      orderBy = `za`;
      break;
    case `dateAscending`:
      orderBy = `dateAsc`;
      break;
    case `dateDescending`:
      orderBy = `dateDesc`;
      break;
    default:
      orderBy = `id`; // this id is the id in the db table
      break;
  }
  getTasks();
}

// retrieve all tasks (and render() )
function getTasks() {
  $.ajax({
    method: `GET`,
    url: `/tasks?sort=${orderBy}`, // orderBy is a global variable
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
  // open up modal to confirm
  let self = $(this);
  if (self.closest(`tr`).hasClass(`taskComplete`)) {
    // this task is completed, delete without confirmation
    performDeletion(self);
  } else {
    // the task is not yet complete, ask the user to confirm
    swal({
      title: `Are you sure?`,
      text: `This will permanently delete this task!`,
      icon: `warning`,
      buttons: true,
      dangerMode: true,
    }).then(function (userConfirmedDeletion) {
      if (userConfirmedDeletion) {
        performDeletion(self);
      } // end if userConfirmedDeletion
    }); // end then for swal
  } // end if ... else
}

// performs deletion of given element of the table in the database
function performDeletion(el) {
  console.log(`id:`, $(el).closest(`tr`).data(`id`));
  $.ajax({
    method: `DELETE`,
    url: `/tasks/${$(el).closest(`tr`).data(`id`)}`,
  })
    .then(function (response) {
      getTasks(orderBy); // refresh the screen
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
    },
  })
    .then(function (response) {
      getTasks();
    })
    .catch(function (err) {
      console.log(`There was an error updating the task on the server:`, err);
    });
}
