import React from 'react';
import { MainMenuAlltype } from '../../../util/types/StockListInfoRes';

function MainList_Table({
  category = '거래량',
  data,
  optional1,
  optional2,
}: {
  category: string | null;
  data: unknown;
  optional1: string;
  optional2: string;
}) {
  console.log(data);
  return (
    <table>
      <thead>
        <tr>
          <th colSpan={2}>종목</th>
          <th colSpan={1}>현재가</th>
          <th colSpan={1}>{optional1}</th>
          <th colSpan={1} className="text-blue-600">
            {optional2}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {/* {data &&
            Object.keys(data).map((key: string) => {
              return {};
            })} */}
        </tr>
      </tbody>
    </table>
  );
}

export default MainList_Table;
