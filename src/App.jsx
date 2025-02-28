import { Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";
import routes from './routes';
import MainOutlate from './app/mainoutlate';




function App() {
  return (
    <Routes>
      <Route path="/" element={<MainOutlate  />} >
      {routes.map((route, index) => (
        <Route key={index} path={route?.path} element={<route.component />} />
      ))}
      </Route>
    </Routes>
  );
}

export default App;
