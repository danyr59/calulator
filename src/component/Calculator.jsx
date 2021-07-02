import "../style/Calculator.scss";
import bottoms from "../services/bottoms.json";
import Display from "./Display.jsx";
function Calculator(props) {
  let bottom = bottoms.bottom.map((current, i) => {
    return (
      <buttom
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
  return (
    <div className="calculator"  style={{ position: "relative" }}>
      <Display />
      <div className="calculator-container">{bottom}</div>
    </div>
  );
}

export default Calculator;
