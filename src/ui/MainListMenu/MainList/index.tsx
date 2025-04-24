'use client';
import React, { ReactNode, useState } from 'react';
import { box } from './index.css';
import MainNavBar from '../MainNavBar';
import { createContext, useContext } from 'react';
import MainList_Table from '../MainList_Table';
import { useQuery } from '@tanstack/react-query';
import getMainListData from '@handler/http/gettingList/getListof';
import { MainMenuAlltype, KeyofMainMenu } from '../../../util/types/StockListInfoRes';

type MainListType<T extends KeyofMainMenu> = {
  listCategory: T | null;
  page: string | number | null;
  setPage: (page: string | number | null) => void;
  setListData: (list: string[] | null) => void;
  data: MainMenuAlltype<T>[];
  error: Error | null;
};

const ListContext = createContext<MainListType<KeyofMainMenu> | null>(null);

export function ListProvider({ children }: { children: ReactNode }) {
  const [listCategory, setListCategory] = useState<KeyofMainMenu | null>('거래량');
  const [page, setPage] = useState<string | number | null>(1);

  const { data, error, status } = useQuery({
    queryKey: ['getList', listCategory],
    queryFn: () => getMainListData(listCategory as KeyofMainMenu),
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
  });

  return (
    <ListContext.Provider
      value={{
        listCategory,
        setListCategory,
        page,
        setPage,
        data,
        error,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

function InnerMainListMenu() {
  const { data, listCategory } = useListContext();
  return (
    <div className={box}>
      ㅗ{listCategory}ㅗ
      <MainNavBar />
      <MainList_Table category={listCategory} data={data} optional1="2" optional2="3" />
    </div>
  );
}

export function useListContext() {
  const ctx = useContext(ListContext);
  if (!ctx) throw new Error('useListContext must be used within ListProvider');
  return ctx;
}

export default function MainListMenu() {
  return (
    <ListProvider>
      <InnerMainListMenu />
    </ListProvider>
  );
}
