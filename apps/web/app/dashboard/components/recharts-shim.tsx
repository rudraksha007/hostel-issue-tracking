"use client";
import React from "react";

// Lightweight visual shim for a subset of Recharts used by the admin dashboard.
// This renders simple SVG visuals from `data` so the UI displays charts even
// when the real `recharts` package isn't installed.

function ResponsiveContainer({ width = "100%", height = "100%", children }: any) {
	return (
		<div style={{ width: typeof width === "number" ? `${width}px` : width, height: typeof height === "number" ? `${height}px` : height }} className="w-full h-full">
			{children}
		</div>
	);
}

function CartesianGrid(_: any) {
	return null;
}
function XAxis(_: any) {
	return null;
}
function YAxis(_: any) {
	return null;
}
function Tooltip(_: any) {
	return null;
}

// LineChart: accepts `data` prop and child <Line dataKey=... stroke=... /> elements.
function LineChart({ data = [], children, width = "100%", height = "100%" }: any) {
	const H = 100;
	const W = 200;
	const numeric = Array.isArray(data) ? data : [];

	// find first Line child to determine dataKey and stroke
	const lineChild: any = React.Children.toArray(children).find((c: any) => c && c.type && (c.type.displayName === "ShimLine" || c.type.name === "ShimLine"));
	const dataKey = lineChild?.props?.dataKey;
	const stroke = lineChild?.props?.stroke ?? "#7c3aed";
	const strokeWidth = lineChild?.props?.strokeWidth ?? 2;

	if (!numeric.length || !dataKey) {
		return (
			<svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
				<rect width="100%" height="100%" fill="rgba(255,255,255,0.02)" rx="8" />
			</svg>
		);
	}

	const values = numeric.map((d: any) => Number(d?.[dataKey] ?? 0));
	const min = Math.min(...values);
	const max = Math.max(...values);
	const pts = values.map((v: number, i: number) => {
		const x = (i / Math.max(1, values.length - 1)) * (W - 20) + 10;
		const y = H - 10 - (max === min ? H / 2 : ((v - min) / (max - min)) * (H - 20));
		return `${x},${y}`;
	});
	const dAttr = pts.map((p, i) => (i === 0 ? `M ${p}` : `L ${p}`)).join(" ");

	return (
		<svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
			<rect width="100%" height="100%" fill="transparent" rx="8" />
			<path d={dAttr} stroke={stroke} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function ShimLine(_: any) {
	return null;
}
ShimLine.displayName = "ShimLine";

// Pie chart: simple SVG pie that reads `data` prop and uses child <Cell fill=... /> colors
function PieChart({ children }: any) {
	return <div className="w-full h-full">{children}</div>;
}

function Pie({ data = [], dataKey = "value", nameKey = "name", innerRadius = 30, outerRadius = 50, children }: any) {
	const D = Array.isArray(data) ? data : [];
	const total = D.reduce((s: number, item: any) => s + Number(item?.[dataKey] ?? 0), 0) || 1;
	const colors = React.Children.toArray(children).map((c: any) => c?.props?.fill).filter(Boolean) as string[];

	let angle = -90;
	const cx = 50;
	const cy = 50;
	const r = outerRadius;

	function arcPath(start: number, end: number) {
		const rad = (deg: number) => (deg * Math.PI) / 180;
		const x1 = cx + r * Math.cos(rad(start));
		const y1 = cy + r * Math.sin(rad(start));
		const x2 = cx + r * Math.cos(rad(end));
		const y2 = cy + r * Math.sin(rad(end));
		const large = end - start > 180 ? 1 : 0;
		return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
	}

	return (
		<svg viewBox="0 0 100 100" className="w-full h-full">
			{D.map((d: any, i: number) => {
				const v = Number(d?.[dataKey] ?? 0);
				const portion = (v / total) * 360;
				const path = arcPath(angle, angle + portion);
				const fill = colors[i] ?? ["#7c3aed", "#06b6d4", "#f97316"][i % 3];
				angle += portion;
				return <path key={i} d={path} fill={fill} />;
			})}
			{/* center hole for innerRadius */}
			<circle cx="50" cy="50" r={innerRadius * 100 / 200} fill="rgba(0,0,0,0)" />
		</svg>
	);
}

function Cell(_: any) {
	return null;
}

export default {
	ResponsiveContainer,
	LineChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Line: ShimLine,
	PieChart,
	Pie,
	Cell,
};
