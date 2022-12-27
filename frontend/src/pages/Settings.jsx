import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../authentication/AuthService";

const UserSettings = () => {
  const [user, setUser] = useState({});
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch("api/settings", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setUser(result);
      }
    };

    getUser();
  }, [authToken]);

  return (
    <div className="UserSettings">
      <section className="UserPic">
        <figure>
          <img
            src="https://img.icons8.com/fluency-systems-regular/96/FF003F/user.png"
            alt=""
          />
        </figure>
      </section>

      <section className="UserInfo">
        <form>
          <div className="UserName">
            <fieldset>
              <legend>First Name</legend>
              <input
                type="text"
                name="first"
                id="first"
                defaultValue={user.first}
                placeholder="First Name"
                maxLength={20}
              />
            </fieldset>

            <fieldset>
              <legend>Last Name</legend>
              <input
                type="text"
                name="last"
                id="last"
                defaultValue={user.last}
                placeholder="Last Name"
                maxLength={20}
              />
            </fieldset>
          </div>
          <fieldset>
            <legend>Username</legend>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={user.username}
              maxLength={40}
            />
          </fieldset>
          <fieldset>
            <legend>Email</legend>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={user.email}
              maxLength={50}
            />
          </fieldset>
          <div className="SaveProfileBtn">
            <input type="submit" value="Update Changes" />
          </div>
        </form>
      </section>
    </div>
  );
};

export default UserSettings;
