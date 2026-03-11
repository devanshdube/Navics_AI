import React, { useState } from "react";
import bg from "../assets/razorpay-bg-visual-1.3x.avif";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/user/userSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!formData.login || !formData.password) {
    setError("Email / Mobile and Password are required");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5555/auth/navics/auth/login",
      formData
    );

    console.log("LOGIN RESPONSE 👉", res.data);

    if (res.data.status === "Success") {

      const { user, token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // dispatch(setUser({ user, token }));
      dispatch(setUser({ user: { ...user, role }, token }));

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "member") {
        navigate("/member", { replace: true });
      } else {
        navigate("/company", { replace: true });
      }

    } else {
      setError(res.data.message);
    }

  } catch (err) {

    console.error("LOGIN ERROR 👉", err);

    setError(
      err.response?.data?.message ||
      "Something went wrong. Please try again."
    );

  } finally {
    setLoading(false);
  }
};

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   if (!formData.login || !formData.password) {
  //     setError("Email / Mobile and Password are required");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const res = await axios.post(
  //       "http://localhost:5555/auth/aegis/auth/login",
  //       formData,
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     if (res.data.status === "Success") {
  //       const user = res.data.user;
  //       const token = res.data.token;
  //       const role = res.data.role;

  //       localStorage.setItem("token", token);
  //       localStorage.setItem("user", JSON.stringify(user));
  //       dispatch(setUser({ user, token }));

  //       if (role === "admin") {
  //         navigate("/admin", { replace: true });
  //       } else {
  //         navigate("/user", { replace: true });
  //       }
  //     }
  //   } catch (err) {
  //     console.error("LOGIN ERROR 👉", err);
  //     setError(err.response?.data?.message || "Something went wrong. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          display: flex;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── LEFT PANEL ── */
        .login-left {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .login-left-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transform: scale(1.04);
          transition: transform 8s ease;
          animation: subtleZoom 12s ease-in-out infinite alternate;
        }

        @keyframes subtleZoom {
          from { transform: scale(1.04); }
          to   { transform: scale(1.10); }
        }

        .login-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(10, 10, 30, 0.72) 0%,
            rgba(20, 20, 50, 0.55) 50%,
            rgba(254, 99, 78, 0.18) 100%
          );
        }

        .login-left-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem 3rem;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          background: #fe634e;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(254, 99, 78, 0.45);
        }

        .brand-icon svg {
          width: 22px;
          height: 22px;
          fill: white;
        }

        .brand-name {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 1.35rem;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .brand-name span {
          color: #fe634e;
        }

        .left-headline {
          margin-bottom: 3rem;
        }

        .left-headline h1 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }

        .left-headline h1 em {
          font-style: normal;
          color: #fe634e;
        }

        .left-headline p {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          max-width: 360px;
        }

        .left-badges {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.75);
          font-weight: 500;
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fe634e;
          box-shadow: 0 0 8px rgba(254,99,78,0.6);
          flex-shrink: 0;
        }

        /* ── RIGHT PANEL ── */
        .login-right {
          width: 480px;
          flex-shrink: 0;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2.8rem;
          box-shadow: -8px 0 40px rgba(0,0,0,0.12);
          animation: slideInRight 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .login-card {
          width: 100%;
          max-width: 360px;
        }

        .card-logo {
          width: 52px;
          height: 52px;
          background: #fe634e;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.6rem;
          box-shadow: 0 6px 24px rgba(254, 99, 78, 0.35);
        }

        .card-logo svg {
          width: 26px;
          height: 26px;
          fill: white;
        }

        .card-welcome {
          font-size: 0.82rem;
          color: #8a8a9a;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.4rem;
        }

        .card-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.7rem;
          font-weight: 800;
          color: #111827;
          line-height: 1.25;
          letter-spacing: -0.03em;
          margin-bottom: 2rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .input-wrap {
          position: relative;
        }

        .input-wrap input {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 2.8rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #fafafa;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
        }

        .input-wrap input:focus {
          border-color: #fe634e;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(254, 99, 78, 0.12);
        }

        .input-wrap input::placeholder {
          color: #b0b0c0;
        }

        .input-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: #b0b0c0;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .input-icon svg {
          width: 16px;
          height: 16px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.8;
        }

        .input-wrap input:focus ~ .input-icon,
        .input-wrap:focus-within .input-icon {
          color: #fe634e;
        }

        .row-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0.6rem 0 1.2rem;
          font-size: 0.82rem;
        }

        .remember-label {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #6b7280;
          cursor: pointer;
          user-select: none;
        }

        .remember-label input[type="checkbox"] {
          accent-color: #fe634e;
          width: 14px;
          height: 14px;
          cursor: pointer;
        }

        .forgot-link {
          color: #fe634e;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.15s;
        }

        .forgot-link:hover { opacity: 0.75; }

        .error-msg {
          background: #fff1f0;
          border: 1px solid #ffccc7;
          color: #d4380d;
          border-radius: 8px;
          padding: 0.65rem 0.9rem;
          font-size: 0.82rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-submit {
          width: 100%;
          padding: 0.85rem;
          background: #fe634e;
          color: #ffffff;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(254, 99, 78, 0.4);
          letter-spacing: 0.01em;
        }

        .btn-submit:hover:not(:disabled) {
          background: #e5452e;
          box-shadow: 0 6px 24px rgba(254, 99, 78, 0.5);
          transform: translateY(-1px);
        }

        .btn-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .register-link {
          text-align: center;
          margin-top: 1.4rem;
          font-size: 0.84rem;
          color: #6b7280;
        }

        .register-link a {
          color: #fe634e;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.15s;
        }

        .register-link a:hover { opacity: 0.75; }

        .divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 1.2rem 0;
          color: #d1d5db;
          font-size: 0.78rem;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        /* responsive */
        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right { width: 100%; padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="login-root">
        {/* ── LEFT PANEL ── */}
        <div className="login-left">
          <div
            className="login-left-bg"
            style={{ backgroundImage: `url(${bg})` }}
          />
          <div className="login-left-overlay" />
          <div className="login-left-content">
            {/* Top brand */}
            <div className="brand-logo">
              <div className="brand-icon">
                <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span className="brand-name">NaviCS<span>AI</span></span>
            </div>

            {/* Bottom headline */}
            <div className="left-headline">
              <h1>
                Empowering<br />
                <em>Smart Institutions</em><br />
                with Connected Learning
              </h1>
              <p>
                A unified platform for students, faculty, and administrators to
                collaborate, learn, and grow together.
              </p>
              <div className="left-badges">
                <div className="badge"><div className="badge-dot" />Secure Role-Based Access</div>
                <div className="badge"><div className="badge-dot" />Real-Time Collaboration Tools</div>
                <div className="badge"><div className="badge-dot" />Powerful Admin Dashboard</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="login-right">
          <div className="login-card">
            <div className="card-logo">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>

            <p className="card-welcome">Welcome back</p>
            <h2 className="card-title">Sign in to your account</h2>

            {error && (
              <div className="error-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <div className="input-wrap">
                  <input
                    type="text"
                    name="login"
                    placeholder="Email or Mobile number"
                    value={formData.login}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                </div>

                <div className="input-wrap">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                </div>
              </div>

              <div className="row-options">
                <label className="remember-label">
                  <input type="checkbox" /> Remember me
                </label>
                <a className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Signing in…" : "Continue →"}
              </button>
            </form>

            <div className="register-link">
              New student?{" "}
              <Link to="/register">Create your account</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


// import React, { useState } from "react";
// import bg from "../assets/1.jpg";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { setUser } from "../Redux/user/userSlice";

// export default function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [formData, setFormData] = useState({
//     login: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // 🔎 Frontend validation
//     if (!formData.login || !formData.password) {
//       setError("Email / Mobile and Password are required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:5555/auth/aegis/auth/login",
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (res.data.status === "Success") {
//         const user = res.data.user; // ✅ DEFINE user
//         const token = res.data.token; // ✅ DEFINE token
//         const role = res.data.role;

//         // Optional storage
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));

//         // ✅ Correct Redux dispatch
//         dispatch(
//           setUser({
//             user: user,
//             token: token,
//           })
//         );

//         // 🔁 Role based navigation
//         if (role === "admin") {
//           navigate("/admin", { replace: true });
//         } else {
//           navigate("/user", { replace: true });
//         }
//       }
//     } catch (err) {
//       console.error("LOGIN ERROR 👉", err);

//       setError(
//         err.response?.data?.message || "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 w-screen h-screen overflow-hidden">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage: `url(${bg})`,
//           backgroundSize: "cover",
//         }}
//       ></div>

//       {/* Dark Overlay */}
//       <div className="absolute inset-0 w-full h-full bg-black/60"></div>

//       {/* Login Card */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-xl p-8 w-11/12 max-w-md shadow-2xl">
//         <h2 className="text-center font-extrabold text-xl font-bold text-[#fe634e] mb-5">
//           AEGIS I-NET
//         </h2>

//         <h3 className="text-base font-semibold mb-4">Please sign in</h3>
//         <form onSubmit={handleSubmit}>
//           <div className="flex flex-col gap-3">
//             <input
//               type="text"
//               name="login"
//               placeholder="Email or Mobile"
//               value={formData.login}
//               onChange={handleChange}
//               className="w-full p-2.5 border rounded-lg focus:outline-[#fe634e] text-sm"
//             />

//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full p-2.5 border rounded-lg focus:outline-[#fe634e] text-sm"
//             />

//             <div className="flex justify-between items-center text-sm">
//               <label className="flex items-center gap-2">
//                 <input type="checkbox" />
//                 Remember me
//               </label>
//               <a className="text-[#fe634e] cursor-pointer">Forgot password?</a>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-[#fe634e] hover:bg-[#d3240c] text-white py-2.5 rounded-lg transition"
//             >
//               {loading ? "Signing in..." : "Sign in"}
//             </button>
//           </div>
//         </form>

//         <div className="text-center mt-4 text-sm">
//           New student?{" "}
//           <span className="text-[#fe634e] cursor-pointer">
//             <Link to={"/register"}>Create your account</Link>
//             {/* Create your account */}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }
