import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, Checkbox, ListItemText, SelectChangeEvent } from '@mui/material';

interface VisualizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisualize: (selection: { start: number, end: number, columns: string[] }) => void;
  totalRows: number;
  columns: string[];
}

const VisualizationModal: React.FC<VisualizationModalProps> = ({ isOpen, onClose, onVisualize, totalRows, columns }) => {
  const [startRow, setStartRow] = useState<number>(1);
  const [endRow, setEndRow] = useState<number>(totalRows);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleVisualizeClick = () => {
    onVisualize({ start: startRow, end: endRow, columns: selectedColumns });
  };

  const handleColumnChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedColumns(event.target.value as string[]);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Select Data Range and Columns to Visualize
        </Typography>
        <TextField
          label="Start Row"
          type="number"
          fullWidth
          value={startRow}
          onChange={(e) => setStartRow(parseInt(e.target.value, 10))}
          margin="normal"
        />
        <TextField
          label="End Row"
          type="number"
          fullWidth
          value={endRow}
          onChange={(e) => setEndRow(parseInt(e.target.value, 10))}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Columns</InputLabel>
          <Select
            multiple
            value={selectedColumns}
            onChange={handleColumnChange}
            renderValue={(selected) => (selected as string[]).join(', ')}
          >
            {columns.map((column) => (
              <MenuItem key={column} value={column}>
                <Checkbox checked={selectedColumns.indexOf(column) > -1} />
                <ListItemText primary={column} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleVisualizeClick} sx={{ mt: 2 }}>
          Visualize
        </Button>
      </Box>
    </Modal>
  );
};

export default VisualizationModal;
