import React from 'react'
import Head from 'next/head'
import { Layout } from '../components'

const policy = (): JSX.Element => {
    return (
        <Layout>
            <Head>
                <title>Privacy Policy</title>
            </Head>
            <div style={{ width: '500px' }}>
                <h2>Terms of Service</h2>
                <p>
                    THE SOFTWARE IS PROVIDED &ldquo;AS IS&rdquo;, WITHOUT
                    WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
                    LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                    PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
                    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
                    CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
                    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
                    THE SOFTWARE.
                </p>
                <h2>Privacy Policy</h2>
                <p>
                    This site uses a persistent database to remember users&apos;
                    sessions which reset in ~8 hours.
                </p>
                <p>
                    Data provided to this site is exclusively used to support
                    signing in and is not passed to any third party services,
                    other than via SMTP or OAuth for the purposes of
                    authentication.
                </p>
            </div>
        </Layout>
    )
}

export default policy
