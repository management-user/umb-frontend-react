import React, { useState } from "react";

// URL de la API (API_URL): Usaremos una URL temporal de localhost.
// RECUERDA: Debes reemplazar esta URL con la real de tu servidor en el Módulo 4.
const API_URL = "http://localhost/api/controlador.php";

// Estado inicial
const TAREAS_INICIALES = [];

export default function App() {
  const [tareas, setTareas] = useState(TAREAS_INICIALES);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [loading, setLoading] = useState(false); // Indica si hay una petición en curso
  const [error, setError] = useState(null); // Muestra errores

  const handleInputChange = (event) => {
    setNuevaTarea(event.target.value);
  };

  /**
   * Manejador del envío del formulario.
   * Realiza la llamada fetch POST a la API PHP para crear una nueva tarea.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const titulo = nuevaTarea.trim();
    if (titulo === "") {
      setError("El título de la tarea no puede estar vacío.");
      return;
    }

    setLoading(true);

    const tareaAEnviar = { titulo };

    try {
      // 1. Llamada a la API usando fetch() con método POST
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tareaAEnviar),
      });

      // 2. Comprobar la respuesta HTTP
      if (!response.ok) {
        throw new Error(
          `Error en la conexión al servidor: ${response.status} ${response.statusText}`
        );
      }

      // 3. Obtener y parsear la respuesta JSON
      const data = await response.json();

      if (data.id) {
        // 4. Si la API devuelve un ID, la tarea fue creada con éxito
        const tareaCreada = {
          id: data.id, // Usamos el ID de Firebase devuelto por PHP
          titulo: tareaAEnviar.titulo,
        };
        // Actualizamos la lista de tareas
        setTareas((prevTareas) => [...prevTareas, tareaCreada]);
        setNuevaTarea(""); // Limpiar el input
      } else {
        // Manejar caso donde la respuesta es 200 OK pero sin el ID esperado
        throw new Error(
          data.mensaje || "Error desconocido al crear la tarea (sin ID)."
        );
      }
    } catch (err) {
      console.error("Error al añadir tarea:", err.message);
      setError(`Fallo de API/conexión. Detalle: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App min-h-screen bg-gray-100 p-8 flex justify-center items-start">
      <style jsx global>{`
        /* Estilos base */
        .App {
          font-family: "Inter", sans-serif;
          text-align: center;
        }
        body {
          font-family: "Inter", sans-serif;
        }
      `}</style>

      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 border-b-2 pb-2 text-center">
          Gestor de Tareas (React y API)
        </h1>

        {/* 1. FORMULARIO PARA AÑADIR TAREAS */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              placeholder="Escribe una nueva tarea..."
              value={nuevaTarea}
              onChange={handleInputChange}
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 disabled:bg-indigo-400"
              disabled={loading}
            >
              {loading ? "Añadiendo..." : "Añadir Tarea"}
            </button>
          </div>

          {/* Mostrar mensajes de estado */}
          {loading && <p className="text-indigo-600 mt-2">Enviando tarea...</p>}
          {error && <p className="text-red-500 mt-2">Error: {error}</p>}
        </form>

        {/* 2. LISTA PARA MOSTRAR LAS TAREAS */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Tareas Añadidas (Simulación)
        </h2>

        {tareas.length === 0 ? (
          <p className="text-gray-500 italic mt-4">
            Comienza a añadir tareas usando el formulario de arriba.
          </p>
        ) : (
          <ul className="space-y-3">
            {tareas.map((tarea) => (
              <li
                key={tarea.id}
                className="flex items-center p-4 border rounded-xl shadow-sm bg-white border-gray-200"
              >
                <span className="flex-grow text-lg text-gray-800">
                  {tarea.titulo}
                </span>
                <span className="text-xs text-gray-400 ml-4">
                  ID: {tarea.id}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
