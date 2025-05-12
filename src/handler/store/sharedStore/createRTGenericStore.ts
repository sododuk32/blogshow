import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { SubscriptionPaper } from '@util/types/charts/TData';

export type Metas = { topic: string; detail: string; isStock?: boolean };

interface RealTimeState {
  papers: Record<string, Record<string, SubscriptionPaper>>;
  addPaper: (paper: SubscriptionPaper) => void;
  deletePaper: (meta: Metas) => void;
  hasStock: () => boolean;
}

export const useRTStore = create<RealTimeState>()(
  subscribeWithSelector((set, get) => ({
    papers: {},

    addPaper: (paper) =>
      set((state) => {
        const { topic, detail, isStock } = paper.meta;
        const newPapers = { ...state.papers };

        if (isStock) {
          // 기존 stock 구독 제거
          for (const topic in newPapers) {
            const byType = newPapers[topic];
            const filtered = Object.entries(byType)
              .filter(([_, p]) => p.meta.isStock !== true)
              .reduce<Record<string, SubscriptionPaper>>((acc, [k, p]) => ((acc[k] = p), acc), {});
            if (Object.keys(filtered).length) {
              newPapers[topic] = filtered;
            } else {
              delete newPapers[topic];
            }
          }
          // 새로운 stock 구독만 추가
          newPapers[topic] = { [detail]: paper };
        } else {
          // 일반 구독 누적
          const prevByType = state.papers[topic] ?? {};
          newPapers[topic] = { ...prevByType, [detail]: paper };
        }

        return { papers: newPapers };
      }),

    deletePaper: ({ topic, detail }) =>
      set((state) => {
        const byType = { ...(state.papers[topic] ?? {}) };
        delete byType[detail];
        const newPapers = { ...state.papers };
        if (Object.keys(byType).length) {
          newPapers[topic] = byType;
        } else {
          delete newPapers[topic];
        }
        return { papers: newPapers };
      }),

    hasStock: () => {
      const papers = get().papers;
      return Object.values(papers).some((byType) =>
        Object.values(byType).some((p) => p.meta.isStock === true)
      );
    },
  }))
);
