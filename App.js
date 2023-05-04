const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list ul');

hamburger.addEventListener('click', () => {
  navList.classList.toggle('nav-active');
});


return (
  <div className="App">
    <header className="header container">
      <div className="nav-bar">
        <div className="nav-list">
          <div className="hamburger">
            <div className="bar"></div>
          </div>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#projects">Projects</a></li>
            {/* Add more menu items here */}
          </ul>
        </div>
      </div>
    </header>
    {/* Your app components here */}
  </div>
);


export default App;
