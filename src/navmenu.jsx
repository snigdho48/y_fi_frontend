const menuItems = [
  { label: "Item One", link: "/item-one" },
  { label: "Item Two", link: "/item-two" },
  {
    label: "Item Three",
    link: "/item-three",
    subMenu: [
      { label: "Sub Item 1", link: "/item-three/sub-item1" },
      { label: "Sub Item 2", link: "/item-three/sub-item2" },
    ],
  },
];

export default menuItems;
