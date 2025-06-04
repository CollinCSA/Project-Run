
import React, { useState } from 'react';
import { structureData } from './structureData';
import { pricingData } from './pricingData';

const App = () => {
  const [structureType, setStructureType] = useState('type1');
  const [vendor, setVendor] = useState('Wesco');

  const getMaterials = () => {
    return structureData
      .map(row => {
        try {
          const qty = row[structureType];
          if (!qty || qty.toString().trim() === "") return null;

          const qtyStr = qty.toString().trim();
          const isFeet = qtyStr.endsWith("'");
          const displayQty = isFeet
            ? qtyStr.replace("'", "") + " ft"
            : qtyStr + " pcs";

          const pricing = pricingData.find(p => p.Part === row.Part);
          const pricePerUnit = pricing && pricing[vendor] ? parseFloat(pricing[vendor]) : null;

          const numericQty = parseFloat(qtyStr.replace("'", ""));
          const total = (!isNaN(numericQty) && pricePerUnit)
            ? numericQty * pricePerUnit
            : null;

          return {
            part: row.Part,
            quantityDisplay: displayQty,
            unitPrice: pricePerUnit,
            total: total
          };
        } catch (err) {
          console.error('Error processing row:', row, err);
          return null;
        }
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
          <option value="type1">Type 1</option>
          <option value="type2">Type 2</option>
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
              <td>{mat.quantityDisplay}</td>
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
