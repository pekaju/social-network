
export default function SelectUsers({hideSelectUsers, followers, setSelectedUsers, selectedUsers, text}) {
    console.log(followers[0])
    const handleChange = (e) => {
        if (e.target.checked) {
            setSelectedUsers([e.target.id, ...selectedUsers])
        } else {
            const arr = [...selectedUsers]
            arr.splice(arr.indexOf(e.target.id), 1)
            setSelectedUsers(arr)
        }
    }

    return (
        <div>
            <div className="overlay" onClick={hideSelectUsers}></div>
            <div id='select-users-container'>
                {text == "post" && 
                    <h3 style={{textAlign:"center"}}>Select users who can see this post</h3>
                }
                {text == "group" && 
                    <h3 style={{textAlign:"center"}}>Select users to invite</h3>
                }
                <div style={{width:200, margin:"auto"}}>
                    {followers.length === 0 ? <p style={{textAlign:"center", color:"gray", fontStyle:"italic"}}>You have no followers</p>: followers.map(user => <div style={{padding:6}} key={user.Id}>
                    <input type="checkbox" id={user.Id} style={{marginRight:8}} checked={selectedUsers.includes(user.Id)} onChange={handleChange}/>
                    <label htmlFor={user.Id}>{user.first_name} {user.last_name}</label>
                    </div>)}
                    <button id="set-users-btn"
                        onClick={hideSelectUsers}>
                            Set users
                    </button>
                </div>
            </div>
        </div>
    )
}