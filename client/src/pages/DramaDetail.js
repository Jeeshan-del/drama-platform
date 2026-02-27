import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function DramaDetail() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [drama, setDrama] = useState(null);

  useEffect(() => {
    axios.get(
      `https://drama-platform-gmmo.onrender.com/api/dramas/${id}`
    )
      .then(res => setDrama(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const addToWatchlist = async () => {
    if (!token) {
      alert("Login required");
      return;
    }

    try {
      await axios.post(
        `https://drama-platform-gmmo.onrender.com/api/watchlist/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Added to watchlist");
    } catch (err) {
      console.log(err);
    }
  };

  if (!drama) return <p style={{ padding: 30 }}>Loading...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>{drama.title}</h1>
      <img
        src={drama.image}
        alt=""
        width="400"
        style={{ borderRadius: 10 }}
      />
      <p>{drama.description}</p>

      <button onClick={addToWatchlist}>
        Add to Watchlist
      </button>
    </div>
  );
}

export default DramaDetail;