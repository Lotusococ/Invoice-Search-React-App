import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useTranslation } from "react-i18next";

// MUI Imports
import { Box } from "@mui/material";

// Components Imports
import { FilePicker } from "src/components/FilePicker";
import { CheckButton } from 'src/components/CheckButton';
import { SaveButton } from "src/components/SaveButton";
import { ResetButton } from 'src/components/ResetButton';
import DataTable from "src/components/Table/ConsitencyCheck";

// Interface Imports
import { requestInvoiceSearchExcelAPI } from "src/interface/Invoice Search/ExcelAPI/requestInvoiceSearchExcelAPI";
import { useAuth } from 'src/interface/Firebase/requestAuth';

// Hooks Imports
import { useSnackbar } from 'src/contexts/SnackbarContext';
import { sendCustomTraceLog } from 'src/interface/Axiom Log/sendCustomTraceLog';

interface CsvRow {
    companyInvoiceNumber: string;
    companyName: string;
    address: string;
};

interface RawCsvRow {
    "インボイス番号": string;
    "会社名": string;
    "住所": string;
};

interface ApiResponse {
    companyInvoiceNumber: string;
    companyName: string;
    address: string;
};

interface TableDataRow extends CsvRow {
    id: string;
};

export const ConsistencyCheck: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [tableData, setTableData] = useState<TableDataRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState<ApiResponse[]>([]);
    const [csvData, setCsvData] = useState<TableDataRow[]>([]);
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();
    const { user } = useAuth();
    const [resetFilePicker, setResetFilePicker] = useState(false);
    
    const handleFileSelected = (file: File) => {
        setSelectedFile(file);
    };

    const fetchAndTransformInvoiceSearchResults = async (invoiceNumbers: string[], keyCounter: number) => {
        try {
            let requestInvoiceResult = await requestInvoiceSearchExcelAPI(invoiceNumbers);
            let transformedData = requestInvoiceResult.map((item: any, index: number) => {
                return {
                    id: (keyCounter + index).toString(),
                    companyInvoiceNumber: item.invoiceNumber,
                    companyName: item.invoiceName,
                    address: item.invoiceAddress,
                };
            });

            return transformedData;
        } catch (error) {
            showSnackbar(t("InvoiceSearchError"), "error");
            sendCustomTraceLog(user, "Failed to fetch and transform invoice search results: " + error, "error", "ConsistencyCheck/index.tsx");
            return [];
        }
    };

    const handleCheckFile = async (): Promise<void> => {
        setLoading(true);
        try {
            if (!selectedFile) {
                showSnackbar(t("FileNotSelect"), "warning");
                setLoading(false);
                setResetFilePicker(true);
                return;
            }

            setTableData([]);

            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                if (typeof content === 'string') {
                    Papa.parse<RawCsvRow>(content, {
                        header: true,
                        skipEmptyLines: true,
                        complete: async (results) => {
                            const csvData = results.data.map((row) => ({
                                companyInvoiceNumber: row["インボイス番号"],
                                companyName: row["会社名"],
                                address: row["住所"]
                            }));

                            setCsvData(csvData.map((item, index) => ({ ...item, id: index.toString() })))

                            const validatedData = csvData.map((row, index) => {
                                // companyInvoiceNumber Validation  
                                const isValidInvoiceNumber = /^T?\d{13}$/.test(row.companyInvoiceNumber);
                                if (!isValidInvoiceNumber) {
                                    showSnackbar(`${t("Row")}${index + 2}${t("CompanyInvoiceNumberInvalid")}` + row.companyInvoiceNumber, "error");
                                }

                                return {
                                    ...row,
                                    isValidInvoiceNumber,
                                };
                            });

                            const validInvoiceNumbers = validatedData
                                .filter(row => row.isValidInvoiceNumber)
                                .map(row => row.companyInvoiceNumber);

                            const requestPromises = [];
                            let keyCounter = 0;

                            for (let i = 0; i < validInvoiceNumbers.length; i += 10) {
                                const chunk = validInvoiceNumbers.slice(i, i + 10);
                                requestPromises.push(fetchAndTransformInvoiceSearchResults(chunk, keyCounter));
                                keyCounter += chunk.length;
                            }

                            const allTransformedData = (await Promise.all(requestPromises)).flat();

                            setTableData(allTransformedData.map((item, index) => ({ ...item, id: index.toString() })));
                            setApiData(allTransformedData);
                            setLoading(false);
                        }
                    });
                }
            };

            reader.onerror = () => {
                showSnackbar(t("FileReadError"), "error");
                sendCustomTraceLog(user, "Failed to read file: " + reader.error, "error", "ConsistencyCheck/index.tsx");
                setLoading(false);
            };

            reader.readAsText(selectedFile);
            setSelectedFile(null);
            setResetFilePicker(true);
        } catch (error) {
            showSnackbar(t("FileReadError"), "error");
            sendCustomTraceLog(user, "Failed to read file: " + error, "error", "ConsistencyCheck/index.tsx");
            setLoading(false);
            setResetFilePicker(true);
        }
    };

    const handleMerge = (id: string) => {
        setCsvData((prevTableData) => {
            const newData = prevTableData.map((item) => {
                if (item.id === id) {
                    const apiItem = apiData.find((api) => api.companyInvoiceNumber === item.companyInvoiceNumber);
                    return apiItem ? { ...item, ...apiItem } : item;
                }
                return item;
            });
            return newData;
        });
    };

    const checkConsistency = (row: TableDataRow) => {
        const csvRow = csvData.find(csvItem => csvItem.companyInvoiceNumber === row.companyInvoiceNumber);
        if (!csvRow) return false;
        return csvRow.companyName === row.companyName && csvRow.address === row.address;
    };

    const handleReset = () => {
        setSelectedFile(null);
        setTableData([]);
        setCsvData([]);
        setApiData([]);
        setResetFilePicker(true);
    };

    useEffect(() => {  
        if (resetFilePicker) {  
            setResetFilePicker(false);
        }  
    }, [resetFilePicker]);

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <FilePicker onFileSelected={handleFileSelected} loading={loading} resetFlag={resetFilePicker}/>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <CheckButton onCheck={handleCheckFile} loading={loading} />
                <Box sx={{ width: "8px" }}></Box>
                <ResetButton onReset={handleReset} loading={loading} />
                <Box sx={{ width: "8px" }}></Box>
                <SaveButton tableData={csvData} loading={loading} />
            </Box>
            <Box sx={{ flexGrow: 1, overflow: "auto", paddingTop: 2 }}>
                <DataTable dataSource={tableData} handleMerge={handleMerge} checkConsistency={checkConsistency} />
            </Box>
        </Box>
    );
};