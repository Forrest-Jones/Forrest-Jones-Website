import React, { useEffect } from 'react';
import './App.css';
import 'About.js';

function App() {
  useEffect(() => {
    const hamburger = document.querySelector('.header .nav-bar .nav-list .hamburger');
    const mobile_menu = document.querySelector('.header .nav-bar .nav-list ul');
    const menu_item = document.querySelectorAll('.header .nav-bar .nav-list ul li a');
    const header = document.querySelector('.header.container');

    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      mobile_menu.classList.toggle('active');
    };

    const handleScroll = () => {
      var scroll_position = window.scrollY;
      if (scroll_position > 250) {
        header.style.backgroundColor = '#29323c';
      } else {
        header.style.backgroundColor = 'transparent';
      }
    };

    hamburger.addEventListener('click', toggleMenu);
    menu_item.forEach((item) => {
      item.addEventListener('click', toggleMenu);
    });
    document.addEventListener('scroll', handleScroll);

    return () => {
      hamburger.removeEventListener('click', toggleMenu);
      menu_item.forEach((item) => {
        item.removeEventListener('click', toggleMenu);
      });
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App">
      {/* Your app components here */}
    </div>
  );
}

export default App;
