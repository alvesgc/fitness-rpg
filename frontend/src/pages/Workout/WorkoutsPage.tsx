import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../services/api";
import type { Workout } from "../../types/workout";

export function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const response = await api.get<Workout[]>("/workouts");

        setWorkouts(response.data);
      } catch (error) {
        console.error("Erro ao carregar treinos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
  }, []);

  if (loading) {
    return <p>Carregando treinos...</p>;
  }

  return (
    <main>
      <h1>Meus Treinos</h1>

      {workouts.length === 0 && <p>Você ainda não possui treinos.</p>}

      {workouts.map((workout) => (
        <article key={workout.id}>
          <h2>{workout.name}</h2>

          {workout.description && <p>{workout.description}</p>}

          <p>{workout.exercises.length} exercícios</p>

          <button onClick={() => navigate(`/workouts/${workout.id}`)}>
            Ver treino
          </button>
        </article>
      ))}
    </main>
  );
}
