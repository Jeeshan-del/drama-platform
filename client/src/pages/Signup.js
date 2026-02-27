import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://drama-platform-gmmo.onrender.com/api/auth/signup",
        form
      );

      navigate("/login");
    } catch (err) {
      alert("Signup failed");
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        /><br /><br />

        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        /><br /><br />

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;