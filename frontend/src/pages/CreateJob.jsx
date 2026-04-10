import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreateJob = () => {
  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/jobs", form);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Job</h2>

      <input
        placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Description"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <button>Create</button>
    </form>
  );
};

export default CreateJob;