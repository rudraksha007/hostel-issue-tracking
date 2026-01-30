import { SlideOverPanel } from "@/app/components/SlideOverPanel";
import { X, Loader2, Armchair, User, UserX, Search, UserPlus } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { GetSeatsResponseT, GetRoomsResponseT, GetUsersResponseT } from "@repo/shared/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { AggAPI } from "@/lib/api/agg";
import { UsersAPI } from "@/lib/api/users";
import { UserType } from "@repo/db/browser";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface SeatsPanelProps {
    onClose: () => void;
    room?: GetRoomsResponseT["rooms"][0];
}

type SeatWithOccupant = GetSeatsResponseT["seats"][0] & {
    occupant?: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
};

export function SeatsPanel({ onClose, room }: SeatsPanelProps) {
    const [seats, setSeats] = useState<SeatWithOccupant[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<GetUsersResponseT["users"]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();
    async function fetchSeats(id: string) {
        setLoading(true);
        const data = await AggAPI.getSeats(id);
        // TODO: Get occupants for seats - replace with actual API call
        const seatsWithOccupants: SeatWithOccupant[] = data.map(seat => ({
            ...seat,
            occupant: undefined, // This should come from API
        }));
        setSeats(seatsWithOccupants);
        setLoading(false);
    }

    useEffect(() => {
        if (!room?.id) {
            setSeats([]);
            return;
        }
        fetchSeats(room.id);
    }, [room?.id]);

    // Search users with debounce
    useEffect(() => {
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        
        if (!searchQuery.trim() || !selectedSeatId) {
            setSearchResults([]);
            return;
        }

        searchTimerRef.current = setTimeout(async () => {
            setSearchLoading(true);
            const users = await UsersAPI.getUsers({
                search: searchQuery,
                types: [UserType.STUDENT],
                page: 1,
                pageSize: 10,
            });
            setSearchResults(users);
            setSearchLoading(false);
        }, 500);

        return () => {
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        };
    }, [searchQuery, selectedSeatId]);

    const handleAssignUser = async (user: GetUsersResponseT["users"][0]) => {
        if (!selectedSeatId) return;
        
        setActionLoading(true);
        try {
            const res = await UsersAPI.editUser({
                id: user.id,
                seatId: selectedSeatId,
            });
            if (!res.success) throw new Error(res.msg || "Failed to assign seat");
            // Update local state
            setSeats(prev => prev.map(seat => 
                seat.id === selectedSeatId 
                    ? { ...seat, occupant: { id: user.id, name: user.name, email: user.email, phone: user.phone } }
                    : seat
            ));
            
            setSelectedSeatId(null);
            setSearchQuery("");
            setSearchResults([]);
            toast.success(`Assigned ${user.name} to seat`);
        } catch (error: any) {
            console.error("Error assigning seat:", error);
            toast.error(error.message || "Failed to assign seat");
        } finally {
            setActionLoading(false);
            router.refresh();
        }
    };

    const handleRemoveOccupant = async (seatId: string, occupantName: string) => {
        setActionLoading(true);
        try {
            const res = await UsersAPI.editUser({
                id: seatId,
                clearSeat: true,
            });
            if (!res.success) throw new Error(res.msg || "Failed to remove occupant");
            
            // Update local state
            setSeats(prev => prev.map(seat => 
                seat.id === seatId 
                    ? { ...seat, occupant: undefined }
                    : seat
            ));
            
            toast.success(`Removed ${occupantName} from seat`);
        } catch (error: any) {
            console.error("Error removing occupant:", error);
            toast.error(error.message || "Failed to remove occupant");
        } finally {
            setActionLoading(false);
            router.refresh();
        }
    };

    const handleCancelSearch = () => {
        setSelectedSeatId(null);
        setSearchQuery("");
        setSearchResults([]);
    };

    return (
        <SlideOverPanel isOpen={room !== undefined} onClose={onClose} zOffset={30}>
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">Room {room?.roomNo}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {room?.hostel.name} • {room?.block.name} • Floor {room?.floor.number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {seats.length} {seats.length === 1 ? 'seat' : 'seats'} found
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

                {/* Search Section */}
                {selectedSeatId && (
                    <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold">Assign Student to Seat</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelSearch}
                            >
                                Cancel
                            </Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search students by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Search Results */}
                        {searchQuery && (
                            <div className="mt-2 border rounded-lg bg-background shadow-lg max-h-60 overflow-y-auto">
                                {searchLoading ? (
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                        <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                                    </div>
                                ) : searchResults.length === 0 ? (
                                    <div className="p-4 text-sm text-muted-foreground text-center">
                                        No students found
                                    </div>
                                ) : (
                                    <div className="p-1">
                                        {searchResults.map((user) => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => handleAssignUser(user)}
                                                disabled={actionLoading}
                                                className="w-full text-left p-3 hover:bg-muted rounded transition-colors disabled:opacity-50"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <User className="w-4 h-4 mt-1 text-muted-foreground" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                        <p className="text-xs text-muted-foreground">{user.phone}</p>
                                                        {user.seat && (
                                                            <Badge variant="secondary" className="mt-1 text-xs">
                                                                Current: {user.seat.hostel} - {user.seat.block} - Floor {user.seat.floor} - Room {user.seat.room} - Seat {user.seat.number}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto -mx-6 px-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-32">
                            <Loader2 className="w-8 h-8 mb-4 animate-spin text-muted-foreground" />
                            <p className="text-muted-foreground">Loading seats...</p>
                        </div>
                    ) : seats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                            <Armchair className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg">No seats found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 px-4">
                            <AnimatePresence mode="popLayout">
                                {seats.map((seat) => (
                                    <motion.div
                                        key={seat.id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card className={`hover:shadow-md transition-shadow ${selectedSeatId === seat.id ? 'ring-2 ring-primary' : ''}`}>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Armchair className="w-5 h-5 text-primary" />
                                                    Seat {seat.number}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {seat.occupant ? (
                                                    <div className="space-y-2">
                                                        <div className="p-2 border rounded bg-muted/50">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-sm truncate">{seat.occupant.name}</p>
                                                                    <p className="text-xs text-muted-foreground truncate">{seat.occupant.email}</p>
                                                                    <p className="text-xs text-muted-foreground">{seat.occupant.phone}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleRemoveOccupant(seat.id, seat.occupant!.name)}
                                                            disabled={actionLoading}
                                                            className="w-full text-destructive hover:text-destructive"
                                                        >
                                                            <UserX className="w-4 h-4 mr-2" />
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedSeatId(seat.id)}
                                                        className="w-full"
                                                    >
                                                        <UserPlus className="w-4 h-4 mr-2" />
                                                        Assign Student
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </SlideOverPanel>
    );
}
