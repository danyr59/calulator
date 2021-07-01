import "../style/Calculator.scss";
import bottoms from "../services/bottoms.json";
function Calculator() {
  let bottom = bottoms.bottom.map((current,i) => {
    console.log(typeof parseInt(current.style));
    return ( 
      <buttom 
        translate="no" 
        value={current.value} 
        id={current.id}
        className={`colors-${i}`}
        style={current.value == "equal" ? {gridColumn: current.style, gridRow: "4/6"} : {gridColumn: current.style} }
      >
        {current.keyTrigger}
      </buttom>
    )
  });
  return (
    <div className="calculator-container">
        {bottom}
    </div>
    );
}

export default Calculator;
