import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ConfigPage from "./pages/ConfigPage";
import QueryEditorPage from "./pages/QueryEditorPage";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* 2nd Page: Admin Only Configuration */}
      <Route 
        path="/db-config" 
        element={token && role === "admin" ? <ConfigPage /> : <Navigate to="/login" />} 
      />

      {/* 3rd Page: Query Editor for everyone */}
      <Route 
        path="/query" 
        element={token ? <QueryEditorPage /> : <Navigate to="/login" />} 
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;