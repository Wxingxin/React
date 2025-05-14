import type { CSSProperties } from "react";

const Profile = () => {
  return (
    <div style={style}>
      <h2>Profile Pages</h2>
    </div>
  )
}

const style: CSSProperties = {
  border: "2px solid red",
  width: "300px",
  height: "300px",
  float: "left",
};

export default Profile
