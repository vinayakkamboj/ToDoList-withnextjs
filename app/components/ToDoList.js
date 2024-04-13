import { useState, useEffect } from "react";
import { auth, database } from "../../firebaseInit";

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const userId = auth.currentUser.uid;
      const snapshot = await database.ref(`users/${userId}/tasks`).once("value");
      const tasksData = snapshot.val();
      if (tasksData) {
        const tasksArray = Object.entries(tasksData).map(([id, task]) => ({
          id,
          ...task,
        }));
        setTasks(tasksArray);
      }
    };
    fetchData();
  }, []);

  const addTask = async () => {
    const userId = auth.currentUser.uid;
    const newTaskRef = database.ref(`users/${userId}/tasks`).push();
    await newTaskRef.set({
      content: newTask,
      completed: false,
    });
    setNewTask("");
    setTasks([...tasks, { id: newTaskRef.key, content: newTask, completed: false }]);
  };

  const toggleTaskStatus = async (taskId, completed) => {
    const userId = auth.currentUser.uid;
    await database.ref(`users/${userId}/tasks/${taskId}`).update({ completed: !completed });
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = async (taskId) => {
    const userId = auth.currentUser.uid;
    await database.ref(`users/${userId}/tasks/${taskId}`).remove();
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Add new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskStatus(task.id, task.completed)}
            />
            <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
              {task.content}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
