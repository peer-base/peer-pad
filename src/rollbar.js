import rollbar from 'rollbar'

const rollbarTransformer = (payload) => {
  // This removes the last part of a URL, in case we're inside a pad, we don't
  // want to share the encryption key with Rollbar
  payload.request.url = payload.request.url.split('/').slice(0, -1).join('/')
}

export default (hostname) => {
  const rollbarConfig = {
    // Only enable error reporting if user is loading the website via peerpad.net
    enabled: hostname === 'peerpad.net' || hostname === 'dev.peerpad.net',
    captureIp: false,
    accessToken: '2eaed8c2c5e243af8497d15ea90b407e',
    captureUncaught: true,
    captureUnhandledRejections: true,
    transform: rollbarTransformer,
    payload: {
      environment: hostname,
      client: {
        javascript: {
          source_map_enabled: true,
          code_version: process.env.GIT_COMMIT,
          guess_uncaught_frames: true
        }
      }
    }
  }

  const Rollbar = rollbar.init(rollbarConfig)
  return Rollbar
}
