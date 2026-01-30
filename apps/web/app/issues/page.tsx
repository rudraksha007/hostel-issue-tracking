"use client";

import { IssuesAPI } from "@/lib/api/issues";
import { GetIssuesRequestT, GetIssuesResponseT } from "@repo/shared/types/api";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "../components/session-consumer";
import { Unauthorised } from "../components/unauthorised";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { AnimatePresence } from "motion/react";
import { 
    AlertCircle, 
    Loader2, 
    Plus, 
    Filter, 
    X,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { Priority, Status } from "@repo/db/browser";
import { IssueCard } from "./components/issue-card";
import { IssueDetailPanel } from "./components/issue-detail-panel";

export default function IssuesPage() {
    const [loading, setLoading] = useState(false);
    const [issues, setIssues] = useState<GetIssuesResponseT["issues"]>([]);
    const [selectedIssueId, setSelectedIssueId] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    const [config, setConfig] = useState<GetIssuesRequestT>({
        status: [Status.ASSIGNED, Status.IN_PROGRESS, Status.RESOLVED, Status.CLOSED, Status.REPORTED],
        priority: [Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.EMERGENCY],
        page: 1,
        pageSize: 20,
        sort: 'NEW_FIRST',
        isPublic: false,
        issueId: undefined,
        assignedTo: undefined,
        raisedBy: undefined,
        warden: undefined,
        groupTag: undefined,
    });
    
    const { user } = useSession();
    
    if (!user) {
        return <>Session Expired. Please relogin: <button onClick={() => window.location.reload()}>Relogin</button></>;
    }
    async function fetchIssues(cfg: GetIssuesRequestT, clear: boolean = true) {
        setLoading(true);
        const res = await IssuesAPI.getIssues(cfg);
        if (!res.success) {
            toast.error(res.msg || "Failed to fetch issues");
            setHasMore(false);
        } else {
            if (clear) {
                setIssues(res.data.issues);
            } else {
                setIssues(prev => [...prev, ...res.data.issues]);
            }
            setHasMore(res.data.issues.length === cfg.pageSize);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setConfig(prev => ({ ...prev, page: 1 }));
            fetchIssues({ ...config, page: 1 }, true);
        }, 500);
    }, [config.status, config.priority, config.sort, config.isPublic]);

    useEffect(() => {
        fetchIssues(config, true);
    }, []);

    const handleLoadMore = () => {
        const nextPage = config.page + 1;
        setConfig(prev => ({ ...prev, page: nextPage }));
        fetchIssues({ ...config, page: nextPage }, false);
    };

    const toggleStatus = (status: Status) => {
        setConfig(prev => {
            const newStatuses = prev.status.includes(status)
                ? prev.status.filter(s => s !== status)
                : [...prev.status, status];
            return { ...prev, status: newStatuses, page: 1 };
        });
    };

    const togglePriority = (priority: Priority) => {
        setConfig(prev => {
            const newPriorities = prev.priority.includes(priority)
                ? prev.priority.filter(p => p !== priority)
                : [...prev.priority, priority];
            return { ...prev, priority: newPriorities, page: 1 };
        });
    };

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

    return (
        <div className="max-w-screen h-full overflow-x-hidden flex flex-row relative">
            <div className="w-full overflow-y-auto h-full flex flex-col gap-4 p-6 overflow-x-hidden relative">
                {/* Header */}
                <div className="flex flex-col gap-3 sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10 pb-2">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Issues Management</h1>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                    </div>

                    {/* Search */}
                    <Input
                        placeholder="Search issues by title or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-md"
                    />

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="border rounded-lg p-4 space-y-4 bg-card">
                            {/* Sort */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Sort By</label>
                                <select
                                    value={config.sort}
                                    onChange={(e) => setConfig(prev => ({ 
                                        ...prev, 
                                        sort: e.target.value as 'OLD_FIRST' | 'NEW_FIRST',
                                        page: 1 
                                    }))}
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                >
                                    <option value="NEW_FIRST">Newest First</option>
                                    <option value="OLD_FIRST">Oldest First</option>
                                </select>
                            </div>

                            {/* Public Filter */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={config.isPublic}
                                    onChange={(e) => setConfig(prev => ({ 
                                        ...prev, 
                                        isPublic: e.target.checked,
                                        page: 1 
                                    }))}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <label htmlFor="isPublic" className="text-sm font-medium">
                                    Show only public issues
                                </label>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Status</label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(Status).map((status) => (
                                        <Badge
                                            key={status}
                                            variant={config.status.includes(status) ? statusColors[status] : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => toggleStatus(status)}
                                        >
                                            {config.status.includes(status) && <X className="w-3 h-3 mr-1" />}
                                            {status.replace('_', ' ')}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Priority Filter */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Priority</label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(Priority).map((priority) => (
                                        <Badge
                                            key={priority}
                                            variant={config.priority.includes(priority) ? priorityColors[priority] : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => togglePriority(priority)}
                                        >
                                            {config.priority.includes(priority) && <X className="w-3 h-3 mr-1" />}
                                            {priority}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setConfig({
                                        status: Object.values(Status),
                                        priority: Object.values(Priority),
                                        page: 1,
                                        pageSize: 20,
                                        sort: 'NEW_FIRST',
                                        isPublic: false,
                                        issueId: undefined,
                                        assignedTo: undefined,
                                        raisedBy: undefined,
                                        warden: undefined,
                                        groupTag: undefined,
                                    });
                                    setSearchQuery("");
                                }}
                                className="w-full"
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    )}

                    {/* Active Filters Summary */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-muted-foreground">Active filters:</span>
                        {config.status.length < Object.values(Status).length && (
                            <Badge variant="secondary" className="text-xs">
                                {config.status.length} Status
                            </Badge>
                        )}
                        {config.priority.length < Object.values(Priority).length && (
                            <Badge variant="secondary" className="text-xs">
                                {config.priority.length} Priority
                            </Badge>
                        )}
                        {config.isPublic && (
                            <Badge variant="secondary" className="text-xs">Public Only</Badge>
                        )}
                        {!config.status.length && !config.priority.length && !config.isPublic && (
                            <span className="text-xs text-muted-foreground">None</span>
                        )}
                    </div>
                </div>

                {/* Issues Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {issues.map((issue) => (
                            <IssueCard 
                                key={issue.id} 
                                issue={issue}
                                onClick={() => setSelectedIssueId(issue.id)}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center h-32">
                        <Loader2 className="w-8 h-8 mb-4 animate-spin text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Loading issues...</p>
                    </div>
                )}

                {/* Empty State */}
                {issues.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <AlertCircle className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">No issues found</p>
                        <p className="text-sm">Try adjusting your search criteria or filters</p>
                    </div>
                )}

                {/* Load More Button */}
                {!loading && hasMore && issues.length > 0 && (
                    <div className="flex justify-center py-4">
                        <Button onClick={handleLoadMore} variant="outline">
                            Load More
                        </Button>
                    </div>
                )}

                {/* End of Results */}
                {!loading && !hasMore && issues.length > 0 && (
                    <div className="text-center text-sm text-muted-foreground py-4">
                        No more issues to load
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => {/* TODO: Open add issue modal */}}
                className="fixed bottom-8 right-8 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-30"
                aria-label="Add Issue"
                style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Issue Detail Panel */}
            <IssueDetailPanel 
                issueId={selectedIssueId} 
                onClose={() => setSelectedIssueId(undefined)} 
            />
        </div>
    );
}