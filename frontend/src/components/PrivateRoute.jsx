import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import JobCard from "../components/JobCard";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const { data } = await API.get("/jobs/my");
      setJobs(data);
    } catch (err) {
      console.log("Fetch jobs error:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <h2>Dashboard ({user?.role})</h2>

      {user?.role === "admin" && (
        <button onClick={() => navigate("/create-job")}>
          Create Job
        </button>
      )}

      {jobs.map((job) => (
        <JobCard key={job._id} job={job} refresh={fetchJobs} />
      ))}
    </div>
  );
}