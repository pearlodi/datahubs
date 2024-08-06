import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';


import line from '../../assets/images/line.png'
import bar from '../../assets/images/bar.png'
import pie from '../../assets/images/pie.png'
import settings from '../../assets/images/settings.png'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Checkbox,
  FormControl,
  RadioGroup, List,
  ListItem,
  ListItemText,
} from '@mui/material';
// import { SketchPicker } from 'react-color';
import ChartTable from './chartTable';
import PageLoader from 'components/loading/PageLoader';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ExcelDataState {
  [id: string]: {
    fileName: string;
    sheetName: string;
    data: (string | number | boolean | null)[][];
  };
}

interface RowRange {
  start: number;
  end: number;
}

const defaultColors = [
  'rgba(75, 192, 192, 0.2)',
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
];

const Visualize: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tableData, setTableData] = useState<ExcelDataState[keyof ExcelDataState] | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [rowRange, setRowRange] = useState<RowRange>({ start: 1, end: 10 });
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[][]>([]);
  const [colors, setColors] = useState<string[]>(defaultColors);
  // const [showColorPicker, setShowColorPicker] = useState<boolean[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('excelData');
    if (storedData) {
      const parsedData: ExcelDataState = JSON.parse(storedData);
      setTableData(parsedData[id as string]);

      // Restore saved settings
      const savedSettings = localStorage.getItem(`visualizeSettings-${id}`);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setChartType(settings.chartType);
        setSelectedColumns(settings.selectedColumns);
        setRowRange(settings.rowRange);
        setColors(settings.colors);
      }
    }
  }, [id]);

  useEffect(() => {
    if (tableData) {
      const columnIndices = selectedColumns.map(col => tableData.data[0].indexOf(col));
      const newLabels: string[] = [];
      const newValues: number[][] = [];

      tableData.data.slice(rowRange.start, rowRange.end + 1).forEach((row) => {
        newLabels.push(row[0] as string);
        const rowValues = columnIndices.map(idx => Number(row[idx]));
        newValues.push(rowValues);
      });

      setLabels(newLabels);
      setValues(newValues);
    }
  }, [tableData, selectedColumns, rowRange]);

  const handleSaveSettings = () => {
    if (id) {
      // Save settings to localStorage
      const settings = {
        chartType,
        selectedColumns,
        rowRange,
        colors,
      };
      localStorage.setItem(`visualizeSettings-${id}`, JSON.stringify(settings));
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleSaveSettings();
    }, 2000); 

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [chartType, selectedColumns, rowRange, colors, id]); 

  if (!tableData) {
    return    <div >
    <PageLoader />
  </div>;
  }

  const columns = tableData.data[0] as string[];
  const data = {
    labels: labels,  
    datasets: selectedColumns.map((col, index) => ({
      label: col,
      data: values.map(row => row[index]),
      backgroundColor: colors[index] || defaultColors[index % defaultColors.length],
      borderColor: colors[index] ? colors[index].replace('0.2', '1') : defaultColors[index % defaultColors.length].replace('0.2', '1'),
      borderWidth: 2,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Data Visualization',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={data as ChartData<'bar'>} options={options as ChartOptions<'bar'>} />;
      case 'line':
        return <Line data={data as ChartData<'line'>} options={options as ChartOptions<'line'>} />;
      case 'pie':
        return <Pie data={data as ChartData<'pie'>} options={options as ChartOptions<'pie'>} />;
      default:
        return null;
    }
  };

  const handleColumnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedColumns((prev) =>
      prev.includes(value) ? prev.filter((column) => column !== value) : [...prev, value]
    );
  }

 
  return (
    <>
      <div className='md:flex gap-5 justify-between items-center'>
        <div className='w-full md:w-[70%] l chart-bg' >
          {renderChart()}
        </div>
        <div className='w-full h-[500px] overflow-scroll md:w-[35%] gradient-background rounded-lg p-4 mt-4 md:mt-0'>
          <div className='flex w-full justify-end items-center gap-1'>
            <p className='font-bold text-[10px]'>Chart Settings</p>
            <img src={settings} alt='settings' className='w-8' />
          </div>
       
          <FormControl component="fieldset" fullWidth>
            <p className='font-bold'>Please select your chart type</p>
            <RadioGroup
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie')}
            >
              <div className="grid grid-cols-3 gap-1 mt-3 ">
                <label>
                  <input
                    type="radio"
                    name="chartType"
                    value="bar"
                    checked={chartType === 'bar'}
                    onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie')}
                    className='cursor-pointer'
                  />
                  <img src={bar} alt="Bar Chart" className='cursor-pointer  rounded-lg' />
                </label>
                <label>
                  <input
                    type="radio"
                    name="chartType"
                    value="line"
                    checked={chartType === 'line'}
                    onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie')}
                    className='cursor-pointer'
                  />
                  <img src={line} alt="Line Chart" className='cursor-pointer  rounded-lg' />
                </label>
                <label>
                  <input
                    type="radio"
                    name="chartType"
                    value="pie"
                    checked={chartType === 'pie'}
                    onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie')}
                    className='cursor-pointer'
                  />
                  <img src={pie} alt="Pie Chart" className='cursor-pointer  rounded-lg' />
                </label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset" fullWidth margin="normal">
            <p className='font-bold'>Please select desired columns</p>
            <List className='h-[180px] overflow-y-scroll columns'>
              {columns.slice(1).map((column) => (
                <ListItem key={column} component="button" onClick={() => handleColumnChange({ target: { value: column } } as React.ChangeEvent<HTMLInputElement>)}>
                  <Checkbox checked={selectedColumns.indexOf(column) > -1} />
                  <ListItemText primary={column} />
                </ListItem>

              ))}
            </List>
          </FormControl>
          <div>
            <label className='font-bold mt-4'>Please select a row range</label>
            <div className='flex gap-3 items-center mt-2'>
              <input
                type="number"
                value={rowRange.start}
                onChange={(e) => setRowRange(prev => ({
                  ...prev,
                  start: Math.min(Number(e.target.value), prev.end - 1)
                }))}
                min="1"
                max={tableData.data.length - 1}
                className='range-select'
              />
              <p>-</p>
              <input
                type="number"
                value={rowRange.end}
                onChange={(e) => setRowRange(prev => ({
                  ...prev,
                  end: Math.max(Number(e.target.value), prev.start + 1)
                }))}
                min={rowRange.start + 1}
                max={tableData.data.length}
                className='range-select'

              />
            </div>
          </div>
          {/* <div>
          <h4>Dataset Colors</h4>
          {selectedColumns.map((col, index) => (
            <div key={col} style={{ marginBottom: '10px' }}>
              <span>{col}</span>
              <div>
                <button onClick={() => toggleColorPicker(index)}>
                  {showColorPicker[index] ? 'Close' : 'Pick Color'}
                </button>
                {showColorPicker[index] && (
                  <SketchPicker
                    color={colors[index] || defaultColors[index % defaultColors.length]}
                    onChangeComplete={(color) => handleColorChange(color.hex, index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div> */}
        </div>

      </div>
      <ChartTable />
    </>
  );
};

export default Visualize;
