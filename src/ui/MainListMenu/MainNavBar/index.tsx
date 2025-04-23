import React from 'react';
import { timeToKo } from '@util/format/time';
import { useListContext } from './../MainList/index';

function MainNavBar() {
  const dateNow: Date = new Date();
  const { listCategory, setListCategory } = useListContext();

  const NavHandler = (event: React.MouseEvent) => {
    const text = (event.target as HTMLElement).innerText;

    if (text && text.length > 1) {
      setListCategory(text);
    }
  };

  return (
    <section>
      <div>
        <h3>실시간 차트</h3>
        <label htmlFor="h3">{timeToKo(dateNow)}</label>
      </div>
      <ul onClick={NavHandler}>
        {['거래량', '급상승', '급하락', '시가총액', '대량체결건수'].map((name) => (
          <li key={name} style={{ fontWeight: listCategory === name ? 'bold' : 'normal' }}>
            {name}
          </li>
        ))}

        {/* 스타일 넣을때 listCategory innerText 와 일치조건으로도 스타일 넣기.  */}
      </ul>
    </section>
  );
}

export default MainNavBar;
