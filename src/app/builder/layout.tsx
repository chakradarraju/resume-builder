'use client';

import Header from '@/components/Header';

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className='flex flex-col w-full h-full bg-gradient-to-b from-blue-400 to-blue-600 absolute overflow-scroll'>
    <Header onSave={() => { alert('not implemented') } } />
    <div className='grow mt-20 my-5'>
      {children}
    </div>
  </div>
)

export default Layout;