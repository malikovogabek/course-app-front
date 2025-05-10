import React, { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import CourseList from "./components/CourseList";

const App = () => {
  const [courses, setCourses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [showAuth, setShowAuth] = useState(null);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    }
  }, [token]);

  useEffect(() => {
    fetch("http://localhost:8000/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Xato:", err));
  }, []);

  const handleAuth = (type) => (data) => {
    fetch(`http://localhost:8000/api/auth/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.token) {
          setToken(result.token);
          localStorage.setItem("token", result.token);
          setIsAuthenticated(true);
          setShowAuth(null);
        } else {
          alert(result.message);
        }
      })
      .catch((err) => console.error("Xato:", err));
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const handleLike = (id) => {
    fetch(`http://localhost:8000/api/courses/${id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((updatedCourse) => {
        setCourses(
          courses.map((course) => (course._id === id ? updatedCourse : course))
        );
      })
      .catch((err) => console.error("Xato:", err));
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCourse),
    })
      .then((res) => res.json())
      .then((course) => {
        setCourses([...courses, course]);
        setNewCourse({ title: "", description: "" });
      })
      .catch((err) => console.error("Xato:", err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/api/courses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(() => {
        setCourses(courses.filter((course) => course._id !== id));
      })
      .catch((err) => console.error("Xato:", err));
  };

  const handleUpdate = (id, data) => {
    fetch(`http://localhost:8000/api/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((updatedCourse) => {
        setCourses(
          courses.map((course) => (course._id === id ? updatedCourse : course))
        );
      })
      .catch((err) => console.error("Xato:", err));
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kurslar Sayti</h1>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Chiqish
          </button>
        ) : (
          <div>
            <button
              onClick={() => setShowAuth("login")}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
              Kirish
            </button>
            <button
              onClick={() => setShowAuth("register")}
              className="bg-green-500 text-white px-4 py-2 rounded">
              Ro‘yxatdan o‘tish
            </button>
          </div>
        )}
      </div>

      {showAuth && (
        <div className="mb-6">
          <AuthForm type={showAuth} onSubmit={handleAuth(showAuth)} />
        </div>
      )}

      {isAuthenticated && (
        <form onSubmit={handleAddCourse} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Yangi kurs qo‘shish</h2>
          <input
            type="text"
            placeholder="Kurs nomi"
            value={newCourse.title}
            onChange={(e) =>
              setNewCourse({ ...newCourse, title: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
            required
          />
          <textarea
            placeholder="Tavsif"
            value={newCourse.description}
            onChange={(e) =>
              setNewCourse({ ...newCourse, description: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded">
            Qo‘shish
          </button>
        </form>
      )}

      <CourseList
        courses={courses}
        onLike={handleLike}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default App;
