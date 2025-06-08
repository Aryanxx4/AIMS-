"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { AdminDashboard } from "@/components/admin_dashboard";
import { TableList } from "@/components/table_list";
import { useZustandStore } from "@/store/store"; // Assuming you have a Zustand store with auth info
import Loading from "../../components/loading";
import { withAuth } from '@/components/withAuth';


const studentColumns = [
  { header: "Name", accessor: "name", className: "font-medium" },
  { header: "Email", accessor: "email" },
  { header: "Branch", accessor: "branch" },
  { header: "Degree", accessor: "degree" },
  { header: "Batch", accessor: "batch", className: "text-right" },
];

const facultyColumns = [
  { header: "Name", accessor: "name", className: "font-medium" },
  { header: "Email", accessor: "email" },
  { header: "Department", accessor: "department" },
  // { header: "Designation", accessor: "designation" },
  // {
  //   header: "Experience (Years)",
  //   accessor: "yearsOfExperience",
  //   className: "text-right",
  // },
];

function Admin() {
  const [selectedView, setSelectedView] = useState<"students" | "faculty">(
    "students"
  );
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useZustandStore(); // Get the token from your global state

  useEffect(() => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const fetchData = async () => {
      setLoading(true);
      await delay(1000); // Delay for 1 second (adjust the time as needed)
      setError(null);
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        if (selectedView === "students") {
          const res = await axios.get(
            "http://localhost:5000/api/users/students",
            {
              headers,
            }
          );
          setStudents(res.data);
        } else {
          const res = await axios.get(
            "http://localhost:5000/api/users/faculty-advisors",
            {
              headers,
            }
          );
          setFaculty(res.data);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedView, token]);

  return (
    <div className="">
        <>
          <AdminDashboard />
          {/* <p className="m-4 self-center text-4xl font-bold">Admin DashBoard</p> */}
          <div className="m-4 flex gap-4 ">
            <Button
              variant={selectedView === "students" ? "default" : "outline"}
              onClick={() => setSelectedView("students")}
            >
              Students
            </Button>
            <Button
              variant={selectedView === "faculty" ? "default" : "outline"}
              onClick={() => setSelectedView("faculty")}
            >
              Faculty
            </Button>
          </div>
          <div className="m-20 justify-evenly">
            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
              <Loading />
            ) : selectedView === "students" ? (
              <TableList
                columns={studentColumns}
                data={students}
                caption="List of Students"
                footerData={[
                  "",
                  "",
                  "",
                  "Total Students",
                  `${students.length}`,
                ]}
              />
            ) : (
              <TableList
                columns={facultyColumns}
                data={faculty}
                caption="List of Faculty"
                footerData={["", "", "", "Total Faculty", `${faculty.length}`]}
              />
            )}
          </div>
        </>
    </div>
  );
}


export default withAuth(Admin);
