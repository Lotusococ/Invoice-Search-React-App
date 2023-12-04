import React, { useState } from 'react';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { Container, Box, Paper } from '@mui/material';    

import { Header } from '../components/Header/Header';
import { DrawerMenu } from '../components/Drawer/Drawer';
import { SearchBox } from '../components/SearchBox/SearchBox';
import { SearchButton } from '../components/SearchButton/SearchButton';
import { SaveButton } from '../components/SaveButton/SaveButton';
import DataTable from '../components/Table/Table';
import { requestInvoiceSearch } from '../interface/requestInvoiceSearch';
import { DataType } from '../Types/DataType';

export const MainPage: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchValues, setSearchValues] = useState<string[]>(Array(10).fill(''));  
    const [loading, setLoading] = useState(false);
    const [errorIndices, setErrorIndices] = useState<number[]>([]);
    const [tableData, setTableData] = useState<DataType[]>([]);
    const [keyCounter, setKeyCounter] = useState(1);

    const { t } = useTranslation();

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const handleSearch = async (searchValues: string[]) => {
        if (errorIndices.length > 0) {
            notification.error({
                message: t('InvalidInputTitle'),
                description: t('InvalidInputDescription'),
            });
            return;
        }
        const validSearchValues = searchValues.filter(value => value).map(value => "T" + value);

        setLoading(true);
        setSearchValues(searchValues);
        let requestInvoiceResult = await requestInvoiceSearch(validSearchValues);
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
        setSearchValues(Array(10).fill(''));
    };

    return (  
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>  
            <Header onDrawerOpen={handleDrawerOpen} />  
            <DrawerMenu visible={isDrawerOpen} onClose={handleDrawerClose} />  
            <Container maxWidth={false} sx={{ maxWidth: '1920px', flex: '1 0 auto', py: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>  
                <SearchBox loading={loading} searchValues={searchValues} onChange={setSearchValues} onError={setErrorIndices} />    
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', width: '100%' }}>  
                    <SearchButton onClick={handleSearch} loading={loading} searchValues={searchValues} />  
                    <Box sx={{ width: '8px' }}></Box>  
                    <SaveButton tableData={tableData} />  
                </Box>  
                <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', paddingTop: 2 }}>  
                    <DataTable searchValues={searchValues} dataSource={tableData} setTableData={setTableData} />  
                </Box>  
            </Container>  
        </Box>  
    );  
};