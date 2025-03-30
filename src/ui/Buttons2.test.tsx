import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

function Button({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick}>클릭</button>;
}

test('버튼 클릭 이벤트 테스트', async () => {
  const handler = jest.fn();
  render(<Button onClick={handler} />);

  await userEvent.click(screen.getByText('클릭'));
  expect(handler).toHaveBeenCalled();
});
