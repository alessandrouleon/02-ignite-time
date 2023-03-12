import { Play} from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmoutInput, Sepatator, StartCountdownButton, TaskInput } from "./styles";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as zod from 'zod';



const newCycleFormValidationSchems = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmout: zod.number()
  .min(5, 'O ciclo precisa de no mínimo 5 minutos')
  .max(60,  'O ciclo precisa de no máximo 60 minutos')
});

// interface NewCicleFormData {
//   task: string;
//   minutesAmout: number;
// }

type NewCicleFormData = zod.infer<typeof newCycleFormValidationSchems >;

export function Home() {
  const {register, handleSubmit, watch, reset} = useForm<NewCicleFormData>({
    resolver: zodResolver(newCycleFormValidationSchems),
    defaultValues: {
      task: '',
      minutesAmout: 0
    }
  });

  function handleCreateNewCycle(data: NewCicleFormData){
    console.log(data);
    reset();
  }
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
            {...register('minutesAmout', { valueAsNumber: true})}
            />

          <span>minutos.</span>
        </FormContainer>


        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Sepatator>:</Sepatator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>
        <StartCountdownButton  disabled={!isSubmitDisabled} type="submit">
          <Play size={24} />
          Comessar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}