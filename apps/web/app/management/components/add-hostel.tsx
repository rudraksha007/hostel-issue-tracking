import { SlideOverPanel } from "@/app/components/SlideOverPanel";
import { X, Building2 } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useState } from "react";
import { PlaceType } from "@repo/db/browser";
import { ManagementAPI } from "@/lib/api/management";
import { CreateHostelRequestT } from "@repo/shared/types/api";
import { toast } from "react-toastify";

interface AddHostelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddHostel({ isOpen, onClose }: AddHostelProps) {
    const [formData, setFormData] = useState<CreateHostelRequestT>({
        name: "",
        type: "BOTH"
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await ManagementAPI.createHostel(formData);
            if (!res.success) throw new Error(res.msg);
            setFormData({ name: "", type: "BOTH" });
            toast.success("Hostel created successfully");
            onClose();
        } catch (error: any) {
            console.error("Error creating hostel:", error);
            toast.error(error.message || "An error occurred while creating hostel");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: "", type: "BOTH" });
        onClose();
    };

    return (
        <SlideOverPanel isOpen={isOpen} onClose={handleClose} zOffset={10}>
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Add New Hostel</h2>
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
                            <Label htmlFor="hostel-name">Hostel Name *</Label>
                            <Input
                                id="hostel-name"
                                placeholder="Enter hostel name"
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
                            {loading ? "Creating..." : "Create Hostel"}
                        </Button>
                    </div>
                </form>
            </div>
        </SlideOverPanel>
    );
}
