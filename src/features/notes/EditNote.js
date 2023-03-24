import React from 'react'
import { useParams } from 'react-router-dom'

import EditNoteForm from './EditNoteForm'

import { useGetNotesQuery } from './notesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import { useGetToolsQuery } from '../tools/toolsApiSlice'
import useAuth from '../../hooks/useAuth'
import { PulseLoader } from 'react-spinners'

const EditNote = () => {
  const { id } = useParams()

  const { username, isManager, isAdmin } = useAuth()

  const { note } = useGetNotesQuery('notesList', {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id]
    })
  })

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

  if (!note || !users?.length || !tools?.length) return <PulseLoader color={"#868dfb"} />

  if (!isManager && !isAdmin) {
    if (note.username !== username) {
      return <p className='errmsg'>No access</p>
    }
  }

  const content = <EditNoteForm note={note} users={users} tools={tools} /> 

  return content
}

export default EditNote