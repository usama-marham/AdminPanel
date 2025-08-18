import { create } from 'zustand';

interface AppointmentsState {
  // Selection
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  clearSelection: () => void;

  // Filters
  filters: {
    tab: string;
    date?: string;
    doctorId?: string;
    hospitalId?: string;
    status?: string;
    q?: string;
  };
  setFilters: (filters: Partial<AppointmentsState['filters']>) => void;
  clearFilters: () => void;
}

const DEFAULT_FILTERS = {
  tab: 'ALL',
};

export const useAppointmentsStore = create<AppointmentsState>()((set) => ({
  // Selection state
  selectedIds: [],
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),

  // Filters state
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  clearFilters: () => set({ filters: DEFAULT_FILTERS }),
}));