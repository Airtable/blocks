#!/usr/bin/env python3
#
# Sends notifications about build status updates.
#
# If we are called from docker/Jenkinsfile, we should always set the server status to match and post a message to the
# pull request.
#
# If the new status is success, then mark the sha as success and post a message to the pull request.  If the new status
# is failed, then check the server status status for the sha.  If it is pending, that means we may be the first to
# report an error.  Mark the sha as failed and post a message to the pull request.  If the server status is already
# marked as failed, then we wait a short time, and check if an error message is posted to the pull request.  If nothing
# shows up, then we post an error message.
#
# Note that this approach may result in race conditions that produce multiple error messages to the pull request.  This
# can happen if multiple tests fail around the same time.

import dataclasses
from pathlib import Path
from typing import Optional

import click

import github_integration


@dataclasses.dataclass
class TopLevelParameters:
    repo: str
    sha: str
    pull_request_id: int
    job_name: str
    description: str
    target_url: str
    additional_markdown: Optional[str]


@click.group()
@click.option("--repo", required=True, type=str)
@click.option("--sha", required=True, type=str)
@click.option("--pull-request-id", required=True, type=int)
@click.option("--job-name", required=True, type=str, help="This is used to identify the build name.")
@click.option(
    "--description",
    required=True,
    type=str,
    help="This is a short blurb to be displayed alongside the commit status.",
)
@click.option(
    "--target-url",
    required=True,
    type=str,
    help="This is used to link to the build.",
)
@click.option(
    "--additional-markdown",
    type=str,
    default="",
    help="If this is provided, it is appended to the message posted to the pull request.",
)
@click.pass_context
def main(
        ctx,
        repo: str,
        sha: str,
        pull_request_id: int,
        job_name: str,
        description: str,
        target_url: str,
        additional_markdown: str,
):
    # ensure that ctx.obj exists and is a dict (in case `cli()` is called
    # by means other than the `if` block below)
    ctx.ensure_object(dict)

    ctx.obj['TopLevelParameters'] = TopLevelParameters(
        repo,
        sha,
        pull_request_id,
        job_name,
        description,
        target_url,
        additional_markdown,
    )


@main.command()
@click.option(
    "--status",
    required=True,
    type=click.Choice([status.value for status in github_integration.GitHubStatus]),
)
@click.pass_context
def on_build_complete(
        ctx,
        status: str,
):
    top_level_paremeters: TopLevelParameters = ctx.obj['TopLevelParameters']
    github_integration.on_build_complete(
        top_level_paremeters.repo,
        top_level_paremeters.sha,
        top_level_paremeters.pull_request_id,
        github_integration.GitHubStatus(status),
        top_level_paremeters.job_name,
        top_level_paremeters.description,
        top_level_paremeters.target_url,
        top_level_paremeters.additional_markdown,
    )


@main.command()
@click.option(
    "--server-status-failed-filepath",
    type=click.Path(exists=False, file_okay=True, dir_okay=False, path_type=Path),
    help=(
            "If this is provided, the presence of a file at this location is used as a cache for a failed status on"
            " GitHub."
    ),
)
@click.pass_context
def on_test_failure(
        ctx,
        server_status_failed_filepath: Optional[Path],
):
    top_level_paremeters: TopLevelParameters = ctx.obj['TopLevelParameters']
    github_integration.on_test_failure(
        top_level_paremeters.repo,
        top_level_paremeters.sha,
        top_level_paremeters.pull_request_id,
        top_level_paremeters.job_name,
        top_level_paremeters.description,
        top_level_paremeters.target_url,
        top_level_paremeters.additional_markdown,
        server_status_failed_filepath=server_status_failed_filepath,
    )


if __name__ == "__main__":
    main()
