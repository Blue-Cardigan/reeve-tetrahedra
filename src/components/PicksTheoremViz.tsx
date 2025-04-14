'use client';

import React, { useState, useCallback, useMemo } from 'react';
import TeX from '@matejmazur/react-katex';

interface Point {
    x: number;
    y: number;
}

// Helper function for Greatest Common Divisor
const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
};

// Helper function to check if a point is inside a polygon using the ray casting algorithm
const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
    let isInside = false;
    const n = polygon.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y))
            && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }
    return isInside;
};

const PicksTheorem2DViz: React.FC = () => {
    const [vertices, setVertices] = useState<Point[]>([]);
    const [hoverPoint, setHoverPoint] = useState<Point | null>(null);

    const gridSize = 20; // Size of each grid cell in SVG units
    const viewWidth = 400;
    const viewHeight = 300;
    const numXLines = Math.floor(viewWidth / gridSize);
    const numYLines = Math.floor(viewHeight / gridSize);

    const handleGridClick = (event: React.MouseEvent<SVGSVGElement>) => {
        const svgRect = event.currentTarget.getBoundingClientRect();
        const x = Math.round((event.clientX - svgRect.left) / gridSize);
        const y = Math.round((event.clientY - svgRect.top) / gridSize);
        const newPoint = { x, y };

        // Avoid duplicate consecutive points or closing the polygon prematurely
        if (vertices.length > 0 && vertices[vertices.length - 1].x === x && vertices[vertices.length - 1].y === y) {
            return;
        }
         // If clicking the start point to close
        if (vertices.length > 2 && vertices[0].x === x && vertices[0].y === y) {
             // Close the polygon implicitly by not adding duplicate start point
            console.log("Polygon closed");
            return; // Or potentially trigger calculation here
        }

        setVertices(prev => [...prev, newPoint]);
    };

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
        const svgRect = event.currentTarget.getBoundingClientRect();
        const x = Math.round((event.clientX - svgRect.left) / gridSize);
        const y = Math.round((event.clientY - svgRect.top) / gridSize);
        setHoverPoint({ x, y });
    };

    const handleMouseLeave = () => {
        setHoverPoint(null);
    };


    const { interiorPoints, boundaryPoints, area } = useMemo(() => {
        if (vertices.length < 3) {
            return { interiorPoints: 0, boundaryPoints: 0, area: 0 };
        }

        let b = 0; // Boundary points count
        const polygon = [...vertices]; // Use a copy

        // Calculate B: Sum of gcd(|dx|, |dy|) for each edge
        for (let i = 0; i < polygon.length; i++) {
            const p1 = polygon[i];
            const p2 = polygon[(i + 1) % polygon.length]; // Wrap around for closing edge
            b += gcd(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y));
        }

        // Calculate I: Iterate through bounding box and check points
        let iCount = 0;
        if (b > 0) { // Only proceed if we have a polygon
             const minX = Math.min(...polygon.map(p => p.x));
             const maxX = Math.max(...polygon.map(p => p.x));
             const minY = Math.min(...polygon.map(p => p.y));
             const maxY = Math.max(...polygon.map(p => p.y));

            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    const point = { x, y };
                    if (isPointInPolygon(point, polygon)) {
                         // Now check if it's on the boundary
                         let isOnBoundary = false;
                         for (let k = 0; k < polygon.length; k++) {
                            const p1 = polygon[k];
                            const p2 = polygon[(k + 1) % polygon.length];
                            const dx = p2.x - p1.x;
                            const dy = p2.y - p1.y;
                             // Check collinearity and if point is within segment bounds
                             if (Math.abs(dx * (point.y - p1.y) - dy * (point.x - p1.x)) < 1e-9) { // Check collinearity (tolerance for float issues)
                                if (Math.min(p1.x, p2.x) <= point.x && point.x <= Math.max(p1.x, p2.x) &&
                                    Math.min(p1.y, p2.y) <= point.y && point.y <= Math.max(p1.y, p2.y)) {
                                    isOnBoundary = true;
                                    break;
                                }
                            }
                        }
                        if (!isOnBoundary) {
                            iCount++;
                        }
                    }
                }
            }
        }


        // Pick's Formula: A = I + B/2 - 1
        const a = iCount + b / 2 - 1;

        return { interiorPoints: iCount, boundaryPoints: b, area: a >= 0 ? a : 0 };
    }, [vertices]);

    const handleReset = () => {
        setVertices([]);
    };

    const polygonPointsString = useMemo(() => {
        return vertices.map(p => `${p.x * gridSize},${p.y * gridSize}`).join(' ');
    }, [vertices, gridSize]);

    return (
        <div className="flex flex-col md:flex-row items-start gap-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 shadow">
            <div className="flex-grow">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Click on grid intersections to define polygon vertices. Click the starting point again (or nearby) to close the polygon (implicitly).
                </p>
                <svg
                    width={viewWidth}
                    height={viewHeight}
                    viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                    onClick={handleGridClick}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 cursor-crosshair rounded"
                >
                    {/* Grid Lines */}
                    {Array.from({ length: numXLines + 1 }).map((_, i) => (
                        <line key={`v-${i}`} x1={i * gridSize} y1="0" x2={i * gridSize} y2={viewHeight} stroke="#e2e8f0" strokeWidth="0.5" />
                    ))}
                    {Array.from({ length: numYLines + 1 }).map((_, i) => (
                        <line key={`h-${i}`} x1="0" y1={i * gridSize} x2={viewWidth} y2={i * gridSize} stroke="#e2e8f0" strokeWidth="0.5" />
                    ))}

                    {/* Polygon Fill */}
                    {vertices.length >= 3 && (
                         <polygon points={polygonPointsString} fill="rgba(135, 206, 235, 0.4)" /> // Light sky blue fill
                    )}

                    {/* Polygon Outline */}
                     <polyline points={polygonPointsString} fill="none" stroke="#008080" strokeWidth="2" />


                    {/* Vertices */}
                    {vertices.map((p, i) => (
                        <circle key={`vtx-${i}`} cx={p.x * gridSize} cy={p.y * gridSize} r="4" fill="#ffa500" stroke="#a06800" strokeWidth="1" /> // Orange vertices
                    ))}

                    {/* Calculated Points (visual placeholders for now) */}
                    {/* TODO: Render actual interior/boundary points */}


                    {/* Hover Point Indicator */}
                    {hoverPoint && (
                        <circle cx={hoverPoint.x * gridSize} cy={hoverPoint.y * gridSize} r="3" fill="rgba(255, 0, 0, 0.5)" />
                    )}
                </svg>
            </div>
            <div className="w-full md:w-52 flex-shrink-0 space-y-3">
                 <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Pick's Theorem</h4>
                 <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                     <p><TeX math="I" /> (Interior Points): <span className="font-mono font-semibold">{interiorPoints}</span></p>
                     <p><TeX math="B" /> (Boundary Points): <span className="font-mono font-semibold">{boundaryPoints}</span></p>
                 </div>
                 <hr className="border-gray-300 dark:border-gray-600" />
                 <p className="text-gray-600 dark:text-gray-300">
                     Area <TeX math="A = I + \frac{B}{2} - 1" />
                 </p>
                 <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                     <TeX math={`A = ${interiorPoints} + \\frac{${boundaryPoints}}{2} - 1 = ${area.toFixed(1)}`} />
                 </p>
                 <button
                    onClick={handleReset}
                    className="w-full mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded shadow transition duration-150 ease-in-out"
                >
                    Reset Polygon
                </button>
            </div>
        </div>
    );
};

export default PicksTheorem2DViz;