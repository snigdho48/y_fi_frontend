import Home from "@page/home";
import Contact from "@page/contact";
import Privacy from "@page/privacy";

/** Nested under `/` (see App.jsx). Use `index` for the home page. */
const routes = [
  { index: true, component: Home },
  { path: "contact", component: Contact },
  { path: "privacy", component: Privacy },
];

export default routes;
