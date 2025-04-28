import React from 'react';
import { timeToKo } from '@util/format/time';
import { useListContext } from './../MainList/index';
import { KeyofMainMenu } from '@util/types/StockListInfoRes';
import { MainNav, MainNavItem, tableWrapper, titleWrapper } from './index.css';

function MainNavBar() {
  const dateNow: Date = new Date();
  const { listCategory, setListCategory } = useListContext();
  const validKeys = ['거래량', '시가총액', '급상승', '급하락', '대량체결건수'];

  const NavHandler = (e: React.MouseEvent<HTMLElement>) => {
    const text = e.currentTarget.innerText.trim();
    if (validKeys.includes(text as KeyofMainMenu)) {
      setListCategory(text as KeyofMainMenu);
    }
  };

  return (
    <section className={tableWrapper}>
      <div className={titleWrapper}>
        <h3>주제별 차트</h3>
        <label htmlFor="h3">{timeToKo(dateNow)}</label>
      </div>
      <ul className={MainNav}>
        {validKeys.map((name) => (
          <li
            key={name}
            onClick={NavHandler}
            style={{ fontWeight: listCategory === name ? 'bold' : 'normal' }}
            className={MainNavItem}
          >
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MainNavBar;
