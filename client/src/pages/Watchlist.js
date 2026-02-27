import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import DramaCard from "../components/DramaCard";

function Watchlist() {
  const { token } = useContext(AuthContext);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!token) return;

    axios.get(
      "https://drama-platform-gmmo.onrender.com/api/watchlist",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(res => setList(res.data))
      .catch(err => console.log(err));
  }, [token]);

  if (!token)
    return <p style={{ padding: 30 }}>Login required</p>;

  return (
    <div style={{ padding: 30 }}>
      <h2>My Watchlist</h2>

      {list.map(drama => (
        <DramaCard key={drama._id} drama={drama} />
      ))}
    </div>
  );
}

export default Watchlist;