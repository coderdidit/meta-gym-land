import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  const menuItems = [
    // {
    //   key: "/avatars",
    //   label: <NavLink to="/avatars">Your GymBuddies</NavLink>,
    // },
    // {
    //   key: "/mint",
    //   label: <NavLink to="/mint">Mint</NavLink>,
    // },
    // {
    //   key: "/marketplace",
    //   label: <NavLink to="/marketplace">Marketplace</NavLink>,
    // },
    // {
    //   key: "/rewards",
    //   label: <NavLink to="/rewards">Rewards</NavLink>,
    // },
    {
      key: "/minigames",
      label: <NavLink to="/minigames">Minigames</NavLink>,
    },
    {
      key: "/how-to",
      label: (
        <div
          onClick={() => window.open("https://docs.metagymland.com/", "_blank")}
        >
          How to use the app
        </div>
      ),
    },
  ];

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "700",
        width: "100%",
        justifyContent: "right",
        background: "none",
        padding: "0",
      }}
      selectedKeys={[pathname]}
      items={menuItems}
    />
  );
}

export default MenuItems;
