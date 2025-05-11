/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode, FC } from 'react';
import { useQuery } from '@tanstack/react-query';

type CreateListContextOpts<Key extends string, RowMap extends Record<Key, any>> = {
  /** Key 에 따라 데이터를 가져오는 함수 */
  fetcher: (key: Key) => Promise<RowMap[Key][]>;
  defaultKey: Key;
};

export function createListContext<Key extends string, RowMap extends Record<Key, any>>(
  opts: CreateListContextOpts<Key, RowMap>
) {
  // Context 에 들어갈 상태 타입 ─────────────────────
  type State = {
    listCategory: Key;
    setListCategory: (k: Key) => void;
    page: number;
    setPage: (p: number) => void;
    data?: RowMap[Key][];
    error: Error | null;
    isLoading: boolean;
  };

  // Context 객체 생성 ──────────────────────────────────────
  const Ctx = createContext<State | undefined>(undefined);

  //Provider 컴포넌트 ─────────────────────────────────────
  const ListProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [listCategory, setListCategory] = useState<Key>(opts.defaultKey);
    const [page, setPage] = useState<number>(1);

    // React Query: opts.fetcher 와 listCategory 로 데이터를 패칭
    const { data, error, isLoading } = useQuery<RowMap[Key][], Error>({
      queryKey: ['getList', listCategory, page],
      queryFn: () => opts.fetcher(listCategory),
      refetchOnWindowFocus: false,
      refetchInterval: 40000,
      staleTime: 4000 * 10,
    });

    const state: State = {
      listCategory,
      setListCategory,
      page,
      setPage,
      data,
      error,
      isLoading,
    };

    return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
  };

  // Context 사용 훅 ───────────────────────
  function useListContext(): State {
    const ctx = useContext(Ctx);
    if (!ctx) {
      throw new Error('useListContext must be used inside a ListProvider');
    }
    return ctx;
  }

  // Provider 와 Hook 반환 ────────────────
  return { ListProvider, useListContext };
}
