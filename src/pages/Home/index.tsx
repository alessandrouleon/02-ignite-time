import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmoutInput, Sepatator, StartCountdownButton, TaskInput } from "./styles";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { string } from "zod";



const newCycleFormValidationSchems = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmout: zod.number()
    .min(5, 'O ciclo precisa de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa de no máximo 60 minutos')
});

// interface NewCicleFormData {
//   task: string;
//   minutesAmout: number;
// }

type NewCicleFormData = zod.infer<typeof newCycleFormValidationSchems>;

interface Cycle {
  id: string;
  task: string;
  minutesAmout: number;
  startDate: Date;
}

export function Home() {
  const [cycles, setCycle] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<NewCicleFormData>({
    resolver: zodResolver(newCycleFormValidationSchems),
    defaultValues: {
      task: '',
      minutesAmout: 0
    }
  });

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  useEffect(() => {
    let interval: number;
    if (activeCycle)
      interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate)
        )
      }, 1000)
    return () => {
      clearInterval(interval);
    }
  }, [activeCycle]);

  function handleCreateNewCycle(data: NewCicleFormData) {
    const id = String(new Date().getTime());
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmout: data.minutesAmout,
      startDate: new Date(),
    };
    setCycle((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSecondsPassed(0)
    reset();
  }



  const totalSeconds = activeCycle ? activeCycle.minutesAmout * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;
  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmout = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, '0');
  const seconds = String(secondsAmout).padStart(2, '0');

  useEffect(() => {
    if (activeCycle)
      document.title = `${minutes}: ${seconds}`;
  }, [minutes, seconds, activeCycle]);

  const isSubmitDisabled = watch('task');

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="id-list"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          <datalist id="id-list">
            <option value="Projeto1"></option>
            <option value="Projeto2"></option>
            <option value="Projeto3"></option>
            <option value="Projeto4"></option>
          </datalist>

          <label htmlFor="minutesAmout">durante</label>
          <MinutesAmoutInput
            type="number"
            id="minutesAmout"
            placeholder="00"
            step={5}
            min={5}
            // max={60}
            {...register('minutesAmout', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>


        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Sepatator>:</Sepatator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>
        <StartCountdownButton disabled={!isSubmitDisabled} type="submit">
          <Play size={24} />
          Comessar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}