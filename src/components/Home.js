import React, { Component } from 'react'
import CreateDocument from './CreateDocument'
import Warning from './home/Warning'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: false,
      showWarning: true
    }
  }

  render () {
    return (
      <div className='Home tc white' style={{backgroundColor: '#090d21'}}>
        {this.state.showWarning && (
          <Warning onClose={() => this.setState({showWarning: false})} />
        )}
        <header className='db pt3 pb4'>
          <nav className='db dt-l w-100 border-box pa3 ph5-l'>
            <a className='db dtc-l v-btm mid-gray link dim w-100 w-25-l tc tl-l mb2 mb0-l' href='#home' title='Home'>
              <img src='/images/logo-peerpad-lg.svg' className='dib' alt='PeerPad' style={{width: '224px', height: '88px'}} />
            </a>
            <div className='db dtc-l v-btm w-100 w-75-l tc tr-l'>
              <a className='link dim white f6 f5-l fw3 db dib-ns mr1 pa3 ' href='#about' title='About'>What is PeerPad</a>
              <a className='link dim white f6 f5-l fw3 db dib-ns mr1 pa3' href='#features' title='Features'>Features</a>
              <a className='link dim white f6 f5-l fw3 db dib-ns mr1 pa3' href='#how-it-works' title='How it works'>How it works</a>
              <a className='link dim white f6 f5-l fw3 db dib-ns mr1 pa3' href='#benefits' title=''>Benefits</a>
            </div>
          </nav>
        </header>
        <section id='hero' className='db ph2 pb6 mw8 center'>
          <h1 className='f2 f1-ns fw2 lh-copy tracked bright-turquoise'>HELLO WORLD</h1>
          <h2 className='f3 f2-ns fw2 lh-copy tracked'>
            PeerPad is a realtime collaborative editing tool,
            powered by <span className='fw5'>IPFS</span> and <span className='fw5'>CRDTs</span>
          </h2>
          <CreateDocument />
          {this.state.error ? (
            <p className='f4 fw3 lh-copy tracked--1 razzmatazz'>{this.state.error}</p>
          ) : null}
        </section>
        <section id='about' className='pa3 mw8 center'>
          <h2 className='f1-ns fw2 lh-copy tracked--1 fancy-underline' style={{fontSize: '40px'}}>
            About us
          </h2>
          <p className='fw1 lh-copy tracked--1' style={{fontSize: '22px', lineHeight: '42px'}}>
            Peerpad is collaborative real-time editor that works on the decentralised web, built on top of IPFS and Y.js. It uses no second or third-party: all participating nodes talk directly to each other without a central service. Peerpad is open-source and built by Protocol Labs and the IPFS community.
          </p>
        </section>
        <section id='features' className='pa3'>
          <h2 className='f1-ns fw2 lh-copy tracked--1 fancy-underline' style={{fontSize: '40px'}}>
            Features
          </h2>
        </section>
        <section id='how-it-works' className='pa3'>
          <h2 className='f1-ns fw2 lh-copy tracked--1 fancy-underline' style={{fontSize: '40px'}}>
            How it works
          </h2>
        </section>
        <section id='benefits' className='pa3'>
          <h2 className='f1-ns fw2 lh-copy tracked--1 fancy-underline' style={{fontSize: '40px'}}>
            Benefits
          </h2>
        </section>
      </div>
    )
  }

  componentDidCatch (err, info) {
    this.setState({ error: err })
  }
}

export default Home
