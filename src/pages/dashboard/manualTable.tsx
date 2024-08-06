import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';

interface Table {
    id: string;
    name: string;
    columns: string[];
    rows: string[][];
}

const ManualTable = () => {
    const { id } = useParams<{ id: string }>();
    const [table, setTable] = useState<Table | null>(null);
    const [editableTable, setEditableTable] = useState<Table | null>(null);
    const [hoveredColumnIndex, setHoveredColumnIndex] = useState<number | null>(null);

    useEffect(() => {
        const storedTables = localStorage.getItem('tables');
        if (storedTables) {
            const tables: Table[] = JSON.parse(storedTables);
            const foundTable = tables.find((t) => t.id === id);
            setTable(foundTable || null);
            setEditableTable(foundTable ? { ...foundTable } : null);
        }
    }, [id]);

    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (editableTable) {
                saveTable();
            }
        }, 2000); // Auto-save every 10 seconds

        return () => clearInterval(autoSaveInterval);
    }, [editableTable]);

    const saveTable = () => {
        const storedTables = localStorage.getItem('tables');
        if (storedTables && editableTable) {
            const tables: Table[] = JSON.parse(storedTables);
            const updatedTables = tables.map((t) => (t.id === id ? editableTable : t));
            localStorage.setItem('tables', JSON.stringify(updatedTables));
            setTable(editableTable);
        }
    };

    const handleColumnChange = (columnIndex: number, value: string) => {
        if (editableTable) {
            const updatedTable = { ...editableTable };
            updatedTable.columns[columnIndex] = value;
            setEditableTable(updatedTable);
        }
    };

    const handleRowChange = (rowIndex: number, columnIndex: number, value: string) => {
        if (editableTable) {
            const updatedTable = { ...editableTable };
            updatedTable.rows[rowIndex][columnIndex] = value;
            setEditableTable(updatedTable);
        }
    };

    const handleDeleteRow = (rowIndex: number) => {
        if (editableTable) {
            const updatedTable = { ...editableTable };
            updatedTable.rows.splice(rowIndex, 1);
            setEditableTable(updatedTable);
        }
    };

    const handleAddRow = () => {
        if (editableTable) {
            const updatedTable = { ...editableTable };
            const newRow = Array(updatedTable.columns.length).fill('');
            updatedTable.rows.push(newRow);
            setEditableTable(updatedTable);
        }
    };

    const handleAddColumn = () => {
        if (editableTable) {
            const updatedTable = { ...editableTable };
            updatedTable.columns.push(`Column ${updatedTable.columns.length + 1}`);
            updatedTable.rows = updatedTable.rows.map((row) => [...row, '']);
            setEditableTable(updatedTable);
        }
    };

    const handleDeleteColumn = (columnIndex: number) => {
        if (editableTable) {
            const updatedTable = { ...editableTable };
            updatedTable.columns.splice(columnIndex, 1);
            updatedTable.rows = updatedTable.rows.map((row) => {
                row.splice(columnIndex, 1);
                return row;
            });
            setEditableTable(updatedTable);
        }
    };

    const handleManualSave = () => {
        saveTable();
    };

    return (
        <div>
            {table ? (
                <div>
                    <div className="w-full md:flex justify-between">
                        <h1 className="uppercase font-bold text">{table.name}</h1>
                        <div className="flex gap-2 mt-2 md:mt-0">
                            <Button onClick={handleAddRow} variant="contained" color="primary">
                                Add Row
                            </Button>
                            <Button onClick={handleAddColumn} variant="contained" color="primary">
                                Add Column
                            </Button>
                           <div className='hidden'>
                           <Button onClick={handleManualSave} variant="contained" color="primary" >
                                Save
                            </Button>
                           </div>
                        </div>
                    </div>
                    <Paper className="mt-6" sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {editableTable?.columns.map((col, index) => (
                                            <TableCell
                                                id="manual-table"
                                                key={index}
                                                onMouseEnter={() => setHoveredColumnIndex(index)}
                                                onMouseLeave={() => setHoveredColumnIndex(null)}
                                              
                                            >
                                                <div className="flex items-center justify-between">
                                                    <input
                                                        value={col}
                                                        onChange={(e) => handleColumnChange(index, e.target.value)}
                                                        className="manual-input-head"
                                                    />
                                                    {hoveredColumnIndex === index && (
                                                        <IconButton
                                                            onClick={() => handleDeleteColumn(index)}
                                                            className="text-[red]"
                                                        >
                                                            <DeleteForeverOutlinedIcon className='text-[red]' />
                                                        </IconButton>
                                                    )}
                                                </div>
                                            </TableCell>
                                        ))}
                                        <TableCell   className='sticky-column'>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {editableTable?.rows.map((row, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                                <TableCell id="manual-table" key={cellIndex}>
                                                    <textarea
                                                        className="manual-input w-20"
                                                        value={cell}
                                                        onChange={(e) => handleRowChange(rowIndex, cellIndex, e.target.value)}
                                                    />
                                                </TableCell>
                                            ))}
                                            <TableCell id="table" className="text-center sticky-column">
                                                <IconButton
                                                    className="flex justify-center items-center"
                                                    onClick={() => handleDeleteRow(rowIndex)}
                                                >
                                                    <DeleteForeverOutlinedIcon className="text-[red]" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
            ) : (
                <p>No table found</p>
            )}
        </div>
    );
};

export default ManualTable;
