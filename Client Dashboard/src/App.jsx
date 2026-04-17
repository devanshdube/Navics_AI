// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DashboardAdmin from "./Modules/Admin/DashboardAdmin";
import DashboardStudent from "./Modules/Student/DashboardStudent";
import Login from "./Auth/Login";
import { logout } from "./Redux/user/userSlice";
import { persistor } from "./Redux/store";
import DashboardCompany from "./Modules/Companies/DashboardCompany";

// JWT token decode karo bina library ke (base64)
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp Unix timestamp (seconds) hota hai
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true; // Invalid token = expired maano
  }
}

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // App load hone pe token expiry check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      // Token expire ho gaya — sab clear karo
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(logout());
      persistor.purge();
    }
  }, [dispatch]);

  const role = currentUser?.role?.toLowerCase();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={
            !currentUser ? <Login /> : <Navigate to={`/${role}`} replace />
          }
        />
        {/* <Route
          path="/register"
          element={
            !currentUser ? <Register /> : <Navigate to={`/${role}`} replace />
          }
        /> */}

        {role === "admin" && (
          <Route path="/admin/*" element={<DashboardAdmin />} />
        )}
        {role === "member" && (
          <Route path="/member/*" element={<DashboardStudent />} />
        )}
        {role === "company" && (
          <Route path="/company/*" element={<DashboardCompany />} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;