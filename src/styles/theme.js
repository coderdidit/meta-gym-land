import { mainFontColor } from "../GlobalStyles";

export const appTheme = {
  token: { colorText: mainFontColor, fontFamily: "Roboto, sans-serif" },
  components: {
    Layout: {
      headerBg: "transparent",
      headerHeight: 60,
      headerPadding: "0 2rem",
    },
    Menu: {
      itemBg: "transparent",
      itemColor: mainFontColor,
      horizontalItemHoverColor: "#ffa2c4",
      horizontalItemSelectedColor: mainFontColor,
      activeBarHeight: 4,
      horizontalLineHeight: "60px",
    },
    Button: {
      borderRadius: 20,
      controlHeight: 52,
      fontSize: 15,
      fontWeight: 500,
    },
    Modal: { borderRadiusLG: 16 },
  },
};
