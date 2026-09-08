import { useEffect } from 'react';

/** Setzt einen aussagekräftigen, eindeutigen Seitentitel je Ansicht. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title + ' – F13';
  }, [title]);
}
