import Image from "next/image";
import Link from "next/link";
import cls from "classnames";

import styles from "./card.module.css";

const Card = ({ name, imgUrl, href }) => {
    return <Link href={href}>
        <a className={styles.cardLink}> {/* for semantic reasoning */}
            <div className={cls("glass", styles.container)}>
                <div className={styles.cardHeaderWrapper}>
                    <h2 className={styles.cardHeader}>{name}</h2>
                </div>
                <div className={styles.cardImageWrapper}>
                    <Image
                        className={styles.cardImage}
                        src={imgUrl} alt="card Image"
                        width={260}
                        height={160}
                    />
                </div>
            </div>
        </a>
    </Link>
}

export default Card;