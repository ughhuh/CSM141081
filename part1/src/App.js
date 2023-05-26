import { useState } from 'react'

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
      {/*
      <StatisticLine text="good" value={good}/>
      <StatisticLine text="neutral" value={neutral}/>
      <StatisticLine text="bad" value={bad}/>
      <StatisticLine text="all" value={sum}/>
      <StatisticLine text="average" value={ave}/>
      <StatisticLine text="positive" value={pos+" %"}/>

      */}
      </div>
      )
    }
    

export default App;

/*

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