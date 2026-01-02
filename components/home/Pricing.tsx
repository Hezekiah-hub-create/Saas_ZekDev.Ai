"use client";

import { Button } from "@/components/ui/button";
import Check from "@/constants/icons/Check";
import { db } from "@/services/firebase";
import { Checkout } from "@/services/polar";
import { User } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Counter animation component defined outside to avoid re-creation
const PriceCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: nodeRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(
            { val: 0 },
            {
              val: value,
              duration: 1.5,
              ease: "power2.out",
              onUpdate: function () {
                setDisplayValue(Math.ceil(this.targets()[0].val));
              },
            }
          );
        },
      });
    }, nodeRef);
    return () => ctx.revert();
  }, [value]);

  return <span ref={nodeRef}>{displayValue}</span>;
};

const Pricing = ({ user }: { user: User | null }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const checkout = async () => {
    try {
      if (!user) {
        toast.error("You must be logged in to upgrade to Pro.");
        return;
      }
      if (user.isPro) {
        router.push("/dashboard");
      }
      await Checkout({
        customerEmail: user.email,
        externalCustomerId: user.id,
      }).then(async (response) => {
        console.log("Checkout response:", response.status);
        if (response.status === "open") {
          await updateDoc(doc(db, "users", user.id), {
            checkoutId: response.id,
          });
          router.push(response.url);
        }

        if (response.status === "expired") {
          toast.error("Checkout session has expired.");
        }

        if (response.status === "succeeded") {
          toast.success("Checkout already completed.");
        }
      });
    } catch (error) {
      console.log("Checkout error:", error);
    }
  };
  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-24 ai-gradient"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Invest in your skills with a plan that fits your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-card p-8 rounded-2xl shadow-sm border border-border flex flex-col"
          >
            <h3 className="text-xl font-semibold text-foreground">
              Starter
            </h3>
            <div className="my-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-foreground">
                $<PriceCounter value={0} />
              </span>
              <span className="text-muted-foreground ml-1">/mo</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Perfect for trying out the platform.
            </p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-muted-foreground">
                <Check />3 AI Lessons per day
              </li>
              <li className="flex items-center text-muted-foreground">
                <Check />
                Basic Conversations
              </li>
            </ul>
            <Link
              href={user ? "/dashboard" : "/sign-in"}
              className="w-full block text-center py-3 px-4 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
            >
              Get Started
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ y: 0 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="bg-card p-8 rounded-2xl shadow-xl border-2 border-primary relative flex flex-col"
          >
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Learner
            </h3>
            <div className="my-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-foreground">
                $<PriceCounter value={29} />
              </span>
              <span className="text-muted-foreground ml-1">/mo</span>
            </div>
            <p className="text-muted-foreground mb-6">
              For serious language enthusiasts.
            </p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-muted-foreground">
                <Check />
                Unlimited AI Lessons
              </li>
              <li className="flex items-center text-muted-foreground">
                <Check />
                Advanced Voice Mode
              </li>
              <li className="flex items-center text-muted-foreground">
                <Check />
                Priority Support
              </li>
            </ul>
            <Button onClick={checkout}>Get Learner</Button>
          </motion.div>

          {/* Team/Polyglot Plan */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-card p-8 rounded-2xl shadow-sm border border-border flex flex-col"
          >
            <h3 className="text-xl font-semibold text-foreground">
              Polyglot
            </h3>
            <div className="my-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-foreground">
                $<PriceCounter value={49} />
              </span>
              <span className="text-muted-foreground ml-1">/year</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Best value for long-term learners.
            </p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-muted-foreground">
                <Check />
                All Learner Features
              </li>
              <li className="flex items-center text-muted-foreground">
                <Check />
                Multi-language Path
              </li>
              <li className="flex items-center text-muted-foreground">
                <Check />
                Downloadable Content
              </li>
            </ul>
            <a
              href="/"
              className="w-full block text-center py-3 px-4 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              Contact Sales
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;