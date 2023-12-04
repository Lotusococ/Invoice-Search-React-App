import React from 'react';
import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

type SearchButtonProps = {
    onClick: (searchValues: string[]) => Promise<void>;
    loading: boolean;
    searchValues: string[];
};

export const SearchButton: React.FC<SearchButtonProps> = ({ onClick, loading, searchValues }) => {
    const { t } = useTranslation();

    const handleOnClick = () => {
        onClick(searchValues);
    };

    return (
        <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            onClick={handleOnClick}
            disabled={loading}
            sx={{ bgcolor: "#42a5f5", borderRadius: 15, color: "#fff", '&:hover': { bgcolor: "#2196f3" }}}
        >
            {t('Search')}
        </Button>
    );
};  
