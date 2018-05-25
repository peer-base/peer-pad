# Contributing to PeerPad

## Dev Workflow

- After making changes run `npm test`
  - If there are snapshot failures you will see a diff of html. If the changes listed are as they are expected, run `npm test -- -u`, which will generate a new version of the jest snapshots
  - Once all tests are passing commit your changes, including the snapshot files (`.snap`)
- Create your PR and request a review from one of the repo maintainers. If you are not sure who the maintainers are, you can skip adding a reviewer and the Lead Maintainer will add one or review it themselves
  - If the PR is open long enough to get conflicts, rebase with master and fix the conflicts
  - Make sure to re-run `npm test` and, if needed, `npm test — -u`
- Once approved, a maintainer will merge your branch to master

### Jest Snapshots

When html is changed, running `npm test` will fail as jest catches the changes. The diff in snapshots listed in the output after running the tests should **always** be reviewed prior to updating the snapshots with `npm test -- -u`, to avoid commiting an unwanted change to the test suite.
