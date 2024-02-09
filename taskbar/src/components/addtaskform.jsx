import { useState, useEffect, useRef } from "react";

const AddTaskForm = ({ onAddTask, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");

  let formRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (e.target) {
        if (!formRef.current.contains(e.target)) {
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
    if (title.trim() === "" || description.trim() === "") {
      alert("Please fill in all fields");
      return;
    }

    const newTask = {
      id: Date.now(),
      title,
      description,
      priority,
    };

    onAddTask(newTask);
    setTitle("");
    setDescription("");
    setPriority("low");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div ref={formRef} className="bg-white p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Add Task</h2>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
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

export default AddTaskForm;
