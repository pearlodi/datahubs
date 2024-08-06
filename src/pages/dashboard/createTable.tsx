import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import IconButton from '@mui/material/IconButton';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import { v4 as uuidv4 } from 'uuid';

interface Table {
    id: string;
    name: string;
    columns: string[];
    rows: string[][];
}

const CreateTable = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [open, setOpen] = useState(false);
    const [tableName, setTableName] = useState('');
    const [numColumns, setNumColumns] = useState<number>(1);
    const [numRows, setNumRows] = useState<number>(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tableToDelete, setTableToDelete] = useState<Table | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTables = localStorage.getItem('tables');
        if (storedTables) {
            setTables(JSON.parse(storedTables));
        }
    }, []);

    const handleCreateTable = () => {
        if (!tableName.trim() || numColumns <= 0 || numRows <= 0) return;

        const newTable: Table = {
            id: uuidv4(),
            name: tableName,
            columns: Array.from({ length: numColumns }, (_, i) => `Column ${i + 1}`),
            rows: Array.from({ length: numRows }, () => Array(numColumns).fill('')),
        };

        const updatedTables = [...tables, newTable];
        setTables(updatedTables);
        localStorage.setItem('tables', JSON.stringify(updatedTables));

        setTableName('');
        setNumColumns(1);
        setNumRows(1);
        setOpen(false);
        navigate(`/manual-table/${newTable.id}`);
    };

    const handleTableClick = (id: string) => navigate(`/manual-table/${id}`);
    
    const handleVisualizeTable = (id: string) => navigate(`/visualize-table/${id}`);

    const handleOpenDeleteDialog = (table: Table) => {
        setTableToDelete(table);
        setDeleteDialogOpen(true);
    };

    const handleDeleteTable = () => {
        if (tableToDelete) {
            const updatedTables = tables.filter(table => table.id !== tableToDelete.id);
            setTables(updatedTables);
            localStorage.setItem('tables', JSON.stringify(updatedTables));
            setDeleteDialogOpen(false);
            setTableToDelete(null);
        }
    };

    return (
        <>
            {tables.length === 0 ? (
                <div className='flex flex-col justify-center items-center gap-4 h-[60vh]'>
                    <p className='text-2xl font-medium text-center'>You haven't created any manual tables yet. Please click the button below to create one.</p>
                    <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                        Create Table
                    </Button>
                </div>
            ) : (
                <>
                    <div className='w-[200px]'>
                    <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                        Create New Table
                    </Button>
                    </div>
                    <Paper className='mt-6' sx={{ width: '100%', overflow: 'scroll' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Table Name</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tables.map(table => (
                                        <TableRow key={table.id}>
                                            <TableCell className='capitalize'>{table.name}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" onClick={() => handleTableClick(table.id)}>
                                                    View Table
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" onClick={() => handleVisualizeTable(table.id)}>
                                                    Visualize Table
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleOpenDeleteDialog(table)}>
                                                    <DeleteForeverOutlinedIcon className="text-[red]" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </>
            )}

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create a New Table</DialogTitle>
                <DialogContent className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-1'>
                        <label className='text-[12px] font-normal text'>Table name</label>
                        <input
                            autoFocus
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            className='create-input w-full max-w-full'
                            placeholder='Table name'
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-[12px] font-normal text'>Number of columns</label>
                        <input
                            type="number"
                            value={numColumns}
                            onChange={(e) => setNumColumns(Number(e.target.value))}
                            className='create-input w-full max-w-full'
                            placeholder='Number of columns'
                            min="1"
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-[12px] font-normal text'>Number of rows</label>
                        <input
                            type="number"
                            value={numRows}
                            onChange={(e) => setNumRows(Number(e.target.value))}
                            className='create-input w-full max-w-full'
                            min="1"
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateTable}>Create Table</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this table?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteTable} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CreateTable;
