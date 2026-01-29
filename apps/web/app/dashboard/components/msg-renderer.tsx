'use client';
import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

type Message = {
    id: string;
    title: string;
    content: string;
}
export function MessageRenderer({ init_messages }: { init_messages: Message[] }) {
    const [msgs, setMsgs] = useState<Message[]>([{id: '0', title: 'Welcome to Hostel Tracker!', content: 'Stay updated with the latest announcements and updates from your hostel management.'}, ...init_messages]);

    const comp = useMemo(()=> {
        return msgs.map((msg, idx)=> (
            <MessageCard key={msg.id} msg={msg} isNew={idx === 0} />
        ))
    }, [msgs]);
    return (
        <div className="w-full overflow-auto flex flex-col p-4 gap-3">
            {comp}
        </div>
    )
}

function MessageCard({ msg, isNew }: { msg: Message; isNew?: boolean }) {
    return (
        <Card className='w-full group hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm bg-linear-to-br from-white/95 to-white/90 dark:from-slate-900/95 dark:to-slate-900/90 border-white/20 dark:border-slate-700/50 overflow-hidden relative'>
            {isNew && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />
            )}
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-semibold bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        {msg.title}
                    </CardTitle>
                    {isNew && (
                        <Badge variant="default" className="bg-linear-to-r from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/30 animate-in fade-in slide-in-from-top-2 duration-500">
                            <Sparkles className="w-3 h-3" />
                            New
                        </Badge>
                    )}
                </div>
                <CardDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {msg.content}
                </CardDescription>
            </CardHeader>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
    )
}