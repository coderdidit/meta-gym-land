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
      horizontalItemSelectedColor: "#ffa2c4",
      activeBarHeight: 4,
      horizontalLineHeight: "60px",
    },
    Button: {
      borderRadius: 20,
      controlHeight: 39,
      paddingInline: 11,
      primaryShadow: "none",
      fontSize: 15,
      fontWeight: 500,
    },
    Modal: { borderRadiusLG: 16 },
  },
};
