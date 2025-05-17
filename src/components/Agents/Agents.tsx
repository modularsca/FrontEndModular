import { FC } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Agents.module.css';
import { TableExample } from '../TablaAgentes';
import TableAgentes from '../TableAgentes';

const Agents: FC = () => {
  return (
    <div className={`w-100 p-3 ${styles.container}`}>
      <h1>HOLA Agents</h1>
      <TableAgentes/>
    </div>
  );
};

export default Agents;
