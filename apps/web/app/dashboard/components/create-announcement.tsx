'use client';
import { useState } from "react";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Button } from "@repo/ui/components/button";
import { UserType } from "@repo/db/browser";
import { Loader2, X } from "lucide-react";
import { SlideOverPanel } from "@/app/components/SlideOverPanel";
import { useSession } from "@/app/components/session-consumer";
import { Unauthorised } from "@/app/components/unauthorised";
import { AnnouncementsAPI } from "@/lib/api/announcements";
import type { AnnouncementRequestT } from "@repo/shared/types/api";

export function CreateAnnouncementPanel({ isOpen, setOpen, userFloors }: { 
    isOpen: boolean, 
    setOpen: (open: boolean) => void,
    userFloors?: string[]
}) {
    const [loading, setLoading] = useState(false);
    const { user } = useSession();
    
    if (!user) return <Unauthorised />;
    if (user.userType !== 'ADMIN' && user.userType !== 'WARDEN') return <Unauthorised />;

    const [form, setForm] = useState<AnnouncementRequestT>({
        title: "",
        content: "",
        targeting: {
            userTypes: [UserType.STUDENT],
            wardens: [],
            users: [],
            rooms: [],
            floors: [],
            blocks: [],
            hostels: [],
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const success = await AnnouncementsAPI.createAnnouncement(form);
            if (success) {
                setOpen(false);
                // Reset form
                setForm({
                    title: "",
                    content: "",
                    targeting: {
                        userTypes: [UserType.STUDENT],
                        wardens: [],
                        users: [],
                        rooms: [],
                        floors: [],
                        blocks: [],
                        hostels: [],
                    }
                });
            }
        } catch (error) {
            console.error("Error creating announcement:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateForm = (field: keyof AnnouncementRequestT, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const updateTargeting = (field: keyof AnnouncementRequestT['targeting'], value: any) => {
        setForm(prev => ({
            ...prev,
            targeting: {
                ...prev.targeting,
                [field]: value
            }
        }));
    };

    return (
        <SlideOverPanel isOpen={isOpen} onClose={() => setOpen(false)}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">Create Announcement</h2>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Field */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Enter announcement title (5-100 characters)"
                                value={form.title}
                                onChange={(e) => updateForm('title', e.target.value)}
                                minLength={5}
                                maxLength={100}
                                required
                            />
                        </div>

                        {/* Content Field */}
                        <div className="space-y-2">
                            <Label htmlFor="content">Content *</Label>
                            <textarea
                                id="content"
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter announcement content (10-1000 characters)"
                                value={form.content}
                                onChange={(e) => updateForm('content', e.target.value)}
                                minLength={10}
                                maxLength={1000}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                {form.content.length}/1000 characters
                            </p>
                        </div>

                        {/* Targeting Options (Admin Only) */}
                        {user.userType === 'ADMIN' && (
                            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                                <h3 className="text-sm font-semibold">Target Audience</h3>
                                
                                <div className="space-y-2">
                                    <Label>User Types</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.values(UserType).map((type) => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={form.targeting.userTypes.includes(type)}
                                                    onChange={(e) => {
                                                        const updated = e.target.checked
                                                            ? [...form.targeting.userTypes, type]
                                                            : form.targeting.userTypes.filter(t => t !== type);
                                                        updateTargeting('userTypes', updated);
                                                    }}
                                                    className="rounded border-input"
                                                />
                                                <span className="text-sm">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="floors">Floor IDs (comma-separated)</Label>
                                    <Input
                                        id="floors"
                                        type="text"
                                        placeholder="e.g., floor-id-1, floor-id-2"
                                        value={form.targeting.floors.join(', ')}
                                        onChange={(e) => {
                                            const floors = e.target.value
                                                .split(',')
                                                .map(f => f.trim())
                                                .filter(f => f.length > 0);
                                            updateTargeting('floors', floors);
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Leave empty to target all floors
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Warden Info */}
                        {user.userType === 'WARDEN' && (
                            <div className="p-4 border rounded-lg bg-muted/30">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Note:</strong> As a warden, this announcement will only be sent to students on your assigned floors.
                                </p>
                                {userFloors && userFloors.length > 0 && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Targeting {userFloors.length} floor(s)
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={loading || !form.title || !form.content}
                                className="flex-1"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Announcement'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </SlideOverPanel>
    );
}
