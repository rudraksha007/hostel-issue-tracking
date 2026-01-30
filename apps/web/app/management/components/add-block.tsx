import { SlideOverPanel } from "@/app/components/SlideOverPanel";
import { X, Layers } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Checkbox } from "@repo/ui/components/checkbox";
import { useState } from "react";
import { PlaceType } from "@repo/db/browser";
import { toast } from "react-toastify";
import { AddBlockFormData, ManagementAPI } from "@/lib/api/management";

interface AddBlockProps {
    isOpen: boolean;
    onClose: () => void;
    hostelId?: string;
    hostelName?: string;
}



export function AddBlock({ isOpen, onClose, hostelId, hostelName }: AddBlockProps) {
    const [formData, setFormData] = useState<AddBlockFormData>({
        name: "",
        type: "BOTH",

    });
    const [loading, setLoading] = useState(false);

    function setPopulateField(field: 'floors' | 'roomsPerFloor' | 'capacityPerRoom', value: number) {
        setFormData(prev => ({
            ...prev,
            populate: {
                floors: prev.populate?.floors || 1,
                roomsPerFloor: prev.populate?.roomsPerFloor || 1,
                capacityPerRoom: prev.populate?.capacityPerRoom || 1,
                [field]: value
            }
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hostelId) return;
        setLoading(true);
        const res = await ManagementAPI.createBlock(hostelId, formData);
        if (!res.success) {
            toast.error(res.msg || "An error occurred while creating block");
        }
        else {
            setFormData({ name: "", type: "BOTH" });
            toast.success("Block created successfully");
            onClose();
        }
        setLoading(false);
    };

    const handleClose = () => {
        setFormData({ name: "", type: "BOTH" });
        onClose();
    };

    const handlePopulateChange = (checked: boolean) => {
        if (!checked) {
            const { populate, ...rest } = formData;
            setFormData(rest);
        } else {
            setPopulateField('floors', 0);
            setPopulateField('roomsPerFloor', 0);
            setPopulateField('capacityPerRoom', 0);
        }
    };

    return (
        <SlideOverPanel isOpen={isOpen} onClose={handleClose} zOffset={10}>
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <Layers className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold">Add New Block</h2>
                        </div>
                        {hostelName && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {hostelName}
                            </p>
                        )}
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
                            <Label htmlFor="block-name">Block Name *</Label>
                            <Input
                                id="block-name"
                                placeholder="Enter block name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="place-type">Place Type *</Label>
                            <select
                                id="place-type"
                                value={formData.type}
                                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as PlaceType }))}
                                className="block w-full px-3 py-2 border rounded-md bg-background text-foreground"
                                required
                            >
                                <option value="BOTH">Both (Male & Female)</option>
                                <option value="MALE">Male Only</option>
                                <option value="FEMALE">Female Only</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="populate"
                                checked={!!formData.populate}
                                onCheckedChange={handlePopulateChange}
                            />
                            <Label htmlFor="populate" className="cursor-pointer">
                                Auto-populate with floors, rooms, and seats
                            </Label>
                        </div>

                        {formData.populate !== undefined && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="floors">Number of Floors *</Label>
                                    <Input
                                        id="floors"
                                        type="number"
                                        min="1"
                                        placeholder="Enter number of floors"
                                        value={formData.populate?.floors || ""}
                                        onChange={(e) => setPopulateField('floors', parseInt(e.target.value) || 0) }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="roomsPerFloor">Rooms per Floor *</Label>
                                    <Input
                                        id="roomsPerFloor"
                                        type="number"
                                        min="1"
                                        placeholder="Enter rooms per floor"
                                        value={formData.populate?.roomsPerFloor || ""}
                                        onChange={(e) => setPopulateField('roomsPerFloor', parseInt(e.target.value) || 0) }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capacityPerRoom">Capacity per Room *</Label>
                                    <Input
                                        id="capacityPerRoom"
                                        type="number"
                                        min="1"
                                        placeholder="Enter capacity per room"
                                        value={formData.populate?.capacityPerRoom || ""}
                                        onChange={(e) => setPopulateField('capacityPerRoom', parseInt(e.target.value) || 0) }
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
                            disabled={loading || !formData.name.trim()}
                        >
                            {loading ? "Creating..." : "Create Block"}
                        </Button>
                    </div>
                </form>
            </div>
        </SlideOverPanel>
    );
}
