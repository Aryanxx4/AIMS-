"use client";

import * as React from "react";
import { z } from "zod";
import axios from "axios";
import classnames from "classnames";
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
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useZustandStore } from "../store/store";

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Enter a valid email." }),
});

type FormData = z.infer<typeof formSchema>;

export function FacultyRegister() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { token } = useZustandStore(); // Get the token from your global state

  const onSubmit = async (data: FormData) => {
    try {
      // Add the 'role' field as 'faculty'
    
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const postData = { ...data, role: "faculty" };
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        postData, // Pass postData as the request body
        { headers } // Pass headers as the config
      );
      console.log("Faculty registered successfully:", res.data);
      // Show success message or handle success as needed
      alert("Faculty registered successfully.");
      // Reset the form
      form.reset();
    } catch (err: any) {
      console.error("Error registering Faculty:", err);
      // Handle error as needed
      alert(err.response?.data?.message || "Failed to register Faculty.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter faculty's name" {...field} />
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
                  placeholder="Enter faculty's email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Register Faculty</Button>
      </form>
    </Form>
  );
}

// SelectItem component for Radix UI Select
const SelectItem = React.forwardRef(
  (
    {
      children,
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof Select.Item>,
    forwardedRef: React.Ref<HTMLDivElement>
  ) => {
    return (
      <Select.Item
        className={classnames("SelectItem", className)}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

SelectItem.displayName = "SelectItem";
