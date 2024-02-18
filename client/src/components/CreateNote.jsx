import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import axios from "axios";

function CreateNote() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const auth = useAuthUser();
  const url = process.env.REACT_APP_URL || "http://localhost:5000";

  async function handleSubmit(event) {
    event.preventDefault();
    const body = {
      user_id: auth.uid,
      title,
      content,
    };

    try {
      const response = await axios.post(`${url}/notes`, body);

      if (response.data.message === "success") {
        setTitle("");
        setContent("");
      } else alert("Can't save note. Try again.");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="container">
      <form className="add-note mx-auto mt-5 bg-light p-3 rounded">
        {isExpanded && (
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}

        <textarea
          name="content"
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
          onClick={() => setIsExpanded(true)}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <Zoom in={isExpanded}>
          <Fab color="secondary" onClick={(e) => handleSubmit(e)}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateNote;
