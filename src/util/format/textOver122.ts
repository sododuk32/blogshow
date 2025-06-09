export default function textOver122(text: string, maxLen = 122): string {
  //  <b> 및 </b> 태그 제거 (대소문자 관계없이)
  const cleaned = text.replace(/<\/?b>/gi, '');

  if (cleaned.length <= maxLen) {
    return cleaned;
  }
  return cleaned.slice(0, maxLen - 3) + '...';
}
