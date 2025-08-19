import React from "react";
import { TareasProvider } from "./context/TareasContext";
import TableroKanban from "./pages/TableroKanban";

function App() {
  return (
    <TareasProvider>
      <div className="App">
        <TableroKanban />
      </div>
    </TareasProvider>
  );
}

export default App;
