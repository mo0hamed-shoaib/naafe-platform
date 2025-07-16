import React from 'react';
import { Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center mb-6">
      <div className="relative w-full max-w-lg">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-500" />
        </div>
        <input
          className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-transparent bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-deep-teal focus:border-transparent transition-all duration-300"
          placeholder="Search articles..."
          type="search"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <a className="text-gray-600 hover:text-text-primary transition-colors duration-300" href="#">
          Language
        </a>
        <div 
          className="w-10 h-10 rounded-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAAtx52LULH7p40XrTNVHD8hw2p06o0qZK_hlcfEaD4cuQYjzXVGzmvL4iBoAG76R7s1r6rMLc19Ssg19aVuiNbC3B1HyiXDX9-H2itP5AP0JPiy_lSSTTona-81hJQqT8MYf6JJq6c4RJQRZQ0tLYlnojk95orxNFDLi8rvntEuEEpidzn1EoeDYlgcJlhVHxm8nkpwRhDOIzWupoDOZ2yzPkh9RyM-GYt6ijmLMyhQfU7YMOq6wAOfutfejGiHX6Et5eCFJL4aQ')"
          }}
        />
      </div>
    </header>
  );
};

export default Header;