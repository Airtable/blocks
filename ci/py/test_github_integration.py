#!/usr/bin/env python3

import os
import random
import string
import subprocess
import time
from pathlib import Path

from github import Github
from github.PullRequest import PullRequest
from github.Repository import Repository
import pytest

import github_integration


@pytest.fixture(scope="session")
def repo_name():
    return os.getenv("GITHUB_REPO", "at-ci-cd-github-test/test")


@pytest.fixture(scope="session")
def gh_client() -> Github:
    return github_integration.make_gh_client(github_integration.get_auth_token())


@pytest.fixture(scope="session")
def repo_handle(gh_client, repo_name) -> Repository:
    return gh_client.get_repo(repo_name)


@pytest.fixture()
def checkout(tmp_path_factory, repo_name) -> Path:
    auth_token = github_integration.get_auth_token()
    checkout_subdir = "".join(random.choice(string.ascii_lowercase) for i in range(10))
    tmp_path = tmp_path_factory.mktemp(checkout_subdir)
    # set up enough config to make a commit.
    subprocess.check_call(
        ["git", "init"],
        cwd=os.fspath(tmp_path),
    )
    subprocess.check_call(
        ["git", "config", "user.name", "test user"],
        cwd=os.fspath(tmp_path),
    )
    subprocess.check_call(
        ["git", "config", "user.email", "opsteam+ci_cd_github_test@airtable.com"],
        cwd=os.fspath(tmp_path),
    )

    # clone the repo
    subprocess.check_call(
        [
            "git",
            "remote",
            "add",
            "origin",
            f"https://{auth_token}@github.com/{repo_name}/",
        ],
        cwd=os.fspath(tmp_path),
    )
    subprocess.check_call(
        [
            "git",
            "fetch",
            "--no-tags",
            "origin",
            "+refs/heads/main:refs/heads/main",
        ],
        cwd=os.fspath(tmp_path),
    )
    subprocess.check_call(
        [
            "git",
            "checkout",
            "refs/heads/main"
        ],
        cwd=os.fspath(tmp_path),
    )

    return tmp_path


def make_commit(checkout_path: Path, branch_name: str) -> str:
    """Make a commit to a checkout, and push it to the origin with a given branch name.  Return the sha of the
    commit."""
    with (checkout_path / "README.md").open("a") as fh:
        fh.write("hello world")

    # make a commit
    subprocess.check_call(
        [
            "git",
            "commit",
            "-a",
            "-m", "here is a commit",
        ],
        cwd=os.fspath(checkout_path),
    )

    # make a commit
    subprocess.check_call(
        [
            "git",
            "push",
            "origin",
            f"HEAD:refs/heads/{branch_name}",
        ],
        cwd=os.fspath(checkout_path),
    )

    # get the commit sha
    sha = subprocess.check_output(
        [
            "git",
            "rev-parse",
            "HEAD",
        ],
        cwd=os.fspath(checkout_path),
    ).decode("utf-8").strip()

    return sha


def make_pull_request(repo_object: Repository, branch_name: str) -> PullRequest:
    return repo_object.create_pull(
        title="This is a test pull request",
        body="This is the body of a test pull request",
        head=branch_name,
        base="main",
    )


