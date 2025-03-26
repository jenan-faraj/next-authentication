"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("/api/users");
    setUsers(res.data);
  };

  const addUser = async () => {
    await axios.post("/api/users", { name, email });
    setName("");
    setEmail("");
    fetchUsers();
  };

  const editUser = async (id) => {
    const newName = prompt("Enter new name:");
    const newEmail = prompt("Enter new email:");
    if (newName && newEmail) {
      await axios.put("/api/users", { id, name: newName, email: newEmail });
      fetchUsers();
    }
  };

  const deleteUser = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await axios.delete("/api/users", { data: { id } });
      fetchUsers();
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2" onClick={addUser}>
          Add User
        </button>
      </div>

      <ul>
        {users.map((user) => (
          <li key={user._id} className="mb-2 border p-2 flex justify-between">
            <span>
              {user.name} - {user.email}
            </span>
            <div>
              <button
                className="bg-yellow-500 text-white p-1 mr-2"
                onClick={() => editUser(user._id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white p-1"
                onClick={() => deleteUser(user._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
