import React from "react";

export interface Course {
  _id?: string;
  courseCode: string;
  title: string;
  description: string;
  instructor: {
    name: string;
  };
  status: "pending" | "approved";
  branches: Array<"CSE" | "EE" | "Civil">;
  batches: number[];
  degrees: Array<"BTECH" | "MTECH">;
}

interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
      {/* Card Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {course.title}
            </h2>
            <div className="space-y-0.5 mt-1">
              <p className="text-xs text-gray-500">Code: {course.courseCode}</p>
              <div className="flex items-center text-xs text-gray-500">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{course.instructor.name}</span>
              </div>
            </div>
          </div>
          <div
            className={`px-2 py-0.5 rounded-full text-xs ${
              course.status === "approved"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="px-4 py-3">
        <div className="mb-3">
          <p className="text-xs text-gray-600">{course.description}</p>
        </div>

        {/* Flex Row for Branches, Batches, and Degrees */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          {/* Branches */}
          <div className="flex-1">
            <h3 className="text-xs font-medium text-gray-700 mb-1">Branches</h3>
            <div className="flex flex-wrap gap-1.5">
              {course.branches.map((branch) => (
                <span
                  key={branch}
                  className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full"
                >
                  {branch}
                </span>
              ))}
            </div>
          </div>

          {/* Batches */}
          <div className="flex-1">
            <h3 className="text-xs font-medium text-gray-700 mb-1">Batches</h3>
            <div className="flex flex-wrap gap-1.5">
              {course.batches.map((batch) => (
                <span
                  key={batch}
                  className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded-full"
                >
                  {batch}
                </span>
              ))}
            </div>
          </div>

          {/* Degrees */}
          <div className="flex-1">
            <h3 className="text-xs font-medium text-gray-700 mb-1">Degrees</h3>
            <div className="flex flex-wrap gap-1.5">
              {course.degrees.map((degree) => (
                <span
                  key={degree}
                  className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
                >
                  {degree}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      {(onEdit || onDelete) && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(course)}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
            >
              Edit
            </button>
          )}
          {onDelete && course._id && (
            <button
              onClick={() => onDelete(course._id!)}
              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 focus:outline-none"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseCard;
