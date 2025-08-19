import { create } from 'zustand';

interface AppointmentsState {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  clearSelection: () => void;
  urgentMode: boolean;
  toggleUrgentMode: () => void;
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

  // Urgent mode state
  urgentMode: false,
  toggleUrgentMode: () => set((state) => ({ urgentMode: !state.urgentMode })),

  // Filter state
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  clearFilters: () => set({ filters: DEFAULT_FILTERS }),
}));