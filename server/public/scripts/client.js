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
    // build row as a jQuery object
    let row = $(`
    <tr>
      <td class="taskIncomplete">${task.task}</td>
      <td> 
        ${
          task.complete
            ? // conditional: complete button only present when task is not complete
              ''
            : '<button id="completeBtn" class="btn btn-success">Complete</button>'
        }
      </td>
      <td>
        <button id="completeBtn" class="btn btn-danger">Delete</button>
      </td>
    </tr>`);
    // set the id for this task on the tr
    row.data(`id`, task.id);
    task.complete // add class depending on complete status
      ? row.addClass(`taskComplete`)
      : row.addClass(`taskIncomplete`);
    $(`#tasksDisplayTableBody`).append(row);
  } // end for
}
