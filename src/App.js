import "./App.css";
import Button from "./Components/Button";
import { useState } from "react";
import evaluate from "evaluator.js";

const btns = [
  { id: "clear", type: "AC", value: "AC" },
  { id: "divide", type: "divide", value: "/" },
  { id: "multiply", type: "x", value: "x" },
  { id: "seven", type: "number", value: "7" },
  { id: "eight", type: "number", value: "8" },
  { id: "nine", type: "number", value: "9" },
  { id: "subtract", type: "subtract", value: "-" },
  { id: "four", type: "number", value: "4" },
  { id: "five", type: "number", value: "5" },
  { id: "six", type: "number", value: "6" },
  { id: "add", type: "add", value: "+" },
  { id: "one", type: "number", value: "1" },
  { id: "two", type: "number", value: "2" },
  { id: "three", type: "number", value: "3" },
  { id: "zero", type: "number", value: "0" },
  { id: "decimal", type: "number", value: "." },
  { id: "equals", type: "equals", value: "=" },
];

function App() {
  const [formula, setFormula] = useState("");
  const [output, setOutput] = useState(0);
  const [lastType, setLastType] = useState("initialized");
  const [result, setResult] = useState(false);
  const [negative, setNegative] = useState(false);

  const handleNumber = (e) => {
    setNegative(false);
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
    if (operator === "x") {
      operator = "*";
    }

    // handle negative numbers
    if (lastType === "operator" && operator === "-") {
      setOutput(operator);
      setFormula((formula) => formula + operator);
      setLastType("negative");
      return;
    } else if (
      lastType === "negative" &&
      operator !== "AC" &&
      operator !== "="
    ) {
      setOutput(operator);
      setFormula(formula.slice(0, -2) + operator);
      setLastType("operator");
      return;
    }

    // handle basic operators (/ * - + AC EQUALS)
    if (operator === "AC") {
      // clear
      setOutput(0);
      setFormula("");
      setLastType("initialized");
    } else if (operator === "=") {
      // evaluate
      let evaluation;

      if (formula === "") {
        return;
      }

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
