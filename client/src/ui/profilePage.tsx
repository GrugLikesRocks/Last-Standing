
import React from 'react';
import { OutpostList } from './outpostList';
import { PhaserLayer } from '../phaser';

export const ProfilePage: React.FC<{ layer: PhaserLayer }> = ({ layer }) => {
  return <div><OutpostList layer={layer} /></div>;
};

