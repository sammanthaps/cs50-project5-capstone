import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../authentication/AuthService";
import {
  moon,
  moonFill,
  sun,
  sunFill,
  logo,
  signout,
  signoutFill,
  menuListFill,
  goBack,
  goBackFill,
  cancelBtn,
  cancelBtnFill,
  confirmBtn,
  confirmBtnFill,
  menu,
} from "./Icons";

export const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const [colorMode, setColorMode] = useState(() =>
    localStorage.getItem("data-color-mode")
  );

  if (colorMode === "dark") {
    document.documentElement.setAttribute("data-color-mode", "dark");
    localStorage.setItem("data-color-mode", "dark");
    document.body.className = "DarkMode";
  } else {
    document.documentElement.setAttribute("data-color-mode", "light");
    localStorage.setItem("data-color-mode", "light");
    document.body.className = "LightMode";
  }

  const ToggleMode = () => {
    if (colorMode === "dark") {
      return (
        <img
          src={moonFill}
          className="WorkspaceIcons"
          alt="Switch Mode"
          title="Turn Off Dark Mode"
          onMouseEnter={(e) => (e.target.src = moon)}
          onMouseLeave={(e) => (e.target.src = moonFill)}
          onClick={() => setColorMode("light")}
        />
      );
    } else {
      return (
        <img
          src={sunFill}
          className="WorkspaceIcons"
          alt="Switch Mode"
          title="Turn Off Light Mode"
          onMouseEnter={(e) => (e.target.src = sun)}
          onMouseLeave={(e) => (e.target.src = sunFill)}
          onClick={() => setColorMode("dark")}
        />
      );
    }
  };

  return (
    <>
      <div id="Sidebar">
        <section className="Dropdown-Menu">
          <img src={menuListFill} alt="Menu" className="WorkspaceIcons" />

          <ul className="Dropdown-Content">
            <li>
              <Link to={"/"} className="WorkspaceLinks">
                Home
              </Link>
            </li>
            <li>
              <Link to={"/boards"} className="WorkspaceLinks">
                Boards
              </Link>
            </li>
            <li>
              <Link to={"/notebooks"} className="WorkspaceLinks">
                Notebooks
              </Link>
            </li>
            <li>
              <Link to={"/settings"} className="WorkspaceLinks">
                Settings
              </Link>
            </li>
          </ul>
        </section>

        <section className="Logo">Capstone</section>

        <section className="SidebarOptions">
          <nav>
            <span>
              <ToggleMode />
            </span>
            <span>
              <img
                src={signout}
                className="WorkspaceIcons"
                alt="Logout"
                title="Log out"
                onMouseEnter={(e) => (e.target.src = signoutFill)}
                onMouseLeave={(e) => (e.target.src = signout)}
                onClick={() => logout()}
              />
            </span>
          </nav>
        </section>
      </div>
    </>
  );
};

export const Footer = () => {
  return (
    <footer>
      <section>
        <img src={logo} alt="Harvard" width={40} />
      </section>

      <section>
        <h2>CS50&#39;s Web Programming with Python and JavaScript</h2>
        <p>Final Project</p>
      </section>
    </footer>
  );
};

export const CloseButton = ({ section }) => {
  const navigate = useNavigate();
  return (
    <div className="CloseButton">
      <img
        src={cancelBtn}
        alt="Close"
        className="WorkspaceIcons"
        title="Close"
        onMouseEnter={(e) => (e.target.src = cancelBtnFill)}
        onMouseLeave={(e) => (e.target.src = cancelBtn)}
        onClick={() => navigate(`/${section}`)}
      />
    </div>
  );
};

export const GoBackButton = () => {
  const navigate = useNavigate();
  return (
    <div className="GoBackButton">
      <img
        src={goBack}
        alt="Go Back"
        className="WorkspaceIcons"
        title="Go Back"
        width={35}
        onMouseEnter={(e) => (e.target.src = goBackFill)}
        onMouseLeave={(e) => (e.target.src = goBack)}
        onClick={() => navigate(-1)}
      />
    </div>
  );
};

export const Empty = () => {
  return <div className="Empty"></div>;
};

