'use client';

import Header from '@/components/Header';

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {

  return (<div className='flex flex-col w-full h-full bg-gradient-to-t from-blue-500/50 to-blue-500 absolute overflow-scroll text-black'>
    <Header />
    <div className='grow'>
      {children}
    </div>
  </div>);
}

export default Layout;