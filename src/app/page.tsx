'use client'; // Required for react-katex and potentially react-three-fiber later

import TeX from '@matejmazur/react-katex';
import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import ReeveTetrahedronViz from '@/components/ReeveTetrahedronViz';
const ReeveFormulaViz = dynamic(() => import('@/components/ReeveFormulaViz'), {
  ssr: false,
  loading: () => <p>Loading visualization...</p>
});
const EhrhartPolynomialViz = dynamic(() => import('@/components/EhrhartPolynomialViz'), {
  ssr: false,
  loading: () => <p>Loading visualization...</p>
});

export default function Home() {
  const [rValue, setRValue] = useState<number>(1);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="max-w-5xl w-full font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Reeve Tetrahedra Tutorial</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-4">
            In geometry, the Reeve tetrahedra are a family of polyhedra with vertices at
            <TeX math="(0, 0, 0), (1, 0, 0), (0, 1, 0), (1, 1, r)" />, where <TeX math="r" /> is a positive integer.
            They are named after John Reeve, who in 1957 used them to show that higher-dimensional
            generalizations of Pick's theorem do not exist. Despite this negative result, Reeve developed
            an alternative formula for calculating the volume of lattice polyhedra in three dimensions
            that involves counting lattice points from finer lattices and incorporating the Euler
            characteristic of the polyhedron.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
            <h3 className="text-lg font-semibold mb-2">Vertices:</h3>
            <ul className="list-disc list-inside">
              <li><TeX math="(0, 0, 0)" /></li>
              <li><TeX math="(1, 0, 0)" /></li>
              <li><TeX math="(0, 1, 0)" /></li>
              <li><TeX math="(1, 1, r)" /></li>
            </ul>
          </div>
          <p className="mb-4">
            Here, <TeX math="r" /> represents a positive integer which determines the height of the fourth vertex along the z-axis relative to the base formed by the other three vertices in the xy-plane.
          </p>

          <h3 className="text-xl font-semibold mb-2">Interactive Visualization</h3>
          <p className="mb-4">
            Use the slider below to change the value of <TeX math="r" /> and observe how the shape of the tetrahedron changes. The volume of the tetrahedron is given by <TeX math="V = r/6" />.
          </p>
          <div className="flex flex-col items-center mb-4">
            <label htmlFor="rSlider" className="mb-2">Value of <TeX math="r" />: {rValue}</label>
            <input
              id="rSlider"
              type="range"
              min="1"
              max="20" // Adjust max value as needed
              value={rValue}
              onChange={(e) => setRValue(parseInt(e.target.value, 10))}
              className="w-full max-w-md"
            />
             <p className="mt-2">Volume = <TeX math={`\frac{${rValue}}{6}`} /></p>
          </div>
          <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded mb-4">
            <Suspense fallback={<div>Loading...</div>}>
              <ReeveTetrahedronViz r={rValue} />
            </Suspense>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Counterexample to Generalizations of Pick's Theorem</h2>
          <p className="mb-4">
            All vertices of a Reeve tetrahedron are lattice points (points whose coordinates are all integers).
            Crucially, for any positive integer <TeX math="r" />, no other lattice points lie on the surface or
            in the interior of the tetrahedron <TeX math="T_r" /> with vertices
            <TeX math="(0, 0, 0), (1, 0, 0), (0, 1, 0), (1, 1, r)" />.
            The volume of this tetrahedron is <TeX math="V(T_r) = \frac{r}{6}" />.
          </p>
          <p className="mb-4">
            In two dimensions, Pick's theorem provides a simple formula for the area of a polygon based on the
            number of lattice points on its boundary and in its interior. It states that <TeX math="A = I + \frac{B}{2} - 1" />, where
            <TeX math="I" /> is the number of interior lattice points and <TeX math="B" /> is the number of lattice points on the boundary.
          </p>
          <p className="mb-4">
            The Reeve tetrahedra demonstrate that a direct equivalent of Pick's theorem doesn't exist in three dimensions.
            All Reeve tetrahedra <TeX math="T_r" /> have exactly 4 lattice points (the vertices) and no other interior or boundary lattice points.
            If a Pick-like formula existed for volume based solely on these counts, all <TeX math="T_r" /> would have the same calculated volume.
            However, their actual volumes (<TeX math="r/6" />) are different for each <TeX math="r" /> and can be arbitrarily large.
            This inconsistency shows that volume in 3D cannot be determined solely by the count of lattice points on the standard integer lattice (<TeX math="\mathbb{Z}^3" />).
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Reeve's Formula for Lattice Polyhedra</h2>
          <p className="mb-4">
            Despite the negative result regarding a direct generalization of Pick's theorem, Reeve developed a more sophisticated formula for the volume of three-dimensional lattice polyhedra.
            His approach involved introducing additional "rational lattices" defined as:
          </p>
          <div className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
             <TeX block math="Z_{n} = \{ x \in \mathbb{R}^3 : nx \in \mathbb{Z}^3 \}, n \geq 1" />
          </div>
          <p className="mb-4">
             This means <TeX math="Z_n" /> consists of points where each coordinate is a rational number with denominator <TeX math="n" /> (or a divisor of <TeX math="n" />).
             For example, <TeX math="Z_1 = \mathbb{Z}^3" /> is the standard integer lattice. <TeX math="Z_2" /> includes points like <TeX math="(0.5, 0, 0)" />, <TeX math="(0, 1.5, -0.5)" />, etc., in addition to all points in <TeX math="Z_1" />.
          </p>
          <p className="mb-4">
             For a lattice polyhedron <TeX math="P" /> in <TeX math="\mathbb{R}^3" />, let <TeX math="I_n" /> and <TeX math="B_n" /> denote the number of points from the lattice <TeX math="Z_n" /> in the interior and on the boundary of <TeX math="P" />, respectively.
             Reeve's formula for the volume is:
          </p>
          <div className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-center">
             <TeX block math="12V(P) = 2I_{2} + B_{2} - 2(2I_{1} + B_{1}) + 2\chi(P) - \chi(\partial P)" />
          </div>
          <p className="mb-4">
             where <TeX math="\chi(P)" /> is the Euler characteristic of the polyhedron <TeX math="P" /> (for a simple polyhedron like a tetrahedron, <TeX math="\chi(P) = 1" />) and <TeX math="\chi(\partial P)" /> is the Euler characteristic of its boundary (for a simple polyhedron, the boundary is topologically a sphere, so <TeX math="\chi(\partial P) = 2" />).
          </p>
           <p className="mb-4">
            The Euler characteristic <TeX math="\chi" /> of a shape is a topological invariant, often defined as <TeX math="V - E + F" /> (Vertices - Edges + Faces) for polyhedra. For any convex polyhedron, <TeX math="\chi(P) = 1" />. The boundary <TeX math="\partial P" /> of a simple 3D polyhedron is topologically equivalent to a sphere, for which <TeX math="\chi(\partial P) = 2" />.
           </p>
           <p className="mb-4">
            For lattice polyhedra that are 3-dimensional manifolds (meaning they are "solid" without holes running through them, like the Reeve tetrahedra), the Euler characteristics are constant (<TeX math="\chi(P)=1, \chi(\partial P)=2" />), and the formula simplifies to:
           </p>
          <div className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-center">
             <TeX block math="12V(P) = 2I_{2} + B_{2} - 2(2I_{1} + B_{1})" />
          </div>
          <p>
             This formula shows that volume can be determined by counting lattice points, but it requires considering points from a finer lattice (<TeX math="Z_2" />) in addition to the standard integer lattice (<TeX math="Z_1 = \mathbb{Z}^3" />).
             The visualization below shows the <TeX math="Z_1" /> (blue) and <TeX math="Z_2" /> (green, excluding Z1) points inside or on the boundary of the tetrahedron for the selected <TeX math="r" />. Compare the volume calculated using Reeve's formula with the actual volume <TeX math="r/6" />.
          </p>
          <div className="w-full h-[550px] bg-gray-200 dark:bg-gray-700 rounded my-4 relative">
             <Suspense fallback={<div>Loading...</div>}>
               <ReeveFormulaViz r={rValue} />
             </Suspense>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Ehrhart Polynomial</h2>
          <p className="mb-4">
            The Ehrhart polynomial of a lattice polyhedron counts the number of lattice points contained within the polyhedron when it is scaled up by an integer factor <TeX math="t" />.
            For a lattice polyhedron <TeX math="P" /> in <TeX math="\mathbb{R}^N" />, its Ehrhart polynomial <TeX math="L(P, t)" /> gives the number of integer points in the scaled polyhedron <TeX math="tP = \{ tx : x \in P \}" /> for any positive integer <TeX math="t" />.
          </p>
          <p className="mb-4">
            The general form of the Ehrhart polynomial for an N-dimensional polyhedron <TeX math="P" /> is:
          </p>
          <div className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-center">
             <TeX block math="L(P, t) = V(P)t^N + a_{N-1}(P)t^{N-1} + \cdots + a_1(P)t + \chi(P)" />
          </div>
           <p className="mb-4">
             Here, <TeX math="V(P)" /> is the N-dimensional volume of <TeX math="P" />, the coefficients <TeX math="a_i(P)" /> are related to lower-dimensional properties (like surface area for <TeX math="a_{N-1}" />), and the constant term <TeX math="a_0(P) = \chi(P)" /> is the Euler characteristic of <TeX math="P" />.
           </p>
          <p className="mb-4">
            For the Reeve tetrahedron <TeX math="T_r" /> (which is 3-dimensional, so <TeX math="N=3" />), the Ehrhart polynomial is:
          </p>
          <div className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-center">
             <TeX block math="L(T_r, t) = \frac{r}{6}t^3 + t^2 + \left(2 - \frac{r}{6}\right)t + 1" />
          </div>
           <p className="mb-4">
            Notice that the coefficient of <TeX math="t^3" /> is the volume <TeX math="V(T_r) = r/6" />, and the constant term is <TeX math="\chi(T_r) = 1" />.
            The coefficient of <TeX math="t" /> is <TeX math="(2 - r/6)" />. If we choose a large enough value for <TeX math="r" /> (specifically, <TeX math="r > 12" />),
            this coefficient becomes negative. For example, if <TeX math="r=13" />, the coefficient is <TeX math="2 - 13/6 = -1/6" />.
           </p>
           <p className="mb-4">
            This demonstrates that Ehrhart polynomials, unlike simpler counting polynomials, can sometimes have negative coefficients (excluding the leading term, which is always positive volume).
           </p>
           <p className="mb-4">
            Ehrhart polynomials also satisfy a property called Ehrhart-Macdonald reciprocity, which relates the polynomial evaluated at negative integers to the number of *interior* lattice points in the scaled polyhedron:
             <TeX math="L(P, -t) = (-1)^N I(tP)" />, where <TeX math="I(tP)" /> is the number of integer points strictly inside <TeX math="tP" />.
           </p>
          <p className="mb-4">
            The visualization below shows the tetrahedron scaled by a factor <TeX math="t" /> (which you can adjust). It counts the number of integer lattice points (<TeX math="Z_1" />, blue dots) contained within or on the boundary of this scaled tetrahedron (<TeX math="tT_r" />).
            Compare this count to the value predicted by the Ehrhart polynomial <TeX math="L(T_r, t)" /> for the given <TeX math="r" /> and <TeX math="t" />.
          </p>
          <div className="w-full h-[550px] bg-gray-200 dark:bg-gray-700 rounded my-4 relative">
             <Suspense fallback={<div>Loading...</div>}>
               <EhrhartPolynomialViz r={rValue} />
             </Suspense>
          </div>
        </section>

      </div>
    </main>
  );
}
