'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDocsSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';

export default function CustomSearchDialog(props: SharedProps) {
  const { locale } = useI18n();
  const [localSearch, setLocalSearch] = useState('');
  const { setSearch, query } = useDocsSearch({
    type: 'fetch',
    locale,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 700);

    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
  }, []);

  return (
    <SearchDialog
      search={localSearch}
      onSearchChange={handleSearchChange}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
