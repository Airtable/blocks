@echo off
REM This is a Windows command line wrapper for the block command for smoke
REM testng. It is not used in the release, as NPM will automatically generate a
REM Windows command line wrapper based on the package installation path.
node  "%~dp0\block" %*
