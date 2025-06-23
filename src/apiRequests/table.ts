import http from '@/lib/http'
import {} from '@/schemaValidations/auth.schema'
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType,
} from '@/schemaValidations/table.schema'

const prefix = '/tables'

const tableApiRequest = {
  list: () => http.get<TableListResType>(`${prefix}`),
  add: (body: CreateTableBodyType) =>
    http.post<TableResType>(`${prefix}`, body),
  tableDetail: (id: number) => http.get<TableResType>(`${prefix}/${id}`),
  update: (id: number, body: UpdateTableBodyType) =>
    http.put<TableResType>(`${prefix}/${id}`, body),
  delete: (id: number) => http.delete<TableResType>(`${prefix}/${id}`),
}

export default tableApiRequest
