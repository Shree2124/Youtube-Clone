import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, setAuth } from "../../redux/slices/userSlice";
import axiosInstance from "../../api/axios.js";

const SignIn = () => {
  const [activeTab, setActiveTab] = useState("signin"); // "signin" or "signup"
  const [name1, setName1] = useState("");
  const [password1, setPassword1] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name1 || !password1) {
      setError("Please fill all fields");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      const res = await axiosInstance.post(
        "/users/login",
        { name: name1, password: password1 },
        { withCredentials: true }
      );
      
      // Update Redux store directly without page reload
      dispatch(setUser(res.data.data));
      dispatch(setAuth(true));
      
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      const res = await axiosInstance.post("/users/register", {
        name,
        email,
        password,
      });
      
      // After successful registration, automatically log the user in
      if (res.data.data) {
        try {
          const loginRes = await axiosInstance.post(
            "/users/login",
            { name, password },
            { withCredentials: true }
          );
          
          dispatch(setUser(loginRes.data.data));
          dispatch(setAuth(true));
        } catch (loginErr) {
          console.error("Auto-login failed after registration:", loginErr);
          // Continue with navigation even if auto-login fails
        }
      }
      
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-56px)]">
      {/* Main container */}
      <div className="bg-inherit px-8 py-6 border border-gray-300 dark:border-gray-700 rounded-md w-full max-w-md">
        {/* Tabs */}
        <div className="flex mb-6 border-gray-300 dark:border-gray-700 border-b">
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "signin" 
                ? "border-b-2 border-blue-600 text-blue-600" 
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("signin")}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "signup" 
                ? "border-b-2 border-blue-600 text-blue-600" 
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 mb-4 p-2 rounded text-red-500 text-sm">
            {error}
          </div>
        )}
        
        {activeTab === "signin" ? (
          // Sign In Form
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                className="bg-transparent p-2.5 border border-gray-300 dark:border-gray-700 focus:border-blue-500 rounded outline-none w-full"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                className="bg-transparent p-2.5 border border-gray-300 dark:border-gray-700 focus:border-blue-500 rounded outline-none w-full"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gray-200 dark:bg-gray-700 hover:opacity-90 disabled:opacity-50 p-2.5 rounded w-full font-medium text-gray-700 dark:text-gray-300 transition cursor-pointer"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
            <div className="text-gray-500 dark:text-gray-400 text-sm text-center">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setActiveTab("signup")}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </div>
          </form>
        ) : (
          // Sign Up Form
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent p-2.5 border border-gray-300 dark:border-gray-700 focus:border-blue-500 rounded outline-none w-full"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent p-2.5 border border-gray-300 dark:border-gray-700 focus:border-blue-500 rounded outline-none w-full"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent p-2.5 border border-gray-300 dark:border-gray-700 focus:border-blue-500 rounded outline-none w-full"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gray-200 dark:bg-gray-700 hover:opacity-90 disabled:opacity-50 p-2.5 rounded w-full font-medium text-gray-700 dark:text-gray-300 transition cursor-pointer"
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
            <div className="text-gray-500 dark:text-gray-400 text-sm text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setActiveTab("signin")}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex items-center mt-6 text-gray-500 dark:text-gray-400 text-sm">
        <span>English(USA)</span>
        <div className="flex gap-4 ml-6">
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;