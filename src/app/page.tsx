import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, ShieldCheck, Zap, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Image
            src="/dynaimers-logo.jpg"
            alt="Dynaimers Logo"
            width={120}
            height={40}
            className="rounded opacity-90"
          />
          <span className="text-xl font-bold text-blue-600 ml-4">PropSphere</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-8 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          Modern Property Management <br />
          <span className="text-blue-600">Enhanced by Artificial Intelligence</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl">
          PropSphere is an all-in-one PMS and CRM platform designed to streamline operations, automate workflows, and boost profitability for modern real estate businesses.
        </p>

        <div className="flex gap-4 mb-20">
          <Link href="/register">
            <Button size="lg" className="px-8 h-12 text-lg">Get Started Free</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="px-8 h-12 text-lg">Live Demo</Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="p-3 bg-blue-100 rounded-lg mb-4">
              <Zap className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">AI-Powered CRM</h3>
            <p className="text-slate-500 text-sm">Automated lead scoring and automated tenant matching using Google Gemini Flash 1.5.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="p-3 bg-green-100 rounded-lg mb-4">
              <ShieldCheck className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Secure PMS</h3>
            <p className="text-slate-500 text-sm">Role-based access control and full-lifecycle lease management with automated invoicing.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="p-3 bg-purple-100 rounded-lg mb-4">
              <BarChart3 className="text-purple-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Smart Analytics</h3>
            <p className="text-slate-500 text-sm">Real-time financial tracking and AI-driven cash flow forecasting for your portfolio.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white text-center">
        <p className="text-sm text-slate-400 mb-2">
          Conceptualized and Developed by
        </p>
        <p className="font-semibold text-slate-600 mb-4">Dynaimers Consulting Pvt. Ltd.</p>
        <div className="flex justify-center gap-6 text-xs text-slate-400">
          <a href="#" className="hover:text-blue-600">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600">Terms of Service</a>
          <a href="#" className="hover:text-blue-600">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}
