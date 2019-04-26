// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const React = require('./react');
const PropTypes = require('prop-types');
const Popover = require('./popover');
const classNames = require('classnames');
const warning = require('../warning');

import type {PopoverPlacementX, PopoverPlacementY, FitInWindowMode} from './popover';

const FADE_IN_ANIMATION_DURATION = 150;

type TooltipProps = {
    children: React$Element<*>,
    // TODO(jb): remove renderContent in favor of just content.
    renderContent?: () => React$Element<*>,
    content?: string | (() => React$Element<*>),
    placementX?: PopoverPlacementX,
    placementY?: PopoverPlacementY,
    placementOffsetX?: number,
    placementOffsetY?: number,
    fitInWindowMode?: FitInWindowMode,
    shouldHideTooltipOnClick?: boolean,
    // deprecated in favour of disabled
    isDisabled?: boolean,
    disabled?: boolean,
    className?: string,
    style?: Object,
};
type TooltipState = {|
    isShowingTooltip: boolean,
|};

/** */
class Tooltip extends React.Component<TooltipProps, TooltipState> {
    static placements = Popover.placements;
    static fitInWindowModes = Popover.fitInWindowModes;

    static propTypes = {
        children: PropTypes.element.isRequired,
        // TODO(jb): remove renderContent in favor of just content.
        renderContent: PropTypes.func,
        content: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        placementX: PropTypes.oneOf([
            Popover.placements.LEFT,
            Popover.placements.CENTER,
            Popover.placements.RIGHT,
        ]),
        placementY: PropTypes.oneOf([
            Popover.placements.TOP,
            Popover.placements.CENTER,
            Popover.placements.BOTTOM,
        ]),
        placementOffsetX: PropTypes.number,
        placementOffsetY: PropTypes.number,
        fitInWindowMode: PropTypes.oneOf(u.values(Popover.fitInWindowModes)),
        shouldHideTooltipOnClick: PropTypes.bool,
        // deprecated in favour of disabled
        isDisabled: PropTypes.bool,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
    };
    static defaultProps = {
        placementX: Popover.placements.RIGHT,
        placementY: Popover.placements.CENTER,
        placementOffsetX: 12,
        placementOffsetY: 0,
        fitInWindowMode: Popover.fitInWindowModes.FLIP,
    };
    props: TooltipProps;
    _onMouseEnter: (SyntheticMouseEvent<>) => void;
    _onMouseLeave: (SyntheticMouseEvent<>) => void;
    _onClick: (SyntheticMouseEvent<>) => void;
    _showTooltip: () => void;
    _hideTooltip: () => void;
    _renderTooltipContent: () => React$Element<*>;
    constructor(props: TooltipProps) {
        super(props);

        this.state = {
            isShowingTooltip: false,
        };

        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
        this._onClick = this._onClick.bind(this);
        this._showTooltip = this._showTooltip.bind(this);
        this._hideTooltip = this._hideTooltip.bind(this);
        this._renderTooltipContent = this._renderTooltipContent.bind(this);
    }
    _onMouseEnter(e: SyntheticMouseEvent<>) {
        this._showTooltip();
        const originalOnMouseEnter = this.props.children.props.onMouseEnter;
        if (originalOnMouseEnter) {
            originalOnMouseEnter(e);
        }
    }
    _onMouseLeave(e: SyntheticMouseEvent<>) {
        this._hideTooltip();
        const originalOnMouseLeave = this.props.children.props.onMouseLeave;
        if (originalOnMouseLeave) {
            originalOnMouseLeave(e);
        }
    }
    _onClick(e: SyntheticMouseEvent<>) {
        if (this.props.shouldHideTooltipOnClick) {
            this._hideTooltip();
        }
        const originalOnClick = this.props.children.props.onClick;
        if (originalOnClick) {
            originalOnClick(e);
        }
    }
    _showTooltip() {
        this.setState({isShowingTooltip: true});
    }
    _hideTooltip() {
        this.setState({isShowingTooltip: false});
    }
    _renderTooltipContent() {
        const {renderContent, content, className, style} = this.props;
        let renderedContent;
        let isContentAFunction;
        if (renderContent) {
            renderedContent = renderContent();
            isContentAFunction = true;
        } else if (typeof content === 'function') {
            renderedContent = content();
            isContentAFunction = true;
        } else {
            renderedContent = content;
            isContentAFunction = false;
        }
        return (
            <div
                className={classNames(
                    'relative white rounded stroked1 overflow-hidden',
                    {
                        // Add padding only when using content.
                        p1: !isContentAFunction,
                    },
                    className,
                )}
                style={style}
            >
                {renderedContent}
            </div>
        );
    }
    _getDisabled() {
        if (this.props.isDisabled !== undefined) {
            warning('[UI.Tooltip] the `isDisabled` prop is deprecated - use `disabled` instead');
            return this.props.isDisabled;
        }
        return this.props.disabled;
    }
    render() {
        const {children, renderContent, content} = this.props;
        const disabled = this._getDisabled();

        if (disabled || (!renderContent && !content)) {
            // The tooltip will never show, so just return the children.
            return children;
        }

        const popoverAnchor = React.cloneElement(children, {
            onMouseEnter: this._onMouseEnter,
            onMouseLeave: this._onMouseLeave,
            onClick: this._onClick,
        });

        return (
            <Popover
                renderContent={this._renderTooltipContent}
                placementX={this.props.placementX}
                placementY={this.props.placementY}
                placementOffsetX={this.props.placementOffsetX}
                placementOffsetY={this.props.placementOffsetY}
                fitInWindowMode={this.props.fitInWindowMode}
                isOpen={this.state.isShowingTooltip}
                backgroundStyle={{
                    // Override the background style of the popover so that it doesn't
                    // take up any space. If we don't do this, the mouseEnter and mouseLeave
                    // handlers won't work, since showing the Popover would place a div over
                    // the content that we care about.
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    animationName: 'opacityFadeIn',
                    animationDuration: `${FADE_IN_ANIMATION_DURATION}ms`,
                    animationTimingFunction: 'ease-out',
                }}
            >
                {popoverAnchor}
            </Popover>
        );
    }
}

module.exports = Tooltip;
