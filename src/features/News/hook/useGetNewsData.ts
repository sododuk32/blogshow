'use client';
import React, { useState, useEffect, useCallback } from 'react';
import safeFetch from '../../Global/http_client/safeFetch';
import { useQuery } from '@tanstack/react-query';
import { NewResType, newsParamsType } from '@util/types/News/newsType';
import { FetchErrorDetail } from '@util/types/ErrorTypes';

interface resType {
  data: newsParamsType[];
  status: number;
  message: string;
}
export function useGetNewsData(word?: string, category?: string) {
  return useQuery<newsParamsType[], FetchErrorDetail>({
    queryKey: ['newsRss', word, category],
    queryFn: async () => {
      const { data, error } = await safeFetch<resType>(
        '/api/newsRss',
        'POST',
        {
          word: word,
          category,
        },
        {
          'Cache-Control': 'revalidate: 0',
        }
      );

      /**
       * 에러문은 추후 에러바운더리 만들어서 emit 하던가, 404페이지 이동 처릴하던가 통일해야함.
       */
      if (error) {
        throw error instanceof Error
          ? error
          : new Error(error?.toString() || '뉴스 호출 중 알 수 없는 오류');
      }
      if (data.message !== 'good' || !data.data) {
        // 메시지가 기대한 "good"이 아니면 에러로 처리
        throw new Error(`API 오류: ${data.message}`);
      }
      return data.data;
    },
    enabled: Boolean(word),
  });
}
