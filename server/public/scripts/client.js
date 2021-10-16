console.log(`in js`);

// DOM is loaded, start jQuery
$(onReady);

function onReady() {
  console.log(`in jq`);
  getTasks();
  // set up event listeners
  attachEventListeners();
}

function attachEventListeners() {}

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
  for (let task of tasks) {
    // build row as a jQuery object
    let row = $(`
    <tr class="${
      task.complete
        ? // conditional: add .complete or .incomplete depending on task
          'taskComplete'
        : 'taskIncomplete'
    }">
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
    $(`#tasksDisplayTableBody`).append(row);
  } // end for
}
