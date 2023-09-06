import React from 'react';
import { BuyRevenantButton } from '../buyRevenantButton';
import { PhaserLayer } from '../../phaser';
import "../../App.css"
import { ClickWrapper } from '../clickWrapper';

export const MainReactComp: React.FC <{ layer: PhaserLayer }> = ({ layer })=> {

    return (
      <div className="main-page-container">
        <div className="middle-image"> </div>
        <div className="bottom-button-container">
            <ClickWrapper>
            <BuyRevenantButton layer={layer} />
            </ClickWrapper>
         </div>
      </div>
    );
  };
  