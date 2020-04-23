/** @module @airtable/blocks/ui: CollaboratorToken */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {CollaboratorData} from '../types/collaborator';
import Box from './box';
import Text from './text';
import {baymax} from './baymax_utils';
import useStyledSystem from './use_styled_system';
import {
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    margin,
    marginPropTypes,
    MarginProps,
} from './system';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import useBase from './use_base';

const UNKNOWN_PROFILE_PIC_URL =
    'https://static.airtable.com/images/userIcons/user_icon_unknown.png';

/**
 * Style props for the {@link CollaboratorToken} component. Accepts:
 * * {@link FlexItemSetProps}
 * * {@link MarginProps}
 * * {@link PositionSetProps}
 *
 * @noInheritDoc
 */
interface CollaboratorTokenStyleProps extends FlexItemSetProps, PositionSetProps, MarginProps {}

const styleParser = compose(flexItemSet, positionSet, margin);

export const collaboratorTokenStylePropTypes = {
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

/**
 * Props for the {@link CollaboratorToken} component. Also accepts:
 * * {@link CollaboratorTokenStyleProps}
 *
 * @noInheritDoc
 * @docsPath UI/components/CollaboratorToken
 */
interface CollaboratorTokenProps extends CollaboratorTokenStyleProps, TooltipAnchorProps {
    /** An object representing a collaborator. You should not create these objects from scratch, but should instead grab them from base data. */
    collaborator: Partial<CollaboratorData>;
    /** Additional class names to apply to the collaborator token. */
    className?: string;
    /** Additional styles to apply to the collaborator token. */
    style?: React.CSSProperties;
}

/**
 * A version of `Collaborator` that doesn't connect to base. Not part of the public API.
 *
 * @hidden
 */
const StaticCollaboratorToken = (props: CollaboratorTokenProps & {isActive?: boolean}) => {
    const {
        collaborator,
        isActive = true,
        onMouseEnter,
        onMouseLeave,
        onClick,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasOnClick,
        className,
        style,
        ...styleProps
    } = props;
    const classNameForStyledProps = useStyledSystem<CollaboratorTokenStyleProps>(
        styleProps,
        styleParser,
    );

    const userName = collaborator.name || collaborator.email || 'Unknown';
    const profilePicUrl = collaborator.profilePicUrl || UNKNOWN_PROFILE_PIC_URL;

    return (
        <Box
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className={cx(baymax('truncate print-color-exact'), classNameForStyledProps, className)}
            style={style}
            alignItems="center"
            display="inline-flex"
            opacity={isActive ? 1 : 0.5}
        >
            {profilePicUrl && (
                <Box
                    className={baymax('background-cover background-center')}
                    style={{backgroundImage: `url("${profilePicUrl}")`}}
                    border="1px solid #eee"
                    width="22px"
                    height="22px"
                    borderRadius="circle"
                    zIndex={1}
                    flex="none"
                    backgroundColor="grayLight2"
                />
            )}
            <Text
                className={baymax('truncate')}
                paddingRight={2}
                paddingLeft={3}
                textColor="dark"
                display="inline-flex"
                borderRadius="circle"
                alignItems="center"
                flex="none"
                backgroundColor="grayLight2"
                marginLeft="-12px"
                lineHeight={1.4}
            >
                {userName}
            </Text>
        </Box>
    );
};

/**
 * A component that shows a single collaborator in a small token, to be displayed inline or in a list of choices.
 *
 * [[ Story id="collaboratortoken--example" title="Collaborator token example" ]]
 *
 * @component
 * @docsPath UI/components/CollaboratorToken
 */
const CollaboratorToken = (props: CollaboratorTokenProps) => {
    const base = useBase();

    const activeCollaborators = base.activeCollaborators;
    const isActive = activeCollaborators.some(activeCollaborator => {
        return activeCollaborator.id === props.collaborator.id;
    });

    return <StaticCollaboratorToken {...props} isActive={isActive} />;
};

CollaboratorToken.propTypes = {
    collaborator: PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        name: PropTypes.string,
        profilePicUrl: PropTypes.string,
        status: PropTypes.string,
    }).isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    ...tooltipAnchorPropTypes,
    ...collaboratorTokenStylePropTypes,
};

CollaboratorToken.Static = StaticCollaboratorToken;

export default CollaboratorToken;
