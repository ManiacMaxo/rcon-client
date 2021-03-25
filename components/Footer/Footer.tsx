import React from 'react'
import Link from 'next/link'
import styles from './Footer.module.scss'

const Footer = (): JSX.Element => {
    return (
        <footer className={styles.root}>
            <strong>{new Date().getFullYear()} All Rights Reserved</strong>
            <nav className={styles.nav}>
                <Link href='/policy'>
                    <a>Privacy Policy</a>
                </Link>
            </nav>
        </footer>
    )
}

export default Footer
