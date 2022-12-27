import React, { useState, useEffect, useContext } from "react";
import { Outlet, Link, useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../authentication/AuthService";
import MDEditor from "@uiw/react-md-editor";
import TextareaAutosize from "react-textarea-autosize";
import { trash, trashFill } from "../components/Icons";
import {
  CloseButton,
  GoBackButton,
  Empty,
  ViewOptions,
  Title,
  AddNewItem,
  DialogPrompt,
} from "../components/Components";

// Get all Notebooks
export const Notebooks = () => {
  const location = useLocation();
  const { authToken } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    const getNotebooks = async () => {
      const response = await fetch("/api/notebooks", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setBooks(result);
      }
    };
    getNotebooks();
  }, [authToken, location]);

  return (
    <>
      <AddNewItem info={{ model: "book" }} setInfo={setBooks} />

      <div className="GridView">
        {books.map((book, index) => (
          <div className="BookView" key={index}>
            <ViewOptions value={book} setData={setData} />
            <Link
              to={`${book.id}/subjects`}
              title="Open Book"
              state={{ title: book.title }}
            >
              <div className="BookTitle">{book.title}</div>
            </Link>
          </div>
        ))}
      </div>
      <DialogPrompt info={data} setInfo={setBooks} />
      <Outlet />
    </>
  );
};

// Get All Subjects
export const GetSubjects = () => {
  const { authToken } = useContext(AuthContext);
  const bookId = useParams().book_id;
  const bookTitle = useLocation().state.title;
  const [subjects, setSubjects] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    const getSubjects = async () => {
      const response = await fetch(`/api/book/${bookId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        const result = await response.json();
        setSubjects(result);
      }
    };
    getSubjects();
  }, [authToken, bookId]);

  const PageDisplay = () => {
    if (subjects.length === 0) {
      return <div className="Empty"></div>;
    } else {
      return (
        <>
          {subjects.map((value, index) => (
            <nav key={index}>
              <Link to={`${value.id}/pages`} state={{ title: value.title }}>
                {value.title}
              </Link>
              <div>
                <img
                  src={trash}
                  alt="Delete"
                  title="Delete"
                  className="WorkspaceIcons"
                  onMouseEnter={(e) => (e.target.src = trashFill)}
                  onMouseLeave={(e) => (e.target.src = trash)}
                  onClick={() =>
                    setData({
                      show: true,
                      model: value.model,
                      action: "delete",
                      subject_id: value.id,
                      book_id: bookId,
                      element: value.title,
                    })
                  }
                />
              </div>
            </nav>
          ))}
        </>
      );
    }
  };

  return (
    <>
      <div className="DarkBase">
        <section className="BookInfo">
          <CloseButton section={"notebooks"} />
          <Title
            info={{
              model: "book",
              book_id: bookId,
              title: bookTitle,
            }}
          />

          <AddNewItem
            info={{
              model: "subject",
              book_id: bookId,
            }}
            setInfo={setSubjects}
          />

          <div className="Sections">
            <PageDisplay />
          </div>
        </section>
      </div>
      <DialogPrompt info={data} setInfo={setSubjects} />
    </>
  );
};

// Get All Pages
export const GetPages = () => {
  const { authToken } = useContext(AuthContext);
  const { book_id, subject_id } = useParams();
  const subjectTitle = useLocation().state.title;
  const [pages, setPages] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    const getPages = async () => {
      const response = await fetch(`/api/subject/${subject_id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        setPages(result);
      }
    };
    getPages();
  }, [authToken, book_id, subject_id]);

  const PageDisplay = () => {
    if (pages.length === 0) {
      return <div className="Empty"></div>;
    } else {
      return (
        <>
          {pages.map((value, index) => (
            <nav key={index}>
              <Link to={`${value.id}`}>
                Page {++index}: {value.title}
              </Link>
              <div>
                <img
                  src={trash}
                  alt="Delete"
                  title="Delete"
                  className="WorkspaceIcons"
                  onMouseEnter={(e) => (e.target.src = trashFill)}
                  onMouseLeave={(e) => (e.target.src = trash)}
                  onClick={() =>
                    setData({
                      show: true,
                      model: value.model,
                      action: "delete",
                      page_id: value.id,
                      subject_id: subject_id,
                      element: value.title,
                    })
                  }
                />
              </div>
            </nav>
          ))}
        </>
      );
    }
  };

  return (
    <div className="DarkBase">
      <div className="BookInfo">
        <div className="WindowOptions">
          <GoBackButton />
          <CloseButton section={"notebooks"} />
        </div>
        <Title
          info={{
            model: "subject",
            book_id: book_id,
            subject_id: subject_id,
            title: subjectTitle,
          }}
        />

        <AddNewItem
          info={{
            model: "page",
            book_id: book_id,
            subject_id: subject_id,
          }}
          setInfo={setPages}
        />

        <div className="Sections">
          <PageDisplay />
        </div>
      </div>
      <DialogPrompt info={data} setInfo={setPages} />
    </div>
  );
};

// Get a Page
export const GetAPage = () => {
  const pageId = useParams().page_id;
  const { authToken } = useContext(AuthContext);
  const [page, setPage] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const getPage = async () => {
      const response = await fetch(`/api/page/${pageId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const result = await response.json();
      if (response.status === 200) {
        setPage(result);
      }
    };
    getPage();
  }, [authToken, pageId]);

  const updatePage = async (e) => {
    if (e.target.value.length !== 0) {
      setPage(e.target.value);
      await fetch(`/api/page/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          body: e.target.value,
        }),
      });
    } else {
      e.target.value = page;
    }
    setEdit(false);
  };

  const PageDisplay = () => {
    if (edit === true) {
      return (
        <div className="PageEditor" onBlur={(e) => updatePage(e)}>
          <TextareaAutosize
            defaultValue={page}
            placeholder="Your text goes here..."
            autoFocus={true}
          />
        </div>
      );
    } else {
      if (page.length !== 0) {
        return (
          <div
            className="PagePreview"
            onClick={() => setEdit(true)}
            title="Click to edit"
          >
            <MDEditor.Markdown
              style={{ padding: 5 }}
              source={page}
              linkTarget="_blank"
            />
          </div>
        );
      } else {
        return (
          <div
            className="PagePreview"
            title="Click to add a text"
            onClick={() => setEdit(true)}
          >
            <Empty section="Page" />
          </div>
        );
      }
    }
  };

  return (
    <div className="DarkBase">
      <div className="PageInfo">
        <div className="WindowOptions">
          <GoBackButton />
          <CloseButton section={"notebooks"} />
        </div>
        <div className="Sections PageSections">
          <PageDisplay />
        </div>
      </div>
    </div>
  );
};
