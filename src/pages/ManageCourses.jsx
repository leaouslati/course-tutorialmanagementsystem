import React, { useEffect } from "react";
import { useNavigator } from "../hooks/useNavigator";
import { useAuth } from "../hooks/useAuth";

const ManageCourses = () => {
  const { navigate } = useNavigator();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Manage Courses</h1>
      <p>Welcome, {user.role}</p>
    </div>
  );
};

export default ManageCourses;