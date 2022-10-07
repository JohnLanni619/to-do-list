import Nav from "../components/Nav";
import Category from "../components/Category";
import '../styles.css';

// Where should button to add a category go?
// I want it to save the category to the database and then I want the category component to re-render

function App() {
  
  return (
    <>
      <Nav />
      <section className="container">
        <Category />
      </section>
    </>
  );
}

export default App;
