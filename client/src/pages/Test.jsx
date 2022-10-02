import { useState, useEffect } from "react"

export default function Test() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/test`)
      const newData = await response.json()
      setData(newData)
    }

    fetchData()
    console.log(data)
  }, [])

  if (data) {
    return (
      <>
        <h1>{data?.data?.email?.address}</h1>
      </>
    )
  }
}