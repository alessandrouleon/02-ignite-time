import { HandPalm, Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmoutInput, Sepatator, StartCountdownButton, StopCountdownButton, TaskInput } from "./styles";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { string } from "zod";



const newCycleFormValidationSchems = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmout: zod.number()
    .min(1, 'O ciclo precisa de no mínimo 5 minutos')
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
  interruptedDate?: Date;
  finishedDate?: Date;
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
  const totalSeconds = activeCycle ? activeCycle.minutesAmout * 60 : 0;

  function handleInterruptadCycle() {
    setCycle(state =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId)
          return { ...cycle, interruptedDate: new Date() }
        else
          return cycle;
      })
    );

    setActiveCycleId(null);

  }

  useEffect(() => {
    let interval: number;
    if (activeCycle)
      interval = setInterval(() => {

        const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate);

        if (secondsDifference >= totalSeconds) {
          setCycle(state =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId)
                return { ...cycle, interruptedDate: new Date() }
              else
                return cycle;
            })
          );
          clearInterval(interval)
          setAmountSecondsPassed(totalSeconds)
          handleInterruptadCycle();
        }
        else
          setAmountSecondsPassed(secondsDifference)
      }, 1000)
    return () => {
      clearInterval(interval);
    }
  }, [activeCycle, totalSeconds]);

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

  // function handleInterruptadCycle() {
  //   setCycle(state =>
  //     state.map((cycle) => {
  //       if (cycle.id === activeCycleId)
  //         return { ...cycle, interruptedDate: new Date() }
  //       else
  //         return cycle;
  //     })
  //   );

  //   setActiveCycleId(null);

  // }


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
            disabled={!!activeCycle}
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
            min={1}
            // max={60}
            disabled={!!activeCycle}
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
        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptadCycle}>
            <HandPalm size={24} />
            Interoper
          </StopCountdownButton>
        ) : <StartCountdownButton disabled={!isSubmitDisabled} type="submit">
          <Play size={24} />
          Comessar
        </StartCountdownButton>}
      </form>
    </HomeContainer>
  );
}