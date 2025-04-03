import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import React from 'react';

type Props = {
  data: string;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ data: string }>> {
  const { code } = context.query;

  return {
    props: {
      data: typeof code === 'string' ? code : 'noData',
    },
  };
}

function Code({ data }: Props) {
  return <div>{data}</div>;
}

export default Code;
