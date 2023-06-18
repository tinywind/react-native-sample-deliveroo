import { PropsWithChildren } from 'react';

export type TailwindChildrenProps<T> = PropsWithChildren<T> & { className?: string; tw?: string };
