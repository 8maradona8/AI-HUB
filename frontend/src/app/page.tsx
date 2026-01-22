import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Hub
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full text-sm text-slate-600 dark:text-slate-300 mb-8 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm">
            <Badge variant="secondary" className="mr-2">🚀 New</Badge>
            <span className="font-medium">Discover 100+ AI Tools for Your Team</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight animate-fade-in-up">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Tools
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">For Every Role</span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover, share, and organize the best AI tools curated specifically for your team's needs.
            Get personalized recommendations based on your role.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Link href="/register">
                Start Free Trial
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex -space-x-2">
              <Avatar className="w-8 h-8 border-2 border-white dark:border-slate-800">
                <AvatarImage src="/avatars/01.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-white dark:border-slate-800">
                <AvatarImage src="/avatars/02.png" />
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-white dark:border-slate-800">
                <AvatarImage src="/avatars/03.png" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
            </div>
            <span>Join 10,000+ teams already using AI Hub</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Why Choose AI Hub?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
              Everything you need to discover and share AI tools with your team in one powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:-translate-y-2">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-bold">Smart Recommendations</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  AI-powered suggestions tailored to your specific role and workflow needs.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:-translate-y-2">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-bold">Team Collaboration</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Share discoveries with your team and see what tools your colleagues recommend.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:-translate-y-2">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-bold">Smart Organization</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Organize tools by categories and roles. Find the perfect tool in seconds.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 md:p-16 text-white shadow-2xl border border-white/20">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
              Ready to get started?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Join the AI Revolution
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto text-lg">
              Start exploring the most curated collection of AI tools and supercharge your team's productivity.
            </p>
            <Button size="lg" asChild className="bg-white text-slate-900 hover:bg-slate-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Link href="/register">
                Get Started Free
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Hub
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 max-w-xs text-center md:text-left">
                The definitive platform for discovering and sharing AI tools for teams.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex gap-6">
                <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors hover:scale-110 transition-transform">Twitter</a>
                <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors hover:scale-110 transition-transform">GitHub</a>
                <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors hover:scale-110 transition-transform">Discord</a>
              </div>
              <div className="text-slate-400 text-sm">
                © 2026 AI Hub. Built for the future of work.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
