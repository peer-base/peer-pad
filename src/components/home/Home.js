import React, { Component } from 'react'
import { HashLink as Link } from 'react-router-hash-link'
import cx from 'classnames'
import CreateDocument from './CreateDocument'
import StartButton from './StartButton'
import Warning from '../Warning'
import Hexicon from './Hexicon'
import styles from './Home.module.styl'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: false
    }
  }

  render () {
    return (
      <div className={`${styles.Home} tc white`} style={{backgroundColor: '#041125'}}>
        <Warning />
        <header className='db pv3 center' style={{maxWidth: '1260px'}}>
          <nav className='db dt-l w-100 border-box pa3 ph5-l'>

            <a className='dim db dtc-l v-btm mid-gray link w-100 w-25-l tc tl-l mb2 mb0-l' href='/' title='Home'>
              <img src='images/logo-peerpad-lg.svg' className='dib' alt='PeerPad' style={{height: '100px'}} />
            </a>

            <div className={cx('db dtc-l v-btm w-100 w-75-l tc tr-l', styles.topNav)}>

              <input id='menu-toggle' className={styles.menuToggle} type='checkbox' />
              <label htmlFor='menu-toggle' className='mt4 w-auto bg-transparent ba b--bright-turquoise bright-turquoise fw2 tracked--1 pointer dim' style={{fontSize: '15px', padding: '5px 28px'}}>Menu</label>

              <ul>
                <li>
                  <Link to='#about' className={`${styles.hoverUnderlineThick} white f6 f5-l fw3 db dib-ns mr3-ns pa3`} title='About'>What is PeerPad</Link>
                </li>
                <li>
                  <Link to='#features' className={`${styles.hoverUnderlineThick} white f6 f5-l fw3 db dib-ns mr3-ns pa3`} title='Features'>Features</Link>
                </li>
                <li>
                  <Link to='#how-it-works' className={`${styles.hoverUnderlineThick} white f6 f5-l fw3 db dib-ns mr3-ns pa3`} title='How it works'>How it works</Link>
                </li>
                <li>
                  <Link to='#benefits' className={`${styles.hoverUnderlineThick} white f6 f5-l fw3 db dib-ns mr3-ns pa3`} title='Benefits'>Benefits</Link>
                </li>
                <li>
                  <a href='https://github.com/ipfs-shipyard/peerpad' className={`${styles.hoverUnderlineThick} white f6 fw3 db dib-ns mr3-ns pa3`} title='Open Source'>Open Source</a>
                </li>
                <li>
                  <div className='db dib-ns pv3 pv0-ns'>
                    <StartButton />
                  </div>
                </li>
              </ul>

            </div>
          </nav>

        </header>

        <section id='hero' className={`db pt4 pb6 center ${styles.bgHeroWave}`} style={{maxWidth: '1440px'}}>
          <div className={styles.bgHeroWaveInner} style={{backgroundImage: 'url(images/hero-wave.png)'}} />
          <div className='center ph3' style={{maxWidth: '60rem'}}>
            <h1 className={`${styles.heroCursor} f2 f1-ns fw3 lh-copy tracked--1 bright-turquoise`}>HELLO WORLD!</h1>
            <h2 className='f3 f2-ns fw2 lh-copy tracked--2 relative' style={{zIndex: '1000'}}>
              PeerPad is a realtime P2P collaborative <span className={styles.heroEditing}>editing</span> tool, powered by <span className={`fw4 ${styles.brightTurquoiseGlow}`}><a href='//ipfs.io' style={{textDecoration: 'none', borderBottom: 0}}>IPFS</a></span> and <span className={`fw4 ${styles.caribbeanGreenGlow}`}><a href='https://github.com/ipfs-shipyard/peer-star-app' style={{textDecoration: 'none', borderBottom: 0}}>CRDTs</a></span>
            </h2>
            <div className='mt6'>
              <CreateDocument />
              {this.state.error ? (
                <p className='f4 fw3 lh-copy tracked--1 razzmatazz'>{this.state.error}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section id='about' className='pa3 mv4 mv5-ns mw8 center'>
          <h2 className='f1-ns fw2 lh-copy tracked--1 fancy-underline' style={{fontSize: '40px'}}>
            What is PeerPad?
          </h2>
          <p className='f4 f3-ns fw1 tl tc-ns lh-copy tracked--1 center'>
            PeerPad is a collaborative real-time editor that works on the decentralised web, built on top of <a href='//ipfs.io'>IPFS</a>. It uses no second or third-party: all participating nodes talk directly to each other without a central service. PeerPad is <a href='//github.com/ipfs-shipyard/peerpad'>open-source</a> and built by <a href='//protocol.ai'>Protocol Labs</a> and the <a href='//ipfs.io'>IPFS community</a>.
          </p>
        </section>

        <section id='features' className='pa3 mv4 mv5-ns'>
          <div className='mw8 center'>
            <h2 className='f1-ns fw2 lh-copy tracked--1 fancy-underline' style={{fontSize: '40px'}}>
              Features
            </h2>
            <p className='f4 f3-ns fw1 tl tc-ns lh-copy tracked--1 center'>
              PeerPad does not rely on a second or third-party.
            </p>
            <p className='f4 f3-ns fw1 tl tc-ns lh-copy tracked--1 center'>
              All nodes talk to each other directly, without intermediation.
            </p>
          </div>
          <div id='features-list' className={`cf center tc ${styles.featuresList}`} style={{maxWidth: '1200px'}}>

            <div className='feature-item fl-ns w-50-m w-25-l pa4 o-20' title='PeerPad is in Alpha and has not been audited by security experts yet.'>
              <Hexicon name='Private' className={styles.hexicon} />
              <h3 className='f4 fw1 white tracked--1'>
                Private
              </h3>
              <p className='f6 fw2 lh-copy ph2'>
                Communication between parties is encrypted.
              </p>
            </div>

            <div className='feature-item fr-ns w-50-m w-25-l pa4'>
              <Hexicon name='Encrypted' className={styles.hexicon} />
              <h3 className='f4 fw1 white tracked--1'>
                Encrypted
              </h3>
              <p className='f6 fw2 lh-copy o-70 ph2'>
                Access to content depends on a secret key. A node needs access to a “read” key to read a doc and it can only change content with access to a “write” key.
              </p>
            </div>

            <div className='feature-item fl-ns w-50-m w-25-l pa4' style={{clear: 'both'}}>
              <Hexicon name='Collaborative' className={styles.hexicon} />
              <h3 className='f4 fw1 white tracked--1'>
                Collaborative
              </h3>
              <p className='f6 fw2 lh-copy o-70 ph2'>
                Thanks to <a href='https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type'>CRDTs</a> and <a href='http://y-js.org/'>Y.js</a>, several authors can collaborate and edit a document without conflicts, even when they aren’t connected at all times.
              </p>
            </div>

            <div className='feature-item fr-ns w-50-m w-25-l pa4'>
              <Hexicon name='Realtime' className={styles.hexicon} />
              <h3 className='f4 fw1 white tracked--1'>
                Realtime
              </h3>
              <p className='f6 fw2 lh-copy o-70 ph2'>
                When multiple people edit a document while connected to each other, everyone’s changes are reflected in the document in real-time.
              </p>
            </div>
          </div>
        </section>

        <section id='how-it-works' className='pa3 mv4 mv5-ns mw8 center'>
          <h2 className='f1-ns fw2 lh-copy tracked--1 fancy-underline' style={{fontSize: '40px'}}>
            How it works
          </h2>
          <p className='f4 f3-ns fw1 tl tc-ns lh-copy tracked--1 center'>
            A Conflict-free Replicated Data Type (CRDT) offers 'Strong Eventual Consistency': a flavour of eventual consistency
            that ensures conflicts can be merged automatically to produce a value that is guaranteed to be correct/consistent.
          </p>
          <p className='f4 f3-ns fw1 tl tc-ns lh-copy tracked--1 center'>
            Two objects can be either equal, have hierarchy (one descends the other) or are pairs; the latter signifies
            a branch/divergence/conflict. From the intrinsic state of the two pairs, we can determine a new descendant object which is the result of the merge.
          </p>
          <div style={{overflow: 'hidden'}}>
            <img
              className={styles.biggerWhenSmall}
              src='images/how-it-works.png'
              alt='A graph showing peers independently updating state over time; The most recent state is the union of each peers updates.' />
          </div>
        </section>

        <section id='benefits' className='pa3 mv4 mv5-ns'>
          <div className='mw8 center mb5 mb6-ns'>
            <h2 className='f1-ns fw2 lh-copy tracked--1 fancy-underline' style={{fontSize: '40px'}}>
              What you can do with PeerPad
            </h2>
            <p className='f4 f3-ns fw1 tl tc-ns lh-copy tracked--1 center'>
              PeerPad can be used to edit code, markdown documents or even rich text documents. PeerPad can also be used to save snapshots and publish them to the internet.
            </p>
          </div>

          <div className='center tl mw8'>

            <div className='dib-l w-50-l v-top pb4 mw6 center'>
              <div className='dt w-100'>
                <div className='dtc v-top' style={{width: 108}}>
                  <Hexicon name='Take notes' />
                </div>
                <div className='dtc v-top pl3 pr4-l'>
                  <h3 className='f4 fw1 white tracked--1'>
                    Take meeting notes
                  </h3>
                  <p className='f6 fw2 lh-copy o-70'>
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
                  <h3 className='f4 fw1 white tracked--1'>
                    Collaborate or share code snippets
                  </h3>
                  <p className='f6 fw2 lh-copy o-70'>
                    PeerPad has a built-in code editor you can use to collaborate with colleagues while editing the same file.
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
                  <h3 className='f4 fw1 white tracked--1'>
                    Write articles and share them
                  </h3>
                  <p className='f6 fw2 lh-copy o-70'>
                    You can publish a snapshot of a pad to <a href='//ipfs.io'>IPFS</a>, making it available on the internet. Choose who you share them with by sharing a read key that decrypts the content.
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
                  <h3 className='f4 fw1 white tracked--1'>
                    Work with multiple users
                  </h3>
                  <p className='f6 fw2 lh-copy o-70'>
                    PeerPad can work with many users changing the document at the same time, seing each other’s changes in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className='ph4 pv4 pv6-l' style={{background: 'transparent url(images/footer.png) center bottom no-repeat'}}>
          <div className='cf w-100 center pv3 bt bw1 b--caribbean-green-soft' style={{borderTopStyle: 'dashed', maxWidth: '1140px'}} >
            <nav className='db fl w-100 w-50-l tl-l'>
              <div>
                <Link to='#about' className={`${styles.hoverUnderlineThick} white f6 fw3 dib mr4 m3t pb2`} title='About'>About</Link>
                <Link to='#features' className={`${styles.hoverUnderlineThick} white f6 fw3 dib mr4 mt3 pb2`} title='Features'>Features</Link>
                <Link to='#how-it-works' className={`${styles.hoverUnderlineThick} white f6 fw3 dib mr4 mt3 pb2`} title='How it works'>How it works</Link>
                <Link to='#benefits' className={`${styles.hoverUnderlineThick} white f6 fw3 dib mt3 pb2`} title='What you can do with PeerPad'>Benefits</Link>
              </div>
              <div>
                <a href='https://github.com/ipfs-shipyard/peerpad/blob/master/docs/SECURITY.md' className={`${styles.hoverUnderlineThick} white f6 fw3 dib mr4 mt3 pb2`} title='Security'>Security</a>
                <a href='https://github.com/ipfs-shipyard/peer-pad' className={`${styles.hoverUnderlineThick} white f6 fw3 dib mt3 pb2`} title='Open Source'>Open Source</a>
              </div>
            </nav>
            <small className='fl db w-100 w-50-l tr-l f7 f6-ns pv4 pv0-l lh-copy mt3'>
              <span className='db dib-ns mb3 mb0-ns center'>
                <a className='link white' href='https://protocol.ai/'>© Protocol Labs </a>
              </span>
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
