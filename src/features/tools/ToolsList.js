import { useGetToolsQuery } from "./toolsApiSlice";
import Tool from "./Tool";

import { PulseLoader } from 'react-spinners'

const ToolsList = () => {
  const {
    data: tools,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetToolsQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={'#868dfb'} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = tools;

    const tableContent = ids?.length
      ? ids.map((toolId) => <Tool key={toolId} toolId={toolId} />)
      : null;

    content = (
      <table className="table tools-table">
        <thead className="table_head thead">
          <tr className="tr">
            <th scope="col" className="table_th tools-name">
              Tool Name
            </th>
            <th scope="col" className="table_th tools-image">
              Tool Image
            </th>
            <th scope="col" className="table_th tools-status">
              Tool Status
            </th>
            <th scope="col" className="table_th edit-edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody className="tbody">{tableContent}</tbody>
      </table>
    );
  }

  return content;
};
export default ToolsList;
