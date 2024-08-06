import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface ExcelDataState {
  [id: string]: {
    fileName: string;
    data: (string | number | boolean | null)[][];
    sheetName: string | null;
    visualizationSettings?: {
      chartType: 'bar' | 'line' | 'pie';
      selectedColumns: string[];
      rowRange: {
        start: number;
        end: number;
      };
      colors: string[];
    };
  };
}

const initialState: ExcelDataState = {};

export const loadSettingsFromLocalStorage = createAsyncThunk(
  'data/loadSettingsFromLocalStorage',
  async () => {
    const storedData = localStorage.getItem('excelData');
    if (storedData) {
      return JSON.parse(storedData) as ExcelDataState;
    }
    return initialState;
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addExcelData(
      state,
      action: PayloadAction<{ id: string; fileName: string; data: (string | number | boolean | null)[][]; sheetName: string | null }>
    ) {
      const { id, fileName, data, sheetName } = action.payload;
      const cleanedData = data.filter(row => row.some(cell => cell !== null && cell !== ''));
      state[id] = { fileName, data: cleanedData, sheetName };
      localStorage.setItem('excelData', JSON.stringify(state));
    },
    editExcelData(state, action: PayloadAction<{ id: string; rowIndex: number; newRow: (string | number)[] }>) {
      const { id, rowIndex, newRow } = action.payload;
      if (state[id]) {
        state[id].data[rowIndex] = newRow;
        localStorage.setItem('excelData', JSON.stringify(state));
      }
    },
    deleteExcelData(state, action: PayloadAction<{ id: string; rowIndex: number }>) {
      const { id, rowIndex } = action.payload;
      if (state[id]) {
        state[id].data.splice(rowIndex, 1);
        localStorage.setItem('excelData', JSON.stringify(state));
      }
    },
    setVisualizationSettings(
      state,
      action: PayloadAction<{ id: string; settings: { chartType: 'bar' | 'line' | 'pie'; selectedColumns: string[]; rowRange: { start: number; end: number }; colors: string[] } }>
    ) {
      const { id, settings } = action.payload;
      if (state[id]) {
        state[id].visualizationSettings = settings;
        localStorage.setItem('excelData', JSON.stringify(state));
      }
    },
  },
  
});

export const { addExcelData, editExcelData, deleteExcelData, setVisualizationSettings } = dataSlice.actions;
export default dataSlice.reducer;
