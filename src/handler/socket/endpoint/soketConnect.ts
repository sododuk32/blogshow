import { SocketEndpointConfig } from '@util/types/Socket/SocketConnect';
import { getKeyDatas } from '@util/cronFile/keyStore';
import { EndpointsRecord } from '@util/types/Socket/SocketConnect';

const socketKey: string = getKeyDatas()?.[2]?.value ?? '';

export const SocketEndpoints: EndpointsRecord = {
  currentValue: {
    endpoint: 'ws://ops.koreainvestment.com:21000',
    header: {
      custtype: 'P',
      tr_type: '1',
      'content-type': 'utf-8',
      approval_key: socketKey,
    },
    bodyTemplate: {
      tr_id: 'H0STCNT0',
      tr_key: '',
    },
  },
};
