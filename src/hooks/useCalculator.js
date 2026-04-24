import { useState, useEffect, useCallback } from 'react';
import { reservationApi } from '../api/reservationApi';

export function useCalculator(startDate, endDate) {
  const [calc,    setCalc]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const calculate = useCallback(async () => {
    if (!startDate || !endDate) { setCalc(null); return; }

    setLoading(true);
    setError('');
    try {
      const res = await reservationApi.calculate(startDate, endDate);
      setCalc(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de calcul');
      setCalc(null);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => { calculate(); }, [calculate]);

  return { calc, loading, error };
}