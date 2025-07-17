function Hero() {
  return (
    <section className="relative text-white text-center py-20 md:py-32 px-4 bg-[linear-gradient(rgba(0,128,128,0.5),rgba(0,64,64,0.9)),url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKlJZqnd05tZTYhQPVgKQe0ukB-Dji8nBJZk5zgnSr7_6tO-KYHuCpJ5YH7SgsAFz1VoeVBh-NyMuWqMNvwfdoR0DZFgcvIbtH0i1gfz17UqvAfgd8I7o-fsC-pXEE_68I0BjShcQNRC46l3XmWty9zQOenXH63d_s-SD2F4yiSHwMin-CXtB55swG_UOnI_wld-L6YksLtBtJvfVBI6LUftecm6FsOCVYZ6kkanYSLEXVptr-RLo3X8iB7i85iGV58SO2UIz2OQ')] bg-cover bg-center">
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          سوق خدماتك المحلي في مصر
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          نافي تربطك بمحترفين مهرة لكل شيء من إصلاح المنازل إلى العناية الشخصية. ابحث عن مساعدة موثوقة اليوم.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#get-started" className="btn btn-primary bg-naafe-orange border-naafe-orange hover:bg-naafe-orange/90 hover:border-naafe-orange/90 text-white text-lg font-bold h-14 px-8">
            ابحث عن محترف
          </a>
          <a href="#become-a-pro" className="btn btn-secondary bg-white text-naafe-teal border-white hover:bg-gray-100 hover:border-gray-100 text-lg font-bold h-14 px-8">
            كن محترفًا
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;