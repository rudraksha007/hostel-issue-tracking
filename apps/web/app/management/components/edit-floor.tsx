import { SlideOverPanel } from "@/app/components/SlideOverPanel";
import { X, Building, User, UserPlus, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useState, useEffect, useRef } from "react";
import { GetFloorsResponseT, GetUsersResponseT } from "@repo/shared/types/api";
import { toast } from "react-toastify";
import { UsersAPI } from "@/lib/api/users";
import { UserType } from "@repo/db/browser";

interface EditFloorProps {
    isOpen: boolean;
    onClose: () => void;
    floor?: GetFloorsResponseT["floors"][0];
}

type WardenType = {
    id: string;
    name: string;
    email: string;
    phone: string;
};

export function EditFloor({ isOpen, onClose, floor }: EditFloorProps) {
    const [formData, setFormData] = useState({
        number: floor?.number || "",
        wardens: floor?.wardens || [] as WardenType[],
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<GetUsersResponseT["users"]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Update formData when floor changes
    useEffect(() => {
        if (floor) {
            setFormData({
                number: floor.number,
                wardens: floor.wardens || [],
            });
        }
    }, [floor]);

    // Search users with debounce
    useEffect(() => {
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        searchTimerRef.current = setTimeout(async () => {
            setSearchLoading(true);
            const users = await UsersAPI.getUsers({
                search: searchQuery,
                types: [UserType.WARDEN],
                page: 1,
                pageSize: 10,
            });
            setSearchResults(users);
            setSearchLoading(false);
        }, 500);

        return () => {
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        };
    }, [searchQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!floor?.id) return;
        setLoading(true);
        
        try {
            // Dummy API call - replace this later
            await new Promise(resolve => setTimeout(resolve, 1000));
            // const res = await ManagementAPI.updateFloor(floor.id, formData);
            // if (!res.success) throw new Error(res.msg);
            
            toast.success("Floor updated successfully");
            onClose();
        } catch (error: any) {
            console.error("Error updating floor:", error);
            toast.error(error.message || "An error occurred while updating floor");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (floor) {
            setFormData({
                number: floor.number,
                wardens: floor.wardens || [],
            });
        }
        setSearchQuery("");
        setSearchResults([]);
        onClose();
    };

    const handleSelectUser = (user: GetUsersResponseT["users"][0]) => {
        // Check if already added
        if (formData.wardens.some(w => w.id === user.id)) {
            toast.info("This warden is already assigned");
            return;
        }

        const warden: WardenType = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        };
        
        setFormData(prev => ({
            ...prev,
            wardens: [...prev.wardens, warden],
        }));
        
        setSearchQuery("");
        setSearchResults([]);
        toast.success("Warden added to list");
    };

    const handleRemoveWarden = (wardenId: string) => {
        setFormData(prev => ({
            ...prev,
            wardens: prev.wardens.filter(w => w.id !== wardenId),
        }));
    };

    return (
        <SlideOverPanel isOpen={isOpen} onClose={handleClose} zOffset={30}>
            <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <Building className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold">Edit Floor</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {floor?.hostel.name} • {floor?.block.name}
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
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 space-y-6 overflow-y-auto">
                        <div className="space-y-2">
                            <Label htmlFor="floor-number">Floor Number *</Label>
                            <Input
                                id="floor-number"
                                placeholder="Enter floor number"
                                value={formData.number}
                                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                                required
                            />
                        </div>

                        {/* Wardens Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                <Label className="text-base font-semibold">Floor Wardens</Label>
                            </div>

                            {/* Existing Wardens */}
                            {formData.wardens.length > 0 && (
                                <div className="space-y-2">
                                    {formData.wardens.map((warden) => (
                                        <div 
                                            key={warden.id}
                                            className="flex items-start gap-2 p-3 border rounded-lg bg-muted/50"
                                        >
                                            <div className="flex-1 space-y-1">
                                                <p className="font-medium text-sm">{warden.name}</p>
                                                <p className="text-xs text-muted-foreground">{warden.email}</p>
                                                <p className="text-xs text-muted-foreground">{warden.phone}</p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveWarden(warden.id)}
                                                className="shrink-0 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add New Warden */}
                            <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <UserPlus className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Add Warden</span>
                                </div>
                                
                                <div className="space-y-2 relative">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search wardens by name or email..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>

                                    {/* Search Results */}
                                    {searchQuery && (
                                        <div className="absolute z-10 w-full mt-1 border rounded-lg bg-background shadow-lg max-h-60 overflow-y-auto">
                                            {searchLoading ? (
                                                <div className="flex items-center justify-center p-4">
                                                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                                    <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                                                </div>
                                            ) : searchResults.length === 0 ? (
                                                <div className="p-4 text-sm text-muted-foreground text-center">
                                                    No wardens found
                                                </div>
                                            ) : (
                                                <div className="p-1">
                                                    {searchResults.map((user) => (
                                                        <button
                                                            key={user.id}
                                                            type="button"
                                                            onClick={() => handleSelectUser(user)}
                                                            className="w-full text-left p-3 hover:bg-muted rounded transition-colors"
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                <User className="w-4 h-4 mt-1 text-muted-foreground" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-sm truncate">{user.name}</p>
                                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                                    <p className="text-xs text-muted-foreground">{user.phone}</p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
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
                            disabled={loading || !formData.number.trim()}
                        >
                            {loading ? "Updating..." : "Update Floor"}
                        </Button>
                    </div>
                </form>
            </div>
        </SlideOverPanel>
    );
}
