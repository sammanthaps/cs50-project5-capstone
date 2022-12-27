import React from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAuth, AuthProvider } from "./authentication/AuthService";
import "./assets/style/App.css";
import { Login, Register } from "./pages/Authentication";
import Index from "./pages/Index";
import Workspace from "./pages/Workspace";
import UserSettings from "./pages/Settings";
import { Notebooks, GetSubjects, GetPages, GetAPage } from "./pages/Notebooks";
import { Boards, GetBoard } from "./pages/Boards";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<Login />}>
          <Route index element={<Login />} />
          <Route path="register/" element={<Register />} />
        </Route>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Index />
            </RequireAuth>
          }
        >
          <Route index element={<Workspace />} />
          <Route path="boards/" element={<Boards />}>
            <Route path=":board_id/" element={<GetBoard />} />
          </Route>
          <Route path="notebooks/" element={<Notebooks />}>
            <Route path=":book_id/subjects" element={<GetSubjects />} />
            <Route
              path=":book_id/subjects/:subject_id/pages"
              element={<GetPages />}
            />
            <Route
              path=":book_id/subjects/:subject_id/pages/:page_id/"
              element={<GetAPage />}
            />
          </Route>
          <Route path="settings/" element={<UserSettings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
