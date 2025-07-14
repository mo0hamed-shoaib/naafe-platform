import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="relative text-white text-center py-20 md:py-32 px-4 font-arabic">
      {/* Overlay background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,128,128,0.5) 0%, rgba(0,64,64,0.9) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKlJZqnd05tZTYhQPVgKQe0ukB-Dji8nBJZk5zgnSr7_6tO-KYHuCpJ5YH7SgsAFz1VoeVBh-NyMuWqMNvwfdoR0DZFgcvIbtH0i1gfz17UqvAfgd8I7o-fsC-pXEE_68I0BjShcQNRC46l3XmWty9zQOenXH63d_s-SD2F4yiSHwMin-CXtB55swG_UOnI_wld-L6YksLtBtJvfVBI6LUftecm6FsOCVYZ6kkanYSLEXVptr-RLo3X8iB7i85iGV58SO2UIz2OQ')",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 drop-shadow-lg">
          سوق خدماتك المحلي في مصر
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow">
          نافي تربطك بمحترفين مهرة لكل شيء من إصلاح المنازل إلى العناية الشخصية. ابحث عن مساعدة موثوقة اليوم.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            className="min-w-[150px] cursor-pointer rounded-full h-14 px-8 flex items-center justify-center bg-white text-naafe-teal border-2 border-naafe-teal text-lg font-bold shadow-lg hover:bg-gray-100 hover:border-naafe-teal/80 transform hover:scale-105 transition-all"
            onClick={() => navigate('/search')}
          >
            <span className="truncate text-[#2d5d4f]">ابحث عن محترف</span>
          </button>
          <a
            href="#become-a-pro"
            className="min-w-[150px] cursor-pointer rounded-full h-14 px-8 flex items-center justify-center bg-[#ff5722] text-white text-lg font-bold shadow-lg hover:bg-[#e64a19] transform hover:scale-105 transition-all"
          >
            <span className="truncate">كن محترفًا</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero; 