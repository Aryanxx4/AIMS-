"use client";

import { AdminDashboard } from "@/components/admin_dashboard";
import { StudentRegister } from "@/components/student-register";
import { withAuth } from '@/components/withAuth';


function StudReg() {
  return (
    <div className="">
      <AdminDashboard />
      <div className="m-10 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <StudentRegister />
      </div>
    </div>
  );
}

export default withAuth(StudReg);


