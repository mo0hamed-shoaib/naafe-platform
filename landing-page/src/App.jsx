import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Categories from './components/Categories';
import Testimonials from './components/Testimonials';
import BecomeAPro from './components/BecomeAPro';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="relative flex min-h-screen flex-col bg-naafe-cream text-gray-800 font-jakarta">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Categories />
        <Testimonials />
        <BecomeAPro />
      </main>
      <Footer />
    </div>
  );
}

export default App;