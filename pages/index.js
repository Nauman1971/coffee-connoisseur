import Head from 'next/head'
import Image from 'next/image';
import Banner from '../components/banner'
import Card from '../components/card';
import styles from '../styles/Home.module.css'
import { fetchCoffeeStores } from '../lib/coffee-stores';
import coffeeStoresData from '../data/coffee-stores.json';

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  // console.log('coffeeStores', coffeeStores)

  return {
    props: {
      coffeeStores
    }, // will be passed to the page component as props
  }
}

export default function Home(props) {

  const handleOnBannerBtnClick = () => console.log('hi');

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Coffee Connoisseur</h1>
        <Banner
          handleOnClick={handleOnBannerBtnClick}
          buttonText="View stores nearby"
        />
        <div className={styles.heroImage}>
          <Image alt="hero image"
            src='/static/hero-image.png'
            width={700}
            height={400}
          />
        </div>
        {props.coffeeStores.length > 0 && <>
          <h2 className={styles.heading2}>Toronto stores</h2>
          <div className={styles.cardLayout}>
            {props.coffeeStores.map(({ name, imgUrl, id }) => {
              return (
                <Card key={id}
                  name={name}
                  imgUrl={imgUrl}
                  href={`/coffee-store/${id}`}
                />
              )
            })}
          </div>
        </>}
      </main>
    </div>
  )
}
