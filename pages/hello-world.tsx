import { useState } from "react"
import type { NextPage } from "next"
import styles from '../styles/Home.module.css'

const HelloWorld: NextPage = () => {
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

export default HelloWorld