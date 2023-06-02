const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ parts }) => {
  const arr = parts.map(part => part.exercises)
  const sum = arr.reduce((x, y) => {
    return x + y; }, 0);
  return (<p style={{ fontWeight: 'bold' }}>total of {sum} exercises</p>)

}

const Content = ({ parts }) =>  {
  return (
    <div>
        {parts.map(part => 
          <p key={part.id}>{part.name} {part.exercises}</p>
        )}
    </div>
  )
}

const Course = ({course}) =>
<>
  <Header course={course.name}/>
  <Content parts={course.parts}/>
  <Total parts={course.parts}/>
</>

const Courses = ({ courses }) => (
  <>
    {courses.map(course => (
      <Course course={course} />
    ))}
  </>
)

export default Courses