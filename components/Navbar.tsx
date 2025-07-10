"use client";

import { useClerk, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { CloudUpload, ChevronDown, User, Menu, X, LogOut, User2 } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { useState, useEffect, useRef } from "react";

interface SerializedUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  username?: string | null;
  emailAddress?: string | null;
}

interface NavbarProps {
  user?: SerializedUser | null;
}

export default function Navbar({ user }: NavbarProps) {
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Check if we're on the dashboard page
  const isOnDashboard =
    pathname === "/dashboard" || pathname?.startsWith("/dashboard/");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle clicks outside the mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        // Check if the click is not on the menu button (which has its own handler)
        const target = event.target as HTMLElement;
        if (!target.closest('[data-menu-button="true"]')) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = () => {
    signOut(() => {
      router.push("/");
    });
  };

  // Process user data with defaults if not provided
  const userDetails = {
    fullName: user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : "",
    initials: user
      ? `${user.firstName || ""} ${user.lastName || ""}`
          .trim()
          .split(" ")
          .map((name) => name?.[0] || "")
          .join("")
          .toUpperCase() || "U"
      : "U",
    displayName: user
      ? user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.username || user.emailAddress || "User"
      : "User",
    email: user?.emailAddress || "",
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
    className={`bg-default-50/80 border-b border-default-200 sticky top-0 z-50 transition-shadow backdrop-blur-md ${
      isScrolled ? "shadow-sm" : ""
    }`}
  >
    <div className="container mx-auto py-3 md:py-4 px-4 md:px-6">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-10">
          <CloudUpload className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Droply</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center">
          {/* Show these buttons when user is signed out */}
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="flat" color="primary">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="solid" color="primary">
                Sign Up
              </Button>
            </Link>
          </SignedOut>

          {/* Show these when user is signed in */}
          <SignedIn>
            <div className="flex items-center gap-4">
              {!isOnDashboard && (
                <Link href="/dashboard">
                  <Button variant="flat" color="primary">
                    Dashboard
                  </Button>
                </Link>
              )}
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    className="p-0 bg-transparent min-w-0 group"
                    endContent={<ChevronDown className="h-4 w-4 ml-2" />}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={userDetails.initials}
                        size="sm"
                        src={user?.imageUrl || undefined}
                        className="h-8 w-8 flex-shrink-0"
                        fallback={<User className="h-4 w-4" />}
                      />
                      <span className="text-default-600 hidden sm:inline">
                        {userDetails.displayName}
                      </span>
                    </div>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="User actions"
                  className="backdrop-blur-lg bg-default-50/80 shadow-xl border border-default-200 rounded-xl mt-2 min-w-[200px]"
                >
                  <DropdownItem
                    key="profile"
                    onClick={() => router.push("/dashboard?tab=profile")}
                    className="hover:bg-default-100/70 focus:bg-default-100/70 transition-colors rounded-lg"
                  >
                    <span className="flex items-center">
                   <User2 className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Profile</span>
                   </span>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    className="text-danger hover:bg-danger-50/70 focus:bg-danger-50/70 transition-colors rounded-lg"
                    color="danger"
                    onClick={handleSignOut}
                  >
                    <span className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Sign Out</span>
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </SignedIn>
        </div>
        </div>
      </div>
    </header>
  );
}