import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const ClientDashboard = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs/client");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Client Dashboard</h2>

        {jobs.map((job) => (
          <div key={job._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h4>{job.title}</h4>
            <p>{job.description}</p>
            <p>Status: {job.status}</p>
            <p>
              Technician: {job.technician ? job.technician.name : "Not Assigned"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ClientDashboard;