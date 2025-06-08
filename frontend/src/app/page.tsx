import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // Redirect to /login
  return null; // This won't render because of the redirect
}
