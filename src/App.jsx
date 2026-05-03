import { Routes, Route } from "react-router-dom";

import "./App.css";
import routes from "./routes";
import MainOutlate from "./app/mainoutlate";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainOutlate />}>
        {routes.map((route, index) =>
          route.index ? (
            <Route key={`idx-${index}`} index element={<route.component />} />
          ) : (
            <Route key={route.path} path={route.path} element={<route.component />} />
          ),
        )}
      </Route>
    </Routes>
  );
}

export default App;
