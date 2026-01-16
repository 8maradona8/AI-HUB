import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                AI Hub
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-500 hover:text-foreground transition-colors px-4 py-2 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-card rounded-full text-sm text-gray-500 mb-8 border border-card-border shadow-sm">
            <span className="mr-2">🚀</span>
            <span className="font-medium">Discover 100+ AI Tools for Your Team</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Tools
            </span>
            <br />
            <span className="text-foreground">For Every Role</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-medium">
            Discover, share, and organize the best AI tools curated specifically for your team's needs.
            Get personalized recommendations based on your role.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1"
            >
              Start Free
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-card hover:bg-background text-foreground font-bold rounded-xl transition-all border border-card-border shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card border-y border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Why AI Hub?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">
              Everything you need to discover and share AI tools with your team in one powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-background p-10 rounded-3xl border border-card-border hover:border-blue-500/50 transition-all group hover:shadow-2xl hover:shadow-blue-500/5">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Role Recommendations</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Get AI tool suggestions tailored to your specific role - whether you're a developer, designer, or product manager.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background p-10 rounded-3xl border border-card-border hover:border-purple-500/50 transition-all group hover:shadow-2xl hover:shadow-purple-500/5">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Team Collaboration</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Share your discoveries with the team. See what tools your colleagues are using and which ones they recommend.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background p-10 rounded-3xl border border-card-border hover:border-pink-500/50 transition-all group hover:shadow-2xl hover:shadow-pink-500/5">
              <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Curation</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Organize tools by categories and target roles. Find exactly the tool you need for any task in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3rem] p-16 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 relative z-10">Ready to discover AI tools?</h2>
            <p className="text-white/80 mb-10 max-w-xl mx-auto text-lg font-medium relative z-10">
              Join your team on AI Hub and start exploring the most curated collection of AI tools today.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-blue-600 font-extrabold rounded-2xl transition-all hover:bg-gray-50 hover:scale-105 shadow-xl relative z-10"
            >
              Get Started Free
              <svg className="ml-2 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-card-border py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                AI Hub
              </span>
              <p className="text-gray-500 font-medium max-w-xs text-center md:text-left">
                The definitive platform for discovering and sharing AI tools for teams.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">GitHub</a>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Discord</a>
              </div>
              <div className="text-gray-400 text-sm font-medium">
                © 2026 AI Hub. Built for the future of work.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
