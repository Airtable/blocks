import {
    initializeBlock,
    useGlobalConfig,
    useBase,
    Box,
    Heading,
    CollaboratorToken,
    Text,
    TextButton,
    useSession,
    colors,
    colorUtils,
    Button,
    SelectButtonsSynced,
    ViewportConstraint,
} from '@airtable/blocks/ui';
import {globalConfig as globalConfigType} from '@airtable/blocks';
import React, {useState, useEffect, ReactElement} from 'react';
import {CollaboratorData} from '@airtable/blocks/dist/types/src/types/collaborator';

type GlobalConfig = typeof globalConfigType;

enum Stage {
    TIMER = 'timer',
    VOTING = 'voting',
    RESULTS = 'results',
}

enum Vote {
    NOT_VOTED = 'notVoted',
    YES = 'yes',
    PASS = 'pass',
    NO = 'no',
}

const isEnumValue = (enumObj: {[key: string]: string}, valueToCheck: string): boolean => {
    for (const key in enumObj) {
        if (enumObj[key] === valueToCheck) {
            return true;
        }
    }
    return false;
};

const entries = <Obj extends object>(obj: Obj): Array<[keyof Obj, Obj[keyof Obj]]> => {
    return Object.entries(obj);
};

const compact = <T extends any>(array: ReadonlyArray<T | null | undefined>): Array<T> => {
    const result = [];
    for (const item of array) {
        if (item !== null && item !== undefined) {
            result.push(item);
        }
    }
    return result;
};

const getString = (globalConfig: GlobalConfig, key: string | Array<string>): string | null => {
    const value = globalConfig.get(key);
    return typeof value === 'string' ? value : null;
};

const getNumber = (globalConfig: GlobalConfig, key: string | Array<string>): number | null => {
    const value = globalConfig.get(key);
    return typeof value === 'number' ? value : null;
};

const useNow = (refreshInterval: number): number => {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(Date.now());
        }, refreshInterval);

        return (): void => {
            clearInterval(intervalId);
        };
    }, [refreshInterval]);

    return now;
};

const TopBar = ({
    moderator,
    onTakeOver,
    isModerator,
    hasPermissionToParticipate,
}: {
    moderator: CollaboratorData | null;
    onTakeOver: () => void;
    isModerator: boolean;
    hasPermissionToParticipate: boolean;
}): ReactElement => (
    <Box padding={2} borderBottom="thick">
        <Box padding={1} display="flex" flex="0 0 auto" alignItems="center">
            <Text size="large" paddingRight={1}>
                Moderator:
            </Text>
            {moderator ? (
                <CollaboratorToken collaborator={moderator} />
            ) : (
                <Text size="large">no one</Text>
            )}
            {isModerator ? null : (
                <TextButton
                    marginLeft="auto"
                    onClick={onTakeOver}
                    disabled={!hasPermissionToParticipate}
                >
                    Take over as moderator
                </TextButton>
            )}
        </Box>
        {isModerator && !hasPermissionToParticipate ? (
            <Box paddingTop={1}>
                <Text>
                    You need &quot;Editor&quot; or &quot;Creator&quot; permissions to moderate.
                </Text>
            </Box>
        ) : null}
    </Box>
);

