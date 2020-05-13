# JSON Editor Block: Quality Assurance Test Plan

Requirements: the JSON Editor block is installed and running in a Base

Unless otherwise stated, the current user is expected to have "Creator" access privileges over the
Base.

## Scenario 01: Opening a cell in a single-line text field type

-   GIVEN a table with a cell whose field type is "Single line text" and whose content is `1234`
-   WHEN the user selects the cell
-   THEN the value `1234` should be presented in the editor view

## Scenario 02: Opening a cell in a long text field type

-   GIVEN a table with a cell whose field type is "Long text" and whose content is `true`
-   WHEN the user selects the cell
-   THEN the value `true` should be presented in the editor view

## Scenario 03: Opening a cell in an unsupported field type

-   GIVEN a table with a cell whose field type is "Checkbox"
-   WHEN the user selects the cell
-   THEN the block should prompt the user to select a single-line text field or a long text field

## Scenario 04: Reacting to cell modification

-   GIVEN a table with a cell whose field type is "Long text" and whose content is `false`
-   AND the cell has been selected
-   WHEN the user changes the cell value to `987`
-   THEN the value `987` should be presented in the editor view

## Scenario 05: Reacting to cell selection

-   GIVEN a table with a "Long text" field
-   AND two record within that table
-   AND a cell whose field type is "Long text" and whose content is `null`
-   AND a cell whose field type is "Long text" and whose content is `false`
-   AND the first of the two cells has been selected
-   WHEN the user selects the second cell
-   THEN the value `false` should be presented in the editor view

## Scenario 06: Reporting existing syntax errors

-   GIVEN a table with a cell whose field type is "Long text" and whose content is `[[`
-   WHEN the user selects the cell
-   THEN the contents of the cell should be presented in the editor view
-   AND a syntax error should be reported for line 1, column 2

## Scenario 07: Detecting syntax error correction

-   GIVEN a table with a cell whose field type is "Long text" and whose content is `[[`
-   AND the user has selected the cell
-   WHEN the user updates the contents of the editor to contain the text `[[]]`
-   THEN no errors should be reported

## Scenario 08: Editing denied to user with Commenter access

-   GIVEN a user with "Read only" access permissions to the current Base
-   AND a table with a "Long text" field
-   AND a record within that table
-   AND a non-empty value in the cell for the given record and field
-   WHEN the user selects the cell
-   THEN the contents of the cell should be presented in the editor view
-   AND a warning which explains that the user cannot edit the cell should be displayed
-   AND the editor should not respond to input
