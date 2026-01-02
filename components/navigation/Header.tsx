"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/navigation/ModeToggle";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { clearUserSession } from "@/services/auth/storeUser";
import { auth } from "@/services/firebase";
import { polarPortal } from "@/services/polar";

const Header = ({ user }: { user: User | null }) => {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const logout = async () => {
    try {
      await clearUserSession();
      signOut(auth);
      toast.success("Successfully logged out");
      router.push("/");
    } catch (error) {
      console.log("Error signing out:", error);
      toast.error(`"Error signing out:", ${error}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-[#1e1b4b] backdrop-blur-md border-b border-[#f3f0ff] dark:border-[#7c60be] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center space-x-3"
            aria-label="Go to homepage"
          >
            <Image src="/ai_icon.png" alt="logo" height={40} width={40} className="rounded-full ai-float"/>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Cognivox AI
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center">
                {user.id && user.image ? (
                  <img
                    src={user.image}
                    className={cn(
                      "rounded-full size-8 mr-2",
                      user.isPro && "border-4 p-0.5 size-9 border-primary"
                    )}
                    alt="Avatar"
                  />
                ) : (
                  <span className="text-sm text-[#7c60be] dark:text-[#f3f0ff] mr-2 capitalize">
                    Welcome,{" "}
                    <span
                      className={cn(
                        user.isPro && "text-primary text-xl font-bold italic"
                      )}
                    >
                      {user.name ? user.name : user.email?.split("@")[0]}
                    </span>
                  </span>
                )}
                {user.isPro && (
                  <Button
                    className="w-fit mr-2"
                    onClick={() =>
                      polarPortal({
                        externalCustomerId: user.id,
                      })
                    }
                  >
                    Pro Portal
                  </Button>
                )}
                <Button className="w-fit" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link href={"/sign-in"}>
                  <Button className="w-fit">Sign In</Button>
                </Link>
                <Link href={"/sign-up"}>
                  <Button className="w-fit">Sign Up</Button>
                </Link>
              </div>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;