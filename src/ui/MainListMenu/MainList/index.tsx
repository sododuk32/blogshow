'use client';
import React, { ReactNode, useState } from 'react';
import { box } from './index.css';
import MainNavBar from '../MainNavBar';
import { createContext, useContext } from 'react';
import MainList_Table from '../MainList_Table';
import { useQuery } from '@tanstack/react-query';
import getMainListData from '@handler/http/gettingList/getListof';

type MainListType = {
  listCategory: string | null;
  page: string | number | null;
  listData: string[] | null;
  setListCategory: (listCategory: string | null) => void;
  setPage: (page: string | number | null) => void;
  setListData: (list: string[] | null) => void;
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
    // (선택) staleTime, cacheTime 등 추가 옵션 가능
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
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

function MainListMenu() {
  return (
    <ListProvider>
      <div className={box}>
        <MainNavBar />
        {/* <MainList_Table /> */}
      </div>
    </ListProvider>
  );
}

export default MainListMenu;

export function useListContext() {
  const ctx = useContext(ListContext);
  if (!ctx) throw new Error('useListContext must be used within ListProvider');
  return ctx;
}