const TimerStage = ({
    globalConfig,
    isModerator,
    hasPermissionToParticipate,
}: {
    globalConfig: GlobalConfig;
    isModerator: boolean;
    hasPermissionToParticipate: boolean;
}): ReactElement => {
    const now = useNow(1000);
    const timerEnd = Math.max(now, getNumber(globalConfig, 'timerEnd') ?? now);
    const millisecondsRemaining = Math.max(0, timerEnd - now);
    const secondsRemaining = Math.round(millisecondsRemaining / 1000);

    const addTime = (seconds: number): void => {
        globalConfig.setAsync('timerEnd', timerEnd + seconds * 1000);
    };
    const resetTime = (): void => {
        globalConfig.setAsync('timerEnd', 0);
    };

    const goToVoting = (): void => {
        globalConfig.setAsync('stage', Stage.VOTING);
        globalConfig.setAsync('votes', {});
    };

    let remainingUnit;
    let remainingAmount;
    let timerColor: string = colors.GREEN_BRIGHT;
    let isDone = false;
    if (secondsRemaining > 60) {
        remainingUnit = 'minute';
        remainingAmount = Math.round(secondsRemaining / 60);
    } else {
        remainingUnit = 'second';
        remainingAmount = secondsRemaining;

        if (secondsRemaining === 0) {
            isDone = true;
            timerColor = colors.GRAY;
        }
    }

    return (
        <>
            <Box
                display="flex"
                flex="1 1 auto"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
            >
                {isDone ? (
                    <Heading size="xlarge" textAlign="center">
                        Time&apos;s up!
                    </Heading>
                ) : (
                    <>
                        <Heading
                            textAlign="center"
                            textColor={colorUtils.getHexForColor(timerColor)}
                            style={{fontSize: '140px', lineHeight: '140px'}}
                            margin={0}
                        >
                            {String(remainingAmount)}
                        </Heading>
                        <Heading
                            variant="caps"
                            textAlign="center"
                            textColor={colorUtils.getHexForColor(timerColor)}
                        >
                            {remainingUnit}
                            {remainingAmount === 1 ? '' : 's'}
                        </Heading>
                    </>
                )}
            </Box>
            {isModerator && hasPermissionToParticipate && (
                <Box
                    borderTop="thick"
                    flex="0 0 auto"
                    padding={2}
                    display="flex"
                    alignItems="center"
                >
                    <Button marginRight={1} onClick={(): void => addTime(30)}>
                        +30s
                    </Button>
                    <Button marginRight={1} onClick={(): void => addTime(60)}>
                        +1m
                    </Button>
                    <Button marginRight={1} onClick={(): void => addTime(5 * 60)}>
                        +5m
                    </Button>
                    <Button marginRight={1} onClick={(): void => resetTime()}>
                        Reset
                    </Button>

                    <Button variant="primary" marginLeft="auto" onClick={goToVoting}>
                        Begin voting →
                    </Button>
                </Box>
            )}
        </>
    );
};

const getVote = (globalConfig: GlobalConfig, id: string): Vote | null => {
    const rawVote = getString(globalConfig, ['votes', id]);
    if (rawVote && isEnumValue(Vote, rawVote)) {
        return rawVote as Vote;
    }
    return null;
};

const voteOptions = [
    {value: Vote.NO, label: '👎 No'},
    {value: Vote.PASS, label: '🤷‍♀️ Pass'},
    {value: Vote.YES, label: '👍 Yes'},
];

const getVotes = (globalConfig: GlobalConfig, vote: Vote): Array<string> => {
    return entries(globalConfig.get('votes') as {[id: string]: Vote})
        .filter(([, v]) => v === vote)
        .map(([id]) => String(id));
};

