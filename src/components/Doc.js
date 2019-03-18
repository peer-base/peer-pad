import React from 'react'

// Shared styling for in-editor preview, and snapshot rendering.
// Deliberately inlined here so they are applied to rendered snapshots as well as in app.
// Workaround for https://github.com/ipfs-shipyard/peerpad/issues/75
const Doc = ({html = '', className = 'Doc', ...props}) => (
  <div>
    <style>
      {`
      .Doc {
        color: #0e1d32;
        line-height: 1.5;
        font-size: 16px;
        font-family: -apple-system, BlinkMacSystemFont, "avenir next", avenir, helvetica, "helvetica neue", ubuntu, roboto, noto, "segoe ui", arial, sans-serif;
      }

      .Doc h1,
      .Doc h2,
      .Doc h3,
      .Doc h4,
      .Doc h5,
      .Doc h6 {
        font-weight: normal;
        padding: 0;
        margin: 2.4rem 0 -0.4rem;
      }

      .Doc h1 {
        font-size: 2.5em;
      }
      .Doc h2 {
        font-size: 2em;
      }
      .Doc h3 {
        font-size: 1.5rem;
      }
      .Doc h4 {
        font-weight: 700;
        font-size: 1.25rem;
      }
      .Doc h5 {
        font-size: 1rem;
        font-weight: 700;
      }
      .Doc h6 {
        font-size: 1rem;
        font-weight: 600;
      }

      .Doc p {
        margin: 1.2rem 0;
      }

      .Doc a {
        color: #1fccdf;
        text-decoration: none;
      }

      .Doc a:hover {
        text-decoration: underline;
      }

      .Doc img {
        max-width: 100%;
        margin: 0.4rem 0;
      }

      .Doc ul,
      .Doc ol {
        margin: 1.2rem 0;
        line-height: 1.8;
        padding-left: 20px;
      }

      .Doc code {
        border-radius: 3px;
        background-color: rgba(27,31,35,0.05);
        padding: 0.2rem 0.3rem;
        margin: 0 -0.1rem;
        font-size: 85%;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
        overflow: scroll;
      }

      .Doc pre code {
        margin: 1.8rem 0;
        padding: 1rem;
        display: block;
      }

      .Doc blockquote {
        color: #656464;
        padding: .2rem 1rem;
        margin: 1.2rem 0;
        border-left: .2rem solid #656464;
      }

      .Doc blockquote p:first-child {
        margin-top: 0.25rem;
      }

      .Doc blockquote p:last-child {
        margin-bottom: 0.25rem;
      }

      .Doc table {
        display: block;
        width: 100%;
        overflow: auto;
        margin: 1.8rem 0;
        border-spacing: 0;
        border-collapse: collapse;
      }

      .Doc table tr {
        background-color: #fff;
        border-top: 1px solid #c6cbd1;
      }

      .Doc table th {
        font-weight: 600;
      }

      .Doc table th,
      .Doc table td {
        padding: 6px 13px;
        border: 1px solid #dfe2e5;
      }

      .Doc hr {
        margin: 2.4rem 0;
      }
    `}
    </style>
    <div className={className} dangerouslySetInnerHTML={{__html: html}} {...props} />
  </div>
)

export default Doc
