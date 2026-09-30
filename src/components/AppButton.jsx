import { useNavigate } from "react-router-dom";
import { Button, ConfigProvider } from "antd";

const colors = {
  primary: "#ff74a6",
  info: "#408cfd",
  secondary: "#ad9bff",
  success: "#20bf96",
};

// A local primary palette lets AntD provide hover, focus and disabled states.
export default function AppButton({
  intent = "primary",
  to,
  onClick,
  disabled,
  ...props
}) {
  const navigate = useNavigate();
  const handleClick = (event) => {
    if (disabled) return;
    onClick?.(event);
    if (to && !event.defaultPrevented) navigate(to);
  };
  return (
    <ConfigProvider theme={{ token: { colorPrimary: colors[intent] } }}>
      <Button
        type="primary"
        disabled={disabled}
        onClick={handleClick}
        {...props}
      />
    </ConfigProvider>
  );
}
