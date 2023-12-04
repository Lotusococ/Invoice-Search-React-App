import React, { useState, useEffect } from 'react';
import { TextField, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

type SearchBoxProps = {
    loading?: boolean;
    searchValues: string[];
    onChange: (values: string[]) => void;
    onError: (errorIndices: number[]) => void;
};

export const SearchBox: React.FC<SearchBoxProps> = ({ loading, searchValues, onChange, onError }) => {
    const [errorIndices, setErrorIndices] = useState<number[]>([]);

    const { t } = useTranslation();

    const handleSearchInputChange = (value: string, index: number) => {
        const newSearchValues = [...searchValues];
        newSearchValues[index] = value;
        onChange(newSearchValues);
    };

    useEffect(() => {
        const newErrorIndices = searchValues.map((value, index) => value && (!/^\d+$/.test(value) || value.length !== 13) ? index : -1).filter(index => index !== -1);
        setErrorIndices(newErrorIndices);
        onError(newErrorIndices);
    }, [searchValues, onError]);

    const renderSearchBoxes = () => {
        const searchBoxes = [];
        for (let i = 0; i < 10; i++) {
            searchBoxes.push(
                <Grid item xs={12} sm={6} key={i}>
                    <TextField
                        error={errorIndices.includes(i)}
                        helperText={errorIndices.includes(i) && "Invalid input"}
                        InputProps={{ startAdornment: "T" }}
                        placeholder={t('InputInvoiceNumber')}
                        size="medium"
                        disabled={loading}
                        onChange={(e) => handleSearchInputChange(e.target.value, i)}
                        value={searchValues[i] || ''}
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
            );
        }
        return searchBoxes;
    };

    return (
        <Grid container spacing={1}>{renderSearchBoxes()}</Grid>
    );
};  
