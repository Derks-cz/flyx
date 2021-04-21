import React from "react"
import { Link } from "react-router-dom"

const FriendList = ({ user }) => {
  return (
    <div className="friend_list">
      <h3>Список друзей</h3>
      <div>
        <ul>
          {user.friends
            ? user.friends.map((obj, i) => (
                <li className="friend" key={i}>
                  <Link to={`/profile/${obj._id}`}>
                    {obj.name} {obj.surname}
                  </Link>
                </li>
              ))
            : <li>Список друзей пуст</li>}
        </ul>
      </div>
    </div>
  )
}

export default React.memo(FriendList)