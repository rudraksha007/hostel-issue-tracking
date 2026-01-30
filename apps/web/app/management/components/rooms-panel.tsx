import { SlideOverPanel } from "@/app/components/SlideOverPanel";
import { X, Loader2, DoorOpen, Plus, User, Edit } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { GetRoomsResponseT, GetFloorsResponseT } from "@repo/shared/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { AggAPI } from "@/lib/api/agg";
import { AddRoom } from "./add-room";
import { EditFloor } from "./edit-floor";
import { SeatsPanel } from "./seats-panel";

interface RoomsPanelProps {
    onClose: () => void;
    floor?: GetFloorsResponseT["floors"][0];
}

export function RoomsPanel({ onClose, floor }: RoomsPanelProps) {
    const [rooms, setRooms] = useState<GetRoomsResponseT["rooms"]>([]);
    const [loading, setLoading] = useState(false);
    const [addRoomOpen, setAddRoomOpen] = useState(false);
    const [editFloorOpen, setEditFloorOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<GetRoomsResponseT["rooms"][0] | undefined>(undefined);

    async function fetchRooms(id: string) {
        setLoading(true);
        const data = await AggAPI.getRooms(id);
        setRooms(data);
        setLoading(false);
    }

    useEffect(() => {
        if (!floor?.id) {
            setRooms([]);
            return;
        }
        fetchRooms(floor.id);
    }, [floor?.id]);

    return (
        <SlideOverPanel isOpen={floor !== undefined} onClose={onClose} zOffset={20}>
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">Floor {floor?.number}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {floor?.hostel.name} • {floor?.block.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} found
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

                {/* Wardens Section */}
                {floor?.wardens && floor.wardens.length > 0 && (
                    <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold">Floor Wardens</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditFloorOpen(true)}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {floor.wardens.map((warden) => (
                                <div 
                                    key={warden.id}
                                    className="flex flex-col p-2 border rounded bg-background"
                                >
                                    <span className="font-medium text-sm">{warden.name}</span>
                                    <span className="text-xs text-muted-foreground">{warden.email}</span>
                                    <span className="text-xs text-muted-foreground">{warden.phone}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Wardens Message */}
                {(!floor?.wardens || floor.wardens.length === 0) && (
                    <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="w-5 h-5" />
                                <span className="text-sm">No wardens assigned</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditFloorOpen(true)}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Floor
                            </Button>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto -mx-6 px-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-32">
                            <Loader2 className="w-8 h-8 mb-4 animate-spin text-muted-foreground" />
                            <p className="text-muted-foreground">Loading rooms...</p>
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                            <DoorOpen className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg">No rooms found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 px-4">
                            <AnimatePresence mode="popLayout">
                                {rooms.map((room) => (
                                    <motion.div
                                        key={room.id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card 
                                            className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50"
                                            onClick={() => setSelectedRoom(room)}
                                        >
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <DoorOpen className="w-5 h-5 text-primary" />
                                                    Room {room.roomNo}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{room.seats}</span>
                                                        <span className="text-xs text-muted-foreground">Total Seats</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{room.occupiedSeats}</span>
                                                        <span className="text-xs text-muted-foreground">Occupied</span>
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
                {floor && (
                    <button
                        onClick={() => setAddRoomOpen(true)}
                        className="fixed bottom-8! right-8! bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-100"
                        aria-label="Add Room"
                        style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                )}

                <AddRoom 
                    isOpen={addRoomOpen} 
                    onClose={() => setAddRoomOpen(false)}
                    floorId={floor?.id}
                    floorNumber={floor?.number}
                    blockName={floor?.block.name}
                    hostelName={floor?.hostel.name}
                />

                <EditFloor
                    isOpen={editFloorOpen}
                    onClose={() => setEditFloorOpen(false)}
                    floor={floor}
                />

                <SeatsPanel
                    onClose={() => setSelectedRoom(undefined)}
                    room={selectedRoom}
                />
            </div>
        </SlideOverPanel>
    );
}
