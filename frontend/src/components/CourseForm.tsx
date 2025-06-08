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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea"; 
import { useZustandStore } from "@/store/store"; // Adjust the path as needed

// Define constants for options
const branches = ["CSE", "EE", "Civil"];
const degrees = ["BTECH", "MTECH"];
const batches = ["2022", "2023", "2024"];

// Define the form schema using Zod
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  courseCode: z.string().min(2, { message: "Course code must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  branches: z.array(z.string()).nonempty({ message: "Please select at least one branch." }),
  degrees: z.array(z.string()).nonempty({ message: "Please select at least one degree." }),
  batches: z.array(z.string()).nonempty({ message: "Please select at least one batch." }),
});

type FormData = z.infer<typeof formSchema>;

export function AddCourse() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      courseCode: "",
      description: "",
      branches: [branches[0]],
      degrees: [degrees[0]],
      batches: [batches[0]],
    },
  });

  const { token } = useZustandStore(); // Get the authentication token

  const onSubmit = async (data: FormData) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      console.log(headers);

      const res = await axios.post("http://localhost:5000/api/courses/", data, {
        headers,
      });
      console.log("Course added successfully:", res.data);
      alert("Course added successfully.");
      form.reset();
    } catch (err: any) {
      console.error("Error adding course:", err);
      alert(err.response?.data?.message || "Failed to add course.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="Course Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Course Code */}
        <FormField
          control={form.control}
          name="courseCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Code</FormLabel>
              <FormControl>
                <Input placeholder="Course Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Course Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Branches */}
        <FormItem>
          <FormLabel>Branches</FormLabel>
          <div className="space-y-2">
            {branches.map((branch) => (
              <FormField
                key={branch}
                control={form.control}
                name="branches"
                render={() => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={form.watch("branches").includes(branch)}
                        onCheckedChange={(checked) => {
                          const currentBranches = form.getValues("branches") || [];
                          form.setValue(
                            "branches",
                            checked
                              ? (currentBranches.length ? [...currentBranches, branch] : [branch])
                              : currentBranches.filter((b) => b !== branch)
                          );
                        }}
                      />
                    </FormControl>
                    <FormLabel>{branch}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </FormItem>

        {/* Degrees */}
        <FormItem>
          <FormLabel>Degrees</FormLabel>
          <div className="space-y-2">
            {degrees.map((degree) => (
              <FormField
                key={degree}
                control={form.control}
                name="degrees"
                render={() => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={form.watch("degrees").includes(degree)}
                        onCheckedChange={(checked) => {
                          const currentDegrees = form.getValues("degrees") || [];
                          form.setValue(
                            "degrees",
                            checked
                              ? [...currentDegrees, degree]
                              : currentDegrees.filter((d) => d !== degree)
                          );
                        }}
                      />
                    </FormControl>
                    <FormLabel>{degree}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </FormItem>

        {/* Batches */}
        <FormItem>
          <FormLabel>Batches</FormLabel>
          <div className="space-y-2">
            {batches.map((batch) => (
              <FormField
                key={batch}
                control={form.control}
                name="batches"
                render={() => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={form.watch("batches").includes(batch)}
                        onCheckedChange={(checked) => {
                          const currentBatches = form.getValues("batches") || [];
                          form.setValue(
                            "batches",
                            checked
                              ? [...currentBatches, batch]
                              : currentBatches.filter((b) => b !== batch)
                          );
                        }}
                      />
                    </FormControl>
                    <FormLabel>{batch}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </FormItem>

        <Button type="submit">Add Course</Button>
      </form>
    </Form>
  );
}