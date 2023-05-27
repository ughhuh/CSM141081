import { useState } from 'react'

const Header = (props) => {
  return (
    <h1>{props.text}</h1>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.call}> {props.name} </button>
  )
}

const ShowVotes = (props) => {
  return (
    <p>has {props.num} votes</p>
  )
}

const MostVotes = ({joke,votes}) => {
  if (votes === 0) {
    return (
      <p>No votes recorded.</p>
    )
  }
  
  return (
    <div>
      <p>{joke}</p>
      <ShowVotes num={votes}/>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const nextJoke = () => {
    const x = Math.floor((Math.random() * anecdotes.length))
    setSelected(x)
  }

  const Vote = () => {
    const newPoints = [...points]
    newPoints[selected] += 1
    setPoints(newPoints)
  }

  const MostVoted = () => {
    const max = Math.max(...points)
    const index = points.indexOf(max)
    return index
  }

  return (
    <div>
      <Header text="Anecdote of the day"/>
      {anecdotes[selected]}
      <ShowVotes num={points[selected]}/>
      <Button call={Vote} name="vote"/>
      <Button call={nextJoke} name="next anecdote"/>
      <Header text="Anecdote with the most votes"/>
      <MostVotes joke={anecdotes[MostVoted()]} votes={points[MostVoted()]}/>
    </div>
  )
}

export default App
/* unicafe app
const Header = (props) => {
  return (
    <h1>{props.text}</h1>
  )
}

const Statistics = (props) => {
  if (props.array[0].num === 0 && props.array[1].num === 0 && props.array[2].num === 0) {
    return (
      <p>No feedback given</p>
    )
  } 
  else {
    return (
      <table>
          <tbody>
            {props.array.map((element) => (
              <tr>
                <td>{element.name}</td> 
                <td>{element.num}</td>   
              </tr>
              ))}
          </tbody>
      </table>
    )
  }
}

const StatisticLine = (props) => {
  return (
    <p>{props.text} {props.value}</p>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.vote}> {props.name} </button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const voteGood = () => setGood(good + 1)
  const voteNeutral = () => setNeutral(neutral + 1)
  const voteBad = () => setBad(bad + 1)
  let sum = good + neutral + bad
  let ave = (good*1 + bad*(-1))/sum
  let pos = (good/sum)*100

  let statistics = [
    { name: "good", num: good },
    { name: "neutral", num: neutral },
    { name: "bad", num: bad },
    { name: "all", num: sum },
    { name: "average", num: ave },
    { name: "positive", num: pos+" %" },
  ]

  return (
    <div>
      <Header text="give feedback"/>
      <Button vote={voteGood} name="good"/>
      <Button vote={voteNeutral} name="neutral"/>
      <Button vote={voteBad} name="bad"/>

      <Header text="statistics"/>
      <Statistics array={statistics}/>
      <StatisticLine text="good" value={good}/>
      <StatisticLine text="neutral" value={neutral}/>
      <StatisticLine text="bad" value={bad}/>
      <StatisticLine text="all" value={sum}/>
      <StatisticLine text="average" value={ave}/>
      <StatisticLine text="positive" value={pos+" %"}/>

      </div>
      )
    }
  
*/
/* Course info app

const Header = (props) => {
  return (
    <h1>{props.course.name}</h1>
  );
};

const Content = (props) => {
  return (
    <div>
      <Part name={props.parts[0].name} exercises={props.parts[0].exercises}/>
      <Part name={props.parts[1].name} exercises={props.parts[1].exercises}/>
      <Part name={props.parts[2].name} exercises={props.parts[2].exercises}/>
    </div>
  );
};

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  );
};

const Total = (props) => {
  return (
    <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
  );
};

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  };

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

*/