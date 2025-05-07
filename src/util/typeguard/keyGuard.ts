import { KeyPackage } from '../types/Hant/authWithHantoo';

/**
 * KeyPackage  type guards
 * @param data
 * @param index
 */
export function guardKeyPackege(
  data: KeyPackage[] | null,
  index: number
): asserts data is KeyPackage[] {
  if (!data || data.length <= index || !data[index].value) {
    throw new Error('유효한 Bearer 키를 찾을 수 없습니다.');
  }
}
