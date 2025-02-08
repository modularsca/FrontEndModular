import { FC } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Management.module.css';

const Management: FC = () => {
  return (
    <div className={`w-100 p-3 ${styles.container}`}>
      <h1>HOLA Management</h1>
    </div>
  );
};

export default Management;
