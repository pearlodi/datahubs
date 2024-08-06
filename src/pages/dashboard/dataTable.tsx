import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import { deleteExcelData, editExcelData } from 'redux/slices/dataSlice';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

type DataRow = (string | number)[];

interface ExcelData {
  fileName: string;
  data: DataRow[];
}

interface RootState {
  data: Record<string, ExcelData>;
}

const DataTable = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [data, setData] = useState<DataRow[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [documentName, setDocumentName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editMode, setEditMode] = useState<Record<number, boolean>>({});
  const [editedData, setEditedData] = useState<Record<number, DataRow>>({});
  const rowsPerPage = 5;

  const excelData = useSelector((state: RootState) => (id ? state.data[id] : undefined));

  useEffect(() => {
    const storedData = localStorage.getItem(`data-${id}`);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData.data);
      setFilteredData(parsedData.data);
      setDocumentName(parsedData.fileName || 'Unknown Document');
    } else if (excelData) {
      setData(excelData.data);
      setFilteredData(excelData.data);
      setDocumentName(excelData.fileName || 'Unknown Document');
      localStorage.setItem(`data-${id}`, JSON.stringify({ fileName: excelData.fileName, data: excelData.data }));
    } else {
      console.error('No data found for the given ID:', id);
    }
  }, [id, excelData]);

  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem(`data-${id}`, JSON.stringify({ fileName: documentName, data }));
    }
  }, [data, documentName, id]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((row, index) => {
        if (index === 0) return true; // Keep the header
        return row.some((cell) => cell.toString().toLowerCase().includes(query));
      });
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset to the first page on search
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleEditClick = (rowIndex: number) => {
    setEditMode((prev) => ({ ...prev, [rowIndex]: true }));
    setEditedData((prev) => ({ ...prev, [rowIndex]: filteredData[rowIndex] }));
  };

  const handleSaveClick = (rowIndex: number) => {
    if (id) {
      dispatch(editExcelData({ id, rowIndex, newRow: editedData[rowIndex] }));
      setData((prev) => prev.map((row, index) => (index === rowIndex ? editedData[rowIndex] : row)));
      setFilteredData((prev) => prev.map((row, index) => (index === rowIndex ? editedData[rowIndex] : row)));
      setEditMode((prev) => ({ ...prev, [rowIndex]: false }));
    }
  };

  const handleDeleteClick = (rowIndex: number) => {
    if (id) {
      dispatch(deleteExcelData({ id, rowIndex }));
      setData((prev) => prev.filter((_, index) => index !== rowIndex));
      setFilteredData((prev) => prev.filter((_, index) => index !== rowIndex));
    }
  };

  const handleCellChange = (rowIndex: number, cellIndex: number, value: string | number) => {
    setEditedData((prev) => ({
      ...prev,
      [rowIndex]: prev[rowIndex].map((cell, index) => (index === cellIndex ? value : cell)),
    }));
  };

  const paginatedData = filteredData.slice(1 + (currentPage - 1) * rowsPerPage, 1 + currentPage * rowsPerPage);

  return (
    <div>
      <p className="text font-bold text-xl">{documentName}</p>
      <input
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearchChange}
        type="text"
        className="search mb-6 mt-6"
      />
      {filteredData.length > 1 ? (
        <>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {filteredData[0]?.map((header: string | number, index: number) => (
                      <TableCell className="pt-10 pl-10" key={index}>
                        {header}
                      </TableCell>
                    ))}
                    <TableCell className="sticky-column"></TableCell>
                  
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((row: (string | number)[], rowIndex: number) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell: string | number, cellIndex: number) => (
                        <TableCell key={cellIndex}>
                          {editMode[rowIndex + 1] ? (
                            <input
                              className="edit"
                              value={editedData[rowIndex + 1]?.[cellIndex] ?? cell}
                              onChange={(e) => handleCellChange(rowIndex + 1, cellIndex, e.target.value)}
                            />
                          ) : (
                            cell
                          )}
                        </TableCell>
                      ))}
                   
                      <TableCell className="sticky-column flex">
                   <div className='flex items-center justify-center'>
                   <IconButton
                          className="icons"
                          onClick={() =>
                            editMode[rowIndex + 1] ? handleSaveClick(rowIndex + 1) : handleEditClick(rowIndex + 1)
                          }
                        >
                          {editMode[rowIndex + 1] ? (
                            <SaveIcon className="text-[green] text-[5px]" />
                          ) : (
                            <ModeEditOutlineOutlinedIcon className="text-[green] text-[10px]" />
                          )}
                        </IconButton>
                        <IconButton className="icons" onClick={() => handleDeleteClick(rowIndex + 1)}>
                          <DeleteForeverOutlinedIcon className="text-[red] text-[10px]" />
                        </IconButton>
                   </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                count={Math.ceil((filteredData.length - 1) / rowsPerPage)} // Exclude the header row from pagination count
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: '20px' }}
              />
            </TableContainer>
          </Paper>
        </>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default DataTable;
