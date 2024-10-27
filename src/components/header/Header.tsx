import React from 'react';
import Link from 'next/link';
import './Header.scss';

const Header: React.FC = () => {
  return (
    <header className="header">
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/games">Games</Link></li>
          {/* Add more navigation items as needed */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
