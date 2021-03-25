import { signIn } from 'next-auth/client'
import React from 'react'
import { Button } from 'semantic-ui-react'
import styles from './AccessDenied.module.scss'

const AccessDenied = (): JSX.Element => {
    return (
        <div className={styles.root}>
            <h1>Access Denied</h1>
            <Button onClick={() => signIn()}>
                <a>You must be signed in to view this page</a>
            </Button>
        </div>
    )
}

export default AccessDenied
