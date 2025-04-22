'use client'
import React, { ReactNode, useState } from 'react';
import { box } from './index.css';
import MainNavBar from '../MainNavBar';
import { createContext,useContext } from 'react';
import { children } from 'node_modules/cheerio/lib/api/traversing';

type MainListType ={
  listCategory:string|null,
  page:string|number|null,
  setListCategory:(listCategory:string|null)=>void,
  setPage:(page:string|number|null) =>void
}

const ListContext = createContext<MainListType|null>(null);

export function ListProvider({children}:{children:ReactNode}) {
const [listCategory,setListCategory] = useState<string | null>("ddefault");
const [page,setPage] =useState<string|number|null>(1);

  return (
    <ListContext.Provider value={{
      listCategory,setListCategory,page,setPage
    }}>
      {children}
    </ListContext.Provider>
  )
}

function MainListMenu() {

  return (
    <ListProvider>
    <div className={box}>
      <MainNavBar />
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


//
// 국내주식 실시간호가 (통합) ws://ops.koreainvestment.com:21000
// => 리스트
