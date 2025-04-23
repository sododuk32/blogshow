import React from 'react';

function MainList_Table({
  data,
  extra1,
  extra2,
}: {
  data: string[];
  extra1: string;
  extra2: string;
}) {
  return (
    <table>
      <thead>
        <tr>
          <th colSpan={2}>종목</th>
          <th colSpan={1}>현재가</th>
          <th colSpan={1}>{extra1}</th>
          <th colSpan={1} className="text-blue-600">
            {extra2}
          </th>
        </tr>
      </thead>
    </table>
  );
}

export default MainList_Table;
