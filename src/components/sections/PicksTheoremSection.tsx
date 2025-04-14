'use client';

import TeX from '@matejmazur/react-katex';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Uncomment and import the new 2D visualization
const PicksTheorem2DViz = dynamic(() => import('@/components/PicksTheoremViz'), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-64 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600"><p className="text-gray-500 dark:text-gray-400">Loading interactive visualization...</p></div>
});

export default function PicksTheoremSection() {
    return (
        <section className="mb-16 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-300 dark:border-gray-600">
                2. Pick's Theorem (2D Analogy)
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                Pick's Theorem provides a simple formula for the area of a polygon whose vertices are points on a grid (lattice points).
            </p>
            <div className="my-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded">
                <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">Pick's Formula:</h3>
                 <p className="text-gray-700 dark:text-gray-300">
                    The area <TeX math="A" /> of such a polygon is given by:
                 </p>
                <div className="text-center my-3">
                     <TeX math="A = I + \frac{B}{2} - 1" block />
                </div>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                    <li><TeX math="I" /> = Number of interior lattice points (points strictly inside the polygon).</li>
                    <li><TeX math="B" /> = Number of boundary lattice points (points exactly on the edges of the polygon).</li>
                </ul>
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                This theorem is elegant because it connects the geometric concept of area with the arithmetic concept of counting points. However, Pick's theorem famously *does not* generalize directly to three dimensions. Reeve tetrahedra are a key example demonstrating this failure.
            </p>

            {/* Placeholder for the interactive 2D visualization */}
            <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-700 dark:text-gray-200">Interactive 2D Example</h3>
             {/* Removed placeholder div */}
             {/* Render the actual component */}
             <Suspense fallback={
                 <div className="flex justify-center items-center h-64 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600">
                     <p className="text-gray-500 dark:text-gray-400">Loading interactive visualization...</p>
                 </div>
                }>
                 <PicksTheorem2DViz />
            </Suspense>
             <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic mt-2">
                Click grid points to define a polygon and see Pick's Theorem calculate its area.
             </p>
        </section>
    );
}