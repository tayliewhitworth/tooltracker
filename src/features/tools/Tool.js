import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useGetToolsQuery } from "./toolsApiSlice";
import { memo } from 'react'

import { IconButton } from "@mui/material";

const Tool = ({ toolId }) => {
  
  const { tool } = useGetToolsQuery('toolsList', {
    selectFromResult: ({ data }) => ({
      tool: data?.entities[toolId]
    })
  })

  const navigate = useNavigate();

  if (tool) {
    const handleEdit = () => navigate(`/dash/tools/${toolId}`);

    return (
      <tr className="table_row tool tr">
        <td className="table_cell tool_name">{tool.toolname}</td>
        <td className="table_cell tool_image">
          <img className="tool_cell--image" src={tool.toolimage} alt="tool" />
        </td>
        {tool.checkedOut ? <td className="table_cell tool_status tool_status--checkedOut">Tool Checked Out</td> : <td className="table_cell tool_status tool_status--checkedIn">Tool Checked In</td>}

        <td className="table_cell">
          <IconButton className="icon-btn table_btn" onClick={handleEdit}>
            <FaRegEdit />
          </IconButton>
        </td>
      </tr>
    );
  } else return null
};

const memoizedTool = memo(Tool)
export default memoizedTool
