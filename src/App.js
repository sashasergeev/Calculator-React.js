import "./App.css";
import Button from "./Components/Button";
import { useState } from "react";
import evaluate from "evaluator.js";

const btns = [
  { id: "clear", type: "AC", value: "AC" },
  { id: "divide", type: "divide", value: "/" },
  { id: "multiply", type: "x", value: "x" },
  { id: "7", type: "number", value: "7" },
  { id: "8", type: "number", value: "8" },
  { id: "9", type: "number", value: "9" },
  { id: "subtract", type: "subtract", value: "-" },
  { id: "4", type: "number", value: "4" },
  { id: "5", type: "number", value: "5" },
  { id: "6", type: "number", value: "6" },
  { id: "add", type: "add", value: "+" },
  { id: "1", type: "number", value: "1" },
  { id: "2", type: "number", value: "2" },
  { id: "3", type: "number", value: "3" },
  { id: "zero", type: "number", value: "0" },
  { id: "decimal", type: "number", value: "." },
  { id: "equals", type: "equals", value: "=" },
];

function App() {
  const [formula, setFormula] = useState("");
  const [output, setOutput] = useState(0);
  const [lastType, setLastType] = useState("initialized");
  const [result, setResult] = useState(false);

  const handleNumber = (e) => {
    let number = e.target.value;
    if (number === "." && output.toString().includes(".")) {
      return;
    }

    if (lastType !== "number") {
      setOutput("");
    }
    if (lastType === "Evaluated") {
      setResult(false);
      setOutput("");
      setFormula("");
    }
    if (output === "0" && number === "0") {
      return;
    } else if (output === "0" && number !== "0" && number !== ".") {
      setOutput(number);
      setFormula((formula) => formula.slice(0, -1) + number);
    } else {
      setOutput((output) => output + number);
      setFormula((formula) => formula + number);
      setLastType("number");
    }
  };

  const handleOperator = (e) => {
    let operator = e.target.value;

    if (operator === "AC") {
      // clear
      setOutput(0);
      setFormula("");
      setLastType("initialized");
    } else if (operator === "=") {
      // evaluate
      let evaluation;
      if (lastType === "operator") {
        evaluation = evaluate(formula.slice(0, -1));
        setFormula(`${formula.slice(0, -1)} = ${evaluation}`);
      } else {
        evaluation = evaluate(formula);
        setFormula(`${formula}=${evaluation}`);
      }
      setOutput(evaluation);
      setResult(evaluation);
      setLastType("Evaluated");
    } else {
      // case for (/, *, -, +)
      if (operator === "x") {
        operator = "*";
      }
      if (lastType === "operator") {
        setFormula(formula.slice(0, -1));
      }
      setOutput(operator);
      if (lastType === "Evaluated") {
        setFormula(result + operator);
      } else {
        setFormula((formula) => formula + operator);
      }
      setLastType("operator");
    }
  };

  return (
    <div className="Calculator">
      <div className="formulaScreen">{formula}</div>
      <div className="outputField" id="display">
        {output}
      </div>
      <div className="btns">
        {btns.map((e) => (
          <Button
            key={e.id}
            id={e.id}
            type={e.type}
            handler={e.type === "number" ? handleNumber : handleOperator}
            value={e.value}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
