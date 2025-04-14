'use client';

import TeX from '@matejmazur/react-katex';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const EhrhartPolynomialViz = dynamic(() => import('@/components/EhrhartPolynomialViz'), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-full"><p>Loading visualization...</p></div>
});

interface EhrhartPolynomialSectionProps {
    rValue: number; // Keep rValue for potential use in viz context if needed
}

export default function EhrhartPolynomialSection({ rValue }: EhrhartPolynomialSectionProps) {
    // Calculate Ehrhart polynomial values for T_r
    // L(P, t) = Vol(P)t^d + (1/2)Sum_F Vol(F)t^(d-1) + ... + chi(P)
    // For T_r: d=3, Vol(T_r) = r/6
    // We need L(T_r, t) = Number of lattice points in t * T_r
    // L(T_r, t) = (r/6)t^3 + t^2 + (2 - r/6)t + 1
    // This specific polynomial L(T_r, t) assumes r is even.
    // A more general form exists but is more complex. Let's use this for illustration.
    const ehrhartPoly = `L(T_r, t) = \\frac{r}{6}t^3 + t^2 + (2 - \\frac{r}{6})t + 1`;
    const ehrhartPolySimplified = `L(T_${rValue}, t) = \\frac{${rValue}}{6}t^3 + t^2 + (2 - \\frac{${rValue}}{6})t + 1`;

    // Calculate L(T_r, 1)
    const L_Tr_1 = (rValue / 6) * 1 + 1 * 1 + (2 - rValue / 6) * 1 + 1;
    const L_Tr_1_calc = L_Tr_1.toFixed(2); // Should ideally be integer B=4

    const ehrhartPolyGen = String.raw`L(P, t) = V(P) t^d + c_{d-1} t^{d-1} + \dots + c_1 t + \chi(P)`;

    return (
        <section className="mb-16 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-300 dark:border-gray-600">
                5. Ehrhart Polynomials: A Generalization
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                Reeve's formula provides a way to calculate volume using specific lattice counts. Ehrhart theory offers a more general framework that connects volume, lattice points, and topology through polynomials. Crucially, this framework applies this approach to shapes (lattice polytopes) in any number of dimensions.
            </p>
            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                For a <TeX math="d" />-dimensional lattice polytope <TeX math="P" />, the Ehrhart polynomial <TeX math="L(P, t)" /> counts the number of standard integer lattice points (<TeX math="Z_1" />) in the scaled polytope <TeX math="tP" /> (where <TeX math="t" /> is a positive integer).
            </p>
            <div className="my-6 p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded">
                <h3 className="text-lg font-semibold mb-2 text-orange-800 dark:text-orange-200">General Form:</h3>
                <p className="text-gray-700 dark:text-gray-300">
                    <TeX math={ehrhartPolyGen} />
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                    <li>The degree <TeX math="d" /> is the dimension of the polytope.</li>
                    <li>The leading coefficient <TeX math="c_d" /> is the <span className="font-semibold">Volume</span> of <TeX math="P" />.</li>
                    <li>The constant term <TeX math="c_0 = L(P, 0)" /> is the <span className="font-semibold">Euler Characteristic</span> <TeX math="\chi(P)" />.</li>
                    <li><TeX math="L(P, 1)" /> is the total number of lattice points in the original polytope <TeX math="P" /> (interior + boundary).</li>
                </ul>
            </div>

            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                For the Reeve tetrahedron <TeX math="T_r" /> (assuming <TeX math="r" /> is even for this simplified example), the Ehrhart polynomial is:
             </p>
             <div className="text-center my-3 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                 <TeX math={ehrhartPoly} block />
            </div>
             <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                Let's check for <TeX math={`r=${rValue}`} /> and <TeX math="t=1" />:
             </p>
            <div className="text-center my-3 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                 <TeX math={`${ehrhartPolySimplified}`} block />
                 <TeX math={`L(T_{${rValue}}, 1) = ${L_Tr_1_calc}`} />
            </div>
             <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                 Since <TeX math="L(T_r, 1) = I + B" />, and we know <TeX math="I=0, B=4" /> for <TeX math="T_r" />, we expect <TeX math="L(T_r, 1) = 4" />. Our calculation confirms this (allowing for floating point representation). The polynomial correctly captures the number of points.
             </p>

             <p className="mt-6 mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <span className="font-semibold">Connection to Reeve's Formula:</span> The Ehrhart polynomial encodes the volume directly as its leading coefficient. Furthermore, a property called <span className="italic">Ehrhart reciprocity</span> relates the values of <TeX math="L(P, t)" /> at negative integers to the number of *interior* lattice points in scaled versions of <TeX math="P" />. This reciprocity provides the theoretical underpinning that connects the overall scaling behavior captured by the Ehrhart polynomial to the specific counts of interior and boundary points (like <TeX math="I_1, B_1, I_2, B_2" />) used in formulas such as Reeve's.
            </p>
             <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                 Thus, the Ehrhart polynomial can be seen as a more general structure from which specific volume formulas involving lattice point counts can be derived.
            </p>

             <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-700 dark:text-gray-200">Visualization: Scaled Tetrahedra and Point Counting</h3>
             <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                The visualization below helps understand Ehrhart polynomials. It shows the Reeve tetrahedron <TeX math="T_r" /> scaled by different integer factors <TeX math="t" />. You can adjust <TeX math="t" /> and see how the number of lattice points inside the scaled tetrahedron <TeX math="t T_r" /> changes, following the polynomial <TeX math="L(T_r, t)" />.
             </p>
            <div className="w-full min-h-96 bg-gray-100 dark:bg-gray-700 rounded-md shadow-inner mb-4 p-4 border border-gray-300 dark:border-gray-600 flex flex-col items-center">
                 {/* EhrhartPolynomialViz should ideally allow changing 't' */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Visualizing <TeX math={`t T_{${rValue}}`} /> and counting lattice points <TeX math="L(T_{{rValue}}, t)" />. (Visualization might show t=1, 2, 3...)
                </p>
                <div className="w-full h-96 relative">
                    <Suspense fallback={<div className="flex justify-center items-center h-full">Loading Visualization...</div>}>
                        <EhrhartPolynomialViz r={rValue} />
                    </Suspense>
                </div>
            </div>
             <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">
                Ehrhart theory also provides a way to relate volume and lattice points in higher dimensions.
             </p>
        </section>
    );
}