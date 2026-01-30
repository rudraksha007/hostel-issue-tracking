import { useEffect, useState } from "react";
import { X, User, Calendar, AlertCircle, CheckCircle2, Clock, ImageIcon, ZoomIn, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { FileRequestParamsT, GetIssuesResponseT } from "@repo/shared/types/api";
import { Priority, Status } from "@repo/db/browser";
import { motion, AnimatePresence } from "motion/react";
import { IssuesAPI } from "@/lib/api/issues";
import { toast } from "react-toastify";
import { getQueriedURL } from "@repo/shared";

interface IssueDetailPanelProps {
    issueId?: string;
    onClose: () => void;
}

export function IssueDetailPanel({ issueId, onClose }: IssueDetailPanelProps) {
    const [issue, setIssue] = useState<GetIssuesResponseT["issues"][0] | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    async function fetchIssue(id: string) {
        setLoading(true);
        const res = await IssuesAPI.getIssues({
            issueId: id,
        });
        if (!res.success) toast.error(res.msg ||"Failed to fetch issue details.");
        else setIssue(res.data.issues[0]);
        setLoading(false);
    }
    useEffect(() => {
        if (issueId) fetchIssue(issueId);
    }, [issueId]);

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

    return (
        <AnimatePresence>
            {issueId && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10 border-b p-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Issue Details</h2>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="p-6 space-y-6">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : issue ? (
                                <>
                                    {/* Title */}
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{issue.title}</h3>
                                        <div className="flex gap-2 flex-wrap">
                                            <Badge variant={priorityColors[issue.priority]}>
                                                {issue.priority}
                                            </Badge>
                                            <Badge variant={statusColors[issue.status]}>
                                                {issue.status.replace('_', ' ')}
                                            </Badge>
                                            {issue.isPublic && (
                                                <Badge variant="outline">Public</Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h4 className="font-semibold mb-2">Description</h4>
                                        <p className="text-muted-foreground">{issue.description}</p>
                                    </div>

                                    {/* Remarks */}
                                    {issue.remarks && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Remarks</h4>
                                            <p className="text-muted-foreground">{issue.remarks}</p>
                                        </div>
                                    )}

                                    {/* Images */}
                                    {issue.images && issue.images.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4" />
                                                Attachments ({issue.images.length})
                                            </h4>
                                            <div className={`grid gap-2 ${issue.images.length === 1 ? 'grid-cols-1' : issue.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
                                                {issue.images.map((img, idx) => 
                                                    <div
                                                        key={idx}
                                                        className="relative group cursor-pointer overflow-hidden rounded-md border"
                                                        onClick={() => setSelectedImageIndex(idx)}
                                                    >
                                                        <img
                                                            src={getQueriedURL("/api/issues/v1/file", { targetId: issue.id, path: img } as FileRequestParamsT)}
                                                            alt={`Attachment ${idx + 1}`}
                                                            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                            <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                            {idx + 1} / {issue.images.length}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Details */}
                                    <div className="space-y-3 border-t pt-4">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                <span className="font-medium">Raised by:</span> {issue.raisedBy.name}
                                            </span>
                                        </div>

                                        {issue.assignedTo && (
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">
                                                    <span className="font-medium">Assigned to:</span> {issue.assignedTo.name}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                <span className="font-medium">Created:</span>{" "}
                                                {new Date(issue.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                <span className="font-medium">Updated:</span>{" "}
                                                {new Date(issue.updatedAt).toLocaleString()}
                                            </span>
                                        </div>

                                        {issue.group && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">
                                                    <span className="font-medium">Group:</span> {issue.group}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="border-t pt-4 flex gap-2">
                                        <Button variant="outline" className="flex-1">
                                            Edit Issue
                                        </Button>
                                        <Button variant="outline" className="flex-1">

                                            {/* Image Lightbox */}
                                            {selectedImageIndex !== null && issue && (
                                                <>
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="fixed inset-0 bg-black/90 z-100"
                                                        onClick={() => setSelectedImageIndex(null)}
                                                    />
                                                    <div className="fixed inset-0 z-101 flex items-center justify-center p-4">
                                                        {/* Close Button */}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute top-4 right-4 text-white hover:bg-white/20"
                                                            onClick={() => setSelectedImageIndex(null)}
                                                        >
                                                            <X className="w-6 h-6" />
                                                        </Button>

                                                        {/* Previous Button */}
                                                        {issue.images.length > 1 && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute left-4 text-white hover:bg-white/20"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedImageIndex((prev) =>
                                                                        prev === null || prev === 0 ? issue.images.length - 1 : prev - 1
                                                                    );
                                                                }}
                                                            >
                                                                <ChevronLeft className="w-8 h-8" />
                                                            </Button>
                                                        )}

                                                        {/* Next Button */}
                                                        {issue.images.length > 1 && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute right-4 text-white hover:bg-white/20"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedImageIndex((prev) =>
                                                                        prev === null || prev === issue.images.length - 1 ? 0 : prev + 1
                                                                    );
                                                                }}
                                                            >
                                                                <ChevronRight className="w-8 h-8" />
                                                            </Button>
                                                        )}

                                                        {/* Image */}
                                                        <motion.div
                                                            key={selectedImageIndex}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            className="relative max-w-6xl max-h-[90vh] flex flex-col items-center"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <img
                                                                src={issue.images[selectedImageIndex]}
                                                                alt={`Attachment ${selectedImageIndex + 1}`}
                                                                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                                                            />
                                                            <div className="mt-4 flex items-center gap-4 text-white">
                                                                <span className="text-sm">
                                                                    Image {selectedImageIndex + 1} of {issue.images.length}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-white hover:bg-white/20"
                                                                    onClick={() => {
                                                                        const link = document.createElement('a');
                                                                        link.href = issue.images[selectedImageIndex];
                                                                        link.download = `attachment-${selectedImageIndex + 1}`;
                                                                        link.click();
                                                                    }}
                                                                >
                                                                    <Download className="w-4 h-4 mr-2" />
                                                                    Download
                                                                </Button>
                                                            </div>

                                                            {/* Thumbnail Strip */}
                                                            {issue.images.length > 1 && (
                                                                <div className="mt-4 flex gap-2 overflow-x-auto max-w-full px-4">
                                                                    {issue.images.map((img, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className={`shrink-0 cursor-pointer rounded border-2 transition-all ${idx === selectedImageIndex
                                                                                    ? 'border-white'
                                                                                    : 'border-transparent opacity-60 hover:opacity-100'
                                                                                }`}
                                                                            onClick={() => setSelectedImageIndex(idx)}
                                                                        >
                                                                            <img
                                                                                src={img}
                                                                                alt={`Thumbnail ${idx + 1}`}
                                                                                className="w-16 h-16 object-cover rounded"
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    </div>
                                                </>
                                            )}
                                            Change Status
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground py-12">
                                    Select an issue to view details
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
