'use client';

import TeX from '@matejmazur/react-katex';
import React from 'react';

export default function ReevesFormulaSection() {

    return (
        <section className="mb-16 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-300 dark:border-gray-600">
                3. Failure of a Simple 3D Pick's Theorem
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                John Reeve used the tetrahedra <TeX math="T_r" /> to show that there's no simple formula like Pick's Theorem for volume in 3D based solely on the number of interior (<TeX math="I_1=0" />) and boundary (<TeX math="B_1=4" />) lattice points.
            </p>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                No matter how large you make <TeX math="r" /> in the Reeve tetrahedron, it never passes through any lattice points.
            </p>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                Consider the Reeve tetrahedron <TeX math="T_r" /> with vertices at <TeX math="(0, 0, 0)" />, <TeX math="(1, 0, 0)" />, <TeX math="(0, 1, 0)" />, and <TeX math="(1, 1, r)" />. Let's examine its properties:
             </p>
             <div className="my-6 p-4 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded">
                 <h3 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-200">Properties of <TeX math="T_r" />:</h3>
                 <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                     <li>Volume: <TeX math={`V = \\frac{r}{6}`} />. The volume depends directly on <TeX math="r" />.</li>
                     <li>Interior Lattice Points (<TeX math="I_1=0" />): For any <TeX math="r \ge 1" />, there are <span className="font-bold">no</span> lattice points strictly inside <TeX math="T_r" />. So, <TeX math="I_1=0" />.</li>
                     <li>Boundary Lattice Points (<TeX math="B_1=4" />): The only lattice points on the boundary (faces, edges, or vertices) are the four vertices themselves. So, <TeX math="B_1=4" />.</li>
                </ul>
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                Crucially, notice that <TeX math="I_1=0" /> and <TeX math="B_1=4" /> are the *same* for all values of <TeX math="r \ge 1" /> (<TeX math="I_1=0, B_1=4" />), but the volume <TeX math="V = r/6" /> changes with <TeX math="r" />.
            </p>
             <p className="mb-6 font-semibold text-gray-700 dark:text-gray-200">
                Since we can have different volumes for the same number of interior (<TeX math="I_1=0" />) and boundary (<TeX math="B_1=4" />) points using the standard integer lattice (<TeX math="\mathbb{Z}^1" /> or <TeX math="Z_1" />), no simple formula analogous to Pick's <TeX math="V = f(I_1, B_1)" /> can exist for 3D polyhedra.
            </p>
            <p className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed italic">
                This failure prompted Reeve to investigate further, leading to a more sophisticated formula involving points from finer lattices.
            </p>
        </section>
    );
}