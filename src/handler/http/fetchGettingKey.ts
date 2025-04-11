// only use in server

const htKey = process.env.HanTKey;
const htSec = process.env.HanTSecret;

export default async function fetchingHTKey() {
  const res = await fetch('https://api.hanto.com/data', {
    headers: {
      Authorization: `Bearer ${htKey}`,
    },
  });
  const data = await res.json();
  return data;
}
