import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [alert, setAlert] = useState({});

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });
    const result = await response.json();

    if (response.ok) {
      setAuthTokens(result);
      localStorage.setItem("authTokens", JSON.stringify(result));
      localStorage.setItem("data-color-mode", "light");
      navigate("/");
    } else {
      setAlert({
        login: true,
        message: result["error"],
      });
    }
  };

  const logout = useCallback(() => {
    setAuthTokens(null);
    setAlert({});
    localStorage.clear();
    navigate("/");
  }, [navigate]);

  const register = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: e.target.first.value,
        last_name: e.target.last.value,
        username: e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value,
        confirmation: e.target.confirmation.value,
      }),
    });
    const result = await response.json();

    if (response.ok) {
      setAuthTokens(result);
      localStorage.setItem("authTokens", JSON.stringify(result));
      localStorage.setItem("data-color-mode", "light");
      navigate("/");
    } else {
      setAlert({
        signup: true,
        message: result["error"],
      });
    }
  };

  useEffect(() => {
    const updateToken = async () => {
      const response = await fetch("/api/login/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: authTokens?.refresh,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setAuthTokens(result);
        localStorage.setItem("authTokens", JSON.stringify(result));
      } else {
        logout();
      }
    };
    // 7 hours
    let delay = 25200000;

    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, delay);
    return () => clearInterval(interval);
  }, [authTokens, logout, navigate]);

  let value = {
    authToken: authTokens?.access,
    login: login,
    logout: logout,
    register: register,
    alert: alert,
    setAlert: setAlert,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const RequireAuth = ({ children }) => {
  let { authToken } = useContext(AuthContext);
  const location = useLocation();

  if (!authToken) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
};
