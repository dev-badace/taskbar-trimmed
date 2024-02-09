import { useState } from "react";
import "../App.css";
import AddTaskForm from "./addtaskform";
import EditTaskForm from "./edittaskform";

//TODO hmm I want, DnD, multiple projects canvas draggable, and a status like 'current' | 'next' | 'planned' | 'finished' | 'drafts' '
const status = ["UPCOMING", "COMPLETED", "OVERDUE", "ALL"];

//Bruh javascript doesn;t have enums, shocking, I thought it was a javascript thing :/ thankx typescript
// enum TaksStatus = {
//   UPCOMING = "UPCOMING",
// }

const populateStatus = (newTask) => {
  newTask.status = status[0];
};

const populateTasks = () => {
  const storedLocalValues = Object.values(localStorage);

  return storedLocalValues.map((it) => {
    var json = JSON.parse(it);

    let task = {
      id: json.id,
      title: json.title,
      description: json.description,
      priority: json.priority,
      dueDate: json.dueDate,
      status: json.status,
    };

    populateStatus(task);

    return task;
  });
};

const TaskTable = () => {
  console.log("render");
  const [tasksObject, setTasksObject] = useState(populateTasks());
  const [filter, setFilter] = useState(status[3]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  //highligh the selected category, and show tasks
  // const [filterCategory, setFilterCategory] = useState(null);

  console.log("taskObje", tasksObject);

  const handleAddTask = (newTask) => {
    populateStatus(newTask);
    localStorage.setItem(newTask.id, JSON.stringify(newTask));
    setTasksObject((prevTasks) => [...prevTasks, newTask]);
    filterTasks(filter);
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const toggleEditForm = (task) => {
    setSelectedTask(task);
    setShowEditForm(!showEditForm);
  };

  const handleEditTask = (editedTask) => {
    // Update the edited task in localStorage
    populateStatus(editedTask);

    localStorage.setItem(editedTask.id, JSON.stringify(editedTask));

    // Update tasksObject state
    setTasksObject((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editedTask.id ? { ...task, ...editedTask } : task
      )
    );

    setShowEditForm(false);
    filterTasks(filter);
  };

  const updateStatus = (task) => {
    var taskStatus = task.status;
    console.log(task);
    console.log(taskStatus);
    if (taskStatus == status[1]) {
      task.status = null;
      populateStatus(task);
    } else {
      task.status = status[1];
    }

    localStorage.setItem(task.id, JSON.stringify(task));
    setTasksObject((prevTasks) =>
      prevTasks.map((it) => (it.id === task.id ? { ...it, ...task } : it))
    );

    filterTasks(filter);
  };

  const filterTasks = (filterStatus) => {
    setFilter(filterStatus);
    const allTasks = populateTasks();
    switch (filterStatus) {
      case status[0]:
        setTasksObject(allTasks.filter((task) => task.status === status[0]));
        break;
      case status[2]:
        setTasksObject(allTasks.filter((task) => task.status === status[2]));
        break;
      case status[1]:
        setTasksObject(allTasks.filter((task) => task.status === status[1]));
        break;
      default:
        setTasksObject(allTasks);
        break;
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex items-center mb-4">
        <div
          onClick={() => filterTasks(status[3])}
          className="flex-1 text-center py-2 bg-cyan-200 border-2 border-slate-800 rounded-tl-lg rounded-bl-lg shadow-md hover:bg-cyan-500 hover:text-white cursor-pointer"
        >
          All Tasks
        </div>
        <div
          onClick={() => filterTasks(status[0])}
          className="flex-1 text-center py-2 bg-cyan-200 border-2 border-slate-800 shadow-md hover:bg-cyan-500 hover:text-white cursor-pointer"
        >
          Upcoming Tasks
        </div>
        <div
          onClick={() => filterTasks(status[2])}
          className="flex-1 text-center py-2 bg-cyan-200 border-2 border-slate-800 shadow-md hover:bg-cyan-500 hover:text-white cursor-pointer"
        >
          Overdue Tasks
        </div>
        <div
          onClick={() => filterTasks(status[1])}
          className="flex-1 text-center py-2 bg-cyan-200 border-2 border-slate-800 rounded-tr-lg rounded-br-lg shadow-md hover:bg-cyan-500 hover:text-white cursor-pointer"
        >
          Completed Tasks
        </div>
      </div>

      <div className="flex flex-col font-mono">
        <div className="flex text-black rounded-md w-1/3">
          <div className="flex-1 p-2">
            <button
              className="bg-cyan-200 border-2 border-solid border-black shadow-md p-2 rounded 
          hover:bg-cyan-500 hover:text-white shadow-xl"
              onClick={toggleAddForm}
            >
              Add Task
            </button>
            {showAddForm && (
              <AddTaskForm onAddTask={handleAddTask} onClose={toggleAddForm} />
            )}
          </div>
        </div>

        {tasksObject && tasksObject.length > 0 && (
          <TaskGrid
            tasksObject={tasksObject}
            updateStatus={updateStatus}
            toggleEditForm={toggleEditForm}
            handleEditTask={handleEditTask}
            showEditForm={showEditForm}
            selectedTask={selectedTask}
            setShowEditForm={setShowEditForm}
          />
        )}
      </div>
    </div>
  );
};

const TaskGrid = ({
  tasksObject,
  updateStatus,
  toggleEditForm,
  handleEditTask,
  showEditForm,
  selectedTask,
  setShowEditForm,
}) => {
  return (
    <>
      {showEditForm && selectedTask && (
        <EditTaskForm
          task={selectedTask}
          onEditTask={handleEditTask}
          onClose={() => setShowEditForm(false)}
        />
      )}
      <table className="w-full table-auto border-2 m-2 border-black shadow-xl">
        <thead>
          <tr className="bg-cyan-200 text-black border-2 border-black">
            <th className="p-2 border-2 border-black">Title</th>
            <th className="p-2 border-2 border-black">Description</th>
            <th className="p-2 border-2 border-black">Priority</th>
            <th className="p-2 border-2 border-black">Status</th>
            <th className="p-2 border-2 border-black">Update Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasksObject.map((task) => (
            <tr
              key={task.id}
              className="bg-white-100 text-black rounded-md border border-dashed shadow-md font-mono"
            >
              <td className="p-2 border-dashed border-2 hover:border-black hover:border-solid hover:bg-cyan-50">
                {task.title}
              </td>
              <td className="p-2 border-dashed border-2 hover:border-black hover:border-solid hover:bg-cyan-50">
                {task.description}
              </td>
              <td className="p-2 border-dashed border-2 hover:border-black hover:border-solid hover:bg-cyan-50">
                {task.priority}
              </td>
              <td className="p-2 border-dashed border-2 hover:border-black hover:border-solid hover:bg-cyan-50">
                {task.status}
              </td>
              <td className="p-2 border-dashed border-2 hover:border-black hover:border-solid hover:bg-cyan-50">
                <button
                  className="border-black border-2 bg-cyan-100 p-1 hover:bg-cyan-300"
                  onClick={() => updateStatus(task)}
                >
                  {task.status === status[1] ? (
                    <p> Mark as Incomplete </p>
                  ) : (
                    <p> Mark as Completed </p>
                  )}
                </button>
              </td>
              <td className="p-2 hover:bg-cyan-50">
                <button
                  onClick={() => toggleEditForm(task)}
                  className="bg-cyan-200 border-2 border-slate-800 rounded-lg shadow-md p-1 hover:bg-cyan-500 hover:text-white hover:shadow-xl"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TaskTable;
