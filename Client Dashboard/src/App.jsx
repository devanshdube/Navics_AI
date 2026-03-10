// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import DashboardAdmin from "./Modules/Admin/DashboardAdmin";
import DashboardStudent from "./Modules/Student/DashboardStudent";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

function App() {
  const { currentUser } = useSelector((state) => state.user);

  const role = currentUser?.designation?.toLowerCase(); // ✅ matches your backend field

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={
            !currentUser ? (
              <Login />
            ) : role === "admin" ? (
              <DashboardAdmin />
            ) : role === "user" ? (
              <DashboardStudent />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !currentUser ? (
              <Register />
            ) : role === "admin" ? (
              <DashboardAdmin />
            ) : role === "user" ? (
              <DashboardStudent />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        {/* <Route
          path="/forgot-password"
          element={
            !currentUser ? (
              <ForgotPassword />
            ) : role === "admin" ? (
              <DashboardAdmin />
            ) : role === "user" ? (
              <DashboardStudent />
            ) : (
              <Navigate to="/" replace />
            )
          }
        /> */}
        {role === "admin" && (
          <Route path="/admin/*" element={<DashboardAdmin />} />
        )}
        {role === "user" && (
          <Route path="/user/*" element={<DashboardStudent />} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;

// import "./App.css";
// import Login from "./Auth/Login";
// import Register from "./Auth/Register";

// function App() {
//   return (
//     <>
//       {/* <Login /> */}
//       <Register />
//     </>
//   );
// }

// export default App;
