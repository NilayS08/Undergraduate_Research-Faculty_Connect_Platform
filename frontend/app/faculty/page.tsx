import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FacultyLandingPage() {
  return (
    <main className="min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-2">Faculty Portal</h1>
        <p className="text-muted-foreground mb-6">Post projects and review student applications.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/post-project">
            <Button>Post a Project</Button>
          </Link>
          <Link href="/faculty/dashboard">
            <Button variant="outline" className="bg-transparent">
              Open Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
