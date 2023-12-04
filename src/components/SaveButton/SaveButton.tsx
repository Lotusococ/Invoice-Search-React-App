import React from 'react';
import { Button } from "@mui/material";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { DataType } from '../../Types/DataType';
import { useTranslation } from 'react-i18next';

interface SaveButtonProps {
    tableData: DataType[];
}

export const SaveButton: React.FC<SaveButtonProps> = ({ tableData }) => {
    const { t } = useTranslation();

    const handleSave = () => {
        if (tableData.length > 0) {
            const csvData = convertToCSV(tableData);
            downloadCSV(csvData);
        }
    };

    const convertToCSV = (data: any[]) => {
        const headers = ['インボイス番号', '登録有無', '会社名', '屋号', '住所'];
        const headerRow = headers.join(',') + "\n";
        const dataRows = data.map(item => {
            const rowData = [item.companyInvoiceNumber, item.invoiceCheck, item.companyName, item.tradeName, item.address];
            return rowData.join(',');
        });
        return headerRow + dataRows.join('\n');
    };

    const downloadCSV = (csvData: string) => {
        const downloadLink = document.createElement("a");
        const blob = new Blob(["\uFEFF" + csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = "invoiceData.csv";
        downloadLink.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Button
            variant="contained"
            size='large'
            startIcon={<CloudDownloadIcon />}
            onClick={handleSave}
            sx={{ bgcolor: "#42a5f5", borderRadius: 15, color: "#fff", '&:hover': { bgcolor: "#2196f3" }}}
        >
            {t('Download')}
        </Button>
    )
};  