export const ViewOptions = ({ value, setData }) => {
  return (
    <>
      <nav className="ViewOptions">
        <div className={value.model === "Board" ? "BoardTags" : "BookTags"}>
          {value.pinned && <span>Pinned</span>}
        </div>
        <div className="ViewOptionsMenu">
          <div>
            <img
              src={menu}
              alt="Menu"
              title="Menu"
              className="WorkspaceIcons"
            />
            <ul>
              <li
                onClick={() =>
                  setData({
                    show: true,
                    action: "delete",
                    model: value.model,
                    element: value.title,
                    id: value.id,
                  })
                }
              >
                Delete
              </li>
              <li
                onClick={() =>
                  setData({
                    show: true,
                    action: value.pinned ? "unpin" : "pin",
                    model: value.model,
                    element: value.title,
                    id: value.id,
                  })
                }
              >
                {value.pinned ? "Unpin" : "Pin"}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export const Title = ({ info }) => {
  const { authToken } = useContext(AuthContext);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  const handleTitle = async (e) => {
    if (e.target.value.length !== 0) {
      switch (info["model"]) {
        case "book":
          await fetch(`/api/notebooks`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({
              action: "title",
              book_id: info["book_id"],
              title: e.target.value,
            }),
          });
          break;
        case "subject":
          await fetch(`/api/book/${info["book_id"]}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({
              action: "title",
              subject_id: info["subject_id"],
              title: e.target.value,
            }),
          });

          break;
        default:
          // Boards as default
          await fetch(`/api/boards`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({
              action: "title",
              board_id: info["board_id"],
              title: e.target.value,
            }),
          });
      }
    } else {
      e.target.value = info["title"];
    }
  };

  return (
    <div className="Title">
      <input
        type="text"
        maxLength={20}
        title="Edit Title"
        defaultValue={info["title"]}
        onBlur={(e) => handleTitle(e)}
      />
    </div>
  );
};

export const AddNewItem = ({ info, setInfo }) => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  const addBoard = async () => {
    const response = await fetch(`/api/boards`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        action: "new",
      }),
    });
    if (response.ok) {
      const result = await response.json();
      setInfo(result["BoardsList"]);
      navigate(`${result["Board"]["id"]}`, {
        state: { title: result["Board"]["title"] },
      });
    }
  };
  const addBook = async () => {
    const response = await fetch(`/api/notebooks`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        action: "new",
      }),
    });
    if (response.ok) {
      const result = await response.json();
      setInfo(result["BooksList"]);
      navigate(`${result["Book"]["id"]}/subjects`, {
        state: { title: result["Book"]["title"] },
      });
    }
  };
  const addSubject = async () => {
    const response = await fetch(`/api/book/${info["book_id"]}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        action: "new",
      }),
    });

    if (response.ok) {
      const result = await response.json();
      setInfo(result);
    }
  };
  const addPage = async () => {
    const response = await fetch(`/api/subject/${info["subject_id"]}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        action: "new",
        book_id: info["book_id"],
      }),
    });

    if (response.ok) {
      const result = await response.json();
      setInfo(result);
    }
  };

  const handleAddItem = async () => {
    switch (info["model"]) {
      case "book":
        addBook();
        break;
      case "subject":
        addSubject();
        break;
      case "page":
        addPage();
        break;
      default:
        // Board as default
        addBoard();
    }
  };

  return (
    <div
      className="Menu"
      title={"Add new " + info["model"]}
      onClick={() => handleAddItem()}
    >
      &#43;
    </div>
  );
};

export const DialogPrompt = ({ info, setInfo }) => {
  const { authToken } = useContext(AuthContext);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };
  const [message, setMessage] = useState({ show: false });

  useEffect(() => {
    setMessage({
      show: info["show"],
    });
  }, [info]);

  // Pin, Unpin and Delete Boards
  const updateBoard = async () => {
    const response = await fetch("api/boards", {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        action: info["action"],
        board_id: info["id"],
      }),
    });

    if (response.ok) {
      const result = await response.json();
      setInfo(result);
    } else if (response.status === 409) {
      alert("You can only pin 3 Boards.");
    }
    setMessage({ show: false });
  };
  const deleteTask = async () => {
    const response = await fetch(`/api/board/${info["board_id"]}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        action: info["action"],
        task_id: info["task_id"],
      }),
    });
    if (response.ok) {
      const result = await response.json();
      setInfo(result);
    }
    setMessage({ show: false });
  };

  // Pin, Unpin and Delete Books
  const updateBook = async () => {
    const response = await fetch(`api/notebooks`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        action: info["action"],
        book_id: info["id"],
      }),
    });

    if (response.ok) {
      const result = await response.json();
      setInfo(result);
    } else if (response.status === 409) {
      alert("You can only pin 3 Books.");
    }
    setMessage({ show: false });
  };
  // Delete Subjects
  const deleteSubject = async () => {
    const response = await fetch(`/api/book/${info["book_id"]}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        action: info["action"],
        subject_id: info["subject_id"],
      }),
    });
    if (response.ok) {
      const result = await response.json();
      setInfo(result);
    }
    setMessage({ show: false });
  };
  const deletePage = async () => {
    const response = await fetch(`/api/subject/${info["subject_id"]}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        action: "delete",
        page_id: info["page_id"],
      }),
    });
    if (response.ok) {
      const result = await response.json();
      setInfo(result);
    }
    setMessage({ show: false });
  };

  // Change to switch
  const handleOptions = () => {
    switch (info["model"]) {
      case "Book":
        updateBook();
        break;
      case "Subject":
        deleteSubject();
        break;
      case "Page":
        deletePage();
        break;
      case "Board":
        updateBoard();
        break;
      case "Task":
        deleteTask();
        break;
      default:
        setInfo({});
    }
  };

  if (message["show"]) {
    return (
      <div className="DarkBase">
        <div className="ConfirmDialog">
          <div>
            Are you sure you want to
            <span className="PromptAction"> {info["action"]}</span>
            <span className="PromptElement"> {info["element"]} </span>?
          </div>
          <div className="ConfirmDialogBtns">
            <img
              src={cancelBtn}
              alt="Cancel"
              className="WorkspaceIcons"
              title="No"
              onMouseEnter={(e) => (e.target.src = cancelBtnFill)}
              onMouseLeave={(e) => (e.target.src = cancelBtn)}
              onClick={() => setMessage({ show: false })}
            />

            <img
              src={confirmBtn}
              alt="Confirm"
              className="WorkspaceIcons"
              title="Yes"
              onMouseEnter={(e) => (e.target.src = confirmBtnFill)}
              onMouseLeave={(e) => (e.target.src = confirmBtn)}
              onClick={() => handleOptions()}
            />
          </div>
        </div>
      </div>
    );
  }
};
