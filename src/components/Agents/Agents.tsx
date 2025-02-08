import { FC } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Agents.module.css';

const Agents: FC = () => {
  return (
    <div className={`w-100 p-3 ${styles.container}`}>
      <h1>HOLA Agents</h1>
    </div>
  );
};

export default Agents;
