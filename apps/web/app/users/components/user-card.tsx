import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Mail, Phone, MapPin } from "lucide-react";
import { GetUsersResponseT } from "@repo/shared/types/api";
import { motion } from "motion/react";

export function UserCard({ user }: { user: GetUsersResponseT["users"][0] }) {
    const userTypeColors = {
        STUDENT: "secondary",
        WARDEN: "default",
        ADMIN: "destructive",
        STAFF: "outline"
    } as const;

    const genderColors = {
        MALE: "outline",
        FEMALE: "outline",
        OTHER: "outline",
        PREFER_NOT_TO_SAY: "outline"
    } as const;

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }} 
            transition={{ duration: 0.2 }}
            className="w-full"
        >
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                            <Badge variant={userTypeColors[user.userType] || "secondary"}>
                                {user.userType}
                            </Badge>
                            <Badge variant={genderColors[user.gender] || "outline"}>
                                {user.gender}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 shrink-0" />
                        <span>{user.phone}</span>
                    </div>
                    {user.seat && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground pt-2 border-t">
                            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                            <div className="flex flex-col">
                                <span className="font-medium text-foreground">{user.seat.hostel}</span>
                                <span className="text-xs">
                                    Block {user.seat.block} • Room {user.seat.room} • Seat {user.seat.number}
                                </span>
                                <span className="text-xs">Floor {user.seat.floor}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}