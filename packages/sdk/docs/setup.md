# Hello, Blocks!

<!-- NOTE(evanhahn): This file will soon be moved to the docs/ subproject. -->

Thanks for participating in the developer preview of the Airtable Blocks platform! Before today, all
blocks were developed by Airtable. No longer! You'll be able to supercharge your own workflows.

We're genuinely excited to see what you build.

We appreciate any and all feedback! We want to make this platform the best it can be for developers
and users. Please send all feedback to blocks@airtable.com, it'll go directly to the platform
engineering team. We're also more than happy to help if you get stuck building a block!

This is a developer preview, which means things are subject to change. We ask that you don't make
your code public during the private developer preview.

## Prerequisites

This guide assumes a few things:

-   You have an _Airtable Pro or Enterprise workspace_. You'll need this to access Blocks. If you're
    not sure how to do this, check out our
    [support article](https://support.airtable.com/hc/en-us/articles/221403527-Upgrading-or-changing-your-workspace-s-plan).
-   You are familiar with Airtable and blocks.
-   You are familiar with JavaScript programming. Don't worry, you don't need to be an expert! If
    you need some help with the basics, check out
    [Mozilla's guides](https://developer.mozilla.org/en-US/docs/Learn/JavaScript).
-   You have familiarity with the terminal. You should know how to `cd` into a folder and run
    commands. Again, no need to be an expert!
-   You have a Windows, macOS, or Linux computer. Other operating systems may work but are untested.
-   You have _Node.js_ installed. You'll need Node 8 or higher. You can download it from
    [Node's website](https://nodejs.org/en/download/) or use a
    [package manager](https://nodejs.org/en/download/package-manager/). If you're not sure how to
    install Node, we recommend [nvm](https://github.com/nvm-sh/nvm) on macOS and Linux and its
    [Windows port](https://github.com/coreybutler/nvm-windows).
-   You have a text editor installed, such as Visual Studio Code, Atom, Sublime Text, or Vim. If
    you're not sure which editor to use, we recommend
    [Visual Studio Code](https://code.visualstudio.com/).

If any of these things aren't true, reach out to us and we'll help!

## Getting set up

We'll be running a number of commands in the terminal. In this guide, if you see a code snippet that
starts with `$`, that means it should be run in the terminal, but you don't need to type the `$`.

You'll need to make sure you're logged into the npm registry. Airtable's packages are currently
private, so you'll need to be logged in to npm to install them. Run `npm adduser` if you haven't
already logged in:

```
$ npm adduser
Username: my-example-username
Password: ∙∙∙∙∙∙∙∙
Email: (this IS public) me@example.com
```

Great! You’re all set up and ready to build blocks.

## “Hello world 🚀”

We're all set up! Let's build our first block.

### Set up a new Airtable base

To start, make a new Airtable base from scratch. Its name doesn't matter, but we'll call it
“Blocks!” in this guide.

![](/packages/sdk/docs/images/setup_1.gif)

Note that we're just creating a new base for the purposes of this guide—you can build blocks in any
base you already have, as long as it's in a Pro or Enterprise workspace.

> Blocks “belong to” a single Airtable base. Distributing blocks outside the base is not available
> in the developer preview.

Now that we have a base, it's time to create our block.

### Create a new block

Start by opening the Blocks dashboard by clicking the “Blocks” button at the top-right of the
screen. From there, click “Add a block”, and then “Build a block”.

![](/packages/sdk/docs/images/setup_2.gif)

Now it's time to give our new block a name. We'll call it “Hello Blocks”.

![](/packages/sdk/docs/images/setup_3.png)

Click “Create block” to continue.

Next, you’ll need to follow the on-screen instructions. First, open your terminal. Next, follow
on-screen instructions to install the Airtable Blocks command line
tool.

> _NOTE:_ If this fails with an error like “@airtable/blocks-cli: Not found”, you likely lack
> permissions to download the private package. Make sure that we’ve added you to the `@airtable` npm
> organization and that you have logged in with `npm adduser`.

To check that you have the correct version of blocks-cli, run `block` in the terminal. You should
see instructions for using blocks-cli, which begins with `Usage: block <command> [options]`.

The next screen will have you running `block init` with some additional arguments. Once you’ve
entered your Airtable API key, the `block init` command will install dependencies and then your
project will be ready! Run `cd hello_blocks`, then `block run` (as it says).

In the terminal output, you’ll see something like “Your block is running locally at https://localhost:9000”.

Enter https://localhost:9000 as the block URL in Airtable.

![](/packages/sdk/docs/images/setup_6.png)

The first time you do this, you may need to tell your browser that https://localhost:9000 is
safe to visit.  Follow the on-screen instructions to do this. You may need to restart your browser.
After restarting the browser, go back to the base, click your block's name, then click "Edit block".

If you've done this correctly, you'll see your block appear!

![](/packages/sdk/docs/images/setup_4.png)

Open `frontend/index.js` in your text editor and try changing the text from “Hello world 🚀” to
something else, like “Goodbye, Earth! 🌍”. When you save the file, the block server will update and
your block should refresh in the browser automatically.

![](/packages/sdk/docs/images/setup_5.png)

Great! We have our blocks development environment set up.

You can stop the server at any time by pressing `Control-C` in the terminal window that's running
`block run`.

This block is only really present in development. That’s useful while you’re working. But if you
turn off your development server and refresh the page, the block will disappear. And if another
collaborator on your base shows up, all they'll see is this empty block. Next, we'll see how to
release our block.

## Releasing your block

While you're working on code, you don't want to show it off until it's ready. But at some point, it
will be ready for the rest of your base collaborators to see, and then it's time to release it!

When you're ready to release your block, run `block release`. This will build your block's code and
upload it to Airtable's servers. Airtable's servers will automatically take care of releasing your
block.

Now, refresh the page in the browser. You’ll see your block is still there! You can even turn your
development server off and the block will still be there (though you can leave it running if you
want). You can also try inviting a collaborator to your base and they should be able to see your
block.

## Onward!

We’ve built “Hello, blocks”. You’ve gotten your computer set up, seen how to create a new block, how
to make changes to it, and how to release it.

**Next, we’ll learn to [how to make a to-do list block!](/packages/sdk/docs/tutorial_todo.md)**

## Appendix: files and directory structure

If you look around your newly-created `hello_blocks` folder, you'll see a directory structure like
this:

```
hello_blocks
├── .block/
│   └── remote.json
├── .eslintrc.js
├── .gitignore
├── block.json
├── build/
├── frontend/
│   └── index.js
├── node_modules/
├── package.json
└── package-lock.json
```

_Not seeing the files that start with .? Try `$ ls -a` to show them._

Let's talk about what each of these files are.

-   `.block/remote.json` describes some metadata for your block. The block command uses this to know
    which block you're developing. You shouldn't need to edit this file directly.
-   `.eslintrc.js` describes some default rules for ESLint, which is an optional command
    (`npm run lint`) you can run that has recommendations for code style and best practices. You
    shouldn't need to edit this file for this guide.
-   `.gitignore` describes the files that Git should ignore. You shouldn't need to edit this file
    for this guide.
-   `block.json` describes the configuration for your block. Right now, this is how you specify
    which file to use as the frontend entry point for your block. In the future, we may add
    additional properties to this file.
-   `build/` is a directory that contains built files. You shouldn’t edit files here.
-   `frontend/index.js` is the entry point to your project (as described in block.json). You’ll do
    most of your work in this folder.
-   `node_modules/` is a standard in JavaScript projects. It is where all of your dependencies, such
    as React, are installed. You shouldn’t make any changes in this folder.
-   `package.json` is a file that's standard in most JavaScript projects. You'll use it to describe
    your block's dependencies. For example, React is a dependency, which you can see in
    package.json.
-   `package-lock.json` is a file that npm uses to install your dependencies. You shouldn’t make any
    changes to this file.
