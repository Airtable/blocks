#!/usr/bin/env python3

import os
from enum import Enum
from pathlib import Path
from typing import Optional

from github import Github
from github.Commit import Commit
from github.CommitStatus import CommitStatus
from github.PullRequest import PullRequest
from github.Repository import Repository


class GitHubStatus(str, Enum):
    ERROR = 'error'
    FAILURE = 'failure'
    PENDING = 'pending'
    SUCCESS = 'success'


def get_auth_token():
    return os.getenv("GITHUB_AUTH_TOKEN")


def make_gh_client(auth_token) -> Github:
    return Github(auth_token)


def get_repo_handle(gh_client: Github, repo_name: str) -> Repository:
    return gh_client.get_repo(repo_name)


def get_pull_request_handle(repo_handle: Repository, pull_request_id: int) -> PullRequest:
    return repo_handle.get_pull(pull_request_id)


def get_commit_status_by_job_name(commit_obj: Commit, job_name: str) -> Optional[CommitStatus]:
    """Given a commit object, search the statuses associated with it for a status of a particular job name."""
    for status_obj in commit_obj.get_combined_status().statuses:
        if status_obj.context == job_name:
            return status_obj

    return None


def on_test_failure(
        repo_name: str,
        sha: str,
        pull_request_id: int,
        job_name: str,
        description: str,
        target_url: str,
        additional_markdown: Optional[str],
        server_status_failed_filepath: Optional[Path] = None,
        gh_client: Optional[Github] = None,
        repo_handle: Optional[Repository] = None,
        pull_request_handle: Optional[PullRequest] = None,
) -> Optional[GitHubStatus]:
    """Invoke this when a test fails.  This implies that the run as a whole is not yet complete.  This method follows
    the following flowchart:

    - If the GitHub status is pending:
      - Update the build status for the sha on GitHub.
      - Post a comment to the pull request.
    - If the GitHub status is already marked as failed, do nothing.
    - Return the prior status.

    When posting a comment to the pull request (not the sha), determine if the pull request is still pointing to the
    same sha.  If not, the message posted to the pull request should note this state.

    There is a file path whose presence indicates that the GitHub status has failed.  This is to reduce the number of
    API calls we make to github.

    NOTE: there are definitely race conditions at play here.  In practice, that means we will may have duplicate failure
    comments being announced.

    Parameters
    ----------
    repo_name : str
        Name of the repo, given as <owner>/<repo>.
    sha : str
        Git commit sha this build was run for.
    pull_request_id : int
        Pull request that this build was run for.  Please note that this is _not_ redundant with respect to `sha`
        because multiple builds can be made for the same pull request but with different `sha`s.
    job_name : str
        This is used to identify the build name.  This maps to the context field in the GitHub status API, documented at
        <https://docs.github.com/en/rest/reference/repos#statuses>.
    description : str
        This is a short blurb to be displayed alongside the commit status.  As an example, for github actions, a
        successful run's description is the length of time the run took.  This maps to the description field in the
        GitHub status API, documented at <https://docs.github.com/en/rest/reference/repos#statuses>.
    target_url : str
        This is used to link to the build.  This maps to the target URL field in the GitHub status API, documented at
        <https://docs.github.com/en/rest/reference/repos#statuses>.
    additional_markdown : Optional[str]
        If this is provided, it is appended to the message posted to the pull request.
    server_status_failed_filepath : Optional[Path]
        If provided, this path may be tested for existence, and a file may be created at this path.  If it exists, it is
        assumed that the GitHub server state is `failure`.  If we are called with `status` equal to
        GitHubStatus.FAILURE, then a file will be created at this path.
    gh_client : Optional[Github]
        If provided, use this client instead of creating a new one.
    repo_handle : Optional[Repository]
        If provided, use this repository handle instead of creating a new one.  No verification is performed to ensure
        this is the correct repository handle.
    pull_request_handle : Optional[PullRequest]
        If provided, use this pull request handle instead of creating a new one.  No verification is performed to ensure
        this is the correct pull request handle.
    """
    if gh_client is None:
        gh_client = make_gh_client(get_auth_token())
    if repo_handle is None:
        repo_handle = get_repo_handle(gh_client, repo_name)
    if pull_request_handle is None:
        pull_request_handle = get_pull_request_handle(repo_handle, pull_request_id)

    current_commit_obj: Optional[Commit] = None
    current_status: Optional[GitHubStatus] = None
    if server_status_failed_filepath is not None and server_status_failed_filepath.exists():
        current_status = GitHubStatus.FAILURE
    else:
        # get the current status of the pull request
        current_commit_obj = repo_handle.get_commit(sha)
        commit_status = get_commit_status_by_job_name(current_commit_obj, job_name)
        if commit_status is not None:
            current_status = GitHubStatus(commit_status.state)

    # it was not already marked as failed, create the status and make a comment.
    if current_status != GitHubStatus.FAILURE:
        _on_failure(
            sha,
            job_name,
            current_commit_obj,
            description,
            target_url,
            False,
            additional_markdown,
            pull_request_handle,
        )
        if server_status_failed_filepath is not None:
            # create the marker file so subsequent failure reports will not trigger more API calls.
            with server_status_failed_filepath.open("w") as fh:
                fh.close()

    return current_status


