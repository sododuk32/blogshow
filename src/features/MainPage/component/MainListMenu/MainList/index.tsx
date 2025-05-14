'use client';
import React, { ReactNode, useState } from 'react';
import { box } from './index.css';
import MainNavBar from '../MainNavBar';
import { createContext, useContext } from 'react';
import MainList_Table from '../MainList_Table';
import { useQuery } from '@tanstack/react-query';
import getMainListData from '@features/Global/http_client/gettingList/getListof';
import {
  MainMenuAlltype,
  KeyofMainMenu,
  mainMenuDataExtra,
} from '@util/types/Hant/StockListInfoRes';
import { createListContext } from '@features/Global/providers/Listprovider/TableProviders';
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

      <MainList_Table
        category={listCategory}
        data={data ?? []}
        columns={thisCol ?? []}
        isLoadings={isLoading}
      />
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
