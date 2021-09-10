# Credentials

In order to run this test, log into the github account at-ci-cd-github-test (the login and password can be found in the Engineering 1password vault) and make yourself a personal token. Please save it with a name that includes your github login name. Grant your token `repo` access.

Once you have the token, run pytest with:

```
% GITHUB_AUTH_TOKEN=ghp_XXX pytest
```
