import React from 'react';
import { Search, Menu, User } from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
  userAvatar?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, userAvatar }) => {
  return (
    <header className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
          </label>
        </div>
        <a className="btn btn-ghost normal-case text-xl font-bold text-deep-teal">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path 
              clipRule="evenodd" 
              d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
              fill="currentColor" 
              fillRule="evenodd"
            />
          </svg>
          Naafe'
        </a>
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a className="hover:text-deep-teal">Services</a></li>
            <li><a className="hover:text-deep-teal">Providers</a></li>
            <li><a className="hover:text-deep-teal">How it Works</a></li>
          </ul>
        </div>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <div className="form-control">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Search..." 
              className="input input-bordered w-80 focus:border-deep-teal focus:outline-none" 
            />
            <button className="btn btn-square">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="navbar-end">
        <button className="btn btn-primary btn-sm mr-4 hidden sm:inline-flex">
          Post a Request
        </button>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              {userAvatar ? (
                <img src={userAvatar} alt="User avatar" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Header;