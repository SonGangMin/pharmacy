import { styled } from "styled-components";
import PharmacyMap from "./components/PharmacyMap";

function App() {
  return (
    <Pharmacy>
      <PharmacyMap />
    </Pharmacy>
  );
}

const Pharmacy = styled.div`
  background-color: lightgreen;
`;

export default App;
