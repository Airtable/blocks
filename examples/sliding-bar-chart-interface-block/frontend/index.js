import {FieldType} from '@airtable/blocks/interface/models';
import {
    expandRecord,
    initializeBlock,
    useBase,
    useCustomProperties,
    useRecords,
} from '@airtable/blocks/interface/ui';
import {useEffect, useState, useMemo} from 'react';
import Slider from '@mui/material/Slider';
import {stateColors} from './colors';
import './style.css';

function SlidingBarChart() {
    const base = useBase();
    const table = base.tables[0]; // Every base has at least one table
    const records = useRecords(table);

    const [ref, setRef] = useState(null);
    const [width, setWidth] = useState(0);
    useEffect(() => {
        if (ref) {
            setWidth(ref.clientWidth);
            function handleResize() {
                setWidth(ref.clientWidth);
            }
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [ref]);

    const {customPropertyValueByKey} = useCustomProperties(getCustomProperties);
    const xAxisField = customPropertyValueByKey['bar_chart_x_axis'];
    const yAxisField = customPropertyValueByKey['bar_chart_y_axis'];
    const valueField = customPropertyValueByKey['bar_chart_value'];
    const topN = parseInt(customPropertyValueByKey['bar_chart_top_n']);

    // Extract years from the data
    const xAxisValues = useMemo(
        () =>
            xAxisField
                ? Array.from(
                      new Set(records.map(record => record.getCellValueAsString(xAxisField))),
                  ).sort()
                : [],
        [records, xAxisField],
    );
    const [selectedXAxisIndex, setSelectedXAxisIndex] = useState(0);

    if (!xAxisField || !yAxisField || !valueField) {
        return (
            <div
                style={{
                    padding: '20px',
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                }}
            >
                Please configure the chart
            </div>
        );
    }

    // Handle slider change
    const handleSliderChange = (event, newValue) => {
        setSelectedXAxisIndex(newValue);
    };

    // Create marks for the slider
    const marks =
        xAxisValues.length <= 20
            ? // If there's less than 20 distinct values, show a mark for each value
              xAxisValues.map((xAxisValue, index) => ({value: index, label: xAxisValue.toString()}))
            : // If there's more than 20 distinct values, show 20 marks total
              xAxisValues
                  .map((xAxisValue, index) => ({value: index, label: xAxisValue.toString()}))
                  .filter((xAxisValue, index) => index % Math.floor(xAxisValues.length / 20) === 0);

    const sliderValue =
        selectedXAxisIndex >= 0 && selectedXAxisIndex < xAxisValues.length ? selectedXAxisIndex : 0;
    const chartData = records.filter(
        record => record.getCellValueAsString(xAxisField) === xAxisValues[sliderValue],
    );

    return (
        <div ref={setRef}>
            <div style={{paddingLeft: 60, paddingRight: 60}}>
                <Slider
                    value={sliderValue}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={xAxisValues.length - 1}
                    step={1}
                    marks={marks}
                />
            </div>
            {width > 0 && (
                <ChartRace
                    width={width - 50}
                    topN={topN}
                    data={chartData.map(record => ({
                        id: record.id,
                        yAxisValue: record.getCellValueAsString(yAxisField),
                        value: record.getCellValue(valueField),
                        color: stateColors[record.getCellValueAsString(yAxisField)] || '#8884d8',
                        record: record,
                    }))}
                />
            )}
        </div>
    );
}

function ChartRace({
    data = [],
    backgroundColor = '#fff',
    width = 680,
    padding = 20,
    itemHeight = 38,
    gap = 4,
    titleStyle = {font: 'normal 400 13px Arial', color: '#212121'},
    valueStyle = {font: 'normal 400 11px Arial', color: '#777'},
    topN,
}) {
    if (data.length === 0) {
        return null;
    }

    const sortedData = Array.from(data).sort((a, b) => b.value - a.value);
    const maxValue = sortedData[0].value;

    // Create a map of yAxisValue to index
    const indexByYAxisValue = {};
    sortedData.forEach((item, index) => {
        indexByYAxisValue[item.yAxisValue] = index;
    });

    // Sort the data by yAxisValue to produce stable order. This is important for the animation to work correctly.
    const sortedByYAxisValue = sortedData
        .slice(0, topN)
        .sort((a, b) => (a.yAxisValue < b.yAxisValue ? -1 : 1));

    return (
        <div
            style={{
                boxSizing: 'border-box',
                position: 'relative',
                backgroundColor: backgroundColor,
                paddingTop: padding,
                paddingBottom: padding,
                width: width,
                height: 2 * padding + topN * itemHeight + (topN - 1) * gap,
            }}
        >
            {sortedByYAxisValue.map(item => {
                const index = indexByYAxisValue[item.yAxisValue];
                return (
                    <Bar
                        key={item.yAxisValue}
                        item={item}
                        onClick={() => expandRecord(item.record)}
                        padding={padding}
                        itemHeight={itemHeight}
                        gap={gap}
                        width={width}
                        index={index}
                        maxValue={maxValue}
                        titleStyle={titleStyle}
                        valueStyle={valueStyle}
                    />
                );
            })}
        </div>
    );
}

function Bar({
    onClick,
    item,
    padding,
    itemHeight,
    gap,
    width,
    index,
    maxValue,
    titleStyle,
    valueStyle,
}) {
    const translateY = index === 0 ? padding : padding + index * itemHeight + index * gap;
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                transition: 'all 1200ms',
                height: itemHeight,
                transform: `translateY(${translateY}px) translateX(${padding}px)`,
            }}
        >
            <b
                style={{
                    height: '100%',
                    borderRadius: '4px',
                    transition: 'all 600ms',
                    backgroundColor: item.color,
                    width: (item.value / maxValue) * (width - 120 - 2 * padding),
                }}
            ></b>
            <span
                style={{
                    width: 112,
                    marginLeft: 10,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <em style={titleStyle}>{item.yAxisValue}</em>
                <i style={valueStyle}>{item.value.toLocaleString()}</i>
            </span>
        </div>
    );
}

function getCustomProperties(base) {
    const table = base.tables[0]; // Every base has at least one table

    const fieldTypesForAxes = new Set([FieldType.SINGLE_SELECT, FieldType.MULTIPLE_RECORD_LINKS]);
    const fieldTypesForValue = new Set([FieldType.NUMBER, FieldType.PERCENT]);

    return [
        {
            key: 'bar_chart_x_axis',
            label: 'X Axis',
            type: 'field',
            table,
            possibleValues: table.fields.filter(field => fieldTypesForAxes.has(field.type)),
        },
        {
            key: 'bar_chart_y_axis',
            label: 'Y Axis',
            type: 'field',
            table,
            possibleValues: table.fields.filter(field => fieldTypesForAxes.has(field.type)),
        },
        {
            key: 'bar_chart_value',
            label: 'Value',
            type: 'field',
            table,
            possibleValues: table.fields.filter(field => fieldTypesForValue.has(field.type)),
        },
        {
            key: 'bar_chart_top_n',
            label: 'Top N',
            type: 'enum',
            possibleValues: [
                {value: '5', label: '5'},
                {value: '10', label: '10'},
                {value: '25', label: '25'},
                {value: '50', label: '50'},
            ],
            defaultValue: '10',
        },
    ];
}

initializeBlock({interface: () => <SlidingBarChart />});
