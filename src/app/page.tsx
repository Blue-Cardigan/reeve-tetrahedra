'use client'; // Required for react-katex and potentially react-three-fiber later

import React, { useState } from 'react';
import IntroductionSection from '@/components/sections/IntroductionSection';
import PicksTheoremSection from '@/components/sections/PicksTheoremSection';
import ReevesFormulaSection from '@/components/sections/ReevesFormulaSection';
import ReevesGeneralizationSection from '@/components/sections/ReevesGeneralizationSection';
import EhrhartPolynomialSection from '@/components/sections/EhrhartPolynomialSection';
import ReferencesSection from '@/components/sections/ReferencesSection';

export default function Home() {
  const [rValue, setRValue] = useState<number>(1);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-16 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl w-full font-sans">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 md:mb-16 text-center text-gray-800 dark:text-gray-100">
          Exploring Reeve Tetrahedra
        </h1>

        <IntroductionSection rValue={rValue} setRValue={setRValue} />
        <PicksTheoremSection />
        <ReevesFormulaSection rValue={rValue} />
        <ReevesGeneralizationSection rValue={rValue} setRValue={setRValue} />
        <EhrhartPolynomialSection rValue={rValue} />
        <ReferencesSection />

      </div>
    </main>
  );
}
