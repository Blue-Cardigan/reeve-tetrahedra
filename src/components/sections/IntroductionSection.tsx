'use client';

import TeX from '@matejmazur/react-katex';
import React, { Suspense } from 'react';
import ReeveTetrahedronViz from '@/components/ReeveTetrahedronViz';

interface IntroductionSectionProps {
    rValue: number;
    setRValue: (value: number) => void;
}

export default function IntroductionSection({ rValue, setRValue }: IntroductionSectionProps) {
    return (
        <section className="mb-16 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-300 dark:border-gray-600">
                1. What are Reeve Tetrahedra?
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                In geometry, the Reeve tetrahedra are a family of polyhedra (3D shapes with flat faces) defined by four specific corner points, called vertices. These vertices have coordinates:
                <TeX math="(0, 0, 0)" />, <TeX math="(1, 0, 0)" />, <TeX math="(0, 1, 0)" />, and <TeX math="(1, 1, r)" />, where <TeX math="r" /> is any positive whole number.
            </p>
             <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded">
                <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">Vertices:</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Origin: <TeX math="(0, 0, 0)" /></li>
                    <li>Point on X-axis: <TeX math="(1, 0, 0)" /></li>
                    <li>Point on Y-axis: <TeX math="(0, 1, 0)" /></li>
                    <li>Top point: <TeX math="(1, 1, r)" /> (The value <TeX math="r" /> determines its height)</li>
                </ul>
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                They are named after John Reeve, who studied them in 1957. These simple-looking shapes have some surprising properties, especially when considering points with whole number coordinates (lattice points).
            </p>
            <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                The parameter <TeX math="r" /> controls the "height" or "sharpness" of the tetrahedron. As you change <TeX math="r" />, the shape changes, and importantly, its volume changes too. The volume <TeX math="V" /> of a Reeve tetrahedron <TeX math="T_r" /> is given by a simple formula: <TeX math="V = r/6" />.
            </p>

            <h3 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Interactive Visualisation</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                Use the slider below to change the value of <TeX math="r" />. Observe how the tetrahedron stretches vertically. The visualisation below shows the shape and calculates its volume based on your chosen <TeX math="r" />.
            </p>
            <div className="flex flex-col items-center mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                <label htmlFor="rSlider" className="mb-2 text-gray-700 dark:text-gray-200">
                    Set the height parameter <TeX math="r" />: <span className="font-bold">{rValue}</span>
                </label>
                <input
                    id="rSlider"
                    type="range"
                    min="1"
                    max="20" // Adjust max value as needed
                    value={rValue}
                    onChange={(e) => setRValue(parseInt(e.target.value, 10))}
                    className="w-full max-w-md cursor-pointer"
                    aria-label={`Set r value, current value ${rValue}`}
                />
                <p className="mt-3 text-lg font-medium text-gray-700 dark:text-gray-200">
                    Calculated Volume = <TeX math={`\\frac{${rValue}}{6}`} />
                </p>
            </div>
            <div className="w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-md shadow-inner mb-4 overflow-hidden relative border border-gray-300 dark:border-gray-600">
                 <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
                    Reeve Tetrahedron for r = {rValue}
                 </div>
                <Suspense fallback={<div className="flex justify-center items-center h-full">Loading 3D Model...</div>}>
                    <ReeveTetrahedronViz r={rValue} />
                </Suspense>
            </div>
             <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">
                This 3D model shows the tetrahedron with vertices (0,0,0), (1,0,0), (0,1,0), and (1,1,{rValue}).
             </p>
             <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">
                Notice that the tetrahedron avoids passing through any lattice points, no matter how large you make <TeX math="r" />.
             </p>
        </section>
    );
}