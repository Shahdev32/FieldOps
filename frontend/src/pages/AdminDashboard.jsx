import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTech, setSelectedTech] = useState("");

  const fetchJobs = async () => {
    const res = await API.get("/jobs");
    setJobs(res.data);
  };

  const fetchTechs = async () => {
    const res = await API.get("/users/technicians");
    setTechnicians(res.data);
  };

  useEffect(() => {
    fetchJobs();
    fetchTechs();
  }, []);

  const createJob = async (e) => {
    e.preventDefault();

    await API.post("/jobs", {
      title,
      description,
      technician: selectedTech,
    });

    setTitle("");
    setDescription("");
    fetchJobs();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <button onClick={logout}>Logout</button>

      <h3>Create Job</h3>
      <form onSubmit={createJob}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />

        <select onChange={(e) => setSelectedTech(e.target.value)}>
          <option>Select Technician</option>
          {technicians.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <button type="submit">Create</button>
      </form>

      <h3>Jobs</h3>
      {jobs.map((job) => (
        <div key={job._id}>
          <h4>{job.title}</h4>
          <p>{job.description}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;