def on_build_complete(
        repo_name: str,
        sha: str,
        pull_request_id: int,
        status: GitHubStatus,
        job_name: str,
        description: str,
        target_url: str,
        additional_markdown: Optional[str],
        gh_client: Optional[Github] = None,
        repo_handle: Optional[Repository] = None,
        pull_request_handle: Optional[PullRequest] = None,
) -> Optional[GitHubStatus]:
    """Invoke this when a build completes.  This method follows the following flowchart:

    - Update the build status for the sha on GitHub.
    - If the build failed, post a comment to the pull request.
    - Return `None`.

    When posting to the pull request (but not the sha), determine if the pull request is still pointing
    to the same sha.  If not, the message posted to the pull request should note this state.

    Parameters
    ----------
    repo_name : str
        Name of the repo, given as <owner>/<repo>.
    sha : str
        Git commit sha this build was run for.
    pull_request_id : int
        Pull request that this build was run for.  Please note that this is _not_ redundant with respect to `sha`
        because multiple builds can be made for the same pull request but with different `sha`s.
    status : GitHubStatus
        The GitHub status.  The authoritative list can be found at
        <https://docs.github.com/en/rest/reference/repos#statuses>.
    job_name : str
        This is used to identify the build name.  This maps to the context field in the GitHub status API, documented at
        <https://docs.github.com/en/rest/reference/repos#statuses>.
    description : str
        This is a short blurb to be displayed alongside the commit status.  As an example, for github actions, a
        successful run's description is the length of time the run took.  This maps to the description field in the
        GitHub status API, documented at <https://docs.github.com/en/rest/reference/repos#statuses>.
    target_url : str
        This is used to link to the build.  This maps to the target URL field in the GitHub status API, documented at
        <https://docs.github.com/en/rest/reference/repos#statuses>.
    additional_markdown : Optional[str]
        If this is provided, it is appended to the message posted to the pull request.
    gh_client : Optional[Github]
        If provided, use this client instead of creating a new one.
    repo_handle : Optional[Repository]
        If provided, use this repository handle instead of creating a new one.  No verification is performed to ensure
        this is the correct repository handle.
    pull_request_handle : Optional[PullRequest]
        If provided, use this pull request handle instead of creating a new one.  No verification is performed to ensure
        this is the correct pull request handle.
    """
    if gh_client is None:
        gh_client = make_gh_client(get_auth_token())
    if repo_handle is None:
        repo_handle = get_repo_handle(gh_client, repo_name)
    if pull_request_handle is None:
        pull_request_handle = get_pull_request_handle(repo_handle, pull_request_id)

    # The run has completed.  Update the status on GitHub.
    current_commit_obj = repo_handle.get_commit(sha)
    if status == GitHubStatus.FAILURE:
        _on_failure(
            sha,
            job_name,
            current_commit_obj,
            description,
            target_url,
            True,
            additional_markdown,
            pull_request_handle,
        )
    else:
        current_commit_obj.create_status(status, target_url, description, context=job_name)

    return None


def _on_failure(
        sha: str,
        job_name: str,
        current_commit_obj: Commit,
        description: str,
        target_url: str,
        run_completed: bool,
        additional_markdown: Optional[str],
        pull_request_handle: PullRequest,
) -> None:
    """Invoke this when a build fails.  Mark the GitHub status as GitHubStatus.FAILURE (`failure`) and posts a message
    to the pull request.  The message should reflect the run completion status (whether this is the final message for
    this build), whether this is the latest build for a given pull request, and any additional content to be put into
    the pull request message.

    Parameters
    ----------
    sha : str
        Git commit sha this build was run for.
    job_name : str
        This is used to identify the build name.  This maps to the context field in the GitHub status API, documented at
        <https://docs.github.com/en/rest/reference/repos#statuses>.
    description : str
        This is a short blurb to be displayed alongside the commit status.  As an example, for github actions, a
        successful run's description is the length of time the run took.  This maps to the description field in the
        GitHub status API, documented at <https://docs.github.com/en/rest/reference/repos#statuses>.
    target_url : str
        This is used to link to the build.  This maps to the target URL field in the GitHub status API, documented at
        <https://docs.github.com/en/rest/reference/repos#statuses>.
    run_completed : bool
        If true, this is the final result of a build.  If false, this is an early report of a failure.  In this case,
        the status should be `failure`.
    additional_markdown : Optional[str]
        If this is provided, it is appended to the message posted to the pull request.
    pull_request_handle : Optional[PullRequest]
        If provided, use this pull request handle instead of creating a new one.  No verification is performed to ensure
        this is the correct pull request handle.
    """
    current_commit_obj.create_status(GitHubStatus.FAILURE, target_url, description, context=job_name)

    # add a comment.
    comment_markdown = f"Build @ {target_url} (for {sha}) failed."
    if sha != pull_request_handle.head.sha:
        comment_markdown += (
            f" Note that the pull request has advanced to {pull_request_handle.head.sha} so this is not the"
            f" most recent build for this pull request."
        )
    if additional_markdown is not None:
        comment_markdown += "\n\n" + additional_markdown
    if not run_completed:
        comment_markdown += "\n\n_The build is still in progress._"
    pull_request_handle.create_issue_comment(comment_markdown)
