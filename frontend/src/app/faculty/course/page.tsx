"use client";

import { AddCourse } from "@/components/CourseForm"; // Adjust the path as per your folder structure
import { FacultyDashboard } from '@/components/faculty_dashboard'; // Adjust import path if needed
import { withAuth } from '@/components/withAuth';

function Page() {
  return (
    <div className="">
      <FacultyDashboard/>
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Course Registration</h1>
        {/* Render the AddCourse component */}
        <AddCourse />
      </div>
    </div>
    </div>
  );
}

export default withAuth(Page); // Protect the route with authentication
