import { SlideOverPanel } from "@/app/components/SlideOverPanel";
import { X, Loader2, Building, Plus, User } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { GetFloorsResponseT } from "@repo/shared/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { AggAPI } from "@/lib/api/agg";
import { AddFloor } from "./add-floor";
import { RoomsPanel } from "./rooms-panel";

interface FloorsPanelProps {
    onClose: () => void;
    blockId?: string;
    blockName?: string;
    hostelId?: string;
    hostelName?: string;
}

export function FloorsPanel({ onClose, blockId, blockName, hostelId, hostelName }: FloorsPanelProps) {
    const [floors, setFloors] = useState<GetFloorsResponseT["floors"]>([]);
    const [loading, setLoading] = useState(false);
    const [addFloorOpen, setAddFloorOpen] = useState(false);
    const [selectedFloor, setSelectedFloor] = useState<GetFloorsResponseT["floors"][0] | undefined>(undefined);

    async function fetchFloors(id: string) {
        setLoading(true);
        const data = await AggAPI.getFloors(id);
        setFloors(data);
        setLoading(false);
    }

    useEffect(() => {
        if (!blockId) {
            setFloors([]);
            return;
        }
        fetchFloors(blockId);
    }, [blockId]);

    return (
        <SlideOverPanel isOpen={blockId !== undefined} onClose={onClose} zOffset={10}>
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">{blockName}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {hostelName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {floors.length} {floors.length === 1 ? 'floor' : 'floors'} found
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto -mx-6 px-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-32">
                            <Loader2 className="w-8 h-8 mb-4 animate-spin text-muted-foreground" />
                            <p className="text-muted-foreground">Loading floors...</p>
                        </div>
                    ) : floors.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                            <Building className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg">No floors found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 px-4">
                            <AnimatePresence mode="popLayout">
                                {floors.map((floor) => (
                                    <motion.div
                                        key={floor.id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card 
                                            className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50"
                                            onClick={() => setSelectedFloor(floor)}
                                        >
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Building className="w-5 h-5 text-primary" />
                                                    Floor {floor.number}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{floor.rooms}</span>
                                                        <span className="text-xs text-muted-foreground">Rooms</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{floor.seats}</span>
                                                        <span className="text-xs text-muted-foreground">Seats</span>
                                                    </div>
                                                </div>
                                                
                                                {floor.wardens && floor.wardens.length > 0 && (
                                                    <div className="pt-2 border-t">
                                                        <div className="flex items-center gap-1 mb-2">
                                                            <User className="w-4 h-4 text-muted-foreground" />
                                                            <span className="text-xs font-medium text-muted-foreground">
                                                                Wardens
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {floor.wardens.map((warden) => (
                                                                <Badge 
                                                                    key={warden.id} 
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                    title={`${warden.email} • ${warden.phone}`}
                                                                >
                                                                    {warden.name}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Floating Action Button */}
                {blockId && (
                    <button
                        onClick={() => setAddFloorOpen(true)}
                        className="fixed bottom-8! right-8! bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-100"
                        aria-label="Add Floor"
                        style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                )}

                <AddFloor 
                    isOpen={addFloorOpen} 
                    onClose={() => setAddFloorOpen(false)}
                    blockId={blockId}
                    blockName={blockName}
                    hostelId={hostelId}
                    hostelName={hostelName}
                />

                <RoomsPanel
                    onClose={() => setSelectedFloor(undefined)}
                    floor={selectedFloor}
                />
            </div>
        </SlideOverPanel>
    );
}
