import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import UploadExcel from 'components/UploadExcel';
import excel from '../../assets/images/excel.png'
interface ExcelDataState {
  [id: string]: {
    fileName: string;
    sheetName: string;
    data: (string | number | boolean | null)[][];
  };
}

const table = () => {

  const handleVisualizeTable = (id: string, action: 'view' | 'visualize') => {
    if (action === 'view') {
      navigate(`/data-table/${id}`);
    } else if (action === 'visualize') {
      navigate(`/visualize/${id}`);
    }
  };
  const [tables, setTables] = useState<ExcelDataState>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('excelData');
    if (storedData) {
      const parsedData: ExcelDataState = JSON.parse(storedData);
      setTables(parsedData);

      console.log(storedData)
    }
  }, []);

  const handleViewTable = (id: string) => {
    navigate(`/data-table/${id}`);
  };


  const openDeleteDialog = (id: string) => {
    setTableToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteTable = () => {
    if (tableToDelete) {
      const updatedTables = { ...tables };
      delete updatedTables[tableToDelete];
      setTables(updatedTables);
      localStorage.setItem('excelData', JSON.stringify(updatedTables));
      setTableToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setTableToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    <div>
      <div className='w-[200px]'>
        <UploadExcel />
      </div>
      {Object.keys(tables).length > 0 ? (
        <Paper className='mt-6' sx={{ width: '100%', overflow: 'scroll' }} >
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(tables).map((id) => (
                  <TableRow key={id}>
                    <TableCell>
                      <div className='flex gap-2 items-center'>
                      <img src={excel} alt='excel icon' className='w-8'/>
                      {tables[id].fileName}</div></TableCell>
                      
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleVisualizeTable(id, 'visualize')}>
                        Visualize Table
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleViewTable(id)}>
                        View Table
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button className="icons" variant="contained" color="secondary" onClick={() => openDeleteDialog(id)}>
                        <DeleteForeverOutlinedIcon className='text-[red]' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Paper>
  ) : (
    <Typography variant="h6" gutterBottom>
      No data available
    </Typography>
  )
}

<Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
  <DialogTitle>Confirm Deletion</DialogTitle>
  <DialogContent>
    <p>Are you sure you want to delete this table?</p>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCancelDelete}>Cancel</Button>
    <Button onClick={handleDeleteTable} color="error">Delete</Button>
  </DialogActions>
</Dialog>
    </div >
  );
};

export default table;