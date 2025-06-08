"use client";

import * as React from "react";
import { z } from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useZustandStore } from "@/store/store"; // Assuming you have a Zustand store with auth info
import { Button } from "@/components/ui/button";

// Define constants for options
const branches = ["CSE", "EE", "Civil"];
const degrees = ["BTECH", "MTECH"];
const batches = [2022, 2023, 2024]; // Adjust as needed

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Enter a valid email." }),
  batch: z.string().nonempty({ message: "Please select a batch." }),
  branch: z.string().nonempty({ message: "Please select a branch." }),
  degree: z.string().nonempty({ message: "Please select a degree." }),
  facultyAdvisor: z
    .string()
    .nonempty({ message: "Please select a faculty advisor." }),
});

type FormData = z.infer<typeof formSchema>;

export function StudentRegister() {
  const [facultyAdvisors, setFacultyAdvisors] = React.useState<
    { _id: string; name: string; email: string }[]
  >([]);

  const { token } = useZustandStore(); // Get the token from your global state
  console.log("Token:", token);

  // Fetch faculty advisors from the backend
  React.useEffect(() => {
    const fetchFacultyAdvisors = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        console.log(headers);
        console.log("Fetching faculty advisors...");
        const res = await axios.get(
          "http://localhost:5000/api/users/faculty-advisors",
          {
            headers,
          }
        );
        console.log("Faculty advisors fetched successfully:", res.data);
        setFacultyAdvisors(res.data);
      } catch (err) {
        console.error("Error fetching faculty advisors:", err);
        // Handle error if necessary
      }
    };

    if (token) {
      fetchFacultyAdvisors();
    }
  }, [token]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      batch: "",
      branch: "",
      degree: "",
      facultyAdvisor: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Add the 'role' field as 'student'
      console.log("Registering student with data:", data);
      const postData = { ...data, role: "student" };
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        postData,
        {
          headers,
        }
      );
      console.log("Student registered successfully:", res.data);
      // Show success message or handle success as needed
      alert("Student registered successfully.");
      // Reset the form
      form.reset();
    } catch (err: any) {
      console.error("Error registering student:", err);
      // Handle error as needed
      alert(err.response?.data?.message || "Failed to register student.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter student's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter student's email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Batch */}
        <FormField
          control={form.control}
          name="batch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {batches.map((batch) => (
                      <SelectItem
                        key={batch.toString()}
                        value={batch.toString()}
                      >
                        {batch}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Branch */}
        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Degree */}
        <FormField
          control={form.control}
          name="degree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Degree Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {degrees.map((degree) => (
                      <SelectItem key={degree} value={degree}>
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Faculty Advisor */}
        <FormField
          control={form.control}
          name="facultyAdvisor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faculty Advisor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Respective Advisor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {facultyAdvisors.map((advisor) => (
                      <SelectItem key={advisor._id} value={advisor._id}>
                        {advisor.name} ({advisor.email})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Register Student</Button>
      </form>
    </Form>
  );
}
