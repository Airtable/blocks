const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const minimatch = require('minimatch');
const strip = require('@airtable-blocks-internal/strip-comments');
const git = require('./git');

function createShouldSyncFilePath(config) {
    const matchers = [];
    for (const pattern of config.global) {
        matchers.push(new minimatch.Minimatch(pattern, {dot: true}));
    }

    return filePath => {
        for (const matcher of matchers) {
            if (matcher.match(filePath)) {
                return true;
            }
        }
        return false;
    };
}

async function stripLineCommentsAsync(destinationPath) {
    // Only apply this transformation to javascript and JSON files
    if (!['.tsx', '.ts', '.jsx', '.js', '.json'].includes(path.extname(destinationPath))) {
        return;
    }
    // Strip only line comments (keep block comments). Line comments can also be kept if
    // they are marked as protected (eg: //! this is a protected comment).
    const fileContents = await fs.readFile(destinationPath, {encoding: 'utf-8'});
    const fileContentsWithoutLineComments = strip(fileContents, {
        line: true,
        block: false,
        keepProtected: true,
    });
    await fs.writeFile(destinationPath, fileContentsWithoutLineComments);
}

async function copyFilesBetweenReposAsync(
    sourcePath,
    destinationPath,
    shouldSyncFilePath,
    shouldStripLineComments,
) {
    const allFilePathsInSource = await git.lsFilesAsync(sourcePath);
    const allFilePathsInDest = await git.lsFilesAsync(destinationPath);

    // copy over files
    for (const filePath of allFilePathsInSource) {
        if (shouldSyncFilePath(filePath)) {
            console.log(`  COPY ${filePath}`);
            await fs.mkdir(path.join(destinationPath, path.dirname(filePath)), {
                recursive: true,
            });
            await fs.copyFile(
                path.join(sourcePath, filePath),
                path.join(destinationPath, filePath),
            );
            if (shouldStripLineComments) {
                await stripLineCommentsAsync(path.join(destinationPath, filePath));
            }
        }
    }

    // delete old files
    for (const filePath of allFilePathsInDest) {
        const stat = await fs.stat(path.join(destinationPath, filePath));
        if (
            stat.isFile() &&
            shouldSyncFilePath(filePath) &&
            !allFilePathsInSource.includes(filePath)
        ) {
            console.log(`  DELETE ${filePath}`);
            await fs.unlink(path.join(destinationPath, filePath));
        }
    }
}

async function createMirrorRepoAsync(config, sourcePath, destinationPath, tagFilter, isDryRun) {
    await fs.mkdir(destinationPath);
    await git.initAsync(destinationPath);
    const tmpSourcePath = await fs.mkdtemp(path.join(os.tmpdir(), 'git-mirror'));
    await git.cloneAsync(sourcePath, tmpSourcePath);

    const allTags = [];
    const allowedTags = (tagFilter || '').split(',');
    for (const tagName of await git.listTagsAsync(tmpSourcePath)) {
        if (tagFilter && !allowedTags.some(allowedTag => tagName.includes(allowedTag))) {
            continue;
        }
        allTags.push(await git.getTagInfoAsync(tmpSourcePath, tagName));
    }
    allTags.sort((a, b) => a.date - b.date);

    const shouldSyncFilePath = createShouldSyncFilePath(config, true);
    for (const tag of allTags) {
        console.log(`Copying ${tag.name}`);
        await git.checkoutHardAsync(tmpSourcePath, tag.hash);
        await copyFilesBetweenReposAsync(
            path.join(tmpSourcePath, config.subdirectory || ''), // only copy subdirectory files
            destinationPath,
            shouldSyncFilePath,
            config.shouldStripLineComments,
        );
        if (isDryRun) {
            console.log(await git.statusAsync(tmpDestinationPath));
        } else {
            await git.commitAndTagAsync(
                destinationPath,
                tag.name,
                config.authorName,
                config.authorEmail,
                tag.date,
            );
        }
    }
}

async function syncScopedTagBetweenReposAsync(
    config,
    sourcePath,
    destinationPath,
    tagName,
    isDryRun,
) {
    console.log('Creating working source copy...');
    const tmpSourcePath = await fs.mkdtemp(path.join(os.tmpdir(), 'git-mirror'));
    await git.cloneAsync(sourcePath, tmpSourcePath);

    console.log('Creating working destination copy...');
    const tmpDestinationPath = await fs.mkdtemp(path.join(os.tmpdir(), 'git-mirror'));
    await git.cloneAsync(destinationPath, tmpDestinationPath);

    const shouldSyncFilePath = createShouldSyncFilePath(config, false);
    console.log('Copying files...');
    await copyFilesBetweenReposAsync(
        path.join(tmpSourcePath, config.subdirectory || ''), // only sync subdirectory files
        tmpDestinationPath,
        shouldSyncFilePath,
        config.shouldStripLineComments,
    );

    if (isDryRun) {
        console.log(await git.statusAsync(tmpDestinationPath));
        console.log(await git.diffAsync(tmpDestinationPath));
    } else {
        // In the dry run case, we treat the current working tree as what "will be released".
        // In the non-dry run case, check out the tag created by release-it during `yarn release`.
        // Note that this creates some room for discrepancy between what is compared for
        // the dry run and what is actually released, but if you use `yarn release` as
        // described in the run doc, they will always match.
        const tag = await git.getTagInfoAsync(tmpSourcePath, tagName);
        await git.checkoutAsync(tmpSourcePath, tag.hash);
        await git.commitAndTagAsync(
            tmpDestinationPath,
            tag.name,
            config.authorName,
            config.authorEmail,
            tag.date,
        );

        console.log('Pushing changes...');
        await git.pushAsync(tmpDestinationPath, config.branch);
    }

    console.log('Done!');
}

async function runAsync() {
    let args = process.argv.slice(2);
    let isDryRun = false;
    const dryRunIndex = args.indexOf('--dryRun');
    if (dryRunIndex !== -1) {
        isDryRun = true;
        args = args.slice(0, dryRunIndex).concat(args.slice(dryRunIndex + 1));
    }
    const command = args[0];

    const sourcePath = await git.getTopLevelAsync(process.cwd());
    let config;
    try {
        config = JSON.parse(await fs.readFile(path.join(process.cwd(), 'git-mirror.json')));
    } catch {
        throw new Error('Could not find git-mirror.json config file in the current directory');
    }

    if (command === 'create') {
        const destinationPath = args[1];
        const tagFilter = args[2];
        if (!destinationPath) {
            throw new Error(
                'Must provide 2nd arg for destination: git-mirror create /path/to/dest',
            );
        }

        await createMirrorRepoAsync(config, sourcePath, destinationPath, tagFilter, isDryRun);
    } else if (command === 'sync') {
        const tag = args[1];
        if (!tag && !isDryRun) {
            throw new Error('Must provide tag arg to sync: git-mirror sync <tag>');
        }

        await syncScopedTagBetweenReposAsync(config, sourcePath, config.remote, tag, isDryRun);
    } else {
        throw new Error('Must provide 1st arg: git-mirror create|sync');
    }
}

runAsync()
    .then(() => {
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
