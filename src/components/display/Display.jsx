import React, {useState, useEffect} from 'react';
import "./display.css";
function Display(props) {
  const [distanceAndFlame, setdistanceAndFlame] = useState(0);

  useEffect(() => {
    setdistanceAndFlame(props.type); 
  }, [props.type]);
  return (
    <div className="display">
      <div className='display-value'>{distanceAndFlame}</div>
    </div>
  )
  
}

export default Display;
