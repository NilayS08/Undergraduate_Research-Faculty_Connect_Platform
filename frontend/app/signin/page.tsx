"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setError("")
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error("Invalid credentials")

      const data = await res.json()

      // Save user info in local storage
      localStorage.setItem("user", JSON.stringify(data))

      // Redirect based on user role
      if (data.role === "student") {
        router.push("/student/dashboard")
      } else if (data.role === "faculty") {
        router.push("/faculty/dashboard")
      } else {
        router.push("/")
      }
    } catch (err: any) {
      setError("Invalid email or password")
    }
  }

  return (
    <main className="min-h-screen flex items-center">
      <div className="container mx-auto px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" onClick={handleLogin}>
              Continue
            </Button>
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link href="/" className="underline underline-offset-4">
                Learn more
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