def test_early_failure(
        repo_name: str,
        gh_client: Github,
        repo_handle: Repository,
        checkout: Path,
        job_name: str = "test_job_name",
):
    """Report a failure on an incomplete build twice.  The first failure should update the status and add a message to
    the pull request.  The second one should be silent.  Then report a failure on the completed build."""
    branch_name = "".join(random.choice(string.ascii_lowercase) for i in range(10))
    sha = make_commit(checkout, branch_name)
    pull_request_handle = make_pull_request(repo_handle, branch_name)
    github_integration.on_test_failure(
        repo_name,
        sha,
        pull_request_handle.id,
        job_name,
        "failure detected -- job still running",
        "http://url",
        "first failure message",
        gh_client=gh_client,
        repo_handle=repo_handle,
        pull_request_handle=pull_request_handle,
    )

    # grab the server status
    commit_status = github_integration.get_commit_status_by_job_name(repo_handle.get_commit(sha), job_name)
    assert commit_status is not None, "Didn't find our status at all."
    assert commit_status.state == github_integration.GitHubStatus.FAILURE.value
    assert commit_status.description == "failure detected -- job still running"

    # get the last message in the pull request.  it should say the build is still in progress.
    comments = list(pull_request_handle.get_issue_comments())
    assert len(comments) == 1
    assert comments[-1].body.find("The build is still in progress") != -1

    github_integration.on_test_failure(
        repo_name,
        sha,
        pull_request_handle.id,
        job_name,
        "failure detected -- job still running",
        "http://url",
        "first failure message",
        gh_client=gh_client,
        repo_handle=repo_handle,
        pull_request_handle=pull_request_handle,
    )

    # a subsequent intermediate failure should not add a comment.
    comments = list(pull_request_handle.get_issue_comments())
    assert len(comments) == 1

    # Final failure message from the end of the build.
    github_integration.on_build_complete(
        repo_name,
        sha,
        pull_request_handle.id,
        github_integration.GitHubStatus.FAILURE,
        job_name,
        "build failed",
        "http://url",
        "final failure message",
        gh_client,
        repo_handle,
        pull_request_handle,
    )

    # we should be in `failure` but with a different message.
    commit_status = github_integration.get_commit_status_by_job_name(repo_handle.get_commit(sha), job_name)
    assert commit_status is not None, "Didn't find our status at all."
    assert commit_status.state == github_integration.GitHubStatus.FAILURE.value
    assert commit_status.description == "build failed"

    # we should have an additional comment now.
    comments = list(pull_request_handle.get_issue_comments())
    assert len(comments) == 2
    assert comments[-1].body.find("The build is still in progress") == -1


def test_old_sha_fails(
        repo_name: str,
        gh_client: Github,
        repo_handle: Repository,
        checkout: Path,
        job_name: str = "test_job_name",
):
    """Report an early failure on a build for a pull request that has been supplanted by a new commit."""
    branch_name = "".join(random.choice(string.ascii_lowercase) for i in range(10))
    old_sha = make_commit(checkout, branch_name)
    pull_request_handle = make_pull_request(repo_handle, branch_name)

    # make a new commit
    new_sha = make_commit(checkout, branch_name)

    # wait until GitHub updates the pull request to the new sha.
    start = time.time()
    while time.time() < start + 10:
        if repo_handle.get_pull(pull_request_handle.number).head.sha == new_sha:
            break
        time.sleep(1)
    else:
        pytest.fail("Timed out waiting for github.")

    github_integration.on_test_failure(
        repo_name,
        old_sha,
        pull_request_handle.number,
        job_name,
        "failure detected -- job still running",
        "http://url",
        "first failure message",
        gh_client=gh_client,
        repo_handle=repo_handle,
        # we need to create a new pull request handle otherwise we will still think the old sha is valid.
        pull_request_handle=None,
    )

    # grab the server status.  the old sha should have a failure.  the new sha should have no status.
    commit_status = github_integration.get_commit_status_by_job_name(repo_handle.get_commit(old_sha), job_name)
    assert commit_status is not None, "Didn't find our status at all."
    assert commit_status.state == github_integration.GitHubStatus.FAILURE.value
    assert commit_status.description == "failure detected -- job still running"

    commit_status = github_integration.get_commit_status_by_job_name(repo_handle.get_commit(new_sha), job_name)
    assert commit_status is None, "New commit already has status!"

    # get the last message in the pull request.  it should say the build is still in progress.
    comments = list(pull_request_handle.get_issue_comments())
    assert len(comments) == 1
    assert comments[-1].body.find("The build is still in progress") != -1
    assert comments[-1].body.find("Note that the pull request has advanced to") != -1

    github_integration.on_build_complete(
        repo_name,
        new_sha,
        pull_request_handle.number,
        github_integration.GitHubStatus.SUCCESS,
        job_name,
        "build completed",
        "http://url",
        "I am so happy!",
        gh_client,
        repo_handle,
        # we need to create a new pull request handle otherwise we will still think the old sha is valid.
        pull_request_handle=None,
    )

    # we should be in `success`
    commit_status = github_integration.get_commit_status_by_job_name(repo_handle.get_commit(new_sha), job_name)
    assert commit_status is not None, "Didn't find our status at all."
    assert commit_status.state == github_integration.GitHubStatus.SUCCESS.value
    assert commit_status.description == "build completed"

    # no new comments.
    comments = list(pull_request_handle.get_issue_comments())
    assert len(comments) == 1
