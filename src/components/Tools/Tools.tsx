import { FC } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Tools.module.css';

const Tools: FC = () => {
  return (
    <div className={`w-100 p-3 ${styles.container}`}>
      <h1>HOLA Tools</h1>
    </div>
  );
};

export default Tools;
