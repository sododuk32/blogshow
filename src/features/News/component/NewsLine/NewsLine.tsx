/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import {
  NewsLineBoxStyle,
  NewsTitle,
  NewsContent,
  NewsExtra,
  NewsImage,
  NewsImageBox,
  NewsExtraPannel,
} from './NewsLine.css';
import { newsParamsType } from '@util/types/News/newsType';
import Link from 'next/link';

function NewsLine({ originallink, title, description, pubdata, ogImage }: newsParamsType) {
  return (
    <Link href={originallink}>
      <div className={NewsLineBoxStyle}>
        <div>
          <h4 className={NewsTitle}>{title ? title : ''}</h4>

          <span className={NewsContent}>{description ? description : ''}</span>
          <span className={NewsExtra}>
            <p className={NewsExtraPannel}>{pubdata ? pubdata : ''}</p>
          </span>
        </div>
        <div className={NewsImageBox}>
          <img className={NewsImage} loading="lazy" decoding="async" src={ogImage} />
        </div>
      </div>
    </Link>
  );
}

export default NewsLine;
