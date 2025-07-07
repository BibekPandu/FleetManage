import React from "react";
import "../common/Table.css";
import Badge from "../common/Badge";

const StaffList = ({ staff, onEdit, onDelete, canModify }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            {canModify && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {staff.map((staffMember) => (
            <tr key={staffMember.id}>
              <td>{staffMember.id}</td>
              <td>{staffMember.name}</td>
              <td>{staffMember.role}</td>
              <td>
                <Badge type={staffMember.status}>{staffMember.status}</Badge>
              </td>
              {canModify && (
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(staffMember)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(staffMember)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffList;
