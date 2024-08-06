import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { addExcelData as addExcelDataAction } from '../redux/slices/dataSlice';
import * as XLSX from 'xlsx';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
type ExcelData = (string | number | boolean | null)[][];

const UploadExcel = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelData>([]);
  const [open, setOpen] = useState(false);
  const [numberOfSheets, setNumberOfSheets] = useState(0);

  useEffect(() => {
    if (file && selectedSheet) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array((e.target?.result || new ArrayBuffer(0)) as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[selectedSheet];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as ExcelData;
        setExcelData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  }, [selectedSheet, file]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array((e.target?.result || new ArrayBuffer(0)) as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheets = workbook.SheetNames;
      setSheetNames(sheets);
      setNumberOfSheets(sheets.length);

      if (sheets.length === 1) {
        const onlySheet = sheets[0];
        setSelectedSheet(onlySheet);
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[onlySheet], { header: 1 }) as ExcelData;
        setExcelData(sheetData.filter(row => row.some(cell => cell !== null && cell !== ''))); // Remove empty rows
      }

      setOpen(true);
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleSheetSelect = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array((e.target?.result || new ArrayBuffer(0)) as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as ExcelData;
        setExcelData(jsonData.filter(row => row.some(cell => cell !== null && cell !== ''))); // Remove empty rows
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleLoadData = () => {
    if (file && excelData.length > 0) {
      const fileId = uuidv4();
      const cleanedData = numberOfSheets > 1 ? excelData.slice(1) : excelData;

      dispatch(addExcelDataAction({ fileName: file.name, data: cleanedData, id: fileId, sheetName: selectedSheet }));

      const storedData = JSON.parse(localStorage.getItem('excelData') || '{}');
      storedData[fileId] = {
        fileName: file.name,
        sheetName: selectedSheet,
        data: cleanedData,
      };
      localStorage.setItem('excelData', JSON.stringify(storedData));

      setOpen(false);
      navigate(`/data-table/${fileId}`);
    } else {
      console.error('File, selectedSheet, or excelData is missing');
    }
  };
  return (
    <div>
      <input
        type="file"
        id="file-upload"
        accept=".xlsx, .xls"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <label htmlFor="file-upload" className='gradient-background text-black cursor-pointer w-full flex font-medium text-center items-center justify-center p-1'>
        Upload from Excel
      </label>

      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="dialog-title">
        <DialogTitle id="dialog-title" className='text'><p className='text foont-bold text-lg'>Select a Sheet</p></DialogTitle>
        <DialogContent dividers>
          {sheetNames.length > 1 && (
            <div>
              {sheetNames.map((name) => (
                <Button
                  key={name}
                  onClick={() => handleSheetSelect(name)}
                >
                  {name}
                </Button>
              ))}
            </div>
          )}
          {excelData.length > 0 && (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table>
                  <TableHead>
                  
                    <TableRow>
                      {excelData[0]?.map((cell, index) => (
                        <TableCell key={index}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  <TableRow>
                    </TableRow>
                    {excelData.slice(1).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleLoadData} disabled={!selectedSheet}>
            Load Data
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UploadExcel;
