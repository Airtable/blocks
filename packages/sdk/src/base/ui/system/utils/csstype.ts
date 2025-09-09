/** @hidden */ /** */


export interface StandardLonghandProperties<TLength = string | 0> {
    marginBottom?: MarginBottomProperty<TLength>;
    alignContent?: AlignContentProperty;
    alignSelf?: AlignSelfProperty;
    animationDelay?: GlobalsString;
    animationDirection?: AnimationDirectionProperty;
    animationDuration?: GlobalsString;
    animationFillMode?: AnimationFillModeProperty;
    animationIterationCount?: AnimationIterationCountProperty;
    animationName?: AnimationNameProperty;
    animationPlayState?: AnimationPlayStateProperty;
    animationTimingFunction?: AnimationTimingFunctionProperty;
    appearance?: AppearanceProperty;
    backdropFilter?: BackdropFilterProperty;
    backfaceVisibility?: BackfaceVisibilityProperty;
    backgroundAttachment?: BackgroundAttachmentProperty;
    backgroundBlendMode?: BackgroundBlendModeProperty;
    backgroundClip?: BackgroundClipProperty;
    backgroundColor?: BackgroundColorProperty;
    backgroundImage?: BackgroundImageProperty;
    backgroundOrigin?: BackgroundOriginProperty;
    backgroundPosition?: BackgroundPositionProperty<TLength>;
    backgroundPositionX?: BackgroundPositionXProperty<TLength>;
    backgroundPositionY?: BackgroundPositionYProperty<TLength>;
    backgroundRepeat?: BackgroundRepeatProperty;
    backgroundSize?: BackgroundSizeProperty<TLength>;
    blockOverflow?: BlockOverflowProperty;
    blockSize?: BlockSizeProperty<TLength>;
    borderBlockColor?: BorderBlockColorProperty;
    borderBlockEndColor?: BorderBlockEndColorProperty;
    borderBlockEndStyle?: BorderBlockEndStyleProperty;
    borderBlockEndWidth?: BorderBlockEndWidthProperty<TLength>;
    borderBlockStartColor?: BorderBlockStartColorProperty;
    borderBlockStartStyle?: BorderBlockStartStyleProperty;
    borderBlockStartWidth?: BorderBlockStartWidthProperty<TLength>;
    borderBlockStyle?: BorderBlockStyleProperty;
    borderBlockWidth?: BorderBlockWidthProperty<TLength>;
    borderBottomColor?: BorderBottomColorProperty;
    borderBottomLeftRadius?: BorderBottomLeftRadiusProperty<TLength>;
    borderBottomRightRadius?: BorderBottomRightRadiusProperty<TLength>;
    borderBottomStyle?: BorderBottomStyleProperty;
    borderBottomWidth?: BorderBottomWidthProperty<TLength>;
    borderCollapse?: BorderCollapseProperty;
    borderEndEndRadius?: BorderEndEndRadiusProperty<TLength>;
    borderEndStartRadius?: BorderEndStartRadiusProperty<TLength>;
    borderImageOutset?: BorderImageOutsetProperty<TLength>;
    borderImageRepeat?: BorderImageRepeatProperty;
    borderImageSlice?: BorderImageSliceProperty;
    borderImageSource?: BorderImageSourceProperty;
    borderImageWidth?: BorderImageWidthProperty<TLength>;
    borderInlineColor?: BorderInlineColorProperty;
    borderInlineEndColor?: BorderInlineEndColorProperty;
    borderInlineEndStyle?: BorderInlineEndStyleProperty;
    borderInlineEndWidth?: BorderInlineEndWidthProperty<TLength>;
    borderInlineStartColor?: BorderInlineStartColorProperty;
    borderInlineStartStyle?: BorderInlineStartStyleProperty;
    borderInlineStartWidth?: BorderInlineStartWidthProperty<TLength>;
    borderInlineStyle?: BorderInlineStyleProperty;
    borderInlineWidth?: BorderInlineWidthProperty<TLength>;
    borderLeftColor?: BorderLeftColorProperty;
    borderLeftStyle?: BorderLeftStyleProperty;
    borderLeftWidth?: BorderLeftWidthProperty<TLength>;
    borderRightColor?: BorderRightColorProperty;
    borderRightStyle?: BorderRightStyleProperty;
    borderRightWidth?: BorderRightWidthProperty<TLength>;
    borderSpacing?: BorderSpacingProperty<TLength>;
    borderStartEndRadius?: BorderStartEndRadiusProperty<TLength>;
    borderStartStartRadius?: BorderStartStartRadiusProperty<TLength>;
    borderTopColor?: BorderTopColorProperty;
    borderTopLeftRadius?: BorderTopLeftRadiusProperty<TLength>;
    borderTopRightRadius?: BorderTopRightRadiusProperty<TLength>;
    borderTopStyle?: BorderTopStyleProperty;
    borderTopWidth?: BorderTopWidthProperty<TLength>;
    bottom?: BottomProperty<TLength>;
    boxDecorationBreak?: BoxDecorationBreakProperty;
    boxShadow?: BoxShadowProperty;
    boxSizing?: BoxSizingProperty;
    breakAfter?: BreakAfterProperty;
    breakBefore?: BreakBeforeProperty;
    breakInside?: BreakInsideProperty;
    captionSide?: CaptionSideProperty;
    caretColor?: CaretColorProperty;
    clear?: ClearProperty;
    clipPath?: ClipPathProperty;
    color?: ColorProperty;
    colorAdjust?: ColorAdjustProperty;
    columnCount?: ColumnCountProperty;
    columnFill?: ColumnFillProperty;
    columnGap?: ColumnGapProperty<TLength>;
    columnRuleColor?: ColumnRuleColorProperty;
    columnRuleStyle?: ColumnRuleStyleProperty;
    columnRuleWidth?: ColumnRuleWidthProperty<TLength>;
    columnSpan?: ColumnSpanProperty;
    columnWidth?: ColumnWidthProperty<TLength>;
    contain?: ContainProperty;
    content?: ContentProperty;
    counterIncrement?: CounterIncrementProperty;
    counterReset?: CounterResetProperty;
    counterSet?: CounterSetProperty;
    cursor?: CursorProperty;
    direction?: DirectionProperty;
    display?: DisplayProperty;
    emptyCells?: EmptyCellsProperty;
    filter?: FilterProperty;
    flexBasis?: FlexBasisProperty<TLength>;
    flexDirection?: FlexDirectionProperty;
    flexGrow?: GlobalsNumber;
    flexShrink?: GlobalsNumber;
    flexWrap?: FlexWrapProperty;
    float?: FloatProperty;
    fontFamily?: FontFamilyProperty;
    fontFeatureSettings?: FontFeatureSettingsProperty;
    fontKerning?: FontKerningProperty;
    fontLanguageOverride?: FontLanguageOverrideProperty;
    fontOpticalSizing?: FontOpticalSizingProperty;
    fontSize?: FontSizeProperty<TLength>;
    fontSizeAdjust?: FontSizeAdjustProperty;
    fontStretch?: FontStretchProperty;
    fontStyle?: FontStyleProperty;
    fontSynthesis?: FontSynthesisProperty;
    fontVariant?: FontVariantProperty;
    fontVariantCaps?: FontVariantCapsProperty;
    fontVariantEastAsian?: FontVariantEastAsianProperty;
    fontVariantLigatures?: FontVariantLigaturesProperty;
    fontVariantNumeric?: FontVariantNumericProperty;
    fontVariantPosition?: FontVariantPositionProperty;
    fontVariationSettings?: FontVariationSettingsProperty;
    fontWeight?: FontWeightProperty;
    gridAutoColumns?: GridAutoColumnsProperty<TLength>;
    gridAutoFlow?: GridAutoFlowProperty;
    gridAutoRows?: GridAutoRowsProperty<TLength>;
    gridColumnEnd?: GridColumnEndProperty;
    gridColumnStart?: GridColumnStartProperty;
    gridRowEnd?: GridRowEndProperty;
    gridRowStart?: GridRowStartProperty;
    gridTemplateAreas?: GridTemplateAreasProperty;
    gridTemplateColumns?: GridTemplateColumnsProperty<TLength>;
    gridTemplateRows?: GridTemplateRowsProperty<TLength>;
    hangingPunctuation?: HangingPunctuationProperty;
    height?: HeightProperty<TLength>;
    hyphens?: HyphensProperty;
    imageOrientation?: ImageOrientationProperty;
    imageRendering?: ImageRenderingProperty;
    imageResolution?: ImageResolutionProperty;
    initialLetter?: InitialLetterProperty;
    inlineSize?: InlineSizeProperty<TLength>;
    inset?: InsetProperty<TLength>;
    insetBlock?: InsetBlockProperty<TLength>;
    insetBlockEnd?: InsetBlockEndProperty<TLength>;
    insetBlockStart?: InsetBlockStartProperty<TLength>;
    insetInline?: InsetInlineProperty<TLength>;
    insetInlineEnd?: InsetInlineEndProperty<TLength>;
    insetInlineStart?: InsetInlineStartProperty<TLength>;
    isolation?: IsolationProperty;
    justifyContent?: JustifyContentProperty;
    justifyItems?: JustifyItemsProperty;
    justifySelf?: JustifySelfProperty;
    left?: LeftProperty<TLength>;
    letterSpacing?: LetterSpacingProperty<TLength>;
    lineBreak?: LineBreakProperty;
    lineHeight?: LineHeightProperty<TLength>;
    lineHeightStep?: LineHeightStepProperty<TLength>;
    listStyleImage?: ListStyleImageProperty;
    listStylePosition?: ListStylePositionProperty;
    listStyleType?: ListStyleTypeProperty;
    marginBlock?: MarginBlockProperty<TLength>;
    marginBlockEnd?: MarginBlockEndProperty<TLength>;
    marginBlockStart?: MarginBlockStartProperty<TLength>;
    alignItems?: AlignItemsProperty;
    marginInline?: MarginInlineProperty<TLength>;
    marginInlineEnd?: MarginInlineEndProperty<TLength>;
    marginInlineStart?: MarginInlineStartProperty<TLength>;
    marginLeft?: MarginLeftProperty<TLength>;
    marginRight?: MarginRightProperty<TLength>;
    marginTop?: MarginTopProperty<TLength>;
    maskBorderMode?: MaskBorderModeProperty;
    maskBorderOutset?: MaskBorderOutsetProperty<TLength>;
    maskBorderRepeat?: MaskBorderRepeatProperty;
    maskBorderSlice?: MaskBorderSliceProperty;
    maskBorderSource?: MaskBorderSourceProperty;
    maskBorderWidth?: MaskBorderWidthProperty<TLength>;
    maskClip?: MaskClipProperty;
    maskComposite?: MaskCompositeProperty;
    maskImage?: MaskImageProperty;
    maskMode?: MaskModeProperty;
    maskOrigin?: MaskOriginProperty;
    maskPosition?: MaskPositionProperty<TLength>;
    maskRepeat?: MaskRepeatProperty;
    maskSize?: MaskSizeProperty<TLength>;
    maskType?: MaskTypeProperty;
    maxBlockSize?: MaxBlockSizeProperty<TLength>;
    maxHeight?: MaxHeightProperty<TLength>;
    maxInlineSize?: MaxInlineSizeProperty<TLength>;
    maxLines?: MaxLinesProperty;
    maxWidth?: MaxWidthProperty<TLength>;
    minBlockSize?: MinBlockSizeProperty<TLength>;
    minHeight?: MinHeightProperty<TLength>;
    minInlineSize?: MinInlineSizeProperty<TLength>;
    minWidth?: MinWidthProperty<TLength>;
    mixBlendMode?: MixBlendModeProperty;
    motionDistance?: OffsetDistanceProperty<TLength>;
    motionPath?: OffsetPathProperty;
    motionRotation?: OffsetRotateProperty;
    objectFit?: ObjectFitProperty;
    objectPosition?: ObjectPositionProperty<TLength>;
    offsetAnchor?: OffsetAnchorProperty<TLength>;
    offsetDistance?: OffsetDistanceProperty<TLength>;
    offsetPath?: OffsetPathProperty;
    offsetPosition?: OffsetPositionProperty<TLength>;
    offsetRotate?: OffsetRotateProperty;
    offsetRotation?: OffsetRotateProperty;
    opacity?: GlobalsNumber;
    order?: GlobalsNumber;
    orphans?: GlobalsNumber;
    outlineColor?: OutlineColorProperty;
    outlineOffset?: OutlineOffsetProperty<TLength>;
    outlineStyle?: OutlineStyleProperty;
    outlineWidth?: OutlineWidthProperty<TLength>;
    overflow?: OverflowProperty;
    overflowAnchor?: OverflowAnchorProperty;
    overflowBlock?: OverflowBlockProperty;
    overflowClipBox?: OverflowClipBoxProperty;
    overflowInline?: OverflowInlineProperty;
    overflowWrap?: OverflowWrapProperty;
    overflowX?: OverflowXProperty;
    overflowY?: OverflowYProperty;
    overscrollBehavior?: OverscrollBehaviorProperty;
    overscrollBehaviorX?: OverscrollBehaviorXProperty;
    overscrollBehaviorY?: OverscrollBehaviorYProperty;
    paddingBlock?: PaddingBlockProperty<TLength>;
    paddingBlockEnd?: PaddingBlockEndProperty<TLength>;
    paddingBlockStart?: PaddingBlockStartProperty<TLength>;
    paddingBottom?: PaddingBottomProperty<TLength>;
    paddingInline?: PaddingInlineProperty<TLength>;
    paddingInlineEnd?: PaddingInlineEndProperty<TLength>;
    paddingInlineStart?: PaddingInlineStartProperty<TLength>;
    paddingLeft?: PaddingLeftProperty<TLength>;
    paddingRight?: PaddingRightProperty<TLength>;
    paddingTop?: PaddingTopProperty<TLength>;
    pageBreakAfter?: PageBreakAfterProperty;
    pageBreakBefore?: PageBreakBeforeProperty;
    pageBreakInside?: PageBreakInsideProperty;
    paintOrder?: PaintOrderProperty;
    perspective?: PerspectiveProperty<TLength>;
    perspectiveOrigin?: PerspectiveOriginProperty<TLength>;
    placeContent?: PlaceContentProperty;
    pointerEvents?: PointerEventsProperty;
    position?: PositionProperty;
    quotes?: QuotesProperty;
    resize?: ResizeProperty;
    right?: RightProperty<TLength>;
    rotate?: RotateProperty;
    rowGap?: RowGapProperty<TLength>;
    rubyAlign?: RubyAlignProperty;
    rubyMerge?: RubyMergeProperty;
    rubyPosition?: RubyPositionProperty;
    scale?: ScaleProperty;
    scrollBehavior?: ScrollBehaviorProperty;
    scrollMargin?: ScrollMarginProperty<TLength>;
    scrollMarginBlock?: ScrollMarginBlockProperty<TLength>;
    scrollMarginBlockEnd?: ScrollMarginBlockEndProperty<TLength>;
    scrollMarginBlockStart?: ScrollMarginBlockStartProperty<TLength>;
    scrollMarginBottom?: ScrollMarginBottomProperty<TLength>;
    scrollMarginInline?: ScrollMarginInlineProperty<TLength>;
    scrollMarginInlineEnd?: ScrollMarginInlineEndProperty<TLength>;
    scrollMarginInlineStart?: ScrollMarginInlineStartProperty<TLength>;
    scrollMarginLeft?: ScrollMarginLeftProperty<TLength>;
    scrollMarginRight?: ScrollMarginRightProperty<TLength>;
    scrollMarginTop?: ScrollMarginTopProperty<TLength>;
    scrollPadding?: ScrollPaddingProperty<TLength>;
    scrollPaddingBlock?: ScrollPaddingBlockProperty<TLength>;
    scrollPaddingBlockEnd?: ScrollPaddingBlockEndProperty<TLength>;
    scrollPaddingBlockStart?: ScrollPaddingBlockStartProperty<TLength>;
    scrollPaddingBottom?: ScrollPaddingBottomProperty<TLength>;
    scrollPaddingInline?: ScrollPaddingInlineProperty<TLength>;
    scrollPaddingInlineEnd?: ScrollPaddingInlineEndProperty<TLength>;
    scrollPaddingInlineStart?: ScrollPaddingInlineStartProperty<TLength>;
    scrollPaddingLeft?: ScrollPaddingLeftProperty<TLength>;
    scrollPaddingRight?: ScrollPaddingRightProperty<TLength>;
    scrollPaddingTop?: ScrollPaddingTopProperty<TLength>;
    scrollSnapAlign?: ScrollSnapAlignProperty;
    scrollSnapStop?: ScrollSnapStopProperty;
    scrollSnapType?: ScrollSnapTypeProperty;
    scrollbarColor?: ScrollbarColorProperty;
    scrollbarWidth?: ScrollbarWidthProperty;
    shapeImageThreshold?: GlobalsNumber;
    shapeMargin?: ShapeMarginProperty<TLength>;
    shapeOutside?: ShapeOutsideProperty;
    tabSize?: TabSizeProperty<TLength>;
    tableLayout?: TableLayoutProperty;
    textAlign?: TextAlignProperty;
    textAlignLast?: TextAlignLastProperty;
    textCombineUpright?: TextCombineUprightProperty;
    textDecorationColor?: TextDecorationColorProperty;
    textDecorationLine?: TextDecorationLineProperty;
    textDecorationSkip?: TextDecorationSkipProperty;
    textDecorationSkipInk?: TextDecorationSkipInkProperty;
    textDecorationStyle?: TextDecorationStyleProperty;
    textEmphasisColor?: TextEmphasisColorProperty;
    textEmphasisPosition?: GlobalsString;
    textEmphasisStyle?: TextEmphasisStyleProperty;
    textIndent?: TextIndentProperty<TLength>;
    textJustify?: TextJustifyProperty;
    textOrientation?: TextOrientationProperty;
    textOverflow?: TextOverflowProperty;
    textRendering?: TextRenderingProperty;
    textShadow?: TextShadowProperty;
    textSizeAdjust?: TextSizeAdjustProperty;
    textTransform?: TextTransformProperty;
    textUnderlinePosition?: TextUnderlinePositionProperty;
    top?: TopProperty<TLength>;
    touchAction?: TouchActionProperty;
    transform?: TransformProperty;
    transformBox?: TransformBoxProperty;
    transformOrigin?: TransformOriginProperty<TLength>;
    transformStyle?: TransformStyleProperty;
    transitionDelay?: GlobalsString;
    transitionDuration?: GlobalsString;
    transitionProperty?: TransitionPropertyProperty;
    transitionTimingFunction?: TransitionTimingFunctionProperty;
    translate?: TranslateProperty<TLength>;
    unicodeBidi?: UnicodeBidiProperty;
    userSelect?: UserSelectProperty;
    verticalAlign?: VerticalAlignProperty<TLength>;
    visibility?: VisibilityProperty;
    whiteSpace?: WhiteSpaceProperty;
    widows?: GlobalsNumber;
    width?: WidthProperty<TLength>;
    willChange?: WillChangeProperty;
    wordBreak?: WordBreakProperty;
    wordSpacing?: WordSpacingProperty<TLength>;
    wordWrap?: WordWrapProperty;
    writingMode?: WritingModeProperty;
    zIndex?: ZIndexProperty;
    zoom?: ZoomProperty;
}

export interface StandardShorthandProperties<TLength = string | 0> {
    flexFlow?: FlexFlowProperty;
    all?: Globals;
    background?: BackgroundProperty<TLength>;
    border?: BorderProperty<TLength>;
    borderBlock?: BorderBlockProperty<TLength>;
    borderBlockEnd?: BorderBlockEndProperty<TLength>;
    borderBlockStart?: BorderBlockStartProperty<TLength>;
    borderBottom?: BorderBottomProperty<TLength>;
    borderColor?: BorderColorProperty;
    borderImage?: BorderImageProperty;
    borderInline?: BorderInlineProperty<TLength>;
    borderInlineEnd?: BorderInlineEndProperty<TLength>;
    borderInlineStart?: BorderInlineStartProperty<TLength>;
    borderLeft?: BorderLeftProperty<TLength>;
    borderRadius?: BorderRadiusProperty<TLength>;
    borderRight?: BorderRightProperty<TLength>;
    borderStyle?: BorderStyleProperty;
    borderTop?: BorderTopProperty<TLength>;
    borderWidth?: BorderWidthProperty<TLength>;
    columnRule?: ColumnRuleProperty<TLength>;
    columns?: ColumnsProperty<TLength>;
    flex?: FlexProperty<TLength>;
    animation?: AnimationProperty;
    font?: FontProperty;
    gap?: GapProperty<TLength>;
    grid?: GridProperty;
    gridArea?: GridAreaProperty;
    gridColumn?: GridColumnProperty;
    gridRow?: GridRowProperty;
    gridTemplate?: GridTemplateProperty;
    lineClamp?: LineClampProperty;
    listStyle?: ListStyleProperty;
    margin?: MarginProperty<TLength>;
    mask?: MaskProperty<TLength>;
    maskBorder?: MaskBorderProperty;
    motion?: OffsetProperty<TLength>;
    offset?: OffsetProperty<TLength>;
    outline?: OutlineProperty<TLength>;
    padding?: PaddingProperty<TLength>;
    placeItems?: PlaceItemsProperty;
    placeSelf?: PlaceSelfProperty;
    textDecoration?: TextDecorationProperty;
    textEmphasis?: TextEmphasisProperty;
    transition?: TransitionProperty;
}

export type StandardProperties<TLength = string | 0> = StandardLonghandProperties<TLength> &
    StandardShorthandProperties<TLength>;

export interface VendorLonghandProperties<TLength = string | 0> {
    msTransitionProperty?: TransitionPropertyProperty;
    MozAnimationDelay?: GlobalsString;
    MozAnimationDuration?: GlobalsString;
    MozAnimationFillMode?: AnimationFillModeProperty;
    MozAnimationIterationCount?: AnimationIterationCountProperty;
    MozAnimationName?: AnimationNameProperty;
    MozAnimationPlayState?: AnimationPlayStateProperty;
    MozAnimationTimingFunction?: AnimationTimingFunctionProperty;
    MozAppearance?: MozAppearanceProperty;
    MozBackfaceVisibility?: BackfaceVisibilityProperty;
    MozBorderBottomColors?: MozBorderBottomColorsProperty;
    MozBorderEndColor?: BorderInlineEndColorProperty;
    MozBorderEndStyle?: BorderInlineEndStyleProperty;
    MozBorderEndWidth?: BorderInlineEndWidthProperty<TLength>;
    MozBorderLeftColors?: MozBorderLeftColorsProperty;
    MozBorderRightColors?: MozBorderRightColorsProperty;
    MozBorderStartColor?: BorderInlineStartColorProperty;
    MozBorderStartStyle?: BorderInlineStartStyleProperty;
    MozBorderTopColors?: MozBorderTopColorsProperty;
    MozBoxSizing?: BoxSizingProperty;
    MozColumnCount?: ColumnCountProperty;
    MozColumnFill?: ColumnFillProperty;
    MozColumnGap?: ColumnGapProperty<TLength>;
    MozColumnRuleColor?: ColumnRuleColorProperty;
    MozColumnRuleStyle?: ColumnRuleStyleProperty;
    MozColumnRuleWidth?: ColumnRuleWidthProperty<TLength>;
    MozColumnWidth?: ColumnWidthProperty<TLength>;
    MozContextProperties?: MozContextPropertiesProperty;
    MozFloatEdge?: MozFloatEdgeProperty;
    MozFontFeatureSettings?: FontFeatureSettingsProperty;
    MozFontLanguageOverride?: FontLanguageOverrideProperty;
    MozForceBrokenImageIcon?: GlobalsNumber;
    MozHyphens?: HyphensProperty;
    MozImageRegion?: MozImageRegionProperty;
    MozMarginEnd?: MarginInlineEndProperty<TLength>;
    MozMarginStart?: MarginInlineStartProperty<TLength>;
    MozOrient?: MozOrientProperty;
    MozOutlineRadiusBottomleft?: MozOutlineRadiusBottomleftProperty<TLength>;
    MozOutlineRadiusBottomright?: MozOutlineRadiusBottomrightProperty<TLength>;
    MozOutlineRadiusTopleft?: MozOutlineRadiusTopleftProperty<TLength>;
    MozOutlineRadiusTopright?: MozOutlineRadiusToprightProperty<TLength>;
    MozPaddingEnd?: PaddingInlineEndProperty<TLength>;
    MozPaddingStart?: PaddingInlineStartProperty<TLength>;
    MozPerspective?: PerspectiveProperty<TLength>;
    MozPerspectiveOrigin?: PerspectiveOriginProperty<TLength>;
    MozStackSizing?: MozStackSizingProperty;
    MozTabSize?: TabSizeProperty<TLength>;
    MozTextSizeAdjust?: TextSizeAdjustProperty;
    MozTransformOrigin?: TransformOriginProperty<TLength>;
    MozTransformStyle?: TransformStyleProperty;
    MozTransitionDelay?: GlobalsString;
    MozTransitionDuration?: GlobalsString;
    MozTransitionProperty?: TransitionPropertyProperty;
    MozTransitionTimingFunction?: TransitionTimingFunctionProperty;
    MozUserFocus?: MozUserFocusProperty;
    MozUserModify?: MozUserModifyProperty;
    MozUserSelect?: UserSelectProperty;
    MozWindowDragging?: MozWindowDraggingProperty;
    msAccelerator?: MsAcceleratorProperty;
    msAlignSelf?: AlignSelfProperty;
    msBlockProgression?: MsBlockProgressionProperty;
    msContentZoomChaining?: MsContentZoomChainingProperty;
    msContentZoomLimitMax?: GlobalsString;
    msContentZoomLimitMin?: GlobalsString;
    msContentZoomSnapPoints?: GlobalsString;
    msContentZoomSnapType?: MsContentZoomSnapTypeProperty;
    msContentZooming?: MsContentZoomingProperty;
    msFilter?: GlobalsString;
    msFlexDirection?: FlexDirectionProperty;
    msFlexPositive?: GlobalsNumber;
    msFlowFrom?: MsFlowFromProperty;
    msFlowInto?: MsFlowIntoProperty;
    msGridColumns?: GridAutoColumnsProperty<TLength>;
    msGridRows?: GridAutoRowsProperty<TLength>;
    msHighContrastAdjust?: MsHighContrastAdjustProperty;
    msHyphenateLimitChars?: MsHyphenateLimitCharsProperty;
    msHyphenateLimitLines?: MsHyphenateLimitLinesProperty;
    msHyphenateLimitZone?: MsHyphenateLimitZoneProperty<TLength>;
    msHyphens?: HyphensProperty;
    msImeAlign?: MsImeAlignProperty;
    msLineBreak?: LineBreakProperty;
    msOrder?: GlobalsNumber;
    msOverflowStyle?: MsOverflowStyleProperty;
    msOverflowX?: OverflowXProperty;
    msOverflowY?: OverflowYProperty;
    msScrollChaining?: MsScrollChainingProperty;
    msScrollLimitXMax?: MsScrollLimitXMaxProperty<TLength>;
    msScrollLimitXMin?: MsScrollLimitXMinProperty<TLength>;
    msScrollLimitYMax?: MsScrollLimitYMaxProperty<TLength>;
    msScrollLimitYMin?: MsScrollLimitYMinProperty<TLength>;
    msScrollRails?: MsScrollRailsProperty;
    msScrollSnapPointsX?: GlobalsString;
    msScrollSnapPointsY?: GlobalsString;
    msScrollSnapType?: MsScrollSnapTypeProperty;
    msScrollTranslation?: MsScrollTranslationProperty;
    msScrollbar3dlightColor?: MsScrollbar3dlightColorProperty;
    msScrollbarArrowColor?: MsScrollbarArrowColorProperty;
    msScrollbarBaseColor?: MsScrollbarBaseColorProperty;
    msScrollbarDarkshadowColor?: MsScrollbarDarkshadowColorProperty;
    msScrollbarFaceColor?: MsScrollbarFaceColorProperty;
    msScrollbarHighlightColor?: MsScrollbarHighlightColorProperty;
    msScrollbarShadowColor?: MsScrollbarShadowColorProperty;
    msScrollbarTrackColor?: MsScrollbarTrackColorProperty;
    msTextAutospace?: MsTextAutospaceProperty;
    msTextCombineHorizontal?: TextCombineUprightProperty;
    msTextOverflow?: TextOverflowProperty;
    msTouchAction?: TouchActionProperty;
    msTouchSelect?: MsTouchSelectProperty;
    msTransform?: TransformProperty;
    msTransformOrigin?: TransformOriginProperty<TLength>;
    msTransitionDelay?: GlobalsString;
    msTransitionDuration?: GlobalsString;
    MozAnimationDirection?: AnimationDirectionProperty;
    msTransitionTimingFunction?: TransitionTimingFunctionProperty;
    msUserSelect?: MsUserSelectProperty;
    msWordBreak?: WordBreakProperty;
    msWrapFlow?: MsWrapFlowProperty;
    msWrapMargin?: MsWrapMarginProperty<TLength>;
    msWrapThrough?: MsWrapThroughProperty;
    msWritingMode?: WritingModeProperty;
    OObjectFit?: ObjectFitProperty;
    OObjectPosition?: ObjectPositionProperty<TLength>;
    OTabSize?: TabSizeProperty<TLength>;
    OTextOverflow?: TextOverflowProperty;
    OTransformOrigin?: TransformOriginProperty<TLength>;
    WebkitAlignContent?: AlignContentProperty;
    WebkitAlignItems?: AlignItemsProperty;
    WebkitAlignSelf?: AlignSelfProperty;
    WebkitAnimationDelay?: GlobalsString;
    WebkitAnimationDirection?: AnimationDirectionProperty;
    WebkitAnimationDuration?: GlobalsString;
    WebkitAnimationFillMode?: AnimationFillModeProperty;
    WebkitAnimationIterationCount?: AnimationIterationCountProperty;
    WebkitAnimationName?: AnimationNameProperty;
    WebkitAnimationPlayState?: AnimationPlayStateProperty;
    WebkitAnimationTimingFunction?: AnimationTimingFunctionProperty;
    WebkitAppearance?: WebkitAppearanceProperty;
    WebkitBackdropFilter?: BackdropFilterProperty;
    WebkitBackfaceVisibility?: BackfaceVisibilityProperty;
    WebkitBackgroundClip?: BackgroundClipProperty;
    WebkitBackgroundOrigin?: BackgroundOriginProperty;
    WebkitBackgroundSize?: BackgroundSizeProperty<TLength>;
    WebkitBorderBeforeColor?: WebkitBorderBeforeColorProperty;
    WebkitBorderBeforeStyle?: WebkitBorderBeforeStyleProperty;
    WebkitBorderBeforeWidth?: WebkitBorderBeforeWidthProperty<TLength>;
    WebkitBorderBottomLeftRadius?: BorderBottomLeftRadiusProperty<TLength>;
    WebkitBorderBottomRightRadius?: BorderBottomRightRadiusProperty<TLength>;
    WebkitBorderImageSlice?: BorderImageSliceProperty;
    WebkitBorderTopLeftRadius?: BorderTopLeftRadiusProperty<TLength>;
    WebkitBorderTopRightRadius?: BorderTopRightRadiusProperty<TLength>;
    WebkitBoxDecorationBreak?: BoxDecorationBreakProperty;
    WebkitBoxReflect?: WebkitBoxReflectProperty<TLength>;
    WebkitBoxShadow?: BoxShadowProperty;
    WebkitBoxSizing?: BoxSizingProperty;
    WebkitClipPath?: ClipPathProperty;
    WebkitColorAdjust?: ColorAdjustProperty;
    WebkitColumnCount?: ColumnCountProperty;
    WebkitColumnFill?: ColumnFillProperty;
    WebkitColumnGap?: ColumnGapProperty<TLength>;
    WebkitColumnRuleColor?: ColumnRuleColorProperty;
    WebkitColumnRuleStyle?: ColumnRuleStyleProperty;
    WebkitColumnRuleWidth?: ColumnRuleWidthProperty<TLength>;
    WebkitColumnSpan?: ColumnSpanProperty;
    WebkitColumnWidth?: ColumnWidthProperty<TLength>;
    WebkitFilter?: FilterProperty;
    WebkitFlexBasis?: FlexBasisProperty<TLength>;
    WebkitFlexDirection?: FlexDirectionProperty;
    WebkitFlexGrow?: GlobalsNumber;
    WebkitFlexShrink?: GlobalsNumber;
    WebkitFlexWrap?: FlexWrapProperty;
    WebkitFontFeatureSettings?: FontFeatureSettingsProperty;
    WebkitFontKerning?: FontKerningProperty;
    WebkitFontVariantLigatures?: FontVariantLigaturesProperty;
    WebkitHyphens?: HyphensProperty;
    WebkitJustifyContent?: JustifyContentProperty;
    WebkitLineBreak?: LineBreakProperty;
    WebkitLineClamp?: WebkitLineClampProperty;
    WebkitMarginEnd?: MarginInlineEndProperty<TLength>;
    WebkitMarginStart?: MarginInlineStartProperty<TLength>;
    WebkitMaskAttachment?: WebkitMaskAttachmentProperty;
    WebkitMaskClip?: WebkitMaskClipProperty;
    WebkitMaskComposite?: WebkitMaskCompositeProperty;
    WebkitMaskImage?: WebkitMaskImageProperty;
    WebkitMaskOrigin?: WebkitMaskOriginProperty;
    WebkitMaskPosition?: WebkitMaskPositionProperty<TLength>;
    WebkitMaskPositionX?: WebkitMaskPositionXProperty<TLength>;
    WebkitMaskPositionY?: WebkitMaskPositionYProperty<TLength>;
    WebkitMaskRepeat?: WebkitMaskRepeatProperty;
    WebkitMaskRepeatX?: WebkitMaskRepeatXProperty;
    WebkitMaskRepeatY?: WebkitMaskRepeatYProperty;
    WebkitMaskSize?: WebkitMaskSizeProperty<TLength>;
    WebkitMaxInlineSize?: MaxInlineSizeProperty<TLength>;
    WebkitOrder?: GlobalsNumber;
    WebkitOverflowScrolling?: WebkitOverflowScrollingProperty;
    WebkitPaddingEnd?: PaddingInlineEndProperty<TLength>;
    WebkitPaddingStart?: PaddingInlineStartProperty<TLength>;
    WebkitPerspective?: PerspectiveProperty<TLength>;
    WebkitPerspectiveOrigin?: PerspectiveOriginProperty<TLength>;
    WebkitScrollSnapType?: ScrollSnapTypeProperty;
    WebkitShapeMargin?: ShapeMarginProperty<TLength>;
    WebkitTapHighlightColor?: WebkitTapHighlightColorProperty;
    WebkitTextCombine?: TextCombineUprightProperty;
    WebkitTextDecorationColor?: TextDecorationColorProperty;
    WebkitTextDecorationLine?: TextDecorationLineProperty;
    WebkitTextDecorationSkip?: TextDecorationSkipProperty;
    WebkitTextDecorationStyle?: TextDecorationStyleProperty;
    WebkitTextEmphasisColor?: TextEmphasisColorProperty;
    WebkitTextEmphasisPosition?: GlobalsString;
    WebkitTextEmphasisStyle?: TextEmphasisStyleProperty;
    WebkitTextFillColor?: WebkitTextFillColorProperty;
    WebkitTextOrientation?: TextOrientationProperty;
    WebkitTextSizeAdjust?: TextSizeAdjustProperty;
    WebkitTextStrokeColor?: WebkitTextStrokeColorProperty;
    WebkitTextStrokeWidth?: WebkitTextStrokeWidthProperty<TLength>;
    WebkitTouchCallout?: WebkitTouchCalloutProperty;
    WebkitTransform?: TransformProperty;
    WebkitTransformOrigin?: TransformOriginProperty<TLength>;
    WebkitTransformStyle?: TransformStyleProperty;
    WebkitTransitionDelay?: GlobalsString;
    WebkitTransitionDuration?: GlobalsString;
    WebkitTransitionProperty?: TransitionPropertyProperty;
    WebkitTransitionTimingFunction?: TransitionTimingFunctionProperty;
    WebkitUserModify?: WebkitUserModifyProperty;
    WebkitUserSelect?: UserSelectProperty;
    WebkitWritingMode?: WritingModeProperty;
}

export interface VendorShorthandProperties<TLength = string | 0> {
    WebkitAnimation?: AnimationProperty;
    MozAnimation?: AnimationProperty;
    MozColumnRule?: ColumnRuleProperty<TLength>;
    MozColumns?: ColumnsProperty<TLength>;
    MozTransition?: TransitionProperty;
    msContentZoomLimit?: GlobalsString;
    msContentZoomSnap?: MsContentZoomSnapProperty;
    msFlex?: FlexProperty<TLength>;
    msScrollLimit?: GlobalsString;
    msScrollSnapX?: GlobalsString;
    msScrollSnapY?: GlobalsString;
    msTransition?: TransitionProperty;
    MozBorderImage?: BorderImageProperty;
    WebkitBorderBefore?: WebkitBorderBeforeProperty<TLength>;
    WebkitBorderImage?: BorderImageProperty;
    WebkitBorderRadius?: BorderRadiusProperty<TLength>;
    WebkitColumnRule?: ColumnRuleProperty<TLength>;
    WebkitColumns?: ColumnsProperty<TLength>;
    WebkitFlex?: FlexProperty<TLength>;
    WebkitFlexFlow?: FlexFlowProperty;
    WebkitMask?: WebkitMaskProperty<TLength>;
    WebkitTextEmphasis?: TextEmphasisProperty;
    WebkitTextStroke?: WebkitTextStrokeProperty<TLength>;
    WebkitTransition?: TransitionProperty;
}

export type VendorProperties<TLength = string | 0> = VendorLonghandProperties<TLength> &
    VendorShorthandProperties<TLength>;

export interface ObsoleteProperties<TLength = string | 0> {
    MozBoxAlign?: BoxAlignProperty;
    boxAlign?: BoxAlignProperty;
    boxFlex?: GlobalsNumber;
    boxFlexGroup?: GlobalsNumber;
    boxLines?: BoxLinesProperty;
    boxOrdinalGroup?: GlobalsNumber;
    boxOrient?: BoxOrientProperty;
    boxPack?: BoxPackProperty;
    clip?: ClipProperty;
    fontVariantAlternates?: FontVariantAlternatesProperty;
    gridColumnGap?: GridColumnGapProperty<TLength>;
    gridGap?: GridGapProperty<TLength>;
    gridRowGap?: GridRowGapProperty<TLength>;
    imeMode?: ImeModeProperty;
    offsetBlock?: InsetBlockProperty<TLength>;
    offsetBlockEnd?: InsetBlockEndProperty<TLength>;
    offsetBlockStart?: InsetBlockStartProperty<TLength>;
    offsetInline?: InsetInlineProperty<TLength>;
    offsetInlineEnd?: InsetInlineEndProperty<TLength>;
    offsetInlineStart?: InsetInlineStartProperty<TLength>;
    scrollSnapCoordinate?: ScrollSnapCoordinateProperty<TLength>;
    scrollSnapDestination?: ScrollSnapDestinationProperty<TLength>;
    scrollSnapPointsX?: ScrollSnapPointsXProperty;
    scrollSnapPointsY?: ScrollSnapPointsYProperty;
    scrollSnapTypeX?: ScrollSnapTypeXProperty;
    scrollSnapTypeY?: ScrollSnapTypeYProperty;
    textCombineHorizontal?: TextCombineUprightProperty;
    KhtmlBoxAlign?: BoxAlignProperty;
    KhtmlBoxDirection?: BoxDirectionProperty;
    KhtmlBoxFlex?: GlobalsNumber;
    KhtmlBoxFlexGroup?: GlobalsNumber;
    KhtmlBoxLines?: BoxLinesProperty;
    KhtmlBoxOrdinalGroup?: GlobalsNumber;
    KhtmlBoxOrient?: BoxOrientProperty;
    KhtmlBoxPack?: BoxPackProperty;
    KhtmlLineBreak?: LineBreakProperty;
    KhtmlOpacity?: GlobalsNumber;
    KhtmlUserSelect?: UserSelectProperty;
    MozBackgroundClip?: BackgroundClipProperty;
    MozBackgroundInlinePolicy?: BoxDecorationBreakProperty;
    MozBackgroundOrigin?: BackgroundOriginProperty;
    MozBackgroundSize?: BackgroundSizeProperty<TLength>;
    MozBinding?: MozBindingProperty;
    MozBorderRadius?: BorderRadiusProperty<TLength>;
    MozBorderRadiusBottomleft?: BorderBottomLeftRadiusProperty<TLength>;
    MozBorderRadiusBottomright?: BorderBottomRightRadiusProperty<TLength>;
    MozBorderRadiusTopleft?: BorderTopLeftRadiusProperty<TLength>;
    MozBorderRadiusTopright?: BorderTopRightRadiusProperty<TLength>;
    boxDirection?: BoxDirectionProperty;
    MozBoxDirection?: BoxDirectionProperty;
    MozBoxFlex?: GlobalsNumber;
    MozBoxOrdinalGroup?: GlobalsNumber;
    MozBoxOrient?: BoxOrientProperty;
    MozBoxPack?: BoxPackProperty;
    MozBoxShadow?: BoxShadowProperty;
    MozOpacity?: GlobalsNumber;
    MozOutline?: OutlineProperty<TLength>;
    MozOutlineColor?: OutlineColorProperty;
    MozOutlineRadius?: MozOutlineRadiusProperty<TLength>;
    MozOutlineStyle?: OutlineStyleProperty;
    MozOutlineWidth?: OutlineWidthProperty<TLength>;
    MozTextAlignLast?: TextAlignLastProperty;
    MozTextBlink?: MozTextBlinkProperty;
    MozTextDecorationColor?: TextDecorationColorProperty;
    MozTextDecorationLine?: TextDecorationLineProperty;
    MozTextDecorationStyle?: TextDecorationStyleProperty;
    MozUserInput?: MozUserInputProperty;
    MozWindowShadow?: MozWindowShadowProperty;
    msImeMode?: ImeModeProperty;
    OAnimation?: AnimationProperty;
    OAnimationDelay?: GlobalsString;
    OAnimationDirection?: AnimationDirectionProperty;
    OAnimationDuration?: GlobalsString;
    OAnimationFillMode?: AnimationFillModeProperty;
    OAnimationIterationCount?: AnimationIterationCountProperty;
    OAnimationName?: AnimationNameProperty;
    OAnimationPlayState?: AnimationPlayStateProperty;
    OAnimationTimingFunction?: AnimationTimingFunctionProperty;
    OBackgroundSize?: BackgroundSizeProperty<TLength>;
    OBorderImage?: BorderImageProperty;
    OTransform?: TransformProperty;
    OTransition?: TransitionProperty;
    OTransitionDelay?: GlobalsString;
    OTransitionDuration?: GlobalsString;
    OTransitionProperty?: TransitionPropertyProperty;
    OTransitionTimingFunction?: TransitionTimingFunctionProperty;
    WebkitBoxAlign?: BoxAlignProperty;
    WebkitBoxDirection?: BoxDirectionProperty;
    WebkitBoxFlex?: GlobalsNumber;
    WebkitBoxFlexGroup?: GlobalsNumber;
    WebkitBoxLines?: BoxLinesProperty;
    WebkitBoxOrdinalGroup?: GlobalsNumber;
    WebkitBoxOrient?: BoxOrientProperty;
    WebkitBoxPack?: BoxPackProperty;
    WebkitScrollSnapPointsX?: ScrollSnapPointsXProperty;
    WebkitScrollSnapPointsY?: ScrollSnapPointsYProperty;
}

export interface SvgProperties<TLength = string | 0> {
    lineHeight?: LineHeightProperty<TLength>;
    alignmentBaseline?: AlignmentBaselineProperty;
    clip?: ClipProperty;
    clipPath?: ClipPathProperty;
    clipRule?: ClipRuleProperty;
    color?: ColorProperty;
    colorInterpolation?: ColorInterpolationProperty;
    colorRendering?: ColorRenderingProperty;
    cursor?: CursorProperty;
    direction?: DirectionProperty;
    display?: DisplayProperty;
    dominantBaseline?: DominantBaselineProperty;
    fill?: FillProperty;
    fillOpacity?: GlobalsNumber;
    fillRule?: FillRuleProperty;
    filter?: FilterProperty;
    floodColor?: FloodColorProperty;
    floodOpacity?: GlobalsNumber;
    font?: FontProperty;
    fontFamily?: FontFamilyProperty;
    fontSize?: FontSizeProperty<TLength>;
    fontSizeAdjust?: FontSizeAdjustProperty;
    fontStretch?: FontStretchProperty;
    fontStyle?: FontStyleProperty;
    fontVariant?: FontVariantProperty;
    fontWeight?: FontWeightProperty;
    glyphOrientationVertical?: GlyphOrientationVerticalProperty;
    imageRendering?: ImageRenderingProperty;
    letterSpacing?: LetterSpacingProperty<TLength>;
    lightingColor?: LightingColorProperty;
    baselineShift?: BaselineShiftProperty<TLength>;
    marker?: MarkerProperty;
    markerEnd?: MarkerEndProperty;
    markerMid?: MarkerMidProperty;
    markerStart?: MarkerStartProperty;
    mask?: MaskProperty<TLength>;
    opacity?: GlobalsNumber;
    overflow?: OverflowProperty;
    paintOrder?: PaintOrderProperty;
    pointerEvents?: PointerEventsProperty;
    shapeRendering?: ShapeRenderingProperty;
    stopColor?: StopColorProperty;
    stopOpacity?: GlobalsNumber;
    stroke?: StrokeProperty;
    strokeDasharray?: StrokeDasharrayProperty<TLength>;
    strokeDashoffset?: StrokeDashoffsetProperty<TLength>;
    strokeLinecap?: StrokeLinecapProperty;
    strokeLinejoin?: StrokeLinejoinProperty;
    strokeMiterlimit?: GlobalsNumber;
    strokeOpacity?: GlobalsNumber;
    strokeWidth?: StrokeWidthProperty<TLength>;
    textAnchor?: TextAnchorProperty;
    textDecoration?: TextDecorationProperty;
    textRendering?: TextRenderingProperty;
    unicodeBidi?: UnicodeBidiProperty;
    vectorEffect?: VectorEffectProperty;
    visibility?: VisibilityProperty;
    whiteSpace?: WhiteSpaceProperty;
    wordSpacing?: WordSpacingProperty<TLength>;
    writingMode?: WritingModeProperty;
}

export type Properties<TLength = string | 0> = StandardProperties<TLength> &
    VendorProperties<TLength> &
    ObsoleteProperties<TLength> &
    SvgProperties<TLength>;

export interface StandardLonghandPropertiesHyphen<TLength = string | 0> {
    ['margin-bottom']?: MarginBottomProperty<TLength>;
    ['align-content']?: AlignContentProperty;
    ['align-self']?: AlignSelfProperty;
    ['animation-delay']?: GlobalsString;
    ['animation-direction']?: AnimationDirectionProperty;
    ['animation-duration']?: GlobalsString;
    ['animation-fill-mode']?: AnimationFillModeProperty;
    ['animation-iteration-count']?: AnimationIterationCountProperty;
    ['animation-name']?: AnimationNameProperty;
    ['animation-play-state']?: AnimationPlayStateProperty;
    ['animation-timing-function']?: AnimationTimingFunctionProperty;
    appearance?: AppearanceProperty;
    ['backdrop-filter']?: BackdropFilterProperty;
    ['backface-visibility']?: BackfaceVisibilityProperty;
    ['background-attachment']?: BackgroundAttachmentProperty;
    ['background-blend-mode']?: BackgroundBlendModeProperty;
    ['background-clip']?: BackgroundClipProperty;
    ['background-color']?: BackgroundColorProperty;
    ['background-image']?: BackgroundImageProperty;
    ['background-origin']?: BackgroundOriginProperty;
    ['background-position']?: BackgroundPositionProperty<TLength>;
    ['background-position-x']?: BackgroundPositionXProperty<TLength>;
    ['background-position-y']?: BackgroundPositionYProperty<TLength>;
    ['background-repeat']?: BackgroundRepeatProperty;
    ['background-size']?: BackgroundSizeProperty<TLength>;
    ['block-overflow']?: BlockOverflowProperty;
    ['block-size']?: BlockSizeProperty<TLength>;
    ['border-block-color']?: BorderBlockColorProperty;
    ['border-block-end-color']?: BorderBlockEndColorProperty;
    ['border-block-end-style']?: BorderBlockEndStyleProperty;
    ['border-block-end-width']?: BorderBlockEndWidthProperty<TLength>;
    ['border-block-start-color']?: BorderBlockStartColorProperty;
    ['border-block-start-style']?: BorderBlockStartStyleProperty;
    ['border-block-start-width']?: BorderBlockStartWidthProperty<TLength>;
    ['border-block-style']?: BorderBlockStyleProperty;
    ['border-block-width']?: BorderBlockWidthProperty<TLength>;
    ['border-bottom-color']?: BorderBottomColorProperty;
    ['border-bottom-left-radius']?: BorderBottomLeftRadiusProperty<TLength>;
    ['border-bottom-right-radius']?: BorderBottomRightRadiusProperty<TLength>;
    ['border-bottom-style']?: BorderBottomStyleProperty;
    ['border-bottom-width']?: BorderBottomWidthProperty<TLength>;
    ['border-collapse']?: BorderCollapseProperty;
    ['border-end-end-radius']?: BorderEndEndRadiusProperty<TLength>;
    ['border-end-start-radius']?: BorderEndStartRadiusProperty<TLength>;
    ['border-image-outset']?: BorderImageOutsetProperty<TLength>;
    ['border-image-repeat']?: BorderImageRepeatProperty;
    ['border-image-slice']?: BorderImageSliceProperty;
    ['border-image-source']?: BorderImageSourceProperty;
    ['border-image-width']?: BorderImageWidthProperty<TLength>;
    ['border-inline-color']?: BorderInlineColorProperty;
    ['border-inline-end-color']?: BorderInlineEndColorProperty;
    ['border-inline-end-style']?: BorderInlineEndStyleProperty;
    ['border-inline-end-width']?: BorderInlineEndWidthProperty<TLength>;
    ['border-inline-start-color']?: BorderInlineStartColorProperty;
    ['border-inline-start-style']?: BorderInlineStartStyleProperty;
    ['border-inline-start-width']?: BorderInlineStartWidthProperty<TLength>;
    ['border-inline-style']?: BorderInlineStyleProperty;
    ['border-inline-width']?: BorderInlineWidthProperty<TLength>;
    ['border-left-color']?: BorderLeftColorProperty;
    ['border-left-style']?: BorderLeftStyleProperty;
    ['border-left-width']?: BorderLeftWidthProperty<TLength>;
    ['border-right-color']?: BorderRightColorProperty;
    ['border-right-style']?: BorderRightStyleProperty;
    ['border-right-width']?: BorderRightWidthProperty<TLength>;
    ['border-spacing']?: BorderSpacingProperty<TLength>;
    ['border-start-end-radius']?: BorderStartEndRadiusProperty<TLength>;
    ['border-start-start-radius']?: BorderStartStartRadiusProperty<TLength>;
    ['border-top-color']?: BorderTopColorProperty;
    ['border-top-left-radius']?: BorderTopLeftRadiusProperty<TLength>;
    ['border-top-right-radius']?: BorderTopRightRadiusProperty<TLength>;
    ['border-top-style']?: BorderTopStyleProperty;
    ['border-top-width']?: BorderTopWidthProperty<TLength>;
    bottom?: BottomProperty<TLength>;
    ['box-decoration-break']?: BoxDecorationBreakProperty;
    ['box-shadow']?: BoxShadowProperty;
    ['box-sizing']?: BoxSizingProperty;
    ['break-after']?: BreakAfterProperty;
    ['break-before']?: BreakBeforeProperty;
    ['break-inside']?: BreakInsideProperty;
    ['caption-side']?: CaptionSideProperty;
    ['caret-color']?: CaretColorProperty;
    clear?: ClearProperty;
    ['clip-path']?: ClipPathProperty;
    color?: ColorProperty;
    ['color-adjust']?: ColorAdjustProperty;
    ['column-count']?: ColumnCountProperty;
    ['column-fill']?: ColumnFillProperty;
    ['column-gap']?: ColumnGapProperty<TLength>;
    ['column-rule-color']?: ColumnRuleColorProperty;
    ['column-rule-style']?: ColumnRuleStyleProperty;
    ['column-rule-width']?: ColumnRuleWidthProperty<TLength>;
    ['column-span']?: ColumnSpanProperty;
    ['column-width']?: ColumnWidthProperty<TLength>;
    contain?: ContainProperty;
    content?: ContentProperty;
    ['counter-increment']?: CounterIncrementProperty;
    ['counter-reset']?: CounterResetProperty;
    ['counter-set']?: CounterSetProperty;
    cursor?: CursorProperty;
    direction?: DirectionProperty;
    display?: DisplayProperty;
    ['empty-cells']?: EmptyCellsProperty;
    filter?: FilterProperty;
    ['flex-basis']?: FlexBasisProperty<TLength>;
    ['flex-direction']?: FlexDirectionProperty;
    ['flex-grow']?: GlobalsNumber;
    ['flex-shrink']?: GlobalsNumber;
    ['flex-wrap']?: FlexWrapProperty;
    float?: FloatProperty;
    ['font-family']?: FontFamilyProperty;
    ['font-feature-settings']?: FontFeatureSettingsProperty;
    ['font-kerning']?: FontKerningProperty;
    ['font-language-override']?: FontLanguageOverrideProperty;
    ['font-optical-sizing']?: FontOpticalSizingProperty;
    ['font-size']?: FontSizeProperty<TLength>;
    ['font-size-adjust']?: FontSizeAdjustProperty;
    ['font-stretch']?: FontStretchProperty;
    ['font-style']?: FontStyleProperty;
    ['font-synthesis']?: FontSynthesisProperty;
    ['font-variant']?: FontVariantProperty;
    ['font-variant-caps']?: FontVariantCapsProperty;
    ['font-variant-east-asian']?: FontVariantEastAsianProperty;
    ['font-variant-ligatures']?: FontVariantLigaturesProperty;
    ['font-variant-numeric']?: FontVariantNumericProperty;
    ['font-variant-position']?: FontVariantPositionProperty;
    ['font-variation-settings']?: FontVariationSettingsProperty;
    ['font-weight']?: FontWeightProperty;
    ['grid-auto-columns']?: GridAutoColumnsProperty<TLength>;
    ['grid-auto-flow']?: GridAutoFlowProperty;
    ['grid-auto-rows']?: GridAutoRowsProperty<TLength>;
    ['grid-column-end']?: GridColumnEndProperty;
    ['grid-column-start']?: GridColumnStartProperty;
    ['grid-row-end']?: GridRowEndProperty;
    ['grid-row-start']?: GridRowStartProperty;
    ['grid-template-areas']?: GridTemplateAreasProperty;
    ['grid-template-columns']?: GridTemplateColumnsProperty<TLength>;
    ['grid-template-rows']?: GridTemplateRowsProperty<TLength>;
    ['hanging-punctuation']?: HangingPunctuationProperty;
    height?: HeightProperty<TLength>;
    hyphens?: HyphensProperty;
    ['image-orientation']?: ImageOrientationProperty;
    ['image-rendering']?: ImageRenderingProperty;
    ['image-resolution']?: ImageResolutionProperty;
    ['initial-letter']?: InitialLetterProperty;
    ['inline-size']?: InlineSizeProperty<TLength>;
    inset?: InsetProperty<TLength>;
    ['inset-block']?: InsetBlockProperty<TLength>;
    ['inset-block-end']?: InsetBlockEndProperty<TLength>;
    ['inset-block-start']?: InsetBlockStartProperty<TLength>;
    ['inset-inline']?: InsetInlineProperty<TLength>;
    ['inset-inline-end']?: InsetInlineEndProperty<TLength>;
    ['inset-inline-start']?: InsetInlineStartProperty<TLength>;
    isolation?: IsolationProperty;
    ['justify-content']?: JustifyContentProperty;
    ['justify-items']?: JustifyItemsProperty;
    ['justify-self']?: JustifySelfProperty;
    left?: LeftProperty<TLength>;
    ['letter-spacing']?: LetterSpacingProperty<TLength>;
    ['line-break']?: LineBreakProperty;
    ['line-height']?: LineHeightProperty<TLength>;
    ['line-height-step']?: LineHeightStepProperty<TLength>;
    ['list-style-image']?: ListStyleImageProperty;
    ['list-style-position']?: ListStylePositionProperty;
    ['list-style-type']?: ListStyleTypeProperty;
    ['margin-block']?: MarginBlockProperty<TLength>;
    ['margin-block-end']?: MarginBlockEndProperty<TLength>;
    ['margin-block-start']?: MarginBlockStartProperty<TLength>;
    ['align-items']?: AlignItemsProperty;
    ['margin-inline']?: MarginInlineProperty<TLength>;
    ['margin-inline-end']?: MarginInlineEndProperty<TLength>;
    ['margin-inline-start']?: MarginInlineStartProperty<TLength>;
    ['margin-left']?: MarginLeftProperty<TLength>;
    ['margin-right']?: MarginRightProperty<TLength>;
    ['margin-top']?: MarginTopProperty<TLength>;
    ['mask-border-mode']?: MaskBorderModeProperty;
    ['mask-border-outset']?: MaskBorderOutsetProperty<TLength>;
    ['mask-border-repeat']?: MaskBorderRepeatProperty;
    ['mask-border-slice']?: MaskBorderSliceProperty;
    ['mask-border-source']?: MaskBorderSourceProperty;
    ['mask-border-width']?: MaskBorderWidthProperty<TLength>;
    ['mask-clip']?: MaskClipProperty;
    ['mask-composite']?: MaskCompositeProperty;
    ['mask-image']?: MaskImageProperty;
    ['mask-mode']?: MaskModeProperty;
    ['mask-origin']?: MaskOriginProperty;
    ['mask-position']?: MaskPositionProperty<TLength>;
    ['mask-repeat']?: MaskRepeatProperty;
    ['mask-size']?: MaskSizeProperty<TLength>;
    ['mask-type']?: MaskTypeProperty;
    ['max-block-size']?: MaxBlockSizeProperty<TLength>;
    ['max-height']?: MaxHeightProperty<TLength>;
    ['max-inline-size']?: MaxInlineSizeProperty<TLength>;
    ['max-lines']?: MaxLinesProperty;
    ['max-width']?: MaxWidthProperty<TLength>;
    ['min-block-size']?: MinBlockSizeProperty<TLength>;
    ['min-height']?: MinHeightProperty<TLength>;
    ['min-inline-size']?: MinInlineSizeProperty<TLength>;
    ['min-width']?: MinWidthProperty<TLength>;
    ['mix-blend-mode']?: MixBlendModeProperty;
    ['motion-distance']?: OffsetDistanceProperty<TLength>;
    ['motion-path']?: OffsetPathProperty;
    ['motion-rotation']?: OffsetRotateProperty;
    ['object-fit']?: ObjectFitProperty;
    ['object-position']?: ObjectPositionProperty<TLength>;
    ['offset-anchor']?: OffsetAnchorProperty<TLength>;
    ['offset-distance']?: OffsetDistanceProperty<TLength>;
    ['offset-path']?: OffsetPathProperty;
    ['offset-position']?: OffsetPositionProperty<TLength>;
    ['offset-rotate']?: OffsetRotateProperty;
    ['offset-rotation']?: OffsetRotateProperty;
    opacity?: GlobalsNumber;
    order?: GlobalsNumber;
    orphans?: GlobalsNumber;
    ['outline-color']?: OutlineColorProperty;
    ['outline-offset']?: OutlineOffsetProperty<TLength>;
    ['outline-style']?: OutlineStyleProperty;
    ['outline-width']?: OutlineWidthProperty<TLength>;
    overflow?: OverflowProperty;
    ['overflow-anchor']?: OverflowAnchorProperty;
    ['overflow-block']?: OverflowBlockProperty;
    ['overflow-clip-box']?: OverflowClipBoxProperty;
    ['overflow-inline']?: OverflowInlineProperty;
    ['overflow-wrap']?: OverflowWrapProperty;
    ['overflow-x']?: OverflowXProperty;
    ['overflow-y']?: OverflowYProperty;
    ['overscroll-behavior']?: OverscrollBehaviorProperty;
    ['overscroll-behavior-x']?: OverscrollBehaviorXProperty;
    ['overscroll-behavior-y']?: OverscrollBehaviorYProperty;
    ['padding-block']?: PaddingBlockProperty<TLength>;
    ['padding-block-end']?: PaddingBlockEndProperty<TLength>;
    ['padding-block-start']?: PaddingBlockStartProperty<TLength>;
    ['padding-bottom']?: PaddingBottomProperty<TLength>;
    ['padding-inline']?: PaddingInlineProperty<TLength>;
    ['padding-inline-end']?: PaddingInlineEndProperty<TLength>;
    ['padding-inline-start']?: PaddingInlineStartProperty<TLength>;
    ['padding-left']?: PaddingLeftProperty<TLength>;
    ['padding-right']?: PaddingRightProperty<TLength>;
    ['padding-top']?: PaddingTopProperty<TLength>;
    ['page-break-after']?: PageBreakAfterProperty;
    ['page-break-before']?: PageBreakBeforeProperty;
    ['page-break-inside']?: PageBreakInsideProperty;
    ['paint-order']?: PaintOrderProperty;
    perspective?: PerspectiveProperty<TLength>;
    ['perspective-origin']?: PerspectiveOriginProperty<TLength>;
    ['place-content']?: PlaceContentProperty;
    ['pointer-events']?: PointerEventsProperty;
    position?: PositionProperty;
    quotes?: QuotesProperty;
    resize?: ResizeProperty;
    right?: RightProperty<TLength>;
    rotate?: RotateProperty;
    ['row-gap']?: RowGapProperty<TLength>;
    ['ruby-align']?: RubyAlignProperty;
    ['ruby-merge']?: RubyMergeProperty;
    ['ruby-position']?: RubyPositionProperty;
    scale?: ScaleProperty;
    ['scroll-behavior']?: ScrollBehaviorProperty;
    ['scroll-margin']?: ScrollMarginProperty<TLength>;
    ['scroll-margin-block']?: ScrollMarginBlockProperty<TLength>;
    ['scroll-margin-block-end']?: ScrollMarginBlockEndProperty<TLength>;
    ['scroll-margin-block-start']?: ScrollMarginBlockStartProperty<TLength>;
    ['scroll-margin-bottom']?: ScrollMarginBottomProperty<TLength>;
    ['scroll-margin-inline']?: ScrollMarginInlineProperty<TLength>;
    ['scroll-margin-inline-end']?: ScrollMarginInlineEndProperty<TLength>;
    ['scroll-margin-inline-start']?: ScrollMarginInlineStartProperty<TLength>;
    ['scroll-margin-left']?: ScrollMarginLeftProperty<TLength>;
    ['scroll-margin-right']?: ScrollMarginRightProperty<TLength>;
    ['scroll-margin-top']?: ScrollMarginTopProperty<TLength>;
    ['scroll-padding']?: ScrollPaddingProperty<TLength>;
    ['scroll-padding-block']?: ScrollPaddingBlockProperty<TLength>;
    ['scroll-padding-block-end']?: ScrollPaddingBlockEndProperty<TLength>;
    ['scroll-padding-block-start']?: ScrollPaddingBlockStartProperty<TLength>;
    ['scroll-padding-bottom']?: ScrollPaddingBottomProperty<TLength>;
    ['scroll-padding-inline']?: ScrollPaddingInlineProperty<TLength>;
    ['scroll-padding-inline-end']?: ScrollPaddingInlineEndProperty<TLength>;
    ['scroll-padding-inline-start']?: ScrollPaddingInlineStartProperty<TLength>;
    ['scroll-padding-left']?: ScrollPaddingLeftProperty<TLength>;
    ['scroll-padding-right']?: ScrollPaddingRightProperty<TLength>;
    ['scroll-padding-top']?: ScrollPaddingTopProperty<TLength>;
    ['scroll-snap-align']?: ScrollSnapAlignProperty;
    ['scroll-snap-stop']?: ScrollSnapStopProperty;
    ['scroll-snap-type']?: ScrollSnapTypeProperty;
    ['scrollbar-color']?: ScrollbarColorProperty;
    ['scrollbar-width']?: ScrollbarWidthProperty;
    ['shape-image-threshold']?: GlobalsNumber;
    ['shape-margin']?: ShapeMarginProperty<TLength>;
    ['shape-outside']?: ShapeOutsideProperty;
    ['tab-size']?: TabSizeProperty<TLength>;
    ['table-layout']?: TableLayoutProperty;
    ['text-align']?: TextAlignProperty;
    ['text-align-last']?: TextAlignLastProperty;
    ['text-combine-upright']?: TextCombineUprightProperty;
    ['text-decoration-color']?: TextDecorationColorProperty;
    ['text-decoration-line']?: TextDecorationLineProperty;
    ['text-decoration-skip']?: TextDecorationSkipProperty;
    ['text-decoration-skip-ink']?: TextDecorationSkipInkProperty;
    ['text-decoration-style']?: TextDecorationStyleProperty;
    ['text-emphasis-color']?: TextEmphasisColorProperty;
    ['text-emphasis-position']?: GlobalsString;
    ['text-emphasis-style']?: TextEmphasisStyleProperty;
    ['text-indent']?: TextIndentProperty<TLength>;
    ['text-justify']?: TextJustifyProperty;
    ['text-orientation']?: TextOrientationProperty;
    ['text-overflow']?: TextOverflowProperty;
    ['text-rendering']?: TextRenderingProperty;
    ['text-shadow']?: TextShadowProperty;
    ['text-size-adjust']?: TextSizeAdjustProperty;
    ['text-transform']?: TextTransformProperty;
    ['text-underline-position']?: TextUnderlinePositionProperty;
    top?: TopProperty<TLength>;
    ['touch-action']?: TouchActionProperty;
    transform?: TransformProperty;
    ['transform-box']?: TransformBoxProperty;
    ['transform-origin']?: TransformOriginProperty<TLength>;
    ['transform-style']?: TransformStyleProperty;
    ['transition-delay']?: GlobalsString;
    ['transition-duration']?: GlobalsString;
    ['transition-property']?: TransitionPropertyProperty;
    ['transition-timing-function']?: TransitionTimingFunctionProperty;
    translate?: TranslateProperty<TLength>;
    ['unicode-bidi']?: UnicodeBidiProperty;
    ['user-select']?: UserSelectProperty;
    ['vertical-align']?: VerticalAlignProperty<TLength>;
    visibility?: VisibilityProperty;
    ['white-space']?: WhiteSpaceProperty;
    widows?: GlobalsNumber;
    width?: WidthProperty<TLength>;
    ['will-change']?: WillChangeProperty;
    ['word-break']?: WordBreakProperty;
    ['word-spacing']?: WordSpacingProperty<TLength>;
    ['word-wrap']?: WordWrapProperty;
    ['writing-mode']?: WritingModeProperty;
    ['z-index']?: ZIndexProperty;
    zoom?: ZoomProperty;
}

export interface StandardShorthandPropertiesHyphen<TLength = string | 0> {
    ['flex-flow']?: FlexFlowProperty;
    all?: Globals;
    background?: BackgroundProperty<TLength>;
    border?: BorderProperty<TLength>;
    ['border-block']?: BorderBlockProperty<TLength>;
    ['border-block-end']?: BorderBlockEndProperty<TLength>;
    ['border-block-start']?: BorderBlockStartProperty<TLength>;
    ['border-bottom']?: BorderBottomProperty<TLength>;
    ['border-color']?: BorderColorProperty;
    ['border-image']?: BorderImageProperty;
    ['border-inline']?: BorderInlineProperty<TLength>;
    ['border-inline-end']?: BorderInlineEndProperty<TLength>;
    ['border-inline-start']?: BorderInlineStartProperty<TLength>;
    ['border-left']?: BorderLeftProperty<TLength>;
    ['border-radius']?: BorderRadiusProperty<TLength>;
    ['border-right']?: BorderRightProperty<TLength>;
    ['border-style']?: BorderStyleProperty;
    ['border-top']?: BorderTopProperty<TLength>;
    ['border-width']?: BorderWidthProperty<TLength>;
    ['column-rule']?: ColumnRuleProperty<TLength>;
    columns?: ColumnsProperty<TLength>;
    flex?: FlexProperty<TLength>;
    animation?: AnimationProperty;
    font?: FontProperty;
    gap?: GapProperty<TLength>;
    grid?: GridProperty;
    ['grid-area']?: GridAreaProperty;
    ['grid-column']?: GridColumnProperty;
    ['grid-row']?: GridRowProperty;
    ['grid-template']?: GridTemplateProperty;
    ['line-clamp']?: LineClampProperty;
    ['list-style']?: ListStyleProperty;
    margin?: MarginProperty<TLength>;
    mask?: MaskProperty<TLength>;
    ['mask-border']?: MaskBorderProperty;
    motion?: OffsetProperty<TLength>;
    offset?: OffsetProperty<TLength>;
    outline?: OutlineProperty<TLength>;
    padding?: PaddingProperty<TLength>;
    ['place-items']?: PlaceItemsProperty;
    ['place-self']?: PlaceSelfProperty;
    ['text-decoration']?: TextDecorationProperty;
    ['text-emphasis']?: TextEmphasisProperty;
    transition?: TransitionProperty;
}

export type StandardPropertiesHyphen<TLength = string | 0> =
    StandardLonghandPropertiesHyphen<TLength> & StandardShorthandPropertiesHyphen<TLength>;

export interface VendorLonghandPropertiesHyphen<TLength = string | 0> {
    ['-ms-transition-property']?: TransitionPropertyProperty;
    ['-moz-animation-delay']?: GlobalsString;
    ['-moz-animation-duration']?: GlobalsString;
    ['-moz-animation-fill-mode']?: AnimationFillModeProperty;
    ['-moz-animation-iteration-count']?: AnimationIterationCountProperty;
    ['-moz-animation-name']?: AnimationNameProperty;
    ['-moz-animation-play-state']?: AnimationPlayStateProperty;
    ['-moz-animation-timing-function']?: AnimationTimingFunctionProperty;
    ['-moz-appearance']?: MozAppearanceProperty;
    ['-moz-backface-visibility']?: BackfaceVisibilityProperty;
    ['-moz-border-bottom-colors']?: MozBorderBottomColorsProperty;
    ['-moz-border-end-color']?: BorderInlineEndColorProperty;
    ['-moz-border-end-style']?: BorderInlineEndStyleProperty;
    ['-moz-border-end-width']?: BorderInlineEndWidthProperty<TLength>;
    ['-moz-border-left-colors']?: MozBorderLeftColorsProperty;
    ['-moz-border-right-colors']?: MozBorderRightColorsProperty;
    ['-moz-border-start-color']?: BorderInlineStartColorProperty;
    ['-moz-border-start-style']?: BorderInlineStartStyleProperty;
    ['-moz-border-top-colors']?: MozBorderTopColorsProperty;
    ['-moz-box-sizing']?: BoxSizingProperty;
    ['-moz-column-count']?: ColumnCountProperty;
    ['-moz-column-fill']?: ColumnFillProperty;
    ['-moz-column-gap']?: ColumnGapProperty<TLength>;
    ['-moz-column-rule-color']?: ColumnRuleColorProperty;
    ['-moz-column-rule-style']?: ColumnRuleStyleProperty;
    ['-moz-column-rule-width']?: ColumnRuleWidthProperty<TLength>;
    ['-moz-column-width']?: ColumnWidthProperty<TLength>;
    ['-moz-context-properties']?: MozContextPropertiesProperty;
    ['-moz-float-edge']?: MozFloatEdgeProperty;
    ['-moz-font-feature-settings']?: FontFeatureSettingsProperty;
    ['-moz-font-language-override']?: FontLanguageOverrideProperty;
    ['-moz-force-broken-image-icon']?: GlobalsNumber;
    ['-moz-hyphens']?: HyphensProperty;
    ['-moz-image-region']?: MozImageRegionProperty;
    ['-moz-margin-end']?: MarginInlineEndProperty<TLength>;
    ['-moz-margin-start']?: MarginInlineStartProperty<TLength>;
    ['-moz-orient']?: MozOrientProperty;
    ['-moz-outline-radius-bottomleft']?: MozOutlineRadiusBottomleftProperty<TLength>;
    ['-moz-outline-radius-bottomright']?: MozOutlineRadiusBottomrightProperty<TLength>;
    ['-moz-outline-radius-topleft']?: MozOutlineRadiusTopleftProperty<TLength>;
    ['-moz-outline-radius-topright']?: MozOutlineRadiusToprightProperty<TLength>;
    ['-moz-padding-end']?: PaddingInlineEndProperty<TLength>;
    ['-moz-padding-start']?: PaddingInlineStartProperty<TLength>;
    ['-moz-perspective']?: PerspectiveProperty<TLength>;
    ['-moz-perspective-origin']?: PerspectiveOriginProperty<TLength>;
    ['-moz-stack-sizing']?: MozStackSizingProperty;
    ['-moz-tab-size']?: TabSizeProperty<TLength>;
    ['-moz-text-size-adjust']?: TextSizeAdjustProperty;
    ['-moz-transform-origin']?: TransformOriginProperty<TLength>;
    ['-moz-transform-style']?: TransformStyleProperty;
    ['-moz-transition-delay']?: GlobalsString;
    ['-moz-transition-duration']?: GlobalsString;
    ['-moz-transition-property']?: TransitionPropertyProperty;
    ['-moz-transition-timing-function']?: TransitionTimingFunctionProperty;
    ['-moz-user-focus']?: MozUserFocusProperty;
    ['-moz-user-modify']?: MozUserModifyProperty;
    ['-moz-user-select']?: UserSelectProperty;
    ['-moz-window-dragging']?: MozWindowDraggingProperty;
    ['-ms-accelerator']?: MsAcceleratorProperty;
    ['-ms-align-self']?: AlignSelfProperty;
    ['-ms-block-progression']?: MsBlockProgressionProperty;
    ['-ms-content-zoom-chaining']?: MsContentZoomChainingProperty;
    ['-ms-content-zoom-limit-max']?: GlobalsString;
    ['-ms-content-zoom-limit-min']?: GlobalsString;
    ['-ms-content-zoom-snap-points']?: GlobalsString;
    ['-ms-content-zoom-snap-type']?: MsContentZoomSnapTypeProperty;
    ['-ms-content-zooming']?: MsContentZoomingProperty;
    ['-ms-filter']?: GlobalsString;
    ['-ms-flex-direction']?: FlexDirectionProperty;
    ['-ms-flex-positive']?: GlobalsNumber;
    ['-ms-flow-from']?: MsFlowFromProperty;
    ['-ms-flow-into']?: MsFlowIntoProperty;
    ['-ms-grid-columns']?: GridAutoColumnsProperty<TLength>;
    ['-ms-grid-rows']?: GridAutoRowsProperty<TLength>;
    ['-ms-high-contrast-adjust']?: MsHighContrastAdjustProperty;
    ['-ms-hyphenate-limit-chars']?: MsHyphenateLimitCharsProperty;
    ['-ms-hyphenate-limit-lines']?: MsHyphenateLimitLinesProperty;
    ['-ms-hyphenate-limit-zone']?: MsHyphenateLimitZoneProperty<TLength>;
    ['-ms-hyphens']?: HyphensProperty;
    ['-ms-ime-align']?: MsImeAlignProperty;
    ['-ms-line-break']?: LineBreakProperty;
    ['-ms-order']?: GlobalsNumber;
    ['-ms-overflow-style']?: MsOverflowStyleProperty;
    ['-ms-overflow-x']?: OverflowXProperty;
    ['-ms-overflow-y']?: OverflowYProperty;
    ['-ms-scroll-chaining']?: MsScrollChainingProperty;
    ['-ms-scroll-limit-x-max']?: MsScrollLimitXMaxProperty<TLength>;
    ['-ms-scroll-limit-x-min']?: MsScrollLimitXMinProperty<TLength>;
    ['-ms-scroll-limit-y-max']?: MsScrollLimitYMaxProperty<TLength>;
    ['-ms-scroll-limit-y-min']?: MsScrollLimitYMinProperty<TLength>;
    ['-ms-scroll-rails']?: MsScrollRailsProperty;
    ['-ms-scroll-snap-points-x']?: GlobalsString;
    ['-ms-scroll-snap-points-y']?: GlobalsString;
    ['-ms-scroll-snap-type']?: MsScrollSnapTypeProperty;
    ['-ms-scroll-translation']?: MsScrollTranslationProperty;
    ['-ms-scrollbar-3dlight-color']?: MsScrollbar3dlightColorProperty;
    ['-ms-scrollbar-arrow-color']?: MsScrollbarArrowColorProperty;
    ['-ms-scrollbar-base-color']?: MsScrollbarBaseColorProperty;
    ['-ms-scrollbar-darkshadow-color']?: MsScrollbarDarkshadowColorProperty;
    ['-ms-scrollbar-face-color']?: MsScrollbarFaceColorProperty;
    ['-ms-scrollbar-highlight-color']?: MsScrollbarHighlightColorProperty;
    ['-ms-scrollbar-shadow-color']?: MsScrollbarShadowColorProperty;
    ['-ms-scrollbar-track-color']?: MsScrollbarTrackColorProperty;
    ['-ms-text-autospace']?: MsTextAutospaceProperty;
    ['-ms-text-combine-horizontal']?: TextCombineUprightProperty;
    ['-ms-text-overflow']?: TextOverflowProperty;
    ['-ms-touch-action']?: TouchActionProperty;
    ['-ms-touch-select']?: MsTouchSelectProperty;
    ['-ms-transform']?: TransformProperty;
    ['-ms-transform-origin']?: TransformOriginProperty<TLength>;
    ['-ms-transition-delay']?: GlobalsString;
    ['-ms-transition-duration']?: GlobalsString;
    ['-moz-animation-direction']?: AnimationDirectionProperty;
    ['-ms-transition-timing-function']?: TransitionTimingFunctionProperty;
    ['-ms-user-select']?: MsUserSelectProperty;
    ['-ms-word-break']?: WordBreakProperty;
    ['-ms-wrap-flow']?: MsWrapFlowProperty;
    ['-ms-wrap-margin']?: MsWrapMarginProperty<TLength>;
    ['-ms-wrap-through']?: MsWrapThroughProperty;
    ['-ms-writing-mode']?: WritingModeProperty;
    ['-o-object-fit']?: ObjectFitProperty;
    ['-o-object-position']?: ObjectPositionProperty<TLength>;
    ['-o-tab-size']?: TabSizeProperty<TLength>;
    ['-o-text-overflow']?: TextOverflowProperty;
    ['-o-transform-origin']?: TransformOriginProperty<TLength>;
    ['-webkit-align-content']?: AlignContentProperty;
    ['-webkit-align-items']?: AlignItemsProperty;
    ['-webkit-align-self']?: AlignSelfProperty;
    ['-webkit-animation-delay']?: GlobalsString;
    ['-webkit-animation-direction']?: AnimationDirectionProperty;
    ['-webkit-animation-duration']?: GlobalsString;
    ['-webkit-animation-fill-mode']?: AnimationFillModeProperty;
    ['-webkit-animation-iteration-count']?: AnimationIterationCountProperty;
    ['-webkit-animation-name']?: AnimationNameProperty;
    ['-webkit-animation-play-state']?: AnimationPlayStateProperty;
    ['-webkit-animation-timing-function']?: AnimationTimingFunctionProperty;
    ['-webkit-appearance']?: WebkitAppearanceProperty;
    ['-webkit-backdrop-filter']?: BackdropFilterProperty;
    ['-webkit-backface-visibility']?: BackfaceVisibilityProperty;
    ['-webkit-background-clip']?: BackgroundClipProperty;
    ['-webkit-background-origin']?: BackgroundOriginProperty;
    ['-webkit-background-size']?: BackgroundSizeProperty<TLength>;
    ['-webkit-border-before-color']?: WebkitBorderBeforeColorProperty;
    ['-webkit-border-before-style']?: WebkitBorderBeforeStyleProperty;
    ['-webkit-border-before-width']?: WebkitBorderBeforeWidthProperty<TLength>;
    ['-webkit-border-bottom-left-radius']?: BorderBottomLeftRadiusProperty<TLength>;
    ['-webkit-border-bottom-right-radius']?: BorderBottomRightRadiusProperty<TLength>;
    ['-webkit-border-image-slice']?: BorderImageSliceProperty;
    ['-webkit-border-top-left-radius']?: BorderTopLeftRadiusProperty<TLength>;
    ['-webkit-border-top-right-radius']?: BorderTopRightRadiusProperty<TLength>;
    ['-webkit-box-decoration-break']?: BoxDecorationBreakProperty;
    ['-webkit-box-reflect']?: WebkitBoxReflectProperty<TLength>;
    ['-webkit-box-shadow']?: BoxShadowProperty;
    ['-webkit-box-sizing']?: BoxSizingProperty;
    ['-webkit-clip-path']?: ClipPathProperty;
    ['-webkit-color-adjust']?: ColorAdjustProperty;
    ['-webkit-column-count']?: ColumnCountProperty;
    ['-webkit-column-fill']?: ColumnFillProperty;
    ['-webkit-column-gap']?: ColumnGapProperty<TLength>;
    ['-webkit-column-rule-color']?: ColumnRuleColorProperty;
    ['-webkit-column-rule-style']?: ColumnRuleStyleProperty;
    ['-webkit-column-rule-width']?: ColumnRuleWidthProperty<TLength>;
    ['-webkit-column-span']?: ColumnSpanProperty;
    ['-webkit-column-width']?: ColumnWidthProperty<TLength>;
    ['-webkit-filter']?: FilterProperty;
    ['-webkit-flex-basis']?: FlexBasisProperty<TLength>;
    ['-webkit-flex-direction']?: FlexDirectionProperty;
    ['-webkit-flex-grow']?: GlobalsNumber;
    ['-webkit-flex-shrink']?: GlobalsNumber;
    ['-webkit-flex-wrap']?: FlexWrapProperty;
    ['-webkit-font-feature-settings']?: FontFeatureSettingsProperty;
    ['-webkit-font-kerning']?: FontKerningProperty;
    ['-webkit-font-variant-ligatures']?: FontVariantLigaturesProperty;
    ['-webkit-hyphens']?: HyphensProperty;
    ['-webkit-justify-content']?: JustifyContentProperty;
    ['-webkit-line-break']?: LineBreakProperty;
    ['-webkit-line-clamp']?: WebkitLineClampProperty;
    ['-webkit-margin-end']?: MarginInlineEndProperty<TLength>;
    ['-webkit-margin-start']?: MarginInlineStartProperty<TLength>;
    ['-webkit-mask-attachment']?: WebkitMaskAttachmentProperty;
    ['-webkit-mask-clip']?: WebkitMaskClipProperty;
    ['-webkit-mask-composite']?: WebkitMaskCompositeProperty;
    ['-webkit-mask-image']?: WebkitMaskImageProperty;
    ['-webkit-mask-origin']?: WebkitMaskOriginProperty;
    ['-webkit-mask-position']?: WebkitMaskPositionProperty<TLength>;
    ['-webkit-mask-position-x']?: WebkitMaskPositionXProperty<TLength>;
    ['-webkit-mask-position-y']?: WebkitMaskPositionYProperty<TLength>;
    ['-webkit-mask-repeat']?: WebkitMaskRepeatProperty;
    ['-webkit-mask-repeat-x']?: WebkitMaskRepeatXProperty;
    ['-webkit-mask-repeat-y']?: WebkitMaskRepeatYProperty;
    ['-webkit-mask-size']?: WebkitMaskSizeProperty<TLength>;
    ['-webkit-max-inline-size']?: MaxInlineSizeProperty<TLength>;
    ['-webkit-order']?: GlobalsNumber;
    ['-webkit-overflow-scrolling']?: WebkitOverflowScrollingProperty;
    ['-webkit-padding-end']?: PaddingInlineEndProperty<TLength>;
    ['-webkit-padding-start']?: PaddingInlineStartProperty<TLength>;
    ['-webkit-perspective']?: PerspectiveProperty<TLength>;
    ['-webkit-perspective-origin']?: PerspectiveOriginProperty<TLength>;
    ['-webkit-scroll-snap-type']?: ScrollSnapTypeProperty;
    ['-webkit-shape-margin']?: ShapeMarginProperty<TLength>;
    ['-webkit-tap-highlight-color']?: WebkitTapHighlightColorProperty;
    ['-webkit-text-combine']?: TextCombineUprightProperty;
    ['-webkit-text-decoration-color']?: TextDecorationColorProperty;
    ['-webkit-text-decoration-line']?: TextDecorationLineProperty;
    ['-webkit-text-decoration-skip']?: TextDecorationSkipProperty;
    ['-webkit-text-decoration-style']?: TextDecorationStyleProperty;
    ['-webkit-text-emphasis-color']?: TextEmphasisColorProperty;
    ['-webkit-text-emphasis-position']?: GlobalsString;
    ['-webkit-text-emphasis-style']?: TextEmphasisStyleProperty;
    ['-webkit-text-fill-color']?: WebkitTextFillColorProperty;
    ['-webkit-text-orientation']?: TextOrientationProperty;
    ['-webkit-text-size-adjust']?: TextSizeAdjustProperty;
    ['-webkit-text-stroke-color']?: WebkitTextStrokeColorProperty;
    ['-webkit-text-stroke-width']?: WebkitTextStrokeWidthProperty<TLength>;
    ['-webkit-touch-callout']?: WebkitTouchCalloutProperty;
    ['-webkit-transform']?: TransformProperty;
    ['-webkit-transform-origin']?: TransformOriginProperty<TLength>;
    ['-webkit-transform-style']?: TransformStyleProperty;
    ['-webkit-transition-delay']?: GlobalsString;
    ['-webkit-transition-duration']?: GlobalsString;
    ['-webkit-transition-property']?: TransitionPropertyProperty;
    ['-webkit-transition-timing-function']?: TransitionTimingFunctionProperty;
    ['-webkit-user-modify']?: WebkitUserModifyProperty;
    ['-webkit-user-select']?: UserSelectProperty;
    ['-webkit-writing-mode']?: WritingModeProperty;
}

export interface VendorShorthandPropertiesHyphen<TLength = string | 0> {
    ['-webkit-animation']?: AnimationProperty;
    ['-moz-animation']?: AnimationProperty;
    ['-moz-column-rule']?: ColumnRuleProperty<TLength>;
    ['-moz-columns']?: ColumnsProperty<TLength>;
    ['-moz-transition']?: TransitionProperty;
    ['-ms-content-zoom-limit']?: GlobalsString;
    ['-ms-content-zoom-snap']?: MsContentZoomSnapProperty;
    ['-ms-flex']?: FlexProperty<TLength>;
    ['-ms-scroll-limit']?: GlobalsString;
    ['-ms-scroll-snap-x']?: GlobalsString;
    ['-ms-scroll-snap-y']?: GlobalsString;
    ['-ms-transition']?: TransitionProperty;
    ['-moz-border-image']?: BorderImageProperty;
    ['-webkit-border-before']?: WebkitBorderBeforeProperty<TLength>;
    ['-webkit-border-image']?: BorderImageProperty;
    ['-webkit-border-radius']?: BorderRadiusProperty<TLength>;
    ['-webkit-column-rule']?: ColumnRuleProperty<TLength>;
    ['-webkit-columns']?: ColumnsProperty<TLength>;
    ['-webkit-flex']?: FlexProperty<TLength>;
    ['-webkit-flex-flow']?: FlexFlowProperty;
    ['-webkit-mask']?: WebkitMaskProperty<TLength>;
    ['-webkit-text-emphasis']?: TextEmphasisProperty;
    ['-webkit-text-stroke']?: WebkitTextStrokeProperty<TLength>;
    ['-webkit-transition']?: TransitionProperty;
}

export type VendorPropertiesHyphen<TLength = string | 0> = VendorLonghandPropertiesHyphen<TLength> &
    VendorShorthandPropertiesHyphen<TLength>;

export interface ObsoletePropertiesHyphen<TLength = string | 0> {
    ['-moz-box-align']?: BoxAlignProperty;
    ['box-align']?: BoxAlignProperty;
    ['box-flex']?: GlobalsNumber;
    ['box-flex-group']?: GlobalsNumber;
    ['box-lines']?: BoxLinesProperty;
    ['box-ordinal-group']?: GlobalsNumber;
    ['box-orient']?: BoxOrientProperty;
    ['box-pack']?: BoxPackProperty;
    clip?: ClipProperty;
    ['font-variant-alternates']?: FontVariantAlternatesProperty;
    ['grid-column-gap']?: GridColumnGapProperty<TLength>;
    ['grid-gap']?: GridGapProperty<TLength>;
    ['grid-row-gap']?: GridRowGapProperty<TLength>;
    ['ime-mode']?: ImeModeProperty;
    ['offset-block']?: InsetBlockProperty<TLength>;
    ['offset-block-end']?: InsetBlockEndProperty<TLength>;
    ['offset-block-start']?: InsetBlockStartProperty<TLength>;
    ['offset-inline']?: InsetInlineProperty<TLength>;
    ['offset-inline-end']?: InsetInlineEndProperty<TLength>;
    ['offset-inline-start']?: InsetInlineStartProperty<TLength>;
    ['scroll-snap-coordinate']?: ScrollSnapCoordinateProperty<TLength>;
    ['scroll-snap-destination']?: ScrollSnapDestinationProperty<TLength>;
    ['scroll-snap-points-x']?: ScrollSnapPointsXProperty;
    ['scroll-snap-points-y']?: ScrollSnapPointsYProperty;
    ['scroll-snap-type-x']?: ScrollSnapTypeXProperty;
    ['scroll-snap-type-y']?: ScrollSnapTypeYProperty;
    ['text-combine-horizontal']?: TextCombineUprightProperty;
    ['-khtml-box-align']?: BoxAlignProperty;
    ['-khtml-box-direction']?: BoxDirectionProperty;
    ['-khtml-box-flex']?: GlobalsNumber;
    ['-khtml-box-flex-group']?: GlobalsNumber;
    ['-khtml-box-lines']?: BoxLinesProperty;
    ['-khtml-box-ordinal-group']?: GlobalsNumber;
    ['-khtml-box-orient']?: BoxOrientProperty;
    ['-khtml-box-pack']?: BoxPackProperty;
    ['-khtml-line-break']?: LineBreakProperty;
    ['-khtml-opacity']?: GlobalsNumber;
    ['-khtml-user-select']?: UserSelectProperty;
    ['-moz-background-clip']?: BackgroundClipProperty;
    ['-moz-background-inline-policy']?: BoxDecorationBreakProperty;
    ['-moz-background-origin']?: BackgroundOriginProperty;
    ['-moz-background-size']?: BackgroundSizeProperty<TLength>;
    ['-moz-binding']?: MozBindingProperty;
    ['-moz-border-radius']?: BorderRadiusProperty<TLength>;
    ['-moz-border-radius-bottomleft']?: BorderBottomLeftRadiusProperty<TLength>;
    ['-moz-border-radius-bottomright']?: BorderBottomRightRadiusProperty<TLength>;
    ['-moz-border-radius-topleft']?: BorderTopLeftRadiusProperty<TLength>;
    ['-moz-border-radius-topright']?: BorderTopRightRadiusProperty<TLength>;
    ['box-direction']?: BoxDirectionProperty;
    ['-moz-box-direction']?: BoxDirectionProperty;
    ['-moz-box-flex']?: GlobalsNumber;
    ['-moz-box-ordinal-group']?: GlobalsNumber;
    ['-moz-box-orient']?: BoxOrientProperty;
    ['-moz-box-pack']?: BoxPackProperty;
    ['-moz-box-shadow']?: BoxShadowProperty;
    ['-moz-opacity']?: GlobalsNumber;
    ['-moz-outline']?: OutlineProperty<TLength>;
    ['-moz-outline-color']?: OutlineColorProperty;
    ['-moz-outline-radius']?: MozOutlineRadiusProperty<TLength>;
    ['-moz-outline-style']?: OutlineStyleProperty;
    ['-moz-outline-width']?: OutlineWidthProperty<TLength>;
    ['-moz-text-align-last']?: TextAlignLastProperty;
    ['-moz-text-blink']?: MozTextBlinkProperty;
    ['-moz-text-decoration-color']?: TextDecorationColorProperty;
    ['-moz-text-decoration-line']?: TextDecorationLineProperty;
    ['-moz-text-decoration-style']?: TextDecorationStyleProperty;
    ['-moz-user-input']?: MozUserInputProperty;
    ['-moz-window-shadow']?: MozWindowShadowProperty;
    ['-ms-ime-mode']?: ImeModeProperty;
    ['-o-animation']?: AnimationProperty;
    ['-o-animation-delay']?: GlobalsString;
    ['-o-animation-direction']?: AnimationDirectionProperty;
    ['-o-animation-duration']?: GlobalsString;
    ['-o-animation-fill-mode']?: AnimationFillModeProperty;
    ['-o-animation-iteration-count']?: AnimationIterationCountProperty;
    ['-o-animation-name']?: AnimationNameProperty;
    ['-o-animation-play-state']?: AnimationPlayStateProperty;
    ['-o-animation-timing-function']?: AnimationTimingFunctionProperty;
    ['-o-background-size']?: BackgroundSizeProperty<TLength>;
    ['-o-border-image']?: BorderImageProperty;
    ['-o-transform']?: TransformProperty;
    ['-o-transition']?: TransitionProperty;
    ['-o-transition-delay']?: GlobalsString;
    ['-o-transition-duration']?: GlobalsString;
    ['-o-transition-property']?: TransitionPropertyProperty;
    ['-o-transition-timing-function']?: TransitionTimingFunctionProperty;
    ['-webkit-box-align']?: BoxAlignProperty;
    ['-webkit-box-direction']?: BoxDirectionProperty;
    ['-webkit-box-flex']?: GlobalsNumber;
    ['-webkit-box-flex-group']?: GlobalsNumber;
    ['-webkit-box-lines']?: BoxLinesProperty;
    ['-webkit-box-ordinal-group']?: GlobalsNumber;
    ['-webkit-box-orient']?: BoxOrientProperty;
    ['-webkit-box-pack']?: BoxPackProperty;
    ['-webkit-scroll-snap-points-x']?: ScrollSnapPointsXProperty;
    ['-webkit-scroll-snap-points-y']?: ScrollSnapPointsYProperty;
}

export interface SvgPropertiesHyphen<TLength = string | 0> {
    ['line-height']?: LineHeightProperty<TLength>;
    ['alignment-baseline']?: AlignmentBaselineProperty;
    clip?: ClipProperty;
    ['clip-path']?: ClipPathProperty;
    ['clip-rule']?: ClipRuleProperty;
    color?: ColorProperty;
    ['color-interpolation']?: ColorInterpolationProperty;
    ['color-rendering']?: ColorRenderingProperty;
    cursor?: CursorProperty;
    direction?: DirectionProperty;
    display?: DisplayProperty;
    ['dominant-baseline']?: DominantBaselineProperty;
    fill?: FillProperty;
    ['fill-opacity']?: GlobalsNumber;
    ['fill-rule']?: FillRuleProperty;
    filter?: FilterProperty;
    ['flood-color']?: FloodColorProperty;
    ['flood-opacity']?: GlobalsNumber;
    font?: FontProperty;
    ['font-family']?: FontFamilyProperty;
    ['font-size']?: FontSizeProperty<TLength>;
    ['font-size-adjust']?: FontSizeAdjustProperty;
    ['font-stretch']?: FontStretchProperty;
    ['font-style']?: FontStyleProperty;
    ['font-variant']?: FontVariantProperty;
    ['font-weight']?: FontWeightProperty;
    ['glyph-orientation-vertical']?: GlyphOrientationVerticalProperty;
    ['image-rendering']?: ImageRenderingProperty;
    ['letter-spacing']?: LetterSpacingProperty<TLength>;
    ['lighting-color']?: LightingColorProperty;
    ['baseline-shift']?: BaselineShiftProperty<TLength>;
    marker?: MarkerProperty;
    ['marker-end']?: MarkerEndProperty;
    ['marker-mid']?: MarkerMidProperty;
    ['marker-start']?: MarkerStartProperty;
    mask?: MaskProperty<TLength>;
    opacity?: GlobalsNumber;
    overflow?: OverflowProperty;
    ['paint-order']?: PaintOrderProperty;
    ['pointer-events']?: PointerEventsProperty;
    ['shape-rendering']?: ShapeRenderingProperty;
    ['stop-color']?: StopColorProperty;
    ['stop-opacity']?: GlobalsNumber;
    stroke?: StrokeProperty;
    ['stroke-dasharray']?: StrokeDasharrayProperty<TLength>;
    ['stroke-dashoffset']?: StrokeDashoffsetProperty<TLength>;
    ['stroke-linecap']?: StrokeLinecapProperty;
    ['stroke-linejoin']?: StrokeLinejoinProperty;
    ['stroke-miterlimit']?: GlobalsNumber;
    ['stroke-opacity']?: GlobalsNumber;
    ['stroke-width']?: StrokeWidthProperty<TLength>;
    ['text-anchor']?: TextAnchorProperty;
    ['text-decoration']?: TextDecorationProperty;
    ['text-rendering']?: TextRenderingProperty;
    ['unicode-bidi']?: UnicodeBidiProperty;
    ['vector-effect']?: VectorEffectProperty;
    visibility?: VisibilityProperty;
    ['white-space']?: WhiteSpaceProperty;
    ['word-spacing']?: WordSpacingProperty<TLength>;
    ['writing-mode']?: WritingModeProperty;
}

export type PropertiesHyphen<TLength = string | 0> = StandardPropertiesHyphen<TLength> &
    VendorPropertiesHyphen<TLength> &
    ObsoletePropertiesHyphen<TLength> &
    SvgPropertiesHyphen<TLength>;

export interface StandardLonghandPropertiesFallback<TLength = string | 0> {
    marginInlineStart?:
        | MarginInlineStartProperty<TLength>
        | Array<MarginInlineStartProperty<TLength>>;
    borderStartStartRadius?:
        | BorderStartStartRadiusProperty<TLength>
        | Array<BorderStartStartRadiusProperty<TLength>>;
    borderTopLeftRadius?:
        | BorderTopLeftRadiusProperty<TLength>
        | Array<BorderTopLeftRadiusProperty<TLength>>;
    borderTopRightRadius?:
        | BorderTopRightRadiusProperty<TLength>
        | Array<BorderTopRightRadiusProperty<TLength>>;
    gridTemplateColumns?:
        | GridTemplateColumnsProperty<TLength>
        | Array<GridTemplateColumnsProperty<TLength>>;
    borderStartEndRadius?:
        | BorderStartEndRadiusProperty<TLength>
        | Array<BorderStartEndRadiusProperty<TLength>>;
    paddingBlockStart?:
        | PaddingBlockStartProperty<TLength>
        | Array<PaddingBlockStartProperty<TLength>>;
    paddingInlineStart?:
        | PaddingInlineStartProperty<TLength>
        | Array<PaddingInlineStartProperty<TLength>>;
    perspectiveOrigin?:
        | PerspectiveOriginProperty<TLength>
        | Array<PerspectiveOriginProperty<TLength>>;
    scrollMarginBlock?:
        | ScrollMarginBlockProperty<TLength>
        | Array<ScrollMarginBlockProperty<TLength>>;
    scrollMarginBlockEnd?:
        | ScrollMarginBlockEndProperty<TLength>
        | Array<ScrollMarginBlockEndProperty<TLength>>;
    borderInlineWidth?:
        | BorderInlineWidthProperty<TLength>
        | Array<BorderInlineWidthProperty<TLength>>;
    scrollMarginBlockStart?:
        | ScrollMarginBlockStartProperty<TLength>
        | Array<ScrollMarginBlockStartProperty<TLength>>;
    borderInlineStartWidth?:
        | BorderInlineStartWidthProperty<TLength>
        | Array<BorderInlineStartWidthProperty<TLength>>;
    scrollMarginBottom?:
        | ScrollMarginBottomProperty<TLength>
        | Array<ScrollMarginBottomProperty<TLength>>;
    borderInlineEndWidth?:
        | BorderInlineEndWidthProperty<TLength>
        | Array<BorderInlineEndWidthProperty<TLength>>;
    scrollMarginInline?:
        | ScrollMarginInlineProperty<TLength>
        | Array<ScrollMarginInlineProperty<TLength>>;
    borderImageOutset?:
        | BorderImageOutsetProperty<TLength>
        | Array<BorderImageOutsetProperty<TLength>>;
    scrollMarginInlineEnd?:
        | ScrollMarginInlineEndProperty<TLength>
        | Array<ScrollMarginInlineEndProperty<TLength>>;
    borderEndStartRadius?:
        | BorderEndStartRadiusProperty<TLength>
        | Array<BorderEndStartRadiusProperty<TLength>>;
    scrollMarginInlineStart?:
        | ScrollMarginInlineStartProperty<TLength>
        | Array<ScrollMarginInlineStartProperty<TLength>>;
    borderEndEndRadius?:
        | BorderEndEndRadiusProperty<TLength>
        | Array<BorderEndEndRadiusProperty<TLength>>;
    scrollMarginRight?:
        | ScrollMarginRightProperty<TLength>
        | Array<ScrollMarginRightProperty<TLength>>;
    borderBottomWidth?:
        | BorderBottomWidthProperty<TLength>
        | Array<BorderBottomWidthProperty<TLength>>;
    scrollPaddingBlock?:
        | ScrollPaddingBlockProperty<TLength>
        | Array<ScrollPaddingBlockProperty<TLength>>;
    borderBottomRightRadius?:
        | BorderBottomRightRadiusProperty<TLength>
        | Array<BorderBottomRightRadiusProperty<TLength>>;
    scrollPaddingBlockEnd?:
        | ScrollPaddingBlockEndProperty<TLength>
        | Array<ScrollPaddingBlockEndProperty<TLength>>;
    borderBottomLeftRadius?:
        | BorderBottomLeftRadiusProperty<TLength>
        | Array<BorderBottomLeftRadiusProperty<TLength>>;
    scrollPaddingBlockStart?:
        | ScrollPaddingBlockStartProperty<TLength>
        | Array<ScrollPaddingBlockStartProperty<TLength>>;
    borderBlockStartWidth?:
        | BorderBlockStartWidthProperty<TLength>
        | Array<BorderBlockStartWidthProperty<TLength>>;
    scrollPaddingBottom?:
        | ScrollPaddingBottomProperty<TLength>
        | Array<ScrollPaddingBottomProperty<TLength>>;
    borderBlockEndWidth?:
        | BorderBlockEndWidthProperty<TLength>
        | Array<BorderBlockEndWidthProperty<TLength>>;
    scrollPaddingInline?:
        | ScrollPaddingInlineProperty<TLength>
        | Array<ScrollPaddingInlineProperty<TLength>>;
    backgroundPositionY?:
        | BackgroundPositionYProperty<TLength>
        | Array<BackgroundPositionYProperty<TLength>>;
    scrollPaddingInlineEnd?:
        | ScrollPaddingInlineEndProperty<TLength>
        | Array<ScrollPaddingInlineEndProperty<TLength>>;
    backgroundPositionX?:
        | BackgroundPositionXProperty<TLength>
        | Array<BackgroundPositionXProperty<TLength>>;
    scrollPaddingInlineStart?:
        | ScrollPaddingInlineStartProperty<TLength>
        | Array<ScrollPaddingInlineStartProperty<TLength>>;
    backgroundPosition?:
        | BackgroundPositionProperty<TLength>
        | Array<BackgroundPositionProperty<TLength>>;
    scrollPaddingLeft?:
        | ScrollPaddingLeftProperty<TLength>
        | Array<ScrollPaddingLeftProperty<TLength>>;
    animationTimingFunction?:
        | AnimationTimingFunctionProperty
        | Array<AnimationTimingFunctionProperty>;
    scrollPaddingRight?:
        | ScrollPaddingRightProperty<TLength>
        | Array<ScrollPaddingRightProperty<TLength>>;
    animationIterationCount?:
        | AnimationIterationCountProperty
        | Array<AnimationIterationCountProperty>;
    marginBottom?: MarginBottomProperty<TLength> | Array<MarginBottomProperty<TLength>>;
    transitionTimingFunction?:
        | TransitionTimingFunctionProperty
        | Array<TransitionTimingFunctionProperty>;
    backfaceVisibility?: BackfaceVisibilityProperty | Array<BackfaceVisibilityProperty>;
    borderImageRepeat?: BorderImageRepeatProperty | Array<BorderImageRepeatProperty>;
    borderImageSlice?: BorderImageSliceProperty | Array<BorderImageSliceProperty>;
    borderImageSource?: BorderImageSourceProperty | Array<BorderImageSourceProperty>;
    borderImageWidth?: BorderImageWidthProperty<TLength> | Array<BorderImageWidthProperty<TLength>>;
    borderInlineColor?: BorderInlineColorProperty | Array<BorderInlineColorProperty>;
    borderInlineEndColor?: BorderInlineEndColorProperty | Array<BorderInlineEndColorProperty>;
    borderInlineEndStyle?: BorderInlineEndStyleProperty | Array<BorderInlineEndStyleProperty>;
    backgroundAttachment?: BackgroundAttachmentProperty | Array<BackgroundAttachmentProperty>;
    borderInlineStartColor?: BorderInlineStartColorProperty | Array<BorderInlineStartColorProperty>;
    borderInlineStartStyle?: BorderInlineStartStyleProperty | Array<BorderInlineStartStyleProperty>;
    backgroundBlendMode?: BackgroundBlendModeProperty | Array<BackgroundBlendModeProperty>;
    borderInlineStyle?: BorderInlineStyleProperty | Array<BorderInlineStyleProperty>;
    backgroundClip?: BackgroundClipProperty | Array<BackgroundClipProperty>;
    borderLeftColor?: BorderLeftColorProperty | Array<BorderLeftColorProperty>;
    borderLeftStyle?: BorderLeftStyleProperty | Array<BorderLeftStyleProperty>;
    borderLeftWidth?: BorderLeftWidthProperty<TLength> | Array<BorderLeftWidthProperty<TLength>>;
    borderRightColor?: BorderRightColorProperty | Array<BorderRightColorProperty>;
    borderRightStyle?: BorderRightStyleProperty | Array<BorderRightStyleProperty>;
    borderRightWidth?: BorderRightWidthProperty<TLength> | Array<BorderRightWidthProperty<TLength>>;
    borderSpacing?: BorderSpacingProperty<TLength> | Array<BorderSpacingProperty<TLength>>;
    backgroundColor?: BackgroundColorProperty | Array<BackgroundColorProperty>;
    backgroundImage?: BackgroundImageProperty | Array<BackgroundImageProperty>;
    borderTopColor?: BorderTopColorProperty | Array<BorderTopColorProperty>;
    backgroundOrigin?: BackgroundOriginProperty | Array<BackgroundOriginProperty>;
    animationDelay?: GlobalsString | Array<GlobalsString>;
    borderTopStyle?: BorderTopStyleProperty | Array<BorderTopStyleProperty>;
    borderTopWidth?: BorderTopWidthProperty<TLength> | Array<BorderTopWidthProperty<TLength>>;
    bottom?: BottomProperty<TLength> | Array<BottomProperty<TLength>>;
    boxDecorationBreak?: BoxDecorationBreakProperty | Array<BoxDecorationBreakProperty>;
    boxShadow?: BoxShadowProperty | Array<BoxShadowProperty>;
    boxSizing?: BoxSizingProperty | Array<BoxSizingProperty>;
    breakAfter?: BreakAfterProperty | Array<BreakAfterProperty>;
    breakBefore?: BreakBeforeProperty | Array<BreakBeforeProperty>;
    breakInside?: BreakInsideProperty | Array<BreakInsideProperty>;
    captionSide?: CaptionSideProperty | Array<CaptionSideProperty>;
    caretColor?: CaretColorProperty | Array<CaretColorProperty>;
    clear?: ClearProperty | Array<ClearProperty>;
    clipPath?: ClipPathProperty | Array<ClipPathProperty>;
    color?: ColorProperty | Array<ColorProperty>;
    colorAdjust?: ColorAdjustProperty | Array<ColorAdjustProperty>;
    columnCount?: ColumnCountProperty | Array<ColumnCountProperty>;
    columnFill?: ColumnFillProperty | Array<ColumnFillProperty>;
    columnGap?: ColumnGapProperty<TLength> | Array<ColumnGapProperty<TLength>>;
    columnRuleColor?: ColumnRuleColorProperty | Array<ColumnRuleColorProperty>;
    columnRuleStyle?: ColumnRuleStyleProperty | Array<ColumnRuleStyleProperty>;
    columnRuleWidth?: ColumnRuleWidthProperty<TLength> | Array<ColumnRuleWidthProperty<TLength>>;
    columnSpan?: ColumnSpanProperty | Array<ColumnSpanProperty>;
    columnWidth?: ColumnWidthProperty<TLength> | Array<ColumnWidthProperty<TLength>>;
    contain?: ContainProperty | Array<ContainProperty>;
    content?: ContentProperty | Array<ContentProperty>;
    counterIncrement?: CounterIncrementProperty | Array<CounterIncrementProperty>;
    counterReset?: CounterResetProperty | Array<CounterResetProperty>;
    counterSet?: CounterSetProperty | Array<CounterSetProperty>;
    cursor?: CursorProperty | Array<CursorProperty>;
    direction?: DirectionProperty | Array<DirectionProperty>;
    display?: DisplayProperty | Array<DisplayProperty>;
    emptyCells?: EmptyCellsProperty | Array<EmptyCellsProperty>;
    filter?: FilterProperty | Array<FilterProperty>;
    flexBasis?: FlexBasisProperty<TLength> | Array<FlexBasisProperty<TLength>>;
    flexDirection?: FlexDirectionProperty | Array<FlexDirectionProperty>;
    flexGrow?: GlobalsNumber | Array<GlobalsNumber>;
    flexShrink?: GlobalsNumber | Array<GlobalsNumber>;
    flexWrap?: FlexWrapProperty | Array<FlexWrapProperty>;
    float?: FloatProperty | Array<FloatProperty>;
    fontFamily?: FontFamilyProperty | Array<FontFamilyProperty>;
    fontFeatureSettings?: FontFeatureSettingsProperty | Array<FontFeatureSettingsProperty>;
    fontKerning?: FontKerningProperty | Array<FontKerningProperty>;
    fontLanguageOverride?: FontLanguageOverrideProperty | Array<FontLanguageOverrideProperty>;
    fontOpticalSizing?: FontOpticalSizingProperty | Array<FontOpticalSizingProperty>;
    fontSize?: FontSizeProperty<TLength> | Array<FontSizeProperty<TLength>>;
    fontSizeAdjust?: FontSizeAdjustProperty | Array<FontSizeAdjustProperty>;
    fontStretch?: FontStretchProperty | Array<FontStretchProperty>;
    fontStyle?: FontStyleProperty | Array<FontStyleProperty>;
    fontSynthesis?: FontSynthesisProperty | Array<FontSynthesisProperty>;
    fontVariant?: FontVariantProperty | Array<FontVariantProperty>;
    fontVariantCaps?: FontVariantCapsProperty | Array<FontVariantCapsProperty>;
    fontVariantEastAsian?: FontVariantEastAsianProperty | Array<FontVariantEastAsianProperty>;
    fontVariantLigatures?: FontVariantLigaturesProperty | Array<FontVariantLigaturesProperty>;
    fontVariantNumeric?: FontVariantNumericProperty | Array<FontVariantNumericProperty>;
    fontVariantPosition?: FontVariantPositionProperty | Array<FontVariantPositionProperty>;
    fontVariationSettings?: FontVariationSettingsProperty | Array<FontVariationSettingsProperty>;
    fontWeight?: FontWeightProperty | Array<FontWeightProperty>;
    gridAutoColumns?: GridAutoColumnsProperty<TLength> | Array<GridAutoColumnsProperty<TLength>>;
    gridAutoFlow?: GridAutoFlowProperty | Array<GridAutoFlowProperty>;
    gridAutoRows?: GridAutoRowsProperty<TLength> | Array<GridAutoRowsProperty<TLength>>;
    gridColumnEnd?: GridColumnEndProperty | Array<GridColumnEndProperty>;
    gridColumnStart?: GridColumnStartProperty | Array<GridColumnStartProperty>;
    gridRowEnd?: GridRowEndProperty | Array<GridRowEndProperty>;
    gridRowStart?: GridRowStartProperty | Array<GridRowStartProperty>;
    gridTemplateAreas?: GridTemplateAreasProperty | Array<GridTemplateAreasProperty>;
    animationDirection?: AnimationDirectionProperty | Array<AnimationDirectionProperty>;
    gridTemplateRows?: GridTemplateRowsProperty<TLength> | Array<GridTemplateRowsProperty<TLength>>;
    hangingPunctuation?: HangingPunctuationProperty | Array<HangingPunctuationProperty>;
    height?: HeightProperty<TLength> | Array<HeightProperty<TLength>>;
    hyphens?: HyphensProperty | Array<HyphensProperty>;
    imageOrientation?: ImageOrientationProperty | Array<ImageOrientationProperty>;
    imageRendering?: ImageRenderingProperty | Array<ImageRenderingProperty>;
    imageResolution?: ImageResolutionProperty | Array<ImageResolutionProperty>;
    initialLetter?: InitialLetterProperty | Array<InitialLetterProperty>;
    inlineSize?: InlineSizeProperty<TLength> | Array<InlineSizeProperty<TLength>>;
    inset?: InsetProperty<TLength> | Array<InsetProperty<TLength>>;
    insetBlock?: InsetBlockProperty<TLength> | Array<InsetBlockProperty<TLength>>;
    insetBlockEnd?: InsetBlockEndProperty<TLength> | Array<InsetBlockEndProperty<TLength>>;
    insetBlockStart?: InsetBlockStartProperty<TLength> | Array<InsetBlockStartProperty<TLength>>;
    insetInline?: InsetInlineProperty<TLength> | Array<InsetInlineProperty<TLength>>;
    insetInlineEnd?: InsetInlineEndProperty<TLength> | Array<InsetInlineEndProperty<TLength>>;
    insetInlineStart?: InsetInlineStartProperty<TLength> | Array<InsetInlineStartProperty<TLength>>;
    isolation?: IsolationProperty | Array<IsolationProperty>;
    justifyContent?: JustifyContentProperty | Array<JustifyContentProperty>;
    justifyItems?: JustifyItemsProperty | Array<JustifyItemsProperty>;
    justifySelf?: JustifySelfProperty | Array<JustifySelfProperty>;
    left?: LeftProperty<TLength> | Array<LeftProperty<TLength>>;
    letterSpacing?: LetterSpacingProperty<TLength> | Array<LetterSpacingProperty<TLength>>;
    lineBreak?: LineBreakProperty | Array<LineBreakProperty>;
    lineHeight?: LineHeightProperty<TLength> | Array<LineHeightProperty<TLength>>;
    lineHeightStep?: LineHeightStepProperty<TLength> | Array<LineHeightStepProperty<TLength>>;
    listStyleImage?: ListStyleImageProperty | Array<ListStyleImageProperty>;
    listStylePosition?: ListStylePositionProperty | Array<ListStylePositionProperty>;
    listStyleType?: ListStyleTypeProperty | Array<ListStyleTypeProperty>;
    marginBlock?: MarginBlockProperty<TLength> | Array<MarginBlockProperty<TLength>>;
    marginBlockEnd?: MarginBlockEndProperty<TLength> | Array<MarginBlockEndProperty<TLength>>;
    marginBlockStart?: MarginBlockStartProperty<TLength> | Array<MarginBlockStartProperty<TLength>>;
    alignItems?: AlignItemsProperty | Array<AlignItemsProperty>;
    marginInline?: MarginInlineProperty<TLength> | Array<MarginInlineProperty<TLength>>;
    marginInlineEnd?: MarginInlineEndProperty<TLength> | Array<MarginInlineEndProperty<TLength>>;
    animationDuration?: GlobalsString | Array<GlobalsString>;
    marginLeft?: MarginLeftProperty<TLength> | Array<MarginLeftProperty<TLength>>;
    marginRight?: MarginRightProperty<TLength> | Array<MarginRightProperty<TLength>>;
    marginTop?: MarginTopProperty<TLength> | Array<MarginTopProperty<TLength>>;
    maskBorderMode?: MaskBorderModeProperty | Array<MaskBorderModeProperty>;
    maskBorderOutset?: MaskBorderOutsetProperty<TLength> | Array<MaskBorderOutsetProperty<TLength>>;
    maskBorderRepeat?: MaskBorderRepeatProperty | Array<MaskBorderRepeatProperty>;
    maskBorderSlice?: MaskBorderSliceProperty | Array<MaskBorderSliceProperty>;
    maskBorderSource?: MaskBorderSourceProperty | Array<MaskBorderSourceProperty>;
    maskBorderWidth?: MaskBorderWidthProperty<TLength> | Array<MaskBorderWidthProperty<TLength>>;
    maskClip?: MaskClipProperty | Array<MaskClipProperty>;
    maskComposite?: MaskCompositeProperty | Array<MaskCompositeProperty>;
    maskImage?: MaskImageProperty | Array<MaskImageProperty>;
    maskMode?: MaskModeProperty | Array<MaskModeProperty>;
    maskOrigin?: MaskOriginProperty | Array<MaskOriginProperty>;
    maskPosition?: MaskPositionProperty<TLength> | Array<MaskPositionProperty<TLength>>;
    maskRepeat?: MaskRepeatProperty | Array<MaskRepeatProperty>;
    maskSize?: MaskSizeProperty<TLength> | Array<MaskSizeProperty<TLength>>;
    maskType?: MaskTypeProperty | Array<MaskTypeProperty>;
    maxBlockSize?: MaxBlockSizeProperty<TLength> | Array<MaxBlockSizeProperty<TLength>>;
    maxHeight?: MaxHeightProperty<TLength> | Array<MaxHeightProperty<TLength>>;
    maxInlineSize?: MaxInlineSizeProperty<TLength> | Array<MaxInlineSizeProperty<TLength>>;
    maxLines?: MaxLinesProperty | Array<MaxLinesProperty>;
    maxWidth?: MaxWidthProperty<TLength> | Array<MaxWidthProperty<TLength>>;
    minBlockSize?: MinBlockSizeProperty<TLength> | Array<MinBlockSizeProperty<TLength>>;
    minHeight?: MinHeightProperty<TLength> | Array<MinHeightProperty<TLength>>;
    minInlineSize?: MinInlineSizeProperty<TLength> | Array<MinInlineSizeProperty<TLength>>;
    minWidth?: MinWidthProperty<TLength> | Array<MinWidthProperty<TLength>>;
    mixBlendMode?: MixBlendModeProperty | Array<MixBlendModeProperty>;
    motionDistance?: OffsetDistanceProperty<TLength> | Array<OffsetDistanceProperty<TLength>>;
    motionPath?: OffsetPathProperty | Array<OffsetPathProperty>;
    motionRotation?: OffsetRotateProperty | Array<OffsetRotateProperty>;
    objectFit?: ObjectFitProperty | Array<ObjectFitProperty>;
    objectPosition?: ObjectPositionProperty<TLength> | Array<ObjectPositionProperty<TLength>>;
    offsetAnchor?: OffsetAnchorProperty<TLength> | Array<OffsetAnchorProperty<TLength>>;
    offsetDistance?: OffsetDistanceProperty<TLength> | Array<OffsetDistanceProperty<TLength>>;
    offsetPath?: OffsetPathProperty | Array<OffsetPathProperty>;
    offsetPosition?: OffsetPositionProperty<TLength> | Array<OffsetPositionProperty<TLength>>;
    offsetRotate?: OffsetRotateProperty | Array<OffsetRotateProperty>;
    offsetRotation?: OffsetRotateProperty | Array<OffsetRotateProperty>;
    opacity?: GlobalsNumber | Array<GlobalsNumber>;
    order?: GlobalsNumber | Array<GlobalsNumber>;
    orphans?: GlobalsNumber | Array<GlobalsNumber>;
    outlineColor?: OutlineColorProperty | Array<OutlineColorProperty>;
    outlineOffset?: OutlineOffsetProperty<TLength> | Array<OutlineOffsetProperty<TLength>>;
    outlineStyle?: OutlineStyleProperty | Array<OutlineStyleProperty>;
    outlineWidth?: OutlineWidthProperty<TLength> | Array<OutlineWidthProperty<TLength>>;
    overflow?: OverflowProperty | Array<OverflowProperty>;
    overflowAnchor?: OverflowAnchorProperty | Array<OverflowAnchorProperty>;
    overflowBlock?: OverflowBlockProperty | Array<OverflowBlockProperty>;
    overflowClipBox?: OverflowClipBoxProperty | Array<OverflowClipBoxProperty>;
    overflowInline?: OverflowInlineProperty | Array<OverflowInlineProperty>;
    overflowWrap?: OverflowWrapProperty | Array<OverflowWrapProperty>;
    overflowX?: OverflowXProperty | Array<OverflowXProperty>;
    overflowY?: OverflowYProperty | Array<OverflowYProperty>;
    overscrollBehavior?: OverscrollBehaviorProperty | Array<OverscrollBehaviorProperty>;
    overscrollBehaviorX?: OverscrollBehaviorXProperty | Array<OverscrollBehaviorXProperty>;
    overscrollBehaviorY?: OverscrollBehaviorYProperty | Array<OverscrollBehaviorYProperty>;
    paddingBlock?: PaddingBlockProperty<TLength> | Array<PaddingBlockProperty<TLength>>;
    paddingBlockEnd?: PaddingBlockEndProperty<TLength> | Array<PaddingBlockEndProperty<TLength>>;
    backgroundRepeat?: BackgroundRepeatProperty | Array<BackgroundRepeatProperty>;
    paddingBottom?: PaddingBottomProperty<TLength> | Array<PaddingBottomProperty<TLength>>;
    paddingInline?: PaddingInlineProperty<TLength> | Array<PaddingInlineProperty<TLength>>;
    paddingInlineEnd?: PaddingInlineEndProperty<TLength> | Array<PaddingInlineEndProperty<TLength>>;
    backgroundSize?: BackgroundSizeProperty<TLength> | Array<BackgroundSizeProperty<TLength>>;
    paddingLeft?: PaddingLeftProperty<TLength> | Array<PaddingLeftProperty<TLength>>;
    paddingRight?: PaddingRightProperty<TLength> | Array<PaddingRightProperty<TLength>>;
    paddingTop?: PaddingTopProperty<TLength> | Array<PaddingTopProperty<TLength>>;
    pageBreakAfter?: PageBreakAfterProperty | Array<PageBreakAfterProperty>;
    pageBreakBefore?: PageBreakBeforeProperty | Array<PageBreakBeforeProperty>;
    pageBreakInside?: PageBreakInsideProperty | Array<PageBreakInsideProperty>;
    paintOrder?: PaintOrderProperty | Array<PaintOrderProperty>;
    perspective?: PerspectiveProperty<TLength> | Array<PerspectiveProperty<TLength>>;
    blockOverflow?: BlockOverflowProperty | Array<BlockOverflowProperty>;
    placeContent?: PlaceContentProperty | Array<PlaceContentProperty>;
    pointerEvents?: PointerEventsProperty | Array<PointerEventsProperty>;
    position?: PositionProperty | Array<PositionProperty>;
    quotes?: QuotesProperty | Array<QuotesProperty>;
    resize?: ResizeProperty | Array<ResizeProperty>;
    right?: RightProperty<TLength> | Array<RightProperty<TLength>>;
    rotate?: RotateProperty | Array<RotateProperty>;
    rowGap?: RowGapProperty<TLength> | Array<RowGapProperty<TLength>>;
    rubyAlign?: RubyAlignProperty | Array<RubyAlignProperty>;
    rubyMerge?: RubyMergeProperty | Array<RubyMergeProperty>;
    rubyPosition?: RubyPositionProperty | Array<RubyPositionProperty>;
    scale?: ScaleProperty | Array<ScaleProperty>;
    scrollBehavior?: ScrollBehaviorProperty | Array<ScrollBehaviorProperty>;
    scrollMargin?: ScrollMarginProperty<TLength> | Array<ScrollMarginProperty<TLength>>;
    blockSize?: BlockSizeProperty<TLength> | Array<BlockSizeProperty<TLength>>;
    borderBlockColor?: BorderBlockColorProperty | Array<BorderBlockColorProperty>;
    borderBlockEndColor?: BorderBlockEndColorProperty | Array<BorderBlockEndColorProperty>;
    borderBlockEndStyle?: BorderBlockEndStyleProperty | Array<BorderBlockEndStyleProperty>;
    animationFillMode?: AnimationFillModeProperty | Array<AnimationFillModeProperty>;
    borderBlockStartColor?: BorderBlockStartColorProperty | Array<BorderBlockStartColorProperty>;
    borderBlockStartStyle?: BorderBlockStartStyleProperty | Array<BorderBlockStartStyleProperty>;
    scrollMarginLeft?: ScrollMarginLeftProperty<TLength> | Array<ScrollMarginLeftProperty<TLength>>;
    alignContent?: AlignContentProperty | Array<AlignContentProperty>;
    scrollMarginTop?: ScrollMarginTopProperty<TLength> | Array<ScrollMarginTopProperty<TLength>>;
    scrollPadding?: ScrollPaddingProperty<TLength> | Array<ScrollPaddingProperty<TLength>>;
    borderBlockStyle?: BorderBlockStyleProperty | Array<BorderBlockStyleProperty>;
    borderBlockWidth?: BorderBlockWidthProperty<TLength> | Array<BorderBlockWidthProperty<TLength>>;
    borderBottomColor?: BorderBottomColorProperty | Array<BorderBottomColorProperty>;
    animationName?: AnimationNameProperty | Array<AnimationNameProperty>;
    animationPlayState?: AnimationPlayStateProperty | Array<AnimationPlayStateProperty>;
    borderBottomStyle?: BorderBottomStyleProperty | Array<BorderBottomStyleProperty>;
    alignSelf?: AlignSelfProperty | Array<AlignSelfProperty>;
    borderCollapse?: BorderCollapseProperty | Array<BorderCollapseProperty>;
    appearance?: AppearanceProperty | Array<AppearanceProperty>;
    scrollPaddingTop?: ScrollPaddingTopProperty<TLength> | Array<ScrollPaddingTopProperty<TLength>>;
    scrollSnapAlign?: ScrollSnapAlignProperty | Array<ScrollSnapAlignProperty>;
    scrollSnapStop?: ScrollSnapStopProperty | Array<ScrollSnapStopProperty>;
    scrollSnapType?: ScrollSnapTypeProperty | Array<ScrollSnapTypeProperty>;
    scrollbarColor?: ScrollbarColorProperty | Array<ScrollbarColorProperty>;
    scrollbarWidth?: ScrollbarWidthProperty | Array<ScrollbarWidthProperty>;
    shapeImageThreshold?: GlobalsNumber | Array<GlobalsNumber>;
    shapeMargin?: ShapeMarginProperty<TLength> | Array<ShapeMarginProperty<TLength>>;
    shapeOutside?: ShapeOutsideProperty | Array<ShapeOutsideProperty>;
    tabSize?: TabSizeProperty<TLength> | Array<TabSizeProperty<TLength>>;
    tableLayout?: TableLayoutProperty | Array<TableLayoutProperty>;
    textAlign?: TextAlignProperty | Array<TextAlignProperty>;
    textAlignLast?: TextAlignLastProperty | Array<TextAlignLastProperty>;
    textCombineUpright?: TextCombineUprightProperty | Array<TextCombineUprightProperty>;
    textDecorationColor?: TextDecorationColorProperty | Array<TextDecorationColorProperty>;
    textDecorationLine?: TextDecorationLineProperty | Array<TextDecorationLineProperty>;
    textDecorationSkip?: TextDecorationSkipProperty | Array<TextDecorationSkipProperty>;
    textDecorationSkipInk?: TextDecorationSkipInkProperty | Array<TextDecorationSkipInkProperty>;
    textDecorationStyle?: TextDecorationStyleProperty | Array<TextDecorationStyleProperty>;
    textEmphasisColor?: TextEmphasisColorProperty | Array<TextEmphasisColorProperty>;
    textEmphasisPosition?: GlobalsString | Array<GlobalsString>;
    textEmphasisStyle?: TextEmphasisStyleProperty | Array<TextEmphasisStyleProperty>;
    textIndent?: TextIndentProperty<TLength> | Array<TextIndentProperty<TLength>>;
    textJustify?: TextJustifyProperty | Array<TextJustifyProperty>;
    textOrientation?: TextOrientationProperty | Array<TextOrientationProperty>;
    textOverflow?: TextOverflowProperty | Array<TextOverflowProperty>;
    textRendering?: TextRenderingProperty | Array<TextRenderingProperty>;
    textShadow?: TextShadowProperty | Array<TextShadowProperty>;
    textSizeAdjust?: TextSizeAdjustProperty | Array<TextSizeAdjustProperty>;
    textTransform?: TextTransformProperty | Array<TextTransformProperty>;
    textUnderlinePosition?: TextUnderlinePositionProperty | Array<TextUnderlinePositionProperty>;
    top?: TopProperty<TLength> | Array<TopProperty<TLength>>;
    touchAction?: TouchActionProperty | Array<TouchActionProperty>;
    transform?: TransformProperty | Array<TransformProperty>;
    transformBox?: TransformBoxProperty | Array<TransformBoxProperty>;
    transformOrigin?: TransformOriginProperty<TLength> | Array<TransformOriginProperty<TLength>>;
    transformStyle?: TransformStyleProperty | Array<TransformStyleProperty>;
    transitionDelay?: GlobalsString | Array<GlobalsString>;
    transitionDuration?: GlobalsString | Array<GlobalsString>;
    transitionProperty?: TransitionPropertyProperty | Array<TransitionPropertyProperty>;
    backdropFilter?: BackdropFilterProperty | Array<BackdropFilterProperty>;
    translate?: TranslateProperty<TLength> | Array<TranslateProperty<TLength>>;
    unicodeBidi?: UnicodeBidiProperty | Array<UnicodeBidiProperty>;
    userSelect?: UserSelectProperty | Array<UserSelectProperty>;
    verticalAlign?: VerticalAlignProperty<TLength> | Array<VerticalAlignProperty<TLength>>;
    visibility?: VisibilityProperty | Array<VisibilityProperty>;
    whiteSpace?: WhiteSpaceProperty | Array<WhiteSpaceProperty>;
    widows?: GlobalsNumber | Array<GlobalsNumber>;
    width?: WidthProperty<TLength> | Array<WidthProperty<TLength>>;
    willChange?: WillChangeProperty | Array<WillChangeProperty>;
    wordBreak?: WordBreakProperty | Array<WordBreakProperty>;
    wordSpacing?: WordSpacingProperty<TLength> | Array<WordSpacingProperty<TLength>>;
    wordWrap?: WordWrapProperty | Array<WordWrapProperty>;
    writingMode?: WritingModeProperty | Array<WritingModeProperty>;
    zIndex?: ZIndexProperty | Array<ZIndexProperty>;
    zoom?: ZoomProperty | Array<ZoomProperty>;
}

export interface StandardShorthandPropertiesFallback<TLength = string | 0> {
    flexFlow?: FlexFlowProperty | Array<FlexFlowProperty>;
    borderInlineStart?:
        | BorderInlineStartProperty<TLength>
        | Array<BorderInlineStartProperty<TLength>>;
    background?: BackgroundProperty<TLength> | Array<BackgroundProperty<TLength>>;
    border?: BorderProperty<TLength> | Array<BorderProperty<TLength>>;
    borderBlock?: BorderBlockProperty<TLength> | Array<BorderBlockProperty<TLength>>;
    borderBlockEnd?: BorderBlockEndProperty<TLength> | Array<BorderBlockEndProperty<TLength>>;
    borderBlockStart?: BorderBlockStartProperty<TLength> | Array<BorderBlockStartProperty<TLength>>;
    borderBottom?: BorderBottomProperty<TLength> | Array<BorderBottomProperty<TLength>>;
    borderColor?: BorderColorProperty | Array<BorderColorProperty>;
    borderImage?: BorderImageProperty | Array<BorderImageProperty>;
    borderInline?: BorderInlineProperty<TLength> | Array<BorderInlineProperty<TLength>>;
    borderInlineEnd?: BorderInlineEndProperty<TLength> | Array<BorderInlineEndProperty<TLength>>;
    all?: Globals | Array<Globals>;
    borderLeft?: BorderLeftProperty<TLength> | Array<BorderLeftProperty<TLength>>;
    borderRadius?: BorderRadiusProperty<TLength> | Array<BorderRadiusProperty<TLength>>;
    borderRight?: BorderRightProperty<TLength> | Array<BorderRightProperty<TLength>>;
    borderStyle?: BorderStyleProperty | Array<BorderStyleProperty>;
    borderTop?: BorderTopProperty<TLength> | Array<BorderTopProperty<TLength>>;
    borderWidth?: BorderWidthProperty<TLength> | Array<BorderWidthProperty<TLength>>;
    columnRule?: ColumnRuleProperty<TLength> | Array<ColumnRuleProperty<TLength>>;
    columns?: ColumnsProperty<TLength> | Array<ColumnsProperty<TLength>>;
    flex?: FlexProperty<TLength> | Array<FlexProperty<TLength>>;
    animation?: AnimationProperty | Array<AnimationProperty>;
    font?: FontProperty | Array<FontProperty>;
    gap?: GapProperty<TLength> | Array<GapProperty<TLength>>;
    grid?: GridProperty | Array<GridProperty>;
    gridArea?: GridAreaProperty | Array<GridAreaProperty>;
    gridColumn?: GridColumnProperty | Array<GridColumnProperty>;
    gridRow?: GridRowProperty | Array<GridRowProperty>;
    gridTemplate?: GridTemplateProperty | Array<GridTemplateProperty>;
    lineClamp?: LineClampProperty | Array<LineClampProperty>;
    listStyle?: ListStyleProperty | Array<ListStyleProperty>;
    margin?: MarginProperty<TLength> | Array<MarginProperty<TLength>>;
    mask?: MaskProperty<TLength> | Array<MaskProperty<TLength>>;
    maskBorder?: MaskBorderProperty | Array<MaskBorderProperty>;
    motion?: OffsetProperty<TLength> | Array<OffsetProperty<TLength>>;
    offset?: OffsetProperty<TLength> | Array<OffsetProperty<TLength>>;
    outline?: OutlineProperty<TLength> | Array<OutlineProperty<TLength>>;
    padding?: PaddingProperty<TLength> | Array<PaddingProperty<TLength>>;
    placeItems?: PlaceItemsProperty | Array<PlaceItemsProperty>;
    placeSelf?: PlaceSelfProperty | Array<PlaceSelfProperty>;
    textDecoration?: TextDecorationProperty | Array<TextDecorationProperty>;
    textEmphasis?: TextEmphasisProperty | Array<TextEmphasisProperty>;
    transition?: TransitionProperty | Array<TransitionProperty>;
}

export type StandardPropertiesFallback<TLength = string | 0> =
    StandardLonghandPropertiesFallback<TLength> & StandardShorthandPropertiesFallback<TLength>;

export interface VendorLonghandPropertiesFallback<TLength = string | 0> {
    WebkitAnimationIterationCount?:
        | AnimationIterationCountProperty
        | Array<AnimationIterationCountProperty>;
    msScrollbarDarkshadowColor?:
        | MsScrollbarDarkshadowColorProperty
        | Array<MsScrollbarDarkshadowColorProperty>;
    msScrollbarHighlightColor?:
        | MsScrollbarHighlightColorProperty
        | Array<MsScrollbarHighlightColorProperty>;
    msTransitionTimingFunction?:
        | TransitionTimingFunctionProperty
        | Array<TransitionTimingFunctionProperty>;
    msScrollbar3dlightColor?:
        | MsScrollbar3dlightColorProperty
        | Array<MsScrollbar3dlightColorProperty>;
    WebkitAnimationTimingFunction?:
        | AnimationTimingFunctionProperty
        | Array<AnimationTimingFunctionProperty>;
    WebkitBorderBeforeColor?:
        | WebkitBorderBeforeColorProperty
        | Array<WebkitBorderBeforeColorProperty>;
    WebkitBorderBeforeStyle?:
        | WebkitBorderBeforeStyleProperty
        | Array<WebkitBorderBeforeStyleProperty>;
    WebkitBorderBeforeWidth?:
        | WebkitBorderBeforeWidthProperty<TLength>
        | Array<WebkitBorderBeforeWidthProperty<TLength>>;
    WebkitBorderBottomLeftRadius?:
        | BorderBottomLeftRadiusProperty<TLength>
        | Array<BorderBottomLeftRadiusProperty<TLength>>;
    msScrollLimitYMin?:
        | MsScrollLimitYMinProperty<TLength>
        | Array<MsScrollLimitYMinProperty<TLength>>;
    WebkitBorderBottomRightRadius?:
        | BorderBottomRightRadiusProperty<TLength>
        | Array<BorderBottomRightRadiusProperty<TLength>>;
    msScrollLimitYMax?:
        | MsScrollLimitYMaxProperty<TLength>
        | Array<MsScrollLimitYMaxProperty<TLength>>;
    WebkitBorderTopLeftRadius?:
        | BorderTopLeftRadiusProperty<TLength>
        | Array<BorderTopLeftRadiusProperty<TLength>>;
    msScrollLimitXMin?:
        | MsScrollLimitXMinProperty<TLength>
        | Array<MsScrollLimitXMinProperty<TLength>>;
    WebkitBorderTopRightRadius?:
        | BorderTopRightRadiusProperty<TLength>
        | Array<BorderTopRightRadiusProperty<TLength>>;
    msScrollLimitXMax?:
        | MsScrollLimitXMaxProperty<TLength>
        | Array<MsScrollLimitXMaxProperty<TLength>>;
    WebkitColumnRuleWidth?:
        | ColumnRuleWidthProperty<TLength>
        | Array<ColumnRuleWidthProperty<TLength>>;
    msHyphenateLimitZone?:
        | MsHyphenateLimitZoneProperty<TLength>
        | Array<MsHyphenateLimitZoneProperty<TLength>>;
    WebkitMarginStart?:
        | MarginInlineStartProperty<TLength>
        | Array<MarginInlineStartProperty<TLength>>;
    MozTransitionTimingFunction?:
        | TransitionTimingFunctionProperty
        | Array<TransitionTimingFunctionProperty>;
    WebkitMaskPosition?:
        | WebkitMaskPositionProperty<TLength>
        | Array<WebkitMaskPositionProperty<TLength>>;
    MozPerspectiveOrigin?:
        | PerspectiveOriginProperty<TLength>
        | Array<PerspectiveOriginProperty<TLength>>;
    WebkitMaskPositionX?:
        | WebkitMaskPositionXProperty<TLength>
        | Array<WebkitMaskPositionXProperty<TLength>>;
    MozPaddingStart?:
        | PaddingInlineStartProperty<TLength>
        | Array<PaddingInlineStartProperty<TLength>>;
    WebkitMaskPositionY?:
        | WebkitMaskPositionYProperty<TLength>
        | Array<WebkitMaskPositionYProperty<TLength>>;
    MozOutlineRadiusTopright?:
        | MozOutlineRadiusToprightProperty<TLength>
        | Array<MozOutlineRadiusToprightProperty<TLength>>;
    WebkitOverflowScrolling?:
        | WebkitOverflowScrollingProperty
        | Array<WebkitOverflowScrollingProperty>;
    MozOutlineRadiusTopleft?:
        | MozOutlineRadiusTopleftProperty<TLength>
        | Array<MozOutlineRadiusTopleftProperty<TLength>>;
    WebkitPaddingStart?:
        | PaddingInlineStartProperty<TLength>
        | Array<PaddingInlineStartProperty<TLength>>;
    MozOutlineRadiusBottomright?:
        | MozOutlineRadiusBottomrightProperty<TLength>
        | Array<MozOutlineRadiusBottomrightProperty<TLength>>;
    WebkitPerspectiveOrigin?:
        | PerspectiveOriginProperty<TLength>
        | Array<PerspectiveOriginProperty<TLength>>;
    MozOutlineRadiusBottomleft?:
        | MozOutlineRadiusBottomleftProperty<TLength>
        | Array<MozOutlineRadiusBottomleftProperty<TLength>>;
    WebkitTapHighlightColor?:
        | WebkitTapHighlightColorProperty
        | Array<WebkitTapHighlightColorProperty>;
    MozBorderEndWidth?:
        | BorderInlineEndWidthProperty<TLength>
        | Array<BorderInlineEndWidthProperty<TLength>>;
    WebkitTextStrokeWidth?:
        | WebkitTextStrokeWidthProperty<TLength>
        | Array<WebkitTextStrokeWidthProperty<TLength>>;
    MozAnimationTimingFunction?:
        | AnimationTimingFunctionProperty
        | Array<AnimationTimingFunctionProperty>;
    WebkitTransformOrigin?:
        | TransformOriginProperty<TLength>
        | Array<TransformOriginProperty<TLength>>;
    MozAnimationIterationCount?:
        | AnimationIterationCountProperty
        | Array<AnimationIterationCountProperty>;
    msTransitionProperty?: TransitionPropertyProperty | Array<TransitionPropertyProperty>;
    WebkitTransitionTimingFunction?:
        | TransitionTimingFunctionProperty
        | Array<TransitionTimingFunctionProperty>;
    MozPaddingEnd?: PaddingInlineEndProperty<TLength> | Array<PaddingInlineEndProperty<TLength>>;
    MozAppearance?: MozAppearanceProperty | Array<MozAppearanceProperty>;
    MozPerspective?: PerspectiveProperty<TLength> | Array<PerspectiveProperty<TLength>>;
    MozBackfaceVisibility?: BackfaceVisibilityProperty | Array<BackfaceVisibilityProperty>;
    MozStackSizing?: MozStackSizingProperty | Array<MozStackSizingProperty>;
    MozTabSize?: TabSizeProperty<TLength> | Array<TabSizeProperty<TLength>>;
    MozTextSizeAdjust?: TextSizeAdjustProperty | Array<TextSizeAdjustProperty>;
    MozTransformOrigin?: TransformOriginProperty<TLength> | Array<TransformOriginProperty<TLength>>;
    MozTransformStyle?: TransformStyleProperty | Array<TransformStyleProperty>;
    MozTransitionDelay?: GlobalsString | Array<GlobalsString>;
    MozTransitionDuration?: GlobalsString | Array<GlobalsString>;
    MozTransitionProperty?: TransitionPropertyProperty | Array<TransitionPropertyProperty>;
    MozBorderBottomColors?: MozBorderBottomColorsProperty | Array<MozBorderBottomColorsProperty>;
    MozUserFocus?: MozUserFocusProperty | Array<MozUserFocusProperty>;
    MozUserModify?: MozUserModifyProperty | Array<MozUserModifyProperty>;
    MozUserSelect?: UserSelectProperty | Array<UserSelectProperty>;
    MozWindowDragging?: MozWindowDraggingProperty | Array<MozWindowDraggingProperty>;
    msAccelerator?: MsAcceleratorProperty | Array<MsAcceleratorProperty>;
    msAlignSelf?: AlignSelfProperty | Array<AlignSelfProperty>;
    msBlockProgression?: MsBlockProgressionProperty | Array<MsBlockProgressionProperty>;
    msContentZoomChaining?: MsContentZoomChainingProperty | Array<MsContentZoomChainingProperty>;
    msContentZoomLimitMax?: GlobalsString | Array<GlobalsString>;
    msContentZoomLimitMin?: GlobalsString | Array<GlobalsString>;
    msContentZoomSnapPoints?: GlobalsString | Array<GlobalsString>;
    msContentZoomSnapType?: MsContentZoomSnapTypeProperty | Array<MsContentZoomSnapTypeProperty>;
    msContentZooming?: MsContentZoomingProperty | Array<MsContentZoomingProperty>;
    msFilter?: GlobalsString | Array<GlobalsString>;
    msFlexDirection?: FlexDirectionProperty | Array<FlexDirectionProperty>;
    msFlexPositive?: GlobalsNumber | Array<GlobalsNumber>;
    msFlowFrom?: MsFlowFromProperty | Array<MsFlowFromProperty>;
    msFlowInto?: MsFlowIntoProperty | Array<MsFlowIntoProperty>;
    msGridColumns?: GridAutoColumnsProperty<TLength> | Array<GridAutoColumnsProperty<TLength>>;
    msGridRows?: GridAutoRowsProperty<TLength> | Array<GridAutoRowsProperty<TLength>>;
    msHighContrastAdjust?: MsHighContrastAdjustProperty | Array<MsHighContrastAdjustProperty>;
    msHyphenateLimitChars?: MsHyphenateLimitCharsProperty | Array<MsHyphenateLimitCharsProperty>;
    msHyphenateLimitLines?: MsHyphenateLimitLinesProperty | Array<MsHyphenateLimitLinesProperty>;
    MozBorderEndColor?: BorderInlineEndColorProperty | Array<BorderInlineEndColorProperty>;
    msHyphens?: HyphensProperty | Array<HyphensProperty>;
    msImeAlign?: MsImeAlignProperty | Array<MsImeAlignProperty>;
    msLineBreak?: LineBreakProperty | Array<LineBreakProperty>;
    msOrder?: GlobalsNumber | Array<GlobalsNumber>;
    msOverflowStyle?: MsOverflowStyleProperty | Array<MsOverflowStyleProperty>;
    msOverflowX?: OverflowXProperty | Array<OverflowXProperty>;
    msOverflowY?: OverflowYProperty | Array<OverflowYProperty>;
    msScrollChaining?: MsScrollChainingProperty | Array<MsScrollChainingProperty>;
    MozBorderEndStyle?: BorderInlineEndStyleProperty | Array<BorderInlineEndStyleProperty>;
    MozAnimationFillMode?: AnimationFillModeProperty | Array<AnimationFillModeProperty>;
    MozBorderLeftColors?: MozBorderLeftColorsProperty | Array<MozBorderLeftColorsProperty>;
    MozBorderRightColors?: MozBorderRightColorsProperty | Array<MozBorderRightColorsProperty>;
    msScrollRails?: MsScrollRailsProperty | Array<MsScrollRailsProperty>;
    msScrollSnapPointsX?: GlobalsString | Array<GlobalsString>;
    msScrollSnapPointsY?: GlobalsString | Array<GlobalsString>;
    msScrollSnapType?: MsScrollSnapTypeProperty | Array<MsScrollSnapTypeProperty>;
    msScrollTranslation?: MsScrollTranslationProperty | Array<MsScrollTranslationProperty>;
    MozBorderStartColor?: BorderInlineStartColorProperty | Array<BorderInlineStartColorProperty>;
    msScrollbarArrowColor?: MsScrollbarArrowColorProperty | Array<MsScrollbarArrowColorProperty>;
    msScrollbarBaseColor?: MsScrollbarBaseColorProperty | Array<MsScrollbarBaseColorProperty>;
    MozBorderStartStyle?: BorderInlineStartStyleProperty | Array<BorderInlineStartStyleProperty>;
    msScrollbarFaceColor?: MsScrollbarFaceColorProperty | Array<MsScrollbarFaceColorProperty>;
    MozBorderTopColors?: MozBorderTopColorsProperty | Array<MozBorderTopColorsProperty>;
    msScrollbarShadowColor?: MsScrollbarShadowColorProperty | Array<MsScrollbarShadowColorProperty>;
    msScrollbarTrackColor?: MsScrollbarTrackColorProperty | Array<MsScrollbarTrackColorProperty>;
    msTextAutospace?: MsTextAutospaceProperty | Array<MsTextAutospaceProperty>;
    msTextCombineHorizontal?: TextCombineUprightProperty | Array<TextCombineUprightProperty>;
    msTextOverflow?: TextOverflowProperty | Array<TextOverflowProperty>;
    msTouchAction?: TouchActionProperty | Array<TouchActionProperty>;
    msTouchSelect?: MsTouchSelectProperty | Array<MsTouchSelectProperty>;
    msTransform?: TransformProperty | Array<TransformProperty>;
    msTransformOrigin?: TransformOriginProperty<TLength> | Array<TransformOriginProperty<TLength>>;
    msTransitionDelay?: GlobalsString | Array<GlobalsString>;
    msTransitionDuration?: GlobalsString | Array<GlobalsString>;
    MozAnimationDirection?: AnimationDirectionProperty | Array<AnimationDirectionProperty>;
    MozBoxSizing?: BoxSizingProperty | Array<BoxSizingProperty>;
    msUserSelect?: MsUserSelectProperty | Array<MsUserSelectProperty>;
    msWordBreak?: WordBreakProperty | Array<WordBreakProperty>;
    msWrapFlow?: MsWrapFlowProperty | Array<MsWrapFlowProperty>;
    msWrapMargin?: MsWrapMarginProperty<TLength> | Array<MsWrapMarginProperty<TLength>>;
    msWrapThrough?: MsWrapThroughProperty | Array<MsWrapThroughProperty>;
    msWritingMode?: WritingModeProperty | Array<WritingModeProperty>;
    OObjectFit?: ObjectFitProperty | Array<ObjectFitProperty>;
    OObjectPosition?: ObjectPositionProperty<TLength> | Array<ObjectPositionProperty<TLength>>;
    OTabSize?: TabSizeProperty<TLength> | Array<TabSizeProperty<TLength>>;
    OTextOverflow?: TextOverflowProperty | Array<TextOverflowProperty>;
    OTransformOrigin?: TransformOriginProperty<TLength> | Array<TransformOriginProperty<TLength>>;
    WebkitAlignContent?: AlignContentProperty | Array<AlignContentProperty>;
    WebkitAlignItems?: AlignItemsProperty | Array<AlignItemsProperty>;
    WebkitAlignSelf?: AlignSelfProperty | Array<AlignSelfProperty>;
    WebkitAnimationDelay?: GlobalsString | Array<GlobalsString>;
    WebkitAnimationDirection?: AnimationDirectionProperty | Array<AnimationDirectionProperty>;
    WebkitAnimationDuration?: GlobalsString | Array<GlobalsString>;
    WebkitAnimationFillMode?: AnimationFillModeProperty | Array<AnimationFillModeProperty>;
    MozColumnCount?: ColumnCountProperty | Array<ColumnCountProperty>;
    WebkitAnimationName?: AnimationNameProperty | Array<AnimationNameProperty>;
    WebkitAnimationPlayState?: AnimationPlayStateProperty | Array<AnimationPlayStateProperty>;
    MozColumnFill?: ColumnFillProperty | Array<ColumnFillProperty>;
    WebkitAppearance?: WebkitAppearanceProperty | Array<WebkitAppearanceProperty>;
    WebkitBackdropFilter?: BackdropFilterProperty | Array<BackdropFilterProperty>;
    WebkitBackfaceVisibility?: BackfaceVisibilityProperty | Array<BackfaceVisibilityProperty>;
    WebkitBackgroundClip?: BackgroundClipProperty | Array<BackgroundClipProperty>;
    WebkitBackgroundOrigin?: BackgroundOriginProperty | Array<BackgroundOriginProperty>;
    WebkitBackgroundSize?: BackgroundSizeProperty<TLength> | Array<BackgroundSizeProperty<TLength>>;
    MozColumnGap?: ColumnGapProperty<TLength> | Array<ColumnGapProperty<TLength>>;
    MozColumnRuleColor?: ColumnRuleColorProperty | Array<ColumnRuleColorProperty>;
    MozColumnRuleStyle?: ColumnRuleStyleProperty | Array<ColumnRuleStyleProperty>;
    MozColumnRuleWidth?: ColumnRuleWidthProperty<TLength> | Array<ColumnRuleWidthProperty<TLength>>;
    MozColumnWidth?: ColumnWidthProperty<TLength> | Array<ColumnWidthProperty<TLength>>;
    WebkitBorderImageSlice?: BorderImageSliceProperty | Array<BorderImageSliceProperty>;
    MozContextProperties?: MozContextPropertiesProperty | Array<MozContextPropertiesProperty>;
    MozFloatEdge?: MozFloatEdgeProperty | Array<MozFloatEdgeProperty>;
    WebkitBoxDecorationBreak?: BoxDecorationBreakProperty | Array<BoxDecorationBreakProperty>;
    WebkitBoxReflect?: WebkitBoxReflectProperty<TLength> | Array<WebkitBoxReflectProperty<TLength>>;
    WebkitBoxShadow?: BoxShadowProperty | Array<BoxShadowProperty>;
    WebkitBoxSizing?: BoxSizingProperty | Array<BoxSizingProperty>;
    WebkitClipPath?: ClipPathProperty | Array<ClipPathProperty>;
    WebkitColorAdjust?: ColorAdjustProperty | Array<ColorAdjustProperty>;
    WebkitColumnCount?: ColumnCountProperty | Array<ColumnCountProperty>;
    WebkitColumnFill?: ColumnFillProperty | Array<ColumnFillProperty>;
    WebkitColumnGap?: ColumnGapProperty<TLength> | Array<ColumnGapProperty<TLength>>;
    WebkitColumnRuleColor?: ColumnRuleColorProperty | Array<ColumnRuleColorProperty>;
    WebkitColumnRuleStyle?: ColumnRuleStyleProperty | Array<ColumnRuleStyleProperty>;
    MozFontFeatureSettings?: FontFeatureSettingsProperty | Array<FontFeatureSettingsProperty>;
    WebkitColumnSpan?: ColumnSpanProperty | Array<ColumnSpanProperty>;
    WebkitColumnWidth?: ColumnWidthProperty<TLength> | Array<ColumnWidthProperty<TLength>>;
    WebkitFilter?: FilterProperty | Array<FilterProperty>;
    WebkitFlexBasis?: FlexBasisProperty<TLength> | Array<FlexBasisProperty<TLength>>;
    WebkitFlexDirection?: FlexDirectionProperty | Array<FlexDirectionProperty>;
    WebkitFlexGrow?: GlobalsNumber | Array<GlobalsNumber>;
    WebkitFlexShrink?: GlobalsNumber | Array<GlobalsNumber>;
    WebkitFlexWrap?: FlexWrapProperty | Array<FlexWrapProperty>;
    WebkitFontFeatureSettings?: FontFeatureSettingsProperty | Array<FontFeatureSettingsProperty>;
    WebkitFontKerning?: FontKerningProperty | Array<FontKerningProperty>;
    WebkitFontVariantLigatures?: FontVariantLigaturesProperty | Array<FontVariantLigaturesProperty>;
    WebkitHyphens?: HyphensProperty | Array<HyphensProperty>;
    WebkitJustifyContent?: JustifyContentProperty | Array<JustifyContentProperty>;
    WebkitLineBreak?: LineBreakProperty | Array<LineBreakProperty>;
    WebkitLineClamp?: WebkitLineClampProperty | Array<WebkitLineClampProperty>;
    WebkitMarginEnd?: MarginInlineEndProperty<TLength> | Array<MarginInlineEndProperty<TLength>>;
    MozFontLanguageOverride?: FontLanguageOverrideProperty | Array<FontLanguageOverrideProperty>;
    WebkitMaskAttachment?: WebkitMaskAttachmentProperty | Array<WebkitMaskAttachmentProperty>;
    WebkitMaskClip?: WebkitMaskClipProperty | Array<WebkitMaskClipProperty>;
    WebkitMaskComposite?: WebkitMaskCompositeProperty | Array<WebkitMaskCompositeProperty>;
    WebkitMaskImage?: WebkitMaskImageProperty | Array<WebkitMaskImageProperty>;
    WebkitMaskOrigin?: WebkitMaskOriginProperty | Array<WebkitMaskOriginProperty>;
    MozForceBrokenImageIcon?: GlobalsNumber | Array<GlobalsNumber>;
    MozHyphens?: HyphensProperty | Array<HyphensProperty>;
    MozImageRegion?: MozImageRegionProperty | Array<MozImageRegionProperty>;
    WebkitMaskRepeat?: WebkitMaskRepeatProperty | Array<WebkitMaskRepeatProperty>;
    WebkitMaskRepeatX?: WebkitMaskRepeatXProperty | Array<WebkitMaskRepeatXProperty>;
    WebkitMaskRepeatY?: WebkitMaskRepeatYProperty | Array<WebkitMaskRepeatYProperty>;
    WebkitMaskSize?: WebkitMaskSizeProperty<TLength> | Array<WebkitMaskSizeProperty<TLength>>;
    WebkitMaxInlineSize?: MaxInlineSizeProperty<TLength> | Array<MaxInlineSizeProperty<TLength>>;
    WebkitOrder?: GlobalsNumber | Array<GlobalsNumber>;
    MozMarginEnd?: MarginInlineEndProperty<TLength> | Array<MarginInlineEndProperty<TLength>>;
    WebkitPaddingEnd?: PaddingInlineEndProperty<TLength> | Array<PaddingInlineEndProperty<TLength>>;
    MozMarginStart?: MarginInlineStartProperty<TLength> | Array<MarginInlineStartProperty<TLength>>;
    WebkitPerspective?: PerspectiveProperty<TLength> | Array<PerspectiveProperty<TLength>>;
    MozOrient?: MozOrientProperty | Array<MozOrientProperty>;
    WebkitScrollSnapType?: ScrollSnapTypeProperty | Array<ScrollSnapTypeProperty>;
    WebkitShapeMargin?: ShapeMarginProperty<TLength> | Array<ShapeMarginProperty<TLength>>;
    MozAnimationDelay?: GlobalsString | Array<GlobalsString>;
    WebkitTextCombine?: TextCombineUprightProperty | Array<TextCombineUprightProperty>;
    WebkitTextDecorationColor?: TextDecorationColorProperty | Array<TextDecorationColorProperty>;
    WebkitTextDecorationLine?: TextDecorationLineProperty | Array<TextDecorationLineProperty>;
    WebkitTextDecorationSkip?: TextDecorationSkipProperty | Array<TextDecorationSkipProperty>;
    WebkitTextDecorationStyle?: TextDecorationStyleProperty | Array<TextDecorationStyleProperty>;
    WebkitTextEmphasisColor?: TextEmphasisColorProperty | Array<TextEmphasisColorProperty>;
    WebkitTextEmphasisPosition?: GlobalsString | Array<GlobalsString>;
    WebkitTextEmphasisStyle?: TextEmphasisStyleProperty | Array<TextEmphasisStyleProperty>;
    WebkitTextFillColor?: WebkitTextFillColorProperty | Array<WebkitTextFillColorProperty>;
    WebkitTextOrientation?: TextOrientationProperty | Array<TextOrientationProperty>;
    WebkitTextSizeAdjust?: TextSizeAdjustProperty | Array<TextSizeAdjustProperty>;
    WebkitTextStrokeColor?: WebkitTextStrokeColorProperty | Array<WebkitTextStrokeColorProperty>;
    MozAnimationName?: AnimationNameProperty | Array<AnimationNameProperty>;
    WebkitTouchCallout?: WebkitTouchCalloutProperty | Array<WebkitTouchCalloutProperty>;
    WebkitTransform?: TransformProperty | Array<TransformProperty>;
    MozAnimationPlayState?: AnimationPlayStateProperty | Array<AnimationPlayStateProperty>;
    WebkitTransformStyle?: TransformStyleProperty | Array<TransformStyleProperty>;
    WebkitTransitionDelay?: GlobalsString | Array<GlobalsString>;
    WebkitTransitionDuration?: GlobalsString | Array<GlobalsString>;
    WebkitTransitionProperty?: TransitionPropertyProperty | Array<TransitionPropertyProperty>;
    MozAnimationDuration?: GlobalsString | Array<GlobalsString>;
    WebkitUserModify?: WebkitUserModifyProperty | Array<WebkitUserModifyProperty>;
    WebkitUserSelect?: UserSelectProperty | Array<UserSelectProperty>;
    WebkitWritingMode?: WritingModeProperty | Array<WritingModeProperty>;
}

export interface VendorShorthandPropertiesFallback<TLength = string | 0> {
    WebkitAnimation?: AnimationProperty | Array<AnimationProperty>;
    WebkitBorderBefore?:
        | WebkitBorderBeforeProperty<TLength>
        | Array<WebkitBorderBeforeProperty<TLength>>;
    MozColumnRule?: ColumnRuleProperty<TLength> | Array<ColumnRuleProperty<TLength>>;
    MozColumns?: ColumnsProperty<TLength> | Array<ColumnsProperty<TLength>>;
    MozTransition?: TransitionProperty | Array<TransitionProperty>;
    msContentZoomLimit?: GlobalsString | Array<GlobalsString>;
    msContentZoomSnap?: MsContentZoomSnapProperty | Array<MsContentZoomSnapProperty>;
    msFlex?: FlexProperty<TLength> | Array<FlexProperty<TLength>>;
    msScrollLimit?: GlobalsString | Array<GlobalsString>;
    msScrollSnapX?: GlobalsString | Array<GlobalsString>;
    msScrollSnapY?: GlobalsString | Array<GlobalsString>;
    msTransition?: TransitionProperty | Array<TransitionProperty>;
    MozBorderImage?: BorderImageProperty | Array<BorderImageProperty>;
    MozAnimation?: AnimationProperty | Array<AnimationProperty>;
    WebkitBorderImage?: BorderImageProperty | Array<BorderImageProperty>;
    WebkitBorderRadius?: BorderRadiusProperty<TLength> | Array<BorderRadiusProperty<TLength>>;
    WebkitColumnRule?: ColumnRuleProperty<TLength> | Array<ColumnRuleProperty<TLength>>;
    WebkitColumns?: ColumnsProperty<TLength> | Array<ColumnsProperty<TLength>>;
    WebkitFlex?: FlexProperty<TLength> | Array<FlexProperty<TLength>>;
    WebkitFlexFlow?: FlexFlowProperty | Array<FlexFlowProperty>;
    WebkitMask?: WebkitMaskProperty<TLength> | Array<WebkitMaskProperty<TLength>>;
    WebkitTextEmphasis?: TextEmphasisProperty | Array<TextEmphasisProperty>;
    WebkitTextStroke?: WebkitTextStrokeProperty<TLength> | Array<WebkitTextStrokeProperty<TLength>>;
    WebkitTransition?: TransitionProperty | Array<TransitionProperty>;
}

export type VendorPropertiesFallback<TLength = string | 0> =
    VendorLonghandPropertiesFallback<TLength> & VendorShorthandPropertiesFallback<TLength>;

export interface ObsoletePropertiesFallback<TLength = string | 0> {
    MozBorderRadiusBottomright?:
        | BorderBottomRightRadiusProperty<TLength>
        | Array<BorderBottomRightRadiusProperty<TLength>>;
    scrollSnapCoordinate?:
        | ScrollSnapCoordinateProperty<TLength>
        | Array<ScrollSnapCoordinateProperty<TLength>>;
    scrollSnapDestination?:
        | ScrollSnapDestinationProperty<TLength>
        | Array<ScrollSnapDestinationProperty<TLength>>;
    MozBorderRadiusBottomleft?:
        | BorderBottomLeftRadiusProperty<TLength>
        | Array<BorderBottomLeftRadiusProperty<TLength>>;
    offsetInlineStart?:
        | InsetInlineStartProperty<TLength>
        | Array<InsetInlineStartProperty<TLength>>;
    MozBorderRadiusTopleft?:
        | BorderTopLeftRadiusProperty<TLength>
        | Array<BorderTopLeftRadiusProperty<TLength>>;
    MozBorderRadiusTopright?:
        | BorderTopRightRadiusProperty<TLength>
        | Array<BorderTopRightRadiusProperty<TLength>>;
    OAnimationIterationCount?:
        | AnimationIterationCountProperty
        | Array<AnimationIterationCountProperty>;
    OAnimationTimingFunction?:
        | AnimationTimingFunctionProperty
        | Array<AnimationTimingFunctionProperty>;
    MozBoxAlign?: BoxAlignProperty | Array<BoxAlignProperty>;
    OTransitionTimingFunction?:
        | TransitionTimingFunctionProperty
        | Array<TransitionTimingFunctionProperty>;
    gridGap?: GridGapProperty<TLength> | Array<GridGapProperty<TLength>>;
    gridRowGap?: GridRowGapProperty<TLength> | Array<GridRowGapProperty<TLength>>;
    imeMode?: ImeModeProperty | Array<ImeModeProperty>;
    offsetBlock?: InsetBlockProperty<TLength> | Array<InsetBlockProperty<TLength>>;
    offsetBlockEnd?: InsetBlockEndProperty<TLength> | Array<InsetBlockEndProperty<TLength>>;
    offsetBlockStart?: InsetBlockStartProperty<TLength> | Array<InsetBlockStartProperty<TLength>>;
    offsetInline?: InsetInlineProperty<TLength> | Array<InsetInlineProperty<TLength>>;
    offsetInlineEnd?: InsetInlineEndProperty<TLength> | Array<InsetInlineEndProperty<TLength>>;
    boxAlign?: BoxAlignProperty | Array<BoxAlignProperty>;
    boxFlex?: GlobalsNumber | Array<GlobalsNumber>;
    boxFlexGroup?: GlobalsNumber | Array<GlobalsNumber>;
    scrollSnapPointsX?: ScrollSnapPointsXProperty | Array<ScrollSnapPointsXProperty>;
    scrollSnapPointsY?: ScrollSnapPointsYProperty | Array<ScrollSnapPointsYProperty>;
    scrollSnapTypeX?: ScrollSnapTypeXProperty | Array<ScrollSnapTypeXProperty>;
    scrollSnapTypeY?: ScrollSnapTypeYProperty | Array<ScrollSnapTypeYProperty>;
    textCombineHorizontal?: TextCombineUprightProperty | Array<TextCombineUprightProperty>;
    KhtmlBoxAlign?: BoxAlignProperty | Array<BoxAlignProperty>;
    KhtmlBoxDirection?: BoxDirectionProperty | Array<BoxDirectionProperty>;
    KhtmlBoxFlex?: GlobalsNumber | Array<GlobalsNumber>;
    KhtmlBoxFlexGroup?: GlobalsNumber | Array<GlobalsNumber>;
    KhtmlBoxLines?: BoxLinesProperty | Array<BoxLinesProperty>;
    KhtmlBoxOrdinalGroup?: GlobalsNumber | Array<GlobalsNumber>;
    KhtmlBoxOrient?: BoxOrientProperty | Array<BoxOrientProperty>;
    KhtmlBoxPack?: BoxPackProperty | Array<BoxPackProperty>;
    KhtmlLineBreak?: LineBreakProperty | Array<LineBreakProperty>;
    KhtmlOpacity?: GlobalsNumber | Array<GlobalsNumber>;
    KhtmlUserSelect?: UserSelectProperty | Array<UserSelectProperty>;
    MozBackgroundClip?: BackgroundClipProperty | Array<BackgroundClipProperty>;
    MozBackgroundInlinePolicy?: BoxDecorationBreakProperty | Array<BoxDecorationBreakProperty>;
    MozBackgroundOrigin?: BackgroundOriginProperty | Array<BackgroundOriginProperty>;
    MozBackgroundSize?: BackgroundSizeProperty<TLength> | Array<BackgroundSizeProperty<TLength>>;
    MozBinding?: MozBindingProperty | Array<MozBindingProperty>;
    MozBorderRadius?: BorderRadiusProperty<TLength> | Array<BorderRadiusProperty<TLength>>;
    boxLines?: BoxLinesProperty | Array<BoxLinesProperty>;
    boxOrdinalGroup?: GlobalsNumber | Array<GlobalsNumber>;
    boxOrient?: BoxOrientProperty | Array<BoxOrientProperty>;
    boxPack?: BoxPackProperty | Array<BoxPackProperty>;
    boxDirection?: BoxDirectionProperty | Array<BoxDirectionProperty>;
    MozBoxDirection?: BoxDirectionProperty | Array<BoxDirectionProperty>;
    MozBoxFlex?: GlobalsNumber | Array<GlobalsNumber>;
    MozBoxOrdinalGroup?: GlobalsNumber | Array<GlobalsNumber>;
    MozBoxOrient?: BoxOrientProperty | Array<BoxOrientProperty>;
    MozBoxPack?: BoxPackProperty | Array<BoxPackProperty>;
    MozBoxShadow?: BoxShadowProperty | Array<BoxShadowProperty>;
    MozOpacity?: GlobalsNumber | Array<GlobalsNumber>;
    MozOutline?: OutlineProperty<TLength> | Array<OutlineProperty<TLength>>;
    MozOutlineColor?: OutlineColorProperty | Array<OutlineColorProperty>;
    MozOutlineRadius?: MozOutlineRadiusProperty<TLength> | Array<MozOutlineRadiusProperty<TLength>>;
    MozOutlineStyle?: OutlineStyleProperty | Array<OutlineStyleProperty>;
    MozOutlineWidth?: OutlineWidthProperty<TLength> | Array<OutlineWidthProperty<TLength>>;
    MozTextAlignLast?: TextAlignLastProperty | Array<TextAlignLastProperty>;
    MozTextBlink?: MozTextBlinkProperty | Array<MozTextBlinkProperty>;
    MozTextDecorationColor?: TextDecorationColorProperty | Array<TextDecorationColorProperty>;
    MozTextDecorationLine?: TextDecorationLineProperty | Array<TextDecorationLineProperty>;
    MozTextDecorationStyle?: TextDecorationStyleProperty | Array<TextDecorationStyleProperty>;
    MozUserInput?: MozUserInputProperty | Array<MozUserInputProperty>;
    MozWindowShadow?: MozWindowShadowProperty | Array<MozWindowShadowProperty>;
    msImeMode?: ImeModeProperty | Array<ImeModeProperty>;
    OAnimation?: AnimationProperty | Array<AnimationProperty>;
    OAnimationDelay?: GlobalsString | Array<GlobalsString>;
    OAnimationDirection?: AnimationDirectionProperty | Array<AnimationDirectionProperty>;
    OAnimationDuration?: GlobalsString | Array<GlobalsString>;
    OAnimationFillMode?: AnimationFillModeProperty | Array<AnimationFillModeProperty>;
    clip?: ClipProperty | Array<ClipProperty>;
    OAnimationName?: AnimationNameProperty | Array<AnimationNameProperty>;
    OAnimationPlayState?: AnimationPlayStateProperty | Array<AnimationPlayStateProperty>;
    fontVariantAlternates?: FontVariantAlternatesProperty | Array<FontVariantAlternatesProperty>;
    OBackgroundSize?: BackgroundSizeProperty<TLength> | Array<BackgroundSizeProperty<TLength>>;
    OBorderImage?: BorderImageProperty | Array<BorderImageProperty>;
    OTransform?: TransformProperty | Array<TransformProperty>;
    OTransition?: TransitionProperty | Array<TransitionProperty>;
    OTransitionDelay?: GlobalsString | Array<GlobalsString>;
    OTransitionDuration?: GlobalsString | Array<GlobalsString>;
    OTransitionProperty?: TransitionPropertyProperty | Array<TransitionPropertyProperty>;
    gridColumnGap?: GridColumnGapProperty<TLength> | Array<GridColumnGapProperty<TLength>>;
    WebkitBoxAlign?: BoxAlignProperty | Array<BoxAlignProperty>;
    WebkitBoxDirection?: BoxDirectionProperty | Array<BoxDirectionProperty>;
    WebkitBoxFlex?: GlobalsNumber | Array<GlobalsNumber>;
    WebkitBoxFlexGroup?: GlobalsNumber | Array<GlobalsNumber>;
    WebkitBoxLines?: BoxLinesProperty | Array<BoxLinesProperty>;
    WebkitBoxOrdinalGroup?: GlobalsNumber | Array<GlobalsNumber>;
    WebkitBoxOrient?: BoxOrientProperty | Array<BoxOrientProperty>;
    WebkitBoxPack?: BoxPackProperty | Array<BoxPackProperty>;
    WebkitScrollSnapPointsX?: ScrollSnapPointsXProperty | Array<ScrollSnapPointsXProperty>;
    WebkitScrollSnapPointsY?: ScrollSnapPointsYProperty | Array<ScrollSnapPointsYProperty>;
}

export interface SvgPropertiesFallback<TLength = string | 0> {
    lineHeight?: LineHeightProperty<TLength> | Array<LineHeightProperty<TLength>>;
    glyphOrientationVertical?:
        | GlyphOrientationVerticalProperty
        | Array<GlyphOrientationVerticalProperty>;
    clip?: ClipProperty | Array<ClipProperty>;
    clipPath?: ClipPathProperty | Array<ClipPathProperty>;
    clipRule?: ClipRuleProperty | Array<ClipRuleProperty>;
    color?: ColorProperty | Array<ColorProperty>;
    colorInterpolation?: ColorInterpolationProperty | Array<ColorInterpolationProperty>;
    colorRendering?: ColorRenderingProperty | Array<ColorRenderingProperty>;
    cursor?: CursorProperty | Array<CursorProperty>;
    direction?: DirectionProperty | Array<DirectionProperty>;
    display?: DisplayProperty | Array<DisplayProperty>;
    dominantBaseline?: DominantBaselineProperty | Array<DominantBaselineProperty>;
    fill?: FillProperty | Array<FillProperty>;
    fillOpacity?: GlobalsNumber | Array<GlobalsNumber>;
    fillRule?: FillRuleProperty | Array<FillRuleProperty>;
    filter?: FilterProperty | Array<FilterProperty>;
    floodColor?: FloodColorProperty | Array<FloodColorProperty>;
    floodOpacity?: GlobalsNumber | Array<GlobalsNumber>;
    font?: FontProperty | Array<FontProperty>;
    fontFamily?: FontFamilyProperty | Array<FontFamilyProperty>;
    fontSize?: FontSizeProperty<TLength> | Array<FontSizeProperty<TLength>>;
    fontSizeAdjust?: FontSizeAdjustProperty | Array<FontSizeAdjustProperty>;
    fontStretch?: FontStretchProperty | Array<FontStretchProperty>;
    fontStyle?: FontStyleProperty | Array<FontStyleProperty>;
    fontVariant?: FontVariantProperty | Array<FontVariantProperty>;
    fontWeight?: FontWeightProperty | Array<FontWeightProperty>;
    alignmentBaseline?: AlignmentBaselineProperty | Array<AlignmentBaselineProperty>;
    imageRendering?: ImageRenderingProperty | Array<ImageRenderingProperty>;
    letterSpacing?: LetterSpacingProperty<TLength> | Array<LetterSpacingProperty<TLength>>;
    lightingColor?: LightingColorProperty | Array<LightingColorProperty>;
    baselineShift?: BaselineShiftProperty<TLength> | Array<BaselineShiftProperty<TLength>>;
    marker?: MarkerProperty | Array<MarkerProperty>;
    markerEnd?: MarkerEndProperty | Array<MarkerEndProperty>;
    markerMid?: MarkerMidProperty | Array<MarkerMidProperty>;
    markerStart?: MarkerStartProperty | Array<MarkerStartProperty>;
    mask?: MaskProperty<TLength> | Array<MaskProperty<TLength>>;
    opacity?: GlobalsNumber | Array<GlobalsNumber>;
    overflow?: OverflowProperty | Array<OverflowProperty>;
    paintOrder?: PaintOrderProperty | Array<PaintOrderProperty>;
    pointerEvents?: PointerEventsProperty | Array<PointerEventsProperty>;
    shapeRendering?: ShapeRenderingProperty | Array<ShapeRenderingProperty>;
    stopColor?: StopColorProperty | Array<StopColorProperty>;
    stopOpacity?: GlobalsNumber | Array<GlobalsNumber>;
    stroke?: StrokeProperty | Array<StrokeProperty>;
    strokeDasharray?: StrokeDasharrayProperty<TLength> | Array<StrokeDasharrayProperty<TLength>>;
    strokeDashoffset?: StrokeDashoffsetProperty<TLength> | Array<StrokeDashoffsetProperty<TLength>>;
    strokeLinecap?: StrokeLinecapProperty | Array<StrokeLinecapProperty>;
    strokeLinejoin?: StrokeLinejoinProperty | Array<StrokeLinejoinProperty>;
    strokeMiterlimit?: GlobalsNumber | Array<GlobalsNumber>;
    strokeOpacity?: GlobalsNumber | Array<GlobalsNumber>;
    strokeWidth?: StrokeWidthProperty<TLength> | Array<StrokeWidthProperty<TLength>>;
    textAnchor?: TextAnchorProperty | Array<TextAnchorProperty>;
    textDecoration?: TextDecorationProperty | Array<TextDecorationProperty>;
    textRendering?: TextRenderingProperty | Array<TextRenderingProperty>;
    unicodeBidi?: UnicodeBidiProperty | Array<UnicodeBidiProperty>;
    vectorEffect?: VectorEffectProperty | Array<VectorEffectProperty>;
    visibility?: VisibilityProperty | Array<VisibilityProperty>;
    whiteSpace?: WhiteSpaceProperty | Array<WhiteSpaceProperty>;
    wordSpacing?: WordSpacingProperty<TLength> | Array<WordSpacingProperty<TLength>>;
    writingMode?: WritingModeProperty | Array<WritingModeProperty>;
}

export type PropertiesFallback<TLength = string | 0> = StandardPropertiesFallback<TLength> &
    VendorPropertiesFallback<TLength> &
    ObsoletePropertiesFallback<TLength> &
    SvgPropertiesFallback<TLength>;

export interface StandardLonghandPropertiesHyphenFallback<TLength = string | 0> {
    ['inset-block-start']?:
        | InsetBlockStartProperty<TLength>
        | Array<InsetBlockStartProperty<TLength>>;
    ['grid-auto-columns']?:
        | GridAutoColumnsProperty<TLength>
        | Array<GridAutoColumnsProperty<TLength>>;
    ['grid-template-columns']?:
        | GridTemplateColumnsProperty<TLength>
        | Array<GridTemplateColumnsProperty<TLength>>;
    ['grid-template-rows']?:
        | GridTemplateRowsProperty<TLength>
        | Array<GridTemplateRowsProperty<TLength>>;
    ['font-variation-settings']?:
        | FontVariationSettingsProperty
        | Array<FontVariationSettingsProperty>;
    ['inset-inline-start']?:
        | InsetInlineStartProperty<TLength>
        | Array<InsetInlineStartProperty<TLength>>;
    ['margin-block-start']?:
        | MarginBlockStartProperty<TLength>
        | Array<MarginBlockStartProperty<TLength>>;
    ['margin-inline-end']?:
        | MarginInlineEndProperty<TLength>
        | Array<MarginInlineEndProperty<TLength>>;
    ['margin-inline-start']?:
        | MarginInlineStartProperty<TLength>
        | Array<MarginInlineStartProperty<TLength>>;
    ['mask-border-outset']?:
        | MaskBorderOutsetProperty<TLength>
        | Array<MaskBorderOutsetProperty<TLength>>;
    ['column-rule-width']?:
        | ColumnRuleWidthProperty<TLength>
        | Array<ColumnRuleWidthProperty<TLength>>;
    ['mask-border-width']?:
        | MaskBorderWidthProperty<TLength>
        | Array<MaskBorderWidthProperty<TLength>>;
    ['border-top-right-radius']?:
        | BorderTopRightRadiusProperty<TLength>
        | Array<BorderTopRightRadiusProperty<TLength>>;
    ['padding-block-end']?:
        | PaddingBlockEndProperty<TLength>
        | Array<PaddingBlockEndProperty<TLength>>;
    ['border-top-left-radius']?:
        | BorderTopLeftRadiusProperty<TLength>
        | Array<BorderTopLeftRadiusProperty<TLength>>;
    ['padding-block-start']?:
        | PaddingBlockStartProperty<TLength>
        | Array<PaddingBlockStartProperty<TLength>>;
    ['border-start-start-radius']?:
        | BorderStartStartRadiusProperty<TLength>
        | Array<BorderStartStartRadiusProperty<TLength>>;
    ['padding-inline-end']?:
        | PaddingInlineEndProperty<TLength>
        | Array<PaddingInlineEndProperty<TLength>>;
    ['border-start-end-radius']?:
        | BorderStartEndRadiusProperty<TLength>
        | Array<BorderStartEndRadiusProperty<TLength>>;
    ['padding-inline-start']?:
        | PaddingInlineStartProperty<TLength>
        | Array<PaddingInlineStartProperty<TLength>>;
    ['border-right-width']?:
        | BorderRightWidthProperty<TLength>
        | Array<BorderRightWidthProperty<TLength>>;
    ['perspective-origin']?:
        | PerspectiveOriginProperty<TLength>
        | Array<PerspectiveOriginProperty<TLength>>;
    ['border-left-width']?:
        | BorderLeftWidthProperty<TLength>
        | Array<BorderLeftWidthProperty<TLength>>;
    ['scroll-margin-block']?:
        | ScrollMarginBlockProperty<TLength>
        | Array<ScrollMarginBlockProperty<TLength>>;
    ['border-inline-width']?:
        | BorderInlineWidthProperty<TLength>
        | Array<BorderInlineWidthProperty<TLength>>;
    ['scroll-margin-block-end']?:
        | ScrollMarginBlockEndProperty<TLength>
        | Array<ScrollMarginBlockEndProperty<TLength>>;
    ['border-inline-start-width']?:
        | BorderInlineStartWidthProperty<TLength>
        | Array<BorderInlineStartWidthProperty<TLength>>;
    ['scroll-margin-block-start']?:
        | ScrollMarginBlockStartProperty<TLength>
        | Array<ScrollMarginBlockStartProperty<TLength>>;
    ['border-inline-start-style']?:
        | BorderInlineStartStyleProperty
        | Array<BorderInlineStartStyleProperty>;
    ['scroll-margin-bottom']?:
        | ScrollMarginBottomProperty<TLength>
        | Array<ScrollMarginBottomProperty<TLength>>;
    ['border-inline-start-color']?:
        | BorderInlineStartColorProperty
        | Array<BorderInlineStartColorProperty>;
    ['scroll-margin-inline']?:
        | ScrollMarginInlineProperty<TLength>
        | Array<ScrollMarginInlineProperty<TLength>>;
    ['border-inline-end-width']?:
        | BorderInlineEndWidthProperty<TLength>
        | Array<BorderInlineEndWidthProperty<TLength>>;
    ['scroll-margin-inline-end']?:
        | ScrollMarginInlineEndProperty<TLength>
        | Array<ScrollMarginInlineEndProperty<TLength>>;
    ['border-image-width']?:
        | BorderImageWidthProperty<TLength>
        | Array<BorderImageWidthProperty<TLength>>;
    ['scroll-margin-inline-start']?:
        | ScrollMarginInlineStartProperty<TLength>
        | Array<ScrollMarginInlineStartProperty<TLength>>;
    ['border-image-outset']?:
        | BorderImageOutsetProperty<TLength>
        | Array<BorderImageOutsetProperty<TLength>>;
    ['scroll-margin-left']?:
        | ScrollMarginLeftProperty<TLength>
        | Array<ScrollMarginLeftProperty<TLength>>;
    ['border-end-start-radius']?:
        | BorderEndStartRadiusProperty<TLength>
        | Array<BorderEndStartRadiusProperty<TLength>>;
    ['scroll-margin-right']?:
        | ScrollMarginRightProperty<TLength>
        | Array<ScrollMarginRightProperty<TLength>>;
    ['border-end-end-radius']?:
        | BorderEndEndRadiusProperty<TLength>
        | Array<BorderEndEndRadiusProperty<TLength>>;
    ['scroll-margin-top']?:
        | ScrollMarginTopProperty<TLength>
        | Array<ScrollMarginTopProperty<TLength>>;
    ['border-bottom-width']?:
        | BorderBottomWidthProperty<TLength>
        | Array<BorderBottomWidthProperty<TLength>>;
    ['scroll-padding-block']?:
        | ScrollPaddingBlockProperty<TLength>
        | Array<ScrollPaddingBlockProperty<TLength>>;
    ['border-bottom-right-radius']?:
        | BorderBottomRightRadiusProperty<TLength>
        | Array<BorderBottomRightRadiusProperty<TLength>>;
    ['scroll-padding-block-end']?:
        | ScrollPaddingBlockEndProperty<TLength>
        | Array<ScrollPaddingBlockEndProperty<TLength>>;
    ['border-bottom-left-radius']?:
        | BorderBottomLeftRadiusProperty<TLength>
        | Array<BorderBottomLeftRadiusProperty<TLength>>;
    ['scroll-padding-block-start']?:
        | ScrollPaddingBlockStartProperty<TLength>
        | Array<ScrollPaddingBlockStartProperty<TLength>>;
    ['border-block-width']?:
        | BorderBlockWidthProperty<TLength>
        | Array<BorderBlockWidthProperty<TLength>>;
    ['scroll-padding-bottom']?:
        | ScrollPaddingBottomProperty<TLength>
        | Array<ScrollPaddingBottomProperty<TLength>>;
    ['border-block-start-width']?:
        | BorderBlockStartWidthProperty<TLength>
        | Array<BorderBlockStartWidthProperty<TLength>>;
    ['scroll-padding-inline']?:
        | ScrollPaddingInlineProperty<TLength>
        | Array<ScrollPaddingInlineProperty<TLength>>;
    ['border-block-start-style']?:
        | BorderBlockStartStyleProperty
        | Array<BorderBlockStartStyleProperty>;
    ['scroll-padding-inline-end']?:
        | ScrollPaddingInlineEndProperty<TLength>
        | Array<ScrollPaddingInlineEndProperty<TLength>>;
    ['border-block-start-color']?:
        | BorderBlockStartColorProperty
        | Array<BorderBlockStartColorProperty>;
    ['scroll-padding-inline-start']?:
        | ScrollPaddingInlineStartProperty<TLength>
        | Array<ScrollPaddingInlineStartProperty<TLength>>;
    ['border-block-end-width']?:
        | BorderBlockEndWidthProperty<TLength>
        | Array<BorderBlockEndWidthProperty<TLength>>;
    ['scroll-padding-left']?:
        | ScrollPaddingLeftProperty<TLength>
        | Array<ScrollPaddingLeftProperty<TLength>>;
    ['background-position-y']?:
        | BackgroundPositionYProperty<TLength>
        | Array<BackgroundPositionYProperty<TLength>>;
    ['scroll-padding-right']?:
        | ScrollPaddingRightProperty<TLength>
        | Array<ScrollPaddingRightProperty<TLength>>;
    ['background-position-x']?:
        | BackgroundPositionXProperty<TLength>
        | Array<BackgroundPositionXProperty<TLength>>;
    ['scroll-padding-top']?:
        | ScrollPaddingTopProperty<TLength>
        | Array<ScrollPaddingTopProperty<TLength>>;
    ['background-position']?:
        | BackgroundPositionProperty<TLength>
        | Array<BackgroundPositionProperty<TLength>>;
    ['text-decoration-skip-ink']?:
        | TextDecorationSkipInkProperty
        | Array<TextDecorationSkipInkProperty>;
    ['animation-timing-function']?:
        | AnimationTimingFunctionProperty
        | Array<AnimationTimingFunctionProperty>;
    ['text-underline-position']?:
        | TextUnderlinePositionProperty
        | Array<TextUnderlinePositionProperty>;
    ['animation-iteration-count']?:
        | AnimationIterationCountProperty
        | Array<AnimationIterationCountProperty>;
    ['margin-bottom']?: MarginBottomProperty<TLength> | Array<MarginBottomProperty<TLength>>;
    ['transition-timing-function']?:
        | TransitionTimingFunctionProperty
        | Array<TransitionTimingFunctionProperty>;
    ['border-block-end-color']?: BorderBlockEndColorProperty | Array<BorderBlockEndColorProperty>;
    ['border-top-style']?: BorderTopStyleProperty | Array<BorderTopStyleProperty>;
    ['border-top-width']?: BorderTopWidthProperty<TLength> | Array<BorderTopWidthProperty<TLength>>;
    bottom?: BottomProperty<TLength> | Array<BottomProperty<TLength>>;
    ['box-decoration-break']?: BoxDecorationBreakProperty | Array<BoxDecorationBreakProperty>;
    ['box-shadow']?: BoxShadowProperty | Array<BoxShadowProperty>;
    ['box-sizing']?: BoxSizingProperty | Array<BoxSizingProperty>;
    ['break-after']?: BreakAfterProperty | Array<BreakAfterProperty>;
    ['break-before']?: BreakBeforeProperty | Array<BreakBeforeProperty>;
    ['break-inside']?: BreakInsideProperty | Array<BreakInsideProperty>;
    ['caption-side']?: CaptionSideProperty | Array<CaptionSideProperty>;
    ['caret-color']?: CaretColorProperty | Array<CaretColorProperty>;
    clear?: ClearProperty | Array<ClearProperty>;
    ['clip-path']?: ClipPathProperty | Array<ClipPathProperty>;
    color?: ColorProperty | Array<ColorProperty>;
    ['color-adjust']?: ColorAdjustProperty | Array<ColorAdjustProperty>;
    ['column-count']?: ColumnCountProperty | Array<ColumnCountProperty>;
    ['column-fill']?: ColumnFillProperty | Array<ColumnFillProperty>;
    ['column-gap']?: ColumnGapProperty<TLength> | Array<ColumnGapProperty<TLength>>;
    ['column-rule-color']?: ColumnRuleColorProperty | Array<ColumnRuleColorProperty>;
    ['column-rule-style']?: ColumnRuleStyleProperty | Array<ColumnRuleStyleProperty>;
    ['border-block-end-style']?: BorderBlockEndStyleProperty | Array<BorderBlockEndStyleProperty>;
    ['column-span']?: ColumnSpanProperty | Array<ColumnSpanProperty>;
    ['column-width']?: ColumnWidthProperty<TLength> | Array<ColumnWidthProperty<TLength>>;
    contain?: ContainProperty | Array<ContainProperty>;
    content?: ContentProperty | Array<ContentProperty>;
    ['counter-increment']?: CounterIncrementProperty | Array<CounterIncrementProperty>;
    ['counter-reset']?: CounterResetProperty | Array<CounterResetProperty>;
    ['counter-set']?: CounterSetProperty | Array<CounterSetProperty>;
    cursor?: CursorProperty | Array<CursorProperty>;
    direction?: DirectionProperty | Array<DirectionProperty>;
    display?: DisplayProperty | Array<DisplayProperty>;
    ['empty-cells']?: EmptyCellsProperty | Array<EmptyCellsProperty>;
    filter?: FilterProperty | Array<FilterProperty>;
    ['flex-basis']?: FlexBasisProperty<TLength> | Array<FlexBasisProperty<TLength>>;
    ['flex-direction']?: FlexDirectionProperty | Array<FlexDirectionProperty>;
    ['flex-grow']?: GlobalsNumber | Array<GlobalsNumber>;
    ['flex-shrink']?: GlobalsNumber | Array<GlobalsNumber>;
    ['flex-wrap']?: FlexWrapProperty | Array<FlexWrapProperty>;
    float?: FloatProperty | Array<FloatProperty>;
    ['font-family']?: FontFamilyProperty | Array<FontFamilyProperty>;
    ['font-feature-settings']?: FontFeatureSettingsProperty | Array<FontFeatureSettingsProperty>;
    ['font-kerning']?: FontKerningProperty | Array<FontKerningProperty>;
    ['font-language-override']?: FontLanguageOverrideProperty | Array<FontLanguageOverrideProperty>;
    ['font-optical-sizing']?: FontOpticalSizingProperty | Array<FontOpticalSizingProperty>;
    ['font-size']?: FontSizeProperty<TLength> | Array<FontSizeProperty<TLength>>;
    ['font-size-adjust']?: FontSizeAdjustProperty | Array<FontSizeAdjustProperty>;
    ['font-stretch']?: FontStretchProperty | Array<FontStretchProperty>;
    ['font-style']?: FontStyleProperty | Array<FontStyleProperty>;
    ['font-synthesis']?: FontSynthesisProperty | Array<FontSynthesisProperty>;
    ['font-variant']?: FontVariantProperty | Array<FontVariantProperty>;
    ['font-variant-caps']?: FontVariantCapsProperty | Array<FontVariantCapsProperty>;
    ['font-variant-east-asian']?:
        | FontVariantEastAsianProperty
        | Array<FontVariantEastAsianProperty>;
    ['font-variant-ligatures']?: FontVariantLigaturesProperty | Array<FontVariantLigaturesProperty>;
    ['font-variant-numeric']?: FontVariantNumericProperty | Array<FontVariantNumericProperty>;
    ['font-variant-position']?: FontVariantPositionProperty | Array<FontVariantPositionProperty>;
    ['animation-fill-mode']?: AnimationFillModeProperty | Array<AnimationFillModeProperty>;
    ['font-weight']?: FontWeightProperty | Array<FontWeightProperty>;
    ['align-content']?: AlignContentProperty | Array<AlignContentProperty>;
    ['grid-auto-flow']?: GridAutoFlowProperty | Array<GridAutoFlowProperty>;
    ['grid-auto-rows']?: GridAutoRowsProperty<TLength> | Array<GridAutoRowsProperty<TLength>>;
    ['grid-column-end']?: GridColumnEndProperty | Array<GridColumnEndProperty>;
    ['grid-column-start']?: GridColumnStartProperty | Array<GridColumnStartProperty>;
    ['grid-row-end']?: GridRowEndProperty | Array<GridRowEndProperty>;
    ['grid-row-start']?: GridRowStartProperty | Array<GridRowStartProperty>;
    ['grid-template-areas']?: GridTemplateAreasProperty | Array<GridTemplateAreasProperty>;
    ['animation-name']?: AnimationNameProperty | Array<AnimationNameProperty>;
    ['animation-play-state']?: AnimationPlayStateProperty | Array<AnimationPlayStateProperty>;
    ['hanging-punctuation']?: HangingPunctuationProperty | Array<HangingPunctuationProperty>;
    height?: HeightProperty<TLength> | Array<HeightProperty<TLength>>;
    hyphens?: HyphensProperty | Array<HyphensProperty>;
    ['image-orientation']?: ImageOrientationProperty | Array<ImageOrientationProperty>;
    ['image-rendering']?: ImageRenderingProperty | Array<ImageRenderingProperty>;
    ['image-resolution']?: ImageResolutionProperty | Array<ImageResolutionProperty>;
    ['initial-letter']?: InitialLetterProperty | Array<InitialLetterProperty>;
    ['inline-size']?: InlineSizeProperty<TLength> | Array<InlineSizeProperty<TLength>>;
    inset?: InsetProperty<TLength> | Array<InsetProperty<TLength>>;
    ['inset-block']?: InsetBlockProperty<TLength> | Array<InsetBlockProperty<TLength>>;
    ['inset-block-end']?: InsetBlockEndProperty<TLength> | Array<InsetBlockEndProperty<TLength>>;
    ['border-block-style']?: BorderBlockStyleProperty | Array<BorderBlockStyleProperty>;
    ['inset-inline']?: InsetInlineProperty<TLength> | Array<InsetInlineProperty<TLength>>;
    ['inset-inline-end']?: InsetInlineEndProperty<TLength> | Array<InsetInlineEndProperty<TLength>>;
    ['align-self']?: AlignSelfProperty | Array<AlignSelfProperty>;
    isolation?: IsolationProperty | Array<IsolationProperty>;
    ['justify-content']?: JustifyContentProperty | Array<JustifyContentProperty>;
    ['justify-items']?: JustifyItemsProperty | Array<JustifyItemsProperty>;
    ['justify-self']?: JustifySelfProperty | Array<JustifySelfProperty>;
    left?: LeftProperty<TLength> | Array<LeftProperty<TLength>>;
    ['letter-spacing']?: LetterSpacingProperty<TLength> | Array<LetterSpacingProperty<TLength>>;
    ['line-break']?: LineBreakProperty | Array<LineBreakProperty>;
    ['line-height']?: LineHeightProperty<TLength> | Array<LineHeightProperty<TLength>>;
    ['line-height-step']?: LineHeightStepProperty<TLength> | Array<LineHeightStepProperty<TLength>>;
    ['list-style-image']?: ListStyleImageProperty | Array<ListStyleImageProperty>;
    ['list-style-position']?: ListStylePositionProperty | Array<ListStylePositionProperty>;
    ['list-style-type']?: ListStyleTypeProperty | Array<ListStyleTypeProperty>;
    ['margin-block']?: MarginBlockProperty<TLength> | Array<MarginBlockProperty<TLength>>;
    ['margin-block-end']?: MarginBlockEndProperty<TLength> | Array<MarginBlockEndProperty<TLength>>;
    ['border-bottom-color']?: BorderBottomColorProperty | Array<BorderBottomColorProperty>;
    ['align-items']?: AlignItemsProperty | Array<AlignItemsProperty>;
    ['margin-inline']?: MarginInlineProperty<TLength> | Array<MarginInlineProperty<TLength>>;
    appearance?: AppearanceProperty | Array<AppearanceProperty>;
    ['backdrop-filter']?: BackdropFilterProperty | Array<BackdropFilterProperty>;
    ['margin-left']?: MarginLeftProperty<TLength> | Array<MarginLeftProperty<TLength>>;
    ['margin-right']?: MarginRightProperty<TLength> | Array<MarginRightProperty<TLength>>;
    ['margin-top']?: MarginTopProperty<TLength> | Array<MarginTopProperty<TLength>>;
    ['mask-border-mode']?: MaskBorderModeProperty | Array<MaskBorderModeProperty>;
    ['border-bottom-style']?: BorderBottomStyleProperty | Array<BorderBottomStyleProperty>;
    ['mask-border-repeat']?: MaskBorderRepeatProperty | Array<MaskBorderRepeatProperty>;
    ['mask-border-slice']?: MaskBorderSliceProperty | Array<MaskBorderSliceProperty>;
    ['mask-border-source']?: MaskBorderSourceProperty | Array<MaskBorderSourceProperty>;
    ['backface-visibility']?: BackfaceVisibilityProperty | Array<BackfaceVisibilityProperty>;
    ['mask-clip']?: MaskClipProperty | Array<MaskClipProperty>;
    ['mask-composite']?: MaskCompositeProperty | Array<MaskCompositeProperty>;
    ['mask-image']?: MaskImageProperty | Array<MaskImageProperty>;
    ['mask-mode']?: MaskModeProperty | Array<MaskModeProperty>;
    ['mask-origin']?: MaskOriginProperty | Array<MaskOriginProperty>;
    ['mask-position']?: MaskPositionProperty<TLength> | Array<MaskPositionProperty<TLength>>;
    ['mask-repeat']?: MaskRepeatProperty | Array<MaskRepeatProperty>;
    ['mask-size']?: MaskSizeProperty<TLength> | Array<MaskSizeProperty<TLength>>;
    ['mask-type']?: MaskTypeProperty | Array<MaskTypeProperty>;
    ['max-block-size']?: MaxBlockSizeProperty<TLength> | Array<MaxBlockSizeProperty<TLength>>;
    ['max-height']?: MaxHeightProperty<TLength> | Array<MaxHeightProperty<TLength>>;
    ['max-inline-size']?: MaxInlineSizeProperty<TLength> | Array<MaxInlineSizeProperty<TLength>>;
    ['max-lines']?: MaxLinesProperty | Array<MaxLinesProperty>;
    ['max-width']?: MaxWidthProperty<TLength> | Array<MaxWidthProperty<TLength>>;
    ['min-block-size']?: MinBlockSizeProperty<TLength> | Array<MinBlockSizeProperty<TLength>>;
    ['min-height']?: MinHeightProperty<TLength> | Array<MinHeightProperty<TLength>>;
    ['min-inline-size']?: MinInlineSizeProperty<TLength> | Array<MinInlineSizeProperty<TLength>>;
    ['min-width']?: MinWidthProperty<TLength> | Array<MinWidthProperty<TLength>>;
    ['mix-blend-mode']?: MixBlendModeProperty | Array<MixBlendModeProperty>;
    ['motion-distance']?: OffsetDistanceProperty<TLength> | Array<OffsetDistanceProperty<TLength>>;
    ['motion-path']?: OffsetPathProperty | Array<OffsetPathProperty>;
    ['motion-rotation']?: OffsetRotateProperty | Array<OffsetRotateProperty>;
    ['object-fit']?: ObjectFitProperty | Array<ObjectFitProperty>;
    ['object-position']?: ObjectPositionProperty<TLength> | Array<ObjectPositionProperty<TLength>>;
    ['offset-anchor']?: OffsetAnchorProperty<TLength> | Array<OffsetAnchorProperty<TLength>>;
    ['offset-distance']?: OffsetDistanceProperty<TLength> | Array<OffsetDistanceProperty<TLength>>;
    ['offset-path']?: OffsetPathProperty | Array<OffsetPathProperty>;
    ['offset-position']?: OffsetPositionProperty<TLength> | Array<OffsetPositionProperty<TLength>>;
    ['offset-rotate']?: OffsetRotateProperty | Array<OffsetRotateProperty>;
    ['offset-rotation']?: OffsetRotateProperty | Array<OffsetRotateProperty>;
    opacity?: GlobalsNumber | Array<GlobalsNumber>;
    order?: GlobalsNumber | Array<GlobalsNumber>;
    orphans?: GlobalsNumber | Array<GlobalsNumber>;
    ['outline-color']?: OutlineColorProperty | Array<OutlineColorProperty>;
    ['outline-offset']?: OutlineOffsetProperty<TLength> | Array<OutlineOffsetProperty<TLength>>;
    ['outline-style']?: OutlineStyleProperty | Array<OutlineStyleProperty>;
    ['outline-width']?: OutlineWidthProperty<TLength> | Array<OutlineWidthProperty<TLength>>;
    overflow?: OverflowProperty | Array<OverflowProperty>;
    ['overflow-anchor']?: OverflowAnchorProperty | Array<OverflowAnchorProperty>;
    ['overflow-block']?: OverflowBlockProperty | Array<OverflowBlockProperty>;
    ['overflow-clip-box']?: OverflowClipBoxProperty | Array<OverflowClipBoxProperty>;
    ['overflow-inline']?: OverflowInlineProperty | Array<OverflowInlineProperty>;
    ['overflow-wrap']?: OverflowWrapProperty | Array<OverflowWrapProperty>;
    ['overflow-x']?: OverflowXProperty | Array<OverflowXProperty>;
    ['overflow-y']?: OverflowYProperty | Array<OverflowYProperty>;
    ['overscroll-behavior']?: OverscrollBehaviorProperty | Array<OverscrollBehaviorProperty>;
    ['overscroll-behavior-x']?: OverscrollBehaviorXProperty | Array<OverscrollBehaviorXProperty>;
    ['overscroll-behavior-y']?: OverscrollBehaviorYProperty | Array<OverscrollBehaviorYProperty>;
    ['padding-block']?: PaddingBlockProperty<TLength> | Array<PaddingBlockProperty<TLength>>;
    ['border-collapse']?: BorderCollapseProperty | Array<BorderCollapseProperty>;
    ['background-attachment']?: BackgroundAttachmentProperty | Array<BackgroundAttachmentProperty>;
    ['padding-bottom']?: PaddingBottomProperty<TLength> | Array<PaddingBottomProperty<TLength>>;
    ['padding-inline']?: PaddingInlineProperty<TLength> | Array<PaddingInlineProperty<TLength>>;
    ['background-blend-mode']?: BackgroundBlendModeProperty | Array<BackgroundBlendModeProperty>;
    ['background-clip']?: BackgroundClipProperty | Array<BackgroundClipProperty>;
    ['padding-left']?: PaddingLeftProperty<TLength> | Array<PaddingLeftProperty<TLength>>;
    ['padding-right']?: PaddingRightProperty<TLength> | Array<PaddingRightProperty<TLength>>;
    ['padding-top']?: PaddingTopProperty<TLength> | Array<PaddingTopProperty<TLength>>;
    ['page-break-after']?: PageBreakAfterProperty | Array<PageBreakAfterProperty>;
    ['page-break-before']?: PageBreakBeforeProperty | Array<PageBreakBeforeProperty>;
    ['page-break-inside']?: PageBreakInsideProperty | Array<PageBreakInsideProperty>;
    ['paint-order']?: PaintOrderProperty | Array<PaintOrderProperty>;
    perspective?: PerspectiveProperty<TLength> | Array<PerspectiveProperty<TLength>>;
    ['border-image-repeat']?: BorderImageRepeatProperty | Array<BorderImageRepeatProperty>;
    ['place-content']?: PlaceContentProperty | Array<PlaceContentProperty>;
    ['pointer-events']?: PointerEventsProperty | Array<PointerEventsProperty>;
    position?: PositionProperty | Array<PositionProperty>;
    quotes?: QuotesProperty | Array<QuotesProperty>;
    resize?: ResizeProperty | Array<ResizeProperty>;
    right?: RightProperty<TLength> | Array<RightProperty<TLength>>;
    rotate?: RotateProperty | Array<RotateProperty>;
    ['row-gap']?: RowGapProperty<TLength> | Array<RowGapProperty<TLength>>;
    ['ruby-align']?: RubyAlignProperty | Array<RubyAlignProperty>;
    ['ruby-merge']?: RubyMergeProperty | Array<RubyMergeProperty>;
    ['ruby-position']?: RubyPositionProperty | Array<RubyPositionProperty>;
    scale?: ScaleProperty | Array<ScaleProperty>;
    ['scroll-behavior']?: ScrollBehaviorProperty | Array<ScrollBehaviorProperty>;
    ['scroll-margin']?: ScrollMarginProperty<TLength> | Array<ScrollMarginProperty<TLength>>;
    ['border-image-slice']?: BorderImageSliceProperty | Array<BorderImageSliceProperty>;
    ['border-image-source']?: BorderImageSourceProperty | Array<BorderImageSourceProperty>;
    ['background-color']?: BackgroundColorProperty | Array<BackgroundColorProperty>;
    ['border-inline-color']?: BorderInlineColorProperty | Array<BorderInlineColorProperty>;
    ['border-inline-end-color']?:
        | BorderInlineEndColorProperty
        | Array<BorderInlineEndColorProperty>;
    ['border-inline-end-style']?:
        | BorderInlineEndStyleProperty
        | Array<BorderInlineEndStyleProperty>;
    ['background-image']?: BackgroundImageProperty | Array<BackgroundImageProperty>;
    ['background-origin']?: BackgroundOriginProperty | Array<BackgroundOriginProperty>;
    ['animation-delay']?: GlobalsString | Array<GlobalsString>;
    ['animation-direction']?: AnimationDirectionProperty | Array<AnimationDirectionProperty>;
    ['scroll-padding']?: ScrollPaddingProperty<TLength> | Array<ScrollPaddingProperty<TLength>>;
    ['border-inline-style']?: BorderInlineStyleProperty | Array<BorderInlineStyleProperty>;
    ['animation-duration']?: GlobalsString | Array<GlobalsString>;
    ['border-left-color']?: BorderLeftColorProperty | Array<BorderLeftColorProperty>;
    ['border-left-style']?: BorderLeftStyleProperty | Array<BorderLeftStyleProperty>;
    ['background-repeat']?: BackgroundRepeatProperty | Array<BackgroundRepeatProperty>;
    ['border-right-color']?: BorderRightColorProperty | Array<BorderRightColorProperty>;
    ['border-right-style']?: BorderRightStyleProperty | Array<BorderRightStyleProperty>;
    ['background-size']?: BackgroundSizeProperty<TLength> | Array<BackgroundSizeProperty<TLength>>;
    ['border-spacing']?: BorderSpacingProperty<TLength> | Array<BorderSpacingProperty<TLength>>;
    ['block-overflow']?: BlockOverflowProperty | Array<BlockOverflowProperty>;
    ['scroll-snap-align']?: ScrollSnapAlignProperty | Array<ScrollSnapAlignProperty>;
    ['scroll-snap-stop']?: ScrollSnapStopProperty | Array<ScrollSnapStopProperty>;
    ['scroll-snap-type']?: ScrollSnapTypeProperty | Array<ScrollSnapTypeProperty>;
    ['scrollbar-color']?: ScrollbarColorProperty | Array<ScrollbarColorProperty>;
    ['scrollbar-width']?: ScrollbarWidthProperty | Array<ScrollbarWidthProperty>;
    ['shape-image-threshold']?: GlobalsNumber | Array<GlobalsNumber>;
    ['shape-margin']?: ShapeMarginProperty<TLength> | Array<ShapeMarginProperty<TLength>>;
    ['shape-outside']?: ShapeOutsideProperty | Array<ShapeOutsideProperty>;
    ['tab-size']?: TabSizeProperty<TLength> | Array<TabSizeProperty<TLength>>;
    ['table-layout']?: TableLayoutProperty | Array<TableLayoutProperty>;
    ['text-align']?: TextAlignProperty | Array<TextAlignProperty>;
    ['text-align-last']?: TextAlignLastProperty | Array<TextAlignLastProperty>;
    ['text-combine-upright']?: TextCombineUprightProperty | Array<TextCombineUprightProperty>;
    ['text-decoration-color']?: TextDecorationColorProperty | Array<TextDecorationColorProperty>;
    ['text-decoration-line']?: TextDecorationLineProperty | Array<TextDecorationLineProperty>;
    ['text-decoration-skip']?: TextDecorationSkipProperty | Array<TextDecorationSkipProperty>;
    ['block-size']?: BlockSizeProperty<TLength> | Array<BlockSizeProperty<TLength>>;
    ['text-decoration-style']?: TextDecorationStyleProperty | Array<TextDecorationStyleProperty>;
    ['text-emphasis-color']?: TextEmphasisColorProperty | Array<TextEmphasisColorProperty>;
    ['text-emphasis-position']?: GlobalsString | Array<GlobalsString>;
    ['text-emphasis-style']?: TextEmphasisStyleProperty | Array<TextEmphasisStyleProperty>;
    ['text-indent']?: TextIndentProperty<TLength> | Array<TextIndentProperty<TLength>>;
    ['text-justify']?: TextJustifyProperty | Array<TextJustifyProperty>;
    ['text-orientation']?: TextOrientationProperty | Array<TextOrientationProperty>;
    ['text-overflow']?: TextOverflowProperty | Array<TextOverflowProperty>;
    ['text-rendering']?: TextRenderingProperty | Array<TextRenderingProperty>;
    ['text-shadow']?: TextShadowProperty | Array<TextShadowProperty>;
    ['text-size-adjust']?: TextSizeAdjustProperty | Array<TextSizeAdjustProperty>;
    ['text-transform']?: TextTransformProperty | Array<TextTransformProperty>;
    ['border-top-color']?: BorderTopColorProperty | Array<BorderTopColorProperty>;
    top?: TopProperty<TLength> | Array<TopProperty<TLength>>;
    ['touch-action']?: TouchActionProperty | Array<TouchActionProperty>;
    transform?: TransformProperty | Array<TransformProperty>;
    ['transform-box']?: TransformBoxProperty | Array<TransformBoxProperty>;
    ['transform-origin']?:
        | TransformOriginProperty<TLength>
        | Array<TransformOriginProperty<TLength>>;
    ['transform-style']?: TransformStyleProperty | Array<TransformStyleProperty>;
    ['transition-delay']?: GlobalsString | Array<GlobalsString>;
    ['transition-duration']?: GlobalsString | Array<GlobalsString>;
    ['transition-property']?: TransitionPropertyProperty | Array<TransitionPropertyProperty>;
    ['border-block-color']?: BorderBlockColorProperty | Array<BorderBlockColorProperty>;
    translate?: TranslateProperty<TLength> | Array<TranslateProperty<TLength>>;
    ['unicode-bidi']?: UnicodeBidiProperty | Array<UnicodeBidiProperty>;
    ['user-select']?: UserSelectProperty | Array<UserSelectProperty>;
    ['vertical-align']?: VerticalAlignProperty<TLength> | Array<VerticalAlignProperty<TLength>>;
    visibility?: VisibilityProperty | Array<VisibilityProperty>;
    ['white-space']?: WhiteSpaceProperty | Array<WhiteSpaceProperty>;
    widows?: GlobalsNumber | Array<GlobalsNumber>;
    width?: WidthProperty<TLength> | Array<WidthProperty<TLength>>;
    ['will-change']?: WillChangeProperty | Array<WillChangeProperty>;
    ['word-break']?: WordBreakProperty | Array<WordBreakProperty>;
    ['word-spacing']?: WordSpacingProperty<TLength> | Array<WordSpacingProperty<TLength>>;
    ['word-wrap']?: WordWrapProperty | Array<WordWrapProperty>;
    ['writing-mode']?: WritingModeProperty | Array<WritingModeProperty>;
    ['z-index']?: ZIndexProperty | Array<ZIndexProperty>;
    zoom?: ZoomProperty | Array<ZoomProperty>;
}

export interface StandardShorthandPropertiesHyphenFallback<TLength = string | 0> {
    ['flex-flow']?: FlexFlowProperty | Array<FlexFlowProperty>;
    ['border-block-start']?:
        | BorderBlockStartProperty<TLength>
        | Array<BorderBlockStartProperty<TLength>>;
    ['border-inline-end']?:
        | BorderInlineEndProperty<TLength>
        | Array<BorderInlineEndProperty<TLength>>;
    ['border-inline-start']?:
        | BorderInlineStartProperty<TLength>
        | Array<BorderInlineStartProperty<TLength>>;
    ['border-block']?: BorderBlockProperty<TLength> | Array<BorderBlockProperty<TLength>>;
    ['border-block-end']?: BorderBlockEndProperty<TLength> | Array<BorderBlockEndProperty<TLength>>;
    all?: Globals | Array<Globals>;
    ['border-bottom']?: BorderBottomProperty<TLength> | Array<BorderBottomProperty<TLength>>;
    ['border-color']?: BorderColorProperty | Array<BorderColorProperty>;
    ['border-image']?: BorderImageProperty | Array<BorderImageProperty>;
    ['border-inline']?: BorderInlineProperty<TLength> | Array<BorderInlineProperty<TLength>>;
    background?: BackgroundProperty<TLength> | Array<BackgroundProperty<TLength>>;
    border?: BorderProperty<TLength> | Array<BorderProperty<TLength>>;
    ['border-left']?: BorderLeftProperty<TLength> | Array<BorderLeftProperty<TLength>>;
    ['border-radius']?: BorderRadiusProperty<TLength> | Array<BorderRadiusProperty<TLength>>;
    ['border-right']?: BorderRightProperty<TLength> | Array<BorderRightProperty<TLength>>;
    ['border-style']?: BorderStyleProperty | Array<BorderStyleProperty>;
    ['border-top']?: BorderTopProperty<TLength> | Array<BorderTopProperty<TLength>>;
    ['border-width']?: BorderWidthProperty<TLength> | Array<BorderWidthProperty<TLength>>;
    ['column-rule']?: ColumnRuleProperty<TLength> | Array<ColumnRuleProperty<TLength>>;
    columns?: ColumnsProperty<TLength> | Array<ColumnsProperty<TLength>>;
    flex?: FlexProperty<TLength> | Array<FlexProperty<TLength>>;
    animation?: AnimationProperty | Array<AnimationProperty>;
    font?: FontProperty | Array<FontProperty>;
    gap?: GapProperty<TLength> | Array<GapProperty<TLength>>;
    grid?: GridProperty | Array<GridProperty>;
    ['grid-area']?: GridAreaProperty | Array<GridAreaProperty>;
    ['grid-column']?: GridColumnProperty | Array<GridColumnProperty>;
    ['grid-row']?: GridRowProperty | Array<GridRowProperty>;
    ['grid-template']?: GridTemplateProperty | Array<GridTemplateProperty>;
    ['line-clamp']?: LineClampProperty | Array<LineClampProperty>;
    ['list-style']?: ListStyleProperty | Array<ListStyleProperty>;
    margin?: MarginProperty<TLength> | Array<MarginProperty<TLength>>;
    mask?: MaskProperty<TLength> | Array<MaskProperty<TLength>>;
    ['mask-border']?: MaskBorderProperty | Array<MaskBorderProperty>;
    motion?: OffsetProperty<TLength> | Array<OffsetProperty<TLength>>;
    offset?: OffsetProperty<TLength> | Array<OffsetProperty<TLength>>;
    outline?: OutlineProperty<TLength> | Array<OutlineProperty<TLength>>;
    padding?: PaddingProperty<TLength> | Array<PaddingProperty<TLength>>;
    ['place-items']?: PlaceItemsProperty | Array<PlaceItemsProperty>;
    ['place-self']?: PlaceSelfProperty | Array<PlaceSelfProperty>;
    ['text-decoration']?: TextDecorationProperty | Array<TextDecorationProperty>;
    ['text-emphasis']?: TextEmphasisProperty | Array<TextEmphasisProperty>;
    transition?: TransitionProperty | Array<TransitionProperty>;
}

export type StandardPropertiesHyphenFallback<TLength = string | 0> =
    StandardLonghandPropertiesHyphenFallback<TLength> &
        StandardShorthandPropertiesHyphenFallback<TLength>;

export interface VendorLonghandPropertiesHyphenFallback<TLength = string | 0> {
    ['-ms-transform-origin']?:
        | TransformOriginProperty<TLength>
        | Array<TransformOriginProperty<TLength>>;
    ['-ms-scrollbar-darkshadow-color']?:
        | MsScrollbarDarkshadowColorProperty
        | Array<MsScrollbarDarkshadowColorProperty>;
    ['-ms-scrollbar-highlight-color']?:
        | MsScrollbarHighlightColorProperty
        | Array<MsScrollbarHighlightColorProperty>;
    ['-ms-scrollbar-shadow-color']?:
        | MsScrollbarShadowColorProperty
        | Array<MsScrollbarShadowColorProperty>;
    ['-ms-scrollbar-track-color']?:
        | MsScrollbarTrackColorProperty
        | Array<MsScrollbarTrackColorProperty>;
    ['-ms-scrollbar-arrow-color']?:
        | MsScrollbarArrowColorProperty
        | Array<MsScrollbarArrowColorProperty>;
    ['-ms-transition-timing-function']?:
        | TransitionTimingFunctionProperty
        | Array<TransitionTimingFunctionProperty>;
    ['-o-transform-origin']?:
        | TransformOriginProperty<TLength>
        | Array<TransformOriginProperty<TLength>>;
    ['-webkit-animation-iteration-count']?:
        | AnimationIterationCountProperty
        | Array<AnimationIterationCountProperty>;
    ['-webkit-animation-timing-function']?:
        | AnimationTimingFunctionProperty
        | Array<AnimationTimingFunctionProperty>;
    ['-webkit-background-size']?:
        | BackgroundSizeProperty<TLength>
        | Array<BackgroundSizeProperty<TLength>>;
    ['-ms-scrollbar-3dlight-color']?:
        | MsScrollbar3dlightColorProperty
        | Array<MsScrollbar3dlightColorProperty>;
    ['-webkit-border-before-color']?:
        | WebkitBorderBeforeColorProperty
        | Array<WebkitBorderBeforeColorProperty>;
    ['-ms-scroll-limit-y-min']?:
        | MsScrollLimitYMinProperty<TLength>
        | Array<MsScrollLimitYMinProperty<TLength>>;
    ['-webkit-border-before-style']?:
        | WebkitBorderBeforeStyleProperty
        | Array<WebkitBorderBeforeStyleProperty>;
    ['-ms-scroll-limit-y-max']?:
        | MsScrollLimitYMaxProperty<TLength>
        | Array<MsScrollLimitYMaxProperty<TLength>>;
    ['-webkit-border-before-width']?:
        | WebkitBorderBeforeWidthProperty<TLength>
        | Array<WebkitBorderBeforeWidthProperty<TLength>>;
    ['-ms-scroll-limit-x-min']?:
        | MsScrollLimitXMinProperty<TLength>
        | Array<MsScrollLimitXMinProperty<TLength>>;
    ['-webkit-border-bottom-left-radius']?:
        | BorderBottomLeftRadiusProperty<TLength>
        | Array<BorderBottomLeftRadiusProperty<TLength>>;
    ['-ms-scroll-limit-x-max']?:
        | MsScrollLimitXMaxProperty<TLength>
        | Array<MsScrollLimitXMaxProperty<TLength>>;
    ['-webkit-border-bottom-right-radius']?:
        | BorderBottomRightRadiusProperty<TLength>
        | Array<BorderBottomRightRadiusProperty<TLength>>;
    ['-ms-hyphenate-limit-zone']?:
        | MsHyphenateLimitZoneProperty<TLength>
        | Array<MsHyphenateLimitZoneProperty<TLength>>;
    ['-webkit-border-top-left-radius']?:
        | BorderTopLeftRadiusProperty<TLength>
        | Array<BorderTopLeftRadiusProperty<TLength>>;
    ['-ms-hyphenate-limit-lines']?:
        | MsHyphenateLimitLinesProperty
        | Array<MsHyphenateLimitLinesProperty>;
    ['-webkit-border-top-right-radius']?:
        | BorderTopRightRadiusProperty<TLength>
        | Array<BorderTopRightRadiusProperty<TLength>>;
    ['-ms-hyphenate-limit-chars']?:
        | MsHyphenateLimitCharsProperty
        | Array<MsHyphenateLimitCharsProperty>;
    ['-webkit-box-reflect']?:
        | WebkitBoxReflectProperty<TLength>
        | Array<WebkitBoxReflectProperty<TLength>>;
    ['-ms-content-zoom-snap-type']?:
        | MsContentZoomSnapTypeProperty
        | Array<MsContentZoomSnapTypeProperty>;
    ['-webkit-column-rule-width']?:
        | ColumnRuleWidthProperty<TLength>
        | Array<ColumnRuleWidthProperty<TLength>>;
    ['-ms-content-zoom-chaining']?:
        | MsContentZoomChainingProperty
        | Array<MsContentZoomChainingProperty>;
    ['-webkit-font-feature-settings']?:
        | FontFeatureSettingsProperty
        | Array<FontFeatureSettingsProperty>;
    ['-moz-transition-timing-function']?:
        | TransitionTimingFunctionProperty
        | Array<TransitionTimingFunctionProperty>;
    ['-webkit-font-variant-ligatures']?:
        | FontVariantLigaturesProperty
        | Array<FontVariantLigaturesProperty>;
    ['-moz-transform-origin']?:
        | TransformOriginProperty<TLength>
        | Array<TransformOriginProperty<TLength>>;
    ['-webkit-margin-end']?:
        | MarginInlineEndProperty<TLength>
        | Array<MarginInlineEndProperty<TLength>>;
    ['-moz-perspective-origin']?:
        | PerspectiveOriginProperty<TLength>
        | Array<PerspectiveOriginProperty<TLength>>;
    ['-webkit-margin-start']?:
        | MarginInlineStartProperty<TLength>
        | Array<MarginInlineStartProperty<TLength>>;
    ['-moz-padding-start']?:
        | PaddingInlineStartProperty<TLength>
        | Array<PaddingInlineStartProperty<TLength>>;
    ['-webkit-mask-position']?:
        | WebkitMaskPositionProperty<TLength>
        | Array<WebkitMaskPositionProperty<TLength>>;
    ['-moz-padding-end']?:
        | PaddingInlineEndProperty<TLength>
        | Array<PaddingInlineEndProperty<TLength>>;
    ['-webkit-mask-position-x']?:
        | WebkitMaskPositionXProperty<TLength>
        | Array<WebkitMaskPositionXProperty<TLength>>;
    ['-moz-outline-radius-topright']?:
        | MozOutlineRadiusToprightProperty<TLength>
        | Array<MozOutlineRadiusToprightProperty<TLength>>;
    ['-webkit-mask-position-y']?:
        | WebkitMaskPositionYProperty<TLength>
        | Array<WebkitMaskPositionYProperty<TLength>>;
    ['-moz-outline-radius-topleft']?:
        | MozOutlineRadiusTopleftProperty<TLength>
        | Array<MozOutlineRadiusTopleftProperty<TLength>>;
    ['-webkit-max-inline-size']?:
        | MaxInlineSizeProperty<TLength>
        | Array<MaxInlineSizeProperty<TLength>>;
    ['-moz-outline-radius-bottomright']?:
        | MozOutlineRadiusBottomrightProperty<TLength>
        | Array<MozOutlineRadiusBottomrightProperty<TLength>>;
    ['-webkit-overflow-scrolling']?:
        | WebkitOverflowScrollingProperty
        | Array<WebkitOverflowScrollingProperty>;
    ['-moz-outline-radius-bottomleft']?:
        | MozOutlineRadiusBottomleftProperty<TLength>
        | Array<MozOutlineRadiusBottomleftProperty<TLength>>;
    ['-webkit-padding-end']?:
        | PaddingInlineEndProperty<TLength>
        | Array<PaddingInlineEndProperty<TLength>>;
    ['-moz-margin-start']?:
        | MarginInlineStartProperty<TLength>
        | Array<MarginInlineStartProperty<TLength>>;
    ['-webkit-padding-start']?:
        | PaddingInlineStartProperty<TLength>
        | Array<PaddingInlineStartProperty<TLength>>;
    ['-moz-font-language-override']?:
        | FontLanguageOverrideProperty
        | Array<FontLanguageOverrideProperty>;
    ['-webkit-perspective-origin']?:
        | PerspectiveOriginProperty<TLength>
        | Array<PerspectiveOriginProperty<TLength>>;
    ['-moz-column-rule-width']?:
        | ColumnRuleWidthProperty<TLength>
        | Array<ColumnRuleWidthProperty<TLength>>;
    ['-webkit-tap-highlight-color']?:
        | WebkitTapHighlightColorProperty
        | Array<WebkitTapHighlightColorProperty>;
    ['-moz-border-start-style']?:
        | BorderInlineStartStyleProperty
        | Array<BorderInlineStartStyleProperty>;
    ['-webkit-text-decoration-color']?:
        | TextDecorationColorProperty
        | Array<TextDecorationColorProperty>;
    ['-moz-border-start-color']?:
        | BorderInlineStartColorProperty
        | Array<BorderInlineStartColorProperty>;
    ['-webkit-text-decoration-style']?:
        | TextDecorationStyleProperty
        | Array<TextDecorationStyleProperty>;
    ['-moz-border-end-width']?:
        | BorderInlineEndWidthProperty<TLength>
        | Array<BorderInlineEndWidthProperty<TLength>>;
    ['-webkit-text-stroke-color']?:
        | WebkitTextStrokeColorProperty
        | Array<WebkitTextStrokeColorProperty>;
    ['-moz-border-bottom-colors']?:
        | MozBorderBottomColorsProperty
        | Array<MozBorderBottomColorsProperty>;
    ['-webkit-text-stroke-width']?:
        | WebkitTextStrokeWidthProperty<TLength>
        | Array<WebkitTextStrokeWidthProperty<TLength>>;
    ['-moz-animation-timing-function']?:
        | AnimationTimingFunctionProperty
        | Array<AnimationTimingFunctionProperty>;
    ['-webkit-transform-origin']?:
        | TransformOriginProperty<TLength>
        | Array<TransformOriginProperty<TLength>>;
    ['-moz-animation-iteration-count']?:
        | AnimationIterationCountProperty
        | Array<AnimationIterationCountProperty>;
    ['-ms-transition-property']?: TransitionPropertyProperty | Array<TransitionPropertyProperty>;
    ['-webkit-transition-timing-function']?:
        | TransitionTimingFunctionProperty
        | Array<TransitionTimingFunctionProperty>;
    ['-ms-flex-direction']?: FlexDirectionProperty | Array<FlexDirectionProperty>;
    ['-ms-flex-positive']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-ms-flow-from']?: MsFlowFromProperty | Array<MsFlowFromProperty>;
    ['-ms-flow-into']?: MsFlowIntoProperty | Array<MsFlowIntoProperty>;
    ['-ms-grid-columns']?:
        | GridAutoColumnsProperty<TLength>
        | Array<GridAutoColumnsProperty<TLength>>;
    ['-ms-grid-rows']?: GridAutoRowsProperty<TLength> | Array<GridAutoRowsProperty<TLength>>;
    ['-ms-high-contrast-adjust']?:
        | MsHighContrastAdjustProperty
        | Array<MsHighContrastAdjustProperty>;
    ['-moz-column-fill']?: ColumnFillProperty | Array<ColumnFillProperty>;
    ['-moz-column-gap']?: ColumnGapProperty<TLength> | Array<ColumnGapProperty<TLength>>;
    ['-moz-column-rule-color']?: ColumnRuleColorProperty | Array<ColumnRuleColorProperty>;
    ['-ms-hyphens']?: HyphensProperty | Array<HyphensProperty>;
    ['-ms-ime-align']?: MsImeAlignProperty | Array<MsImeAlignProperty>;
    ['-ms-line-break']?: LineBreakProperty | Array<LineBreakProperty>;
    ['-ms-order']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-ms-overflow-style']?: MsOverflowStyleProperty | Array<MsOverflowStyleProperty>;
    ['-ms-overflow-x']?: OverflowXProperty | Array<OverflowXProperty>;
    ['-ms-overflow-y']?: OverflowYProperty | Array<OverflowYProperty>;
    ['-ms-scroll-chaining']?: MsScrollChainingProperty | Array<MsScrollChainingProperty>;
    ['-moz-column-rule-style']?: ColumnRuleStyleProperty | Array<ColumnRuleStyleProperty>;
    ['-moz-animation-duration']?: GlobalsString | Array<GlobalsString>;
    ['-moz-column-width']?: ColumnWidthProperty<TLength> | Array<ColumnWidthProperty<TLength>>;
    ['-moz-context-properties']?:
        | MozContextPropertiesProperty
        | Array<MozContextPropertiesProperty>;
    ['-ms-scroll-rails']?: MsScrollRailsProperty | Array<MsScrollRailsProperty>;
    ['-ms-scroll-snap-points-x']?: GlobalsString | Array<GlobalsString>;
    ['-ms-scroll-snap-points-y']?: GlobalsString | Array<GlobalsString>;
    ['-ms-scroll-snap-type']?: MsScrollSnapTypeProperty | Array<MsScrollSnapTypeProperty>;
    ['-ms-scroll-translation']?: MsScrollTranslationProperty | Array<MsScrollTranslationProperty>;
    ['-moz-float-edge']?: MozFloatEdgeProperty | Array<MozFloatEdgeProperty>;
    ['-moz-font-feature-settings']?:
        | FontFeatureSettingsProperty
        | Array<FontFeatureSettingsProperty>;
    ['-ms-scrollbar-base-color']?:
        | MsScrollbarBaseColorProperty
        | Array<MsScrollbarBaseColorProperty>;
    ['-moz-appearance']?: MozAppearanceProperty | Array<MozAppearanceProperty>;
    ['-ms-scrollbar-face-color']?:
        | MsScrollbarFaceColorProperty
        | Array<MsScrollbarFaceColorProperty>;
    ['-moz-force-broken-image-icon']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-moz-hyphens']?: HyphensProperty | Array<HyphensProperty>;
    ['-moz-image-region']?: MozImageRegionProperty | Array<MozImageRegionProperty>;
    ['-ms-text-autospace']?: MsTextAutospaceProperty | Array<MsTextAutospaceProperty>;
    ['-ms-text-combine-horizontal']?:
        | TextCombineUprightProperty
        | Array<TextCombineUprightProperty>;
    ['-ms-text-overflow']?: TextOverflowProperty | Array<TextOverflowProperty>;
    ['-ms-touch-action']?: TouchActionProperty | Array<TouchActionProperty>;
    ['-ms-touch-select']?: MsTouchSelectProperty | Array<MsTouchSelectProperty>;
    ['-ms-transform']?: TransformProperty | Array<TransformProperty>;
    ['-moz-margin-end']?:
        | MarginInlineEndProperty<TLength>
        | Array<MarginInlineEndProperty<TLength>>;
    ['-ms-transition-delay']?: GlobalsString | Array<GlobalsString>;
    ['-ms-transition-duration']?: GlobalsString | Array<GlobalsString>;
    ['-moz-animation-direction']?: AnimationDirectionProperty | Array<AnimationDirectionProperty>;
    ['-moz-backface-visibility']?: BackfaceVisibilityProperty | Array<BackfaceVisibilityProperty>;
    ['-ms-user-select']?: MsUserSelectProperty | Array<MsUserSelectProperty>;
    ['-ms-word-break']?: WordBreakProperty | Array<WordBreakProperty>;
    ['-ms-wrap-flow']?: MsWrapFlowProperty | Array<MsWrapFlowProperty>;
    ['-ms-wrap-margin']?: MsWrapMarginProperty<TLength> | Array<MsWrapMarginProperty<TLength>>;
    ['-ms-wrap-through']?: MsWrapThroughProperty | Array<MsWrapThroughProperty>;
    ['-ms-writing-mode']?: WritingModeProperty | Array<WritingModeProperty>;
    ['-o-object-fit']?: ObjectFitProperty | Array<ObjectFitProperty>;
    ['-o-object-position']?:
        | ObjectPositionProperty<TLength>
        | Array<ObjectPositionProperty<TLength>>;
    ['-o-tab-size']?: TabSizeProperty<TLength> | Array<TabSizeProperty<TLength>>;
    ['-o-text-overflow']?: TextOverflowProperty | Array<TextOverflowProperty>;
    ['-moz-orient']?: MozOrientProperty | Array<MozOrientProperty>;
    ['-webkit-align-content']?: AlignContentProperty | Array<AlignContentProperty>;
    ['-webkit-align-items']?: AlignItemsProperty | Array<AlignItemsProperty>;
    ['-webkit-align-self']?: AlignSelfProperty | Array<AlignSelfProperty>;
    ['-webkit-animation-delay']?: GlobalsString | Array<GlobalsString>;
    ['-webkit-animation-direction']?:
        | AnimationDirectionProperty
        | Array<AnimationDirectionProperty>;
    ['-webkit-animation-duration']?: GlobalsString | Array<GlobalsString>;
    ['-webkit-animation-fill-mode']?: AnimationFillModeProperty | Array<AnimationFillModeProperty>;
    ['-moz-animation-fill-mode']?: AnimationFillModeProperty | Array<AnimationFillModeProperty>;
    ['-webkit-animation-name']?: AnimationNameProperty | Array<AnimationNameProperty>;
    ['-webkit-animation-play-state']?:
        | AnimationPlayStateProperty
        | Array<AnimationPlayStateProperty>;
    ['-moz-border-end-color']?: BorderInlineEndColorProperty | Array<BorderInlineEndColorProperty>;
    ['-webkit-appearance']?: WebkitAppearanceProperty | Array<WebkitAppearanceProperty>;
    ['-webkit-backdrop-filter']?: BackdropFilterProperty | Array<BackdropFilterProperty>;
    ['-webkit-backface-visibility']?:
        | BackfaceVisibilityProperty
        | Array<BackfaceVisibilityProperty>;
    ['-webkit-background-clip']?: BackgroundClipProperty | Array<BackgroundClipProperty>;
    ['-webkit-background-origin']?: BackgroundOriginProperty | Array<BackgroundOriginProperty>;
    ['-moz-border-end-style']?: BorderInlineEndStyleProperty | Array<BorderInlineEndStyleProperty>;
    ['-moz-animation-delay']?: GlobalsString | Array<GlobalsString>;
    ['-moz-border-left-colors']?: MozBorderLeftColorsProperty | Array<MozBorderLeftColorsProperty>;
    ['-moz-border-right-colors']?:
        | MozBorderRightColorsProperty
        | Array<MozBorderRightColorsProperty>;
    ['-moz-perspective']?: PerspectiveProperty<TLength> | Array<PerspectiveProperty<TLength>>;
    ['-moz-animation-name']?: AnimationNameProperty | Array<AnimationNameProperty>;
    ['-webkit-border-image-slice']?: BorderImageSliceProperty | Array<BorderImageSliceProperty>;
    ['-moz-stack-sizing']?: MozStackSizingProperty | Array<MozStackSizingProperty>;
    ['-moz-tab-size']?: TabSizeProperty<TLength> | Array<TabSizeProperty<TLength>>;
    ['-webkit-box-decoration-break']?:
        | BoxDecorationBreakProperty
        | Array<BoxDecorationBreakProperty>;
    ['-moz-text-size-adjust']?: TextSizeAdjustProperty | Array<TextSizeAdjustProperty>;
    ['-webkit-box-shadow']?: BoxShadowProperty | Array<BoxShadowProperty>;
    ['-webkit-box-sizing']?: BoxSizingProperty | Array<BoxSizingProperty>;
    ['-webkit-clip-path']?: ClipPathProperty | Array<ClipPathProperty>;
    ['-webkit-color-adjust']?: ColorAdjustProperty | Array<ColorAdjustProperty>;
    ['-webkit-column-count']?: ColumnCountProperty | Array<ColumnCountProperty>;
    ['-webkit-column-fill']?: ColumnFillProperty | Array<ColumnFillProperty>;
    ['-webkit-column-gap']?: ColumnGapProperty<TLength> | Array<ColumnGapProperty<TLength>>;
    ['-webkit-column-rule-color']?: ColumnRuleColorProperty | Array<ColumnRuleColorProperty>;
    ['-webkit-column-rule-style']?: ColumnRuleStyleProperty | Array<ColumnRuleStyleProperty>;
    ['-moz-animation-play-state']?: AnimationPlayStateProperty | Array<AnimationPlayStateProperty>;
    ['-webkit-column-span']?: ColumnSpanProperty | Array<ColumnSpanProperty>;
    ['-webkit-column-width']?: ColumnWidthProperty<TLength> | Array<ColumnWidthProperty<TLength>>;
    ['-webkit-filter']?: FilterProperty | Array<FilterProperty>;
    ['-webkit-flex-basis']?: FlexBasisProperty<TLength> | Array<FlexBasisProperty<TLength>>;
    ['-webkit-flex-direction']?: FlexDirectionProperty | Array<FlexDirectionProperty>;
    ['-webkit-flex-grow']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-webkit-flex-shrink']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-webkit-flex-wrap']?: FlexWrapProperty | Array<FlexWrapProperty>;
    ['-moz-transform-style']?: TransformStyleProperty | Array<TransformStyleProperty>;
    ['-webkit-font-kerning']?: FontKerningProperty | Array<FontKerningProperty>;
    ['-moz-transition-delay']?: GlobalsString | Array<GlobalsString>;
    ['-webkit-hyphens']?: HyphensProperty | Array<HyphensProperty>;
    ['-webkit-justify-content']?: JustifyContentProperty | Array<JustifyContentProperty>;
    ['-webkit-line-break']?: LineBreakProperty | Array<LineBreakProperty>;
    ['-webkit-line-clamp']?: WebkitLineClampProperty | Array<WebkitLineClampProperty>;
    ['-moz-transition-duration']?: GlobalsString | Array<GlobalsString>;
    ['-moz-transition-property']?: TransitionPropertyProperty | Array<TransitionPropertyProperty>;
    ['-webkit-mask-attachment']?:
        | WebkitMaskAttachmentProperty
        | Array<WebkitMaskAttachmentProperty>;
    ['-webkit-mask-clip']?: WebkitMaskClipProperty | Array<WebkitMaskClipProperty>;
    ['-webkit-mask-composite']?: WebkitMaskCompositeProperty | Array<WebkitMaskCompositeProperty>;
    ['-webkit-mask-image']?: WebkitMaskImageProperty | Array<WebkitMaskImageProperty>;
    ['-webkit-mask-origin']?: WebkitMaskOriginProperty | Array<WebkitMaskOriginProperty>;
    ['-moz-border-top-colors']?: MozBorderTopColorsProperty | Array<MozBorderTopColorsProperty>;
    ['-moz-user-focus']?: MozUserFocusProperty | Array<MozUserFocusProperty>;
    ['-moz-user-modify']?: MozUserModifyProperty | Array<MozUserModifyProperty>;
    ['-webkit-mask-repeat']?: WebkitMaskRepeatProperty | Array<WebkitMaskRepeatProperty>;
    ['-webkit-mask-repeat-x']?: WebkitMaskRepeatXProperty | Array<WebkitMaskRepeatXProperty>;
    ['-webkit-mask-repeat-y']?: WebkitMaskRepeatYProperty | Array<WebkitMaskRepeatYProperty>;
    ['-webkit-mask-size']?:
        | WebkitMaskSizeProperty<TLength>
        | Array<WebkitMaskSizeProperty<TLength>>;
    ['-moz-user-select']?: UserSelectProperty | Array<UserSelectProperty>;
    ['-webkit-order']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-moz-window-dragging']?: MozWindowDraggingProperty | Array<MozWindowDraggingProperty>;
    ['-ms-accelerator']?: MsAcceleratorProperty | Array<MsAcceleratorProperty>;
    ['-ms-align-self']?: AlignSelfProperty | Array<AlignSelfProperty>;
    ['-webkit-perspective']?: PerspectiveProperty<TLength> | Array<PerspectiveProperty<TLength>>;
    ['-ms-block-progression']?: MsBlockProgressionProperty | Array<MsBlockProgressionProperty>;
    ['-webkit-scroll-snap-type']?: ScrollSnapTypeProperty | Array<ScrollSnapTypeProperty>;
    ['-webkit-shape-margin']?: ShapeMarginProperty<TLength> | Array<ShapeMarginProperty<TLength>>;
    ['-moz-box-sizing']?: BoxSizingProperty | Array<BoxSizingProperty>;
    ['-webkit-text-combine']?: TextCombineUprightProperty | Array<TextCombineUprightProperty>;
    ['-ms-content-zoom-limit-max']?: GlobalsString | Array<GlobalsString>;
    ['-webkit-text-decoration-line']?:
        | TextDecorationLineProperty
        | Array<TextDecorationLineProperty>;
    ['-webkit-text-decoration-skip']?:
        | TextDecorationSkipProperty
        | Array<TextDecorationSkipProperty>;
    ['-ms-content-zoom-limit-min']?: GlobalsString | Array<GlobalsString>;
    ['-webkit-text-emphasis-color']?: TextEmphasisColorProperty | Array<TextEmphasisColorProperty>;
    ['-webkit-text-emphasis-position']?: GlobalsString | Array<GlobalsString>;
    ['-webkit-text-emphasis-style']?: TextEmphasisStyleProperty | Array<TextEmphasisStyleProperty>;
    ['-webkit-text-fill-color']?: WebkitTextFillColorProperty | Array<WebkitTextFillColorProperty>;
    ['-webkit-text-orientation']?: TextOrientationProperty | Array<TextOrientationProperty>;
    ['-webkit-text-size-adjust']?: TextSizeAdjustProperty | Array<TextSizeAdjustProperty>;
    ['-ms-content-zoom-snap-points']?: GlobalsString | Array<GlobalsString>;
    ['-moz-column-count']?: ColumnCountProperty | Array<ColumnCountProperty>;
    ['-webkit-touch-callout']?: WebkitTouchCalloutProperty | Array<WebkitTouchCalloutProperty>;
    ['-webkit-transform']?: TransformProperty | Array<TransformProperty>;
    ['-ms-content-zooming']?: MsContentZoomingProperty | Array<MsContentZoomingProperty>;
    ['-webkit-transform-style']?: TransformStyleProperty | Array<TransformStyleProperty>;
    ['-webkit-transition-delay']?: GlobalsString | Array<GlobalsString>;
    ['-webkit-transition-duration']?: GlobalsString | Array<GlobalsString>;
    ['-webkit-transition-property']?:
        | TransitionPropertyProperty
        | Array<TransitionPropertyProperty>;
    ['-ms-filter']?: GlobalsString | Array<GlobalsString>;
    ['-webkit-user-modify']?: WebkitUserModifyProperty | Array<WebkitUserModifyProperty>;
    ['-webkit-user-select']?: UserSelectProperty | Array<UserSelectProperty>;
    ['-webkit-writing-mode']?: WritingModeProperty | Array<WritingModeProperty>;
}

export interface VendorShorthandPropertiesHyphenFallback<TLength = string | 0> {
    ['-webkit-animation']?: AnimationProperty | Array<AnimationProperty>;
    ['-webkit-border-before']?:
        | WebkitBorderBeforeProperty<TLength>
        | Array<WebkitBorderBeforeProperty<TLength>>;
    ['-webkit-text-stroke']?:
        | WebkitTextStrokeProperty<TLength>
        | Array<WebkitTextStrokeProperty<TLength>>;
    ['-moz-columns']?: ColumnsProperty<TLength> | Array<ColumnsProperty<TLength>>;
    ['-moz-transition']?: TransitionProperty | Array<TransitionProperty>;
    ['-ms-content-zoom-limit']?: GlobalsString | Array<GlobalsString>;
    ['-ms-content-zoom-snap']?: MsContentZoomSnapProperty | Array<MsContentZoomSnapProperty>;
    ['-ms-flex']?: FlexProperty<TLength> | Array<FlexProperty<TLength>>;
    ['-ms-scroll-limit']?: GlobalsString | Array<GlobalsString>;
    ['-ms-scroll-snap-x']?: GlobalsString | Array<GlobalsString>;
    ['-ms-scroll-snap-y']?: GlobalsString | Array<GlobalsString>;
    ['-ms-transition']?: TransitionProperty | Array<TransitionProperty>;
    ['-moz-border-image']?: BorderImageProperty | Array<BorderImageProperty>;
    ['-moz-animation']?: AnimationProperty | Array<AnimationProperty>;
    ['-webkit-border-image']?: BorderImageProperty | Array<BorderImageProperty>;
    ['-webkit-border-radius']?:
        | BorderRadiusProperty<TLength>
        | Array<BorderRadiusProperty<TLength>>;
    ['-webkit-column-rule']?: ColumnRuleProperty<TLength> | Array<ColumnRuleProperty<TLength>>;
    ['-webkit-columns']?: ColumnsProperty<TLength> | Array<ColumnsProperty<TLength>>;
    ['-webkit-flex']?: FlexProperty<TLength> | Array<FlexProperty<TLength>>;
    ['-webkit-flex-flow']?: FlexFlowProperty | Array<FlexFlowProperty>;
    ['-webkit-mask']?: WebkitMaskProperty<TLength> | Array<WebkitMaskProperty<TLength>>;
    ['-webkit-text-emphasis']?: TextEmphasisProperty | Array<TextEmphasisProperty>;
    ['-moz-column-rule']?: ColumnRuleProperty<TLength> | Array<ColumnRuleProperty<TLength>>;
    ['-webkit-transition']?: TransitionProperty | Array<TransitionProperty>;
}

export type VendorPropertiesHyphenFallback<TLength = string | 0> =
    VendorLonghandPropertiesHyphenFallback<TLength> &
        VendorShorthandPropertiesHyphenFallback<TLength>;

export interface ObsoletePropertiesHyphenFallback<TLength = string | 0> {
    ['-moz-border-radius-bottomleft']?:
        | BorderBottomLeftRadiusProperty<TLength>
        | Array<BorderBottomLeftRadiusProperty<TLength>>;
    ['scroll-snap-coordinate']?:
        | ScrollSnapCoordinateProperty<TLength>
        | Array<ScrollSnapCoordinateProperty<TLength>>;
    ['scroll-snap-destination']?:
        | ScrollSnapDestinationProperty<TLength>
        | Array<ScrollSnapDestinationProperty<TLength>>;
    ['-moz-background-inline-policy']?:
        | BoxDecorationBreakProperty
        | Array<BoxDecorationBreakProperty>;
    ['-moz-background-size']?:
        | BackgroundSizeProperty<TLength>
        | Array<BackgroundSizeProperty<TLength>>;
    ['offset-inline-start']?:
        | InsetInlineStartProperty<TLength>
        | Array<InsetInlineStartProperty<TLength>>;
    ['-moz-border-radius-bottomright']?:
        | BorderBottomRightRadiusProperty<TLength>
        | Array<BorderBottomRightRadiusProperty<TLength>>;
    ['-moz-border-radius-topleft']?:
        | BorderTopLeftRadiusProperty<TLength>
        | Array<BorderTopLeftRadiusProperty<TLength>>;
    ['-moz-border-radius-topright']?:
        | BorderTopRightRadiusProperty<TLength>
        | Array<BorderTopRightRadiusProperty<TLength>>;
    ['-moz-outline-radius']?:
        | MozOutlineRadiusProperty<TLength>
        | Array<MozOutlineRadiusProperty<TLength>>;
    ['-o-animation-iteration-count']?:
        | AnimationIterationCountProperty
        | Array<AnimationIterationCountProperty>;
    ['offset-block-start']?:
        | InsetBlockStartProperty<TLength>
        | Array<InsetBlockStartProperty<TLength>>;
    ['-o-animation-timing-function']?:
        | AnimationTimingFunctionProperty
        | Array<AnimationTimingFunctionProperty>;
    ['font-variant-alternates']?:
        | FontVariantAlternatesProperty
        | Array<FontVariantAlternatesProperty>;
    ['-moz-box-align']?: BoxAlignProperty | Array<BoxAlignProperty>;
    ['-o-transition-timing-function']?:
        | TransitionTimingFunctionProperty
        | Array<TransitionTimingFunctionProperty>;
    ['box-flex']?: GlobalsNumber | Array<GlobalsNumber>;
    ['offset-inline']?: InsetInlineProperty<TLength> | Array<InsetInlineProperty<TLength>>;
    ['offset-inline-end']?:
        | InsetInlineEndProperty<TLength>
        | Array<InsetInlineEndProperty<TLength>>;
    ['box-flex-group']?: GlobalsNumber | Array<GlobalsNumber>;
    ['box-lines']?: BoxLinesProperty | Array<BoxLinesProperty>;
    ['box-ordinal-group']?: GlobalsNumber | Array<GlobalsNumber>;
    ['scroll-snap-points-x']?: ScrollSnapPointsXProperty | Array<ScrollSnapPointsXProperty>;
    ['scroll-snap-points-y']?: ScrollSnapPointsYProperty | Array<ScrollSnapPointsYProperty>;
    ['scroll-snap-type-x']?: ScrollSnapTypeXProperty | Array<ScrollSnapTypeXProperty>;
    ['scroll-snap-type-y']?: ScrollSnapTypeYProperty | Array<ScrollSnapTypeYProperty>;
    ['text-combine-horizontal']?: TextCombineUprightProperty | Array<TextCombineUprightProperty>;
    ['-khtml-box-align']?: BoxAlignProperty | Array<BoxAlignProperty>;
    ['-khtml-box-direction']?: BoxDirectionProperty | Array<BoxDirectionProperty>;
    ['-khtml-box-flex']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-khtml-box-flex-group']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-khtml-box-lines']?: BoxLinesProperty | Array<BoxLinesProperty>;
    ['-khtml-box-ordinal-group']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-khtml-box-orient']?: BoxOrientProperty | Array<BoxOrientProperty>;
    ['-khtml-box-pack']?: BoxPackProperty | Array<BoxPackProperty>;
    ['-khtml-line-break']?: LineBreakProperty | Array<LineBreakProperty>;
    ['-khtml-opacity']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-khtml-user-select']?: UserSelectProperty | Array<UserSelectProperty>;
    ['-moz-background-clip']?: BackgroundClipProperty | Array<BackgroundClipProperty>;
    ['box-orient']?: BoxOrientProperty | Array<BoxOrientProperty>;
    ['-moz-background-origin']?: BackgroundOriginProperty | Array<BackgroundOriginProperty>;
    ['box-pack']?: BoxPackProperty | Array<BoxPackProperty>;
    ['-moz-binding']?: MozBindingProperty | Array<MozBindingProperty>;
    ['-moz-border-radius']?: BorderRadiusProperty<TLength> | Array<BorderRadiusProperty<TLength>>;
    clip?: ClipProperty | Array<ClipProperty>;
    ['box-align']?: BoxAlignProperty | Array<BoxAlignProperty>;
    ['grid-column-gap']?: GridColumnGapProperty<TLength> | Array<GridColumnGapProperty<TLength>>;
    ['grid-gap']?: GridGapProperty<TLength> | Array<GridGapProperty<TLength>>;
    ['box-direction']?: BoxDirectionProperty | Array<BoxDirectionProperty>;
    ['-moz-box-direction']?: BoxDirectionProperty | Array<BoxDirectionProperty>;
    ['-moz-box-flex']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-moz-box-ordinal-group']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-moz-box-orient']?: BoxOrientProperty | Array<BoxOrientProperty>;
    ['-moz-box-pack']?: BoxPackProperty | Array<BoxPackProperty>;
    ['-moz-box-shadow']?: BoxShadowProperty | Array<BoxShadowProperty>;
    ['-moz-opacity']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-moz-outline']?: OutlineProperty<TLength> | Array<OutlineProperty<TLength>>;
    ['-moz-outline-color']?: OutlineColorProperty | Array<OutlineColorProperty>;
    ['grid-row-gap']?: GridRowGapProperty<TLength> | Array<GridRowGapProperty<TLength>>;
    ['-moz-outline-style']?: OutlineStyleProperty | Array<OutlineStyleProperty>;
    ['-moz-outline-width']?: OutlineWidthProperty<TLength> | Array<OutlineWidthProperty<TLength>>;
    ['-moz-text-align-last']?: TextAlignLastProperty | Array<TextAlignLastProperty>;
    ['-moz-text-blink']?: MozTextBlinkProperty | Array<MozTextBlinkProperty>;
    ['-moz-text-decoration-color']?:
        | TextDecorationColorProperty
        | Array<TextDecorationColorProperty>;
    ['-moz-text-decoration-line']?: TextDecorationLineProperty | Array<TextDecorationLineProperty>;
    ['-moz-text-decoration-style']?:
        | TextDecorationStyleProperty
        | Array<TextDecorationStyleProperty>;
    ['-moz-user-input']?: MozUserInputProperty | Array<MozUserInputProperty>;
    ['-moz-window-shadow']?: MozWindowShadowProperty | Array<MozWindowShadowProperty>;
    ['-ms-ime-mode']?: ImeModeProperty | Array<ImeModeProperty>;
    ['-o-animation']?: AnimationProperty | Array<AnimationProperty>;
    ['-o-animation-delay']?: GlobalsString | Array<GlobalsString>;
    ['-o-animation-direction']?: AnimationDirectionProperty | Array<AnimationDirectionProperty>;
    ['-o-animation-duration']?: GlobalsString | Array<GlobalsString>;
    ['-o-animation-fill-mode']?: AnimationFillModeProperty | Array<AnimationFillModeProperty>;
    ['ime-mode']?: ImeModeProperty | Array<ImeModeProperty>;
    ['-o-animation-name']?: AnimationNameProperty | Array<AnimationNameProperty>;
    ['-o-animation-play-state']?: AnimationPlayStateProperty | Array<AnimationPlayStateProperty>;
    ['offset-block']?: InsetBlockProperty<TLength> | Array<InsetBlockProperty<TLength>>;
    ['-o-background-size']?:
        | BackgroundSizeProperty<TLength>
        | Array<BackgroundSizeProperty<TLength>>;
    ['-o-border-image']?: BorderImageProperty | Array<BorderImageProperty>;
    ['-o-transform']?: TransformProperty | Array<TransformProperty>;
    ['-o-transition']?: TransitionProperty | Array<TransitionProperty>;
    ['-o-transition-delay']?: GlobalsString | Array<GlobalsString>;
    ['-o-transition-duration']?: GlobalsString | Array<GlobalsString>;
    ['-o-transition-property']?: TransitionPropertyProperty | Array<TransitionPropertyProperty>;
    ['offset-block-end']?: InsetBlockEndProperty<TLength> | Array<InsetBlockEndProperty<TLength>>;
    ['-webkit-box-align']?: BoxAlignProperty | Array<BoxAlignProperty>;
    ['-webkit-box-direction']?: BoxDirectionProperty | Array<BoxDirectionProperty>;
    ['-webkit-box-flex']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-webkit-box-flex-group']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-webkit-box-lines']?: BoxLinesProperty | Array<BoxLinesProperty>;
    ['-webkit-box-ordinal-group']?: GlobalsNumber | Array<GlobalsNumber>;
    ['-webkit-box-orient']?: BoxOrientProperty | Array<BoxOrientProperty>;
    ['-webkit-box-pack']?: BoxPackProperty | Array<BoxPackProperty>;
    ['-webkit-scroll-snap-points-x']?: ScrollSnapPointsXProperty | Array<ScrollSnapPointsXProperty>;
    ['-webkit-scroll-snap-points-y']?: ScrollSnapPointsYProperty | Array<ScrollSnapPointsYProperty>;
}

export interface SvgPropertiesHyphenFallback<TLength = string | 0> {
    ['line-height']?: LineHeightProperty<TLength> | Array<LineHeightProperty<TLength>>;
    ['glyph-orientation-vertical']?:
        | GlyphOrientationVerticalProperty
        | Array<GlyphOrientationVerticalProperty>;
    ['stroke-dashoffset']?:
        | StrokeDashoffsetProperty<TLength>
        | Array<StrokeDashoffsetProperty<TLength>>;
    ['clip-path']?: ClipPathProperty | Array<ClipPathProperty>;
    ['clip-rule']?: ClipRuleProperty | Array<ClipRuleProperty>;
    color?: ColorProperty | Array<ColorProperty>;
    ['color-interpolation']?: ColorInterpolationProperty | Array<ColorInterpolationProperty>;
    ['color-rendering']?: ColorRenderingProperty | Array<ColorRenderingProperty>;
    cursor?: CursorProperty | Array<CursorProperty>;
    direction?: DirectionProperty | Array<DirectionProperty>;
    display?: DisplayProperty | Array<DisplayProperty>;
    ['dominant-baseline']?: DominantBaselineProperty | Array<DominantBaselineProperty>;
    fill?: FillProperty | Array<FillProperty>;
    ['fill-opacity']?: GlobalsNumber | Array<GlobalsNumber>;
    ['fill-rule']?: FillRuleProperty | Array<FillRuleProperty>;
    filter?: FilterProperty | Array<FilterProperty>;
    ['flood-color']?: FloodColorProperty | Array<FloodColorProperty>;
    ['flood-opacity']?: GlobalsNumber | Array<GlobalsNumber>;
    font?: FontProperty | Array<FontProperty>;
    ['font-family']?: FontFamilyProperty | Array<FontFamilyProperty>;
    ['font-size']?: FontSizeProperty<TLength> | Array<FontSizeProperty<TLength>>;
    ['font-size-adjust']?: FontSizeAdjustProperty | Array<FontSizeAdjustProperty>;
    ['font-stretch']?: FontStretchProperty | Array<FontStretchProperty>;
    ['font-style']?: FontStyleProperty | Array<FontStyleProperty>;
    ['font-variant']?: FontVariantProperty | Array<FontVariantProperty>;
    ['font-weight']?: FontWeightProperty | Array<FontWeightProperty>;
    ['alignment-baseline']?: AlignmentBaselineProperty | Array<AlignmentBaselineProperty>;
    ['image-rendering']?: ImageRenderingProperty | Array<ImageRenderingProperty>;
    ['letter-spacing']?: LetterSpacingProperty<TLength> | Array<LetterSpacingProperty<TLength>>;
    ['lighting-color']?: LightingColorProperty | Array<LightingColorProperty>;
    ['baseline-shift']?: BaselineShiftProperty<TLength> | Array<BaselineShiftProperty<TLength>>;
    marker?: MarkerProperty | Array<MarkerProperty>;
    ['marker-end']?: MarkerEndProperty | Array<MarkerEndProperty>;
    ['marker-mid']?: MarkerMidProperty | Array<MarkerMidProperty>;
    ['marker-start']?: MarkerStartProperty | Array<MarkerStartProperty>;
    mask?: MaskProperty<TLength> | Array<MaskProperty<TLength>>;
    opacity?: GlobalsNumber | Array<GlobalsNumber>;
    overflow?: OverflowProperty | Array<OverflowProperty>;
    ['paint-order']?: PaintOrderProperty | Array<PaintOrderProperty>;
    ['pointer-events']?: PointerEventsProperty | Array<PointerEventsProperty>;
    ['shape-rendering']?: ShapeRenderingProperty | Array<ShapeRenderingProperty>;
    ['stop-color']?: StopColorProperty | Array<StopColorProperty>;
    ['stop-opacity']?: GlobalsNumber | Array<GlobalsNumber>;
    stroke?: StrokeProperty | Array<StrokeProperty>;
    ['stroke-dasharray']?:
        | StrokeDasharrayProperty<TLength>
        | Array<StrokeDasharrayProperty<TLength>>;
    clip?: ClipProperty | Array<ClipProperty>;
    ['stroke-linecap']?: StrokeLinecapProperty | Array<StrokeLinecapProperty>;
    ['stroke-linejoin']?: StrokeLinejoinProperty | Array<StrokeLinejoinProperty>;
    ['stroke-miterlimit']?: GlobalsNumber | Array<GlobalsNumber>;
    ['stroke-opacity']?: GlobalsNumber | Array<GlobalsNumber>;
    ['stroke-width']?: StrokeWidthProperty<TLength> | Array<StrokeWidthProperty<TLength>>;
    ['text-anchor']?: TextAnchorProperty | Array<TextAnchorProperty>;
    ['text-decoration']?: TextDecorationProperty | Array<TextDecorationProperty>;
    ['text-rendering']?: TextRenderingProperty | Array<TextRenderingProperty>;
    ['unicode-bidi']?: UnicodeBidiProperty | Array<UnicodeBidiProperty>;
    ['vector-effect']?: VectorEffectProperty | Array<VectorEffectProperty>;
    visibility?: VisibilityProperty | Array<VisibilityProperty>;
    ['white-space']?: WhiteSpaceProperty | Array<WhiteSpaceProperty>;
    ['word-spacing']?: WordSpacingProperty<TLength> | Array<WordSpacingProperty<TLength>>;
    ['writing-mode']?: WritingModeProperty | Array<WritingModeProperty>;
}

export type PropertiesHyphenFallback<TLength = string | 0> =
    StandardPropertiesHyphenFallback<TLength> &
        VendorPropertiesHyphenFallback<TLength> &
        ObsoletePropertiesHyphenFallback<TLength> &
        SvgPropertiesHyphenFallback<TLength>;

export interface CounterStyle {
    additiveSymbols?: string;
    fallback?: string;
    negative?: string;
    pad?: string;
    prefix?: string;
    range?: CounterStyleRangeProperty;
    speakAs?: CounterStyleSpeakAsProperty;
    suffix?: string;
    symbols?: string;
    system?: CounterStyleSystemProperty;
}

export interface CounterStyleHyphen {
    ['additive-symbols']?: string;
    fallback?: string;
    negative?: string;
    pad?: string;
    prefix?: string;
    range?: CounterStyleRangeProperty;
    ['speak-as']?: CounterStyleSpeakAsProperty;
    suffix?: string;
    symbols?: string;
    system?: CounterStyleSystemProperty;
}

export interface CounterStyleFallback {
    additiveSymbols?: string | Array<string>;
    fallback?: string | Array<string>;
    negative?: string | Array<string>;
    pad?: string | Array<string>;
    prefix?: string | Array<string>;
    range?: CounterStyleRangeProperty | Array<CounterStyleRangeProperty>;
    speakAs?: CounterStyleSpeakAsProperty | Array<CounterStyleSpeakAsProperty>;
    suffix?: string | Array<string>;
    symbols?: string | Array<string>;
    system?: CounterStyleSystemProperty | Array<CounterStyleSystemProperty>;
}

export interface CounterStyleHyphenFallback {
    ['additive-symbols']?: string | Array<string>;
    fallback?: string | Array<string>;
    negative?: string | Array<string>;
    pad?: string | Array<string>;
    prefix?: string | Array<string>;
    range?: CounterStyleRangeProperty | Array<CounterStyleRangeProperty>;
    ['speak-as']?: CounterStyleSpeakAsProperty | Array<CounterStyleSpeakAsProperty>;
    suffix?: string | Array<string>;
    symbols?: string | Array<string>;
    system?: CounterStyleSystemProperty | Array<CounterStyleSystemProperty>;
}

export interface FontFace {
    fontStyle?: FontFaceFontStyleProperty;
    MozFontFeatureSettings?: FontFaceFontFeatureSettingsProperty;
    fontFamily?: string;
    fontFeatureSettings?: FontFaceFontFeatureSettingsProperty;
    fontStretch?: FontFaceFontStretchProperty;
    fontDisplay?: FontFaceFontDisplayProperty;
    fontVariant?: FontFaceFontVariantProperty;
    fontVariationSettings?: FontFaceFontVariationSettingsProperty;
    fontWeight?: FontFaceFontWeightProperty;
    src?: string;
    unicodeRange?: string;
}

export interface FontFaceHyphen {
    ['font-style']?: FontFaceFontStyleProperty;
    ['-moz-font-feature-settings']?: FontFaceFontFeatureSettingsProperty;
    ['font-family']?: string;
    ['font-feature-settings']?: FontFaceFontFeatureSettingsProperty;
    ['font-stretch']?: FontFaceFontStretchProperty;
    ['font-display']?: FontFaceFontDisplayProperty;
    ['font-variant']?: FontFaceFontVariantProperty;
    ['font-variation-settings']?: FontFaceFontVariationSettingsProperty;
    ['font-weight']?: FontFaceFontWeightProperty;
    src?: string;
    ['unicode-range']?: string;
}

export interface FontFaceFallback {
    MozFontFeatureSettings?:
        | FontFaceFontFeatureSettingsProperty
        | Array<FontFaceFontFeatureSettingsProperty>;
    fontFeatureSettings?:
        | FontFaceFontFeatureSettingsProperty
        | Array<FontFaceFontFeatureSettingsProperty>;
    fontVariationSettings?:
        | FontFaceFontVariationSettingsProperty
        | Array<FontFaceFontVariationSettingsProperty>;
    unicodeRange?: string | Array<string>;
    fontStretch?: FontFaceFontStretchProperty | Array<FontFaceFontStretchProperty>;
    fontDisplay?: FontFaceFontDisplayProperty | Array<FontFaceFontDisplayProperty>;
    fontVariant?: FontFaceFontVariantProperty | Array<FontFaceFontVariantProperty>;
    fontFamily?: string | Array<string>;
    fontWeight?: FontFaceFontWeightProperty | Array<FontFaceFontWeightProperty>;
    src?: string | Array<string>;
    fontStyle?: FontFaceFontStyleProperty | Array<FontFaceFontStyleProperty>;
}

export interface FontFaceHyphenFallback {
    ['-moz-font-feature-settings']?:
        | FontFaceFontFeatureSettingsProperty
        | Array<FontFaceFontFeatureSettingsProperty>;
    ['font-feature-settings']?:
        | FontFaceFontFeatureSettingsProperty
        | Array<FontFaceFontFeatureSettingsProperty>;
    ['font-variation-settings']?:
        | FontFaceFontVariationSettingsProperty
        | Array<FontFaceFontVariationSettingsProperty>;
    ['unicode-range']?: string | Array<string>;
    ['font-stretch']?: FontFaceFontStretchProperty | Array<FontFaceFontStretchProperty>;
    ['font-display']?: FontFaceFontDisplayProperty | Array<FontFaceFontDisplayProperty>;
    ['font-variant']?: FontFaceFontVariantProperty | Array<FontFaceFontVariantProperty>;
    ['font-family']?: string | Array<string>;
    ['font-weight']?: FontFaceFontWeightProperty | Array<FontFaceFontWeightProperty>;
    src?: string | Array<string>;
    ['font-style']?: FontFaceFontStyleProperty | Array<FontFaceFontStyleProperty>;
}

export interface Page<TLength = string | 0> {
    bleed?: PageBleedProperty<TLength>;
    marks?: PageMarksProperty;
}

export interface PageHyphen<TLength = string | 0> {
    bleed?: PageBleedProperty<TLength>;
    marks?: PageMarksProperty;
}

export interface PageFallback<TLength = string | 0> {
    bleed?: PageBleedProperty<TLength> | Array<PageBleedProperty<TLength>>;
    marks?: PageMarksProperty | Array<PageMarksProperty>;
}

export interface PageHyphenFallback<TLength = string | 0> {
    bleed?: PageBleedProperty<TLength> | Array<PageBleedProperty<TLength>>;
    marks?: PageMarksProperty | Array<PageMarksProperty>;
}

export interface Viewport<TLength = string | 0> {
    OOrientation?: ViewportOrientationProperty;
    msHeight?: ViewportHeightProperty<TLength>;
    msMaxWidth?: ViewportMaxWidthProperty<TLength>;
    msMaxZoom?: ViewportMaxZoomProperty;
    msMinHeight?: ViewportMinHeightProperty<TLength>;
    msMinWidth?: ViewportMinWidthProperty<TLength>;
    msMinZoom?: ViewportMinZoomProperty;
    msOrientation?: ViewportOrientationProperty;
    msUserZoom?: ViewportUserZoomProperty;
    msWidth?: ViewportWidthProperty<TLength>;
    msZoom?: ViewportZoomProperty;
    msMaxHeight?: ViewportMaxHeightProperty<TLength>;
    height?: ViewportHeightProperty<TLength>;
    maxHeight?: ViewportMaxHeightProperty<TLength>;
    maxWidth?: ViewportMaxWidthProperty<TLength>;
    maxZoom?: ViewportMaxZoomProperty;
    minHeight?: ViewportMinHeightProperty<TLength>;
    minWidth?: ViewportMinWidthProperty<TLength>;
    minZoom?: ViewportMinZoomProperty;
    orientation?: ViewportOrientationProperty;
    userZoom?: ViewportUserZoomProperty;
    width?: ViewportWidthProperty<TLength>;
    zoom?: ViewportZoomProperty;
}

export interface ViewportHyphen<TLength = string | 0> {
    ['-o-orientation']?: ViewportOrientationProperty;
    ['-ms-height']?: ViewportHeightProperty<TLength>;
    ['-ms-max-width']?: ViewportMaxWidthProperty<TLength>;
    ['-ms-max-zoom']?: ViewportMaxZoomProperty;
    ['-ms-min-height']?: ViewportMinHeightProperty<TLength>;
    ['-ms-min-width']?: ViewportMinWidthProperty<TLength>;
    ['-ms-min-zoom']?: ViewportMinZoomProperty;
    ['-ms-orientation']?: ViewportOrientationProperty;
    ['-ms-user-zoom']?: ViewportUserZoomProperty;
    ['-ms-width']?: ViewportWidthProperty<TLength>;
    ['-ms-zoom']?: ViewportZoomProperty;
    ['-ms-max-height']?: ViewportMaxHeightProperty<TLength>;
    height?: ViewportHeightProperty<TLength>;
    ['max-height']?: ViewportMaxHeightProperty<TLength>;
    ['max-width']?: ViewportMaxWidthProperty<TLength>;
    ['max-zoom']?: ViewportMaxZoomProperty;
    ['min-height']?: ViewportMinHeightProperty<TLength>;
    ['min-width']?: ViewportMinWidthProperty<TLength>;
    ['min-zoom']?: ViewportMinZoomProperty;
    orientation?: ViewportOrientationProperty;
    ['user-zoom']?: ViewportUserZoomProperty;
    width?: ViewportWidthProperty<TLength>;
    zoom?: ViewportZoomProperty;
}

export interface ViewportFallback<TLength = string | 0> {
    OOrientation?: ViewportOrientationProperty | Array<ViewportOrientationProperty>;
    msHeight?: ViewportHeightProperty<TLength> | Array<ViewportHeightProperty<TLength>>;
    msMaxWidth?: ViewportMaxWidthProperty<TLength> | Array<ViewportMaxWidthProperty<TLength>>;
    msMaxZoom?: ViewportMaxZoomProperty | Array<ViewportMaxZoomProperty>;
    msMinHeight?: ViewportMinHeightProperty<TLength> | Array<ViewportMinHeightProperty<TLength>>;
    msMinWidth?: ViewportMinWidthProperty<TLength> | Array<ViewportMinWidthProperty<TLength>>;
    msMinZoom?: ViewportMinZoomProperty | Array<ViewportMinZoomProperty>;
    msOrientation?: ViewportOrientationProperty | Array<ViewportOrientationProperty>;
    msUserZoom?: ViewportUserZoomProperty | Array<ViewportUserZoomProperty>;
    msWidth?: ViewportWidthProperty<TLength> | Array<ViewportWidthProperty<TLength>>;
    msZoom?: ViewportZoomProperty | Array<ViewportZoomProperty>;
    msMaxHeight?: ViewportMaxHeightProperty<TLength> | Array<ViewportMaxHeightProperty<TLength>>;
    height?: ViewportHeightProperty<TLength> | Array<ViewportHeightProperty<TLength>>;
    maxHeight?: ViewportMaxHeightProperty<TLength> | Array<ViewportMaxHeightProperty<TLength>>;
    maxWidth?: ViewportMaxWidthProperty<TLength> | Array<ViewportMaxWidthProperty<TLength>>;
    maxZoom?: ViewportMaxZoomProperty | Array<ViewportMaxZoomProperty>;
    minHeight?: ViewportMinHeightProperty<TLength> | Array<ViewportMinHeightProperty<TLength>>;
    minWidth?: ViewportMinWidthProperty<TLength> | Array<ViewportMinWidthProperty<TLength>>;
    minZoom?: ViewportMinZoomProperty | Array<ViewportMinZoomProperty>;
    orientation?: ViewportOrientationProperty | Array<ViewportOrientationProperty>;
    userZoom?: ViewportUserZoomProperty | Array<ViewportUserZoomProperty>;
    width?: ViewportWidthProperty<TLength> | Array<ViewportWidthProperty<TLength>>;
    zoom?: ViewportZoomProperty | Array<ViewportZoomProperty>;
}

export interface ViewportHyphenFallback<TLength = string | 0> {
    ['-o-orientation']?: ViewportOrientationProperty | Array<ViewportOrientationProperty>;
    ['-ms-min-height']?:
        | ViewportMinHeightProperty<TLength>
        | Array<ViewportMinHeightProperty<TLength>>;
    ['-ms-max-height']?:
        | ViewportMaxHeightProperty<TLength>
        | Array<ViewportMaxHeightProperty<TLength>>;
    ['-ms-max-zoom']?: ViewportMaxZoomProperty | Array<ViewportMaxZoomProperty>;
    ['-ms-height']?: ViewportHeightProperty<TLength> | Array<ViewportHeightProperty<TLength>>;
    ['-ms-min-width']?:
        | ViewportMinWidthProperty<TLength>
        | Array<ViewportMinWidthProperty<TLength>>;
    ['-ms-min-zoom']?: ViewportMinZoomProperty | Array<ViewportMinZoomProperty>;
    ['-ms-orientation']?: ViewportOrientationProperty | Array<ViewportOrientationProperty>;
    ['-ms-user-zoom']?: ViewportUserZoomProperty | Array<ViewportUserZoomProperty>;
    ['-ms-width']?: ViewportWidthProperty<TLength> | Array<ViewportWidthProperty<TLength>>;
    ['-ms-zoom']?: ViewportZoomProperty | Array<ViewportZoomProperty>;
    ['-ms-max-width']?:
        | ViewportMaxWidthProperty<TLength>
        | Array<ViewportMaxWidthProperty<TLength>>;
    height?: ViewportHeightProperty<TLength> | Array<ViewportHeightProperty<TLength>>;
    ['max-height']?: ViewportMaxHeightProperty<TLength> | Array<ViewportMaxHeightProperty<TLength>>;
    ['max-width']?: ViewportMaxWidthProperty<TLength> | Array<ViewportMaxWidthProperty<TLength>>;
    ['max-zoom']?: ViewportMaxZoomProperty | Array<ViewportMaxZoomProperty>;
    ['min-height']?: ViewportMinHeightProperty<TLength> | Array<ViewportMinHeightProperty<TLength>>;
    ['min-width']?: ViewportMinWidthProperty<TLength> | Array<ViewportMinWidthProperty<TLength>>;
    ['min-zoom']?: ViewportMinZoomProperty | Array<ViewportMinZoomProperty>;
    orientation?: ViewportOrientationProperty | Array<ViewportOrientationProperty>;
    ['user-zoom']?: ViewportUserZoomProperty | Array<ViewportUserZoomProperty>;
    width?: ViewportWidthProperty<TLength> | Array<ViewportWidthProperty<TLength>>;
    zoom?: ViewportZoomProperty | Array<ViewportZoomProperty>;
}

export type AtRules =
    | '@charset'
    | '@counter-style'
    | '@document'
    | '@font-face'
    | '@font-feature-values'
    | '@import'
    | '@keyframes'
    | '@media'
    | '@namespace'
    | '@page'
    | '@supports'
    | '@viewport';

export type AdvancedPseudos =
    | ':-moz-any()'
    | ':-moz-dir'
    | ':-webkit-any()'
    | '::cue'
    | '::part'
    | '::slotted'
    | ':dir'
    | ':has'
    | ':host'
    | ':host-context'
    | ':is'
    | ':lang'
    | ':matches()'
    | ':not'
    | ':nth-child'
    | ':nth-last-child'
    | ':nth-last-of-type'
    | ':nth-of-type'
    | ':where';

export type SimplePseudos =
    | ':-moz-any-link'
    | ':-moz-focusring'
    | ':-moz-full-screen'
    | ':-moz-placeholder'
    | ':-moz-read-only'
    | ':-moz-read-write'
    | ':-ms-fullscreen'
    | ':-ms-input-placeholder'
    | ':-webkit-any-link'
    | ':-webkit-full-screen'
    | '::-moz-placeholder'
    | '::-moz-progress-bar'
    | '::-moz-range-progress'
    | '::-moz-range-thumb'
    | '::-moz-range-track'
    | '::-moz-selection'
    | '::-ms-backdrop'
    | '::-ms-browse'
    | '::-ms-check'
    | '::-ms-clear'
    | '::-ms-fill'
    | '::-ms-fill-lower'
    | '::-ms-fill-upper'
    | '::-ms-input-placeholder'
    | '::-ms-reveal'
    | '::-ms-thumb'
    | '::-ms-ticks-after'
    | '::-ms-ticks-before'
    | '::-ms-tooltip'
    | '::-ms-track'
    | '::-ms-value'
    | '::-webkit-backdrop'
    | '::-webkit-input-placeholder'
    | '::-webkit-progress-bar'
    | '::-webkit-progress-inner-value'
    | '::-webkit-progress-value'
    | '::-webkit-slider-runnable-track'
    | '::-webkit-slider-thumb'
    | '::after'
    | '::backdrop'
    | '::before'
    | '::cue'
    | '::first-letter'
    | '::first-line'
    | '::grammar-error'
    | '::marker'
    | '::placeholder'
    | '::selection'
    | '::spelling-error'
    | ':active'
    | ':after'
    | ':any-link'
    | ':before'
    | ':blank'
    | ':checked'
    | ':default'
    | ':defined'
    | ':disabled'
    | ':empty'
    | ':enabled'
    | ':first'
    | ':first-child'
    | ':first-letter'
    | ':first-line'
    | ':first-of-type'
    | ':focus'
    | ':focus-visible'
    | ':focus-within'
    | ':fullscreen'
    | ':hover'
    | ':in-range'
    | ':indeterminate'
    | ':invalid'
    | ':last-child'
    | ':last-of-type'
    | ':left'
    | ':link'
    | ':only-child'
    | ':only-of-type'
    | ':optional'
    | ':out-of-range'
    | ':placeholder-shown'
    | ':read-only'
    | ':read-write'
    | ':required'
    | ':right'
    | ':root'
    | ':scope'
    | ':target'
    | ':valid'
    | ':visited';

export type Pseudos = AdvancedPseudos | SimplePseudos;

export type HtmlAttributes =
    | '[-webkit-dropzone]'
    | '[-webkit-slot]'
    | '[abbr]'
    | '[accept-charset]'
    | '[accept]'
    | '[accesskey]'
    | '[action]'
    | '[align]'
    | '[alink]'
    | '[allow]'
    | '[allowfullscreen]'
    | '[allowpaymentrequest]'
    | '[alt]'
    | '[archive]'
    | '[async]'
    | '[autobuffer]'
    | '[autocapitalize]'
    | '[autocomplete]'
    | '[autofocus]'
    | '[autoplay]'
    | '[axis]'
    | '[background]'
    | '[behavior]'
    | '[bgcolor]'
    | '[border]'
    | '[bottommargin]'
    | '[buffered]'
    | '[cellpadding]'
    | '[cellspacing]'
    | '[char]'
    | '[charoff]'
    | '[charset]'
    | '[checked]'
    | '[cite]'
    | '[class]'
    | '[classid]'
    | '[clear]'
    | '[code]'
    | '[codebase]'
    | '[codetype]'
    | '[color]'
    | '[cols]'
    | '[colspan]'
    | '[command]'
    | '[compact]'
    | '[content]'
    | '[contenteditable]'
    | '[contextmenu]'
    | '[controls]'
    | '[coords]'
    | '[crossorigin]'
    | '[data]'
    | '[datafld]'
    | '[datasrc]'
    | '[datetime]'
    | '[declare]'
    | '[decoding]'
    | '[default]'
    | '[defer]'
    | '[dir]'
    | '[direction]'
    | '[disabled]'
    | '[download]'
    | '[draggable]'
    | '[dropzone]'
    | '[enctype]'
    | '[exportparts]'
    | '[face]'
    | '[for]'
    | '[form]'
    | '[formaction]'
    | '[formenctype]'
    | '[formmethod]'
    | '[formnovalidate]'
    | '[formtarget]'
    | '[frame]'
    | '[frameborder]'
    | '[headers]'
    | '[height]'
    | '[hidden]'
    | '[high]'
    | '[href]'
    | '[hreflang]'
    | '[hspace]'
    | '[http-equiv]'
    | '[icon]'
    | '[id]'
    | '[inputmode]'
    | '[integrity]'
    | '[intrinsicsize]'
    | '[is]'
    | '[ismap]'
    | '[itemid]'
    | '[itemprop]'
    | '[itemref]'
    | '[itemscope]'
    | '[itemtype]'
    | '[kind]'
    | '[label]'
    | '[lang]'
    | '[language]'
    | '[leftmargin]'
    | '[link]'
    | '[longdesc]'
    | '[loop]'
    | '[low]'
    | '[manifest]'
    | '[marginheight]'
    | '[marginwidth]'
    | '[max]'
    | '[maxlength]'
    | '[mayscript]'
    | '[media]'
    | '[method]'
    | '[methods]'
    | '[min]'
    | '[minlength]'
    | '[moz-opaque]'
    | '[mozallowfullscreen]'
    | '[mozbrowser]'
    | '[mozcurrentsampleoffset]'
    | '[msallowfullscreen]'
    | '[multiple]'
    | '[muted]'
    | '[name]'
    | '[nohref]'
    | '[nomodule]'
    | '[noresize]'
    | '[noshade]'
    | '[novalidate]'
    | '[nowrap]'
    | '[object]'
    | '[onafterprint]'
    | '[onbeforeprint]'
    | '[onbeforeunload]'
    | '[onblur]'
    | '[onerror]'
    | '[onfocus]'
    | '[onhashchange]'
    | '[onlanguagechange]'
    | '[onload]'
    | '[onmessage]'
    | '[onoffline]'
    | '[ononline]'
    | '[onpopstate]'
    | '[onredo]'
    | '[onresize]'
    | '[onstorage]'
    | '[onundo]'
    | '[onunload]'
    | '[open]'
    | '[optimum]'
    | '[part]'
    | '[ping]'
    | '[placeholder]'
    | '[played]'
    | '[poster]'
    | '[prefetch]'
    | '[preload]'
    | '[profile]'
    | '[prompt]'
    | '[radiogroup]'
    | '[readonly]'
    | '[referrerPolicy]'
    | '[referrerpolicy]'
    | '[rel]'
    | '[required]'
    | '[rev]'
    | '[reversed]'
    | '[rightmargin]'
    | '[rows]'
    | '[rowspan]'
    | '[rules]'
    | '[sandbox-allow-modals]'
    | '[sandbox-allow-popups-to-escape-sandbox]'
    | '[sandbox-allow-popups]'
    | '[sandbox-allow-presentation]'
    | '[sandbox-allow-storage-access-by-user-activation]'
    | '[sandbox-allow-top-navigation-by-user-activation]'
    | '[sandbox]'
    | '[scope]'
    | '[scoped]'
    | '[scrollamount]'
    | '[scrolldelay]'
    | '[scrolling]'
    | '[selected]'
    | '[shape]'
    | '[size]'
    | '[sizes]'
    | '[slot]'
    | '[span]'
    | '[spellcheck]'
    | '[src]'
    | '[srcdoc]'
    | '[srclang]'
    | '[srcset]'
    | '[standby]'
    | '[start]'
    | '[style]'
    | '[summary]'
    | '[tabindex]'
    | '[target]'
    | '[text]'
    | '[title]'
    | '[topmargin]'
    | '[translate]'
    | '[truespeed]'
    | '[type]'
    | '[typemustmatch]'
    | '[usemap]'
    | '[valign]'
    | '[value]'
    | '[valuetype]'
    | '[version]'
    | '[vlink]'
    | '[volume]'
    | '[vspace]'
    | '[webkitallowfullscreen]'
    | '[width]'
    | '[wrap]'
    | '[xmlns]';

export type SvgAttributes =
    | '[accent-height]'
    | '[alignment-baseline]'
    | '[allowReorder]'
    | '[alphabetic]'
    | '[animation]'
    | '[arabic-form]'
    | '[ascent]'
    | '[attributeName]'
    | '[attributeType]'
    | '[azimuth]'
    | '[baseFrequency]'
    | '[baseProfile]'
    | '[baseline-shift]'
    | '[bbox]'
    | '[begin]'
    | '[bias]'
    | '[by]'
    | '[calcMode]'
    | '[cap-height]'
    | '[class]'
    | '[clip-path]'
    | '[clip-rule]'
    | '[clipPathUnits]'
    | '[clip]'
    | '[color-interpolation-filters]'
    | '[color-interpolation]'
    | '[color-profile]'
    | '[color-rendering]'
    | '[color]'
    | '[contentScriptType]'
    | '[contentStyleType]'
    | '[cursor]'
    | '[cx]'
    | '[cy]'
    | '[d]'
    | '[descent]'
    | '[diffuseConstant]'
    | '[direction]'
    | '[display]'
    | '[divisor]'
    | '[document]'
    | '[dominant-baseline]'
    | '[download]'
    | '[dur]'
    | '[dx]'
    | '[dy]'
    | '[edgeMode]'
    | '[elevation]'
    | '[enable-background]'
    | '[externalResourcesRequired]'
    | '[fill-opacity]'
    | '[fill-rule]'
    | '[fill]'
    | '[filterRes]'
    | '[filterUnits]'
    | '[filter]'
    | '[flood-color]'
    | '[flood-opacity]'
    | '[font-family]'
    | '[font-size-adjust]'
    | '[font-size]'
    | '[font-stretch]'
    | '[font-style]'
    | '[font-variant]'
    | '[font-weight]'
    | '[format]'
    | '[fr]'
    | '[from]'
    | '[fx]'
    | '[fy]'
    | '[g1]'
    | '[g2]'
    | '[global]'
    | '[glyph-name]'
    | '[glyph-orientation-horizontal]'
    | '[glyph-orientation-vertical]'
    | '[glyphRef]'
    | '[gradientTransform]'
    | '[gradientUnits]'
    | '[graphical]'
    | '[hanging]'
    | '[hatchContentUnits]'
    | '[hatchUnits]'
    | '[height]'
    | '[horiz-adv-x]'
    | '[horiz-origin-x]'
    | '[horiz-origin-y]'
    | '[href]'
    | '[hreflang]'
    | '[id]'
    | '[ideographic]'
    | '[image-rendering]'
    | '[in2]'
    | '[in]'
    | '[k1]'
    | '[k2]'
    | '[k3]'
    | '[k4]'
    | '[k]'
    | '[kernelMatrix]'
    | '[kernelUnitLength]'
    | '[kerning]'
    | '[keyPoints]'
    | '[lang]'
    | '[lengthAdjust]'
    | '[letter-spacing]'
    | '[lighterForError]'
    | '[lighting-color]'
    | '[limitingConeAngle]'
    | '[local]'
    | '[marker-end]'
    | '[marker-mid]'
    | '[marker-start]'
    | '[markerHeight]'
    | '[markerUnits]'
    | '[markerWidth]'
    | '[maskContentUnits]'
    | '[maskUnits]'
    | '[mask]'
    | '[mathematical]'
    | '[media]'
    | '[method]'
    | '[mode]'
    | '[name]'
    | '[numOctaves]'
    | '[offset]'
    | '[opacity]'
    | '[operator]'
    | '[order]'
    | '[orient]'
    | '[orientation]'
    | '[origin]'
    | '[overflow]'
    | '[overline-position]'
    | '[overline-thickness]'
    | '[paint-order]'
    | '[panose-1]'
    | '[path]'
    | '[patternContentUnits]'
    | '[patternTransform]'
    | '[patternUnits]'
    | '[ping]'
    | '[pitch]'
    | '[pointer-events]'
    | '[pointsAtX]'
    | '[pointsAtY]'
    | '[pointsAtZ]'
    | '[points]'
    | '[preserveAlpha]'
    | '[preserveAspectRatio]'
    | '[primitiveUnits]'
    | '[r]'
    | '[radius]'
    | '[refX]'
    | '[refY]'
    | '[referrerPolicy]'
    | '[rel]'
    | '[rendering-intent]'
    | '[repeatCount]'
    | '[requiredExtensions]'
    | '[requiredFeatures]'
    | '[rotate]'
    | '[rx]'
    | '[ry]'
    | '[scale]'
    | '[seed]'
    | '[shape-rendering]'
    | '[side]'
    | '[slope]'
    | '[solid-color]'
    | '[solid-opacity]'
    | '[spacing]'
    | '[specularConstant]'
    | '[specularExponent]'
    | '[spreadMethod]'
    | '[startOffset]'
    | '[stdDeviation]'
    | '[stemh]'
    | '[stemv]'
    | '[stitchTiles]'
    | '[stop-color]'
    | '[stop-opacity]'
    | '[strikethrough-position]'
    | '[strikethrough-thickness]'
    | '[string]'
    | '[stroke-dasharray]'
    | '[stroke-dashoffset]'
    | '[stroke-linecap]'
    | '[stroke-linejoin]'
    | '[stroke-miterlimit]'
    | '[stroke-opacity]'
    | '[stroke-width]'
    | '[stroke]'
    | '[style]'
    | '[surfaceScale]'
    | '[systemLanguage]'
    | '[tabindex]'
    | '[targetX]'
    | '[targetY]'
    | '[target]'
    | '[text-anchor]'
    | '[text-decoration]'
    | '[text-overflow]'
    | '[text-rendering]'
    | '[textLength]'
    | '[title]'
    | '[to]'
    | '[transform]'
    | '[type]'
    | '[u1]'
    | '[u2]'
    | '[underline-position]'
    | '[underline-thickness]'
    | '[unicode-bidi]'
    | '[unicode-range]'
    | '[unicode]'
    | '[units-per-em]'
    | '[v-alphabetic]'
    | '[v-hanging]'
    | '[v-ideographic]'
    | '[v-mathematical]'
    | '[values]'
    | '[vector-effect]'
    | '[version]'
    | '[vert-adv-y]'
    | '[vert-origin-x]'
    | '[vert-origin-y]'
    | '[viewBox]'
    | '[viewTarget]'
    | '[visibility]'
    | '[white-space]'
    | '[width]'
    | '[widths]'
    | '[word-spacing]'
    | '[writing-mode]'
    | '[x-height]'
    | '[x1]'
    | '[x2]'
    | '[xChannelSelector]'
    | '[x]'
    | '[y1]'
    | '[y2]'
    | '[yChannelSelector]'
    | '[y]'
    | '[z]'
    | '[zoomAndPan]';

export type Globals = '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset';

type GlobalsString = Globals | string;

export type GlobalsNumber = Globals | number;

export type AlignContentProperty =
    | Globals
    | ContentDistribution
    | ContentPosition
    | 'baseline'
    | 'normal'
    | string;

export type AlignItemsProperty =
    | Globals
    | SelfPosition
    | 'baseline'
    | 'normal'
    | 'stretch'
    | string;

export type AlignSelfProperty =
    | Globals
    | SelfPosition
    | 'auto'
    | 'baseline'
    | 'normal'
    | 'stretch'
    | string;

export type AnimationProperty = Globals | SingleAnimation | string;

export type AnimationDirectionProperty = Globals | SingleAnimationDirection | string;

export type AnimationFillModeProperty = Globals | SingleAnimationFillMode | string;

export type AnimationIterationCountProperty = Globals | 'infinite' | string | number;

export type AnimationNameProperty = Globals | 'none' | string;

export type AnimationPlayStateProperty = Globals | 'paused' | 'running' | string;

export type AnimationTimingFunctionProperty = Globals | TimingFunction | string;

export type AppearanceProperty = Globals | Compat | 'button' | 'none' | 'textfield';

export type BackdropFilterProperty = Globals | 'none' | string;

export type BackfaceVisibilityProperty = Globals | 'hidden' | 'visible';

export type BackgroundProperty<TLength> = Globals | FinalBgLayer<TLength> | string;

export type BackgroundAttachmentProperty = Globals | Attachment | string;

export type BackgroundBlendModeProperty = Globals | BlendMode | string;

export type BackgroundClipProperty = Globals | Box | string;

export type BackgroundColorProperty = Globals | Color;

export type BackgroundImageProperty = Globals | 'none' | string;

export type BackgroundOriginProperty = Globals | Box | string;

export type BackgroundPositionProperty<TLength> = Globals | BgPosition<TLength> | string;

export type BackgroundPositionXProperty<TLength> =
    | Globals
    | TLength
    | 'center'
    | 'left'
    | 'right'
    | 'x-end'
    | 'x-start'
    | string;

export type BackgroundPositionYProperty<TLength> =
    | Globals
    | TLength
    | 'bottom'
    | 'center'
    | 'top'
    | 'y-end'
    | 'y-start'
    | string;

export type BackgroundRepeatProperty = Globals | RepeatStyle | string;

export type BackgroundSizeProperty<TLength> = Globals | BgSize<TLength> | string;

export type BlockOverflowProperty = Globals | 'clip' | 'ellipsis' | string;

export type BlockSizeProperty<TLength> =
    | Globals
    | TLength
    | '-moz-fit-content'
    | '-moz-max-content'
    | '-moz-min-content'
    | '-webkit-fill-available'
    | 'auto'
    | 'available'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | string;

export type BorderProperty<TLength> = Globals | LineWidth<TLength> | LineStyle | Color | string;

export type BorderBlockProperty<TLength> =
    | Globals
    | LineWidth<TLength>
    | LineStyle
    | Color
    | string;

export type BorderBlockColorProperty = Globals | Color | string;

export type BorderBlockEndProperty<TLength> =
    | Globals
    | LineWidth<TLength>
    | LineStyle
    | Color
    | string;

export type BorderBlockEndColorProperty = Globals | Color;

export type BorderBlockEndStyleProperty = Globals | LineStyle;

export type BorderBlockEndWidthProperty<TLength> = Globals | LineWidth<TLength>;

export type BorderBlockStartProperty<TLength> =
    | Globals
    | LineWidth<TLength>
    | LineStyle
    | Color
    | string;

export type BorderBlockStartColorProperty = Globals | Color;

export type BorderBlockStartStyleProperty = Globals | LineStyle;

export type BorderBlockStartWidthProperty<TLength> = Globals | LineWidth<TLength>;

export type BorderBlockStyleProperty = Globals | LineStyle;

export type BorderBlockWidthProperty<TLength> = Globals | LineWidth<TLength>;

export type BorderBottomProperty<TLength> =
    | Globals
    | LineWidth<TLength>
    | LineStyle
    | Color
    | string;

export type BorderBottomColorProperty = Globals | Color;

export type BorderBottomLeftRadiusProperty<TLength> = Globals | TLength | string;

export type BorderBottomRightRadiusProperty<TLength> = Globals | TLength | string;

export type BorderBottomStyleProperty = Globals | LineStyle;

export type BorderBottomWidthProperty<TLength> = Globals | LineWidth<TLength>;

export type BorderCollapseProperty = Globals | 'collapse' | 'separate';

export type BorderColorProperty = Globals | Color | string;

export type BorderEndEndRadiusProperty<TLength> = Globals | TLength | string;

export type BorderEndStartRadiusProperty<TLength> = Globals | TLength | string;

export type BorderImageProperty =
    | Globals
    | 'none'
    | 'repeat'
    | 'round'
    | 'space'
    | 'stretch'
    | string
    | number;

export type BorderImageOutsetProperty<TLength> = Globals | TLength | string | number;

export type BorderImageRepeatProperty = Globals | 'repeat' | 'round' | 'space' | 'stretch' | string;

export type BorderImageSliceProperty = Globals | string | number;

export type BorderImageSourceProperty = Globals | 'none' | string;

export type BorderImageWidthProperty<TLength> = Globals | TLength | 'auto' | string | number;

export type BorderInlineProperty<TLength> =
    | Globals
    | LineWidth<TLength>
    | LineStyle
    | Color
    | string;

export type BorderInlineColorProperty = Globals | Color | string;

export type BorderInlineEndProperty<TLength> =
    | Globals
    | LineWidth<TLength>
    | LineStyle
    | Color
    | string;

export type BorderInlineEndColorProperty = Globals | Color;

export type BorderInlineEndStyleProperty = Globals | LineStyle;

export type BorderInlineEndWidthProperty<TLength> = Globals | LineWidth<TLength>;

export type BorderInlineStartProperty<TLength> =
    | Globals
    | LineWidth<TLength>
    | LineStyle
    | Color
    | string;

export type BorderInlineStartColorProperty = Globals | Color;

export type BorderInlineStartStyleProperty = Globals | LineStyle;

export type BorderInlineStartWidthProperty<TLength> = Globals | LineWidth<TLength>;

export type BorderInlineStyleProperty = Globals | LineStyle;

export type BorderInlineWidthProperty<TLength> = Globals | LineWidth<TLength>;

export type BorderLeftProperty<TLength> = Globals | LineWidth<TLength> | LineStyle | Color | string;

export type BorderLeftColorProperty = Globals | Color;

export type BorderLeftStyleProperty = Globals | LineStyle;

export type BorderLeftWidthProperty<TLength> = Globals | LineWidth<TLength>;

export type BorderRadiusProperty<TLength> = Globals | TLength | string;

export type BorderRightProperty<TLength> =
    | Globals
    | LineWidth<TLength>
    | LineStyle
    | Color
    | string;

export type BorderRightColorProperty = Globals | Color;

export type BorderRightStyleProperty = Globals | LineStyle;

export type BorderRightWidthProperty<TLength> = Globals | LineWidth<TLength>;

export type BorderSpacingProperty<TLength> = Globals | TLength | string;

export type BorderStartEndRadiusProperty<TLength> = Globals | TLength | string;

export type BorderStartStartRadiusProperty<TLength> = Globals | TLength | string;

export type BorderStyleProperty = Globals | LineStyle | string;

export type BorderTopProperty<TLength> = Globals | LineWidth<TLength> | LineStyle | Color | string;

export type BorderTopColorProperty = Globals | Color;

export type BorderTopLeftRadiusProperty<TLength> = Globals | TLength | string;

export type BorderTopRightRadiusProperty<TLength> = Globals | TLength | string;

export type BorderTopStyleProperty = Globals | LineStyle;

export type BorderTopWidthProperty<TLength> = Globals | LineWidth<TLength>;

export type BorderWidthProperty<TLength> = Globals | LineWidth<TLength> | string;

export type BottomProperty<TLength> = Globals | TLength | 'auto' | string;

export type BoxAlignProperty = Globals | 'baseline' | 'center' | 'end' | 'start' | 'stretch';

export type BoxDecorationBreakProperty = Globals | 'clone' | 'slice';

export type BoxDirectionProperty = Globals | 'inherit' | 'normal' | 'reverse';

export type BoxLinesProperty = Globals | 'multiple' | 'single';

export type BoxOrientProperty =
    | Globals
    | 'block-axis'
    | 'horizontal'
    | 'inherit'
    | 'inline-axis'
    | 'vertical';

export type BoxPackProperty = Globals | 'center' | 'end' | 'justify' | 'start';

export type BoxShadowProperty = Globals | 'none' | string;

export type BoxSizingProperty = Globals | 'border-box' | 'content-box';

export type BreakAfterProperty =
    | Globals
    | 'all'
    | 'always'
    | 'auto'
    | 'avoid'
    | 'avoid-column'
    | 'avoid-page'
    | 'avoid-region'
    | 'column'
    | 'left'
    | 'page'
    | 'recto'
    | 'region'
    | 'right'
    | 'verso';

export type BreakBeforeProperty =
    | Globals
    | 'all'
    | 'always'
    | 'auto'
    | 'avoid'
    | 'avoid-column'
    | 'avoid-page'
    | 'avoid-region'
    | 'column'
    | 'left'
    | 'page'
    | 'recto'
    | 'region'
    | 'right'
    | 'verso';

export type BreakInsideProperty =
    | Globals
    | 'auto'
    | 'avoid'
    | 'avoid-column'
    | 'avoid-page'
    | 'avoid-region';

export type CaptionSideProperty =
    | Globals
    | 'block-end'
    | 'block-start'
    | 'bottom'
    | 'inline-end'
    | 'inline-start'
    | 'top';

export type CaretColorProperty = Globals | Color | 'auto';

export type ClearProperty =
    | Globals
    | 'both'
    | 'inline-end'
    | 'inline-start'
    | 'left'
    | 'none'
    | 'right';

export type ClipProperty = Globals | 'auto' | string;

export type ClipPathProperty = Globals | GeometryBox | 'none' | string;

export type ColorProperty = Globals | Color;

export type ColorAdjustProperty = Globals | 'economy' | 'exact';

export type ColumnCountProperty = Globals | 'auto' | number;

export type ColumnFillProperty = Globals | 'auto' | 'balance' | 'balance-all';

export type ColumnGapProperty<TLength> = Globals | TLength | 'normal' | string;

export type ColumnRuleProperty<TLength> = Globals | LineWidth<TLength> | LineStyle | Color | string;

export type ColumnRuleColorProperty = Globals | Color;

export type ColumnRuleStyleProperty = Globals | LineStyle | string;

export type ColumnRuleWidthProperty<TLength> = Globals | LineWidth<TLength> | string;

export type ColumnSpanProperty = Globals | 'all' | 'none';

export type ColumnWidthProperty<TLength> = Globals | TLength | 'auto';

export type ColumnsProperty<TLength> = Globals | TLength | 'auto' | string | number;

export type ContainProperty =
    | Globals
    | 'content'
    | 'layout'
    | 'none'
    | 'paint'
    | 'size'
    | 'strict'
    | 'style'
    | string;

export type ContentProperty = Globals | ContentList | 'none' | 'normal' | string;

export type CounterIncrementProperty = Globals | 'none' | string;

export type CounterResetProperty = Globals | 'none' | string;

export type CounterSetProperty = Globals | 'none' | string;

export type CursorProperty =
    | Globals
    | '-moz-grab'
    | '-webkit-grab'
    | 'alias'
    | 'all-scroll'
    | 'auto'
    | 'cell'
    | 'col-resize'
    | 'context-menu'
    | 'copy'
    | 'crosshair'
    | 'default'
    | 'e-resize'
    | 'ew-resize'
    | 'grab'
    | 'grabbing'
    | 'help'
    | 'move'
    | 'n-resize'
    | 'ne-resize'
    | 'nesw-resize'
    | 'no-drop'
    | 'none'
    | 'not-allowed'
    | 'ns-resize'
    | 'nw-resize'
    | 'nwse-resize'
    | 'pointer'
    | 'progress'
    | 'row-resize'
    | 's-resize'
    | 'se-resize'
    | 'sw-resize'
    | 'text'
    | 'vertical-text'
    | 'w-resize'
    | 'wait'
    | 'zoom-in'
    | 'zoom-out'
    | string;

export type DirectionProperty = Globals | 'ltr' | 'rtl';

export type DisplayProperty =
    | Globals
    | DisplayOutside
    | DisplayInside
    | DisplayInternal
    | DisplayLegacy
    | 'contents'
    | 'list-item'
    | 'none';

export type EmptyCellsProperty = Globals | 'hide' | 'show';

export type FilterProperty = Globals | 'none' | string;

export type FlexProperty<TLength> =
    | Globals
    | TLength
    | 'auto'
    | 'available'
    | 'content'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | 'none'
    | string
    | number;

export type FlexBasisProperty<TLength> =
    | Globals
    | TLength
    | '-moz-max-content'
    | '-moz-min-content'
    | '-webkit-auto'
    | 'auto'
    | 'available'
    | 'content'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | string;

export type FlexDirectionProperty = Globals | 'column' | 'column-reverse' | 'row' | 'row-reverse';

export type FlexFlowProperty =
    | Globals
    | 'column'
    | 'column-reverse'
    | 'nowrap'
    | 'row'
    | 'row-reverse'
    | 'wrap'
    | 'wrap-reverse'
    | string;

export type FlexWrapProperty = Globals | 'nowrap' | 'wrap' | 'wrap-reverse';

export type FloatProperty = Globals | 'inline-end' | 'inline-start' | 'left' | 'none' | 'right';

export type FontProperty =
    | Globals
    | 'caption'
    | 'icon'
    | 'menu'
    | 'message-box'
    | 'small-caption'
    | 'status-bar'
    | string;

export type FontFamilyProperty = Globals | GenericFamily | string;

export type FontFeatureSettingsProperty = Globals | 'normal' | string;

export type FontKerningProperty = Globals | 'auto' | 'none' | 'normal';

export type FontLanguageOverrideProperty = Globals | 'normal' | string;

export type FontOpticalSizingProperty = Globals | 'auto' | 'none';

export type FontSizeProperty<TLength> =
    | Globals
    | AbsoluteSize
    | TLength
    | 'larger'
    | 'smaller'
    | string;

export type FontSizeAdjustProperty = Globals | 'none' | number;

export type FontStretchProperty = Globals | FontStretchAbsolute;

export type FontStyleProperty = Globals | 'italic' | 'normal' | 'oblique' | string;

export type FontSynthesisProperty = Globals | 'none' | 'style' | 'weight' | string;

export type FontVariantProperty =
    | Globals
    | EastAsianVariantValues
    | 'all-petite-caps'
    | 'all-small-caps'
    | 'common-ligatures'
    | 'contextual'
    | 'diagonal-fractions'
    | 'discretionary-ligatures'
    | 'full-width'
    | 'historical-forms'
    | 'historical-ligatures'
    | 'lining-nums'
    | 'no-common-ligatures'
    | 'no-contextual'
    | 'no-discretionary-ligatures'
    | 'no-historical-ligatures'
    | 'none'
    | 'normal'
    | 'oldstyle-nums'
    | 'ordinal'
    | 'petite-caps'
    | 'proportional-nums'
    | 'proportional-width'
    | 'ruby'
    | 'slashed-zero'
    | 'small-caps'
    | 'stacked-fractions'
    | 'tabular-nums'
    | 'titling-caps'
    | 'unicase'
    | string;

export type FontVariantAlternatesProperty = Globals | 'historical-forms' | 'normal' | string;

export type FontVariantCapsProperty =
    | Globals
    | 'all-petite-caps'
    | 'all-small-caps'
    | 'normal'
    | 'petite-caps'
    | 'small-caps'
    | 'titling-caps'
    | 'unicase';

export type FontVariantEastAsianProperty =
    | Globals
    | EastAsianVariantValues
    | 'full-width'
    | 'normal'
    | 'proportional-width'
    | 'ruby'
    | string;

export type FontVariantLigaturesProperty =
    | Globals
    | 'common-ligatures'
    | 'contextual'
    | 'discretionary-ligatures'
    | 'historical-ligatures'
    | 'no-common-ligatures'
    | 'no-contextual'
    | 'no-discretionary-ligatures'
    | 'no-historical-ligatures'
    | 'none'
    | 'normal'
    | string;

export type FontVariantNumericProperty =
    | Globals
    | 'diagonal-fractions'
    | 'lining-nums'
    | 'normal'
    | 'oldstyle-nums'
    | 'ordinal'
    | 'proportional-nums'
    | 'slashed-zero'
    | 'stacked-fractions'
    | 'tabular-nums'
    | string;

export type FontVariantPositionProperty = Globals | 'normal' | 'sub' | 'super';

export type FontVariationSettingsProperty = Globals | 'normal' | string;

export type FontWeightProperty = Globals | FontWeightAbsolute | 'bolder' | 'lighter';

export type GapProperty<TLength> = Globals | TLength | 'normal' | string;

export type GridProperty = Globals | 'none' | string;

export type GridAreaProperty = Globals | GridLine | string;

export type GridAutoColumnsProperty<TLength> = Globals | TrackBreadth<TLength> | string;

export type GridAutoFlowProperty = Globals | 'column' | 'dense' | 'row' | string;

export type GridAutoRowsProperty<TLength> = Globals | TrackBreadth<TLength> | string;

export type GridColumnProperty = Globals | GridLine | string;

export type GridColumnEndProperty = Globals | GridLine;

export type GridColumnGapProperty<TLength> = Globals | TLength | string;

export type GridColumnStartProperty = Globals | GridLine;

export type GridGapProperty<TLength> = Globals | TLength | string;

export type GridRowProperty = Globals | GridLine | string;

export type GridRowEndProperty = Globals | GridLine;

export type GridRowGapProperty<TLength> = Globals | TLength | string;

export type GridRowStartProperty = Globals | GridLine;

export type GridTemplateProperty = Globals | 'none' | string;

export type GridTemplateAreasProperty = Globals | 'none' | string;

export type GridTemplateColumnsProperty<TLength> =
    | Globals
    | TrackBreadth<TLength>
    | 'none'
    | string;

export type GridTemplateRowsProperty<TLength> = Globals | TrackBreadth<TLength> | 'none' | string;

export type HangingPunctuationProperty =
    | Globals
    | 'allow-end'
    | 'first'
    | 'force-end'
    | 'last'
    | 'none'
    | string;

export type HeightProperty<TLength> =
    | Globals
    | TLength
    | '-moz-max-content'
    | '-moz-min-content'
    | 'auto'
    | 'available'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | string;

export type HyphensProperty = Globals | 'auto' | 'manual' | 'none';

export type ImageOrientationProperty = Globals | 'flip' | 'from-image' | string;

export type ImageRenderingProperty =
    | Globals
    | '-moz-crisp-edges'
    | '-o-crisp-edges'
    | '-webkit-optimize-contrast'
    | 'auto'
    | 'crisp-edges'
    | 'pixelated';

export type ImageResolutionProperty = Globals | 'from-image' | string;

export type ImeModeProperty = Globals | 'active' | 'auto' | 'disabled' | 'inactive' | 'normal';

export type InitialLetterProperty = Globals | 'normal' | string | number;

export type InlineSizeProperty<TLength> =
    | Globals
    | TLength
    | '-moz-fit-content'
    | '-moz-max-content'
    | '-moz-min-content'
    | '-webkit-fill-available'
    | 'auto'
    | 'available'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | string;

export type InsetProperty<TLength> = Globals | TLength | 'auto' | string;

export type InsetBlockProperty<TLength> = Globals | TLength | 'auto' | string;

export type InsetBlockEndProperty<TLength> = Globals | TLength | 'auto' | string;

export type InsetBlockStartProperty<TLength> = Globals | TLength | 'auto' | string;

export type InsetInlineProperty<TLength> = Globals | TLength | 'auto' | string;

export type InsetInlineEndProperty<TLength> = Globals | TLength | 'auto' | string;

export type InsetInlineStartProperty<TLength> = Globals | TLength | 'auto' | string;

export type IsolationProperty = Globals | 'auto' | 'isolate';

export type JustifyContentProperty =
    | Globals
    | ContentDistribution
    | ContentPosition
    | 'left'
    | 'normal'
    | 'right'
    | string;

export type JustifyItemsProperty =
    | Globals
    | SelfPosition
    | 'baseline'
    | 'left'
    | 'legacy'
    | 'normal'
    | 'right'
    | 'stretch'
    | string;

export type JustifySelfProperty =
    | Globals
    | SelfPosition
    | 'auto'
    | 'baseline'
    | 'left'
    | 'normal'
    | 'right'
    | 'stretch'
    | string;

export type LeftProperty<TLength> = Globals | TLength | 'auto' | string;

export type LetterSpacingProperty<TLength> = Globals | TLength | 'normal';

export type LineBreakProperty = Globals | 'auto' | 'loose' | 'normal' | 'strict';

export type LineClampProperty = Globals | 'none' | number;

export type LineHeightProperty<TLength> = Globals | TLength | 'normal' | string | number;

export type LineHeightStepProperty<TLength> = Globals | TLength;

export type ListStyleProperty = Globals | 'inside' | 'none' | 'outside' | string;

export type ListStyleImageProperty = Globals | 'none' | string;

export type ListStylePositionProperty = Globals | 'inside' | 'outside';

export type ListStyleTypeProperty = Globals | 'none' | string;

export type MarginProperty<TLength> = Globals | TLength | 'auto' | string;

export type MarginBlockProperty<TLength> = Globals | TLength | 'auto' | string;

export type MarginBlockEndProperty<TLength> = Globals | TLength | 'auto' | string;

export type MarginBlockStartProperty<TLength> = Globals | TLength | 'auto' | string;

export type MarginBottomProperty<TLength> = Globals | TLength | 'auto' | string;

export type MarginInlineProperty<TLength> = Globals | TLength | 'auto' | string;

export type MarginInlineEndProperty<TLength> = Globals | TLength | 'auto' | string;

export type MarginInlineStartProperty<TLength> = Globals | TLength | 'auto' | string;

export type MarginLeftProperty<TLength> = Globals | TLength | 'auto' | string;

export type MarginRightProperty<TLength> = Globals | TLength | 'auto' | string;

export type MarginTopProperty<TLength> = Globals | TLength | 'auto' | string;

export type MaskProperty<TLength> = Globals | MaskLayer<TLength> | string;

export type MaskBorderProperty =
    | Globals
    | 'alpha'
    | 'luminance'
    | 'none'
    | 'repeat'
    | 'round'
    | 'space'
    | 'stretch'
    | string
    | number;

export type MaskBorderModeProperty = Globals | 'alpha' | 'luminance';

export type MaskBorderOutsetProperty<TLength> = Globals | TLength | string | number;

export type MaskBorderRepeatProperty = Globals | 'repeat' | 'round' | 'space' | 'stretch' | string;

export type MaskBorderSliceProperty = Globals | string | number;

export type MaskBorderSourceProperty = Globals | 'none' | string;

export type MaskBorderWidthProperty<TLength> = Globals | TLength | 'auto' | string | number;

export type MaskClipProperty = Globals | GeometryBox | 'no-clip' | string;

export type MaskCompositeProperty = Globals | CompositingOperator | string;

export type MaskImageProperty = Globals | 'none' | string;

export type MaskModeProperty = Globals | MaskingMode | string;

export type MaskOriginProperty = Globals | GeometryBox | string;

export type MaskPositionProperty<TLength> = Globals | Position<TLength> | string;

export type MaskRepeatProperty = Globals | RepeatStyle | string;

export type MaskSizeProperty<TLength> = Globals | BgSize<TLength> | string;

export type MaskTypeProperty = Globals | 'alpha' | 'luminance';

export type MaxBlockSizeProperty<TLength> =
    | Globals
    | TLength
    | '-moz-max-content'
    | '-moz-min-content'
    | '-webkit-fill-available'
    | 'fill-available'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | 'none'
    | string;

export type MaxHeightProperty<TLength> =
    | Globals
    | TLength
    | '-moz-fit-content'
    | '-moz-max-content'
    | '-moz-min-content'
    | '-webkit-fit-content'
    | 'fill-available'
    | 'fit-content'
    | 'intrinsic'
    | 'max-content'
    | 'min-content'
    | 'none'
    | string;

export type MaxInlineSizeProperty<TLength> =
    | Globals
    | TLength
    | '-moz-fit-content'
    | '-moz-max-content'
    | '-moz-min-content'
    | '-webkit-fill-available'
    | 'fill-available'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | 'none'
    | string;

export type MaxLinesProperty = Globals | 'none' | number;

export type MaxWidthProperty<TLength> =
    | Globals
    | TLength
    | '-moz-fit-content'
    | '-moz-max-content'
    | '-moz-min-content'
    | '-webkit-fit-content'
    | '-webkit-max-content'
    | '-webkit-min-content'
    | 'fill-available'
    | 'fit-content'
    | 'intrinsic'
    | 'max-content'
    | 'min-content'
    | 'none'
    | string;

export type MinBlockSizeProperty<TLength> =
    | Globals
    | TLength
    | '-moz-max-content'
    | '-moz-min-content'
    | '-webkit-fill-available'
    | 'auto'
    | 'fill-available'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | string;

export type MinHeightProperty<TLength> =
    | Globals
    | TLength
    | '-moz-fit-content'
    | '-moz-max-content'
    | '-moz-min-content'
    | '-webkit-fit-content'
    | 'auto'
    | 'fill-available'
    | 'fit-content'
    | 'intrinsic'
    | 'max-content'
    | 'min-content'
    | string;

export type MinInlineSizeProperty<TLength> =
    | Globals
    | TLength
    | '-moz-fit-content'
    | '-moz-max-content'
    | '-moz-min-content'
    | '-webkit-fill-available'
    | '-webkit-max-content'
    | '-webkit-min-content'
    | 'auto'
    | 'fill-available'
    | 'fit-content'
    | 'max-content'
    | 'min-content'
    | string;

export type MinWidthProperty<TLength> =
    | Globals
    | TLength
    | '-moz-fit-content'
    | '-moz-max-content'
    | '-moz-min-content'
    | '-webkit-fill-available'
    | '-webkit-fit-content'
    | '-webkit-max-content'
    | '-webkit-min-content'
    | 'auto'
    | 'fill-available'
    | 'fit-content'
    | 'intrinsic'
    | 'max-content'
    | 'min-content'
    | 'min-intrinsic'
    | string;

export type MixBlendModeProperty = Globals | BlendMode;

export type OffsetProperty<TLength> =
    | Globals
    | Position<TLength>
    | GeometryBox
    | 'auto'
    | 'none'
    | string;

export type OffsetDistanceProperty<TLength> = Globals | TLength | string;

export type OffsetPathProperty = Globals | GeometryBox | 'none' | string;

export type OffsetRotateProperty = Globals | 'auto' | 'reverse' | string;

export type ObjectFitProperty = Globals | 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export type ObjectPositionProperty<TLength> = Globals | Position<TLength>;

export type OffsetAnchorProperty<TLength> = Globals | Position<TLength> | 'auto';

export type OffsetPositionProperty<TLength> = Globals | Position<TLength> | 'auto';

export type OutlineProperty<TLength> =
    | Globals
    | Color
    | LineStyle
    | LineWidth<TLength>
    | 'auto'
    | 'invert'
    | string;

export type OutlineColorProperty = Globals | Color | 'invert';

export type OutlineOffsetProperty<TLength> = Globals | TLength;

export type OutlineStyleProperty = Globals | LineStyle | 'auto' | string;

export type OutlineWidthProperty<TLength> = Globals | LineWidth<TLength>;

export type OverflowProperty = Globals | 'auto' | 'clip' | 'hidden' | 'scroll' | 'visible' | string;

export type OverflowAnchorProperty = Globals | 'auto' | 'none';

export type OverflowBlockProperty = Globals | 'auto' | 'clip' | 'hidden' | 'scroll' | 'visible';

export type OverflowClipBoxProperty = Globals | 'content-box' | 'padding-box';

export type OverflowInlineProperty = Globals | 'auto' | 'clip' | 'hidden' | 'scroll' | 'visible';

export type OverflowWrapProperty = Globals | 'anywhere' | 'break-word' | 'normal';

export type OverflowXProperty = Globals | 'auto' | 'clip' | 'hidden' | 'scroll' | 'visible';

export type OverflowYProperty = Globals | 'auto' | 'clip' | 'hidden' | 'scroll' | 'visible';

export type OverscrollBehaviorProperty = Globals | 'auto' | 'contain' | 'none' | string;

export type OverscrollBehaviorXProperty = Globals | 'auto' | 'contain' | 'none';

export type OverscrollBehaviorYProperty = Globals | 'auto' | 'contain' | 'none';

export type PaddingProperty<TLength> = Globals | TLength | string;

export type PaddingBlockProperty<TLength> = Globals | TLength | string;

export type PaddingBlockEndProperty<TLength> = Globals | TLength | string;

export type PaddingBlockStartProperty<TLength> = Globals | TLength | string;

export type PaddingBottomProperty<TLength> = Globals | TLength | string;

export type PaddingInlineProperty<TLength> = Globals | TLength | string;

export type PaddingInlineEndProperty<TLength> = Globals | TLength | string;

export type PaddingInlineStartProperty<TLength> = Globals | TLength | string;

export type PaddingLeftProperty<TLength> = Globals | TLength | string;

export type PaddingRightProperty<TLength> = Globals | TLength | string;

export type PaddingTopProperty<TLength> = Globals | TLength | string;

export type PageBreakAfterProperty =
    | Globals
    | 'always'
    | 'auto'
    | 'avoid'
    | 'left'
    | 'recto'
    | 'right'
    | 'verso';

export type PageBreakBeforeProperty =
    | Globals
    | 'always'
    | 'auto'
    | 'avoid'
    | 'left'
    | 'recto'
    | 'right'
    | 'verso';

export type PageBreakInsideProperty = Globals | 'auto' | 'avoid';

export type PaintOrderProperty = Globals | 'fill' | 'markers' | 'normal' | 'stroke' | string;

export type PerspectiveProperty<TLength> = Globals | TLength | 'none';

export type PerspectiveOriginProperty<TLength> = Globals | Position<TLength>;

export type PlaceContentProperty =
    | Globals
    | ContentDistribution
    | ContentPosition
    | 'baseline'
    | 'normal'
    | string;

export type PlaceItemsProperty =
    | Globals
    | SelfPosition
    | 'baseline'
    | 'normal'
    | 'stretch'
    | string;

export type PlaceSelfProperty =
    | Globals
    | SelfPosition
    | 'auto'
    | 'baseline'
    | 'normal'
    | 'stretch'
    | string;

export type PointerEventsProperty =
    | Globals
    | 'all'
    | 'auto'
    | 'fill'
    | 'inherit'
    | 'none'
    | 'painted'
    | 'stroke'
    | 'visible'
    | 'visibleFill'
    | 'visiblePainted'
    | 'visibleStroke';

export type PositionProperty =
    | Globals
    | '-webkit-sticky'
    | 'absolute'
    | 'fixed'
    | 'relative'
    | 'static'
    | 'sticky';

export type QuotesProperty = Globals | 'none' | string;

export type ResizeProperty =
    | Globals
    | 'block'
    | 'both'
    | 'horizontal'
    | 'inline'
    | 'none'
    | 'vertical';

export type RightProperty<TLength> = Globals | TLength | 'auto' | string;

export type RotateProperty = Globals | 'none' | string;

export type RowGapProperty<TLength> = Globals | TLength | 'normal' | string;

export type RubyAlignProperty = Globals | 'center' | 'space-around' | 'space-between' | 'start';

export type RubyMergeProperty = Globals | 'auto' | 'collapse' | 'separate';

export type RubyPositionProperty = Globals | 'over' | 'under';

export type ScaleProperty = Globals | 'none' | string | number;

export type ScrollBehaviorProperty = Globals | 'auto' | 'smooth';

export type ScrollMarginProperty<TLength> = Globals | TLength | string;

export type ScrollMarginBlockProperty<TLength> = Globals | TLength | string;

export type ScrollMarginBlockEndProperty<TLength> = Globals | TLength;

export type ScrollMarginBlockStartProperty<TLength> = Globals | TLength;

export type ScrollMarginBottomProperty<TLength> = Globals | TLength;

export type ScrollMarginInlineProperty<TLength> = Globals | TLength | string;

export type ScrollMarginInlineEndProperty<TLength> = Globals | TLength;

export type ScrollMarginInlineStartProperty<TLength> = Globals | TLength;

export type ScrollMarginLeftProperty<TLength> = Globals | TLength;

export type ScrollMarginRightProperty<TLength> = Globals | TLength;

export type ScrollMarginTopProperty<TLength> = Globals | TLength;

export type ScrollPaddingProperty<TLength> = Globals | TLength | 'auto' | string;

export type ScrollPaddingBlockProperty<TLength> = Globals | TLength | 'auto' | string;

export type ScrollPaddingBlockEndProperty<TLength> = Globals | TLength | 'auto' | string;

export type ScrollPaddingBlockStartProperty<TLength> = Globals | TLength | 'auto' | string;

export type ScrollPaddingBottomProperty<TLength> = Globals | TLength | 'auto' | string;

export type ScrollPaddingInlineProperty<TLength> = Globals | TLength | 'auto' | string;

export type ScrollPaddingInlineEndProperty<TLength> = Globals | TLength | 'auto' | string;

export type ScrollPaddingInlineStartProperty<TLength> = Globals | TLength | 'auto' | string;

export type ScrollPaddingLeftProperty<TLength> = Globals | TLength | 'auto' | string;

export type ScrollPaddingRightProperty<TLength> = Globals | TLength | 'auto' | string;

export type ScrollPaddingTopProperty<TLength> = Globals | TLength | 'auto' | string;

export type ScrollSnapAlignProperty = Globals | 'center' | 'end' | 'none' | 'start' | string;

export type ScrollSnapCoordinateProperty<TLength> = Globals | Position<TLength> | 'none' | string;

export type ScrollSnapDestinationProperty<TLength> = Globals | Position<TLength>;

export type ScrollSnapPointsXProperty = Globals | 'none' | string;

export type ScrollSnapPointsYProperty = Globals | 'none' | string;

export type ScrollSnapStopProperty = Globals | 'always' | 'normal';

export type ScrollSnapTypeProperty =
    | Globals
    | 'block'
    | 'both'
    | 'inline'
    | 'none'
    | 'x'
    | 'y'
    | string;

export type ScrollSnapTypeXProperty = Globals | 'mandatory' | 'none' | 'proximity';

export type ScrollSnapTypeYProperty = Globals | 'mandatory' | 'none' | 'proximity';

export type ScrollbarColorProperty = Globals | Color | 'auto' | 'dark' | 'light';

export type ScrollbarWidthProperty = Globals | 'auto' | 'none' | 'thin';

export type ShapeMarginProperty<TLength> = Globals | TLength | string;

export type ShapeOutsideProperty = Globals | Box | 'margin-box' | 'none' | string;

export type TabSizeProperty<TLength> = Globals | TLength | number;

export type TableLayoutProperty = Globals | 'auto' | 'fixed';

export type TextAlignProperty =
    | Globals
    | 'center'
    | 'end'
    | 'justify'
    | 'left'
    | 'match-parent'
    | 'right'
    | 'start';

export type TextAlignLastProperty =
    | Globals
    | 'auto'
    | 'center'
    | 'end'
    | 'justify'
    | 'left'
    | 'right'
    | 'start';

export type TextCombineUprightProperty = Globals | 'all' | 'digits' | 'none' | string;

export type TextDecorationProperty =
    | Globals
    | Color
    | 'blink'
    | 'dashed'
    | 'dotted'
    | 'double'
    | 'line-through'
    | 'none'
    | 'overline'
    | 'solid'
    | 'underline'
    | 'wavy'
    | string;

export type TextDecorationColorProperty = Globals | Color;

export type TextDecorationLineProperty =
    | Globals
    | 'blink'
    | 'line-through'
    | 'none'
    | 'overline'
    | 'underline'
    | string;

export type TextDecorationSkipProperty =
    | Globals
    | 'box-decoration'
    | 'edges'
    | 'leading-spaces'
    | 'none'
    | 'objects'
    | 'spaces'
    | 'trailing-spaces'
    | string;

export type TextDecorationSkipInkProperty = Globals | 'auto' | 'none';

export type TextDecorationStyleProperty =
    | Globals
    | 'dashed'
    | 'dotted'
    | 'double'
    | 'solid'
    | 'wavy';

export type TextEmphasisProperty =
    | Globals
    | Color
    | 'circle'
    | 'dot'
    | 'double-circle'
    | 'filled'
    | 'none'
    | 'open'
    | 'sesame'
    | 'triangle'
    | string;

export type TextEmphasisColorProperty = Globals | Color;

export type TextEmphasisStyleProperty =
    | Globals
    | 'circle'
    | 'dot'
    | 'double-circle'
    | 'filled'
    | 'none'
    | 'open'
    | 'sesame'
    | 'triangle'
    | string;

export type TextIndentProperty<TLength> = Globals | TLength | string;

export type TextJustifyProperty = Globals | 'auto' | 'inter-character' | 'inter-word' | 'none';

export type TextOrientationProperty = Globals | 'mixed' | 'sideways' | 'upright';

export type TextOverflowProperty = Globals | 'clip' | 'ellipsis' | string;

export type TextRenderingProperty =
    | Globals
    | 'auto'
    | 'geometricPrecision'
    | 'optimizeLegibility'
    | 'optimizeSpeed';

export type TextShadowProperty = Globals | 'none' | string;

export type TextSizeAdjustProperty = Globals | 'auto' | 'none' | string;

export type TextTransformProperty =
    | Globals
    | 'capitalize'
    | 'full-size-kana'
    | 'full-width'
    | 'lowercase'
    | 'none'
    | 'uppercase';

export type TextUnderlinePositionProperty = Globals | 'auto' | 'left' | 'right' | 'under' | string;

export type TopProperty<TLength> = Globals | TLength | 'auto' | string;

export type TouchActionProperty =
    | Globals
    | '-ms-manipulation'
    | '-ms-none'
    | '-ms-pinch-zoom'
    | 'auto'
    | 'manipulation'
    | 'none'
    | 'pan-down'
    | 'pan-left'
    | 'pan-right'
    | 'pan-up'
    | 'pan-x'
    | 'pan-y'
    | 'pinch-zoom'
    | string;

export type TransformProperty = Globals | 'none' | string;

export type TransformBoxProperty = Globals | 'border-box' | 'fill-box' | 'view-box';

export type TransformOriginProperty<TLength> =
    | Globals
    | TLength
    | 'bottom'
    | 'center'
    | 'left'
    | 'right'
    | 'top'
    | string;

export type TransformStyleProperty = Globals | 'flat' | 'preserve-3d';

export type TransitionProperty = Globals | SingleTransition | string;

export type TransitionPropertyProperty = Globals | 'all' | 'none' | string;

export type TransitionTimingFunctionProperty = Globals | TimingFunction | string;

export type TranslateProperty<TLength> = Globals | TLength | 'none' | string;

export type UnicodeBidiProperty =
    | Globals
    | '-moz-isolate'
    | '-moz-isolate-override'
    | '-moz-plaintext'
    | '-webkit-isolate'
    | 'bidi-override'
    | 'embed'
    | 'isolate'
    | 'isolate-override'
    | 'normal'
    | 'plaintext';

export type UserSelectProperty =
    | Globals
    | '-moz-none'
    | 'all'
    | 'auto'
    | 'contain'
    | 'element'
    | 'none'
    | 'text';

export type VerticalAlignProperty<TLength> =
    | Globals
    | TLength
    | 'baseline'
    | 'bottom'
    | 'middle'
    | 'sub'
    | 'super'
    | 'text-bottom'
    | 'text-top'
    | 'top'
    | string;

export type VisibilityProperty = Globals | 'collapse' | 'hidden' | 'visible';

export type WhiteSpaceProperty =
    | Globals
    | '-moz-pre-wrap'
    | 'normal'
    | 'nowrap'
    | 'pre'
    | 'pre-line'
    | 'pre-wrap';

export type WidthProperty<TLength> =
    | Globals
    | TLength
    | '-moz-fit-content'
    | '-moz-max-content'
    | '-moz-min-content'
    | '-webkit-fill-available'
    | '-webkit-fit-content'
    | '-webkit-max-content'
    | 'auto'
    | 'available'
    | 'fit-content'
    | 'intrinsic'
    | 'max-content'
    | 'min-content'
    | 'min-intrinsic'
    | string;

export type WillChangeProperty = Globals | AnimateableFeature | 'auto' | string;

export type WordBreakProperty = Globals | 'break-all' | 'break-word' | 'keep-all' | 'normal';

export type WordSpacingProperty<TLength> = Globals | TLength | 'normal' | string;

export type WordWrapProperty = Globals | 'break-word' | 'normal';

export type WritingModeProperty =
    | Globals
    | 'horizontal-tb'
    | 'sideways-lr'
    | 'sideways-rl'
    | 'vertical-lr'
    | 'vertical-rl';

export type ZIndexProperty = Globals | 'auto' | number;

export type ZoomProperty = Globals | 'normal' | 'reset' | string | number;

export type MozAppearanceProperty =
    | Globals
    | '-moz-mac-unified-toolbar'
    | '-moz-win-borderless-glass'
    | '-moz-win-browsertabbar-toolbox'
    | '-moz-win-communications-toolbox'
    | '-moz-win-communicationstext'
    | '-moz-win-exclude-glass'
    | '-moz-win-glass'
    | '-moz-win-media-toolbox'
    | '-moz-win-mediatext'
    | '-moz-window-button-box'
    | '-moz-window-button-box-maximized'
    | '-moz-window-button-close'
    | '-moz-window-button-maximize'
    | '-moz-window-button-minimize'
    | '-moz-window-button-restore'
    | '-moz-window-frame-bottom'
    | '-moz-window-frame-left'
    | '-moz-window-frame-right'
    | '-moz-window-titlebar'
    | '-moz-window-titlebar-maximized'
    | 'button'
    | 'button-arrow-down'
    | 'button-arrow-next'
    | 'button-arrow-previous'
    | 'button-arrow-up'
    | 'button-bevel'
    | 'button-focus'
    | 'caret'
    | 'checkbox'
    | 'checkbox-container'
    | 'checkbox-label'
    | 'checkmenuitem'
    | 'dualbutton'
    | 'groupbox'
    | 'listbox'
    | 'listitem'
    | 'menuarrow'
    | 'menubar'
    | 'menucheckbox'
    | 'menuimage'
    | 'menuitem'
    | 'menuitemtext'
    | 'menulist'
    | 'menulist-button'
    | 'menulist-text'
    | 'menulist-textfield'
    | 'menupopup'
    | 'menuradio'
    | 'menuseparator'
    | 'meterbar'
    | 'meterchunk'
    | 'none'
    | 'progressbar'
    | 'progressbar-vertical'
    | 'progresschunk'
    | 'progresschunk-vertical'
    | 'radio'
    | 'radio-container'
    | 'radio-label'
    | 'radiomenuitem'
    | 'range'
    | 'range-thumb'
    | 'resizer'
    | 'resizerpanel'
    | 'scale-horizontal'
    | 'scale-vertical'
    | 'scalethumb-horizontal'
    | 'scalethumb-vertical'
    | 'scalethumbend'
    | 'scalethumbstart'
    | 'scalethumbtick'
    | 'scrollbarbutton-down'
    | 'scrollbarbutton-left'
    | 'scrollbarbutton-right'
    | 'scrollbarbutton-up'
    | 'scrollbarthumb-horizontal'
    | 'scrollbarthumb-vertical'
    | 'scrollbartrack-horizontal'
    | 'scrollbartrack-vertical'
    | 'searchfield'
    | 'separator'
    | 'sheet'
    | 'spinner'
    | 'spinner-downbutton'
    | 'spinner-textfield'
    | 'spinner-upbutton'
    | 'splitter'
    | 'statusbar'
    | 'statusbarpanel'
    | 'tab'
    | 'tab-scroll-arrow-back'
    | 'tab-scroll-arrow-forward'
    | 'tabpanel'
    | 'tabpanels'
    | 'textfield'
    | 'textfield-multiline'
    | 'toolbar'
    | 'toolbarbutton'
    | 'toolbarbutton-dropdown'
    | 'toolbargripper'
    | 'toolbox'
    | 'tooltip'
    | 'treeheader'
    | 'treeheadercell'
    | 'treeheadersortarrow'
    | 'treeitem'
    | 'treeline'
    | 'treetwisty'
    | 'treetwistyopen'
    | 'treeview';

export type MozBindingProperty = Globals | 'none' | string;

export type MozBorderBottomColorsProperty = Globals | Color | 'none' | string;

export type MozBorderLeftColorsProperty = Globals | Color | 'none' | string;

export type MozBorderRightColorsProperty = Globals | Color | 'none' | string;

export type MozBorderTopColorsProperty = Globals | Color | 'none' | string;

export type MozContextPropertiesProperty =
    | Globals
    | 'fill'
    | 'fill-opacity'
    | 'none'
    | 'stroke'
    | 'stroke-opacity'
    | string;

export type MozFloatEdgeProperty =
    | Globals
    | 'border-box'
    | 'content-box'
    | 'margin-box'
    | 'padding-box';

export type MozImageRegionProperty = Globals | 'auto' | string;

export type MozOrientProperty = Globals | 'block' | 'horizontal' | 'inline' | 'vertical';

export type MozOutlineRadiusProperty<TLength> = Globals | TLength | string;

export type MozOutlineRadiusBottomleftProperty<TLength> = Globals | TLength | string;

export type MozOutlineRadiusBottomrightProperty<TLength> = Globals | TLength | string;

export type MozOutlineRadiusTopleftProperty<TLength> = Globals | TLength | string;

export type MozOutlineRadiusToprightProperty<TLength> = Globals | TLength | string;

export type MozStackSizingProperty = Globals | 'ignore' | 'stretch-to-fit';

export type MozTextBlinkProperty = Globals | 'blink' | 'none';

export type MozUserFocusProperty =
    | Globals
    | 'ignore'
    | 'none'
    | 'normal'
    | 'select-after'
    | 'select-all'
    | 'select-before'
    | 'select-menu'
    | 'select-same';

export type MozUserInputProperty = Globals | 'auto' | 'disabled' | 'enabled' | 'none';

export type MozUserModifyProperty = Globals | 'read-only' | 'read-write' | 'write-only';

export type MozWindowDraggingProperty = Globals | 'drag' | 'no-drag';

export type MozWindowShadowProperty = Globals | 'default' | 'menu' | 'none' | 'sheet' | 'tooltip';

export type MsAcceleratorProperty = Globals | 'false' | 'true';

export type MsBlockProgressionProperty = Globals | 'bt' | 'lr' | 'rl' | 'tb';

export type MsContentZoomChainingProperty = Globals | 'chained' | 'none';

export type MsContentZoomSnapProperty = Globals | 'mandatory' | 'none' | 'proximity' | string;

export type MsContentZoomSnapTypeProperty = Globals | 'mandatory' | 'none' | 'proximity';

export type MsContentZoomingProperty = Globals | 'none' | 'zoom';

export type MsFlowFromProperty = Globals | 'none' | string;

export type MsFlowIntoProperty = Globals | 'none' | string;

export type MsHighContrastAdjustProperty = Globals | 'auto' | 'none';

export type MsHyphenateLimitCharsProperty = Globals | 'auto' | string | number;

export type MsHyphenateLimitLinesProperty = Globals | 'no-limit' | number;

export type MsHyphenateLimitZoneProperty<TLength> = Globals | TLength | string;

export type MsImeAlignProperty = Globals | 'after' | 'auto';

export type MsOverflowStyleProperty =
    | Globals
    | '-ms-autohiding-scrollbar'
    | 'auto'
    | 'none'
    | 'scrollbar';

export type MsScrollChainingProperty = Globals | 'chained' | 'none';

export type MsScrollLimitXMaxProperty<TLength> = Globals | TLength | 'auto';

export type MsScrollLimitXMinProperty<TLength> = Globals | TLength;

export type MsScrollLimitYMaxProperty<TLength> = Globals | TLength | 'auto';

export type MsScrollLimitYMinProperty<TLength> = Globals | TLength;

export type MsScrollRailsProperty = Globals | 'none' | 'railed';

export type MsScrollSnapTypeProperty = Globals | 'mandatory' | 'none' | 'proximity';

export type MsScrollTranslationProperty = Globals | 'none' | 'vertical-to-horizontal';

export type MsScrollbar3dlightColorProperty = Globals | Color;

export type MsScrollbarArrowColorProperty = Globals | Color;

export type MsScrollbarBaseColorProperty = Globals | Color;

export type MsScrollbarDarkshadowColorProperty = Globals | Color;

export type MsScrollbarFaceColorProperty = Globals | Color;

export type MsScrollbarHighlightColorProperty = Globals | Color;

export type MsScrollbarShadowColorProperty = Globals | Color;

export type MsScrollbarTrackColorProperty = Globals | Color;

export type MsTextAutospaceProperty =
    | Globals
    | 'ideograph-alpha'
    | 'ideograph-numeric'
    | 'ideograph-parenthesis'
    | 'ideograph-space'
    | 'none';

export type MsTouchSelectProperty = Globals | 'grippers' | 'none';

export type MsUserSelectProperty = Globals | 'element' | 'none' | 'text';

export type MsWrapFlowProperty = Globals | 'auto' | 'both' | 'clear' | 'end' | 'maximum' | 'start';

export type MsWrapMarginProperty<TLength> = Globals | TLength;

export type MsWrapThroughProperty = Globals | 'none' | 'wrap';

export type WebkitAppearanceProperty =
    | Globals
    | 'button'
    | 'button-bevel'
    | 'caret'
    | 'checkbox'
    | 'default-button'
    | 'inner-spin-button'
    | 'listbox'
    | 'listitem'
    | 'media-controls-background'
    | 'media-controls-fullscreen-background'
    | 'media-current-time-display'
    | 'media-enter-fullscreen-button'
    | 'media-exit-fullscreen-button'
    | 'media-fullscreen-button'
    | 'media-mute-button'
    | 'media-overlay-play-button'
    | 'media-play-button'
    | 'media-seek-back-button'
    | 'media-seek-forward-button'
    | 'media-slider'
    | 'media-sliderthumb'
    | 'media-time-remaining-display'
    | 'media-toggle-closed-captions-button'
    | 'media-volume-slider'
    | 'media-volume-slider-container'
    | 'media-volume-sliderthumb'
    | 'menulist'
    | 'menulist-button'
    | 'menulist-text'
    | 'menulist-textfield'
    | 'meter'
    | 'none'
    | 'progress-bar'
    | 'progress-bar-value'
    | 'push-button'
    | 'radio'
    | 'searchfield'
    | 'searchfield-cancel-button'
    | 'searchfield-decoration'
    | 'searchfield-results-button'
    | 'searchfield-results-decoration'
    | 'slider-horizontal'
    | 'slider-vertical'
    | 'sliderthumb-horizontal'
    | 'sliderthumb-vertical'
    | 'square-button'
    | 'textarea'
    | 'textfield';

export type WebkitBorderBeforeProperty<TLength> =
    | Globals
    | LineWidth<TLength>
    | LineStyle
    | Color
    | string;

export type WebkitBorderBeforeColorProperty = Globals | Color;

export type WebkitBorderBeforeStyleProperty = Globals | LineStyle | string;

export type WebkitBorderBeforeWidthProperty<TLength> = Globals | LineWidth<TLength> | string;

export type WebkitBoxReflectProperty<TLength> =
    | Globals
    | TLength
    | 'above'
    | 'below'
    | 'left'
    | 'right'
    | string;

export type WebkitLineClampProperty = Globals | 'none' | number;

export type WebkitMaskProperty<TLength> =
    | Globals
    | Position<TLength>
    | RepeatStyle
    | Box
    | 'border'
    | 'content'
    | 'none'
    | 'padding'
    | 'text'
    | string;

export type WebkitMaskAttachmentProperty = Globals | Attachment | string;

export type WebkitMaskClipProperty =
    | Globals
    | Box
    | 'border'
    | 'content'
    | 'padding'
    | 'text'
    | string;

export type WebkitMaskCompositeProperty = Globals | CompositeStyle | string;

export type WebkitMaskImageProperty = Globals | 'none' | string;

export type WebkitMaskOriginProperty = Globals | Box | 'border' | 'content' | 'padding' | string;

export type WebkitMaskPositionProperty<TLength> = Globals | Position<TLength> | string;

export type WebkitMaskPositionXProperty<TLength> =
    | Globals
    | TLength
    | 'center'
    | 'left'
    | 'right'
    | string;

export type WebkitMaskPositionYProperty<TLength> =
    | Globals
    | TLength
    | 'bottom'
    | 'center'
    | 'top'
    | string;

export type WebkitMaskRepeatProperty = Globals | RepeatStyle | string;

export type WebkitMaskRepeatXProperty = Globals | 'no-repeat' | 'repeat' | 'round' | 'space';

export type WebkitMaskRepeatYProperty = Globals | 'no-repeat' | 'repeat' | 'round' | 'space';

export type WebkitMaskSizeProperty<TLength> = Globals | BgSize<TLength> | string;

export type WebkitOverflowScrollingProperty = Globals | 'auto' | 'touch';

export type WebkitTapHighlightColorProperty = Globals | Color;

export type WebkitTextFillColorProperty = Globals | Color;

export type WebkitTextStrokeProperty<TLength> = Globals | Color | TLength | string;

export type WebkitTextStrokeColorProperty = Globals | Color;

export type WebkitTextStrokeWidthProperty<TLength> = Globals | TLength;

export type WebkitTouchCalloutProperty = Globals | 'default' | 'none';

export type WebkitUserModifyProperty =
    | Globals
    | 'read-only'
    | 'read-write'
    | 'read-write-plaintext-only';

export type AlignmentBaselineProperty =
    | Globals
    | 'after-edge'
    | 'alphabetic'
    | 'auto'
    | 'baseline'
    | 'before-edge'
    | 'central'
    | 'hanging'
    | 'ideographic'
    | 'mathematical'
    | 'middle'
    | 'text-after-edge'
    | 'text-before-edge';

export type BaselineShiftProperty<TLength> =
    | Globals
    | TLength
    | 'baseline'
    | 'sub'
    | 'super'
    | string;

export type ClipRuleProperty = Globals | 'evenodd' | 'nonzero';

export type ColorInterpolationProperty = Globals | 'auto' | 'linearRGB' | 'sRGB';

export type ColorRenderingProperty = Globals | 'auto' | 'optimizeQuality' | 'optimizeSpeed';

export type DominantBaselineProperty =
    | Globals
    | 'alphabetic'
    | 'auto'
    | 'central'
    | 'hanging'
    | 'ideographic'
    | 'mathematical'
    | 'middle'
    | 'no-change'
    | 'reset-size'
    | 'text-after-edge'
    | 'text-before-edge'
    | 'use-script';

export type FillProperty = Globals | Paint;

export type FillRuleProperty = Globals | 'evenodd' | 'nonzero';

export type FloodColorProperty = Globals | Color | 'currentColor';

export type GlyphOrientationVerticalProperty = Globals | 'auto' | string | number;

export type LightingColorProperty = Globals | Color | 'currentColor';

export type MarkerProperty = Globals | 'none' | string;

export type MarkerEndProperty = Globals | 'none' | string;

export type MarkerMidProperty = Globals | 'none' | string;

export type MarkerStartProperty = Globals | 'none' | string;

export type ShapeRenderingProperty =
    | Globals
    | 'auto'
    | 'crispEdges'
    | 'geometricPrecision'
    | 'optimizeSpeed';

export type StopColorProperty = Globals | Color | 'currentColor';

export type StrokeProperty = Globals | Paint;

export type StrokeDasharrayProperty<TLength> = Globals | Dasharray<TLength> | 'none';

export type StrokeDashoffsetProperty<TLength> = Globals | TLength | string;

export type StrokeLinecapProperty = Globals | 'butt' | 'round' | 'square';

export type StrokeLinejoinProperty = Globals | 'bevel' | 'miter' | 'round';

export type StrokeWidthProperty<TLength> = Globals | TLength | string;

export type TextAnchorProperty = Globals | 'end' | 'middle' | 'start';

export type VectorEffectProperty = Globals | 'non-scaling-stroke' | 'none';

type CounterStyleRangeProperty = 'auto' | 'infinite' | string | number;

type CounterStyleSpeakAsProperty = 'auto' | 'bullets' | 'numbers' | 'spell-out' | 'words' | string;

type CounterStyleSystemProperty =
    | 'additive'
    | 'alphabetic'
    | 'cyclic'
    | 'fixed'
    | 'numeric'
    | 'symbolic'
    | string;

type FontFaceFontFeatureSettingsProperty = 'normal' | string;

type FontFaceFontDisplayProperty = 'auto' | 'block' | 'fallback' | 'optional' | 'swap';

type FontFaceFontStretchProperty = FontStretchAbsolute | string;

type FontFaceFontStyleProperty = 'italic' | 'normal' | 'oblique' | string;

type FontFaceFontVariantProperty =
    | EastAsianVariantValues
    | 'all-petite-caps'
    | 'all-small-caps'
    | 'common-ligatures'
    | 'contextual'
    | 'diagonal-fractions'
    | 'discretionary-ligatures'
    | 'full-width'
    | 'historical-forms'
    | 'historical-ligatures'
    | 'lining-nums'
    | 'no-common-ligatures'
    | 'no-contextual'
    | 'no-discretionary-ligatures'
    | 'no-historical-ligatures'
    | 'none'
    | 'normal'
    | 'oldstyle-nums'
    | 'ordinal'
    | 'petite-caps'
    | 'proportional-nums'
    | 'proportional-width'
    | 'ruby'
    | 'slashed-zero'
    | 'small-caps'
    | 'stacked-fractions'
    | 'tabular-nums'
    | 'titling-caps'
    | 'unicase'
    | string;

type FontFaceFontVariationSettingsProperty = 'normal' | string;

type FontFaceFontWeightProperty = FontWeightAbsolute | string;

type PageBleedProperty<TLength> = TLength | 'auto';

type PageMarksProperty = 'crop' | 'cross' | 'none' | string;

type ViewportHeightProperty<TLength> = ViewportLength<TLength> | string;

type ViewportMaxHeightProperty<TLength> = ViewportLength<TLength>;

type ViewportMaxWidthProperty<TLength> = ViewportLength<TLength>;

type ViewportMaxZoomProperty = 'auto' | string | number;

type ViewportMinHeightProperty<TLength> = ViewportLength<TLength>;

type ViewportMinWidthProperty<TLength> = ViewportLength<TLength>;

type ViewportMinZoomProperty = 'auto' | string | number;

type ViewportOrientationProperty = 'auto' | 'landscape' | 'portrait';

type ViewportUserZoomProperty = '-ms-zoom' | 'fixed' | 'zoom';

type ViewportWidthProperty<TLength> = ViewportLength<TLength> | string;

type ViewportZoomProperty = 'auto' | string | number;

type AbsoluteSize = 'large' | 'medium' | 'small' | 'x-large' | 'x-small' | 'xx-large' | 'xx-small';

type AnimateableFeature = 'contents' | 'scroll-position' | string;

type Attachment = 'fixed' | 'local' | 'scroll';

type BgPosition<TLength> = TLength | 'bottom' | 'center' | 'left' | 'right' | 'top' | string;

type BgSize<TLength> = TLength | 'auto' | 'contain' | 'cover' | string;

type BlendMode =
    | 'color'
    | 'color-burn'
    | 'color-dodge'
    | 'darken'
    | 'difference'
    | 'exclusion'
    | 'hard-light'
    | 'hue'
    | 'lighten'
    | 'luminosity'
    | 'multiply'
    | 'normal'
    | 'overlay'
    | 'saturation'
    | 'screen'
    | 'soft-light';

type Box = 'border-box' | 'content-box' | 'padding-box';

type Color = NamedColor | DeprecatedSystemColor | 'currentcolor' | string;

type Compat =
    | 'button-bevel'
    | 'checkbox'
    | 'listbox'
    | 'menulist'
    | 'menulist-button'
    | 'meter'
    | 'progress-bar'
    | 'push-button'
    | 'radio'
    | 'searchfield'
    | 'slider-horizontal'
    | 'square-button'
    | 'textarea';

type CompositeStyle =
    | 'clear'
    | 'copy'
    | 'destination-atop'
    | 'destination-in'
    | 'destination-out'
    | 'destination-over'
    | 'source-atop'
    | 'source-in'
    | 'source-out'
    | 'source-over'
    | 'xor';

type CompositingOperator = 'add' | 'exclude' | 'intersect' | 'subtract';

type ContentDistribution = 'space-around' | 'space-between' | 'space-evenly' | 'stretch';

type ContentList = Quote | 'contents' | string;

type ContentPosition = 'center' | 'end' | 'flex-end' | 'flex-start' | 'start';

type CubicBezierTimingFunction = 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | string;

type Dasharray<TLength> = TLength | string | number;

type DeprecatedSystemColor =
    | 'ActiveBorder'
    | 'ActiveCaption'
    | 'AppWorkspace'
    | 'Background'
    | 'ButtonFace'
    | 'ButtonHighlight'
    | 'ButtonShadow'
    | 'ButtonText'
    | 'CaptionText'
    | 'GrayText'
    | 'Highlight'
    | 'HighlightText'
    | 'InactiveBorder'
    | 'InactiveCaption'
    | 'InactiveCaptionText'
    | 'InfoBackground'
    | 'InfoText'
    | 'Menu'
    | 'MenuText'
    | 'Scrollbar'
    | 'ThreeDDarkShadow'
    | 'ThreeDFace'
    | 'ThreeDHighlight'
    | 'ThreeDLightShadow'
    | 'ThreeDShadow'
    | 'Window'
    | 'WindowFrame'
    | 'WindowText';

type DisplayInside =
    | '-ms-flexbox'
    | '-ms-grid'
    | '-webkit-flex'
    | 'flex'
    | 'flow'
    | 'flow-root'
    | 'grid'
    | 'ruby'
    | 'table';

type DisplayInternal =
    | 'ruby-base'
    | 'ruby-base-container'
    | 'ruby-text'
    | 'ruby-text-container'
    | 'table-caption'
    | 'table-cell'
    | 'table-column'
    | 'table-column-group'
    | 'table-footer-group'
    | 'table-header-group'
    | 'table-row'
    | 'table-row-group';

type DisplayLegacy =
    | '-ms-inline-flexbox'
    | '-ms-inline-grid'
    | '-webkit-inline-flex'
    | 'inline-block'
    | 'inline-flex'
    | 'inline-grid'
    | 'inline-list-item'
    | 'inline-table';

type DisplayOutside = 'block' | 'inline' | 'run-in';

type EastAsianVariantValues = 'jis04' | 'jis78' | 'jis83' | 'jis90' | 'simplified' | 'traditional';

type FinalBgLayer<TLength> =
    | Color
    | BgPosition<TLength>
    | RepeatStyle
    | Attachment
    | Box
    | 'none'
    | string;

type FontStretchAbsolute =
    | 'condensed'
    | 'expanded'
    | 'extra-condensed'
    | 'extra-expanded'
    | 'normal'
    | 'semi-condensed'
    | 'semi-expanded'
    | 'ultra-condensed'
    | 'ultra-expanded'
    | string;

type FontWeightAbsolute = 'bold' | 'normal' | number;

type GenericFamily = 'cursive' | 'fantasy' | 'monospace' | 'sans-serif' | 'serif';

type GeometryBox = Box | 'fill-box' | 'margin-box' | 'stroke-box' | 'view-box';

type GridLine = 'auto' | string | number;

type LineStyle =
    | 'dashed'
    | 'dotted'
    | 'double'
    | 'groove'
    | 'hidden'
    | 'inset'
    | 'none'
    | 'outset'
    | 'ridge'
    | 'solid';

type LineWidth<TLength> = TLength | 'medium' | 'thick' | 'thin';

type MaskLayer<TLength> =
    | Position<TLength>
    | RepeatStyle
    | GeometryBox
    | CompositingOperator
    | MaskingMode
    | 'no-clip'
    | 'none'
    | string;

type MaskingMode = 'alpha' | 'luminance' | 'match-source';

type NamedColor =
    | 'aliceblue'
    | 'antiquewhite'
    | 'aqua'
    | 'aquamarine'
    | 'azure'
    | 'beige'
    | 'bisque'
    | 'black'
    | 'blanchedalmond'
    | 'blue'
    | 'blueviolet'
    | 'brown'
    | 'burlywood'
    | 'cadetblue'
    | 'chartreuse'
    | 'chocolate'
    | 'coral'
    | 'cornflowerblue'
    | 'cornsilk'
    | 'crimson'
    | 'cyan'
    | 'darkblue'
    | 'darkcyan'
    | 'darkgoldenrod'
    | 'darkgray'
    | 'darkgreen'
    | 'darkgrey'
    | 'darkkhaki'
    | 'darkmagenta'
    | 'darkolivegreen'
    | 'darkorange'
    | 'darkorchid'
    | 'darkred'
    | 'darksalmon'
    | 'darkseagreen'
    | 'darkslateblue'
    | 'darkslategray'
    | 'darkslategrey'
    | 'darkturquoise'
    | 'darkviolet'
    | 'deeppink'
    | 'deepskyblue'
    | 'dimgray'
    | 'dimgrey'
    | 'dodgerblue'
    | 'firebrick'
    | 'floralwhite'
    | 'forestgreen'
    | 'fuchsia'
    | 'gainsboro'
    | 'ghostwhite'
    | 'gold'
    | 'goldenrod'
    | 'gray'
    | 'green'
    | 'greenyellow'
    | 'grey'
    | 'honeydew'
    | 'hotpink'
    | 'indianred'
    | 'indigo'
    | 'ivory'
    | 'khaki'
    | 'lavender'
    | 'lavenderblush'
    | 'lawngreen'
    | 'lemonchiffon'
    | 'lightblue'
    | 'lightcoral'
    | 'lightcyan'
    | 'lightgoldenrodyellow'
    | 'lightgray'
    | 'lightgreen'
    | 'lightgrey'
    | 'lightpink'
    | 'lightsalmon'
    | 'lightseagreen'
    | 'lightskyblue'
    | 'lightslategray'
    | 'lightslategrey'
    | 'lightsteelblue'
    | 'lightyellow'
    | 'lime'
    | 'limegreen'
    | 'linen'
    | 'magenta'
    | 'maroon'
    | 'mediumaquamarine'
    | 'mediumblue'
    | 'mediumorchid'
    | 'mediumpurple'
    | 'mediumseagreen'
    | 'mediumslateblue'
    | 'mediumspringgreen'
    | 'mediumturquoise'
    | 'mediumvioletred'
    | 'midnightblue'
    | 'mintcream'
    | 'mistyrose'
    | 'moccasin'
    | 'navajowhite'
    | 'navy'
    | 'oldlace'
    | 'olive'
    | 'olivedrab'
    | 'orange'
    | 'orangered'
    | 'orchid'
    | 'palegoldenrod'
    | 'palegreen'
    | 'paleturquoise'
    | 'palevioletred'
    | 'papayawhip'
    | 'peachpuff'
    | 'peru'
    | 'pink'
    | 'plum'
    | 'powderblue'
    | 'purple'
    | 'rebeccapurple'
    | 'red'
    | 'rosybrown'
    | 'royalblue'
    | 'saddlebrown'
    | 'salmon'
    | 'sandybrown'
    | 'seagreen'
    | 'seashell'
    | 'sienna'
    | 'silver'
    | 'skyblue'
    | 'slateblue'
    | 'slategray'
    | 'slategrey'
    | 'snow'
    | 'springgreen'
    | 'steelblue'
    | 'tan'
    | 'teal'
    | 'thistle'
    | 'tomato'
    | 'transparent'
    | 'turquoise'
    | 'violet'
    | 'wheat'
    | 'white'
    | 'whitesmoke'
    | 'yellow'
    | 'yellowgreen';

type Paint = Color | 'child' | 'context-fill' | 'context-stroke' | 'none' | string;

type Position<TLength> = TLength | 'bottom' | 'center' | 'left' | 'right' | 'top' | string;

type Quote = 'close-quote' | 'no-close-quote' | 'no-open-quote' | 'open-quote';

type RepeatStyle = 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y' | 'round' | 'space' | string;

type SelfPosition =
    | 'center'
    | 'end'
    | 'flex-end'
    | 'flex-start'
    | 'self-end'
    | 'self-start'
    | 'start';

type SingleAnimation =
    | TimingFunction
    | SingleAnimationDirection
    | SingleAnimationFillMode
    | 'infinite'
    | 'none'
    | 'paused'
    | 'running'
    | string
    | number;

type SingleAnimationDirection = 'alternate' | 'alternate-reverse' | 'normal' | 'reverse';

type SingleAnimationFillMode = 'backwards' | 'both' | 'forwards' | 'none';

type SingleTransition = TimingFunction | 'all' | 'none' | string;

type StepTimingFunction = 'step-end' | 'step-start' | string;

type TimingFunction = CubicBezierTimingFunction | StepTimingFunction | 'linear';

type TrackBreadth<TLength> = TLength | 'auto' | 'max-content' | 'min-content' | string;

type ViewportLength<TLength> = TLength | 'auto' | string;
