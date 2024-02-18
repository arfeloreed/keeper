import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import axios from "axios";

function Note({ id, title, content }) {
  const url = process.env.REACT_APP_URL || "http://localhost:5000";

  async function handleDelete() {
    try {
      await axios.delete(`${url}/home/notes/${id}`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="note rounded">
      <h1 className="fw-semibold">{title}</h1>
      <p>{content}</p>
      <Zoom in>
        <Fab className="text-danger" onClick={handleDelete}>
          <DeleteIcon />
        </Fab>
      </Zoom>
    </div>
  );
}

export default Note;
