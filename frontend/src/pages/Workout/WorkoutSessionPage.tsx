import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { api } from "../../services/api";

import type { Workout, WorkoutSession, WorkoutSet } from "../../types/workout";

export function WorkoutSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<Workout | null>(null);

  const [session, setSession] = useState<WorkoutSession | null>(null);

  const [loading, setLoading] = useState(true);

  const [starting, setStarting] = useState(false);

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    async function loadWorkout() {
      try {
        const response = await api.get<Workout>(`/workouts/${id}`);

        setWorkout(response.data);
      } catch (error) {
        console.error("Erro ao carregar treino:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadWorkout();
    }
  }, [id]);

  async function startWorkout() {
    if (!id) {
      return;
    }

    try {
      setStarting(true);

      const response = await api.post<WorkoutSession>(`/workouts/${id}/start`);

      setSession(response.data);
    } catch (error) {
      console.error("Erro ao iniciar treino:", error);
    } finally {
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <main>
        <p>Carregando treino...</p>
      </main>
    );
  }

  if (!workout) {
    return (
      <main>
        <p>Treino não encontrado.</p>

        <button onClick={() => navigate("/workouts")}>Voltar</button>
      </main>
    );
  }

  if (finished) {
    return <WorkoutFinishedPage session={session} workout={workout} />;
  }

  return (
    <main>
      <button onClick={() => navigate("/workouts")}>← Voltar</button>

      <h1>{workout.name}</h1>

      {workout.description && <p>{workout.description}</p>}

      {!session && (
        <button onClick={startWorkout} disabled={starting}>
          {starting ? "Iniciando..." : "▶ Iniciar treino"}
        </button>
      )}

      {session && (
        <WorkoutExecution
          workout={workout}
          session={session}
          onFinish={() => setFinished(true)}
        />
      )}
    </main>
  );
}

interface WorkoutExecutionProps {
  workout: Workout;

  session: WorkoutSession;

  onFinish: () => void;
}

