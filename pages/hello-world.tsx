import { useState } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import Head from 'next/head'
import Layout from '../components/layout'

const HelloWorld: NextPage = () => {
  const [likes, setLikes] = useState(0)

  function handleClick() {
    setLikes(likes + 1)
  }

  return (
    <Layout home={false}>
      <Head>
        <title>Hello World Dynamic</title>
      </Head>
      <h1>Hello World, Next and React</h1>
      <button onClick={handleClick}>Likes ({likes})</button>
      <Image src="/images/space_cat.jpg" alt="Space Cat" width={100} height={100} />
    </Layout>
  )
}

export default HelloWorld
