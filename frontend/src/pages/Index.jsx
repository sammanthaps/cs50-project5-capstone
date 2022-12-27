import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, Footer } from "../components/Components";

const Index = () => {
  return (
    <>
      <Sidebar />
      <div className="AppView">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Index;
