'use client';
import React, { ReactNode, useState } from 'react';
import { box } from './index.css';
import MainNavBar from '../MainNavBar';
import { createContext, useContext } from 'react';
import MainList_Table from '../MainList_Table';
import { useQuery } from '@tanstack/react-query';
import getMainListData from '@handler/http/gettingList/getListof';
import { StockListInfoResOutput } from '../../../util/types/StockListInfoRes';

type MainListType = {
  listCategory: string | null;
  page: string | number | null;
  listData: string[] | null;
  setListCategory: (listCategory: string | null) => void;
  setPage: (page: string | number | null) => void;
  setListData: (list: string[] | null) => void;
  data: StockListInfoResOutput | undefined;
  error: Error | null;
};

const ListContext = createContext<MainListType | null>(null);

export function ListProvider({ children }: { children: ReactNode }) {
  const [listCategory, setListCategory] = useState<string | null>('거래량');
  const [page, setPage] = useState<string | number | null>(1);
  const [listData, setListData] = useState<string[] | null>(null);

  const { data, error, status } = useQuery({
    queryKey: ['getList', listCategory],
    queryFn: () => getMainListData(listCategory),
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
        listData,
        setListData,
        data,
        error,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

function InnerMainListMenu() {
  const { data } = useListContext();
  return (
    <div className={box}>
      <MainNavBar />
      <MainList_Table data={data?.data} optional1="2" optional2="3" />
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
