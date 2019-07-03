<?php

final class AirtableUnitTestEngine extends ArcanistUnitTestEngine {
    // Ideally, for the test results, we'd use the enum values that are defined in
    // https://secure.phabricator.com/diffusion/ARC/browse/master/src/unit/ArcanistUnitTestResult.php$6
    // However, I couldn't quickly figure out how to import ArcanistUnitTestResult.php, so I just duplicated them here.
    const RESULT_PASS = 'pass';
    const RESULT_FAIL = 'fail';
    const RESULT_SKIP = 'skip';
    const RESULT_BROKEN = 'broken';

    public function getEngineConfigurationName() {
        return 'airtable-test-engine';
    }

    public function shouldEchoTestResults() {
        // Return false so `arc unit` will report print the result of the unit test.
        return false;
    }

    public function run() {
        print("*** Checking if your local commits have been pushed to GitHub\n");
        $cmd = 'git --no-pager log origin/`git branch  | grep "\\*" | cut -d" " -f2`..HEAD 2>&1';
        print("*** Running command: '$cmd'\n");
        exec($cmd, $output, $exitCode);

        $outputString = join('\n', $output);
        $outputLength = strlen($outputString);

        if (count($output) >= 1) {
            print("*** First output line: $output[0]\n");
        }
        print("*** Exit code: $exitCode\n");

        $testResult = self::RESULT_FAIL;
        $message = '';
        if ($exitCode === 0) {
            if ($outputLength === 0) {
                $testResult = self::RESULT_PASS;
                $message = 'GitHub is up-to-date with your branch.';
            } else {
                $testResult = self::RESULT_FAIL;
                $message = 'You must push this branch to GitHub.';
            }
        } else {
            if (preg_match('/unknown revision or path not in the working tree/', $outputString, $matches)) {
                $testResult = self::RESULT_FAIL;
                $message = 'You must push this branch to GitHub.';
            } else {
                $testResult = self::RESULT_BROKEN;
                $message = 'The git command failed for an unexpected reason.';
            }
        }
        $result = new ArcanistUnitTestResult();
        $result->setName('airtable-unit-engine');
        $result->setResult($testResult);
        $result->setUserData($message);
        $results = array($result);

        return $results;
    }
}
