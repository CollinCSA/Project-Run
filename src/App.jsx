
import React, { useState } from 'react';
import { structureData } from './structureData';
import { pricingData } from './pricingData';

const App = () => {
  const [structureType, setStructureType] = useState('Type 1');
  const [vendor, setVendor] = useState('Wesco');

  const getMaterials = () => {
    return structureData
      .map(row => {
        const qty = row[structureType];
        if (!qty || qty.trim() === "") return null;

        const pricing = pricingData.find(p => p.Part === row.Part);
        const pricePerUnit = pricing ? parseFloat(pricing[vendor]) : null;

        // Try to parse numeric quantity for cost calculation
        const numericQty = parseFloat(qty);
        const total = (!isNaN(numericQty) && pricePerUnit)
          ? numericQty * pricePerUnit
          : null;

        return {
          part: row.Part,
          quantity: qty,
          unitPrice: pricePerUnit,
          total: total
        };
      })
      .filter(Boolean);
  };

  const materials = getMaterials();
  const totalCost = materials.reduce((sum, m) => sum + (m.total || 0), 0);

  const vendors = Object.keys(pricingData[0] || {}).filter(v => v !== 'Part');

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Material Takeoff</h1>
      <div style={{ margin: '1rem 0' }}>
        <label>Structure Type: </label>
        <select value={structureType} onChange={e => setStructureType(e.target.value)}>
          <option value="Type 1">Type 1</option>
          <option value="Type 2">Type 2</option>
        </select>
        <label style={{ marginLeft: '1rem' }}>Vendor: </label>
        <select value={vendor} onChange={e => setVendor(e.target.value)}>
          {vendors.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>
      <h2>Material Takeoff</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Material</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((mat, idx) => (
            <tr key={idx}>
              <td>{mat.part}</td>
              <td>{mat.quantity}</td>
              <td>{mat.unitPrice ? `$${mat.unitPrice.toFixed(2)}` : 'N/A'}</td>
              <td>{mat.total ? `$${mat.total.toFixed(2)}` : 'N/A'}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3"><strong>Total</strong></td>
            <td><strong>${totalCost.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default App;
