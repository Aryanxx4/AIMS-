import React from "react";

interface RequestListProps {
  columns: { header: string; accessor: string; className?: string }[];
  data: any[];
  caption: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  footerData: string[];
}

export const RequestList: React.FC<RequestListProps> = ({
  columns,
  data,
  caption,
  onApprove,
  onReject,
  footerData,
}) => {
  return (
    <div className="overflow-x-auto border rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <caption className="text-lg font-semibold text-center p-4">{caption}</caption>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.className || ""
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className={`px-6 py-4 whitespace-nowrap ${
                    column.className || ""
                  }`}
                >
                  {column.accessor === "action" ? (
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                        onClick={() => onApprove(row.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => onReject(row.id)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    row[column.accessor] || "N/A"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            {footerData.map((footer, index) => (
              <td
                key={index}
                colSpan={columns.length}
                className={`px-6 py-3 text-right text-xs font-medium text-gray-500 ${
                  index === footerData.length - 1 ? "font-semibold" : ""
                }`}
              >
                {footer}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
