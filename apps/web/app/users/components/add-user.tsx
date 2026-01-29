import { CreateUserRequestT } from "@repo/shared/types/api";
import { motion } from "motion/react"
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Button } from "@repo/ui/components/button";
import { Gender, UserType } from "@repo/db/browser";
import { Loader2 } from "lucide-react";
import { SelectSeat } from "./select-seat";
import { LoadingScreen } from "./loading-screen";
import { UsersAPI } from "@/lib/api/users";



export function AddUserScreen({ isOpen, setOpen }: { isOpen: boolean, setOpen: (open: boolean) => void }) {
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState<CreateUserRequestT>({
        name: "",
        email: "",
        phone: "",
        userType: 'STUDENT',
        gender: 'PREFER_NOT_TO_SAY',
        seat: undefined
    });



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log("Creating user:", form);
            const success = await UsersAPI.createUser(form);
            if (success) setOpen(false);
        } catch (error) {
            console.error("Error creating user:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateForm = (field: keyof CreateUserRequestT, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };
    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                className="w-full h-full fixed top-0 left-0 bg-black/50 dark:bg-black/70 z-290"
                initial={{ opacity: 0, x: "100%" }}
                animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: "100%" }}
                transition={{ duration: 0.2 }}
                onClick={() => setOpen(false)}
                key={'1'}
            />
            {/* Slide-in Panel */}
            <motion.div
                className="fixed top-0 right-0 h-full w-full sm:w-125 bg-background shadow-2xl z-50 overflow-y-auto"
                initial={{ x: '100%' }}
                animate={isOpen ? { x: 0 } : { x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                key={'2'}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-semibold">Add User</h2>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter full name"
                                    value={form.name}
                                    onChange={(e) => updateForm('name', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={form.email}
                                    onChange={(e) => updateForm('email', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+1234567890"
                                    value={form.phone}
                                    onChange={(e) => updateForm('phone', e.target.value)}
                                    required
                                    minLength={10}
                                />
                            </div>

                            {/* User Type Field */}
                            <div className="space-y-2">
                                <Label htmlFor="userType">User Type *</Label>
                                <select
                                    id="userType"
                                    value={form.userType}
                                    onChange={(e) => updateForm('userType', e.target.value as typeof UserType[keyof typeof UserType])}
                                    required
                                    className="block w-full px-3 py-2 border rounded-md bg-background text-foreground"
                                >
                                    <option value="" disabled>
                                        Select user type
                                    </option>
                                    {

                                    }
                                    <option value={UserType.STUDENT}>Student</option>
                                    <option value={UserType.WARDEN}>Warden</option>
                                    <option value={UserType.STAFF}>Staff</option>
                                    <option value={UserType.ADMIN}>Admin</option>
                                </select>
                            </div>

                            {/* Gender Field */}
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <select
                                    id="gender"
                                    value={form.gender}
                                    onChange={(e) => updateForm('gender', e.target.value as typeof Gender[keyof typeof Gender])}
                                    className="block w-full px-3 py-2 border rounded-md bg-background text-foreground"
                                >
                                    <option value="" disabled>
                                        Select gender
                                    </option>
                                    <option value={Gender.MALE}>Male</option>
                                    <option value={Gender.FEMALE}>Female</option>
                                    <option value={Gender.OTHER}>Other</option>
                                    <option value={Gender.PREFER_NOT_TO_SAY}>Prefer not to say</option>
                                </select>
                            </div>

                            <SelectSeat loading={loading} setLoading={setLoading} confSeat={(seat: string) => updateForm('seat', seat)} />

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create User"
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
                <LoadingScreen loading={loading && isOpen} />
            </motion.div>
        </AnimatePresence>
    )

}