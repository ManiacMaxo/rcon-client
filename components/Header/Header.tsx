import { signIn, useSession } from 'next-auth/client'
import Link from 'next/link'
import React from 'react'
import { Button, Image } from 'semantic-ui-react'
import styles from './Header.module.scss'

const Header = (): JSX.Element => {
    const [session] = useSession()
    const routes = [
        {
            name: 'Home',
            path: '/'
        },
        {
            name: 'Dashboard',
            path: '/dashboard'
        }
    ]
    return (
        <header className={styles.root}>
            <nav>
                <ul className={styles.navItems}>
                    {routes.map((route) => (
                        <li className={styles.navItem} key={route.name}>
                            <Link href={route.path}>
                                <a>{route.name}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className={styles.user}>
                {session ? (
                    <>
                        <span>
                            <small>Signed in as</small>
                            <br />
                            <strong>
                                {session.user.name || session.user.email}
                            </strong>
                        </span>
                        <Image src={session.user.image} rounded />
                    </>
                ) : (
                    <>
                        <span>You are not signed in</span>
                        <Button compact onClick={() => signIn()}>
                            Sign in
                        </Button>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header
