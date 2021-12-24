/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import Image from 'next/image';
import Banner from '../components/banner'
import Card from '../components/card';
import styles from '../styles/Home.module.css'
import { fetchCoffeeStores } from '../lib/coffee-stores';
import useTrackLocation from '../hooks/use-track-location';
import { useContext, useEffect, useState } from 'react';
import { ActionTypes, StoreContext } from '../store/store-context';

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores
    }, // will be passed to the page component as props
  }
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation();
  // const [coffeeStores, setCoffeeStores] = useState("");
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  const { dispatch, state } = useContext(StoreContext)

  const { coffeeStores, latLong } = state;

  // console.log({ latLong, locationErrorMsg });
  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  }

  useEffect(async () => {
    if (latLong) {
      try {
        const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`);
        const coffeeStores = await response.json()

        dispatch({
          type: ActionTypes.SET_COFFEE_STORES,
          payload: {
            coffeeStores,
          }
        });
        setCoffeeStoresError("");
      } catch (err) {
        setCoffeeStoresError(err)
      }
    }
  }, [latLong])
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="allows you to discover coffee stores"
        ></meta>
      </Head>
      <main className={styles.main}>
        <Banner
          handleOnClick={handleOnBannerBtnClick}
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image alt="hero image"
            src='/static/hero-image.png'
            width={700}
            height={400}
          />
        </div>
        {coffeeStores.length > 0 && <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}>Stores nearby me</h2>
          <div className={styles.cardLayout}>
            {coffeeStores.map(({ name, imgUrl, id }) => {
              return (
                <Card key={id}
                  name={name}
                  imgUrl={imgUrl}
                  href={`/coffee-store/${id}`}
                />
              )
            })}
          </div>
        </div>}
        {props.coffeeStores.length > 0 && <div className={styles.sectionWrapper}>
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
        </div>}
      </main>
    </div>
  )
}
