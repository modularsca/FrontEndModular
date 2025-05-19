import { FC } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Agents.module.css";
import TableAgentes from "../Views/AgentesTabla/TableAgentes";

const Agents: FC = () => {
  return (
    <div className={`w-100 p-3 ${styles.container}`}>
      <TableAgentes />
    </div>
  );
};

export default Agents;
