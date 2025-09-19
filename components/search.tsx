'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useDocsSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { BOOK_NAMES } from '@/lib/constants';
import { cn } from '@/lib/cn';

const getCurrentTag = (pathname: string) => {
  return pathname.split('/')?.[1];
};

export default function CustomSearchDialog(props: SharedProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<string | undefined>(getCurrentTag(pathname));
  const { search, setSearch, query } = useDocsSearch({
    type: 'fetch',
    delayMs: 1000,
    tag,
  });

  useEffect(() => {
    setTag(getCurrentTag(pathname));
  }, [pathname]);

  const bookToSearch = Object.entries(BOOK_NAMES).find(([slug]) => slug === tag)?.[1];

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
        <SearchDialogFooter className="flex flex-row">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={buttonVariants({
                size: 'sm',
                color: 'ghost',
                className: '-m-1.5 me-auto',
              })}
            >
              <span className="text-fd-muted-foreground/80 me-2">搜索范围：</span>
              {bookToSearch != null ? `《${bookToSearch}》` : '全部书籍'}
              {/*<ChevronDown className="size-3.5 text-fd-muted-foreground" />*/}
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-1 gap-1" align="start">
              {Object.entries(BOOK_NAMES).map(([slug, name], i) => {
                const isSelected = slug === tag;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setTag(slug);
                      setOpen(false);
                    }}
                    className={cn(
                      'rounded-lg text-start px-2 py-1.5',
                      isSelected
                        ? 'text-fd-primary bg-fd-primary/10'
                        : 'hover:text-fd-accent-foreground hover:bg-fd-accent',
                    )}
                  >
                    <p className="font-medium mb-0.5">{name}</p>
                    {/*<p className="text-xs opacity-70">{item.description}</p>*/}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
          <a
            href="https://orama.com"
            rel="noreferrer noopener"
            className="text-xs text-nowrap text-fd-muted-foreground"
          >
            Powered by Orama
          </a>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
