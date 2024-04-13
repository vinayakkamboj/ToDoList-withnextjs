// pages/index.js
import { useEffect } from "react";
import { auth } from "../firebaseInit";
import Auth from "../components/Auth";
import ToDoList from "../components/ToDoList";

const Home = () => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Redirect to sign-in page if not signed in
        window.location.href = "/signin";
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>ToDo App</h1>
      <Auth />
      <ToDoList />
    </div>
  );
};

export default Home;
