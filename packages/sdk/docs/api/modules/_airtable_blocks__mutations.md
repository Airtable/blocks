[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks: mutations](_airtable_blocks__mutations.md)

# External module: @airtable/blocks: mutations

## Index

### Interfaces

-   [SuccessfulPermissionCheckResult](_airtable_blocks__mutations.md#successfulpermissioncheckresult)
-   [UnsuccessfulPermissionCheckResult](_airtable_blocks__mutations.md#unsuccessfulpermissioncheckresult)

### Type aliases

-   [PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)

## Interfaces

### SuccessfulPermissionCheckResult

• **SuccessfulPermissionCheckResult**:

_Defined in
[src/types/mutations.ts:103](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/mutations.ts#L103)_

### hasPermission

• **hasPermission**: _true_

_Defined in
[src/types/mutations.ts:105](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/mutations.ts#L105)_

---

### UnsuccessfulPermissionCheckResult

• **UnsuccessfulPermissionCheckResult**:

_Defined in
[src/types/mutations.ts:109](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/mutations.ts#L109)_

### hasPermission

• **hasPermission**: _false_

_Defined in
[src/types/mutations.ts:111](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/mutations.ts#L111)_

### reasonDisplayString

• **reasonDisplayString**: _string_

_Defined in
[src/types/mutations.ts:117](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/mutations.ts#L117)_

A string explaining why the action is not permitted. These strings should only be used to show to
the user; you should not rely on the format of the string as it may change without notice.

## Type aliases

### PermissionCheckResult

Ƭ **PermissionCheckResult**:
_[SuccessfulPermissionCheckResult](_airtable_blocks__mutations.md#successfulpermissioncheckresult) |
[UnsuccessfulPermissionCheckResult](_airtable_blocks__mutations.md#unsuccessfulpermissioncheckresult)_

_Defined in
[src/types/mutations.ts:121](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/mutations.ts#L121)_

Indicates whether the user has permission to perform a particular action, and if not, why.
