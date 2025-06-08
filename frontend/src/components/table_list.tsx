import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
type TableColumn = {
  header: string; // Header text
  accessor: string; // Key to access data from rows
  className?: string; // Optional: class for styling
};

type GenericTableProps = {
  columns: TableColumn[]; // Define the table columns
  data: Record<string, any>[]; // Array of objects representing rows
  caption?: string; // Optional: caption for the table
  footerData?: string[]; // Optional: footer values
};

export function TableList({
  columns,
  data,
  caption,
  footerData,
}: GenericTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.accessor} className={column.className}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column.accessor} className={column.className}>
                {row[column.accessor]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      {footerData && (
        <TableFooter>
          <TableRow>
            {footerData.map((footerValue, index) => (
              <TableCell
                key={index}
                className={index === footerData.length - 1 ? "text-right" : ""}
              >
                {footerValue}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
