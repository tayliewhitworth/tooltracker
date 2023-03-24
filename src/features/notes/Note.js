import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useGetNotesQuery } from "./notesApiSlice";
import { memo } from "react";

import { IconButton } from "@mui/material";

const Note = ({ noteId }) => {

  const { note } = useGetNotesQuery('notesList', {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId]
    })
  })

  const navigate = useNavigate();

  if (note) {
    const handleEdit = () => navigate(`/dash/notes/${noteId}`);
    const created = new Date(note.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });
    const updated = new Date(note.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    return (
      <tr className="table_row note tr">
        <td className="table_cell note_status">
          {note.checkedOut ? (
            <span className="note_status--checkedOut">Tool Checked Out</span>
          ) : (
            <span className="note_status--checkedIn">Tool Checked In</span>
          )}
        </td>
        <td className="table_cell note_created">{created}</td>
        <td className="table_cell note_updated">{updated}</td>
        <td className="table_cell note_title">{note.title}</td>
        <td className="table_cell note_username">{note.username}</td>

        <td className="table_cell">
          <IconButton className="table_btn" onClick={handleEdit}>
            <FaRegEdit />
          </IconButton>
        </td>
      </tr>
    );
  } else return null;
};

const memoizedNote = memo(Note)

export default memoizedNote;
