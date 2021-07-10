import "../style/Display.scss";

const Display = (props) => {
  return (
    <div className="display">
      <div className="formulaScreen" translate="no">
        {props.formula}
      </div>
      <div id="display" className="outputScreen" translate="no">
        {props.currentValue}
      </div>
    </div>
  );
};
export default Display;
