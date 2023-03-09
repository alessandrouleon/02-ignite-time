import { Play, Trash } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmoutInput, Sepatator, StartCountdownButton, TaskInput } from "./styles";

export function Home() {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput id="task" list="id-list" placeholder="Dê um nome para o seu projeto" />

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
            max={60}
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
        <StartCountdownButton disabled type="submit">
          <Play size={24} />
          Comessar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}