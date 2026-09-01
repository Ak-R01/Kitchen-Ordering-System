import { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';

const TableContext = createContext(null);

export function TableProvider({ children }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');

  const [tableNumber, setTableNumber] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | invalid

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    let cancelled = false;
    api
      .getTableInfo(token)
      .then((info) => {
        if (!cancelled) {
          setTableNumber(info.tableNumber);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('invalid');
      });

    return () => { cancelled = true; };
  }, [token]);

  return (
    <TableContext.Provider value={{ token, tableNumber, status }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTable must be used within TableProvider');
  return ctx;
}