const VotingStage = ({
    globalConfig,
    currentUser,
    isModerator,
    hasPermissionToParticipate,
}: {
    globalConfig: GlobalConfig;
    currentUser: CollaboratorData;
    isModerator: boolean;
    hasPermissionToParticipate: boolean;
}): ReactElement => {
    const base = useBase();
    const ownVote = getVote(globalConfig, currentUser.id);

    useEffect(() => {
        if (ownVote === null && hasPermissionToParticipate) {
            globalConfig.setAsync(['votes', currentUser.id], Vote.NOT_VOTED);
        }
    }, [ownVote, hasPermissionToParticipate, globalConfig, currentUser.id]);

    const yesVotes = getVotes(globalConfig, Vote.YES);
    const passVotes = getVotes(globalConfig, Vote.PASS);
    const noVotes = getVotes(globalConfig, Vote.NO);
    const uncastVotes = getVotes(globalConfig, Vote.NOT_VOTED);
    const totalCastVotes = yesVotes.length + passVotes.length + noVotes.length;
    const totalVotes = totalCastVotes + uncastVotes.length;

    const goToTimer = (): void => {
        globalConfig.setAsync('stage', Stage.TIMER);
    };

    const goToResults = (): void => {
        globalConfig.setAsync('stage', Stage.RESULTS);
    };

    return (
        <>
            <Box
                display="flex"
                flex="1 1 auto"
                justifyContent="flex-start"
                flexDirection="column"
                overflowY="auto"
                paddingTop={3}
            >
                <Box maxHeight="100%">
                    <Heading textAlign="center" marginBottom={3} paddingX={4}>
                        Should we continue discussing this&nbsp;topic?
                    </Heading>
                    {!hasPermissionToParticipate ? (
                        <Box textAlign="center" marginBottom={2}>
                            You need &quot;Editor&quot; or &quot;Creator&quot; permission in this
                            base to vote.
                        </Box>
                    ) : null}
                    <Box paddingX={4}>
                        <SelectButtonsSynced
                            globalConfigKey={['votes', currentUser.id]}
                            options={voteOptions}
                            size="large"
                        />
                    </Box>
                    <Heading textAlign="center" size="small" textColor="light" marginTop={2}>
                        {totalCastVotes}/{totalVotes} votes cast
                    </Heading>

                    {uncastVotes.length > 0 && (
                        <Box marginTop={2} paddingX={3}>
                            <Heading
                                size="xsmall"
                                textColor="light"
                                variant="caps"
                                textAlign="center"
                            >
                                Waiting for:
                            </Heading>
                            <Box textAlign="center">
                                {compact(
                                    uncastVotes.map(id => base.getCollaboratorByIdIfExists(id)),
                                ).map(collaborator => (
                                    <CollaboratorToken
                                        key={collaborator.id}
                                        collaborator={collaborator}
                                        marginX={1}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
            {isModerator && hasPermissionToParticipate && (
                <Box
                    borderTop="thick"
                    flex="0 0 auto"
                    padding={2}
                    display="flex"
                    alignItems="center"
                >
                    <Button marginRight="auto" onClick={goToTimer}>
                        ← Timer
                    </Button>
                    <Button variant="primary" marginLeft="auto" onClick={goToResults}>
                        Results →
                    </Button>
                </Box>
            )}
        </>
    );
};

const ResultsStage = ({
    globalConfig,
    isModerator,
    hasPermissionToParticipate,
}: {
    globalConfig: GlobalConfig;
    isModerator: boolean;
    hasPermissionToParticipate: boolean;
}): ReactElement => {
    const yesVotes = getVotes(globalConfig, Vote.YES);
    const passVotes = getVotes(globalConfig, Vote.PASS);
    const noVotes = getVotes(globalConfig, Vote.NO);
    const uncastVotes = getVotes(globalConfig, Vote.NOT_VOTED);
    const maxVotes = Math.max(
        yesVotes.length,
        noVotes.length,
        passVotes.length + uncastVotes.length,
    );
    const barColor = colorUtils.getHexForColor(colors.BLUE);

    const goToVoting = (): void => {
        globalConfig.setAsync('stage', Stage.VOTING);
    };
    const goToTimer = (): void => {
        globalConfig.setAsync('stage', Stage.TIMER);
        globalConfig.setAsync('timerEnd', 0);
    };

    return (
        <>
            <Box display="flex" flex="1 1 auto" justifyContent="center">
                <Box
                    margin={3}
                    display="flex"
                    alignItems="stretch"
                    justifyContent="center"
                    flexWrap="nowrap"
                >
                    <Box flexBasis="33%">
                        <Box
                            height="80%"
                            padding={2}
                            display="flex"
                            justifyContent="stretch"
                            alignItems="flex-end"
                        >
                            <Box
                                height={`${Math.round((100 * noVotes.length) / maxVotes)}%`}
                                width="100%"
                                backgroundColor={barColor}
                                borderBottom={`4px solid ${barColor}`}
                            />
                        </Box>
                        <Heading size="small" textAlign="center" paddingX={3}>
                            👎&nbsp;No
                        </Heading>
                        <Heading size="small" textAlign="center" textColor="light">
                            {noVotes.length}
                        </Heading>
                    </Box>
                    <Box flexBasis="33%">
                        <Box
                            height="80%"
                            padding={2}
                            display="flex"
                            justifyContent="stretch"
                            alignItems="flex-end"
                        >
                            <Box
                                height={`${Math.round(
                                    (100 * (passVotes.length + uncastVotes.length)) / maxVotes,
                                )}%`}
                                width="100%"
                                backgroundColor={barColor}
                                borderBottom={`4px solid ${barColor}`}
                            />
                        </Box>
                        <Heading size="small" textAlign="center" paddingX={3}>
                            🤷‍♀️&nbsp;Pass
                        </Heading>
                        <Heading size="small" textAlign="center" textColor="light">
                            {passVotes.length + uncastVotes.length}
                        </Heading>
                    </Box>
                    <Box flexBasis="33%">
                        <Box
                            height="80%"
                            padding={2}
                            display="flex"
                            justifyContent="stretch"
                            alignItems="flex-end"
                        >
                            <Box
                                height={`${Math.round((100 * yesVotes.length) / maxVotes)}%`}
                                width="100%"
                                backgroundColor={barColor}
                                borderBottom={`4px solid ${barColor}`}
                            />
                        </Box>
                        <Heading size="small" textAlign="center" paddingX={3}>
                            👍&nbsp;Yes
                        </Heading>
                        <Heading size="small" textAlign="center" textColor="light">
                            {yesVotes.length}
                        </Heading>
                    </Box>
                </Box>
            </Box>
            {isModerator && hasPermissionToParticipate && (
                <Box
                    borderTop="thick"
                    flex="0 0 auto"
                    padding={2}
                    display="flex"
                    alignItems="center"
                >
                    <Button marginRight="auto" onClick={goToVoting}>
                        ← Vote
                    </Button>
                    <Button variant="primary" marginLeft="auto" onClick={goToTimer}>
                        Timer →
                    </Button>
                </Box>
            )}
        </>
    );
};

const DoesNotSupportShares = (): ReactElement => (
    <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        display="flex"
        flexDirection="column"
        justifyContent="center"
    >
        <Box textAlign="center">This app is not supported in shares.</Box>
    </Box>
);

function MeetingModeratorApp(): ReactElement {
    const globalConfig = useGlobalConfig();
    const base = useBase();
    const session = useSession();
    const currentUser = session.currentUser;
    if (!currentUser) {
        return <DoesNotSupportShares />;
    }

    const moderatorId = getString(globalConfig, 'moderatorId');
    const moderator = moderatorId ? base.getCollaboratorByIdIfExists(moderatorId) : null;

    const rawStage = getString(globalConfig, 'stage');
    const stage = rawStage && isEnumValue(Stage, rawStage) ? (rawStage as Stage) : Stage.TIMER;

    const isModerator = moderator === currentUser;
    const hasPermissionToParticipate = globalConfig.hasPermissionToSet();

    const onTakeOver = (): void => {
        globalConfig.setAsync('moderatorId', currentUser.id);
    };

    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            flexDirection="column"
        >
            <ViewportConstraint minSize={{width: 370, height: 280}} />
            <TopBar
                moderator={moderator}
                onTakeOver={onTakeOver}
                isModerator={isModerator}
                hasPermissionToParticipate={hasPermissionToParticipate}
            />
            {stage === Stage.TIMER ? (
                <TimerStage
                    globalConfig={globalConfig}
                    isModerator={isModerator}
                    hasPermissionToParticipate={hasPermissionToParticipate}
                />
            ) : stage === Stage.VOTING ? (
                <VotingStage
                    globalConfig={globalConfig}
                    currentUser={currentUser}
                    isModerator={isModerator}
                    hasPermissionToParticipate={hasPermissionToParticipate}
                />
            ) : stage === Stage.RESULTS ? (
                <ResultsStage
                    globalConfig={globalConfig}
                    isModerator={isModerator}
                    hasPermissionToParticipate={hasPermissionToParticipate}
                />
            ) : null}
        </Box>
    );
}

initializeBlock(() => <MeetingModeratorApp />);
