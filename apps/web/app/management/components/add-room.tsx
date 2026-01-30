import { SlideOverPanel } from "@/app/components/SlideOverPanel";
import { X, DoorOpen } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Checkbox } from "@repo/ui/components/checkbox";
import { useState } from "react";
import { toast } from "react-toastify";

interface AddRoomProps {
    isOpen: boolean;
    onClose: () => void;
    floorId?: string;
    floorNumber?: string;
    blockName?: string;
    hostelName?: string;
}

export function AddRoom({ isOpen, onClose, floorId, floorNumber, blockName, hostelName }: AddRoomProps) {
    const [formData, setFormData] = useState({
        roomNo: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!floorId) return;
        setLoading(true);
        
        try {
            // Dummy API call - replace this later
            await new Promise(resolve => setTimeout(resolve, 1000));
            // const res = await ManagementAPI.createRoom(floorId, formData);
            // if (!res.success) throw new Error(res.msg);
            
            setFormData({ roomNo: "" });
            toast.success("Room created successfully");
            onClose();
        } catch (error: any) {
            console.error("Error creating room:", error);
            toast.error(error.message || "An error occurred while creating room");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ roomNo: "" });
        onClose();
    };

    const handlePopulateChange = (checked: boolean) => {
        if (!checked) {
            const { capPerRoom, ...rest } = formData as any;
            setFormData(rest);
        } else {
            setFormData(prev => ({ ...prev, capPerRoom: 1 } as any));
        }
    };

    return (
        <SlideOverPanel isOpen={isOpen} onClose={handleClose} zOffset={30}>
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <DoorOpen className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold">Add New Room</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {hostelName} • {blockName} • Floor {floorNumber}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="room-no">Room Number *</Label>
                            <Input
                                id="room-no"
                                placeholder="Enter room number (e.g., 101, 102)"
                                value={formData.roomNo}
                                onChange={(e) => setFormData(prev => ({ ...prev, roomNo: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="populate"
                                checked={!!(formData as any).capPerRoom}
                                onCheckedChange={handlePopulateChange}
                            />
                            <Label htmlFor="populate" className="cursor-pointer">
                                Auto-populate with seats
                            </Label>
                        </div>

                        {(formData as any).capPerRoom !== undefined && (
                            <div className="space-y-2">
                                <Label htmlFor="capPerRoom">Number of Seats *</Label>
                                <Input
                                    id="capPerRoom"
                                    type="number"
                                    min="1"
                                    placeholder="Enter number of seats"
                                    value={(formData as any).capPerRoom || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, capPerRoom: parseInt(e.target.value) || 1 } as any))}
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 pt-6 border-t mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={loading || !formData.roomNo.trim()}
                        >
                            {loading ? "Creating..." : "Create Room"}
                        </Button>
                    </div>
                </form>
            </div>
        </SlideOverPanel>
    );
}
