import NewNoteForm from './NewNoteForm'

import { useGetUsersQuery } from '../users/usersApiSlice'
import { useGetToolsQuery } from '../tools/toolsApiSlice'
import { PulseLoader } from "react-spinners";

const NewNote = () => {
    const { users } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
    })
    const { tools } = useGetToolsQuery('toolsList', {
        selectFromResult: ({ data }) => ({
            tools: data?.ids.map(id => data?.entities[id])
        })
    })

    if (!users?.length || !tools?.length) return <PulseLoader color={"#868dfb"} />

    const content = <NewNoteForm users={users} tools={tools} />

    return content
}
export default NewNote