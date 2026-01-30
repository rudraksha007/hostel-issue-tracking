import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Building2, Layers, DoorOpen, User } from "lucide-react";
import { GetHostelsResponseT } from "@repo/shared/types/api";
import { motion } from "motion/react";

interface HostelCardProps {
    hostel: GetHostelsResponseT["hostels"][0];
    onClick: () => void;
}

export function HostelCard({ hostel, onClick }: HostelCardProps) {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }} 
            transition={{ duration: 0.2 }}
            className="w-full"
        >
            <Card 
                className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50" 
                onClick={onClick}
            >
                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            {hostel.name}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Layers className="w-4 h-4 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="font-medium">{hostel.blocks}</span>
                                <span className="text-xs text-muted-foreground">Blocks</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Layers className="w-4 h-4 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="font-medium">{hostel.floors}</span>
                                <span className="text-xs text-muted-foreground">Floors</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <DoorOpen className="w-4 h-4 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="font-medium">{hostel.rooms}</span>
                                <span className="text-xs text-muted-foreground">Rooms</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="font-medium">{hostel.seats}</span>
                                <span className="text-xs text-muted-foreground">Seats</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
