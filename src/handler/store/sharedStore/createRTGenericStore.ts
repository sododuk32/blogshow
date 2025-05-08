import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface SubscriptionPaper<G> {
  /** 구독 메타 정보 */
  meta: {
    type: string;
    requestCode: string;
  };
  /** 실시간 값 */
  payload: {
    /** 값 식별자, 다른걸로 바꿔도댐 */
    id: string;
    /** 제네릭 형태로 바꿔야함.  */
    currentValue: G;
  };
}

interface RealTimeState<VALUETYPE> {
  /**
   * {
   * name : {  }
   * }
   */
  papers: Record<string, Record<string, SubscriptionPaper<VALUETYPE>>>;

  updatePaper: (paper: SubscriptionPaper<VALUETYPE>) => void;
}

export function createRTGenericStore<G>() {
  return create<RealTimeState<G>>()(
    subscribeWithSelector((set) => ({
      papers: {},
      /** 사실상 요청,삭제 전부 처리함. */
      updatePaper: (paper) =>
        set((state) => {
          console.log(state.papers);
          // const { type, requestCode } = paper.meta;
          // const byType = state.papers[type] ?? {};
          // return {
          //   papers: {
          //     ...state.papers,
          //     [type]: {
          //       ...byType,
          //       [requestCode]: paper,
          //     },
          //   },
          // };
        }),
    }))
  );
}
