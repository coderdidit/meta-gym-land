import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import styles from "./MenuItems.module.css";

function MenuItems() {
  const { pathname } = useLocation();

  const menuItems = [
    {
      key: "/minigames",
      label: (
        <NavLink className={styles.link} to="/minigames">
          Minigames
        </NavLink>
      ),
    },
    {
      key: "/how-to",
      label: (
        <a
          className={styles.link}
          href="https://docs.metagymland.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          How to use the app
        </a>
      ),
    },
  ];

  return (
    <Menu
      className={styles.menu}
      classNames={{ itemContent: styles.itemContent }}
      styles={{ item: { lineHeight: "60px" } }}
      theme="light"
      mode="horizontal"
      selectedKeys={[pathname]}
      items={menuItems}
    />
  );
}

export default MenuItems;
