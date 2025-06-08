// "use client";

// import { useState } from "react";
// import { RequestList } from "@/components/request_list"; // Assuming you have a RequestList component
// import { FacultyDashboard } from '@/components/faculty_dashboard'; // Adjust import path if needed

// export default function Page() {
//   // Define the columns for the student table    
//   const studentColumns = [
//     { header: "Name", accessor: "name" },
//     { header: "Faculty Advisor", accessor: "facultyAdvisor" },
//     { header: "Batch", accessor: "batch" },
//     { header: "Branch", accessor: "branch" },
//     { header: "Degree", accessor: "degree" },
//     { header: "Course Code", accessor: "courseCode" },
//     { header: "Action", accessor: "action" },
//   ];

//   // Define the columns for the faculty table
//   const facultyColumns = [
//     { header: "Name", accessor: "name" },
//     { header: "Faculty Advisor", accessor: "facultyAdvisor" },
//     { header: "Batch", accessor: "batch" },
//     { header: "Branch", accessor: "branch" },
//     { header: "Degree", accessor: "degree" },
//     { header: "Course Code", accessor: "courseCode" },
//     { header: "Action", accessor: "action" }
//   ];

//   // Sample data for students
//   const studentData = [
//     {
//       id: "1",
//       name: "John Doe",
//       facultyAdvisor: "Dr. Smith",
//       batch: 2023,
//       branch: "CSE",
//       degree: "BTECH",
//       courseCode: "CS101",
//     },
//   ];

//   // Sample data for faculty
//   const facultyData = [
//     {
//       id: "1",
//       name: "John Doo",
//       facultyAdvisor: "Dr. Smith",
//       batch: 2023,
//       branch: "CSE",
//       degree: "BTECH",
//       courseCode: "CS101",
//     },
//   ];

//   // Define the footer data
//   const studentFooterData = [`Total Students: ${studentData.length}`];
//   const facultyFooterData = [`Total Faculty: ${facultyData.length}`];

//   // Handlers for approve and reject actions for students
//   const handleApproveStudent = (id: string) => {
//     console.log(`Approved student request with ID: ${id}`);
//   };

//   const handleRejectStudent = (id: string) => {
//     console.log(`Rejected student request with ID: ${id}`);
//   };

//   // Handlers for approve and reject actions for faculty
//   const handleApproveFaculty = (id: string) => {
//     console.log(`Approved faculty request with ID: ${id}`);
//   };

//   const handleRejectFaculty = (id: string) => {
//     console.log(`Rejected faculty request with ID: ${id}`);
//   };

//   // State to manage the active tab (student or faculty)
//   const [activeTab, setActiveTab] = useState("student");

//   return (
//     <div className="relative">
//       <FacultyDashboard />
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-md">
//           <h1 className="text-2xl font-semibold text-center mb-6">Pending Approval Requests</h1>

//           {/* Tabs for switching between tables */}
//           <div className="mb-6 flex justify-center">
//             <button
//               className={`px-4 py-2 mr-2 ${activeTab === "student" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//               onClick={() => setActiveTab("student")}
//             >
//               Student Requests
//             </button>
//             <button
//               className={`px-4 py-2 ${activeTab === "faculty" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//               onClick={() => setActiveTab("faculty")}
//             >
//               Faculty Requests
//             </button>
//           </div>

//           {/* Ensure both tables are in the same container to maintain alignment */}
//           <div className="overflow-x-auto mb-8" style={{ minHeight: "300px" }}>
//             {activeTab === "student" && (
//               <RequestList
//                 columns={studentColumns}
//                 data={studentData}
//                 caption="Student Requests"
//                 onApprove={handleApproveStudent}
//                 onReject={handleRejectStudent}
//                 footerData={studentFooterData}
//               />
//             )}
//             {activeTab === "faculty" && (
//               <RequestList
//                 columns={facultyColumns}
//                 data={facultyData}
//                 caption="Faculty Requests"
//                 onApprove={handleApproveFaculty}
//                 onReject={handleRejectFaculty}
//                 footerData={facultyFooterData}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FacultyDashboard } from "@/components/faculty_dashboard";
import { RequestList } from "@/components/request_list"; // Ensure this component is properly set up
import { useZustandStore } from "@/store/store"; // Assuming you have a Zustand store with auth info
import { withAuth } from '@/components/withAuth';


