import React from 'react';
import { decimalIp } from './utils/helper';

export default (props) => (
  <table className="table table-hover">
    <thead>
      <tr>
        <th>Network Address</th>
        <th>Usable Host Range</th>
        <th>Broadcast Address</th>
      </tr>
    </thead>
    <tbody>
      {
        props.allPossible.map(possibleIp => (
          <tr key={possibleIp.netAddress}>
            <td>{possibleIp.netAddress}</td>
            <td>
              {
                decimalIp(possibleIp.usableHost.start) <= decimalIp(possibleIp.usableHost.end) ?
                  `${possibleIp.usableHost.start} - ${possibleIp.usableHost.end}`
                  :
                  'None'
              }
            </td>
            <td>{possibleIp.broadcast}</td>
          </tr>
        ))
      }
    </tbody>
  </table>
)
