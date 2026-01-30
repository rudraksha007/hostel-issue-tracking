"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
	error?: Error & { digest?: string };
	reset?: () => void;
	statusCode?: number;
	message?: string;
	title?: string;
}

export default function ErrorPage({
	error,
	reset,
	statusCode = 500,
	message,
	title,
}: ErrorPageProps) {
	const router = useRouter();

	const defaultTitle = statusCode === 404 ? "Page Not Found" : "Something Went Wrong";
	const defaultMessage = statusCode === 404 
		? "The page you're looking for doesn't exist or has been moved."
		: error?.message || "An unexpected error occurred. Please try again.";

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
			<div className="max-w-md w-full">
				<div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
					{/* Error Icon */}
					<div className="flex justify-center mb-6">
						<div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
							<AlertTriangle className="w-12 h-12 text-red-400" />
						</div>
					</div>

					{/* Error Code */}
					<div className="text-center mb-4">
						<h1 className="text-6xl font-bold text-white/90 mb-2">
							{statusCode}
						</h1>
						<h2 className="text-xl font-semibold text-white mb-3">
							{title || defaultTitle}
						</h2>
						<p className="text-slate-300 text-sm leading-relaxed">
							{message || defaultMessage}
						</p>
					</div>

					{/* Error Details (if available) */}
					{error?.digest && (
						<div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
							<p className="text-xs text-slate-400 font-mono">
								Error ID: {error.digest}
							</p>
						</div>
					)}

					{/* Action Buttons */}
					<div className="mt-8 flex flex-col sm:flex-row gap-3">
						{reset && (
							<button
								onClick={reset}
								className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
							>
								<RefreshCw className="w-4 h-4" />
								Try Again
							</button>
						)}
						<button
							onClick={() => router.push("/dashboard")}
							className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-colors border border-white/10"
						>
							<Home className="w-4 h-4" />
							Go to Dashboard
						</button>
					</div>

					{/* Additional Help */}
					<div className="mt-6 pt-6 border-t border-white/10">
						<p className="text-xs text-slate-400 text-center">
							If this problem persists, please contact support.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}