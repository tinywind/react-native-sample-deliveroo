import { PropsWithChildren } from 'react';

export type TailwindProps = { className?: string; tw?: string };
export type TailwindChildrenProps<T> = PropsWithChildren<T> & TailwindProps;
