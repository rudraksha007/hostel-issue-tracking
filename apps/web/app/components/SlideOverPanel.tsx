import { motion, AnimatePresence } from "motion/react";

interface SlideOverPanelProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    zOffset?: number;
}

export function SlideOverPanel({
    isOpen,
    onClose,
    children,
    zOffset = 0
}: SlideOverPanelProps) {
    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                className="w-full h-full fixed top-0 left-0 bg-black/50 dark:bg-black/70"
                style={{ zIndex: 300 + zOffset - 10 }}
                initial={{ opacity: 0, x: "100%" }}
                animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: "100%" }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                key="backdrop"
            />
            {/* Slide-in Panel */}
            <motion.div
                className="fixed top-0 right-0 h-full w-full sm:w-125 bg-background shadow-2xl overflow-y-auto"
                style={{ zIndex: 300 + zOffset }}
                initial={{ x: '100%' }}
                animate={isOpen ? { x: 0 } : { x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                key="panel"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