function WorkoutExecution({
  workout,
  session,
  onFinish,
}: WorkoutExecutionProps) {
  const [selectedExercise, setSelectedExercise] = useState<string | undefined>(
    workout.exercises[0]?.exercise.id,
  );

  const [sets, setSets] = useState<WorkoutSet[]>(session.sets ?? []);

  const [weight, setWeight] = useState("");

  const [repetitions, setRepetitions] = useState("");

  const [registering, setRegistering] = useState(false);

  const [finishing, setFinishing] = useState(false);

  const [error, setError] = useState("");

  /*
   * Exercício selecionado
   */

  const selectedExerciseConfig = workout.exercises.find(
    (item) => item.exercise.id === selectedExercise,
  );

  /*
   * Séries concluídas do exercício atual
   */

  const completedSets = sets.filter(
    (set) => set.exerciseId === selectedExercise,
  );

  /*
   * Próxima série
   */

  const nextSetNumber = completedSets.length + 1;

  /*
   * Total de séries planejadas
   */

  const totalPlannedSets = workout.exercises.reduce(
    (total, item) => total + item.sets,
    0,
  );

  /*
   * Total de séries realizadas
   */

  const totalCompletedSets = sets.length;

  /*
   * Progresso do treino
   */

  const progress =
    totalPlannedSets > 0
      ? Math.min(100, Math.round((totalCompletedSets / totalPlannedSets) * 100))
      : 0;

  /*
   * TIMER
   */

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    function updateTimer() {
      const started = new Date(session.startedAt).getTime();

      const elapsed = Math.floor((Date.now() - started) / 1000);

      setElapsedSeconds(Math.max(0, elapsed));
    }

    updateTimer();

    const interval = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(interval);
  }, [session.startedAt]);

  /*
   * Formatação do timer
   */

  const hours = Math.floor(elapsedSeconds / 3600);

  const minutes = Math.floor((elapsedSeconds % 3600) / 60);

  const seconds = elapsedSeconds % 60;

  const formattedTime = [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");

  /*
   * Registrar série
   */

  async function registerSet() {
    if (!selectedExercise) {
      return;
    }

    setError("");

    if (!weight || !repetitions) {
      setError("Informe peso e repetições.");

      return;
    }

    if (selectedExerciseConfig && nextSetNumber > selectedExerciseConfig.sets) {
      setError("Todas as séries deste exercício já foram concluídas.");

      return;
    }

    try {
      setRegistering(true);

      const response = await api.post<WorkoutSet>(
        `/workouts/sessions/${session.id}/sets`,
        {
          exerciseId: selectedExercise,

          setNumber: nextSetNumber,

          weight: Number(weight),

          repetitions: Number(repetitions),
        },
      );

      setSets((current) => [...current, response.data]);

      setWeight("");
      setRepetitions("");
    } catch (error) {
      console.error("Erro ao registrar série:", error);

      setError("Não foi possível registrar a série.");
    } finally {
      setRegistering(false);
    }
  }

  /*
   * Finalizar treino
   */

  async function finishWorkout() {
    setError("");

    try {
      setFinishing(true);

      const response = await api.post<WorkoutSession>(
        `/workouts/sessions/${session.id}/finish`,
      );

      /*
       * Atualizamos a sessão local
       * com o resultado final.
       */

      setSets(response.data.sets ?? sets);

      onFinish();
    } catch (error) {
      console.error("Erro ao finalizar treino:", error);

      setError("Não foi possível finalizar o treino.");
    } finally {
      setFinishing(false);
    }
  }

  /*
   * Renderização
   */

  return (
    <section>
      {/* TIMER */}

      <div>
        <p>Tempo de treino</p>

        <h2>⏱ {formattedTime}</h2>
      </div>

      {/* PROGRESSO */}

      <div>
        <p>Progresso: {progress}%</p>

        <div
          style={{
            width: "100%",
            height: "10px",
            background: "#ddd",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#333",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        <p>
          {totalCompletedSets} / {totalPlannedSets} séries
        </p>
      </div>

      <hr />

      {/* LISTA DE EXERCÍCIOS */}

      <div>
        <h2>Exercícios</h2>

        {workout.exercises.map((item) => {
          const completed = sets.filter(
            (set) => set.exerciseId === item.exercise.id,
          ).length;

          const isSelected = selectedExercise === item.exercise.id;

          return (
            <div
              key={item.id}
              style={{
                marginBottom: "8px",
              }}
            >
              <button
                onClick={() => {
                  setSelectedExercise(item.exercise.id);

                  setError("");
                  setWeight("");
                  setRepetitions("");
                }}
                style={{
                  fontWeight: isSelected ? "bold" : "normal",
                }}
              >
                {item.order}. {item.exercise.name}
                {" — "}
                {completed}/{item.sets}
                {completed >= item.sets ? " ✓" : ""}
              </button>
            </div>
          );
        })}
      </div>

      <hr />

      {/* EXERCÍCIO ATUAL */}

      {selectedExerciseConfig && (
        <div>
          <h2>{selectedExerciseConfig.exercise.name}</h2>

          <p>
            Série {nextSetNumber} de {selectedExerciseConfig.sets}
          </p>

          {/* META DE REPETIÇÕES */}

          {(selectedExerciseConfig.minReps !== undefined ||
            selectedExerciseConfig.maxReps !== undefined) && (
            <p>
              Meta: {selectedExerciseConfig.minReps ?? "-"}
              {" - "}
              {selectedExerciseConfig.maxReps ?? "-"} repetições
            </p>
          )}

          {/* DESCANSO */}

          {selectedExerciseConfig.restSeconds !== undefined && (
            <p>
              Descanso: {selectedExerciseConfig.restSeconds}
              segundos
            </p>
          )}

          {/* PESO */}

          <div>
            <label>
              Peso (kg)
              <br />
              <input
                type="number"
                min="0"
                step="0.5"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                placeholder="Ex.: 50"
              />
            </label>
          </div>

          <br />

          {/* REPETIÇÕES */}

          <div>
            <label>
              Repetições
              <br />
              <input
                type="number"
                min="1"
                value={repetitions}
                onChange={(event) => setRepetitions(event.target.value)}
                placeholder="Ex.: 12"
              />
            </label>
          </div>

          <br />

          {/* REGISTRAR */}

          <button
            onClick={registerSet}
            disabled={
              registering || nextSetNumber > selectedExerciseConfig.sets
            }
          >
            {registering ? "Registrando..." : "✓ Registrar série"}
          </button>

          {/* VÍDEO */}

          {selectedExerciseConfig.exercise.videoUrl && (
            <button
              onClick={() =>
                window.open(
                  selectedExerciseConfig.exercise.videoUrl,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              style={{
                marginLeft: "8px",
              }}
            >
              🎥 Como executar?
            </button>
          )}

          {/* TODAS AS SÉRIES */}

          {completedSets.length > 0 && (
            <div>
              <h3>Séries realizadas</h3>

              {completedSets.map((set) => (
                <div key={set.id}>
                  Série {set.setNumber}
                  {" — "}
                  {set.weight} kg
                  {" × "}
                  {set.repetitions}
                  {" reps"}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ERRO */}

      {error && <p>{error}</p>}

      <hr />

      {/* FINALIZAR */}

      <button
        onClick={finishWorkout}
        disabled={finishing || totalCompletedSets === 0}
      >
        {finishing ? "Finalizando..." : "🏁 Finalizar treino"}
      </button>
    </section>
  );
}

/*
 * TELA DE TREINO CONCLUÍDO
 */

function WorkoutFinishedPage({
  session,
  workout,
}: {
  session: WorkoutSession | null;
  workout: Workout;
}) {
  const navigate = useNavigate();

  if (!session) {
    return null;
  }

  const totalSets = session.sets?.length ?? 0;

  return (
    <main>
      <h1>🏆 Treino concluído!</h1>

      <h2>{workout.name}</h2>

      <p>Você completou seu treino.</p>

      <p>Séries realizadas: {totalSets}</p>

      <button onClick={() => navigate("/workouts")}>
        Voltar para meus treinos
      </button>
    </main>
  );
}
