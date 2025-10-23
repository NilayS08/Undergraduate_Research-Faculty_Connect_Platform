import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Users, Briefcase } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-foreground">
              Research Connect
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link
                href="/projects"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/faculty"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Faculty
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Undergrad Research & Faculty Connect
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance">
              Connect students with faculty research projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Projects
                </Button>
              </Link>
              <Link href="/post-project">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Post a Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Find Projects</CardTitle>
                <CardDescription>
                  Browse hundreds of research opportunities across all departments. Filter by skills, interests, and
                  availability.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/projects">
                  <Button variant="link" className="p-0">
                    Explore projects →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Apply as Student</CardTitle>
                <CardDescription>
                  Create your profile, showcase your skills, and apply to projects that match your research interests
                  and academic goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/student/dashboard">
                  <Button variant="link" className="p-0">
                    Get started →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Manage Projects</CardTitle>
                <CardDescription>
                  Faculty can post projects, review applications, and manage student researchers all in one centralized
                  platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/faculty/dashboard">
                  <Button variant="link" className="p-0">
                    Faculty portal →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">Research Connect</h3>
              <p className="text-sm text-muted-foreground">
                Bridging the gap between undergraduate students and faculty research opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Students</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/projects" className="hover:text-foreground transition-colors">
                    Browse Projects
                  </Link>
                </li>
                <li>
                  <Link href="/student/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/guide" className="hover:text-foreground transition-colors">
                    Getting Started
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Faculty</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/post-project" className="hover:text-foreground transition-colors">
                    Post Project
                  </Link>
                </li>
                <li>
                  <Link href="/faculty/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-foreground transition-colors">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 Research Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
