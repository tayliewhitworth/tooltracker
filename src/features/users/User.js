import { FaRegEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import { useGetUsersQuery } from './usersApiSlice'
import { memo } from 'react'

import { IconButton } from '@mui/material'

const User = ({ userId }) => {
    
    const { user } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        })
    })

    const navigate = useNavigate()

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`)
        const userRolesString = user.roles.toString().replaceAll(',', ', ')
        const cellStatus = user.active ? '' : 'table_cell--inactive'

        return (
            <tr className='table_row user tr'>
                <td className={`table_cell ${cellStatus}`}>{user.username}</td>
                <td className={`table_cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table_cell ${cellStatus}`}>
                    <IconButton className='table_btn icon-btn' onClick={handleEdit}>
                        <FaRegEdit />
                    </IconButton>
                </td>
            </tr>
        )
    } else return null
}

const memoizedUser = memo(User)
export default memoizedUser