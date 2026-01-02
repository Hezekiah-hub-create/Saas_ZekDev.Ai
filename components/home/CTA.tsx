"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold tracking-tight text-foreground"
        >
          Ready to Start Your Journey?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
        >
          Click the button below to launch the app and generate your first
          lesson. No sign-up required.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 relative"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0px 0px 0px 0px hsl(var(--primary) / 0.4)",
                "0px 0px 20px 5px hsl(var(--primary) / 0.6)",
                "0px 0px 0px 0px hsl(var(--primary) / 0.4)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-lg"
          />
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow-2xl transition-colors relative z-10"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/ai_icon.png"
                alt="AI Icon"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />
            </motion.div>
            <span>Launch Your AI</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;