import pageStyles from "./user-progress-page.styles.module.css";
import React, { useContext } from "react";
import { AvatarCtx } from "index";
import { UserProgress } from "./user-progress";
import { createMockUser } from "../../types/user";

export { ProgressPage };

const ProgressPage: React.FC = () => {
  const [avatar] = useContext(AvatarCtx);
  // Use mock user instead of Moralis user
  const user = createMockUser();

  return (
    <div className={pageStyles.page}>
      <UserProgress user={user} avatar={avatar} />
    </div>
  );
};
