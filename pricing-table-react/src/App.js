import Card from './components/Card'
import Data from './cardData';

function App() {
  return (
    <div className="row p-3 mx-3 d-flex justify-content-evenly flex-md-row card-container w-100">
      {Data.map((cardData) => (<Card cardData={cardData} />))}
    </div>
  );
}

export default App;
