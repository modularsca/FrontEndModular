//import { useState } from 'react'
import './App.css'
import Agentes from './components/Agentes'
import AgentesWazuh from './components/AgentesWazuh'
import {TableExample} from './components/TablaAgentes'
import {DonutChartHero} from './components/DonutChartTodosA'
//import { Label } from './components/Label';

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>

      <div className="flex justify-center mt-5 text-violet-400 text-5xl">
        <h1>Agentes</h1>
      </div>

      <div className='flex justify-center mt-5 items-top'>
      {/* <TableExample/> */}
      </div>


      {/* <Agentes/> */}
      <AgentesWazuh/>

    </>
  )
}

export default App
