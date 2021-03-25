import React from 'react'
import Footer from './Footer'
import Header from './Header'
import styles from './Layout.module.scss'

const Layout = ({ children }: { children: JSX.Element[] }): JSX.Element => {
    return (
        <>
            <Header />
            <div className={styles.main}>{children}</div>
            <Footer />
        </>
    )
}

export default Layout
