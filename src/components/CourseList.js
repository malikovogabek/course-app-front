import React, { useState } from "react";

const CourseList = ({
  courses,
  onLike,
  onDelete,
  onUpdate,
  isAuthenticated,
}) => {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleEdit = (course) => {
    setEditId(course._id);
    setEditTitle(course.title);
    setEditDescription(course.description);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    onUpdate(editId, { title: editTitle, description: editDescription });
    setEditId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {courses.map((course) => (
        <div
          key={course._id}
          className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          {editId === course._id ? (
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                Saqlash
              </button>
              <button
                type="button"
                onClick={() => setEditId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded">
                Bekor qilish
              </button>
            </form>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {course.title}
              </h2>
              <p className="text-gray-600 mb-3">{course.description}</p>
              <p className="text-sm text-gray-500 mb-4">
                Like’lar: {course.likes}
              </p>
              <div className="flex gap-2">
                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => onLike(course._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Like
                    </button>
                    <button
                      onClick={() => handleEdit(course)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                      Tahrirlash
                    </button>
                    <button
                      onClick={() => onDelete(course._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                      O‘chirish
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseList;
