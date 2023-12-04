import React, { useState } from "react";
import { DataGrid, GridColDef, GridSortDirection, GridCellParams, GridSortModel } from "@mui/x-data-grid";
import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { jaJP, enUS } from '@mui/material/locale';
import { enUS as enUSDataGrid, jaJP as jaJPDataGrid } from '@mui/x-data-grid';

import { DataType } from "../../Types/DataType";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface DataTableProps {
    searchValues: string[];
    dataSource: DataType[];
    setTableData: React.Dispatch<React.SetStateAction<DataType[]>>;
};

const StyledDataGrid = styled(DataGrid)({
    '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: 'bold',
    },
    '& .MuiDataGrid-columnHeader': {
        backgroundColor: '#42a5f5',
        color: '#fff',
    },
    '& .MuiDataGrid-cell': {
        backgroundColor: '#f5f5f5',
    },
    '& .MuiDataGrid-cellCenter': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
        width: '0.4em',
    },
    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
        background: '#f1f1f1',
    },
    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
    },
    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover': {
        background: '#555',
    },
});

const DataTable: React.FC<DataTableProps> = ({
    searchValues,
    dataSource,
    setTableData,
}) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const theme = createTheme({}, currentLanguage === 'ja' ? jaJP : enUS);
    const gridLocaleText = currentLanguage === 'ja' ? jaJPDataGrid.components.MuiDataGrid.defaultProps.localeText : enUSDataGrid.components.MuiDataGrid.defaultProps.localeText;
    const [sortModel, setSortModel] = useState([
        {
            field: 'companyInvoiceNumber',
            sort: 'asc' as GridSortDirection,
        },
    ]);

    const columns: GridColDef[] = [
        {
            field: 'companyInvoiceNumber',
            headerName: t('InvoiceNumber'),
            headerAlign: 'center',
            flex: 1,
            sortable: true,
        },
        {
            field: 'invoiceCheck',
            headerName: t('Registered'),
            headerAlign: 'center',
            cellClassName: 'MuiDataGrid-cellCenter',
            flex: 1,
            sortable: true,
        },
        {
            field: 'companyName',
            headerName: t('CompanyName'),
            headerAlign: 'center',
            flex: 1,
            sortable: true,
        },
        {
            field: 'tradeName',
            headerName: t('TradeName'),
            headerAlign: 'center',
            flex: 1,
            sortable: true,
        },
        {
            field: 'address',
            headerName: t('Address'),
            headerAlign: 'center',
            flex: 1,
            sortable: true,
        },
        {
            field: 'delete',
            headerName: t('DataDelete'),
            headerAlign: 'center',
            cellClassName: 'MuiDataGrid-cellCenter',
            flex: 1,
            sortable: false,
            renderCell: (params: GridCellParams) => (
                <DeleteOutlineIcon
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => {
                        setTableData((prevData) =>
                            prevData.filter((item) => item.id !== params.id)
                        );
                    }}
                />
            ),
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ height: '100%', width: '100%' }}>
                <StyledDataGrid
                    rows={dataSource}
                    columns={columns}
                    sortModel={sortModel}
                    localeText={gridLocaleText}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 20, 30]}
                    onSortModelChange={(model: GridSortModel) => setSortModel(model)}
                    disableRowSelectionOnClick
                />
            </Box>
        </ThemeProvider>
    );
};

export default DataTable;  
