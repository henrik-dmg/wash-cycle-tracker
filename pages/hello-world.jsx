import { useState } from "react"

export default function HelloWorld() {

  const [likes, setLikes] = useState(0)

  function handleClick() {
    setLikes(likes + 1)
  }

  return (
    <div>
      <h1>Hello World, Next and React</h1>
      <button onClick={handleClick}>Likes ({likes})</button>
    </div>
  )
}