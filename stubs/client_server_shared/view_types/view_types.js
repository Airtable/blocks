// @flow
const ViewTypes = {
    FORM: ('form': 'form'),
    GRID: ('grid': 'grid'),
    CALENDAR: ('calendar': 'calendar'),
    GALLERY: ('gallery': 'gallery'),
    KANBAN: ('kanban': 'kanban'),
};

export type ViewType = $Values<typeof ViewTypes>;

module.exports = ViewTypes;
