import { useState, useEffect } from "react"

export default function Test() {
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