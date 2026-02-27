import { useEffect, useState } from "react";
import axios from "axios";
import DramaCard from "../components/DramaCard";

const API = "https://drama-platform-gmmo.onrender.com";

function Home() {
  const [dramas, setDramas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/api/dramas`)
      .then((res) => {
        setDramas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("API ERROR:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>🔥 Trending Now</h2>

      {loading && <p>Loading dramas...</p>}

      {dramas.map((drama) => (
        <DramaCard key={drama._id} drama={drama} />
      ))}
    </div>
  );
}

export default Home;