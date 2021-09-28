# Shared code app

This example app shows how to use code from other directories in your app.

This functionality is only supported in the v2 CLI, which is in public beta. You can find out more
about the v2 CLI and how to install it
[here](https://www.npmjs.com/package/@airtable/blocks-cli/v/beta).

In order to test this app - run block run from within `hello-world-typescript-block` after running
`npm install` in the root folder

## Developing against a shared library

Sometimes using a relative path is fine (as is done in this example). Othertimes it's useful to
package your shared code as an independent library, but also allow development against the local
version of your library.

In this case, you can use [npm link](https://docs.npmjs.com/cli/v7/commands/npm-link).

In order to get this running in this example:

-   Change directories: `cd ./hello-world-shared`; then run `npm link`
-   Change directories: `cd ../hello-world-typescript-block`;
-   Run `npm install --save ../hello-world-shared` to install
-   Run `npm link hello-world-shared` to use the link

Now you can replace:

```
import {Hello} from '../../hello-world-shared';
```

with:

```
import {Hello} from 'hello-world-shared';
```

And then if you use the library instead, you won't have to change any code!

([Thanks Ronen!](https://community.airtable.com/t/blocks-cli-v2-beta-how-to-use-code-from-other-directories/43197/4))

## A note about `npm install`

If you inspect the npm install command you will see that we install packages from three different
places from reach of the three `package.json`'s

This is done so that there is only a single React installation that all of the packages and
reference. If there are multiple React installations in your repository there can be issues.
Oftentimes exhibiting itself as an `Invalid hook call` if using hooks.

In order to alleviate this issue - we install react once at the root level so that all installations
can share the same single react installation.

(There are other reasonable solutions to this same problem - eg: use of hardlinks, like with pnpm or
yarn v2)
