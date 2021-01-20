import React from "react";
import DeleteIcon from '@material-ui/icons/Delete';

export default function Note(props){
  return(
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={()=>{
        props.onDelete(props.id);
      }}><DeleteIcon /></button>
    </div>
  );
}