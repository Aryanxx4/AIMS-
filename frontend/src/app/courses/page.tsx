"use client";

import { NextPage } from 'next';
import {Course} from '../../components/course-card';
import CourseCard from '../../components/course-card';

const CoursesPage: NextPage = () => {
  const sampleCourse: Course = {
    _id: '1',
    courseCode: 'CS101',
    title: 'Introduction to Computer Science',
    description: 'A comprehensive introduction to computer science concepts.',
    instructor: {
      name: 'Dr. John Doe'
    },
    status: 'approved',
    branches: ['CSE', 'EE'],
    batches: [2022, 2023],
    degrees: ['BTECH', 'MTECH'],
  };

  const handleEdit = (course: Course) => {
    console.log('Edit course:', course);
  };

  const handleDelete = (courseId: string) => {
    console.log('Delete course:', courseId);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Courses
        </h1>
        <CourseCard
          course={sampleCourse}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default CoursesPage;