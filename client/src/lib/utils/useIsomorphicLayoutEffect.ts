'use client';

import { useEffect, useLayoutEffect } from 'react';

// Use useLayoutEffect in the browser and useEffect during SSR
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
