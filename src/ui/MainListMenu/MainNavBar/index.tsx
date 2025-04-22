import React, { Children } from 'react'
import {MainNavRec} from "./index.css"
import { children } from 'node_modules/cheerio/lib/api/traversing'
import { timeToKo } from '@util/format/time';
import { useListContext } from './../MainList/index';

function MainNavBar() {
    const dateNow:Date = new Date();
const {listCategory,setListCategory} = useListContext();

const NavHandler = (event:React.MouseEvent) => {

  const text = (event.target as HTMLElement).innerText

  if(text && text.length > 1) {
    setListCategory(text)
  }
}
  return (
    <section>
        <div>
            <h3>실시간 차트</h3>
            <label htmlFor="h3">{timeToKo(dateNow)}</label>
        </div>
      <ul onClick={NavHandler}>
            <li>거래량</li>
        <li>급등</li>
        <li>급락</li>
        <li>{listCategory}</li>
    </ul>
    </section>
  )
}

export default MainNavBar