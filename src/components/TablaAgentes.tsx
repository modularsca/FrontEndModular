import { Badge } from "../components/Badge"
import { useNavigate } from "react-router-dom"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "../components/Table"

interface TableExampleProps {
    data: Array<{
      id: string;
      name: string;
      ip: string;
      status: string;
      passed: number;
      failed: number;
      na: number;
      lastScan: string;
    }>;
  }

export function TableExample({ data }: TableExampleProps) {
  const navigate = useNavigate();

  return (
    <>
    <div className="flex flex-col">
    <div className="flex flex-col items-center mt-5">
      <h3 className="font-semibold text-gray-900 dark:text-gray-50">
        Actividad de Agentes
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Observa el estatus de los agentes en la organizacion.
      </p>
    </div>
      <TableRoot className="mt-8">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Agente</TableHeaderCell>
              <TableHeaderCell>Nombre</TableHeaderCell>
              <TableHeaderCell>Estatus</TableHeaderCell>
              <TableHeaderCell>IP</TableHeaderCell>
              <TableHeaderCell className="text-right">Politicas Pasadas</TableHeaderCell>
              <TableHeaderCell className="text-right">Politicas Fallidas</TableHeaderCell>
              <TableHeaderCell className="text-right">Politicas N/A</TableHeaderCell>
              <TableHeaderCell className="text-right">Ultimo Escaneo</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} onClick={() => navigate(`/details/${item.id}`)} // Redirige al hacer clic
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                <TableCell >{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === "disconnected" ? "warning" : "default"}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.ip}</TableCell>
                <TableCell className="text-right">{item.passed}</TableCell>
                <TableCell className="text-right">{item.failed}</TableCell>
                <TableCell className="text-right">{item.na}</TableCell>
                <TableCell className="text-right">{item.lastScan}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
      </div>
    </>
  )
}