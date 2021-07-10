import "../style/Calculator.scss";
import bottoms from "../services/bottoms.json";
import Display from "./Display.jsx";
import React, { useEffect, useState } from "react";

function Calculator() {
  const [currentValue, setCurrentValue] = useState("");
  const [prevVal, setPrevVal] = useState(0);
  const [formula, setFormula] = useState("");
  const [currentSing, setCurrentSing] = useState("pos");
  const [cadEval, setCadEval] = useState("");
  const [prevValDigMax, setPrevValDigMax] = useState(0);
  const [inizialize, setInizialize] = useState(false);
  const [control, setControl] = useState(false);
  const [controlDot, setControlDot] = useState(false);
  let bottom = bottoms.bottom.map((current, i) => {
    return (
      <buttom
        onClick={onClickButtoms}
        translate="no"
        value={current.value}
        id={current.id}
        className={`colors-${i}`}
        style={
          current.value == "equal"
            ? { gridColumn: current.style, gridRow: "4/6" }
            : { gridColumn: current.style }
        }
      >
        {current.keyTrigger}
      </buttom>
    );
  });
  function maxDigitWarning() {
    setPrevValDigMax(parseFloat(currentValue));
    setCurrentValue("Digit Limit Met");
    setTimeout(() => setCurrentValue(prevValDigMax.toString()), 1000);
  }
  function calculate() {
    return eval(formula);
  }
  function precise(value) {
    return parseFloat(value).toPrecision();
  }
  function handlerCalculate() {
    //no calcula si encuentra alguno de estos caracteres ya que entraria en conflicto con el calculo o si encuentra un = en el string
    if (/[\-\*\+\./]/.test(formula[formula.length - 1]) || /=/.test(formula))
      return;
    let result = calculate();
    setFormula(formula + "=".concat(precise(result)));
    setCurrentValue(precise(result));
    setPrevVal(result);
  }
  function onClickButtoms(e) {
    const valueButtom = e.target.innerText;

    const expReg = /\+|x|\/|\-|=/g;
    //si AC inizialize
    if (/AC/g.test(valueButtom)) {
      setCurrentValue("");
      setFormula("");
      setCurrentSing("pos");
      setCurrentValue("0");
      setPrevVal(0);
      setCadEval("");
      setInizialize(true);
      setControl(false);
      return;
    }
    if (control == false && valueButtom == "0") {
      console.log("es");
      return;
    }
    if (/\d\.\d/.test(currentValue) && valueButtom == ".") {
      return;
    }
    if (!expReg.test(valueButtom)) {
      //is number

      // if (/^0+/.test(currentValue) && currentValue.length + 1 >= 2) {
      //   console.log("entro");
      //   return;
      // }
      if (currentSing == "=" && formula[formula.length - 1] != ".") {
        //si es igual y presiona number ocurre un AC con valor actualizado
        setCurrentValue(valueButtom);
        setFormula(valueButtom);
        setCurrentSing("pos");
        setPrevVal(0);
        setCadEval(valueButtom);
        return;
      }

      setCurrentValue(
        /\+|\-|\/|x/g.test(currentValue)
          ? valueButtom
          : inizialize == true
          ? valueButtom
          : currentValue.concat(valueButtom)
      );
      setFormula(formula.concat(valueButtom));
      setControl(true);
    } else {
      //is operator
      handlerFormula(valueButtom, " ");
    }
    setInizialize(false);
  }
  useEffect(() => {
    checkFormat();
  });
  function checkFormat() {
    if (currentValue.length + 1 > 22) {
      maxDigitWarning();
      setCurrentSing("pos");
      return;
    }
    // checkFormat se encarga de verificar que el formato matematico se encuentre correcto
    const general = /[\+\-x\/]/;
    const caseEspecial = /[\+\/\*]\-+/;
    const caseEspecialCheckOblig = /^[\+\/\*]\-+$/;
    const caseZerosInput = /^0+|[\+\-\*\/]0+/;
    const caseZeroBeforeNum = /0[123456789]/g;
    const caseDoit = /\.+/;
    //conditions no permitions
    const expReg_sum = /\+[\+\*\/\=]+/g;
    const expReg_res = /\-[\+\*\/\=]+/g;
    const expReg_mul = /\*[\+\*\/\=]+/g;
    const expReg_div = /\/[\+\*\/\=]+/g;
    const expReg_equal = /=/g;

    //case doit
    if (caseDoit.test(formula)) {
      setFormula(formula.replace(caseDoit, "."));
      setCurrentValue(currentValue.replace(caseDoit, "."));
      return;
    }
    //case zeros
    console.log(
      caseZerosInput.test(formula.slice(0)),
      caseZerosInput.test(currentValue.slice(0))
    );
    if (
      caseZerosInput.test(formula.slice(0)) ||
      caseZerosInput.test(currentValue.slice(0))
    ) {
      setFormula(
        formula.replace(
          caseZerosInput,
          currentSing != "pos" ? currentSing.replace(/x/, "*") : "" + "0"
        )
      );
      setCurrentValue(currentValue.replace(caseZerosInput, "0"));
    }
    if (caseZeroBeforeNum.test(currentValue)) {
      console.log("caseZeroBeforeNum");
      setFormula(formula.replace(caseZeroBeforeNum, currentValue.slice(1)));
      setCurrentValue(
        currentValue.replace(caseZeroBeforeNum, currentValue.slice(1))
      );
    }
    //case equal
    if (expReg_equal.test(formula) && general.test(currentSing)) {
      setFormula(prevVal.toString().concat(currentSing).replace(/x/, "*"));
      setCurrentValue(currentSing);
      return;
    }
    //case with sum
    if (expReg_sum.test(formula)) {
      //si es num me salgo
      if (currentSing == "pos") return;
      //caso en que cumpla el caso especial (+-) y si ya se encuentra disponible (+-) y quiere cambiar de valor permitirlo
      if (
        caseEspecial.test(formula) &&
        caseEspecialCheckOblig.test(formula.slice(formula.length - 2))
      ) {
        setFormula(formula.replace(caseEspecial, "+-"));
        return;
      }
      setFormula(formula.replace(expReg_sum, currentSing.replace(/x/, "*")));
      return;
    }
    //case with rest
    if (expReg_res.test(formula)) {
      if (currentSing == "pos") return;
      setFormula(formula.replace(expReg_res, currentSing.replace(/x/, "*")));
      return;
    }
    //case with division
    if (expReg_div.test(formula)) {
      if (currentSing == "pos") return;
      if (
        caseEspecial.test(formula) &&
        caseEspecialCheckOblig.test(formula.slice(formula.length - 2))
      ) {
        setFormula(formula.replace(caseEspecial, "/-"));
        return;
      }
      setFormula(formula.replace(expReg_div, currentSing.replace(/x/, "*")));
      return;
    }
    //case with mult
    if (expReg_mul.test(formula)) {
      if (currentSing == "pos") return;
      if (
        caseEspecial.test(formula) &&
        caseEspecialCheckOblig.test(formula.slice(formula.length - 2))
      ) {
        setFormula(formula.replace(caseEspecial, "*-"));
        return;
      }
      setFormula(formula.replace(expReg_mul, currentSing.replace(/x/, "*")));
      return;
    }
  }
  function handlerConcatDisplay(value, spacing) {
    setCadEval(cadEval.concat(spacing + value.replace(/x/g, "*") + spacing));
    setFormula(formula.concat(value.replace(/x/g, "*")));
    setCurrentValue(value);
  }
  function handlerFormula(value, spacing = "") {
    //if is '=' calcule
    setCurrentSing(value);
    if (/=/g.test(value)) {
      handlerCalculate();
      return;
    }
    handlerConcatDisplay(value, spacing);
  }
  return (
    <div className="calculator" style={{ position: "relative" }}>
      <Display currentValue={currentValue} formula={formula} />
      <div className="calculator-container">{bottom}</div>
    </div>
  );
}

export default Calculator;
