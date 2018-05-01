# Deploying Peerpad

The [`ci/Jenkinsfile`]() defines what domain to deploy the app under, and that the `/build` directory is where it should look for

The `build` target defined in the [Makefile](../Makefile) is executed on Jenkins on every PR and merge to master. It installs the dependencies, and runs the `npm run build` script defined in the `package.json` is run.

That calls [`scripts/build.js`](../scripts/build.js) which creates the optimised build into the `build/` directory. That script is the result of ejecting a create-react-app generated scaffolding. It's been tweaked to disable mangling, though that may no longer be necessary (https://github.com/ipfs/aegir/pull/214)

Jenkins CI build peerpad as a "website" job. The build is executed in a docker container:

```sh
sh 'docker run -i -v `pwd`:/site ipfs/ci-websites make -C /site build'
```
https://github.com/ipfs/jenkins-libs/blob/796cab23030077109f98bbb092d57ed9f4964772/vars/website.groovy#L80

The ipfs/ci-websites docker image is built from this Dockefile, which defines the build environment https://github.com/ipfs/ci-websites/blob/af0b98f712a5e6bd4174eb86e2ee05c9bdaacb57/Dockerfile

When a PR is merged to master, Jenkins will run the build steps in the Makefile, and if all goes well, add the build dir to ipfs, and update the dns for peerpad.net to point the `_dnslink` subdomain to the new root ipfs hash.
