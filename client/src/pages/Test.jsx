import { useState } from "react"

export default function Test() {
  // eslint-disable-next-line
  const [data, setData] = useState(null)
  const [input, setInput] = useState('')

  async function handleSubmit(event) {
    event.preventDefault();

    const path = '/api/category'

    const data = {
      userInput: input
    }

    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const newData = await response.json()
    alert(`Submitting ${data.userInput} to ${path}`)

    setData(newData)
    console.log(input)
  }
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const filtered = array.filter(function(value, index, arr) {
    if (value != 1) {
      return value
    }
  })
  console.log(filtered)

  function handleChange(e) {
    setInput(e.target.value)
  }
    return (
      <>
        <div className="test-container">
          <form id="test">
            <label htmlFor="test">Enter in text: </label>
            <input name='test' type="text" onChange={event => handleChange(event)} />
            <button onClick={event => handleSubmit(event)}>Submit</button>
          </form>
        </div>
      </>
    )
}