'use client';
import React from 'react';
import List from './List';

export default function MainListMenu2() {
  return (
    <List>
      <List.Nav>
        <List.Item name="거래량" />
        <List.Item name="급등" />
        <List.Item name="급락" />
      </List.Nav>
    </List>
  );
}
