import Image from 'next/image';
import React from 'react';

function InterviewHeader() {
  return (
    <div className='p-4 shadow-sm'>
        <Image src={'/logo.png'} alt='logo' width={500} height={500}
        className='w-[40px]'
        />
    </div>
  );
}

export default InterviewHeader;
