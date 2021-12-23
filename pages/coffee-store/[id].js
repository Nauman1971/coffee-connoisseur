import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import cls from 'classnames';

import styles from "../../styles/coffee-store.module.css";
import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../store/store-context';
import { isEmpty } from '../../utils';

// Server side
export async function getStaticProps({ params }) {
    const coffeeStores = await fetchCoffeeStores();
    // console.log(coffeeStores)
    const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id;
    });

    return {
        props: {
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
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
const CoffeeStore = (initialProps) => {
    const router = useRouter();
    const id = router.query.id;
    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore)
    const { state: { coffeeStores } } = useContext(StoreContext);

    const handleCreateCoffeeStore = async (coffeeStore) => {
        try {
            const {
                id,
                name,
                voting,
                imgUrl,
                neighbourhood,
                address
            } = coffeeStore;

            const response = await fetch('/api/createCoffeeStore', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    name,
                    voting: 0,
                    imgUrl,
                    neighbourhood: neighbourhood || "",
                    address: address || "",
                })
            });
            const dbCoffeeStore = await response.json();
            console.log({ dbCoffeeStore });
        } catch (err) {
            console.error("Error creating coffee store", err)
        }
    }

    const [votingCount, setVotingCount] = useState(1);

    const handleUpvoteButton = () => {
        let count = votingCount + 1;
        setVotingCount(count);
    }

    useEffect(() => {
        if (isEmpty(initialProps.coffeeStore)) {
            if (coffeeStores.length > 0) {
                const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
                    return coffeeStore.id.toString() === id;
                })
                if (coffeeStoreFromContext) {
                    setCoffeeStore(coffeeStoreFromContext);
                    handleCreateCoffeeStore(coffeeStoreFromContext);
                }
            }
        } else {
            // SSG
            handleCreateCoffeeStore(initialProps.coffeStore);
        }
    }, [id, initialProps, initialProps.coffeStore]);

    if (router.isFallback) {
        return <h2>Loading...</h2>
    }

    const { name, imgUrl, address, neighborhood } = coffeeStore;

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
                        src={
                            imgUrl ||
                            "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                        }
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
                        <p className={styles.text}>{votingCount}</p>
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

export default CoffeeStore;