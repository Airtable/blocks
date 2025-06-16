const {execSync} = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

function execCommand(command) {
    try {
        return execSync(command, {encoding: 'utf8'}).trim();
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        console.error(error.message);
        process.exit(1);
    }
}

function checkMainBranch() {
    const currentBranch = execCommand('git rev-parse --abbrev-ref HEAD');
    if (currentBranch !== 'main') {
        console.error('❌ Error: Must be on main branch to release');
        process.exit(1);
    }
}

function checkUncommittedChanges() {
    const status = execCommand('git status --porcelain');
    if (status) {
        console.error('❌ Error: There are uncommitted changes in the working tree');
        process.exit(1);
    }
}

function checkRemoteSync() {
    execCommand('git fetch origin');
    const localHead = execCommand('git rev-parse HEAD');
    const remoteHead = execCommand('git rev-parse origin/main');

    if (localHead !== remoteHead) {
        console.error('❌ Error: Local main branch is not in sync with origin/main');
        process.exit(1);
    }
}

function createVersionString() {
    const gitSha = execCommand('git rev-parse HEAD').substring(0, 9);
    const date = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '');
    return `0.0.0-experimental-${gitSha}-${date}`;
}

/**
 * Prompts the user with a y/n question, and resolves if the user answers 'y'.
 */
function promptUser(rl, questionString) {
    return new Promise(resolve => {
        rl.question(questionString, answer => {
            resolve(answer.toLowerCase() === 'y');
        });
    });
}

function updatePackageJsonVersion(versionString) {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const originalVersion = packageJson.version;

    packageJson.version = versionString;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4) + '\n');

    return originalVersion;
}

function restorePackageJsonVersion(originalVersion) {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    packageJson.version = originalVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4) + '\n');
}

/**
 * Does a "test run" of modifying package.json and restoring it.
 */
function verifyPackageJsonModification(versionString) {
    restorePackageJsonVersion(updatePackageJsonVersion(versionString));
    const statusAfterRestore = execCommand('git status --porcelain');
    if (statusAfterRestore) {
        console.error('❌ Error: Package.json modification resulted in unexpected changes');
        console.error('Changes detected:');
        console.error(statusAfterRestore);
        process.exit(1);
    }
}

/**
 * Verifies that the current working directory is packages/sdk
 */
function verifyWorkingDirectory() {
    const expectedDir = path.join(__dirname, '..');
    const currentDir = process.cwd();

    if (currentDir !== expectedDir) {
        console.error('❌ Error: Script must be run from the packages/sdk directory');
        console.error(`Current directory: ${currentDir}`);
        console.error(`Expected directory: ${expectedDir}`);
        console.error('\nPlease run this script with `yarn workspace @airtable/blocks release`');
        process.exit(1);
    }
}

/**
 * Checks if a git tag with this tagName already exists.
 */
function checkGitTag(tagName) {
    const existingTag = execCommand(`git tag --list ${tagName}`).trim();
    if (existingTag) {
        console.error(`❌ Error: Git tag ${tagName} already exists`);
        process.exit(1);
    }
}

function getNpmOtp(rl) {
    return new Promise(resolve => {
        rl.question('Enter npm one-time password: ', answer => {
            resolve(answer.trim());
        });
    });
}

async function main() {
    let originalVersion = null;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    try {
        console.log('Checking prerequisites...');
        verifyWorkingDirectory();
        checkMainBranch();
        checkUncommittedChanges();
        checkRemoteSync();

        console.log('Building and testing...');
        execCommand('yarn build');
        execCommand('yarn test');
        execCommand('rm -rf dist/types/{stories,test}');

        const versionString = createVersionString();
        const confirmed = await promptUser(
            rl,
            `Version string will be: ${versionString}\nDoes this look good? (y/n): `,
        );
        if (!confirmed) {
            console.log('Release cancelled by user');
            process.exit(0);
        }

        const gitTagName = `@airtable/blocks@${versionString}`;
        checkGitTag(gitTagName);

        verifyPackageJsonModification(versionString);

        originalVersion = updatePackageJsonVersion(versionString);

        const npmRegistry = 'https://registry.npmjs.org/';
        const npmTagName = 'interface-alpha-next';
        console.log('Performing dry run of npm publish...');
        const dryRunOutput = execCommand(
            `npm publish --dry-run --tag ${npmTagName} --registry ${npmRegistry}`,
        );
        console.log('\nDry run output:');
        console.log(dryRunOutput);

        const publishConfirmed = await promptUser(rl, 'Does the dry run output look good? (y/n): ');
        if (!publishConfirmed) {
            console.log('Publish cancelled by user');
            restorePackageJsonVersion(originalVersion);
            process.exit(0);
        }

        const otp = await getNpmOtp(rl);

        console.log('Publishing to NPM...');
        execCommand(`npm publish --tag ${npmTagName} --registry ${npmRegistry} --otp ${otp}`);
        console.log(`✅ Published to NPM with ${npmTagName} tag`);

        restorePackageJsonVersion(originalVersion);

        console.log('Creating and pushing git tag...');
        execCommand(`git tag ${gitTagName}`);
        execCommand(`git push origin tag ${gitTagName}`);
        console.log(`✅ Created and pushed git tag @airtable/blocks@${versionString}`);

        console.log('** IMPORTANT **');
        console.log(
            `Verify that this version is good. Once you are satisfied that it should be released to customers, manually run \`npm dist-tag add @airtable/blocks@${versionString} interface-alpha\``,
        );
    } catch (error) {
        console.error('Error during release process:', error);
        if (originalVersion) {
            restorePackageJsonVersion(originalVersion);
        }
        process.exit(1);
    } finally {
        rl.close();
    }
}

main();
