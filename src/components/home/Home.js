import React, { Component } from 'react'
import { HashLink as Link } from 'react-router-hash-link'
import CreateDocument from './CreateDocument'
import StartButton from './StartButton'
import Warning from './Warning'
import Hexicon from './Hexicon'
import './Home.css'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: false
    }
  }

  render () {
    return (
      <div className='Home tc white' style={{backgroundColor: '#041125'}}>
        <Warning />
        <header className='db pv3 center' style={{maxWidth: '1260px'}}>
          <nav className='db dt-l w-100 border-box pa3 ph5-l'>
            <a className='db dtc-l v-btm mid-gray link dim w-100 w-25-l tc tl-l mb2 mb0-l' href='/' title='Home'>
              <img src='images/logo-peerpad-lg.svg' className='dib' alt='PeerPad' style={{height: '100px'}} />
            </a>
            <div className='db dtc-l v-btm w-100 w-75-l tc tr-l'>
              <Link to='#about' className='link dim white f6 f5-l fw3 db dib-ns mr1 pa3 ' title='About'>What is PeerPad</Link>
              <Link to='#features' className='link dim white f6 f5-l fw3 db dib-ns mr1 pa3'title='Features'>Features</Link>
              <Link to='#how-it-works' className='link dim white f6 f5-l fw3 db dib-ns mr1 pa3' title='How it works'>How it works</Link>
              <Link to='#benefits' className='link dim white f6 f5-l fw3 db dib-ns mr1 pa3' title=''>Benefits</Link>
              <a href='https://github.com/ipfs-shipyard/peerpad' className='link dim white f6 fw3 db dib-ns mr3 pa3' title='Github repo'>Github repo</a>
              <div className='db dib-ns pv3 pv0-ns'>
                <StartButton />
              </div>
            </div>
          </nav>
        </header>

        <section id='hero' className='db pt4 pb6 center bg-hero-wave' style={{maxWidth: '1440px'}}>
          <div className='bg-hero-wave-inner' style={{backgroundImage: 'url(images/hero-wave.png)'}} />
          <div className='center ph2' style={{maxWidth: '60rem'}}>
            <h1 className='f2 f1-ns fw3 lh-copy tracked--1 bright-turquoise'>HELLO WORLD!</h1>
            <h2 className='f3 f2-ns fw2 lh-copy tracked--2 relative' style={{zIndex: '1000'}}>
              PeerPad is a realtime P2P collaborative editing tool, powered by <span className='fw4 bright-turquoise-glow'><a href="//ipfs.io" style={{textDecoration: 'none', borderBottomColor: 0}}>IPFS</a></span> and <span className='fw4 caribbean-green-glow'><a href="http://y-js.org/" style={{textDecoration: 'none', borderBottom: 0}}>CRDTs</a></span>
            </h2>
            <div className='mt6'>
              <CreateDocument />
              {this.state.error ? (
                <p className='f4 fw3 lh-copy tracked--1 razzmatazz'>{this.state.error}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section id='about' className='pa3 mv5 mw8 center'>
          <h2 className='f1-ns fw2 lh-copy tracked--1 fancy-underline' style={{fontSize: '40px'}}>
            About us
          </h2>
          <p className='fw1 lh-copy tracked--1' style={{fontSize: '22px', lineHeight: '42px'}}>
            Peerpad is a collaborative real-time editor that works on the decentralised web, built on top of <a href="//ipfs.io">IPFS</a> and <a href="http://y-js.org/">Y.js</a>. It uses no second or third-party: all participating nodes talk directly to each other without a central service. Peerpad is <a href="//github.com/ipfs-shipyard/peerpad">open-source</a> and built by <a href="//protocol.ai">Protocol Labs</a> and the <a href="//ipfs.io">IPFS community</a>.
          </p>
        </section>

        <section id='features' className='pa3 mv5'>
          <div className='mw8 center'>
            <h2 className='f1-ns fw2 lh-copy tracked--1 fancy-underline' style={{fontSize: '40px'}}>
              Features
            </h2>
            <p className='fw1 lh-copy tracked--1' style={{fontSize: '22px', lineHeight: '42px'}}>
              Peerpad does not rely on a second or third-party. <br />
              All nodes talk to each other directly, without intermediation.
            </p>
          </div>
          <div className='dt-ns center tc' style={{maxWidth: '1366px'}}>
            <div className='dtc-ns mw5-ns pa4 o-20' title='Peerpad is in Alpha and has not been audited by security experts yet.'>
              <Hexicon name='Private' />
              <h3 className='f4 fw1 white tracked--1'>
                Private
              </h3>
              <p className='f6 fw2 lh-copy'>
                Communication between parties is encrypted.
              </p>
            </div>
            <div className='dtc-ns mw5-ns'>
              <Hexicon name='Encrypted' />
              <h3 className='f4 fw1 white tracked--1'>
                Encrypted
              </h3>
              <p className='f6 fw2 lh-copy'>
                Access to content depends on a secret "read" key. A node needs to have access to this key in order to read the document and follow the changes to it. A node can only change the content if they have access to a "write" key.
              </p>
            </div>
            <div className='dtc-ns mw5-ns pa4'>
              <Hexicon name='Collaborative' />
              <h3 className='f4 fw1 white tracked--1'>
                Collaborative
              </h3>
              <p className='f6 fw2 lh-copy'>
                Thanks to <a href="https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type">CRDTs</a> and <a href="http://y-js.org/">Y.js</a>, several authors can collaborate in editing the document without originating conflicts, even when they aren't connected to each other all the time.
              </p>
            </div>
            <div className='dtc-ns mw5-ns'>
              <Hexicon name='Realtime' />
              <h3 className='f4 fw1 white tracked--1'>
                Realtime
              </h3>
              <p className='f6 fw2 lh-copy'>
                When multiple people are editing a document are connected to each other, they see everyone's changes reflected in the document in real-time.
              </p>
            </div>
          </div>
        </section>

        <section id='how-it-works' className='pa3 mv5 mw8 center'>
          <h2 className='f1-ns fw2 lh-copy tracked--1 fancy-underline' style={{fontSize: '40px'}}>
            How it works
          </h2>
          <p className='fw1 lh-copy tracked--1' style={{fontSize: '22px', lineHeight: '42px'}}>
            A Conflict-free Replicated Data Type (CRDT) offers 'Strong Eventual Consistency': a flavour of eventual consistency
            that ensures conflicts can be merged automatically to produce a value that is guaranteed to be correct/consistent.
          </p>
          <p className='fw1 lh-copy tracked--1' style={{fontSize: '22px', lineHeight: '42px'}}>
            Two objects can be either equal, have hierarchy (one descends the other) or are pairs; the latter signifies
            a branch/divergence/conflict. From the intrinsic state of the two pairs, we can determine a new descendant object which is the result of the merge.
          </p>
          <div style={{overflow: 'hidden'}}>
            <img
              className='bigger-when-small'
              src='images/how-it-works.png'
              alt='A graph showing peers independently updating state over time; The most recent state is the union of each peers updates.' />
          </div>
        </section>

        <section id='benefits' className='pa3 mv5'>
          <div className='mw8 center mb6'>
            <h2 className='f1-ns fw2 lh-copy tracked--1 fancy-underline' style={{fontSize: '40px'}}>
              What you can do with PeerPad
            </h2>
            <p className='fw1 lh-copy tracked--1' style={{fontSize: '22px', lineHeight: '42px'}}>
              Peerpad can be used to edit code, markdown documents or even rich text documents. Peerpad can also be used to save snapshots and publish them to the internet.
            </p>
          </div>

          <div className='center tl mw8'>

            <div className='dib-l w-50-l v-top pb4 mw6 center'>
              <div className='dt w-100'>
                <div className='dtc v-top' style={{width: 108}}>
                  <Hexicon name='Take notes' />
                </div>
                <div className='dtc v-top pl3 pr4-l'>
                  <h3 className='f6 fw4 white tracked--1'>
                    Take meeting notes
                  </h3>
                  <p className='f6 fw2 lh-copy'>
                    Either using plain text, Markdown or Rich-text, you can take meeting notes and share with your colleagues in real time..
                  </p>
                </div>
              </div>
            </div>

            <div className='dib-l w-50-l v-top pb4 mw6 center'>
              <div className='dt w-100'>
                <div className='dtc v-top' style={{width: 108}}>
                  <Hexicon name='Collaborate' />
                </div>
                <div className='dtc v-top pl3 pr4-l'>
                  <h3 className='f6 fw4 white tracked--1'>
                    Collaborate or share snippets of code
                  </h3>
                  <p className='f6 fw2 lh-copy'>
                    Peerpad has a built-in code editor you can use to collaborate with colleagues while editing the same file.
                  </p>
                </div>
              </div>
            </div>

            <div className='dib-l w-50-l v-top pb4 mw6 center'>
              <div className='dt w-100'>
                <div className='dtc v-top' style={{width: 108}}>
                  <Hexicon name='Write articles' />
                </div>
                <div className='dtc v-top pl3 pr4-l'>
                  <h3 className='f6 fw4 white tracked--1'>
                    Write articles and share them
                  </h3>
                  <p className='f6 fw2 lh-copy'>
                    You can publish a snapshot of a pad to <a href="//ipfs.io">IPFS</a>, making it available on the internet. Choose who you share them with by sharing a read key that decrypts the content.
                  </p>
                </div>
              </div>
            </div>

            <div className='dib-l w-50-l v-top pb4 mw6 center'>
              <div className='dt w-100'>
                <div className='dtc v-top' style={{width: 108}}>
                  <Hexicon name='Work with multiple users' />
                </div>
                <div className='dtc v-top pl3 pr4-l'>
                  <h3 className='f6 fw4 white tracked--1'>
                    Work with multiple users at the same time
                  </h3>
                  <p className='f6 fw2 lh-copy'>
                    Peerpad can work with many users changing the document at the same time, seing each other's changes in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer style={{padding: '120px 0', background: 'transparent url(images/footer.png) center bottom no-repeat'}}>
          <div className='dt w-100 center pv3 bt bw1 b--caribbean-green-soft' style={{borderTopStyle: 'dashed', maxWidth: '1140px'}} >
            <nav className='db dtc-l v-mid w-100 w-60-l tl-l'>
              <Link to='#about' className='link dim white f6 fw3 db dib-ns mr1-ns pa3' title='About'>About</Link>
              <Link to='#features' className='link dim white f6 fw3 db dib-ns mr1-ns pa3' title='Features'>Features</Link>
              <Link to='#how-it-works' className='link dim white f6 fw3 db dib-ns mr1-ns pa3' title='How it works'>How it works</Link>
              <Link to='#benefits' className='link dim white f6 fw3 db dib-ns mr1-ns pa3' title='What you can do with PeerPad'>Benefits</Link>
              <a href='https://github.com/ipfs-shipyard/peerpad/blob/master/docs/ARCHITECTURE.md' className='link dim white f6 fw3 db dib-ns mr1-ns pa3' title='Architecture'>Architecture</a>
              <a href='https://github.com/ipfs-shipyard/peerpad/blob/master/docs/SECURITY.md' className='link dim white f6 fw3 db dib-ns mr1-ns pa3' title='Security'>Security</a>
              <a href='https://github.com/ipfs-shipyard/peerpad/blob/master/docs/ARCHITECTURE.md' className='link dim white f6 fw3 db dib-ns mr1-ns pa3' title='Architecture'>Architecture</a>
              <a href='https://github.com/ipfs-shipyard/peerpad' className='link dim white f6 fw3 db dib-ns mr1-ns pa3' title='Github repo'>Github repo</a>
            </nav>
            <small className='db dtc-l v-mid w-100 w-40-l tr-l f7 f6-ns pv4 pv0-l pr3-l lh-copy'>
              <a className='link white db dib-ns mb3 mb0-ns' href='https://protocol.ai/'>© Protocol Labs </a>
              <span className='dn dib-ns mh1'> | </span>
              Except as <a className='link bright-turquoise' href='https://protocol.ai/legal/'>noted</a>,
              content licensed <a className='link bright-turquoise' href='https://creativecommons.org/licenses/by/3.0/'>CC-BY 3.0</a>
            </small>
          </div>
        </footer>
      </div>
    )
  }

  componentDidCatch (err, info) {
    this.setState({ error: err })
  }
}

export default Home
