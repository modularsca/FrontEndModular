import { FC } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Settings.module.css';

const Settings: FC = () => {
  return (
    <div className={`w-100 p-3 ${styles.container}`}>
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3>Deploy Wazuh Agent</h3>
              </div>
              <div className="card-body">
                <h5 className="card-title">Requirements</h5>
                <ul>
                  <li>Administrator privileges are required for installation.</li>
                  <li>PowerShell 3.0 or greater is required.</li>
                  <li>
                    You need to run this command in a Windows PowerShell
                    terminal.
                  </li>
                </ul>
                <h5 className="card-title">Installation Command</h5>
                <p className="card-text">
                  Run the following commands to download and install the agent:
                </p>
                <div className="alert alert-dark" role="alert">
                  <code>
                    Invoke-WebRequest -Uri
                    https://packages.wazuh.com/4.x/windows/wazuh-agent-4.9.2-1.msi
                    -OutFile $env:tmp\wazuh-agent; msiexec.exe /i
                    $env:tmp\wazuh-agent /q WAZUH_MANAGER='3.12.198.0'
                    WAZUH_AGENT_GROUP='default'
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
