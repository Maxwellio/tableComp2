/**
 * Публичный API пакета mainComponent для хост-проектов (например burnar).
 * Vite хоста резолвит этот entry и транспилирует TSX из file:-зависимости.
 * AxiosProvider обязателен вокруг BaseTable / DynamicSelect — см. services/api.
 */
export { AxiosProvider, useApi } from './services/api'
export { BaseTable } from './BaseTable/BaseTable'
export { BaseTreeTable } from './BaseTable/BaseTreeTable'
export type { BaseTreeTableProps } from './BaseTable/BaseTreeTable'
export type { TreeLoadMode } from './BaseTable/hooks/useFetchTreeData'
export {
  DynamicDateList,
  DynamicDatePicker,
  DebouncedInput,
  DynamicSelect,
  CheckBox,
} from './input/inputComponents'
export { FILTER_TYPES } from './utils/types'
