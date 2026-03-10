import React, { useState } from "react";
import bg from "../assets/1.jpg";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Register() {
  const educationLevels = [
    "B.Tech",
    "B.E.",
    "Diploma",
    "M.Tech",
    "B.Sc",
    "M.Sc",
    "BCA",
    "MCA",
    "BBA",
    "MBA",
    "High School",
    "Intermediate",
    "PhD",
    "ITI",
  ];

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    college_name: "",
    course: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 🔍 Frontend validation
    const { name, email, mobile, college_name, course, password } = formData;

    if (!name || !email || !mobile || !college_name || !course || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5555/auth/aegis/auth/registerStudent",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "Success") {
        setSuccess("Registration successful. Please wait for admin approval.");

        // Reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          college_name: "",
          course: "",
          password: "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
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
      <div className="absolute inset-0 w-full h-full bg-[#161c2dbf]"></div>

      {/* Login Card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-xl p-8 w-11/12 max-w-md shadow-2xl">
        <h2 className="text-center font-extrabold text-xl font-bold text-[#1049e5bf] mb-5">
          AEGIS I-NET
        </h2>

        <h3 className="text-start text-base font-semibold mb-4">
          Register your account
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg focus:outline-[#1049e5bf] text-sm"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg focus:outline-[#1049e5bf] text-sm"
            />

            <input
              type="text"
              name="mobile"
              placeholder="Enter Your Mobile"
              value={formData.mobile}
              onChange={handleChange}
              maxLength={10}
              minLength={10}
              className="w-full p-2.5 border rounded-lg focus:outline-[#1049e5bf] text-sm"
            />

            <input
              type="text"
              name="college_name"
              placeholder="Enter College Name"
              value={formData.college_name}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg focus:outline-[#1049e5bf] text-sm"
            />

            <input
              list="educationlist"
              name="course"
              placeholder="Select Education"
              value={formData.course}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg focus:outline-[#1049e5bf] text-sm"
            />

            <datalist id="educationlist">
              {educationLevels.map((item, index) => (
                <option key={index} value={item} />
              ))}
            </datalist>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2.5 pr-10 border rounded-lg focus:outline-[#1049e5bf] text-sm"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1049e5bf] hover:bg-[#02091dbf] text-white py-2.5 rounded-lg transition"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4 text-sm">
          <span className="text-[#000000] cursor-pointer">
            <Link to={"/"}>Go Back To Login</Link>
            {/* Create your account */}
          </span>
        </div>
      </div>
    </div>
  );
}
