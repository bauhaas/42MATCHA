import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const ListUsers = ({ title, description, users, onAction, actionType, isLoading }) => {
  return (
    <>
      <div className='max-w-3xl p-4 text-white rounded-lg bg-chess-dark'>
        <span className='font-bold'>{title}</span>
        <p className='py-2 text-sm break-words'>
          {description}
        </p>
        <div className="pt-2">
          {
            isLoading ?
            Array(3).fill().map((_, i) => (
              <div key={i}>
                <Skeleton variant="text" className='bg-chess-placeholder' />
              </div>
            ))
            :
            users.length > 0 ?
              <table className="w-full text-left text-white">
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="text-xs border-b border-chess-bar">
                      <td>
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="text-right">
                        <button onClick={(event) => onAction(event, user.id)}>{actionType}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              :
              <p className='text-sm'>No users to list</p>
          }
        </div>
      </div>
    </>
  );
}

export default ListUsers;