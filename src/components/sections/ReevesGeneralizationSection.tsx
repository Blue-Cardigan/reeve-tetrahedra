'use client';

import TeX from '@matejmazur/react-katex';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import the restored/recreated visualization component
const ReeveFormulaViz = dynamic(() => import('@/components/ReeveFormulaViz'), { // Ensure path is correct
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-[550px] bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600"><p className="text-gray-500 dark:text-gray-400">Loading visualization...</p></div>
});

interface ReevesGeneralizationSectionProps {
    rValue: number;
    setRValue: (value: number) => void;
}

export default function ReevesGeneralizationSection({ rValue, setRValue }: ReevesGeneralizationSectionProps) {

    const reeveFormula = String.raw`12V(P) = 2I_2 + B_2 - 2(2I_1 + B_1)`;
    const z1Def = String.raw`Z_1 = \mathbb{Z}^3 = \{(x, y, z) \mid x, y, z \in \mathbb{Z}\}`;
    const z2Def = String.raw`Z_2 = \{(x, y, z) \mid 2x, 2y, 2z \in \mathbb{Z}\}`;


    return (
        <section className="mb-16 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-300 dark:border-gray-600">
                4. Reeve's Formula using Finer Lattices
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                While a direct 3D Pick's theorem using only standard integer lattice points (<TeX math="Z_1" />) fails, John Reeve discovered a more sophisticated way to calculate the volume of a 3D lattice polyhedron (<TeX math="P" />). His approach involved considering points from "finer" lattices, specifically the lattice <TeX math="Z_2" /> which includes points with half-integer coordinates.
            </p>
             <div className="my-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded">
                 <h3 className="text-lg font-semibold mb-2 text-indigo-800 dark:text-indigo-200">Definitions:</h3>
                 <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Standard Lattice (<TeX math="Z_1" />): Points with integer coordinates. <TeX math={z1Def} />.</li>
                    <li>Half-Integer Lattice (<TeX math="Z_2" />): Points whose coordinates are multiples of 1/2. <TeX math={z2Def} />. This includes all <TeX math="Z_1" /> points.</li>
                    <li><TeX math="I_n" />: Number of <TeX math="Z_n" /> points strictly *inside* <TeX math="P" />.</li>
                    <li><TeX math="B_n" />: Number of <TeX math="Z_n" /> points exactly *on the boundary* of <TeX math="P" />.</li>
                </ul>
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                For a 3D lattice polyhedron (like the Reeve tetrahedra), Reeve's formula relates the volume <TeX math="V" /> to the counts of points from <TeX math="Z_1" /> and <TeX math="Z_2" /> on the boundary and interior:
            </p>
            <div className="text-center my-3 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                 <TeX math={reeveFormula} block />
            </div>
             <div className="flex flex-col items-center my-6 p-4 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                <label htmlFor="rSliderReeve" className="mb-2 text-gray-700 dark:text-gray-200">
                    Set the height parameter <TeX math="r" />: <span className="font-bold">{rValue}</span>
                </label>
                <input
                    id="rSliderReeve"
                    type="range"
                    min="1"
                    max="20"
                    value={rValue}
                    onChange={(e) => setRValue(parseInt(e.target.value, 10))}
                    className="w-full max-w-md cursor-pointer"
                    aria-label={`Set r value for Reeve's Formula visualization, current value ${rValue}`}
                />
            </div>
             <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                The visualization below shows the Reeve tetrahedron <TeX math={`T_{${rValue}}`} />, highlighting the points from <TeX math="Z_1" /> and <TeX math="Z_2" /> (those not in <TeX math="Z_1" />) within and on its boundary. It calculates the values for <TeX math="I_1, B_1, I_2, B_2" /> and verifies Reeve's formula against the known volume <TeX math="V=r/6" />.
            </p>

             <Suspense fallback={
                 <div className="flex justify-center items-center h-[550px] bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600">
                     <p className="text-gray-500 dark:text-gray-400">Loading interactive visualization...</p>
                 </div>
                }>
                  {/* Use the detailed visualization component */}
                 <ReeveFormulaViz r={rValue} />
            </Suspense>
             <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic mt-2">
                 Observe how incorporating points from the finer <TeX math="Z_2" /> lattice allows for a consistent volume calculation.
             </p>
        </section>
    );
}
