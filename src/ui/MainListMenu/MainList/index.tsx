'use client';
import React, { ReactNode, useState } from 'react';
import { box } from './index.css';
import MainNavBar from '../MainNavBar';
import { createContext, useContext } from 'react';
import MainList_Table from '../MainList_Table';
import { useQuery } from '@tanstack/react-query';
import getMainListData from '@handler/http/gettingList/getListof';
import { MainMenuAlltype, KeyofMainMenu, mainMenuDataExtra } from '@util/types/StockListInfoRes';
import { createListContext } from '@handler/providers/Listprovider/TableProviders';
import { columnsMap } from '../Table_Definitions/mainTableAssemble';

export const { ListProvider, useListContext } = createListContext<KeyofMainMenu, mainMenuDataExtra>(
  {
    fetcher: getMainListData,
    defaultKey: '거래량',
  }
);
/**
 * 실제로 표기되는 UI 함수
 * @returns
 */
function InnerMainListMenu() {
  const { data, listCategory, isLoading } = useListContext();
  const thisCol = columnsMap[listCategory];

  return (
    <div className={box}>
      <MainNavBar />
      {
        <MainList_Table
          category={listCategory}
          data={data ?? []}
          columns={thisCol ?? []}
          isLoadings={isLoading}
        />
      }
    </div>
  );
}

/**
 * 페이지 출력 함수
 * @returns
 */
export default function MainListMenu() {
  return (
    <ListProvider>
      <InnerMainListMenu />
    </ListProvider>
  );
}

// type MainListType<T extends KeyofMainMenu> = {
//   listCategory: T | null;
//   page: string | number | null;
//   setPage: (page: string | number | null) => void;
//   setListCategory: (listCategory: KeyofMainMenu | null) => void;
//   data: MainMenuAlltype<T>[] | undefined;
//   error: Error | null;
// };
