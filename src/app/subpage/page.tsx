import React from 'react';

function page() {
  return (
    <div>
      {' '}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-rose-900 p-8 rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">Hello Tailwind!</h1>
          <p className="text-white">이건 Tailwind로 만든 간단한 카드입니다 😎</p>
        </div>
      </div>
    </div>
  );
}

export default page;
