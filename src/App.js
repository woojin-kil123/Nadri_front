import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import Main from "./components/common/Main";

function App() {
  return (
    <div className="wrap">
      <Header />
      <div className="content">
        <Main />
      </div>
      <Footer />
    </div>
  );
}

export default App;
