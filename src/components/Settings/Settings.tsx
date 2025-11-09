import { FC, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Settings.module.css";

// Definición de las interfaces para los estados de los formularios
interface AgentFormState {
  agentIdentifier: string;
}

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
}

const Settings: FC = () => {
  // --- Lógica del Botón Copiar (Sin cambios significativos) ---
  const [copyStatus, setCopyStatus] = useState("");
  const installCodeRef = useRef<HTMLDivElement>(null);

  const handleCopy = (ref: React.RefObject<HTMLDivElement>, commandName: string) => {
    if (ref.current) {
      const commandText = ref.current.textContent || ref.current.innerText;

      navigator.clipboard
        .writeText(commandText.trim())
        .then(() => {
          setCopyStatus(`¡${commandName} copiado!`);
          setTimeout(() => {
            setCopyStatus("");
          }, 3000);
        })
        .catch((err) => {
          console.error("Error al intentar copiar: ", err);
          setCopyStatus("Error al copiar.");
          setTimeout(() => {
            setCopyStatus("");
          }, 3000);
        });
    }
  };
  // -------------------------------------------------------------

  // === ESTADOS PARA EL FORMULARIO DE ELIMINAR AGENTE ===
  const [agentForm, setAgentForm] = useState<AgentFormState>({
    agentIdentifier: "",
  });

  const handleAgentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentForm({ agentIdentifier: e.target.value });
  };

  const handleSubmitDelete = (e: React.FormEvent) => {
    e.preventDefault();

    // AQUÍ ES DONDE LLAMARÍAS A TU MUTACIÓN DE GraphQL
    console.log("Datos listos para la mutación 'Eliminar Agente':", agentForm);
    alert(`Preparado para eliminar al agente: ${agentForm.agentIdentifier}. (Simulado)`);
    // Después de una respuesta exitosa del servidor, podrías resetear el formulario:
    // setAgentForm({ agentIdentifier: '' });
  };
  // ======================================================

  // === ESTADOS PARA EL FORMULARIO DE CAMBIAR CONTRASEÑA ===
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [id]: value, // Usa el 'id' del input para actualizar la clave correcta
    }));
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();

    // AQUÍ ES DONDE LLAMARÍAS A TU MUTACIÓN DE GraphQL
    console.log("Datos listos para la mutación 'Cambiar Contraseña':", passwordForm);
    alert("Preparado para cambiar la contraseña. (Simulado)");
    // Después de una respuesta exitosa del servidor, podrías resetear el formulario:
    // setPasswordForm({ currentPassword: '', newPassword: '' });
  };
  // ======================================================

  return (
    <div className={`w-100 p-3 ${styles.container}`}>
      <div className="container mt-5">
        {/* ========================================================== */}
        {/* SECCIÓN 1: DESPLEGAR AGENTE WAZUH */}
        {/* ... (Esta sección no ha sido modificada) ... */}
        {/* ========================================================== */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3>Deployar Agente Wazuh</h3>
              </div>
              <div className="card-body">
                <h5 className="card-title">Requisitos</h5>
                <ul>
                  <li>Se requieren **privilegios de administrador** para la instalación.</li>
                  <li>Se requiere **PowerShell 3.0** o superior.</li>
                  <li>Necesitas ejecutar este comando en una terminal de **Windows PowerShell**.</li>
                  <li>Asegúrate de que el **puerto 1514 (TCP)** esté accesible desde el agente al gestor de Wazuh.</li>
                </ul>
                <h5 className="card-title">1. Comando de Instalación</h5>
                <p className="card-text">Ejecuta los siguientes comandos para descargar e instalar el agente:</p>

                {/* Bloque de código de Instalación */}
                <div className="d-flex align-items-start mb-4">
                  <div className="alert alert-dark flex-grow-1 mb-0 me-2" role="alert" ref={installCodeRef}>
                    <code>
                      Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-4.9.2-1.msi -OutFile
                      $env:tmp\wazuh-agent; msiexec.exe /i $env:tmp\wazuh-agent /q WAZUH_MANAGER='3.12.198.0'
                      WAZUH_AGENT_GROUP='default'
                    </code>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleCopy(installCodeRef, "Comando de Instalación")}
                      title="Copiar comando de instalación"
                    >
                      📋 Copiar
                    </button>
                    {copyStatus && <small className="text-success mt-1">{copyStatus}</small>}
                  </div>
                </div>

                <h5 className="card-title">2. Iniciar el Servicio del Agente</h5>
                <p className="card-text">
                  Una vez finalizada la instalación, ejecuta el siguiente comando en PowerShell para iniciar el servicio
                  del agente:
                </p>

                {/* Bloque de código de Inicio de Servicio */}
                <div className="d-flex align-items-start">
                  <div className="alert alert-dark flex-grow-1 mb-0 me-2" role="alert">
                    <code>NET START WazuhSvc</code>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        navigator.clipboard
                          .writeText("NET START WazuhSvc")
                          .then(() => setCopyStatus("¡Comando de Inicio copiado!"))
                      }
                      title="Copiar comando de inicio"
                    >
                      📋 Copiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Separación de Secciones --- */}
        <hr className="my-5" />

        {/* ========================================================== */}
        {/* SECCIÓN 2: FORMULARIOS DE GESTIÓN (ACTUALIZADOS CON ESTADO) */}
        {/* ========================================================== */}
        <div className="row">
          {/* Formulario ELIMINAR AGENTE */}
          <div className="col-md-6 mb-4">
            <div className="card h-100 border-danger">
              <div className="card-header bg-danger text-white">
                <h4>🗑️ Eliminar Agente</h4>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Introduce el **ID del Agente** o su **Nombre** para eliminarlo permanentemente del gestor de Wazuh.
                </p>
                <form onSubmit={handleSubmitDelete}>
                  <div className="mb-3">
                    <label htmlFor="agentIdentifier" className="form-label">
                      ID / Nombre del Agente
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="agentIdentifier" // ID coincide con la clave del estado
                      placeholder="e.g., 001 o web-server-dev"
                      required
                      value={agentForm.agentIdentifier} // Valor controlado
                      onChange={handleAgentChange} // Manejador de cambio
                    />
                  </div>
                  <button type="submit" className="btn btn-danger w-100">
                    Eliminar Agente
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Formulario CAMBIAR CONTRASEÑA */}
          <div className="col-md-6 mb-4">
            <div className="card h-100 border-primary">
              <div className="card-header bg-primary text-white">
                <h4>🔒 Cambiar Contraseña del Administrador</h4>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Actualiza tu contraseña. Por seguridad, debes introducir la contraseña actual.
                </p>
                <form onSubmit={handleSubmitPassword}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword" // ID coincide con la clave del estado
                      required
                      value={passwordForm.currentPassword} // Valor controlado
                      onChange={handlePasswordChange} // Manejador de cambio
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword" // ID coincide con la clave del estado
                      required
                      value={passwordForm.newPassword} // Valor controlado
                      onChange={handlePasswordChange} // Manejador de cambio
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Cambiar Contraseña
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
