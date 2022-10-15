import React from "react"
import { ACTIONS } from "../App"

export default function AquaOperationButton({operation, dispatch}) {
    return(
        <button className="aqua-clr" onClick={()=>dispatch({type:ACTIONS.CHOOSE_OPERATION, payload:{operation}})} >{operation}</button>
    )
}