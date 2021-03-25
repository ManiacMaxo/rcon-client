import React from 'react'
import { Provider } from 'next-auth/client'
import 'semantic-ui-css/semantic.min.css'
import '../style/global.scss'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const App = ({ Component, pageProps }): JSX.Element => {
    return (
        <Provider session={pageProps.session}>
            <Component {...pageProps} />
        </Provider>
    )
}

export default App
