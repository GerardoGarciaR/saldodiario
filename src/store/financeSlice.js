import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

const getUserId = (state) => state.auth.session?.user?.id;

export const loadFinanceData = createAsyncThunk(
  'finance/loadFinanceData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState());
      if (!userId) throw new Error('No hay una sesión activa.');

      const [periodsResult, movementsResult] = await Promise.all([
        supabase
          .from('periodos_financieros')
          .select('*')
          .eq('user_id', userId)
          .order('fecha_inicio', { ascending: false })
          .order('created_at', { ascending: false }),
        supabase
          .from('movimientos_financieros')
          .select('*')
          .eq('user_id', userId)
          .order('fecha', { ascending: true })
          .order('created_at', { ascending: true }),
      ]);

      if (periodsResult.error) throw periodsResult.error;
      if (movementsResult.error) throw movementsResult.error;

      return {
        periods: periodsResult.data || [],
        movements: movementsResult.data || [],
      };
    } catch (error) {
      return rejectWithValue(error.message || 'No fue posible cargar la información.');
    }
  }
);

export const createPeriod = createAsyncThunk(
  'finance/createPeriod',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState());
      if (!userId) throw new Error('No hay una sesión activa.');

      const { data, error } = await supabase
        .from('periodos_financieros')
        .insert({
          user_id: userId,
          concepto: payload.concepto.trim(),
          ingreso_inicial: Number(payload.ingreso_inicial),
          fecha_inicio: payload.fecha_inicio,
          fecha_fin: payload.fecha_fin,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'No fue posible crear el período.');
    }
  }
);

export const createMovement = createAsyncThunk(
  'finance/createMovement',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState());
      if (!userId) throw new Error('No hay una sesión activa.');

      const { data, error } = await supabase
        .from('movimientos_financieros')
        .insert({
          user_id: userId,
          periodo_id: payload.periodo_id,
          tipo: payload.tipo,
          importe: Number(payload.importe),
          concepto: payload.concepto.trim(),
          fecha: payload.fecha,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'No fue posible registrar el movimiento.');
    }
  }
);

export const deleteMovement = createAsyncThunk(
  'finance/deleteMovement',
  async (movementId, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('movimientos_financieros')
        .delete()
        .eq('id', movementId);

      if (error) throw error;
      return movementId;
    } catch (error) {
      return rejectWithValue(error.message || 'No fue posible eliminar el movimiento.');
    }
  }
);

export const deletePeriod = createAsyncThunk(
  'finance/deletePeriod',
  async (periodId, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('periodos_financieros')
        .delete()
        .eq('id', periodId);

      if (error) throw error;
      return periodId;
    } catch (error) {
      return rejectWithValue(error.message || 'No fue posible eliminar el período.');
    }
  }
);

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    periods: [],
    movements: [],
    selectedPeriodId: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    selectPeriod(state, action) {
      state.selectedPeriodId = action.payload;
    },
    clearFinance(state) {
      state.periods = [];
      state.movements = [];
      state.selectedPeriodId = null;
      state.loading = false;
      state.saving = false;
      state.error = null;
    },
    clearFinanceError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFinanceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFinanceData.fulfilled, (state, action) => {
        state.loading = false;
        state.periods = action.payload.periods;
        state.movements = action.payload.movements;

        const stillExists = state.periods.some((p) => p.id === state.selectedPeriodId);
        if (!stillExists) {
          state.selectedPeriodId = state.periods[0]?.id || null;
        }
      })
      .addCase(loadFinanceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'No fue posible cargar la información.';
      })
      .addCase(createPeriod.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createPeriod.fulfilled, (state, action) => {
        state.saving = false;
        state.periods.unshift(action.payload);
        state.selectedPeriodId = action.payload.id;
      })
      .addCase(createPeriod.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(createMovement.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createMovement.fulfilled, (state, action) => {
        state.saving = false;
        state.movements.push(action.payload);
        state.movements.sort((a, b) => {
          const dateOrder = String(a.fecha).localeCompare(String(b.fecha));
          if (dateOrder !== 0) return dateOrder;
          return String(a.created_at).localeCompare(String(b.created_at));
        });
      })
      .addCase(createMovement.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(deleteMovement.pending, (state) => {
        state.saving = true;
      })
      .addCase(deleteMovement.fulfilled, (state, action) => {
        state.saving = false;
        state.movements = state.movements.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMovement.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(deletePeriod.pending, (state) => {
        state.saving = true;
      })
      .addCase(deletePeriod.fulfilled, (state, action) => {
        state.saving = false;
        state.periods = state.periods.filter((p) => p.id !== action.payload);
        state.movements = state.movements.filter((m) => m.periodo_id !== action.payload);
        if (state.selectedPeriodId === action.payload) {
          state.selectedPeriodId = state.periods[0]?.id || null;
        }
      })
      .addCase(deletePeriod.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { selectPeriod, clearFinance, clearFinanceError } = financeSlice.actions;
export default financeSlice.reducer;
