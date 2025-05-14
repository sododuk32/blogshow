// List.tsx
'use client';
import React, { ReactNode, createContext, useContext, useState, MouseEvent } from 'react';
import { box } from './index.css';

type MainListType = {
  listCategory: string | null;
  setListCategory: (c: string | null) => void;
};

const ListContext = createContext<MainListType | undefined>(undefined);

// List 컴포넌트 타입 선언: children을 받는 함수형 컴포넌트에 Nav, Item을 붙임
type ListComponent = React.FC<{ children: ReactNode }> & {
  Nav: React.FC<{ children?: ReactNode }>;
  Item: React.FC<{ name: string }>;
};

const List = (({ children }) => {
  const [listCategory, setListCategory] = useState<string | null>('default');

  return (
    <ListContext.Provider value={{ listCategory, setListCategory }}>
      {children}
    </ListContext.Provider>
  );
}) as ListComponent;

// List.Nav: 메뉴를 감싸는 컨테이너 (ul)
List.Nav = function Nav({ children }) {
  // 클릭 이벤트는 여기서 한번에 처리
  const ctx = useContext(ListContext)!;

  const onClick = (e: MouseEvent<HTMLUListElement>) => {
    const t = (e.target as HTMLElement).innerText;
    if (t && t.length > 0) ctx.setListCategory(t);
  };

  return (
    <ul className={box} onClick={onClick}>
      {children}
    </ul>
  );
};

// List.Item: 각 메뉴 아이템 (li)
List.Item = function Item({ name }) {
  const { listCategory } = useContext(ListContext)!;
  const isActive = listCategory === name;

  return <li style={{ fontWeight: isActive ? 'bold' : 'normal', cursor: 'pointer' }}>{name}</li>;
};

export default List;
