'use client';

import { GetHostelsResponseT } from "@repo/shared/types/api";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@repo/ui/components/input";
import { Building2, Loader2, Plus } from "lucide-react";
import { AggAPI } from "@/lib/api/agg";
import { HostelCard } from "./components/hostel-card";
import { BlocksPanel } from "./components/blocks-panel";
import { AddHostel } from "./components/add-hostel";

export default function ManagementPage() {
    const [loading, setLoading] = useState(true);
    const [hostels, setHostels] = useState<GetHostelsResponseT["hostels"]>([]);
    const [selectedHostel, setSelectedHostel] = useState<{ id: string; name: string } | undefined>(undefined);
    const [addHostelOpen, setAddHostelOpen] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    async function fetchHostels(search?: string) {
        setLoading(true);
        const data = await AggAPI.getHostels({
            search,
            page: 1,
            pageSize: 100,
        });
        setHostels(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchHostels();
    }, []);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            fetchHostels(searchQuery);
        }, 500);
    }, [searchQuery]);

    const handleHostelClick = (hostel: GetHostelsResponseT["hostels"][0]) => {
        setSelectedHostel({ id: hostel.id, name: hostel.name });
    };

    const handleClosePanel = () => {
        setSelectedHostel(undefined);
        fetchHostels(searchQuery);
    };

    return (
        <div className="max-w-screen h-full overflow-x-hidden flex flex-row relative">
            <div className="w-full overflow-y-auto h-full flex flex-col gap-4 p-6 overflow-x-hidden relative">
                <div className="flex flex-col gap-3 sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10 pb-2">
                    <h1 className="text-2xl font-bold">Manage Hostels</h1>
                    <Input
                        placeholder="Search hostels..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {hostels.map((hostel) => (
                            <HostelCard
                                key={hostel.id}
                                hostel={hostel}
                                onClick={() => handleHostelClick(hostel)}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center h-32">
                        <Loader2 className="w-8 h-8 mb-4 animate-spin text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Loading hostels...</p>
                    </div>
                )}

                {hostels.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <Building2 className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">No hostels found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>

            {/* Blocks SlideOver Panel */}
            <BlocksPanel
                onClose={handleClosePanel}
                hostelName={selectedHostel?.name}
                hostelId={selectedHostel?.id}
            />

            {/* Floating Action Button */}
            <button
                onClick={() => setAddHostelOpen(true)}
                className="fixed bottom-8! right-8! bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-100"
                style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}
                aria-label="Add Hostel"
            >
                <Plus className="w-6 h-6" />
            </button>

            <AddHostel isOpen={addHostelOpen} onClose={() => setAddHostelOpen(false)} />
        </div>
    );
}