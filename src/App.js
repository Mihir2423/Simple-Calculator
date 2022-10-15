import React, { useEffect, useReducer, useState } from "react"
import DigitButton from "./Components/DigitButton"
import OperationButton from "./Components/OperationButton"
import AquaOperationButton from "./Components/AquaOperationButton"


//GLOBAL VARIABLE

export const ACTIONS = {
  ADD_DIGIT: 'digit',
  CHOOSE_OPERATION: 'operation',
  CLEAR: 'clear',
  EQUALS: 'equals',
  DELETE: 'delete-digit'
}

// VARIABLE to format operands

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {

  // Only formats integer part of the operand

  maximumFractionDigits: 0
}
)

// function to format integer part of operand

function format_digit(operand) {
  if (operand == null) return

  const [integer, decimal] = operand.split('.')

  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer)
  }
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

//Reducer function to perform all the actions

function reducer(state, { type, payload }) {
  switch (type) {

    // TO add digit 

    case ACTIONS.ADD_DIGIT:

      // Checks if overwrite is true or not 

      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: payload.digit
        }
      }

      // To stop user from typing 0 multiple times 

      if (payload.digit === "0" && state.currentOperand === "0") return state

      // To stop user from typing . multiple times

      if (payload.digit === "." && state.currentOperand.includes(".")) return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }

    // AC button to clear everything from the output section

    case ACTIONS.CLEAR:
      return {}

    // Case when any operation symbol is pressed

    case ACTIONS.CHOOSE_OPERATION:

      // Checks if any operand is present to perform the operation

      if (state.currentOperand == null && state.prevOperand == null) return state

      // To change the mistyped operation button

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      // To pass current operand value to prev operand section when any operation is done

      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.currentOperand,
          currentOperand: null
        }
      }

      // Evaluation if a operation symbol is pressed before typing equals   

      return {
        ...state,
        operation: payload.operation,
        prevOperand: evaluate(state),
        currentOperand: null
      }

    // Equal button case

    case ACTIONS.EQUALS:
      // Simply return state i.e current operand or prev operand if nothing is done
      if (state.currentOperand == null || state.prevOperand == null || state.operation == null) {
        return state
      }

      // Evaluate the current expression

      return {
        ...state,
        prevOperand: null,
        overwrite: true,
        operation: null,
        currentOperand: evaluate(state)
      }

    // Case for delete button

    case ACTIONS.DELETE:

      // When del key is pressed - shows blank screen after equals case operation

      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }

      // Shows the current state if current operand is null

      if (state.currentOperand == null) {
        return state
      }

      // Shows the current state if length current operand is 1 and current operand is set to 1

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null
        }
      }

      // Simply delete the last digit of current Operand

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
  }
}

// Evaluate Function to perform operation between operands

function evaluate({ currentOperand, prevOperand, operation }) {

  // Converts string to nums

  const prev = parseFloat(prevOperand)
  const curr = parseFloat(currentOperand)
  if (isNaN(curr) || isNaN(prev)) {
    return ""
  }
  let evaluation = ""
  switch (operation) {
    case '^':
      evaluation = Math.pow(prev, curr)
      break;
    case '%':
      evaluation = prev % curr
      break;
    case '÷':
      evaluation = prev / curr
      break;
    case '×':
      evaluation = prev * curr
      break;
    case '-':
      evaluation = prev - curr
      break;
    case '+':
      evaluation = prev + curr
      break;
  }

  // Converts num to string

  return evaluation.toString()
}

export default function App() {

  // Use reducer hook

  const [{ currentOperand, prevOperand, operation }, dispatch] = useReducer(reducer, {})

// useState hook to toggle between themes

  const [theme, setTheme] = useState(true)
  function handleTheme() {
    setTheme(!theme)
  }
  useEffect(() => {
  }, [])
  return (
    <div className="calculator-container">
      <div className={theme?"calculator":"calculator off"}>
        <div className={theme?"icons-container":"icons-container off"} >
          <hr className="hr" />
          <div className={theme?"icons":"icons off"}>
            <span onClick={handleTheme} ><i className={!theme ? "sun fa-regular fa-sun" : "sun off fa-regular fa-sun"}></i></span>
            <span onClick={handleTheme} ><i className={theme ? "moon fa-regular fa-moon" : "moon off fa-regular fa-moon"}></i></span>
          </div>
        </div>
        <div className="ouptut">
          <div className={theme?"prev_operand":"prev_operand off"}>{format_digit(prevOperand)} <span className="red-color">
            {operation}
          </span>
          </div>
          <div className={theme?"curr_operand":"curr_operand off"}>{format_digit(currentOperand)}</div>
        </div>
        <div className="button-section">
          <div className={theme?"row row-1":"row off row-1"}>
            <button className="aqua-clr" onClick={() => dispatch({ type: ACTIONS.CLEAR })} >AC</button>
            <AquaOperationButton operation="^" dispatch={dispatch} />
            <AquaOperationButton operation="%" dispatch={dispatch} />
            <AquaOperationButton operation="÷" dispatch={dispatch} />
          </div>
          <div className={theme?"row row-2":"row off row-2"}>
            <DigitButton digit="7" dispatch={dispatch} />
            <DigitButton digit="8" dispatch={dispatch} />
            <DigitButton digit="9" dispatch={dispatch} />
            <OperationButton operation="×" dispatch={dispatch} />
          </div>
          <div className={theme?"row row-3":"row off row-3"}>
            <DigitButton digit="4" dispatch={dispatch} />
            <DigitButton digit="5" dispatch={dispatch} />
            <DigitButton digit="6" dispatch={dispatch} />
            <OperationButton operation="-" dispatch={dispatch} />
          </div>
          <div className={theme?"row row-4":"row off row-4"}>
            <DigitButton digit="1" dispatch={dispatch} />
            <DigitButton digit="2" dispatch={dispatch} />
            <DigitButton digit="3" dispatch={dispatch} />
            <OperationButton operation="+" dispatch={dispatch} />

          </div>
          <div className={theme?"row row-5":"row off row-5"}>
            <button onClick={() => dispatch({ type: ACTIONS.DELETE })} >&#x2421;</button>
            <DigitButton digit="." dispatch={dispatch} />
            <DigitButton digit="0" dispatch={dispatch} />
            <button onClick={() => dispatch({ type: ACTIONS.EQUALS })} >=</button>
          </div>
        </div>
      </div>
    </div>
  )
}