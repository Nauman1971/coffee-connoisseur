import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import coffeStoreData from '../../data/coffee-stores.json';
import Head from 'next/head';
import cls from 'classnames';

import styles from "../../styles/coffee-store.module.css";
import { fetchCoffeeStores } from '../../lib/coffee-stores';

// Server side
export async function getStaticProps({ params }) {
    const coffeeStores = await fetchCoffeeStores();
    // console.log(coffeeStores)
    const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id;
    });

    return {
        props: {
            coffeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
        }
    }
}

export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores()
    const paths = coffeeStores.map(coffeStore => {
        return {
            params: {
                id: coffeStore.id.toString()
            }
        }
    })
    return {
        paths,
        fallback: true
    }
}

// Client Side
const CoffeStore = ({ coffeStore }) => {
    const router = useRouter();
    const { name, imgUrl, address, id, neighborhood } = coffeStore;
    const handleUpvoteButton = () => console.log("up vote button")

    if (router.isFallback) {
        return <h2>Loading...</h2>
    }
    return (
        <div className={styles.layout}>
            <Head><title>{name}</title></Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href="/"><a>← Back to home</a></Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <p className={styles.name}>{name}</p>
                    </div>
                    <Image
                        src={imgUrl}
                        alt={name}
                        width={600}
                        height={360}
                        className={styles.storeImg}
                    />
                </div>
                <div className={cls("glass", styles.col2)}>
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/places.svg" width="24" height="24" />
                        <p className={styles.text}>{address}</p>
                    </div>
                    {neighborhood &&
                        <div className={styles.iconWrapper}>
                            <Image src="/static/icons/nearMe.svg" width="24" height="24" />
                            <p className={styles.text}>{neighborhood}</p>
                        </div>}
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/star.svg" width="24" height="24" />
                        <p className={styles.text}>1</p>
                    </div>
                    <button
                        className={styles.upvoteButton}
                        onClick={handleUpvoteButton}
                    >Up vote!</button>
                </div>
            </div>
        </div>
    )
}

export default CoffeStore;