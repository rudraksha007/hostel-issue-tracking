import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { User, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { GetIssuesResponseT } from "@repo/shared/types/api";
import { motion } from "motion/react";
import { Priority, Status } from "@repo/db/browser";

export function IssueCard({ 
    issue, 
    onClick 
}: { 
    issue: GetIssuesResponseT["issues"][0];
    onClick?: () => void;
}) {
    const priorityColors = {
        [Priority.LOW]: "secondary",
        [Priority.MEDIUM]: "default",
        [Priority.HIGH]: "outline",
        [Priority.EMERGENCY]: "destructive"
    } as const;

    const statusColors = {
        [Status.REPORTED]: "secondary",
        [Status.ASSIGNED]: "default",
        [Status.IN_PROGRESS]: "outline",
        [Status.RESOLVED]: "default",
        [Status.CLOSED]: "secondary"
    } as const;

    const statusIcons = {
        [Status.REPORTED]: AlertCircle,
        [Status.ASSIGNED]: User,
        [Status.IN_PROGRESS]: Clock,
        [Status.RESOLVED]: CheckCircle2,
        [Status.CLOSED]: CheckCircle2,
    };

    const StatusIcon = statusIcons[issue.status];

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
                        <CardTitle className="text-lg line-clamp-2">{issue.title}</CardTitle>
                        <div className="flex gap-1.5 flex-wrap justify-end shrink-0">
                            <Badge variant={priorityColors[issue.priority]}>
                                {issue.priority}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {issue.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm">
                        <StatusIcon className="w-4 h-4 shrink-0" />
                        <Badge variant={statusColors[issue.status]} className="font-normal">
                            {issue.status.replace('_', ' ')}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4 shrink-0" />
                        <span className="truncate">Raised by: {issue.raisedBy.name}</span>
                    </div>

                    {issue.assignedTo && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4 shrink-0" />
                            <span className="truncate">Assigned to: {issue.assignedTo.name}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                        {issue.group && (
                            <Badge variant="outline" className="text-xs">
                                {issue.group}
                            </Badge>
                        )}
                    </div>

                    {issue.images && issue.images.length > 0 && (
                        <div className="flex gap-1 pt-1">
                            <Badge variant="outline" className="text-xs">
                                📷 {issue.images.length} {issue.images.length === 1 ? 'image' : 'images'}
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