function Page() {
  // Define the columns for the tables
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Faculty Advisor", accessor: "facultyAdvisor" },
    { header: "Batch", accessor: "batch" },
    { header: "Branch", accessor: "branch" },
    { header: "Degree", accessor: "degree" },
    { header: "Course Code", accessor: "courseCode" },
    { header: "Action", accessor: "action" },
  ];

  // State to hold the data fetched from the backend
  const [studentData, setStudentData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [studentFooterData, setStudentFooterData] = useState([]);
  const [facultyFooterData, setFacultyFooterData] = useState([]);

  // Loading and error states
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingFaculty, setLoadingFaculty] = useState(false);
  const [errorStudents, setErrorStudents] = useState<string | null>(null);
  const [errorFaculty, setErrorFaculty] = useState<string | null>(null);

  // State to manage the active tab (student or faculty)
  const [activeTab, setActiveTab] = useState("student");

  // Get the token and user info from your global state
  const { token } = useZustandStore();

  // Fetch data when the component mounts and when the active tab changes
  useEffect(() => {
    if (token) {
      if (activeTab === "student") {
        fetchInstructorPendingEnrollments();
      } else if (activeTab === "faculty") {
        fetchAdvisorPendingEnrollments();
      }
    }
  }, [activeTab, token]);

  // Fetch pending enrollment requests for the instructor's courses
  const fetchInstructorPendingEnrollments = async () => {
    setLoadingStudents(true);
    setErrorStudents(null);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(
        "http://localhost:5000/api/enrollments/instructor/pending",
        { headers }
      );
      const enrollments = response.data;

      // Map the API response to the expected data structure
      const formattedData = enrollments.map((enrollment: any) => ({
        id: enrollment._id,
        name: enrollment.student.name,
        facultyAdvisor:
          enrollment.student.facultyAdvisor?.name || "N/A", // Adjust if needed
        batch: enrollment.student.batch || "N/A",
        branch: enrollment.student.branch || "N/A",
        degree: enrollment.student.degree || "N/A",
        courseCode: enrollment.course.courseCode,
        courseTitle: enrollment.course.title,
      }));

      setStudentData(formattedData);
      setStudentFooterData([`Total Requests: ${formattedData.length}`]);
    } catch (error: any) {
      console.error("Error fetching instructor pending enrollments:", error);
      setErrorStudents(
        error.response?.data?.message ||
          "Error fetching instructor pending enrollments"
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  // Fetch pending enrollment requests needing faculty advisor's approval
  const fetchAdvisorPendingEnrollments = async () => {
    setLoadingFaculty(true);
    setErrorFaculty(null);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(
        "http://localhost:5000/api/enrollments/advisor/pending",
        { headers }
      );
      const enrollments = response.data;

      // Map the API response to the expected data structure
      const formattedData = enrollments.map((enrollment: any) => ({
        id: enrollment._id,
        name: enrollment.student.name,
        facultyAdvisor:
          enrollment.student.facultyAdvisor?.name || "N/A", // Adjust if needed
        batch: enrollment.student.batch || "N/A",
        branch: enrollment.student.branch || "N/A",
        degree: enrollment.student.degree || "N/A",
        courseCode: enrollment.course.courseCode,
        courseTitle: enrollment.course.title,
      }));

      setFacultyData(formattedData);
      setFacultyFooterData([`Total Requests: ${formattedData.length}`]);
    } catch (error: any) {
      console.error("Error fetching advisor pending enrollments:", error);
      setErrorFaculty(
        error.response?.data?.message || "Error fetching advisor pending enrollments"
      );
    } finally {
      setLoadingFaculty(false);
    }
  };

  // Handlers for approve and reject actions for students (Instructor approvals)
  const handleApproveStudent = async (id: string) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.put(
        `http://localhost:5000/api/enrollments/instructor/approve/${id}`,
        {},
        { headers }
      );
      console.log(`Approved student request with ID: ${id}`);

      // Refresh the data after approval
      fetchInstructorPendingEnrollments();
    } catch (error) {
      console.error("Error approving student request:", error);
    }
  };

  const handleRejectStudent = async (id: string) => {
    try {
      // Implement the reject API call if available
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.put(
        `http://localhost:5000/api/enrollments/instructor/reject/${id}`,
        {},
        { headers }
      );
      console.log(`Rejected student request with ID: ${id}`);

      // Refresh the data after rejection
      fetchInstructorPendingEnrollments();
    } catch (error) {
      console.error("Error rejecting student request:", error);
    }
  };

  // Handlers for approve and reject actions for faculty (Advisor approvals)
  const handleApproveFaculty = async (id: string) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.put(
        `http://localhost:5000/api/enrollments/advisor/approve/${id}`,
        {},
        { headers }
      );
      console.log(`Approved faculty request with ID: ${id}`);

      // Refresh the data after approval
      fetchAdvisorPendingEnrollments();
    } catch (error) {
      console.error("Error approving faculty request:", error);
    }
  };

  const handleRejectFaculty = async (id: string) => {
    try {
      // Implement the reject API call if available
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.put(
        `http://localhost:5000/api/enrollments/advisor/reject/${id}`,
        {},
        { headers }
      );
      console.log(`Rejected faculty request with ID: ${id}`);

      // Refresh the data after rejection
      fetchAdvisorPendingEnrollments();
    } catch (error) {
      console.error("Error rejecting faculty request:", error);
    }
  };

  return (
    <div className="relative">
      <FacultyDashboard />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Pending Approval Requests
          </h1>

          {/* Tabs for switching between tables */}
          <div className="mb-6 flex justify-center">
            <button
              className={`px-4 py-2 mr-2 ${
                activeTab === "student"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("student")}
            >
              Student Requests
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "faculty"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("faculty")}
            >
              Faculty Advisor Requests
            </button>
          </div>

          {/* Display loading or error messages */}
          {activeTab === "student" && (
            <>
              {loadingStudents ? (
                <div className="text-center py-10">Loading...</div>
              ) : errorStudents ? (
                <div className="text-center py-10 text-red-500">
                  Error: {errorStudents}
                </div>
              ) : (
                <RequestList
                  columns={columns}
                  data={studentData}
                  caption="Student Enrollment Requests"
                  onApprove={handleApproveStudent}
                  onReject={handleRejectStudent}
                  footerData={studentFooterData}
                />
              )}
            </>
          )}

          {activeTab === "faculty" && (
            <>
              {loadingFaculty ? (
                <div className="text-center py-10">Loading...</div>
              ) : errorFaculty ? (
                <div className="text-center py-10 text-red-500">
                  Error: {errorFaculty}
                </div>
              ) : (
                <RequestList
                  columns={columns}
                  data={facultyData}
                  caption="Advisor Approval Requests"
                  onApprove={handleApproveFaculty}
                  onReject={handleRejectFaculty}
                  footerData={facultyFooterData}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(Page); // Protect the route with authentication