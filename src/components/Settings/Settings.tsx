import { FC } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Settings.module.css';

const Settings: FC = () => {
  return (
    <div className={`w-100 p-3 ${styles.container}`}>
      <h1>HOLA Settings</h1>
    </div>
  );
};

export default Settings;
