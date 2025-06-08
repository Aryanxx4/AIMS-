"use client";
import { AdminDashboard } from "@/components/admin_dashboard";
import { FacultyRegister } from "@/components/faculty-register";
import { withAuth } from '@/components/withAuth';

function FacReg() {
  return (
    <div className="">
      <AdminDashboard />
      <div className="m-10 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <FacultyRegister />
      </div>
    </div>
  );
}

export default withAuth(FacReg);
