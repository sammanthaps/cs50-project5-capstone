import React, { useContext, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../authentication/AuthService";

const Workspace = () => {
  let { authToken } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [boards, setBoards] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const getWorkspaceData = async () => {
      const response = await fetch("api/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        setBoards(result["boards"]);
        setBooks(result["books"]);
        setUser(result["user"]);
      }
    };
    getWorkspaceData();
  }, [authToken]);

  return (
    <>
      <div className="UserIntro">
        <h1>
          <span>Hello</span>, {user.username || `${user.first} ${user.last}`}!
        </h1>
        <p>
          Welcome to your workspace.
          <br /> Here, you'll find your pinned boards and books...
        </p>
      </div>
      <div className="GridView">
        <div className="PinnedItems">
          <div className="PinnedBoards">
            <h2>Boards</h2>
            {boards.map((value, index) => (
              <div className="BoardView" key={index}>
                <Link
                  to={`boards/${value.id}`}
                  title="Open board"
                  state={{ title: value.title }}
                >
                  <div className="BookTitle">{value.title}</div>
                </Link>
              </div>
            ))}
          </div>
          <div className="PinnedBooks">
            <h2>Books</h2>
            {books.map((value, index) => (
              <div className="BookView" key={index}>
                <Link
                  to={`notebooks/${value.id}/subjects`}
                  title="Open book"
                  state={{ title: value.title }}
                >
                  <div className="BookTitle">{value.title}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Workspace;
