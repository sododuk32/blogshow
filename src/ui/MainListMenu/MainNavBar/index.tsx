import React from 'react';
import { timeToKo } from '@util/format/time';
import { useListContext } from './../MainList/index';
import { KeyofMainMenu } from '@util/types/StockListInfoRes';

function MainNavBar() {
  const dateNow: Date = new Date();
  const { listCategory, setListCategory } = useListContext();
  const validKeys = ['거래량', '시가총액', '급상승', '급하락', '대량체결건수'];

  const NavHandler = (e: React.MouseEvent<HTMLElement>) => {
    console.log('click');
    const text = e.currentTarget.innerText.trim();
    // 1) 텍스트가 validKeys 에 포함되어 있을 때만
    console.log(text);
    if (validKeys.includes(text as KeyofMainMenu)) {
      setListCategory(text as KeyofMainMenu);
    }
  };
  return (
    <section>
      <div>
        <h3>실시간 차트</h3>
        <label htmlFor="h3">{timeToKo(dateNow)}</label>
      </div>
      <ul>
        {validKeys.map((name) => (
          <li
            key={name}
            onClick={NavHandler}
            style={{ fontWeight: listCategory === name ? 'bold' : 'normal' }}
          >
            {name}
          </li>
        ))}

        {/* 스타일 넣을때 listCategory innerText 와 일치조건으로도 스타일 넣기.  */}
      </ul>
    </section>
  );
}

export default MainNavBar;
