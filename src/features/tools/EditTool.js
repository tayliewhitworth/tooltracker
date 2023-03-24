import { useParams } from "react-router-dom";

import { useGetToolsQuery } from "./toolsApiSlice";
import { PulseLoader } from 'react-spinners'

import EditToolForm from "./EditToolForm";

const EditTool = () => {
  const { id } = useParams();

  const { tool } = useGetToolsQuery('toolsList', {
    selectFromResult: ({ data }) => ({
      tool: data?.entities[id]
    })
  })

  if (!tool) return <PulseLoader color={"#868dfb"} />

  const content = <EditToolForm tool={tool} /> 

  return content;
};

export default EditTool;
