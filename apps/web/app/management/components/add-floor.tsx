import { SlideOverPanel } from "@/app/components/SlideOverPanel";
import { X, Building } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Checkbox } from "@repo/ui/components/checkbox";
import { useState } from "react";
import { toast } from "react-toastify";

interface AddFloorProps {
    isOpen: boolean;
    onClose: () => void;
    blockId?: string;
    blockName?: string;
    hostelId?: string;
    hostelName?: string;
}

export function AddFloor({ isOpen, onClose, blockId, blockName, hostelId, hostelName }: AddFloorProps) {
    const [formData, setFormData] = useState({
        number: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!blockId) return;
        setLoading(true);
        
        try {
            // Dummy API call - replace this later
            await new Promise(resolve => setTimeout(resolve, 1000));
            // const res = await ManagementAPI.createFloor(blockId, formData);
            // if (!res.success) throw new Error(res.msg);
            
            setFormData({ number: "" });
            toast.success("Floor created successfully");
            onClose();
        } catch (error: any) {
            console.error("Error creating floor:", error);
            toast.error(error.message || "An error occurred while creating floor");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ number: "" });
        onClose();
    };

    const handlePopulateChange = (checked: boolean) => {
        if (!checked) {
            const { roomsPerFloor, capPerRoom, ...rest } = formData as any;
            setFormData(rest);
        } else {
            setFormData(prev => ({ ...prev, roomsPerFloor: 1, capPerRoom: 1 } as any));
        }
    };

    return (
        <SlideOverPanel isOpen={isOpen} onClose={handleClose} zOffset={20}>
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <Building className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold">Add New Floor</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {hostelName} • {blockName}
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
                            <Label htmlFor="floor-number">Floor Number *</Label>
                            <Input
                                id="floor-number"
                                placeholder="Enter floor number (e.g., 1, 2, G)"
                                value={formData.number}
                                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="populate"
                                checked={!!(formData as any).roomsPerFloor}
                                onCheckedChange={handlePopulateChange}
                            />
                            <Label htmlFor="populate" className="cursor-pointer">
                                Auto-populate with rooms and seats
                            </Label>
                        </div>

                        {(formData as any).roomsPerFloor !== undefined && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="roomsPerFloor">Rooms per Floor *</Label>
                                    <Input
                                        id="roomsPerFloor"
                                        type="number"
                                        min="1"
                                        placeholder="Enter rooms per floor"
                                        value={(formData as any).roomsPerFloor || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, roomsPerFloor: parseInt(e.target.value) || 1 } as any))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capPerRoom">Capacity per Room *</Label>
                                    <Input
                                        id="capPerRoom"
                                        type="number"
                                        min="1"
                                        placeholder="Enter capacity per room"
                                        value={(formData as any).capPerRoom || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, capPerRoom: parseInt(e.target.value) || 1 } as any))}
                                        required
                                    />
                                </div>
                            </>
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
                            disabled={loading || !formData.number.trim()}
                        >
                            {loading ? "Creating..." : "Create Floor"}
                        </Button>
                    </div>
                </form>
            </div>
        </SlideOverPanel>
    );
}
