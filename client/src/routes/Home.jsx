import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
// components
import Header from "../components/Header";
import CreateNote from "../components/CreateNote";
import Note from "../components/Note";
import Footer from "../components/Footer";

function Home() {
  const [notes, setNotes] = useState([]);
  const url = process.env.REACT_APP_URL || "http://localhost:5000";
  const auth = useAuthUser();

  async function getNotes() {
    try {
      const response = await axios.get(`${url}/home/${auth.uid}/notes`);

      if (response.data.message === "success") setNotes(response.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getNotes();
  }, [notes]);

  return (
    <div className="home-bg position-relative pb-5">
      <Header />
      <CreateNote />

      <div className="container mt-5 mx-auto row row-cols-4 justify-content-center align-items-start">
        {notes.map((item) => (
          <Note
            key={item.id}
            id={item.id}
            title={item.title}
            content={item.content}
            className="col"
          />
        ))}
      </div>

      <div className="position-absolute w-100 bottom-0 pb-1">
        <Footer color="dark" />
      </div>
    </div>
  );
}

export default Home;
