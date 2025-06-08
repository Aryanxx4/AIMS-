// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { StudentDashboard } from "@/components/student_dashboard";
// import { TableList } from "@/components/table_list";
// import { useZustandStore } from "@/store/store"; // Assuming you have a Zustand store with auth info
// import Loading from "../../components/loading";
// import { ProfileCard } from "@/components/profile";
// import CourseCard, { Course } from "@/components/course-card";

// export default function Student() {
//   const [selectedView, setSelectedView] = useState<"students" | "faculty">(
//     "students"
//   );
//   const [students, setStudents] = useState([]);
//   const [faculty, setFaculty] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const { token } = useZustandStore(); // Get the token from your global state

//   // Example course data
//   const courses: Course[] = [
//     {
//       _id: "1",
//       courseCode: "CS101",
//       title: "Introduction to Computer Science",
//       description: "Learn the basics of programming and computer science.",
//       instructor: { name: "Prof. Alice" },
//       status: "approved",
//       branches: ["CSE"],
//       batches: [2023, 2024],
//       degrees: ["BTECH"],
//     },
//     {
//       _id: "2",
//       courseCode: "EE201",
//       title: "Electrical Circuits",
//       description: "An in-depth study of electrical circuits and systems.",
//       instructor: { name: "Prof. Bob" },
//       status: "pending",
//       branches: ["EE"],
//       batches: [2022],
//       degrees: ["BTECH", "MTECH"],
//     },
//     {
//       _id: "3",
//       courseCode: "CIV301",
//       title: "Structural Analysis",
//       description:
//         "Understand the mechanics of structures in civil engineering.",
//       instructor: { name: "Dr. Carol" },
//       status: "approved",
//       branches: ["Civil"],
//       batches: [2023],
//       degrees: ["BTECH"],
//     },
//     {
//       _id: "4",
//       courseCode: "CIV301",
//       title: "Structural Analysis",
//       description:
//         "Understand the mechanics of structures in civil engineering.",
//       instructor: { name: "Dr. Carol" },
//       status: "approved",
//       branches: ["Civil"],
//       batches: [2023],
//       degrees: ["BTECH"],
//     },
//   ];

//   const handleEdit = (course: Course) => {
//     console.log("Editing course:", course);
//   };

//   const handleDelete = (courseId: string) => {
//     console.log("Deleting course with ID:", courseId);
//   };

//   useEffect(() => {
//     const delay = (ms: number) =>
//       new Promise((resolve) => setTimeout(resolve, ms));

//     const fetchData = async () => {
//       setLoading(true);
//       await delay(1000); // Delay for 1 second (adjust the time as needed)
//       setError(null);
//       try {
//         const headers = {
//           Authorization: `Bearer ${token}`,
//         };
//         if (selectedView === "students") {
//           const res = await axios.get(
//             "http://localhost:5000/api/users/students",
//             {
//               headers,
//             }
//           );
//           setStudents(res.data);
//         } else {
//           const res = await axios.get(
//             "http://localhost:5000/api/users/faculty-advisors",
//             {
//               headers,
//             }
//           );
//           setFaculty(res.data);
//         }
//       } catch (err: any) {
//         console.error("Error fetching data:", err);
//         setError(err.response?.data?.message || "Error fetching data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [selectedView, token]);

//   return (
//     <div className="">
//         <>
//           <StudentDashboard />
//           <div className="py-10 w-1/3">
//             <ProfileCard
//               name="John Doe"
//               email="johndoe@example.com"
//               branch="Computer Science"
//               batch="2023"
//               degree="B.Tech"
//               facultyAdvisor="Dr. Smith"
//             />
//           </div>
//           <div className="text-2xl font-bold mx-14">Courses Enrolled</div>
//           {/* Grid of Courses */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-10 py-6">
//             {courses.map((course) => (
//               <CourseCard
//                 key={course._id}
//                 course={course}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </div>
//         </>
     
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { StudentDashboard } from "@/components/student_dashboard";
import { useZustandStore } from "@/store/store"; // Assuming you have a Zustand store with auth info
import { ProfileCard } from "@/components/profile";
import CourseCard, { Course } from "@/components/course-card";
import { withAuth } from '@/components/withAuth';


function Student() {
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorCourses, setErrorCourses] = useState<string | null>(null);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);

  const { token } = useZustandStore(); // Get the token from your global state

  const [ongoingCourses, setOngoingCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);

  // State for the student's profile
  const [studentProfile, setStudentProfile] = useState<any>(null);

  // Fetch the student's profile data
  useEffect(() => {
    const fetchStudentProfile = async () => {
      setLoadingProfile(true);
      setErrorProfile(null);
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          { headers }
        );

        // Update the state with the fetched profile data
        setStudentProfile(response.data);
      } catch (err: any) {
        console.error("Error fetching student profile:", err);
        setErrorProfile(
          err.response?.data?.message || "Error fetching student profile"
        );
      } finally {
        setLoadingProfile(false);
      }
    };
    if(token){
      fetchStudentProfile();
    }
  }, [token]);

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoadingCourses(true);
      setErrorCourses(null);
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(
          "http://localhost:5000/api/enrollments/my-courses",
          { headers }
        );

        // Destructure the ongoing and completed courses from the response
        const { ongoingCourses, completedCourses } = response.data;
        console.log(ongoingCourses, completedCourses);

        // Update the state with the fetched courses
        setOngoingCourses(ongoingCourses);
        setCompletedCourses(completedCourses);
      } catch (err: any) {
        console.error("Error fetching enrolled courses:", err);
        setErrorCourses(
          err.response?.data?.message || "Error fetching courses"
        );
      } finally {
        setLoadingCourses(false);
      }
    };
    if(token){
      fetchEnrolledCourses();
    }
  }, [token]);

  return (
    <div className="">
      {(loadingCourses || loadingProfile) ? (
        <div className="text-center py-10">Loading...</div>
      ) : (errorCourses || errorProfile) ? (
        <div className="text-center py-10 text-red-500">
          Error: {errorCourses || errorProfile}
        </div>
      ) : (
        <>
          <StudentDashboard />
          <div className="py-10 w-1/3">
            <ProfileCard
              name={studentProfile?.name || "Student Name"}
              email={studentProfile?.email || "student@example.com"}
              branch={studentProfile?.branch || "Branch"}
              batch={studentProfile?.batch || "Batch"}
              degree={studentProfile?.degree || "Degree"}
              facultyAdvisor={studentProfile?.facultyAdvisor?.name || "Faculty Advisor"}
            />
          </div>
          <div className="text-2xl font-bold mx-14">Courses Enrolled</div>
          {/* Grid of Ongoing Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-10 py-6">
            {ongoingCourses.map((course: Course) => (
              <CourseCard
                key={course._id}
                course={course}
              />
            ))}
          </div>

          <div className="text-2xl font-bold mx-14">Completed Courses</div>
          {/* Grid of Completed Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-10 py-6">
            {completedCourses.map((course: Course) => (
              <CourseCard
                key={course._id}
                course={course}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default withAuth(Student);