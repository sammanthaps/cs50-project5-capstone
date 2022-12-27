import React, { useState, useEffect, useContext } from "react";
import { Outlet, Link, useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../authentication/AuthService";
import TextareaAutosize from "react-textarea-autosize";
import { trash, trashFill } from "../components/Icons";
import {
  CloseButton,
  Empty,
  ViewOptions,
  Title,
  DialogPrompt,
  AddNewItem,
} from "../components/Components";

export const Boards = () => {
  const location = useLocation();
  const { authToken } = useContext(AuthContext);
  const [boards, setBoards] = useState([]);
  const [data, setData] = useState({});

  // Get all boards
  useEffect(() => {
    const getBoards = async () => {
      const response = await fetch("/api/boards", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const result = await response.json();
      setBoards(result);
    };
    getBoards();
  }, [authToken, location]);

  return (
    <>
      <AddNewItem info={{ model: "board" }} setInfo={setBoards} />

      <div className="GridView">
        {boards.map((board, index) => (
          <div className="BoardView" key={index}>
            <ViewOptions value={board} setData={setData} />
            <Link
              to={`${board.id}`}
              state={{ title: board.title }}
              title="Open board"
            >
              <div className="BoardTitle">{board.title}</div>
            </Link>
          </div>
        ))}
      </div>
      <DialogPrompt info={data} setInfo={setBoards} />
      <Outlet />
    </>
  );
};

export const GetBoard = () => {
  const boardId = useParams().board_id;
  const boardTitle = useLocation().state.title;
  const { authToken } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetch(`/api/board/${boardId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        const result = await response.json();
        setTasks(result);
      }
    };
    getTasks();
  }, [authToken, boardId]);

  // Edit tasks
  const updateTask = async (info) => {
    const response = await fetch(`/api/board/${boardId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(info),
    });

    if (response.status === 201 || 200) {
      const result = await response.json();
      setTasks(result);
    }
  };

  const handleAddItem = (e) => {
    // Items will be added on enter
    if (e.keyCode === 13) {
      e.preventDefault();
      if (e.target.value !== "") {
        let newItem = tasks.concat({
          body: e.target.value,
          status: false,
        });
        setTasks(newItem);
        updateTask({
          action: "new",
          body: e.target.value,
        });
        e.target.value = "";
      }
    }
  };

  // Empty pages show an image
  const PageDisplay = () => {
    if (tasks.length === 0) {
      return <Empty />;
    } else {
      return (
        <>
          {tasks.map((value, index) => (
            <div key={index} className="Task">
              <section className="TaskBox">
                <input
                  type="checkbox"
                  defaultChecked={value.status ? true : false}
                  onChange={() =>
                    updateTask({
                      action: "status",
                      task_id: value.id,
                      status: !value.status,
                    })
                  }
                />
              </section>

              <section
                id={index}
                className={value.status ? "TaskBody TaskComplete" : "TaskBody"}
                onBlur={(e) =>
                  updateTask({
                    action: "body",
                    task_id: value.id,
                    body: e.target.value,
                  })
                }
              >
                <TextareaAutosize
                  maxLength={335}
                  defaultValue={value.body}
                  title="Edit task"
                />
              </section>

              <section className="TaskDelete">
                <img
                  src={trash}
                  alt="Delete"
                  title="Delete Task"
                  className="WorkspaceIcons"
                  onMouseEnter={(e) => (e.target.src = trashFill)}
                  onMouseLeave={(e) => (e.target.src = trash)}
                  onClick={() =>
                    setData({
                      show: true,
                      model: value.model,
                      action: "delete",
                      element: value.body.slice(0, 7) + "...",
                      task_id: value.id,
                      board_id: boardId,
                    })
                  }
                />
              </section>
            </div>
          ))}
        </>
      );
    }
  };

  return (
    <>
      <div className="DarkBase ViewsBase">
        <div className="BoardInfo">
          <CloseButton section={"boards"} />
          <Title
            info={{
              model: "board",
              board_id: boardId,
              title: boardTitle,
            }}
          />

          <div className="Sections">
            <PageDisplay />
          </div>
          <div
            className="NewTask"
            placeholder="Add a new task"
            onKeyDown={(e) => handleAddItem(e)}
          >
            <TextareaAutosize maxLength={335} placeholder="Add a new task..." />
          </div>
        </div>
      </div>
      <DialogPrompt info={data} setInfo={setTasks} />
    </>
  );
};
