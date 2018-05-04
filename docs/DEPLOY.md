# Deploying Peerpad

Peerpad is a single page web app. The `src` directory is built into a static website in the `build` directory and deployed to IPFS infrastructure by the [Jenkins CI job](https://ci.ipfs.team/blue/organizations/jenkins/IPFS%20Shipyard%2Fpeer-pad/activity).

Jenkins watches the [repo](https://github.com/ipfs-shipyard/peer-pad) for changes, and automatically build an IPFS hosted preview site for every commit (e.g. [preview](https://ipfs.io/ipfs/QmUjBkWSiTxdETKv5g3gawzKTG3mfmDaX22QEPE3CkkUf3)).

**Commits to master are automatically published to peerpad.net**

The [`ci/Jenkinsfile`](../ci/Jenkinsfile) defines the domain to deploy the app under ([peerpad.net](https://peerpad.net/)) and the directory to use as the webroot for the domain (`/build`).

On every commit Jenkins runs the `build` target in the [`Makefile`](../Makefile). If it completes without error, then the build dir is added to IPFS and the CID of the directory gives us the IPFS address for the new deployment.

If the successful build was triggered by a commit to **master**, then that build is published to the domain. The DNS records for peerpad.net are updated to point at the new deployment. The `_dnslink` subdomain is updated with a TXT record like `dnslink=/ipfs/QmHash"`. IPFS uses the dnslink record to map the domain to the current CID, and is used to resolve the IPNS address [/ipns/peerpad.net](https://ipfs.io/ipns/peerpad.net)

The `build` target defined in the [`Makefile`](../Makefile) is executed on Jenkins on every PR and merge to master. It installs the dependencies, and delegates the rest of the steps to `npm run build` which is defined in the `scripts.build` property in the [`package.json`](../package.json).

That calls [`scripts/build.js`](../scripts/build.js) which creates the optimised build of the peerpad `src` into the `build/` directory. That script is the result of ejecting a create-react-app generated scaffolding. It's been tweaked to disable mangling, _(though that may no longer be necessary since https://github.com/ipfs/aegir/pull/214)_

Jenkins CI build peerpad as a "website" job.

https://ci.ipfs.team/job/IPFS%20Shipyard/job/peer-pad/

The build is executed in a docker container:

```sh
sh 'docker run -i -v `pwd`:/site ipfs/ci-websites make -C /site build'
```
See: https://github.com/ipfs/jenkins-libs/blob/796cab23030077109f98bbb092d57ed9f4964772/vars/website.groovy#L80

The ipfs/ci-websites docker image is built from this Dockefile, which defines the build environment https://github.com/ipfs/ci-websites/blob/af0b98f712a5e6bd4174eb86e2ee05c9bdaacb57/Dockerfile
