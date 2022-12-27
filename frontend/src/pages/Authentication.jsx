import React, { useContext } from "react";
import { Navigate, useNavigate, useLocation, Outlet } from "react-router-dom";
import { AuthContext } from "../authentication/AuthService";
import { cancelBtn, cancelBtnFill } from "../components/Icons";

export const Login = () => {
  const { login, authToken, alert, setAlert } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (!authToken) {
    return (
      <>
        <div className="AuthenticationPage">
          <section className="AuthLogo">
            <h1>Capstone</h1>
            <p>A tool to keep your tasks and notes together.</p>
          </section>
          <section className="LogInForm">
            <div className="FormAlert">
              {alert["login"] && (
                <div className="Message">{alert["message"]}</div>
              )}
            </div>
            <form onSubmit={login}>
              <div>
                <input type="email" name="email" placeholder="Email" required />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </div>
              <div>
                <input type="submit" value="Log In" className="SubmitBtn" />
              </div>
            </form>
            <div className="FormChangeBtn">
              <div>
                <input
                  type="button"
                  value="Register"
                  onClick={() => {
                    navigate("/auth/register");
                    setAlert({});
                  }}
                />
              </div>
            </div>
          </section>
        </div>
        <Outlet />
      </>
    );
  }
  return <Navigate replace to="/" state={{ from: location }} />;
};

export const Register = () => {
  const { register, authToken, alert, setAlert } = useContext(AuthContext); // errors
  const location = useLocation();
  const navigate = useNavigate();

  if (!authToken) {
    return (
      <div className="DarkBase">
        <section className="SignUpForm">
          <div className="FormHeader">
            <span className="FormTitle">Create a new Account</span>
            <span className="FormClose">
              <img
                src={cancelBtn}
                alt="Close"
                title="Close"
                className="WorkspaceIcons"
                onMouseEnter={(e) => (e.target.src = cancelBtnFill)}
                onMouseLeave={(e) => (e.target.src = cancelBtn)}
                onClick={() => {
                  navigate("/auth");
                  setAlert({});
                }}
              />
            </span>
          </div>

          <div className="FormAlert">
            {alert["signup"] && (
              <div className="Message">{alert["message"]}</div>
            )}
          </div>
          <form onSubmit={register}>
            <div className="FormName">
              <input
                type="text"
                name="first"
                placeholder="First Name"
                maxLength={20}
              />
              <input
                type="text"
                name="last"
                placeholder="Last Name"
                maxLength={20}
              />
            </div>
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                maxLength={40}
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                maxLength={50}
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="confirmation"
                placeholder="Confirm Password"
                required
              />
            </div>

            <div>
              <input type="submit" value="Sign Up" className="SubmitBtn" />
            </div>
          </form>
        </section>
      </div>
    );
  }
  return <Navigate replace to="/" state={{ from: location }} />;
};
