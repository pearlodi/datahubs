import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, BarElement, ArcElement } from 'chart.js';
import ManualTable from './manualTable';
import line from '../../assets/images/line.png';
import bar from '../../assets/images/bar.png';
import pie from '../../assets/images/pie.png';
import settings from '../../assets/images/settings.png';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, BarElement, ArcElement);

interface Table {
    id: string;
    name: string;
    columns: string[];
    rows: string[][];
}

interface ChartSettings {
    chartType: 'line' | 'bar' | 'pie' | 'doughnut';
    selectedColumns: string[];
    rowRange: { start: number; end: number };
}

const VisualizeTable = () => {
    const { id } = useParams<{ id: string }>();
    const [table, setTable] = useState<Table | null>(null);
    const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'doughnut'>('line');
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [rowRange, setRowRange] = useState<{ start: number; end: number }>({ start: 0, end: 5 });

    useEffect(() => {
        const storedTables = localStorage.getItem('tables');
        const storedSettings = localStorage.getItem(`chartSettings-${id}`);
        if (storedTables) {
            const tables: Table[] = JSON.parse(storedTables);
            const foundTable = tables.find((t) => t.id === id);
            setTable(foundTable || null);

            if (storedSettings) {
                const settings: ChartSettings = JSON.parse(storedSettings);
                setChartType(settings.chartType);
                setSelectedColumns(settings.selectedColumns);
                setRowRange(settings.rowRange);
            }
        }
    }, [id]);

    const handleColumnSelection = (column: string) => {
        setSelectedColumns((prev) =>
            prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]
        );
    };

    // const handleSaveSettings = () => {
    //     const settings: ChartSettings = {
    //         chartType,
    //         selectedColumns,
    //         rowRange,
    //     };
    //     localStorage.setItem(`chartSettings-${id}`, JSON.stringify(settings));
    //     alert('Settings saved!');
    // };

    useEffect(() => {
        const interval = setInterval(() => {
            const settings: ChartSettings = {
                chartType,
                selectedColumns,
                rowRange,
            };
            localStorage.setItem(`chartSettings-${id}`, JSON.stringify(settings));
        }, 2000);

        return () => clearInterval(interval);
    }, [chartType, selectedColumns, rowRange, id]);
    const defaultColors = [
     'rgba(75, 192, 192, 0.2)',
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
    ];
    
    const borderColors = [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
    ];
    
    const chartData = {
        labels: selectedColumns,
        datasets: table ? table.rows.slice(rowRange.start, rowRange.end).map((row, index) => ({
            label: `Row ${index + 1}`,
            data: row.filter((_, idx) => selectedColumns.includes(table.columns[idx])).map((cell) => parseFloat(cell) || 0),
            borderColor: borderColors[index % borderColors.length],
            backgroundColor: defaultColors[index % defaultColors.length],
            borderWidth: 2,
        })) : [],
    };
    
    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return <Bar data={chartData} />;
            case 'pie':
                return <Pie data={chartData} />;
            case 'doughnut':
                return <Doughnut data={chartData} />;
            default:
                return <Line data={chartData} />;
        }
    };

    return (
        <div>
            <h1 className="uppercase font-bold text">{table?.name} - Visualization</h1>
            <div className='md:flex items-center gap-4'>
                <div className='w-full md:w-[70%] l chart-bg' >
                    {renderChart()}
                </div>
                <div className="w-full h-[500px] overflow-scroll md:w-[35%] gradient-background rounded-lg p-4 mt-4 md:mt-0">
                    <div>
                        <div className='flex w-full justify-end items-center gap-1'>
                            <p className='font-bold text-[10px]'>Chart Type</p>
                            <img src={settings} alt='settings' className='w-8' />
                        </div>
                        <p className='font-bold'>Please select your chart type</p>
                        <div className="flex gap-1 mt-4">
                            
                            <label className="">
                                <input
                                    type="radio"
                                    name="chartType"
                                    value="line"
                                    checked={chartType === 'line'}
                                    onChange={() => setChartType('line')}
                                />
                                <img src={line} alt="Line Chart" className='cursor-pointer  rounded-lg w-20' />
                            </label>
                            <label className="">
                                <input
                                    type="radio"
                                    name="chartType"
                                    value="bar"
                                    checked={chartType === 'bar'}
                                    onChange={() => setChartType('bar')}
                                />
                                 <img src={bar} alt="Bar Chart" className='cursor-pointer  rounded-lg w-20' />
                            </label>
                            <label className=" gap-1">
                                <input
                                    type="radio"
                                    name="chartType"
                                    value="pie"
                                    checked={chartType === 'pie'}
                                    onChange={() => setChartType('pie')}
                                />
                                 <img src={pie} alt="Pie Chart" className='cursor-pointer  rounded-lg w-20' />
                            </label>
                            {/* <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="chartType"
                                    value="doughnut"
                                    checked={chartType === 'doughnut'}
                                    onChange={() => setChartType('doughnut')}
                                />
                                <span>Doughnut</span>
                            </label> */}
                        </div>
                    </div>
                    <p className='font-bold mt-4'>Please select desired columns</p>
                    <div className='h-[180px] overflow-y-scroll columns flex flex-col gap-3 mt-4'>
                    
                        {table?.columns.map((column) => (
                            <div key={column} className='flex items-center gap-2'>
                                <input
                                    type="checkbox"
                                    id={`col-${column}`}
                                    value={column}
                                    checked={selectedColumns.includes(column)}
                                    onChange={() => handleColumnSelection(column)}
                                />
                                <label htmlFor={`col-${column}`}>{column}</label>
                            </div>
                        ))}
                    </div>
                    <div >
                    <label className='font-bold mt-4'>Please select a row range</label>
                   <div className='flex gap-3 items-center mt-2'>
                   <input
                            type="number"
                            id="rowRangeStart"
                            value={rowRange.start}
                            onChange={(e) => setRowRange({ ...rowRange, start: parseInt(e.target.value) })}
                            min="1"
                            max={table ? table.rows.length - 1 : 0}
                            className='range-select'
                        />
                        <p>-</p>
                        <input
                            type="number"
                            id="rowRangeEnd"
                            value={rowRange.end}
                            onChange={(e) => setRowRange({ ...rowRange, end: parseInt(e.target.value) })}
                            min="1"
                            max={table ? table.rows.length : 0}
                            className='range-select'
                        />
                   </div>
                    </div>
                
                </div>
            </div>
            <div className='mt-[100px]'> <ManualTable /></div>
        </div>
    );
};

export default VisualizeTable;
