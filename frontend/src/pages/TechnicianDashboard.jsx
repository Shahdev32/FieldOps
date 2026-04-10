import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const TechnicianDashboard = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs/technician");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/jobs/${id}`, { status });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Technician Dashboard</h2>

        {jobs.map((job) => (
          <div key={job._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h4>{job.title}</h4>
            <p>{job.description}</p>
            <p>Status: {job.status}</p>

            <select
              value={job.status}
              onChange={(e) => updateStatus(job._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
      </div>
    </>
  );
};

export default TechnicianDashboard;