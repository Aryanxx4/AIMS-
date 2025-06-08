"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // If you're using Next.js
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useZustandStore } from "../store/store";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // Local state variables
  const [email, setEmail] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zustand store actions
  const { setUser, setToken, setIsSignedIn } = useZustandStore();

  // Router for redirection (Next.js)
  const router = useRouter();

  // Handle email submission to request OTP
  const requestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email });
      // Handle success (OTP sent)
      setOtpRequested(true);
      setLoading(false);
      // Optionally, display a success message
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  // Handle OTP submission to verify login
  const verifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:5000/api/users/verify-otp', { email, otp });
      setLoading(false);
      const user = res.data.user;
      const token = res.data.token;

      // Update the Zustand store
      setUser(user);
      setToken(token);
      setIsSignedIn(true);


      // Redirect based on user role
      const role = user.role;
      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'faculty') {
        router.push('/faculty');
      } else if (role === 'student') {
        router.push('/student');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred during verification.');
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>
            Login with your Email Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!otpRequested ? (
            <form onSubmit={requestOtp}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="stud_rollno@dtu.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Get OTP'}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={verifyOtp}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter the OTP sent to your email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Verifying...' : 'Login'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setOtpRequested(false);
                    setOtp('');
                    setError(null);
                  }}
                >
                  Back
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}