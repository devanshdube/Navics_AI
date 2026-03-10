import React, { useState } from "react";
import bg from "../assets/1.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/user/userSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔎 Frontend validation
    if (!formData.login || !formData.password) {
      setError("Email / Mobile and Password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5555/auth/aegis/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ SUCCESS
      // if (res.data.status === "Success") {
      //   localStorage.setItem("token", res.data.token);
      //   localStorage.setItem("role", res.data.role);
      //   localStorage.setItem("user", JSON.stringify(res.data.user));
      //   dispatch(
      //     setUser({
      //       user: user,
      //       token: token,
      //     })
      //   );

      //   // 🔁 Role based redirect
      //   if (user.designation === "admin") {
      //     navigate("/admin", { replace: true });
      //   } else {
      //     navigate("/user", { replace: true });
      //   }
      //   // if (res.data.role === "admin") {
      //   //   // console.log("admin");
      //   //   navigate("/admin/");
      //   // } else {
      //   //   // console.log("student");
      //   //   navigate("/user/");
      //   // }
      // }
      if (res.data.status === "Success") {
        const user = res.data.user; // ✅ DEFINE user
        const token = res.data.token; // ✅ DEFINE token
        const role = res.data.role;

        // Optional storage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ Correct Redux dispatch
        dispatch(
          setUser({
            user: user,
            token: token,
          })
        );

        // 🔁 Role based navigation
        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/user", { replace: true });
        }
      }
    } catch (err) {
      console.error("LOGIN ERROR 👉", err);

      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 w-full h-full bg-black/60"></div>

      {/* Login Card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-xl p-8 w-11/12 max-w-md shadow-2xl">
        <h2 className="text-center font-extrabold text-xl font-bold text-[#fe634e] mb-5">
          AEGIS I-NET
        </h2>

        <h3 className="text-base font-semibold mb-4">Please sign in</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="login"
              placeholder="Email or Mobile"
              value={formData.login}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg focus:outline-[#fe634e] text-sm"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg focus:outline-[#fe634e] text-sm"
            />

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>
              <a className="text-[#fe634e] cursor-pointer">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#fe634e] hover:bg-[#d3240c] text-white py-2.5 rounded-lg transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4 text-sm">
          New student?{" "}
          <span className="text-[#fe634e] cursor-pointer">
            <Link to={"/register"}>Create your account</Link>
            {/* Create your account */}
          </span>
        </div>
      </div>
    </div>
  );
}
