import { SlideOverPanel } from "@/app/components/SlideOverPanel";
import { X, Loader2, Layers, Plus } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { GetBlocksResponseT } from "@repo/shared/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { AggAPI } from "@/lib/api/agg";
import { AddBlock } from "./add-block";
import { FloorsPanel } from "./floors-panel";

interface BlocksPanelProps {
    onClose: () => void;
    hostelId?: string;
    hostelName?: string;
}

export function BlocksPanel({ onClose, hostelId, hostelName }: BlocksPanelProps) {
    const [blocks, setBlocks] = useState<GetBlocksResponseT["blocks"]>([]);
    const [loading, setLoading] = useState(false);
    const [addBlockOpen, setAddBlockOpen] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState<{ id: string; name: string } | undefined>(undefined);

    async function fetchBlocks(id: string) {
        setLoading(true);
        const data = await AggAPI.getBlocks(id);
        setBlocks(data);
        setLoading(false);
    }

    useEffect(() => {
        if (!hostelId) {
            setBlocks([]);
            return;
        }
        fetchBlocks(hostelId);
    }, [hostelId]);
    return (
        <SlideOverPanel isOpen={hostelId !== undefined} onClose={onClose}>
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">{hostelName}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'} found
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
                            <p className="text-muted-foreground">Loading blocks...</p>
                        </div>
                    ) : blocks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                            <Layers className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg">No blocks found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 px-4">
                            <AnimatePresence mode="popLayout">
                                {blocks.map((block) => (
                                    <motion.div
                                        key={block.id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card 
                                            className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50"
                                            onClick={() => setSelectedBlock({ id: block.id, name: block.name })}
                                        >
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Layers className="w-5 h-5 text-primary" />
                                                    {block.name}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{block.floors}</span>
                                                        <span className="text-xs text-muted-foreground">Floors</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{block.rooms}</span>
                                                        <span className="text-xs text-muted-foreground">Rooms</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{block.seats}</span>
                                                        <span className="text-xs text-muted-foreground">Seats</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Floating Action Button */}
                {hostelId && (
                    <button
                        onClick={() => setAddBlockOpen(true)}
                        className="fixed bottom-8! right-8! bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-100"
                        aria-label="Add Block"
                        style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                )}

                <AddBlock 
                    isOpen={addBlockOpen} 
                    onClose={() => setAddBlockOpen(false)}
                    hostelId={hostelId}
                    hostelName={hostelName}
                />

                <FloorsPanel
                    onClose={() => setSelectedBlock(undefined)}
                    blockId={selectedBlock?.id}
                    blockName={selectedBlock?.name}
                    hostelId={hostelId}
                    hostelName={hostelName}
                />
            </div>
        </SlideOverPanel>
    );
}
