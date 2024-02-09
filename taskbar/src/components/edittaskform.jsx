import { useState, useRef, useEffect } from "react";

const EditTaskForm = ({ task, onEditTask, onClose }) => {
  const [editedTask, setEditedTask] = useState({ ...task });

  let formRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (e.target) {
        if (!formRef.current.contains(e.target)) {
          console.log(formRef.current);
          console.log(e.target);
          console.log(formRef.current.contains(e.target));
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  const handleSave = () => {
    // Validate and save the edited task
    if (
      editedTask.title.trim() === "" ||
      editedTask.description.trim() === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Pass the edited task to the parent component for handling
    onEditTask(editedTask);

    // Close the form
    // onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div ref={formRef} className="bg-white p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Edit Task</h2>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={editedTask.title}
          onChange={(e) =>
            setEditedTask({ ...editedTask, title: e.target.value })
          }
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={editedTask.description}
          onChange={(e) =>
            setEditedTask({ ...editedTask, description: e.target.value })
          }
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          value={editedTask.priority}
          onChange={(e) =>
            setEditedTask({ ...editedTask, priority: e.target.value })
          }
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskForm;
