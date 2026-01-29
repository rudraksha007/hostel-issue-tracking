'use client';
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Navbar, NavTabs } from "@/app/components/navbar";

export default function DashboardComponent({ children, tab }: { children: React.ReactNode, tab: NavTabs }) {
  const router = useRouter();
  function setTab(tab: NavTabs) {
    router.push(`/dashboard?tab=${tab}`);
  }
  return (
    <>
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
      <Navbar selected={tab} setSelected={setTab} />
    </>
  )
}