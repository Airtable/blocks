// @flow
const ViewTypes = {
    GRID: ('grid': 'grid'),
    FORM: ('form': 'form'),
    CALENDAR: ('calendar': 'calendar'),
    GALLERY: ('gallery': 'gallery'),
    KANBAN: ('kanban': 'kanban'),
};

export type ViewType = $Values<typeof ViewTypes>;

module.exports = ViewTypes;
