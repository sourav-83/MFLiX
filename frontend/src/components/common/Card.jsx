import React from "react";
import { Link } from "react-router-dom";

const Card = ({ id, name, overview, path }) => {
  return (
    <div className="card h-100 shadow-sm">
      <Link to={`/movie/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <img
          src={path}
          className="card-img-top"
          alt={name}
          style={{ height: "300px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text text-truncate">{overview}</p>
        </div>
      </Link>
    </div>
  );
};

export default Card;
