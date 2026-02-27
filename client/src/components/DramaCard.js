import { Link } from "react-router-dom";

function DramaCard({ drama }) {
  return (
    <Link to={`/drama/${drama._id}`} style={{ textDecoration: "none", color: "white" }}>
      <div style={{
        background: "#222",
        padding: 10,
        borderRadius: 8,
        marginBottom: 20
      }}>
        <img
          src={drama.image}
          alt={drama.title}
          style={{ width: "100%", height: 200, objectFit: "cover" }}
        />
        <h3>{drama.title}</h3>
        <p>{drama.genre}</p>
        <p>⭐ {drama.rating}</p>
      </div>
    </Link>
  );
}

export default DramaCard;