import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// MUI Imports
import { Box } from "@mui/material";

// Components Imports
import { SearchBox } from "src/components/SearchBox/Multi";
import { SearchButton } from "src/components/SearchButton";
import { SaveButton } from "src/components/SaveButton";
import { ResetButton } from "src/components/ResetButton";
import DataTable from "src/components/Table/Search";

// Interface Imports
import { requestInvoiceSearchExcelAPI } from "src/interface/Invoice Search/ExcelAPI/requestInvoiceSearchExcelAPI";
import { useAuth } from 'src/interface/Firebase/requestAuth';

// Types Imports
import { DataType } from "src/Types/Search/DataType";

// Context Imports
import { useSnackbar } from "src/contexts/SnackbarContext";
import { sendCustomTraceLog } from "src/interface/Axiom Log/sendCustomTraceLog";

export const MultiSearch: React.FC = () => {
    const [searchValues, setSearchValues] = useState<string[]>(Array(10).fill(""));  
    const [loading, setLoading] = useState(false);
    const [errorIndices, setErrorIndices] = useState<number[]>([]);
    const [tableData, setTableData] = useState<DataType[]>([]);
    const [keyCounter, setKeyCounter] = useState(1);
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();
    const { user } = useAuth();
    
    const handleSearch = async (searchValues: string[]) => {
        try {
            if (errorIndices.length > 0) {
                showSnackbar(t("InvalidInputDescription"), "error");
                setLoading(false);
                return;
            }

            setLoading(true);
            const validSearchValues = searchValues.filter(value => value).map(value => "T" + value);
    
            setSearchValues(searchValues);
            let requestInvoiceResult = await requestInvoiceSearchExcelAPI(validSearchValues);
            let transformedData = requestInvoiceResult.map((item: any, index: number) => {
                return {
                    id: (keyCounter + index).toString(),  
                    companyInvoiceNumber: item.invoiceNumber,
                    invoiceCheck: item.invoiceCheck,
                    companyName: item.invoiceName,
                    tradeName: item.invoiceTradeName,
                    address: item.invoiceAddress,
                };
            });
            setTableData((prevData) => [...prevData, ...transformedData]);
            setKeyCounter(prevCounter => prevCounter + requestInvoiceResult.length);  
            setLoading(false);
            setSearchValues(Array(10).fill(""));
        } catch (error) {
            sendCustomTraceLog(user, "Failed while handleSearch: " + error, "error", "MultiSearch/index.tsx");
            setLoading(false);
        };
    };

    const handleReset = () => {
        setSearchValues(Array(10).fill(""));
        setTableData([]);
        setKeyCounter(1);
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <SearchBox loading={loading} searchValues={searchValues} onChange={setSearchValues} onError={setErrorIndices} />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <SearchButton onClick={handleSearch} loading={loading} searchValues={searchValues} />
                <Box sx={{ width: "8px" }}></Box>
                <ResetButton onReset={handleReset} loading={loading} />
                <Box sx={{ width: "8px" }}></Box>
                <SaveButton tableData={tableData} loading={loading} />
            </Box>
            <Box sx={{ flexGrow: 1, overflow: "auto", paddingTop: 2 }}>
                <DataTable searchValues={searchValues} dataSource={tableData} setTableData={setTableData} />
            </Box>
        </Box>
    );
};