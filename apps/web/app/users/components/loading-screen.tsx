import { Loader2 } from "lucide-react";

export function LoadingScreen({ loading }: { loading: boolean }) {
    if (!loading) return null;
    return (<>
        <div className="h-screen w-screen fixed top-0 left-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-500">
            <Loader2 className="h-5 w-5 animate-spin" />
        </div>
    </>)
}