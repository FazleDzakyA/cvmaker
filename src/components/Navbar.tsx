'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Student Mode', href: '/student-mode', highlight: true },
    { name: 'Templates', href: '/templates' },
    { name: 'CV Builder', href: '/builder' },
    { name: 'ATS Checker', href: '/ats-checker' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const displayName = profile?.fullName || user?.email?.split('@')[0] || '';

  return (
    <nav className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto rounded-full glass-card border border-white/80 shadow-lg px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#101A3C]">
            CV<span className="text-blue-600">Genie</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#172B49] text-white shadow-sm'
                    : link.highlight
                    ? 'bg-blue-100/70 text-[#172B49] hover:bg-white'
                    : 'text-[#496A96] hover:text-[#172B49] hover:bg-white/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-inset text-xs font-bold text-[#172B49] shadow-sm transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#172B49] text-white flex items-center justify-center text-[10px] font-bold">
                  {displayName.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[100px] truncate">{displayName}</span>
              </Link>
              <button
                onClick={handleSignOut}
                title="Log Out"
                className="p-2 rounded-full text-[#718096] hover:text-red-600 hover:bg-red-50/80 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-semibold text-[#496A96] hover:text-[#172B49] transition-colors px-2 py-1"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-full bg-[#172B49] hover:bg-[#243B80] text-white text-xs font-semibold shadow-md shadow-[#172B49]/20 transition-all flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-white/60 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-sm rounded-2xl glass-card border border-white/80 p-4 shadow-xl space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-xl text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between">
            {user ? (
              <>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[140px]">{displayName}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/builder"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold"
                >
                  Create Free CV
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
