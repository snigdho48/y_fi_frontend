import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import routes from "./routes";
import MainOutlate from "./app/mainoutlate";
import AdminLayout from "./app/adminlayout";
import AdminLogin from "./app/pages/admin/login";
import ThemeEditor from "./app/pages/admin/theme-editor";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="login" element={<AdminLogin />} />
        <Route path="theme" element={<ThemeEditor />} />
        <Route index element={<Navigate to="/admin/theme" replace />} />
      </Route>
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
