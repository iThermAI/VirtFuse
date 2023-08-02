import React, { useState } from 'react';
import "./test.scss";

function DrawerNavber() {
  const [flexValue1, setFlexValue1] = useState(1);
  const [flexValue2, setFlexValue2] = useState(11);

  function handleButtonClick() {
    setFlexValue1(flexValue1 === 1 ? 2 : 1);
    setFlexValue2(flexValue2 === 11 ? 10 : 11);
  }

  return (
    <>
    <button onClick={handleButtonClick}>Change Flex Value</button>
    <div className="container">
      <div className="flex1" style={{ flex: flexValue1 }}>Flex 1</div>
      <div className="flex2" style={{ flex: flexValue2 }}>Flex 2</div>
      </div>
      </>
  );
}

export default DrawerNavber;