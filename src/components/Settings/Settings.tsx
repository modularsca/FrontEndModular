import { FC, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Settings.module.css";
import { useMutation } from "@tanstack/react-query"; // <-- AÑADIDO
import { gql } from "graphql-request"; // <-- AÑADIDO
import graphqlClient from "../../graphClient"; // <-- AÑADIDO
import { useAuth } from "../../context/AuthContext"; // <-- AÑADIDO

// --- Definición de la mutación de GraphQL ---
// APUNTAMOS A NUESTRA MUTACIÓN PERSONALIZADA: customPasswordChange
const PASSWORD_CHANGE_MUTATION = gql`
  mutation CustomPasswordChange($old_password: String!, $new_password1: String!, $new_password2: String!) {
    customPasswordChange(oldPassword: $old_password, newPassword1: $new_password1, newPassword2: $new_password2) {
      success
      errors # Pedimos los errores como JSON
    }
  }
`;

// --- Interfaces de Tipos ---
interface AgentFormState {
  agentIdentifier: string;
}

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  newPassword2: string; // <-- AÑADIDO: Campo de confirmación
}

// Tipo para la respuesta de la mutación
interface PasswordChangeResponse {
  // El nombre de la mutación debe coincidir
  customPasswordChange: {
    success: boolean;
    errors: string | null; // Los errores vienen como un string JSON
  };
}
// Tipo para errores de graphql-request
interface GqlError {
  response: {
    errors: {
      message: string;
    }[];
  };
}

const Settings: FC = () => {
  // --- Lógica de Copiar ---
  const [copyStatus, setCopyStatus] = useState("");
  const installCodeRef = useRef<HTMLDivElement>(null);

  const handleCopy = (ref: React.RefObject<HTMLDivElement>, commandName: string) => {
    if (ref.current) {
      const commandText = ref.current.textContent || ref.current.innerText;
      navigator.clipboard
        .writeText(commandText.trim())
        .then(() => {
          setCopyStatus(`¡${commandName} copiado!`);
          setTimeout(() => setCopyStatus(""), 3000);
        })
        .catch((err) => {
          console.error("Error al intentar copiar: ", err);
          setCopyStatus("Error al copiar.");
          setTimeout(() => setCopyStatus(""), 3000);
        });
    }
  };

  // --- Formulario de Eliminar Agente ---
  const [agentForm, setAgentForm] = useState<AgentFormState>({
    agentIdentifier: "",
  });

  const handleAgentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentForm({ agentIdentifier: e.target.value });
  };

  const handleSubmitDelete = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de mutación para eliminar agente iría aquí
    alert(`Preparado para eliminar al agente: ${agentForm.agentIdentifier}. (Simulado)`);
  };

  // ======================================================
  // === FORMULARIO DE CAMBIAR CONTRASEÑA (ACTUALIZADO) ===
  // ======================================================
  const { logout } = useAuth(); // Obtenemos logout del contexto
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    newPassword2: "", // <-- AÑADIDO
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // --- Hook de Mutación de TanStack Query ---
  const mutation = useMutation<PasswordChangeResponse, GqlError, PasswordFormState>({
    mutationFn: (variables) =>
      graphqlClient.request(PASSWORD_CHANGE_MUTATION, {
        old_password: variables.currentPassword,
        new_password1: variables.newPassword,
        new_password2: variables.newPassword2,
      }),
    onSuccess: (data) => {
      // El nombre de la mutación debe coincidir
      if (data.customPasswordChange.success) {
        setPasswordSuccess("¡Contraseña cambiada con éxito! Serás deslogueado por seguridad.");
        setPasswordError(null);
        setPasswordForm({ currentPassword: "", newPassword: "", newPassword2: "" }); // Resetea el formulario
        // Desloguea al usuario después de cambiar la contraseña
        setTimeout(() => {
          logout();
        }, 3000);
      } else {
        // Maneja errores devueltos por la mutación (ej. contraseña actual incorrecta)
        try {
          // Intentamos parsear los errores JSON
          const errors = JSON.parse(data.customPasswordChange.errors || "{}");
          let errorMessages = [];
          if (errors?.old_password) {
            errorMessages.push(errors.old_password[0].message);
          }
          if (errors?.new_password2) {
            // Puede ser un array de mensajes o un diccionario
            if (Array.isArray(errors.new_password2)) {
              errors.new_password2.forEach((err: any) => errorMessages.push(err.message || err));
            } else if (errors.new_password2[0]) {
              errorMessages.push(errors.new_password2[0].message);
            }
          }
          if (errorMessages.length > 0) {
            setPasswordError(errorMessages.join(" "));
          } else {
            setPasswordError("Ocurrió un error al cambiar la contraseña.");
          }
        } catch (e) {
          setPasswordError("Error al procesar la respuesta del servidor.");
        }
        setPasswordSuccess(null);
      }
    },
    onError: (error) => {
      // Maneja errores de red o de GraphQL (ej. 401 no autorizado)
      const gqlError = error.response?.errors?.[0]?.message || "Error desconocido.";
      setPasswordError(gqlError);
      setPasswordSuccess(null);
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null); // Resetea errores
    setPasswordSuccess(null); // Resetea éxito

    // Validación local primero
    if (passwordForm.newPassword !== passwordForm.newPassword2) {
      setPasswordError("Las nuevas contraseñas no coinciden.");
      return;
    }
    // Opcional: Validación de longitud mínima (aunque Django también la hará)
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // Llama a la mutación
    mutation.mutate(passwordForm);
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
        {/* SECCIÓN 2: FORMULARIOS DE GESTIÓN (ACTUALIZADOS) */}
        {/* ========================================================== */}
        <div className="row">
          {/* Formulario ELIMINAR AGENTE (Sin cambios en la lógica) */}
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
                      id="agentIdentifier"
                      placeholder="e.g., 001 o web-server-dev"
                      required
                      value={agentForm.agentIdentifier}
                      onChange={handleAgentChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-danger w-100">
                    Eliminar Agente
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Formulario CAMBIAR CONTRASEÑA (ACTUALIZADO) */}
          <div className="col-md-6 mb-4">
            <div className="card h-100 border-primary">
              <div className="card-header bg-primary text-white">
                <h4>🔒 Cambiar Contraseña del Administrador</h4>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Actualiza tu contraseña. Por seguridad, debes introducir la contraseña actual.
                </p>

                {/* --- Alertas de Éxito y Error --- */}
                {passwordSuccess && (
                  <div className="alert alert-success" role="alert">
                    {passwordSuccess}
                  </div>
                )}
                {passwordError && (
                  <div className="alert alert-danger" role="alert">
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handleSubmitPassword}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      required
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      disabled={mutation.isPending} // <-- Deshabilitar
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      required
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      disabled={mutation.isPending} // <-- Deshabilitar
                    />
                  </div>
                  {/* --- CAMPO AÑADIDO --- */}
                  <div className="mb-3">
                    <label htmlFor="newPassword2" className="form-label">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword2" // <-- ID para el estado
                      required
                      value={passwordForm.newPassword2}
                      onChange={handlePasswordChange}
                      disabled={mutation.isPending} // <-- Deshabilitar
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={mutation.isPending}>
                    {mutation.isPending ? "Cambiando..." : "Cambiar Contraseña"}
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
