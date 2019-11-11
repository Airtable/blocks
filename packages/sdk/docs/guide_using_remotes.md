# Running and releasing a block in multiple bases

When you first create a block via the `block init` command, a default `remote` is created for you.
The `remote` identifies the base where the block will run and where it will be released. If you want
to run or release your block in multiple bases, you can add additional remotes.

Here are directions for how to run and release your block on a different base with remotes:

1. Create a block in your other base as you normally would (i.e. Click “Add a block” → “Build a
   custom block”)
2. Click through the instruction wizard until the “Get started” step. Save the `block init` command
   somewhere but _do not run the command_! The important part we will need later is the first
   argument to the `block init` command, which is the block identifier. This block identifier value
   should look something like: `appAbC123aBc123ab/blkAbC123aBc123ab`
3. Add a new “remote” with the `block add-remote` command, using the block identifier from step [2],
   and a name for the remote. This remote name should identify the new base you want to push the
   block to:

```sh
$ block add-remote appAbC123aBc123ab/blkAbC123aBc123ab my_other_base
```

4. The `block run` and `block release` commands will accept a `--remote` option that can now be used
   to run and release the block on the other base. The value of of the `--remote` option should
   match the name from step [3].

```sh
$ block run --remote my_other_base
$ block release --remote my_other_base
```

5. See all existing remotes via the `block list-remotes` command.

```sh
$ block list-remotes
Name          Block identifier
default       appXyZ123zYz123Yz/blkXyZ123zYz123Yz
my_other_base appAbC123aBc123ab/blkAbC123aBc123ab
```

6. Remove a remote via the `block remove-remote` command

```sh
$ block remove-remote my_other_base
```
